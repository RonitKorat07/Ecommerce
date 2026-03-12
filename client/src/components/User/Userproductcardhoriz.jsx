import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../UI/Button';
import { ShoppingBag } from 'lucide-react';

const UserProductCardHoriz = ({ product }) => {
  const navigate = useNavigate();
  const discountPrice = product.price - (product.price * product.discount) / 100;

  return (
    <div
      onClick={() => navigate(`/user/product/${product._id}`)}
      className="group flex bg-white border border-[var(--border-light)] rounded-2xl cursor-pointer hover:shadow-xl transition-all duration-500 w-[280px] md:w-[380px] h-[140px] md:h-[180px] flex-shrink-0 overflow-hidden"
    >
      {/* Image Left */}
      <div className="relative w-[120px] md:w-[160px] h-full bg-[var(--bg-body)] overflow-hidden flex-shrink-0 flex items-center justify-center p-4">
        <img
          src={product.images?.[0]}
          alt={product.name}
          className="w-full h-full object-contain mix-blend-multiply transition-transform duration-700 group-hover:scale-110"
        />
        {product.discount > 0 && (
          <div className="absolute top-2 left-2 bg-[var(--danger)] text-white text-[10px] font-bold px-2 py-1 rounded-lg shadow-md">
            -{product.discount}%
          </div>
        )}
      </div>

      {/* Content Right */}
      <div className="flex flex-col justify-between p-4 md:p-5 flex-1 min-w-0">
        <div className="space-y-1">
          <p className="text-[10px] font-bold text-[var(--primary)] uppercase tracking-widest">{product.category?.name}</p>
          <h3
            className="font-bold text-[var(--text-main)] text-sm md:text-base line-clamp-2 leading-tight group-hover:text-[var(--primary)] transition-colors"
            title={product.name}
          >
            {product.name}
          </h3>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-[var(--text-main)] font-extrabold text-base md:text-xl">₹{discountPrice.toFixed(0)}</span>
            {product.discount > 0 && (
              <span className="line-through text-[var(--text-muted)] text-[10px] md:text-xs">₹{product.price}</span>
            )}
          </div>

          <Button
            variant="ghost"
            size="sm"
            className="w-full h-8 md:h-10 text-[10px] md:text-xs bg-[var(--bg-body)] hover:bg-[var(--primary)] hover:text-white rounded-xl gap-2 font-bold"
          >
            <ShoppingBag size={14} />
            Quick Add
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UserProductCardHoriz;

