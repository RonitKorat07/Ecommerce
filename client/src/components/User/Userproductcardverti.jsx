import React from 'react'
import { useNavigate } from 'react-router-dom';
import Button from '../UI/Button';
import { ShoppingBasket, Eye } from 'lucide-react';

const Userproductcardverti = ({product, showDetails = false}) => {
  const navigate = useNavigate();
  const discountPrice = product.price - (product.price * product.discount) / 100;

  return (
    <div
      onClick={() => navigate(`/user/product/${product._id}`)}
      className="group bg-white border border-[var(--border-light)] rounded-xl overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-500 flex flex-col h-full"
    >
      {/* Image Container — fixed square aspect on all screens */}
      <div className="relative aspect-square bg-[var(--bg-body)] overflow-hidden flex items-center justify-center p-2 sm:p-4">
        <img
          src={product.images?.[0]}
          alt={product.name}
          className="w-full h-full object-contain mix-blend-multiply transition-transform duration-700 group-hover:scale-110"
        />

        {/* Hover overlay — desktop only */}
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity items-center justify-center gap-2 hidden md:flex">
           <div className="bg-white/90 backdrop-blur-sm p-2.5 rounded-full shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
              <Eye size={16} className="text-[var(--text-main)]" />
           </div>
        </div>

        {/* Discount Badge */}
        {product.discount > 0 && (
          <div className="absolute top-1.5 left-1.5 sm:top-2.5 sm:left-2.5 bg-[var(--danger)] text-white text-[8px] sm:text-[9px] font-bold px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-md shadow-md z-10 uppercase tracking-tight">
            -{product.discount}%
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-2.5 sm:p-4 flex flex-col flex-1 gap-1.5 sm:gap-3">
        <div className="space-y-0.5">
          <p className="text-[8px] sm:text-[9px] font-bold text-[var(--primary)] uppercase tracking-wider truncate">{product.category?.name}</p>
          <h3 className="font-semibold text-[var(--text-main)] text-[11px] sm:text-sm line-clamp-2 leading-tight group-hover:text-[var(--primary)] transition-colors">
            {product.name}
          </h3>
          {showDetails && product.description && (
             <p className="text-[9px] sm:text-[10px] text-[var(--text-muted)] line-clamp-1 font-medium hidden sm:block">
                {product.description}
             </p>
          )}
        </div>

        <div className="mt-auto space-y-1.5 sm:space-y-2.5">
          <div className="flex items-baseline gap-1 sm:gap-2">
            <span className="text-[var(--text-main)] font-black text-sm sm:text-lg">₹{discountPrice.toFixed(0)}</span>
            {product.discount > 0 && (
              <span className="line-through text-[var(--text-muted)] text-[9px] sm:text-xs font-medium">₹{product.price}</span>
            )}
          </div>

          <Button
            variant="orange"
            className="w-full h-7 sm:h-9 rounded-lg gap-1 font-bold shadow-sm hover:shadow-md transition-all border-2 border-[var(--accent)] text-[9px] sm:text-xs"
          >
            <ShoppingBasket size={12} className="sm:w-[14px] sm:h-[14px] shrink-0" />
            <span className="truncate">Add to Cart</span>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Userproductcardverti;
