import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "../redux/Categoryslice";
import { imageuploade } from "../helper/imageuploade";
import { addProduct, fetchProducts, updateProduct } from "../redux/Productslice";
import toast from "react-hot-toast";

function ProductForm({existingProduct, onClose}) {
  const dispatch = useDispatch();
  const { items: categories, error } = useSelector((state) => state.category);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    category: "",
    sizes: [],
    colors: [],
    discount: 0,           
    stock: 0,
    images: [],
  });
  const [loading, setLoading] = useState(false);

useEffect(() => {
  if (existingProduct) {
    setFormData({
      name: existingProduct.name,
      price: existingProduct.price,
      description: existingProduct.description,
      category: existingProduct.category?._id,
      sizes: existingProduct.sizes || [],
      colors: existingProduct.colors || [],
      stock: existingProduct.stock,
      discount: existingProduct.discount || 0,
      images: existingProduct.images || [],
    });
  }
}, [existingProduct]);

  const handleOnChange = (e) => {
    const { name, value, type, checked, files } = e.target;
  
    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        [name]: checked
          ? [...prev[name], value]
          : prev[name].filter((item) => item !== value),
      }));
    } else if (type === "file") {
      setFormData((prev) => ({
        ...prev,
       images: [...prev.images, ...Array.from(files)], // ✅ Append new files
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

    const handleSubmit = async (e) => { 
    e.preventDefault();
    setLoading(true); // ✅ Start loading

    try {
      let imageUrls = [];
      if (formData.images.length > 0) {
        imageUrls = await imageuploade(formData.images);
      }

      const productData = {
        ...formData,
        images: imageUrls.length > 0 ? imageUrls : existingProduct?.images || [],
      };

      if (existingProduct) {
        // UPDATE using Redux action
        await dispatch(updateProduct({ 
          id: existingProduct._id, 
          data: productData 
        })).unwrap();
        toast.success("Product updated successfully!");
      } else {
        // ADD
        await dispatch(addProduct(productData)).unwrap();
        toast.success("New product added successfully!");
      }

      await dispatch(fetchProducts()); // ✅ refresh products list
      onClose(); // close form
        setFormData({
          name: "",
          price: "",
          description: "",
          category: "",
          sizes: [],
          colors: [],
          stock: 0,
          images: [],
        });
    } catch (error) {
      alert("Failed to submit product");
      console.error("Submit error:", error);
    }
  };


  const handleRemoveImage = (indexToRemove) => {
  setFormData((prev) => ({
    ...prev,
    images: prev.images.filter((_, index) => index !== indexToRemove),
  }));
};

  useEffect(() => {
    if (categories.length === 0) dispatch(fetchCategories());
  }, [dispatch, categories]);

    return (
      <div className="p-6 bg-gray-100 rounded-lg">
          <h2 className="text-2xl font-bold text-center mb-6">
            {existingProduct ? "Edit Product" : "Add New Product"}
          </h2>
        {error && <div className="bg-red-200 text-red-700 p-4 mb-4 rounded">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Product Name */}
          <div>
            <label htmlFor="name" className="block font-semibold">Product Name:</label>
            <input
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleOnChange}
              className="w-full p-2 mt-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          {/* Price */}
          <div>
            <label htmlFor="price" className="block font-semibold">Price:</label>
            <input
              id="price"
              type="number"
              name="price"
              value={formData.price}
              onChange={handleOnChange}
              className="w-full p-2  mt-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          {/* Discount */}
          <div>
            <label htmlFor="discount" className="block font-semibold">Discount (%):</label>
            <input
              id="discount"
              type="number"
              name="discount"
              min="0"
              max="100"
              value={formData.discount}
              onChange={handleOnChange}
              className="w-full p-2 mt-2 border border-gray-300 rounded-md"
            />
          </div>

          {/* Category */}
          <div>
            <label htmlFor="category" className="block font-semibold">Category:</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleOnChange}
              className="w-full p-2  mt-2 border border-gray-300 rounded-md"
              required
            >
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Sizes (checkboxes) */}
          <div>
            <label className="block font-semibold">Sizes:</label>
            <div className="space-x-4">
              {["Small", "Medium", "Large"].map((size) => (
                <label key={size} className="inline-flex items-center m-1">
                  <input
                    type="checkbox"
                    name="sizes"
                    value={size}
                    checked={formData.sizes.includes(size)}
                    onChange={handleOnChange}
                    className="mr-2"
                  />
                  {size}
                </label>
              ))}
            </div>
          </div>

          {/* Colors (checkboxes) */}
          <div>
            <label className="block font-semibold">Colors:</label>
            <div className="space-x-4 m-1">
              {["Red", "Blue", "Green", "Black", "White"].map((color) => (
                <label key={color} className="inline-flex items-center">
                  <input
                    type="checkbox"
                    name="colors"
                    value={color}
                    checked={formData.colors.includes(color)}
                    onChange={handleOnChange}
                    className="mr-1"
                  />
                  {color}
                </label>
              ))}
            </div>
          </div>

          {/* Stock */}
          <div>
            <label htmlFor="stock" className="block font-semibold">Stock:</label>
            <input
              id="stock"
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleOnChange}
              className="w-full p-2 mt-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          {/* Image Upload */}
          <div>
            <label htmlFor="images" className="block font-semibold">Product Images (optional):</label>
            <input
              id="images"
              type="file"
              name="images"
              multiple
              onChange={handleOnChange}
              className="w-full p-2 mt-2 border border-gray-300 rounded-md"
            />
          </div>

          {/* Image Preview Section */}
          <div className="mt-3">
              {formData.images.length === 0 ? (
                <p className="text-gray-500">No images uploaded</p>
              ) : (
                <div className="flex flex-wrap gap-3">
                  {formData.images.map((file, index) => {
                    // Agar file ek string URL hai to use as it is.
                    // Agar file ek File object hai to URL.createObjectURL se URL banao
                    const imageUrl = typeof file === 'string' ? file : URL.createObjectURL(file);

                    return (
                      <div key={index} className="relative w-24 h-24 border rounded overflow-hidden">
                        <img
                          src={imageUrl}
                          alt={`preview-${index}`}
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          className="absolute top-0 right-0 bg-red-500 text-white rounded-bl px-1 text-xs"
                        >
                          ✕
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block font-semibold">Description:</label>
            <textarea
              id="description"
              rows={5}
              name="description"
              value={formData.description}
              onChange={handleOnChange}
              className="w-full p-2 mt-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-4 font-semibold rounded-md text-white 
                ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
            >
              {loading ? "Please wait..." : existingProduct ? "Update Product" : "Add Product"}
            </button>
          </div>
        </form>
      </div>
    );
  }

  export default ProductForm;
