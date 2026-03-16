import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  removeFromCart,
  updateCartQuantity,
  fetchCart,
  fetchCheckoutSummary,
} from "../../redux/Cartslice";
import { ShoppingBag, Trash2, Minus, Plus, ArrowLeft, ShieldCheck, Truck, ChevronRight } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Button from "../../components/UI/Button";

const Addtocart = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);
  const user = useSelector((state) => state.user.user);
  const navigate = useNavigate();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  useEffect(() => {
    if (user?._id) {
      dispatch(fetchCart(user._id));
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [dispatch, user?._id]);

  const handleRemove = (itemId) => {
    dispatch(removeFromCart({ userId: user._id, itemId }));
    toast.success("Item removed from bag");
  };

  const handleQuantityChange = (item, newQuantity) => {
    if (newQuantity < 1) return;
    dispatch(
      updateCartQuantity({
        userId: user._id,
        productId: item.productId._id,
        quantity: newQuantity,
        selectedColor: item.selectedColor,
        selectedSize: item.selectedSize,
      })
    )
      .unwrap()
      .catch(() => toast.error("Stock limit reached"));
  };

  const handleCheckout = () => {
    setIsCheckingOut(true);
    dispatch(fetchCheckoutSummary({ userId: user._id, cartItems }))
      .unwrap()
      .then((result) => {
        localStorage.setItem("checkoutSummary", JSON.stringify(result));
        setTimeout(() => navigate("/user/addtocart/checkout"), 500);
      })
      .finally(() => setIsCheckingOut(false));
  };

  const subtotal = cartItems.reduce((acc, item) => {
    const price = item.productId.price - (item.productId.price * (item.productId.discount || 0)) / 100;
    return acc + price * item.quantity;
  }, 0);

  const totalDiscount = cartItems.reduce((acc, item) => {
    return acc + (item.productId.price * (item.productId.discount || 0) / 100) * item.quantity;
  }, 0);

  return (
    <div className="min-h-screen bg-[var(--bg-body)] pb-16 font-[var(--font-body)] animate-in fade-in duration-700">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        
        {/* Modern Step Indicator (Enhanced Breadcrumb) */}
        <div className="flex items-center justify-between mb-8 overflow-x-auto pb-2 scrollbar-none">
          <div className="flex items-center gap-8 min-w-max">
            <div className="flex items-center gap-3 group">
              <div className="w-8 h-8 rounded-full bg-[var(--primary)] text-white flex items-center justify-center text-xs font-bold shadow-lg shadow-[var(--primary)]/20 ring-4 ring-[var(--primary-light)] transition-premium">1</div>
              <span className="text-sm font-bold text-[var(--primary)] tracking-tight">Shopping Bag</span>
            </div>
            <ChevronRight size={16} className="text-[var(--border-light)]" />
            <div className="flex items-center gap-3 opacity-40 group hover:opacity-100 transition-opacity cursor-pointer" onClick={() => handleCheckout()}>
              <div className="w-8 h-8 rounded-full bg-white border border-[var(--border-light)] text-[var(--text-muted)] flex items-center justify-center text-xs font-bold transition-premium">2</div>
              <span className="text-sm font-semibold text-[var(--text-muted)] tracking-tight">Checkout</span>
            </div>
            <ChevronRight size={16} className="text-[var(--border-light)]" />
            <div className="flex items-center gap-3 opacity-40">
              <div className="w-8 h-8 rounded-full bg-white border border-[var(--border-light)] text-[var(--text-muted)] flex items-center justify-center text-xs font-bold">3</div>
              <span className="text-sm font-semibold text-[var(--text-muted)] tracking-tight">Payment</span>
            </div>
          </div>
        </div>

        <div className="flex items-baseline justify-between mb-8 border-b border-[var(--border-light)] pb-6">
          <h1 className="text-3xl md:text-4xl font-extrabold text-[var(--text-main)] font-[var(--font-heading)] tracking-tight">
            Shopping <span className="text-[var(--primary)]">Bag</span>
          </h1>
          <p className="text-[var(--text-muted)] font-medium text-sm bg-[var(--bg-section)] px-3 py-1 rounded-full">
            {cartItems.reduce((acc, item) => acc + item.quantity, 0)} Items
          </p>
        </div>

        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-[var(--bg-card)] rounded-3xl border border-[var(--border-light)] shadow-[var(--shadow-sm)] animate-in zoom-in duration-500">
            <div className="w-24 h-24 bg-[var(--primary-light)] rounded-full flex items-center justify-center text-[var(--primary)] mb-6 transition-premium hover:scale-110">
              <ShoppingBag size={42} strokeWidth={1.5} />
            </div>
            <h2 className="text-2xl font-bold text-[var(--text-main)] font-[var(--font-heading)] mb-2">Your bag is empty</h2>
            <p className="text-[15px] text-[var(--text-muted)] mb-8 max-w-xs text-center leading-relaxed">Looks like you haven't added anything yet. Start exploring our latest collections.</p>
            <Button 
              onClick={() => navigate("/")} 
              className="bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white rounded-full px-8 py-3.5 text-sm font-bold shadow-xl shadow-[var(--primary)]/20 transition-premium active:scale-95"
            >
              Start Shopping
            </Button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-12 gap-8 items-start">
            
            {/* Left: Product List */}
            <div className="lg:col-span-8 space-y-5">
              {cartItems.map((item) => (
                <div 
                  key={item._id} 
                  className="group flex flex-col sm:flex-row gap-5 p-5 bg-[var(--bg-card)] rounded-2xl border border-[var(--border-light)] shadow-sm hover:shadow-xl hover:border-[var(--primary)]/20 transition-premium animate-in slide-in-from-bottom-2 duration-500"
                >
                  {/* Product Image */}
                  <div className="w-full sm:w-32 h-40 flex-shrink-0 bg-[var(--bg-section)] rounded-xl overflow-hidden border border-[var(--border-light)] relative group-hover:shadow-inner">
                    <img
                      src={item.productId.images[0]}
                      alt={item.productId.name}
                      className="w-full h-full object-contain mix-blend-multiply transition-transform duration-700 group-hover:scale-110 p-2"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex flex-1 flex-col justify-between py-1">
                    
                    {/* Top Section: Title & Price */}
                    <div className="flex justify-between items-start gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                           <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--primary)] opacity-70">{item.productId.category?.name}</span>
                        </div>
                        <h3 className="text-lg font-bold text-[var(--text-main)] font-[var(--font-heading)] leading-tight group-hover:text-[var(--primary)] transition-colors line-clamp-2">
                          {item.productId.name}
                        </h3>
                        
                        <div className="flex flex-wrap items-center gap-3">
                          <span className="flex items-center gap-1.5 px-3 py-1 bg-[var(--bg-section)] rounded-full text-[12px] font-bold text-[var(--text-main)] border border-[var(--border-light)]">
                            <span className="text-[var(--text-muted)] font-medium">Size:</span> {item.selectedSize}
                          </span>
                          <span className="flex items-center gap-1.5 px-3 py-1 bg-[var(--bg-section)] rounded-full text-[12px] font-bold text-[var(--text-main)] border border-[var(--border-light)]">
                            <span className="text-[var(--text-muted)] font-medium">Color:</span>
                            <span 
                              className="w-3 h-3 rounded-full shadow-sm ring-1 ring-white" 
                              style={{ backgroundColor: item.selectedColor }} 
                            />
                            <span className="capitalize">{item.selectedColor}</span>
                          </span>
                        </div>
                      </div>

                      <div className="text-right flex-shrink-0 bg-[var(--bg-section)]/50 p-3 rounded-2xl border border-[var(--border-light)] transition-premium group-hover:bg-white">
                        <p className="text-lg font-black text-[var(--price-color)] tracking-tight">
                          ₹{Math.floor((item.productId.price - (item.productId.price * (item.productId.discount || 0)) / 100) * item.quantity).toLocaleString()}
                        </p>
                        {item.productId.discount > 0 && (
                          <div className="flex flex-col items-end">
                            <p className="text-[11px] text-[var(--text-muted)] line-through opacity-60">
                              ₹{(item.productId.price * item.quantity).toLocaleString()}
                            </p>
                            <p className="text-[10px] text-[var(--success)] font-bold bg-emerald-50 px-1.5 py-0.5 rounded-md mt-1 italic">
                              {item.productId.discount}% OFF
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Bottom Section: Quantity & Remove */}
                    <div className="flex items-center justify-between mt-6 border-t border-[var(--border-light)] pt-4">
                      
                      <div className="flex items-center gap-6">
                        {/* Modern Quantity Selector */}
                        <div className="flex items-center bg-[var(--bg-section)] rounded-xl p-1 border border-[var(--border-light)] h-10 shadow-inner">
                          <button 
                            onClick={() => handleQuantityChange(item, item.quantity - 1)}
                            className="w-8 h-8 flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--primary)] hover:bg-white transition-all rounded-lg"
                          >
                            <Minus size={14} strokeWidth={2.5} />
                          </button>
                          <span className="w-10 text-center text-sm font-black text-[var(--text-main)]">
                            {item.quantity}
                          </span>
                          <button 
                            onClick={() => handleQuantityChange(item, item.quantity + 1)}
                            className="w-8 h-8 flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--primary)] hover:bg-white transition-all rounded-lg"
                          >
                            <Plus size={14} strokeWidth={2.5} />
                          </button>
                        </div>

                        {/* Remove Button */}
                        <button 
                          onClick={() => handleRemove(item._id)}
                          className="flex items-center gap-2 text-xs font-bold text-[var(--text-muted)] hover:text-[var(--danger)] hover:bg-red-50/50 px-3 py-2 rounded-xl transition-all group/remove"
                        >
                          <Trash2 size={16} className="group-hover/remove:scale-110 transition-transform" />
                          <span>REMOVE</span>
                        </button>
                      </div>

                      <p className="text-[10px] font-black text-[var(--text-muted)] opacity-40 uppercase tracking-widest hidden sm:block">
                        Unit: ₹{Math.floor(item.productId.price - (item.productId.price * (item.productId.discount || 0)) / 100).toLocaleString()}
                      </p>
                    </div>

                  </div>
                </div>
              ))}

              {/* Trust Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                <div className="flex items-center gap-4 p-5 rounded-2xl bg-white border border-[var(--border-light)] shadow-sm hover:shadow-md transition-premium">
                  <div className="p-3 bg-blue-50 text-[var(--primary)] rounded-2xl shadow-sm"><Truck size={24} strokeWidth={1.5} /></div>
                  <div>
                    <h4 className="text-sm font-bold text-[var(--text-main)]">Fast Delivery</h4>
                    <p className="text-xs text-[var(--text-muted)] font-medium">Free shipping on all bag items</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-5 rounded-2xl bg-white border border-[var(--border-light)] shadow-sm hover:shadow-md transition-premium">
                  <div className="p-3 bg-emerald-50 text-[var(--success)] rounded-2xl shadow-sm"><ShieldCheck size={24} strokeWidth={1.5} /></div>
                  <div>
                    <h4 className="text-sm font-bold text-[var(--text-main)]">Secure Checkout</h4>
                    <p className="text-xs text-[var(--text-muted)] font-medium">100% encrypted payment system</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Summary */}
            <div className="lg:col-span-4 lg:sticky lg:top-24">
              <div className="bg-[var(--bg-card)] p-6 rounded-3xl border border-[var(--border-light)] shadow-xl shadow-slate-200/50">
                <h2 className="text-xl font-extrabold text-[var(--text-main)] font-[var(--font-heading)] border-b border-[var(--border-light)] pb-5 mb-6 flex items-center gap-3">
                  Summary
                </h2>
                
                <div className="space-y-4 text-sm">
                  <div className="flex justify-between text-[var(--text-muted)] font-medium">
                    <span>Bag Total</span>
                    <span className="text-[var(--text-main)] font-bold">₹{Math.floor(subtotal + totalDiscount).toLocaleString()}</span>
                  </div>
                  {totalDiscount > 0 && (
                    <div className="flex justify-between text-[var(--success)] font-bold">
                      <span>Bag Discount</span>
                      <span className="bg-emerald-50 px-2 py-0.5 rounded-lg">- ₹{Math.floor(totalDiscount).toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-[var(--text-muted)] font-medium">
                    <span>Shipping Fee</span>
                    <span className="text-[var(--success)] font-bold uppercase text-[10px] tracking-widest bg-emerald-50 px-2 py-0.5 rounded-lg">Free</span>
                  </div>
                  
                  <div className="pt-6 mt-4 border-t border-dashed border-[var(--border-light)] flex justify-between items-end">
                    <div className="space-y-1">
                      <span className="block text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">Total Amount</span>
                      <span className="text-[8px] text-[var(--text-muted)] font-medium bg-[var(--bg-section)] px-2 py-0.5 rounded-md">Inclusive of all taxes</span>
                    </div>
                    <span className="text-3xl font-black text-[var(--primary)] tracking-tight">
                      ₹{Math.floor(subtotal).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="mt-8 space-y-4">
                  <Button
                    onClick={handleCheckout}
                    loading={isCheckingOut}
                    className="w-full py-4 rounded-2xl text-base font-black text-white shadow-xl shadow-[var(--accent)]/30 transition-premium border-none relative overflow-hidden group"
                    style={{ background: 'var(--gradient-accent)' }}
                  >
                    <span className="relative z-10 flex items-center justify-center gap-3 uppercase tracking-widest">
                      Place Order
                      {!isCheckingOut && <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" /> }
                    </span>
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                  </Button>
                  
                  <button 
                    onClick={() => navigate("/")}
                    className="w-full py-2 text-xs font-black text-[var(--text-muted)] hover:text-[var(--primary)] flex items-center justify-center gap-2 transition-all uppercase tracking-widest group"
                  >
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                    Continue Shopping
                  </button>
                </div>

                {/* Footer Security Icons */}
                <div className="mt-10 pt-8 border-t border-[var(--border-light)] opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
                   <div className="flex justify-center gap-4 mb-4">
                      {[1,2,3,4].map(i => (
                         <div key={i} className="w-10 h-6 bg-[var(--bg-section)] rounded border border-[var(--border-light)] flex items-center justify-center text-[6px] font-black tracking-tighter">CARD</div>
                      ))}
                   </div>
                   <p className="text-[9px] text-center font-bold tracking-widest uppercase">100% Secure Checkout</p>
                </div>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default Addtocart;