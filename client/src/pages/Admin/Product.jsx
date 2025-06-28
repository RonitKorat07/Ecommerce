import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ProductForm from '../../components/ProductForm';
import ProductCard from '../../components/ProductCard';
import { deleteProduct, fetchProducts } from '../../redux/Productslice';
import { fetchCategories } from '../../redux/Categoryslice';

const Product = () => {
  const dispatch = useDispatch();
  const [showForm, setShowForm] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null);

  const [categoryFilter, setCategoryFilter] = useState('all');
  const [stockStatus, setStockStatus] = useState('all');
  const [sortBy, setSortBy] = useState('none');
  const [searchInput, setSearchInput] = useState('');

  const { items: products, loading } = useSelector((state) => state.products);
  const { items: categories } = useSelector((state) => state.category);

  // for scroll to top
  const productListRef = useRef(null);
  useEffect(() => {
    if (productListRef.current) {
      productListRef.current.scrollTop = 0;
    }
  }, [categoryFilter]);


  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchCategories());
  }, [dispatch]);


  const handleAddProduct = () => {
    setProductToEdit(null);
    setShowForm(true);
  };

  const handleEdit = (product) => {
    setProductToEdit(product);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      dispatch(deleteProduct(id))
        .then(() => alert('Product deleted successfully'))
        .catch(error => {
          alert('Failed to delete product');
          console.error('Delete error:', error);
        });
    }
  };

  // Filter and sort
  let displayedProducts = [...products];

  if (categoryFilter !== 'all') {
    displayedProducts = displayedProducts.filter(
      (product) => product.category.name === categoryFilter
    );
  }

  if (stockStatus === 'in') {
    displayedProducts = displayedProducts.filter((product) => product.stock > 0);
  } else if (stockStatus === 'out') {
    displayedProducts = displayedProducts.filter((product) => product.stock === 0);
  } else if (stockStatus === 'low') {
    displayedProducts = displayedProducts.filter(
      (product) => product.stock > 0 && product.stock <= 5
    );
  }

  if (searchInput) {
    const searchTerm = searchInput.toLowerCase();
    displayedProducts = displayedProducts.filter((product) =>
      product.name.toLowerCase().includes(searchTerm)
    );
  }

  if (sortBy !== 'none') {
    displayedProducts.sort((a, b) => {
      switch (sortBy) {
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'stock-asc':
          return a.stock - b.stock;
        case 'stock-desc':
          return b.stock - a.stock;
        default:
          return 0;
      }
    });
  }

  return (
    <div className="mx-auto sm:px-4 py-6">
      {/* Header and Add Product Button */}
      <div className="flex flex-col sm:flex-row justify-between gap-2 items-center mb-4 sm:mb-6  sm:gap-4">
        <h2 className="sm:text-2xl font-bold text-gray-800">Product Management</h2>
        <button
          onClick={handleAddProduct}
          className="md:px-6 md:py-2 px-2 py-1 text-xs md:text-base bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
        >
          Add New Product
        </button>
      </div>

      <div className="flex flex-col md:flex-row md:gap-6">
        {/* Sidebar with Categories */} {/* only desktop versions */}
        <div className="w-60 hidden md:block sm:bg-white p-4 rounded-lg shadow-sm h-fit">
          <h3 className="text-lg font-semibold mb-3">Categories</h3>
          <ul className="space-y-2">
            <li
              className={`cursor-pointer px-2 py-1 rounded ${categoryFilter === 'all' ? 'bg-blue-100 text-blue-600 font-medium' : 'hover:bg-gray-100'}`}
              onClick={() => setCategoryFilter('all')}
            >
              All Categories
            </li>
            {categories.map((cat) => (
              <li
                key={cat._id}
                className={`cursor-pointer px-2 py-1 rounded ${categoryFilter === cat.name ? 'bg-blue-100 text-blue-600 font-medium' : 'hover:bg-gray-100'}`}
                onClick={() => setCategoryFilter(cat.name)}
              >
                {cat.name}
              </li>
            ))}
          </ul>
        </div>

        {/* For Mobile (below md): use dropdown */}
        <div className="block md:hidden bg-white px-4 rounded-lg shadow-sm">
          <label className="block font-medium text-gray-700 text-xs sm:text-sm sm:mb-1 ">Filter by Category</label>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full border rounded-md sm:p-2 text-xs sm:text-base"
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat.name}> {cat.name}</option>
            ))}
          </select>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Filters */}
          <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 sm:gap-4 gap-2">
              {/* Stock Filter */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 sm:mb-1">Stock Status</label>
                <select
                  value={stockStatus}
                  onChange={(e) => setStockStatus(e.target.value)}
                  className="w-full sm:p-2 border rounded-md text-xs sm:text-base"
                >
                  <option value="all" >All Stock</option>
                  <option value="in">In Stock</option>
                  <option value="out">Out of Stock</option>
                  <option value="low">Low Stock (≤ 5)</option>
                </select>
              </div>

              {/* Sort Option */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 sm:mb-1">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full sm:p-2 border rounded-md text-xs sm:text-base"
                >
                  <option value="none">No Sorting</option>
                  <option value="name-asc">Name (A-Z)</option>
                  <option value="name-desc">Name (Z-A)</option>
                  <option value="price-asc">Price (Low to High)</option>
                  <option value="price-desc">Price (High to Low)</option>
                  <option value="stock-asc">Stock (Low to High)</option>
                  <option value="stock-desc">Stock (High to Low)</option>
                </select>
              </div>

              {/* Search */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 sm:mb-1">Search</label>
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="w-full text-sm sm:p-2 border rounded-md"
                />
              </div>
            </div>
          </div>

          {/* Product Form Modal */}
          {showForm && (
            <div className='bg-[rgba(0,0,0,0.5)] fixed inset-0 flex justify-center items-center z-60'>
             <div className="relative rounded w-full max-w-md bg-white">

                {/* Close button that should not scroll */}
                <button
                  className='absolute top-2 right-5 text-xl text-gray-600 cursor-pointer'
                  onClick={() => {
                    setShowForm(false);
                    setProductToEdit(null);
                  }}
                >
                  ✕
                </button>

                {/* ✅ Inner scrollable container only */}
                <div className='overflow-y-auto max-h-[90vh]'>
                  <ProductForm
                    existingProduct={productToEdit}
                    categories={categories}
                    onClose={() => {
                      setShowForm(false);
                      setProductToEdit(null);
                    }}
                  />
                </div>
              </div>
            </div>
          )}


          {/* Product List */}
          {loading ? (
            <div className="text-center py-8">
              <p>Loading products...</p>
            </div>
          ) : displayedProducts.length === 0 ? (
            <div className="text-center py-8 bg-white rounded-lg shadow-sm">
              <p className="text-gray-500">No products found matching your criteria.</p>
            </div>
          ) : (
            <div
              className="flex flex-wrap justify-center gap-4 md:h-96 md:overflow-y-auto"
              ref={productListRef}
            >
              {displayedProducts.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  isAdmin={true}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Product;
