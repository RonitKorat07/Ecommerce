import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  removeFromCart,
  updateCartQuantity,
  fetchCart,
  fetchCheckoutSummary,
} from "../../redux/Cartslice";
import { ShoppingBag, Trash2, Minus, Plus, ArrowLeft, ShieldCheck, Truck, ChevronRight } from "lucide-react";
import useToast from "../../components/UI/Toast/useToast";
import { useNavigate } from "react-router-dom";
import Button from "../../components/UI/Button";

const Addtocart = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);
  const user = useSelector((state) => state.user.user);
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  useEffect(() => {
    if (user?._id) {
      dispatch(fetchCart(user._id));
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [dispatch, user?._id]);

  const handleRemove = (itemId) => {
    dispatch(removeFromCart({ userId: user._id, itemId }));
    showToast("Removed", "Item removed from bag", "success");
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
      .catch(() => showToast("Limit Reached", "Stock limit reached", "warning"));
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
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        
        {/* Simplified Step Indicator */}
        <div className="flex items-center justify-between mb-5 overflow-x-auto pb-1 scrollbar-none">
          <div className="flex items-center gap-4 min-w-max">
            <div className="flex items-center gap-2 group">
              <div className="w-6 h-6 rounded-full bg-[var(--primary)] text-white flex items-center justify-center text-[9px] font-bold shadow-md shadow-[var(--primary)]/20 ring-1 ring-[var(--primary-light)] transition-premium">1</div>
              <span className="text-[12px] font-bold text-[var(--primary)] tracking-tight">Cart</span>
            </div>
            <ChevronRight size={12} className="text-[var(--border-light)]" />
            <div className="flex items-center gap-2 opacity-40 group hover:opacity-100 transition-opacity cursor-pointer" onClick={() => handleCheckout()}>
              <div className="w-6 h-6 rounded-full bg-white border border-[var(--border-light)] text-[var(--text-muted)] flex items-center justify-center text-[9px] font-bold transition-premium">2</div>
              <span className="text-[12px] font-semibold text-[var(--text-muted)] tracking-tight">Checkout</span>
            </div>
            <ChevronRight size={12} className="text-[var(--border-light)]" />
            <div className="flex items-center gap-2 opacity-40">
              <div className="w-6 h-6 rounded-full bg-white border border-[var(--border-light)] text-[var(--text-muted)] flex items-center justify-center text-[9px] font-bold">3</div>
              <span className="text-[12px] font-semibold text-[var(--text-muted)] tracking-tight">Payment</span>
            </div>
          </div>
        </div>

        <div className="flex items-baseline justify-between mb-5 border-b border-[var(--border-light)] pb-3">
          <h1 className="text-xl md:text-2xl font-black text-[var(--text-main)] font-[var(--font-heading)] tracking-tighter">
            Shopping <span className="text-[var(--primary)] text-lg">Bag</span>
          </h1>
          <p className="text-[var(--text-muted)] font-black text-[9px] bg-[var(--bg-section)] px-2 py-0.5 rounded-md uppercase tracking-wider">
            {cartItems.reduce((acc, item) => acc + item.quantity, 0)} Items
          </p>
        </div>

        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 bg-[var(--bg-card)] rounded-2xl border border-[var(--border-light)] shadow-sm animate-in zoom-in duration-500">
            <div className="w-20 h-20 bg-[var(--primary-light)] rounded-full flex items-center justify-center text-[var(--primary)] mb-4 transition-premium hover:scale-110">
              <ShoppingBag size={36} strokeWidth={1.5} />
            </div>
            <h2 className="text-xl font-bold text-[var(--text-main)] font-[var(--font-heading)] mb-2">Your bag is empty</h2>
            <p className="text-sm text-[var(--text-muted)] mb-6 max-w-xs text-center leading-relaxed">Looks like you haven't added anything yet. Start exploring our latest collections.</p>
            <Button 
              onClick={() => navigate("/")} 
              className="bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white rounded-full px-6 py-2.5 text-xs font-bold shadow-lg shadow-[var(--primary)]/20 transition-premium active:scale-95"
            >
              Start Shopping
            </Button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-12 gap-6 items-start">
            
            {/* Left: Product List */}
            <div className="lg:col-span-8 space-y-4">
              {cartItems.map((item) => (
                <div 
                  key={item._id} 
                  className="group flex flex-col sm:flex-row gap-4 p-4 bg-[var(--bg-card)] rounded-2xl border border-[var(--border-light)] shadow-sm hover:shadow-md hover:border-[var(--primary)]/10 transition-premium animate-in slide-in-from-bottom-2 duration-500"
                >
                  {/* Product Image (Smaller) */}
                  <div className="w-full sm:w-28 h-32 flex-shrink-0 bg-[var(--bg-section)] rounded-xl overflow-hidden border border-[var(--border-light)] relative group-hover:shadow-inner">
                    <img
                      src={item.productId.images[0]}
                      alt={item.productId.name}
                      className="w-full h-full object-contain mix-blend-multiply transition-transform duration-700 group-hover:scale-110 p-2"
                    />
                  </div>

                  {/* Product Details (Compact) */}
                  <div className="flex flex-1 flex-col justify-between py-0.5">
                    
                    {/* Top Section: Title & Price */}
                    <div className="flex justify-between items-start gap-4">
                      <div className="space-y-1.5 min-w-0">
                        <div className="flex items-center gap-2">
                           <span className="text-[9px] font-bold uppercase tracking-widest text-[var(--primary)] opacity-60">{item.productId.category?.name}</span>
                        </div>
                        <h3 className="text-base font-bold text-[var(--text-main)] font-[var(--font-heading)] leading-tight group-hover:text-[var(--primary)] transition-colors line-clamp-2">
                          {item.productId.name}
                        </h3>
                        
                        <div className="flex flex-wrap items-center gap-2 pt-0.5">
                          <span className="flex items-center gap-1 px-2.5 py-0.5 bg-[var(--bg-section)] rounded-full text-[11px] font-bold text-[var(--text-main)] border border-[var(--border-light)]">
                            <span className="text-[var(--text-muted)] font-medium">Size:</span> {item.selectedSize}
                          </span>
                          <span className="flex items-center gap-1 px-2.5 py-0.5 bg-[var(--bg-section)] rounded-full text-[11px] font-bold text-[var(--text-main)] border border-[var(--border-light)]">
                            <span className="text-[var(--text-muted)] font-medium">Color:</span>
                            <span 
                              className="w-2.5 h-2.5 rounded-full shadow-sm ring-1 ring-white" 
                              style={{ backgroundColor: item.selectedColor }} 
                            />
                            <span className="capitalize">{item.selectedColor}</span>
                          </span>
                        </div>
                      </div>

                      <div className="text-right flex-shrink-0 bg-[var(--bg-section)]/30 p-2.5 rounded-xl border border-[var(--border-light)] transition-premium group-hover:bg-white min-w-[100px]">
                        <p className="text-base font-black text-[var(--primary)] tracking-tight">
                          ₹{Math.floor((item.productId.price - (item.productId.price * (item.productId.discount || 0)) / 100) * item.quantity).toLocaleString()}
                        </p>
                        {item.productId.discount > 0 && (
                          <div className="flex flex-col items-end">
                            <p className="text-[10px] text-[var(--text-muted)] line-through opacity-50">
                              ₹{(item.productId.price * item.quantity).toLocaleString()}
                            </p>
                            <p className="text-[9px] text-[var(--success)] font-bold bg-[var(--success)]/10 px-1 py-0.5 rounded mt-0.5 italic">
                              {item.productId.discount}% OFF
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Bottom Section: Quantity & Remove (Tighter) */}
                    <div className="flex items-center justify-between mt-4 border-t border-[var(--border-light)] pt-3">
                      
                      <div className="flex items-center gap-4">
                        {/* Modern Quantity Selector (Compact) */}
                        <div className="flex items-center bg-[var(--bg-section)] rounded-lg p-0.5 border border-[var(--border-light)] h-8 shadow-inner">
                          <button 
                            onClick={() => handleQuantityChange(item, item.quantity - 1)}
                            className="w-7 h-7 flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--primary)] hover:bg-white transition-all rounded-md"
                          >
                            <Minus size={12} strokeWidth={3} />
                          </button>
                          <span className="w-8 text-center text-xs font-black text-[var(--text-main)]">
                            {item.quantity}
                          </span>
                          <button 
                            onClick={() => handleQuantityChange(item, item.quantity + 1)}
                            className="w-7 h-7 flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--primary)] hover:bg-white transition-all rounded-md"
                          >
                            <Plus size={12} strokeWidth={3} />
                          </button>
                        </div>

                        {/* Remove Button */}
                        <button 
                          onClick={() => handleRemove(item._id)}
                          className="flex items-center gap-1.5 text-[11px] font-bold text-[var(--text-muted)] hover:text-[var(--danger)] hover:bg-[var(--danger)]/10 px-2.5 py-1.5 rounded-lg transition-all group/remove"
                        >
                          <Trash2 size={14} className="group-hover/remove:scale-110 transition-transform" />
                          <span>REMOVE</span>
                        </button>
                      </div>

                      <p className="text-[9px] font-black text-[var(--text-muted)] opacity-30 uppercase tracking-widest hidden sm:block">
                        Unit: ₹{Math.floor(item.productId.price - (item.productId.price * (item.productId.discount || 0)) / 100).toLocaleString()}
                      </p>
                    </div>

                  </div>
                </div>
              ))}

              {/* Trust Badges (Compact) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="flex items-center gap-3 p-4 rounded-xl bg-white border border-[var(--border-light)] shadow-sm hover:shadow-md transition-premium">
                  <div className="p-2.5 bg-[var(--primary-light)] text-[var(--primary)] rounded-xl"><Truck size={20} strokeWidth={1.5} /></div>
                  <div>
                    <h4 className="text-[13px] font-bold text-[var(--text-main)]">Fast Delivery</h4>
                    <p className="text-[11px] text-[var(--text-muted)] font-medium">Free shipping on all items</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-xl bg-white border border-[var(--border-light)] shadow-sm hover:shadow-md transition-premium">
                  <div className="p-2.5 bg-[var(--success)]/10 text-[var(--success)] rounded-xl"><ShieldCheck size={20} strokeWidth={1.5} /></div>
                  <div>
                    <h4 className="text-[13px] font-bold text-[var(--text-main)]">Secure Checkout</h4>
                    <p className="text-[11px] text-[var(--text-muted)] font-medium">100% encrypted payment</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Summary (Compact Card) */}
            <div className="lg:col-span-4 lg:sticky lg:top-20">
              <div className="bg-[var(--bg-card)] p-5 rounded-2xl border border-[var(--border-light)] shadow-lg shadow-slate-200/40">
                <h2 className="text-lg font-extrabold text-[var(--text-main)] font-[var(--font-heading)] border-b border-[var(--border-light)] pb-4 mb-5 flex items-center gap-3">
                  Summary
                </h2>
                
                <div className="space-y-3.5 text-[13px]">
                  <div className="flex justify-between text-[var(--text-muted)] font-medium">
                    <span>Bag Total</span>
                    <span className="text-[var(--text-main)] font-bold">₹{Math.floor(subtotal + totalDiscount).toLocaleString()}</span>
                  </div>
                  {totalDiscount > 0 && (
                    <div className="flex justify-between text-[var(--success)] font-bold">
                      <span>Bag Discount</span>
                      <span className="bg-[var(--success)]/10 px-2 py-0.5 rounded-md">- ₹{Math.floor(totalDiscount).toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-[var(--text-muted)] font-medium">
                    <span>Shipping Fee</span>
                    <span className="text-[var(--success)] font-bold uppercase text-[9px] tracking-widest bg-[var(--success)]/10 px-2 py-0.5 rounded-md">Free</span>
                  </div>
                  
                  <div className="pt-4 mt-2 border-t border-dashed border-[var(--border-light)] flex justify-between items-end">
                    <div className="space-y-0.5">
                      <span className="block text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider">Total</span>
                      <span className="text-[9px] text-[var(--text-muted)] font-medium bg-[var(--bg-section)] px-1.5 py-0.5 rounded">Incl. of taxes</span>
                    </div>
                    <span className="text-2xl font-black text-[var(--primary)] tracking-tight">
                      ₹{Math.floor(subtotal).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <Button
                    onClick={handleCheckout}
                    loading={isCheckingOut}
                    className="w-full h-11 rounded-lg text-xs font-black text-white shadow-lg shadow-[var(--accent)]/15 transition-premium border-none relative overflow-hidden group"
                    style={{ background: 'var(--gradient-accent)' }}
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2 uppercase tracking-widest text-[11px]">
                      Checkout
                      {!isCheckingOut && <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" /> }
                    </span>
                  </Button>
                  
                  <button 
                    onClick={() => navigate("/")}
                    className="w-full py-1 text-[11px] font-black text-[var(--text-muted)] hover:text-[var(--primary)] flex items-center justify-center gap-1.5 transition-all uppercase tracking-widest group"
                  >
                    <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                    Continue Shopping
                  </button>
                </div>

                {/* Footer Security Icons */}
                <div className="mt-8 pt-6 border-t border-[var(--border-light)] opacity-30 grayscale hover:grayscale-0 transition-all duration-500">
                   <div className="flex justify-center gap-3 mb-3">
                      {[1,2,3].map(i => (
                         <div key={i} className="w-8 h-5 bg-[var(--bg-section)] rounded border border-[var(--border-light)] flex items-center justify-center text-[5px] font-black tracking-tighter">CARD</div>
                      ))}
                   </div>
                   <p className="text-[8px] text-center font-bold tracking-widest uppercase">Safe & Secure checkout</p>
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