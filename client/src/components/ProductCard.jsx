import React from "react";
import { Pencil, Trash2, Package } from "lucide-react";

const ProductCard = ({ product, isAdmin, onEdit, onDelete, viewMode = "grid" }) => {
  const colors = product.colors || [];
  const sizes = product.sizes || [];
  const discount = product.discount || 0;
  const originalPrice = product.price || 0;
  const finalPrice = Math.round(originalPrice * (1 - discount / 100));

  // ── List View ──
  if (viewMode === "list") {
    return (
      <div className="flex items-center gap-4 px-3 py-3.5 hover:bg-[var(--bg-body)] rounded-xl transition-colors group">
        {/* Image */}
        <div className="w-14 h-14 rounded-xl overflow-hidden border border-[var(--border-light)] group-hover:border-[var(--primary)] transition-colors flex-shrink-0 shadow-sm">
          <img src={product.images?.[0]} alt={product.name} className="w-full h-full object-cover" />
        </div>

        {/* Name + Category */}
        <div className="flex-1 min-w-0">
          <span className="text-[15px] font-semibold text-[var(--text-main)] truncate block">{product.name}</span>
          <span className="text-xs text-[var(--text-muted)]">{product.category?.name || "Uncategorized"}</span>
        </div>

        {/* Price */}
        <div className="text-right flex-shrink-0 hidden sm:block">
          <span className="text-sm font-bold text-[var(--accent)]">₹{finalPrice}</span>
          {discount > 0 && (
            <span className="text-[11px] text-slate-400 line-through ml-1.5">₹{originalPrice}</span>
          )}
        </div>

        {/* Stock */}
        <div className="flex-shrink-0 hidden md:block">
          <span className={`text-[11px] font-semibold px-2 py-1 rounded-full ${
            product.stock === 0 ? 'bg-red-50 text-red-500' :
            product.stock < 5 ? 'bg-amber-50 text-amber-600' :
            'bg-emerald-50 text-emerald-600'
          }`}>
            {product.stock === 0 ? "Out" : `${product.stock} left`}
          </span>
        </div>

        {/* Actions */}
        {isAdmin && (
          <div className="flex gap-1.5 flex-shrink-0">
            <button onClick={() => onEdit(product)} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-[var(--primary)] bg-[var(--primary-light)] hover:bg-[var(--primary)] hover:text-white transition-all" title="Edit">
              <Pencil size={13} /> <span className="hidden sm:inline">Edit</span>
            </button>
            <button onClick={() => onDelete(product._id)} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-red-500 bg-red-50 hover:bg-red-500 hover:text-white transition-all" title="Delete">
              <Trash2 size={13} /> <span className="hidden sm:inline">Delete</span>
            </button>
          </div>
        )}
      </div>
    );
  }

  // ── Grid View ──
  return (
    <div className="group rounded-xl border border-[var(--border-light)] hover:border-[var(--primary)] hover:shadow-lg transition-all overflow-hidden bg-white">
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-[var(--bg-body)]">
        <img
          src={product.images?.[0]}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {/* Stock Badge */}
        <span className={`absolute top-2 right-2 px-2 py-0.5 text-[10px] font-bold rounded-full ${
          product.stock === 0 ? "bg-red-500 text-white" :
          product.stock < 5 ? "bg-amber-400 text-white" :
          "bg-emerald-500 text-white"
        }`}>
          {product.stock === 0 ? "Out of Stock" : product.stock < 5 ? `Low (${product.stock})` : "In Stock"}
        </span>
        {/* Discount Badge */}
        {discount > 0 && (
          <span className="absolute top-2 left-2 px-2 py-0.5 text-[10px] font-bold rounded-full bg-[var(--accent)] text-white">
            {discount}% OFF
          </span>
        )}
      </div>

      {/* Info */}
      <div className="p-3">
        <p className="text-xs text-[var(--text-muted)] mb-0.5">{product.category?.name || "Uncategorized"}</p>
        <h3 className="text-sm font-semibold text-[var(--text-main)] truncate mb-1.5">{product.name}</h3>

        {/* Price */}
        <div className="flex items-baseline gap-1.5 mb-2.5">
          <span className="text-base font-bold text-[var(--accent)]">₹{finalPrice}</span>
          {discount > 0 && (
            <span className="text-xs text-slate-400 line-through">₹{originalPrice}</span>
          )}
        </div>

        {/* Colors & Sizes row */}
        <div className="flex items-center gap-3 mb-3">
          {colors.length > 0 && (
            <div className="flex items-center gap-1">
              {colors.slice(0, 4).map((color, i) => (
                <span key={i} className="w-3.5 h-3.5 rounded-full border border-slate-200" style={{ backgroundColor: color }} title={color} />
              ))}
              {colors.length > 4 && <span className="text-[10px] text-slate-400">+{colors.length - 4}</span>}
            </div>
          )}
          {sizes.length > 0 && (
            <div className="flex gap-1">
              {sizes.slice(0, 3).map((size, i) => (
                <span key={i} className="px-1.5 py-0.5 text-[10px] font-medium bg-slate-100 text-slate-500 rounded">{size}</span>
              ))}
              {sizes.length > 3 && <span className="text-[10px] text-slate-400">+{sizes.length - 3}</span>}
            </div>
          )}
        </div>

        {/* Admin Actions */}
        {isAdmin && (
          <div className="flex gap-1.5 pt-2 border-t border-[var(--border-light)]">
            <button onClick={() => onEdit(product)} className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-medium text-[var(--primary)] bg-[var(--primary-light)] hover:bg-[var(--primary)] hover:text-white transition-all">
              <Pencil size={12} /> Edit
            </button>
            <button onClick={() => onDelete(product._id)} className="p-1.5 rounded-lg text-red-400 bg-red-50 hover:bg-red-500 hover:text-white transition-all">
              <Trash2 size={13} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
