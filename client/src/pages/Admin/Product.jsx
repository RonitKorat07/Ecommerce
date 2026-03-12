import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ProductForm from '../../components/Admin/ProductForm';
import ProductCard from '../../components/ProductCard';
import { deleteProduct, fetchProducts } from '../../redux/Productslice';
import { fetchCategories } from '../../redux/Categoryslice';
import Button from '../../components/UI/Button';
import Select from '../../components/UI/Select';
import { Card, CardBody } from '../../components/UI/Card';
import { Plus, Search, LayoutGrid, List, X, Package, SlidersHorizontal } from 'lucide-react';
import toast from 'react-hot-toast';

const Product = () => {
  const dispatch = useDispatch();
  const [showForm, setShowForm] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null);

  const [categoryFilter, setCategoryFilter] = useState('all');
  const [stockStatus, setStockStatus] = useState('all');
  const [sortBy, setSortBy] = useState('none');
  const [searchInput, setSearchInput] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);

  const { items: products, loading } = useSelector((state) => state.products);
  const { items: categories } = useSelector((state) => state.category);

  const productListRef = useRef(null);

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
        .then(() => toast.success('Product deleted successfully'))
        .catch(error => {
          toast.error('Failed to delete product');
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
        case 'name-asc': return a.name.localeCompare(b.name);
        case 'name-desc': return b.name.localeCompare(a.name);
        case 'price-asc': return a.price - b.price;
        case 'price-desc': return b.price - a.price;
        case 'stock-asc': return a.stock - b.stock;
        case 'stock-desc': return b.stock - a.stock;
        default: return 0;
      }
    });
  }

  const activeFilterCount = [categoryFilter !== 'all', stockStatus !== 'all', sortBy !== 'none'].filter(Boolean).length;

  const viewModes = [
    { key: "list", icon: List, label: "List" },
    { key: "grid", icon: LayoutGrid, label: "Grid" },
  ];

  return (
    <div className="p-5 sm:p-6 lg:p-8 animate-in fade-in duration-500">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-[var(--text-main)]" style={{ fontFamily: "var(--font-heading)" }}>
            Product <span className="text-[var(--primary)]">Management</span>
          </h2>
          <p className="text-sm text-[var(--text-muted)] mt-0.5">Manage your inventory, prices, and product details.</p>
        </div>
        <Button
          onClick={handleAddProduct}
          variant="orange"
          size="md"
          className="gap-2"
        >
          <Plus size={16} />
          Add New Product
        </Button>
      </div>

      {/* ── Toolbar: Search + Filters + View Toggle ── */}
      <div className="bg-white rounded-xl border border-[var(--border-light)] shadow-sm mb-6">
        <div className="px-4 py-3 flex flex-col sm:flex-row sm:items-center gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search products..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="pl-9 pr-4 py-2 rounded-lg border border-[var(--border-light)] bg-[var(--bg-body)] text-sm outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[rgba(15,76,129,0.08)] transition-all w-full"
            />
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          </div>

          <div className="flex items-center gap-2">
            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium border transition-all ${
                showFilters || activeFilterCount > 0
                  ? 'border-[var(--primary)] text-[var(--primary)] bg-[var(--primary-light)]'
                  : 'border-[var(--border-light)] text-[var(--text-muted)] hover:border-slate-300'
              }`}
            >
              <SlidersHorizontal size={14} />
              Filters
              {activeFilterCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-[var(--primary)] text-white text-[10px] flex items-center justify-center">{activeFilterCount}</span>
              )}
            </button>

            {/* View Mode Toggle */}
            <div className="flex items-center bg-[var(--bg-body)] rounded-lg border border-[var(--border-light)] p-0.5">
              {viewModes.map(({ key, icon: Icon, label }) => (
                <button
                  key={key}
                  onClick={() => setViewMode(key)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                    viewMode === key
                      ? "bg-white text-[var(--primary)] shadow-sm border border-[var(--border-light)]"
                      : "text-[var(--text-muted)] hover:text-[var(--text-main)]"
                  }`}
                >
                  <Icon size={14} />
                  <span className="hidden sm:inline">{label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Expandable Filters ── */}
        {showFilters && (
          <div className="px-4 py-3 border-t border-[var(--border-light)] flex flex-col sm:flex-row gap-3 animate-in slide-in-from-top-1 duration-200">
            {/* Category */}
            <div className="flex-1">
              <Select
                label="Category"
                value={categoryFilter}
                onChange={(val) => setCategoryFilter(val)}
                options={[
                  { value: 'all', label: 'All Categories' },
                  ...categories.map((cat) => ({ value: cat.name, label: cat.name }))
                ]}
              />
            </div>

            {/* Sort */}
            <div className="flex-1">
              <Select
                label="Sort By"
                value={sortBy}
                onChange={(val) => setSortBy(val)}
                options={[
                  { value: 'none', label: 'Default' },
                  { value: 'name-asc', label: 'Name (A-Z)' },
                  { value: 'name-desc', label: 'Name (Z-A)' },
                  { value: 'price-asc', label: 'Price (Low-High)' },
                  { value: 'price-desc', label: 'Price (High-Low)' },
                  { value: 'stock-asc', label: 'Stock (Low-High)' },
                  { value: 'stock-desc', label: 'Stock (High-Low)' },
                ]}
              />
            </div>

            {/* Stock */}
            <div className="flex-1">
              <Select
                label="Stock Status"
                value={stockStatus}
                onChange={(val) => setStockStatus(val)}
                options={[
                  { value: 'all', label: 'All Products' },
                  { value: 'in', label: 'In Stock' },
                  { value: 'out', label: 'Out of Stock' },
                  { value: 'low', label: 'Low Stock (≤ 5)' },
                ]}
              />
            </div>

            {/* Clear */}
            {activeFilterCount > 0 && (
              <div className="flex items-end">
                <button
                  onClick={() => { setCategoryFilter('all'); setStockStatus('all'); setSortBy('none'); }}
                  className="text-xs font-medium text-red-500 hover:text-red-600 px-3 py-2 hover:bg-red-50 rounded-lg transition-colors"
                >
                  Clear All
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Product Content ── */}
      <div className="bg-white rounded-xl border border-[var(--border-light)] shadow-sm">
        <div className="p-4" ref={productListRef}>
          {loading ? (
            <div className="py-16 flex flex-col items-center justify-center gap-2">
              <div className="animate-spin rounded-full h-7 w-7 border-2 border-[var(--primary-light)] border-t-[var(--primary)]" />
              <span className="text-xs text-[var(--text-muted)]">Loading products...</span>
            </div>
          ) : displayedProducts.length === 0 ? (
            <div className="py-16 flex flex-col items-center justify-center gap-2 text-[var(--text-muted)]">
              <Package size={32} strokeWidth={1.5} className="text-slate-300" />
              <span className="text-sm font-medium">No products found</span>
              <span className="text-xs">Try adjusting your filters or search.</span>
              {activeFilterCount > 0 && (
                <button
                  onClick={() => { setCategoryFilter('all'); setStockStatus('all'); setSortBy('none'); setSearchInput(''); }}
                  className="mt-2 text-xs font-medium text-[var(--primary)] hover:underline"
                >
                  Clear all filters
                </button>
              )}
            </div>
          ) : (
            <>
              {/* Grid View */}
              {viewMode === "grid" && (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                  {displayedProducts.map((product) => (
                    <ProductCard
                      key={product._id}
                      product={product}
                      isAdmin={true}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      viewMode="grid"
                    />
                  ))}
                </div>
              )}

              {/* List View */}
              {viewMode === "list" && (
                <div className="divide-y divide-[var(--border-light)]">
                  {displayedProducts.map((product) => (
                    <ProductCard
                      key={product._id}
                      product={product}
                      isAdmin={true}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      viewMode="list"
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* ── Product Form Modal ── */}
      {showForm && (
        <div className='fixed inset-0 bg-[rgba(15,23,42,0.6)] backdrop-blur-sm flex justify-center items-center z-[60] p-4 animate-in fade-in duration-300'>
          <Card className="w-full max-w-2xl relative overflow-hidden animate-in slide-in-from-bottom-8 duration-500">
            <Button
              variant="ghost"
              className="absolute top-4 right-4 z-10 w-8 h-8 p-0 rounded-full"
              onClick={() => {
                setShowForm(false);
                setProductToEdit(null);
              }}
            >
              <X size={20} />
            </Button>
            <div className='overflow-y-auto max-h-[85vh] custom-scrollbar'>
              <ProductForm
                existingProduct={productToEdit}
                categories={categories}
                onClose={() => {
                  setShowForm(false);
                  setProductToEdit(null);
                }}
              />
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Product;
