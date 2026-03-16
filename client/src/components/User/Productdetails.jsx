import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductById, fetchRecommendedProducts } from "../../redux/Productslice";
import Recommendproduct from "./Recommendproduct";
import toast from "react-hot-toast";
import { addToCart } from "../../redux/Cartslice";
import Button from "../UI/Button";
import { ShoppingBag, Zap, Share2, Heart, ShieldCheck, Truck, RotateCcw, Star, Search } from "lucide-react";

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
  const [zoomStyle, setZoomStyle] = useState({});
  const [isZooming, setIsZooming] = useState(false);
  const imageRef = useRef(null);

  useEffect(() => {
    if (id) {
      dispatch(fetchProductById(id));
      window.scrollTo({ top: 0, behavior: "smooth" });
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

  const handleMouseMove = (e) => {
    if (!imageRef.current) return;
    const { left, top, width, height } = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;

    setZoomStyle({
      transformOrigin: `${x}% ${y}%`,
      transform: "scale(2.5)",
    });
    setIsZooming(true);
  };

  const handleMouseLeave = () => {
    setZoomStyle({
      transformOrigin: "center center",
      transform: "scale(1)",
    });
    setIsZooming(false);
  };

  if (loading) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary)]"></div>
      <p className="text-[var(--text-muted)] font-medium">Loading premium experience...</p>
    </div>
  );
  
  if (error || !product) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
      <p className="text-[var(--danger)] font-bold text-xl">Product not found</p>
      <Button variant="outline" onClick={() => window.history.back()}>Go Back</Button>
    </div>
  );

  const handleAddToCart = async () => {
    if (!selectedSize || !selectedColor) {
      toast.error("Please select a size and color before adding to cart.");
      return;
    }

    try {
      const res = await dispatch(
        addToCart({
          userId: currentUserId,
          productId: product._id,
          selectedSize,
          selectedColor,
          quantity: 1,
        })
      ).unwrap();
      toast.success(res.message || "Added to cart successfully!");
    } catch (error) {
      toast.error(error);
    }
  };

  const discountPrice = product.price - (product.price * product.discount) / 100;
  
  // Dummy rating generator based on ID length to remain consistent per product
  const rating = 4 + (product._id.length % 10) / 10;
  const reviewsCount = 120 + (product._id.length * 7);

  return (
    <div className="max-w-[1400px] mx-auto p-4 md:p-6 lg:px-10 space-y-12 animate-in fade-in duration-700">
      <div className="grid lg:grid-cols-12 gap-8 xl:gap-12">
        
        {/* ── Left: Interactive Image Gallery ── */}
        <div className="lg:col-span-7 flex flex-col md:flex-row gap-6 select-none">
          {/* Vertical Thumbnails */}
          <div className="flex md:flex-col gap-3 order-2 md:order-1 overflow-x-auto md:overflow-y-auto hide-scrollbar pb-2 md:pb-0 scroll-smooth">
            {product.images?.map((img, i) => (
              <div 
                key={i} 
                className={`flex-shrink-0 w-16 h-20 md:w-20 md:h-24 rounded-2xl cursor-pointer overflow-hidden transition-all duration-300 border-2 bg-[var(--bg-body)] ${
                  mainImage === img ? 'border-[var(--primary)] shadow-md' : 'border-transparent opacity-60 hover:opacity-100 hover:border-slate-300'
                }`}
                onClick={() => setMainImage(img)}
              >
                <img src={img} className="w-full h-full object-cover" alt={`View ${i + 1}`} />
              </div>
            ))}
          </div>
          
          {/* Main Hover-Zoom Display */}
          <div className="flex-1 order-1 md:order-2 relative group">
            {/* Quick Actions (Share/Wishlist) */}
            <div className="absolute top-4 right-4 z-20 flex flex-col gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <button className="w-10 h-10 rounded-full bg-white/90 backdrop-blur shadow-lg flex items-center justify-center text-[var(--text-main)] hover:bg-[var(--primary)] hover:text-white transition-all transform hover:scale-110">
                <Share2 size={18} />
              </button>
              <button className="w-10 h-10 rounded-full bg-white/90 backdrop-blur shadow-lg flex items-center justify-center text-slate-400 hover:text-rose-500 transition-all transform hover:scale-110">
                <Heart size={18} fill="currentColor" strokeWidth={0} className="hover:animate-pulse" />
              </button>
            </div>
            
            {/* Hover-to-Zoom Container */}
            <div 
              className="w-full bg-[#f8f9fa] rounded-[2rem] border-2 border-slate-100 overflow-hidden cursor-crosshair relative min-h-[350px] md:min-h-[450px] lg:min-h-[500px] flex items-center justify-center shadow-inner group-hover:border-[var(--primary-light)] transition-colors"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              ref={imageRef}
            >
              {/* Overlay hint */}
              {!isZooming && (
                 <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full text-[11px] font-black text-slate-500 shadow-sm pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-2 tracking-widest uppercase border border-slate-200">
                    <Search size={14} /> Hover to zoom
                 </div>
              )}
              <img
                src={mainImage}
                alt={product.name}
                className="w-full h-full max-h-[350px] md:max-h-[450px] lg:max-h-[500px] object-contain transition-transform duration-200 ease-out p-6"
                style={zoomStyle}
              />
            </div>
          </div>
        </div>

        {/* ── Right: Product Information & Configuration ── */}
        <div className="lg:col-span-5 flex flex-col justify-start pt-2">
          
          {/* Category & Badges */}
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="px-2.5 py-1 bg-[var(--primary-light)] text-[var(--primary)] text-[9px] font-bold uppercase tracking-widest rounded-full">
              {product.category?.name}
            </span>
            {product.stock > 0 ? (
               <span className="px-2.5 py-1 bg-emerald-50 border border-emerald-100 text-emerald-600 text-[9px] font-bold uppercase tracking-widest rounded-full flex items-center gap-1.5">
                 <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div> In Stock
               </span>
            ) : (
               <span className="px-2.5 py-1 bg-rose-50 border border-rose-100 text-rose-600 text-[9px] font-bold uppercase tracking-widest rounded-full">
                 Out of Stock
               </span>
            )}
          </div>
          
          {/* Title & Ratings */}
          <h1 className="text-2xl md:text-[1.75rem] font-bold text-[var(--text-main)] leading-tight tracking-tight mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
            {product.name}
          </h1>
          
          <div className="flex items-center gap-3 mb-4">
             <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} className={i < Math.floor(rating) ? "text-amber-400" : "text-slate-200"} fill={i < Math.floor(rating) ? "currentColor" : "none"} />
                ))}
             </div>
             <span className="text-xs font-semibold text-[var(--text-main)]">{rating.toFixed(1)}</span>
             <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
             <span className="text-xs text-[var(--text-muted)] underline decoration-slate-300 hover:text-[var(--primary)] transition-colors cursor-pointer">{reviewsCount} Reviews</span>
          </div>
          
          {/* Pricing Section */}
          <div className="flex items-end gap-3 pb-4 border-b border-dashed border-[var(--border-light)]">
            <div className="flex flex-col">
               <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-0.5">Total Price</span>
               <div className="flex items-center gap-2.5">
                  <span className="text-3xl md:text-4xl font-black text-[var(--text-main)] tracking-tighter">
                     ₹{discountPrice.toFixed(0)}
                  </span>
                  {product.discount > 0 && (
                    <div className="flex justify-center items-center h-full pb-1">
                       <span className="px-1.5 py-0.5 bg-gradient-to-r from-rose-500 to-rose-600 text-white text-[9px] font-black uppercase tracking-wider rounded-md shadow-sm">
                          Save {product.discount}%
                       </span>
                    </div>
                  )}
               </div>
            </div>
            {product.discount > 0 && (
               <span className="text-lg text-slate-400 font-medium line-through mb-1 ml-1.5 decoration-2 decoration-rose-500/30">
                  ₹{product.price}
               </span>
            )}
          </div>

          <p className="text-[14px] text-[var(--text-muted)] leading-relaxed py-4 font-medium">
            {product.description}
          </p>

          {/* ── Configurations (Color & Size) ── */}
          <div className="space-y-6 pb-6 border-b border-dashed border-[var(--border-light)]">
            
            {/* Color Selector */}
            {product.colors?.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                   <h4 className="text-sm font-bold text-[var(--text-main)]">Color Selection</h4>
                   <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{selectedColor || "Select"}</span>
                </div>
                <div className="flex flex-wrap gap-3">
                  {product.colors.map((color, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedColor(color)}
                      className={`relative w-9 h-9 rounded-full transition-all duration-300 outline-none ${
                        selectedColor === color 
                          ? 'scale-110 shadow-md ring-2 ring-[var(--text-main)] ring-offset-2' 
                          : 'hover:scale-110 ring-1 ring-slate-200 ring-offset-1'
                      }`}
                      style={{ backgroundColor: color }}
                      title={color}
                    >
                      {selectedColor === color && (
                        <div className="absolute inset-0 flex items-center justify-center mix-blend-difference text-white">
                           <div className="w-2 h-2 rounded-full bg-white shadow-sm"></div>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size Selector */}
            {product.sizes?.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                   <h4 className="text-sm font-bold text-[var(--text-main)]">Choose Size</h4>
                   <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{selectedSize || "Select"}</span>
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {product.sizes.map((size, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedSize(size)}
                      className={`min-w-[50px] h-9 px-3 flex items-center justify-center rounded-xl font-bold text-xs transition-all duration-300 outline-none ${
                        selectedSize === size
                          ? "bg-[var(--text-main)] text-white shadow-lg shadow-slate-900/20 transform -translate-y-0.5"
                          : "bg-white border-2 border-slate-200 text-slate-600 hover:border-[var(--text-main)] hover:text-[var(--text-main)]"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ── Action Buttons ── */}
          <div className="flex flex-col sm:flex-row gap-3 pt-6">
            <Button 
               variant="outline"
               className="flex-1 h-12 rounded-2xl text-xs font-bold gap-2.5 border-2 border-[var(--text-main)] text-[var(--text-main)] hover:bg-[var(--text-main)] hover:text-white transition-all shadow-sm group"
               onClick={handleAddToCart}
               disabled={product.stock === 0}
            >
              <ShoppingBag size={18} className="group-hover:-translate-y-0.5 group-hover:rotate-[-10deg] transition-transform" />
              Add to Cart
            </Button>
            <Button 
               className="flex-1 h-12 rounded-2xl text-xs font-bold gap-2.5 shadow-[0_8px_20px_-6px_rgba(249,115,22,0.5)] bg-gradient-to-r from-[var(--accent)] to-orange-500 text-white hover:shadow-[0_12px_24px_-8px_rgba(249,115,22,0.6)] hover:-translate-y-0.5 transition-all group border-none"
               disabled={product.stock === 0}
            >
              <Zap size={18} fill="currentColor" className="group-hover:scale-110 transition-transform" />
              Buy It Now
            </Button>
          </div>

          {/* ── Premium Trust Badges ── */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-8 mt-6 bg-slate-50 rounded-2xl p-4">
             <div className="flex flex-col items-center gap-1.5 text-center group cursor-default">
                <div className="p-2 bg-white text-blue-600 rounded-xl shadow-sm border border-slate-100 group-hover:shadow-md transition-shadow group-hover:text-[var(--primary)]"><Truck size={18} /></div>
                <div>
                   <p className="text-[10px] font-bold text-[var(--text-main)] uppercase tracking-tight">Free Delivery</p>
                   <p className="text-[9px] text-[var(--text-muted)] mt-0.5">Orders over ₹999</p>
                </div>
             </div>
             <div className="flex flex-col items-center gap-1.5 text-center group cursor-default">
                <div className="p-2 bg-white text-emerald-600 rounded-xl shadow-sm border border-slate-100 group-hover:shadow-md transition-shadow"><ShieldCheck size={18} /></div>
                <div>
                   <p className="text-[10px] font-bold text-[var(--text-main)] uppercase tracking-tight">100% Authentic</p>
                   <p className="text-[9px] text-[var(--text-muted)] mt-0.5">Quality Guaranteed</p>
                </div>
             </div>
             <div className="flex flex-col items-center gap-1.5 text-center group cursor-default">
                <div className="p-2 bg-white text-purple-600 rounded-xl shadow-sm border border-slate-100 group-hover:shadow-md transition-shadow"><RotateCcw size={18} /></div>
                <div>
                   <p className="text-[10px] font-bold text-[var(--text-main)] uppercase tracking-tight">Easy Returns</p>
                   <p className="text-[9px] text-[var(--text-muted)] mt-0.5">30-Day Policy</p>
                </div>
             </div>
          </div>
        </div>
      </div>
      
      {/* ── Recommended Products Timeline ── */}
      <div className="pt-24 border-t border-[var(--border-light)]">
        <Recommendproduct products={recommendedProducts} />
      </div>
    </div>
  );
};

export default Productdetails;
