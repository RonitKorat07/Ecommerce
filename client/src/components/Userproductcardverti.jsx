import React from 'react'
import { useNavigate } from 'react-router-dom';

const Userproductcardverti = ({product}) => {
  
    const navigate = useNavigate();
    const discountPrice = product.price - (product.price * product.discount) / 100;

  return (
    <div
      onClick={() => navigate(`/user/product/${product._id}`)}
      className="bg-white rounded-2xl shadow-lg flex flex-col p-5 relative cursor-pointer"
    >
      {/* Discount Badge */}
      {product.discount > 0 && (
        <div className="absolute top-3 right-3 bg-gradient-to-tr from-pink-500 to-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg z-10">
          {product.discount}% OFF
        </div>
      )}

      {/* Image */}
      <div className="relative w-full pb-[100%] rounded-xl overflow-hidden mb-5 bg-gray-50 shadow-inner">
        <img
          src={product.images?.[0]}
          alt={product.name}
          className="absolute top-0 left-0 w-full h-full object-contain"
        />
      </div>

      {/* Info */}
      <h3 className="font-semibold text-gray-900 text-lg mb-2 truncate">{product.name}</h3>
      <div className="flex items-center gap-3 mb-2">
        <span className="text-red-600 font-extrabold text-xl">₹{discountPrice.toFixed(2)}</span>
        <span className="line-through text-gray-400 font-semibold">₹{product.price}</span>
      </div>

      <button className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold py-3 rounded-xl shadow-md hover:from-purple-700 hover:to-indigo-700 transition-colors duration-300 mt-auto">
        Add to Cart
      </button>
    </div>
  )
}

export default Userproductcardverti
