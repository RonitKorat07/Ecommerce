import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductById, fetchRecommendedProducts } from "../redux/Productslice";
import Recommendproduct from "./Recommendproduct";
import toast from "react-hot-toast";
import { addToCart } from "../redux/Cartslice";

const Productdetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { currentProduct: product, loading, error, recommendedProducts } = useSelector(
    (state) => state.products
  );
  const currentUserId = useSelector((state) => state.user.user?._id);


  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [mainImage, setMainImage] = useState("");

  useEffect(() => {
    if (id) {
      dispatch(fetchProductById(id));
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (product) {
      dispatch(fetchRecommendedProducts({
        categoryId: product.category?._id,
        excludeId: product._id
      }));
    }
  }, [product, dispatch]);

  useEffect(() => {
    if (product && product.images?.length > 0) {
      setMainImage(product.images[0]);
    }
  }, [product]);

  if (loading) return <div className="text-center py-10 text-lg">Loading...</div>;
  if (error) return <div className="text-center py-10 text-red-600">{error}</div>;
  if (!product) return <div className="text-center py-10">No product found</div>;



// Ensure you have access to currentUserId, either from auth state or props
const handleAddToCart = async () => {
  if (!selectedSize || !selectedColor) {
    toast.error("Please select both size and color.");
    return;
  }

  try {
    const res = await dispatch(
      addToCart({
        userId: currentUserId,
        productId: product._id,
        selectedSize,
        selectedColor,
        quantity : 1,
      })
    ).unwrap();

    toast.success(res.message || "Added to cart successfully!");
  } catch (error) {
    toast.error(error)
  }
};




  return (
    <div className="max-w-7xl mx-auto p-6 ">
      <div className="grid md:grid-cols-2 gap-10">
        {/* Image Section */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Thumbnails */}
          <div className="flex md:flex-col gap-3">
            {product.images?.map((img, i) => (
              <img
                key={i}
                src={img}
                onClick={() => setMainImage(img)}
                className={`w-20 h-20 rounded-md object-cover cursor-pointer border-2 ${
                  mainImage === img ? "border-blue-600" : "border-gray-200"
                }`}
                alt={`thumb-${i}`}
              />
            ))}
          </div>
          {/* Main Image */}
          <div className="flex-1 border rounded-lg overflow-hidden bg-white">
            <img
              src={mainImage}
              alt={product.name}
              className="w-full h-[450px] object-contain bg-gray-50"
            />
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
            <p className="text-gray-600 mt-2">{product.description}</p>
          </div>

          <div>
            <h1 className="text-3xl font-bold text-gray-900">{product.stock}</h1>
          </div>

          {/* Price */}
          <div className="text-2xl font-bold text-gray-800">
            ₹{Math.floor(product.price - (product.price * product.discount) / 100)}

            {product.price && (
              <span className="ml-3 text-base line-through text-gray-500">
                ₹{product.price}
              </span>
            )}
            {product.discount && (
              <span className="ml-3 text-green-600 text-sm">{product.discount}% OFF</span>
            )}
          </div>

          {/* Colors */}
          {product.colors?.length > 0 && (
            <div>
              <h4 className="text-md font-medium mb-1">Select Color</h4>
              <div className="flex gap-3">
                {product.colors.map((color, i) => (
                  <div
                    key={i}
                    onClick={() => setSelectedColor(color)}
                    className={`w-8 h-8 rounded-full border-2 cursor-pointer transition ${
                      selectedColor === color ? "border-6 border-gray-400" : "border-gray-400"
                    }`}
                    style={{ backgroundColor: color }}
                    title={color}
                  ></div>
                ))}
              </div>
            </div>
          )}

          {/* Sizes */}
          {product.sizes?.length > 0 && (
            <div>
              <h4 className="text-md font-medium mb-1">Select Size</h4>
              <div className="flex flex-wrap gap-3">
                {product.sizes.map((size, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 border rounded-md font-medium text-sm transition ${
                      selectedSize === size
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white border-gray-300 hover:border-blue-500"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

         

          {/* Buttons */}
          <div className="flex gap-4 pt-4">
            <button 
            onClick={handleAddToCart}
            className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600  hover:from-purple-700 hover:to-indigo-700 text-white font-semibold py-3 rounded-lg shadow-md transition">
              Add to Cart
            </button>
            <button className="flex-1 border-2 border-blue-600 text-blue-600 font-semibold py-3 rounded-lg shadow-md transition duration-300 hover:bg-blue-600 hover:text-white">
              Buy Now
            </button>
          </div>
        </div>
      </div>
      <div className="max-w-7xl ">
        <Recommendproduct products={recommendedProducts} />
      </div>
    </div>
  );
};

export default Productdetails;
