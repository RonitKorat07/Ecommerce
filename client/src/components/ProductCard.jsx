import React from "react";
import { FaEdit, FaTrash } from "react-icons/fa";

const ProductCard = ({ product, isAdmin, onEdit, onDelete }) => {
  const colors = product.colors || [];
  const sizes = product.sizes || [];

    // Calculate final price after discount
  const discount = product.discount || 0; // discount in percentage
  const originalPrice = product.price || 0;
  const finalPrice = Math.round(originalPrice * (1 - discount / 100));


  return (
    <div className="flex max-w-80  bg-sky-100 rounded-xl m-4">
      {/* Product Image */}
      <div className="relative h-auto">
        <img
          src={product.images?.[0]}
          alt={product.name}
          className="w-full h-full object-cover rounded-l-xl"
        />
        {/* Stock Badge */}
       <div
          className={`absolute top-1 right-1 px-3 py-1 text-xs font-medium rounded-full ${
            product.stock === 0
              ? "bg-red-500 text-white"
              : product.stock < 5
              ? "bg-yellow-500 text-black"
              : "bg-green-500 text-white"
          }`}
        >
          {product.stock === 0
            ? "Out of Stock"
            : product.stock < 5
            ? `Low Stock (${product.stock})`
            : `In Stock (${product.stock})`}
        </div>

      </div>

      {/* Product Info */}
      <div className="m-4 flex flex-col justify-between w-1/2">
        <div>
          <h3 className="text-sm sm:text-xl font-bold text-gray-900 mb-1">{product.name}</h3>

          {/* Price with Discount Percentage */}
          <p className="text-sm sm:text-lg font-semibold text-orange-600 mb-2 flex items-center gap-1">
            ₹{finalPrice}
            {discount > 0 && (
              <>
                <span className="line-through text-gray-500 text-sm ml-2">
                  ₹{originalPrice}
                </span>
                <span className="text-sm font-bold text-red-600">{discount}% OFF</span>
              </>
            )}
          </p>

          <div className="text-xs sm:text-sm font-medium mb-1">Description:</div>
          <p className="text-xs sm:text-sm text-gray-600 mb-3 line-clamp-2">
            {product.description || "This is a short description of the product."}
          </p>

          {/* Colors */}
          <div className="mb-2">
            <div className="text-xs sm:text-sm font-medium">Colors:</div>
            <div>
              {colors.length > 0 ? (
                colors.map((color, index) => (
                  <div
                    key={index}
                    className="w-4 h-4 inline-block rounded-full border border-gray-300 mr-1"
                    style={{ backgroundColor: color }}
                    title={color}
                  ></div>
                ))
              ) : (
                <span className="text-xs text-gray-500">N/A</span>
              )}
            </div>
          </div>

          {/* Sizes */}
          <div className="mb-3">
            <div className="text-xs sm:text-sm font-medium">Sizes:</div>
            <div>
              {sizes.length > 0 ? (
                sizes.map((size, index) => (
                  <span
                    key={index}
                    className="px-1 mr-1 py-0.5 text-xs font-medium bg-gray-100 rounded-full sm:mr-2 sm:px-2"
                  >
                    {size}
                  </span>
                ))
              ) : (
                <span className="text-xs text-gray-500">N/A</span>
              )}
            </div>
          </div>
        </div>

        {/* Admin Buttons */}
        {isAdmin && (
          <div className="flex gap-2 mt-2">
            <button
              onClick={() => onEdit(product)}
              className="flex items-center bg-blue-600 text-white sm:px-3 py-1 text-xs px-2 rounded hover:bg-blue-700 sm:text-sm"
            >
              <FaEdit className="mr-1" />
              Edit
            </button>
            <button
              onClick={() => onDelete(product._id)}
              className="flex items-center bg-red-600 text-white sm:px-3 py-1 rounded text-xs px-2 hover:bg-red-700 sm:text-sm"
            >
              <FaTrash className="mr-1" />
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
