import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../UI/Button';
import { ShoppingBasket } from 'lucide-react';

const UserProductCardHoriz = ({ product }) => {
  const navigate = useNavigate();
  const discountPrice = product.price - (product.price * product.discount) / 100;

  return (
    <div
      onClick={() => navigate(`/user/product/${product._id}`)}
      className="group flex bg-white border border-[var(--border-light)] rounded-xl cursor-pointer hover:shadow-lg transition-all duration-500 w-[200px] sm:w-[260px] md:w-[300px] h-[110px] sm:h-[140px] md:h-[160px] flex-shrink-0 overflow-hidden"
    >
      {/* Image Left */}
      <div className="relative w-[90px] sm:w-[120px] md:w-[140px] h-full bg-[var(--bg-body)] overflow-hidden flex-shrink-0 flex items-center justify-center p-1.5 sm:p-3">
        <img
          src={product.images?.[0]}
          alt={product.name}
          className="w-full h-full object-contain mix-blend-multiply transition-transform duration-700 group-hover:scale-110"
        />
        {product.discount > 0 && (
          <div className="absolute top-1 left-1 bg-[var(--danger)] text-white text-[7px] sm:text-[8px] font-bold px-1.5 py-0.5 rounded-md shadow-md uppercase tracking-tight">
            -{product.discount}%
          </div>
        )}
      </div>

      {/* Content Right */}
      <div className="flex flex-col justify-between p-2 sm:p-3 md:p-4 flex-1 min-w-0">
        <div className="space-y-0.5">
          <p className="text-[7px] sm:text-[9px] font-bold text-[var(--primary)] uppercase tracking-wider truncate">{product.category?.name}</p>
          <h3
            className="font-semibold text-[var(--text-main)] text-[10px] sm:text-xs md:text-sm line-clamp-2 leading-tight group-hover:text-[var(--primary)] transition-colors"
            title={product.name}
          >
            {product.name}
          </h3>
        </div>

        <div className="space-y-1.5 sm:space-y-2">
          <div className="flex items-baseline gap-1">
            <span className="text-[var(--text-main)] font-black text-xs sm:text-sm md:text-base">₹{discountPrice.toFixed(0)}</span>
            {product.discount > 0 && (
              <span className="line-through text-[var(--text-muted)] text-[8px] sm:text-[9px] font-medium">₹{product.price}</span>
            )}
          </div>

          <Button
            variant="ghost"
            size="sm"
            className="w-full h-6 sm:h-7 md:h-8 text-[8px] sm:text-[9px] border-2 border-slate-100 hover:border-[var(--primary)] hover:bg-[var(--primary)] hover:text-white rounded-lg gap-1 font-bold transition-all"
          >
            <ShoppingBasket size={10} className="shrink-0" />
            <span className="truncate">Quick Add</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UserProductCardHoriz;
