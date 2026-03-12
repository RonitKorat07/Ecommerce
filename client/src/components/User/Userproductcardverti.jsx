import React from 'react'
import { useNavigate } from 'react-router-dom';
import Button from '../UI/Button';
import { ShoppingBag, Eye } from 'lucide-react';

const Userproductcardverti = ({product}) => {
  const navigate = useNavigate();
  const discountPrice = product.price - (product.price * product.discount) / 100;

  return (
    <div
      onClick={() => navigate(`/user/product/${product._id}`)}
      className="group bg-white border border-[var(--border-light)] rounded-3xl overflow-hidden cursor-pointer hover:shadow-2xl transition-all duration-500 flex flex-col h-full"
    >
      {/* Image Container */}
      <div className="relative aspect-square bg-[var(--bg-body)] overflow-hidden flex items-center justify-center p-6">
        <img
          src={product.images?.[0]}
          alt={product.name}
          className="w-full h-full object-contain mix-blend-multiply transition-transform duration-700 group-hover:scale-110"
        />
        
        {/* Overlay Actions */}
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
           <div className="bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
              <Eye size={20} className="text-[var(--text-main)]" />
           </div>
        </div>

        {/* Discount Badge */}
        {product.discount > 0 && (
          <div className="absolute top-3 left-3 bg-[var(--danger)] text-white text-[10px] font-bold px-3 py-1.5 rounded-xl shadow-lg z-10 animate-in zoom-in duration-500">
            {product.discount}% OFF
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1 space-y-4">
        <div className="space-y-1">
          <p className="text-[10px] font-bold text-[var(--primary)] uppercase tracking-widest">{product.category?.name}</p>
          <h3 className="font-bold text-[var(--text-main)] text-base line-clamp-2 leading-tight group-hover:text-[var(--primary)] transition-colors min-h-[3rem]">
            {product.name}
          </h3>
        </div>

        <div className="mt-auto space-y-4">
          <div className="flex items-center gap-2.5">
            <span className="text-[var(--text-main)] font-extrabold text-xl">₹{discountPrice.toFixed(0)}</span>
            {product.discount > 0 && (
              <span className="line-through text-[var(--text-muted)] text-sm font-medium">₹{product.price}</span>
            )}
          </div>

          <Button 
            variant="orange" 
            className="w-full h-11 rounded-2xl gap-2 font-bold shadow-md hover:shadow-xl transition-all"
          >
            <ShoppingBag size={18} />
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Userproductcardverti;

