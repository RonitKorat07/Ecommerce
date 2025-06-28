import React from 'react';
import { useNavigate } from 'react-router-dom';

const UserProductCardHoriz = ({ product }) => {
  const navigate = useNavigate();
  const discountPrice = product.price - (product.price * product.discount) / 100;

  return (
    <div
      onClick={() => navigate(`/user/product/${product._id}`)}
      className="flex bg-white shadow-lg rounded-xl cursor-pointer hover:shadow-xl transition-shadow duration-300 w-64 max-h-32 sm:w-96 sm:max-h-48 flex-shrink-0"
    >
      {/* Image Left */}
      <div className="relative sm:w-48 sm:h-48 w-30 h-32 overflow-hidden flex-shrink-0">
        <img
          src={product.images?.[0]}
          alt={product.name}
          className="w-full h-full object-contain p-3"
        />
        {product.discount > 0 && (
          <div className="absolute top-1 right-1 bg-gradient-to-tr from-pink-500 to-red-500 text-white text-xs sm:font-bold px-1 py-0.5 rounded-full shadow-lg">
            {product.discount}% OFF
          </div>
        )}
      </div>

      {/* Content Right */}
      <div className="flex flex-col justify-between p-5 w-full">
        <h3
          className="font-semibold text-gray-900 text-xs sm:text-lg line-clamp-2"
          title={product.name}
        >
          {product.name}
        </h3>

        <div className="flex items-center gap-3 ">
          <span className="text-red-600 font-extrabold text-xs sm:text-2xl">₹{discountPrice.toFixed(2)}</span>
          <span className="line-through text-gray-400 font-semibold text-base">₹{product.price}</span>
        </div>

        <button
          className=" bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold text-xs py-1 sm:text-sm sm:py-2 sm:px-7 rounded-2xl hover:from-indigo-700 hover:to-purple-700"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default UserProductCardHoriz;
