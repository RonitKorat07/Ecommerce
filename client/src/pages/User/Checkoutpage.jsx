import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { placeOrder } from '../../redux/Orderslice';
import { useNavigate } from "react-router-dom";
import { clearCart } from "../../redux/Cartslice";
import { CheckCircle, CreditCard, Truck, ShieldCheck, ArrowLeft, MapPin, Phone, Mail, User, ChevronRight } from "lucide-react";
import Button from "../../components/UI/Button";
import { Card, CardBody, CardHeader, CardFooter } from "../../components/UI/Card";
import Input from "../../components/UI/Input";

const Checkout = () => {
   const [summaryData, setSummaryData] = useState(null);
   const user = useSelector((state) => state.user.user);
   const cartItems = useSelector((state) => state.cart.items);
   const navigate = useNavigate();
   const dispatch = useDispatch();

   useEffect(() => {
      const storedSummary = localStorage.getItem("checkoutSummary");
      if (storedSummary) {
         setSummaryData(JSON.parse(storedSummary));
      } else {
         // Redirect back if no summary data exists
         navigate("/user/addtocart");
      }
      window.scrollTo({ top: 0, behavior: "smooth" });
   }, [navigate]);

   const [formData, setFormData] = useState({
      name: user?.name || "",
      email: user?.email || "",
      phone: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
      paymentMethod: "cod",
   });

   const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
   };

   const handleSubmit = (e) => {
      e.preventDefault();

      if (!summaryData) {
         toast.error("Checkout summary missing. Please go back to bag.");
         return;
      }

      const confirmed = window.confirm("Ready to complete your purchase? By clicking OK, your order will be placed.");
      if (!confirmed) return;

      dispatch(placeOrder({
         userId: user._id,
         cartitem: cartItems,
         formData,
         summaryData: summaryData?.checkout || summaryData, // Support both nested or flat
      }))
         .unwrap()
         .then(() => {
            toast.success('Your order has been placed successfully!');
            dispatch(clearCart());
            localStorage.removeItem('checkoutSummary');
            navigate('/user/myorder', { replace: true });
         })
         .catch((error) => {
            toast.error('Failed to place order. Please check your details and try again.');
            console.error("Order placement error:", error);
         });
   };

   return (
      <div className="min-h-screen bg-[var(--bg-body)] pb-16 font-[var(--font-body)] animate-in fade-in duration-700">
         <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 pt-4">
            
            {/* Modern Step Indicator (Synchronized & Compact) */}
            <div className="flex items-center justify-between mb-6 overflow-x-auto pb-1 scrollbar-none">
               <div className="flex items-center gap-6 min-w-max">
                  <div className="flex items-center gap-2.5 cursor-pointer group" onClick={() => navigate('/user/addtocart')}>
                     <div className="w-7 h-7 rounded-full bg-[var(--success)] text-white flex items-center justify-center transition-premium group-hover:scale-110">
                        <CheckCircle size={16} />
                     </div>
                     <span className="text-[13px] font-bold text-[var(--success)] tracking-tight">Shopping Bag</span>
                  </div>
                  <ChevronRight size={14} className="text-[var(--border-light)]" />
                  <div className="flex items-center gap-2.5">
                     <div className="w-7 h-7 rounded-full bg-[var(--primary)] text-white flex items-center justify-center text-[10px] font-bold shadow-md shadow-[var(--primary)]/20 ring-2 ring-[var(--primary-light)]">2</div>
                     <span className="text-[13px] font-bold text-[var(--primary)] tracking-tight">Checkout</span>
                  </div>
                  <ChevronRight size={14} className="text-[var(--border-light)]" />
                  <div className="flex items-center gap-2.5 opacity-40">
                     <div className="w-7 h-7 rounded-full bg-white border border-[var(--border-light)] text-[var(--text-muted)] flex items-center justify-center text-[10px] font-bold">3</div>
                     <span className="text-[13px] font-semibold text-[var(--text-muted)] tracking-tight">Payment</span>
                  </div>
               </div>
            </div>

            <div className="flex items-baseline justify-between mb-8 border-b border-[var(--border-light)] pb-4">
               <h1 className="text-2xl md:text-3xl font-extrabold text-[var(--text-main)] font-[var(--font-heading)] tracking-tight">
                  Secure <span className="text-[var(--primary)]">Checkout</span>
               </h1>
               <div className="hidden sm:flex items-center gap-2 text-[var(--text-muted)] font-medium text-[10px] bg-[var(--bg-section)] px-3 py-1 rounded-full border border-[var(--border-light)] uppercase tracking-wider">
                  <ShieldCheck size={12} className="text-[var(--success)]" />
                  100% Secure Transaction
               </div>
            </div>

            <div className="grid lg:grid-cols-12 gap-8 items-start">
               {/* Left: Checkout Form */}
               <div className="lg:col-span-8 space-y-6">
                  <form onSubmit={handleSubmit} className="space-y-6">
                     {/* Personal Info */}
                     <div className="bg-[var(--bg-card)] rounded-[24px] border border-[var(--border-light)] shadow-sm overflow-hidden animate-in slide-in-from-left duration-500 hover:shadow-md transition-all duration-300 group/card">
                        <div className="bg-[var(--bg-section)]/50 px-7 py-5 border-b border-[var(--border-light)] flex items-center gap-3">
                           <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center text-[var(--primary)] shadow-sm group-hover/card:scale-110 transition-transform"><User size={18} /></div>
                           <h2 className="text-[15px] font-black text-[var(--text-main)] font-[var(--font-heading)] uppercase tracking-tight">Personal Information</h2>
                        </div>
                        <div className="p-7 grid md:grid-cols-2 gap-6">
                           <Input
                              label="Full Name"
                              name="name"
                              required
                              value={formData.name}
                              onChange={handleChange}
                              placeholder="Your full name"
                              className="rounded-xl border-slate-200 text-sm h-11"
                           />
                           <Input
                              label="Email Address"
                              type="email"
                              name="email"
                              required
                              value={formData.email}
                              onChange={handleChange}
                              placeholder="yourname@example.com"
                              className="rounded-xl border-slate-200 text-sm h-11"
                           />
                           <div className="md:col-span-2">
                              <Input
                                 label="Phone Number"
                                 name="phone"
                                 required
                                 value={formData.phone}
                                 onChange={handleChange}
                                 placeholder="+91 XXXXX XXXXX"
                                 className="rounded-xl border-slate-200 text-sm h-11"
                                 icon={Phone}
                              />
                           </div>
                        </div>
                     </div>

                     {/* Shipping Address */}
                     <div className="bg-[var(--bg-card)] rounded-[24px] border border-[var(--border-light)] shadow-sm overflow-hidden animate-in slide-in-from-left duration-600 hover:shadow-md transition-all duration-300 group/card">
                        <div className="bg-[var(--bg-section)]/50 px-7 py-5 border-b border-[var(--border-light)] flex items-center gap-3">
                           <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center text-[var(--accent)] shadow-sm group-hover/card:scale-110 transition-transform"><MapPin size={18} /></div>
                           <h2 className="text-[15px] font-black text-[var(--text-main)] font-[var(--font-heading)] uppercase tracking-tight">Shipping Address</h2>
                        </div>
                        <div className="p-7 space-y-6">
                           <div className="space-y-2">
                              <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-extrawide pl-1">Street Address</label>
                              <textarea
                                 name="address"
                                 rows={2}
                                 required
                                 value={formData.address}
                                 onChange={handleChange}
                                 className="w-full bg-white border border-slate-200 rounded-2xl px-5 py-4 text-sm font-medium text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)] transition-all placeholder:text-slate-300 min-h-[90px]"
                                 placeholder="House no., Apartment, Locality..."
                              ></textarea>
                           </div>
                           <div className="grid md:grid-cols-3 gap-6">
                              <Input label="City" name="city" required value={formData.city} onChange={handleChange} placeholder="City" className="rounded-xl border-slate-200 text-sm h-11" />
                              <Input label="State" name="state" required value={formData.state} onChange={handleChange} placeholder="State" className="rounded-xl border-slate-200 text-sm h-11" />
                              <Input label="Pincode" name="pincode" required value={formData.pincode} onChange={handleChange} placeholder="123456" className="rounded-xl border-slate-200 text-sm h-11" />
                           </div>
                        </div>
                     </div>

                     {/* Payment Method */}
                     <div className="bg-[var(--bg-card)] rounded-[24px] border border-[var(--border-light)] shadow-sm overflow-hidden animate-in slide-in-from-left duration-700 hover:shadow-md transition-all duration-300 group/card">
                        <div className="bg-[var(--bg-section)]/50 px-7 py-5 border-b border-[var(--border-light)] flex items-center gap-3">
                           <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center text-[var(--success)] shadow-sm group-hover/card:scale-110 transition-transform"><CreditCard size={18} /></div>
                           <h2 className="text-[15px] font-black text-[var(--text-main)] font-[var(--font-heading)] uppercase tracking-tight">Payment Method</h2>
                        </div>
                        <div className="p-7">
                           <div
                              className={`flex items-center justify-between p-5 rounded-2xl border-2 transition-all duration-300 cursor-pointer group/pay ${formData.paymentMethod === 'cod' ? 'border-[var(--primary)] bg-[var(--primary-light)]/40 shadow-sm' : 'border-[var(--border-light)] bg-[var(--bg-section)]/50 hover:bg-[var(--bg-section)]'}`}
                              onClick={() => setFormData({ ...formData, paymentMethod: 'cod' })}
                           >
                              <div className="flex items-center gap-5">
                                 <div className={`p-4 rounded-xl shadow-sm transition-all duration-500 ${formData.paymentMethod === 'cod' ? 'bg-[var(--primary)] text-white scale-105' : 'bg-white text-[var(--text-muted)] group-hover/pay:text-[var(--text-main)]'}`}>
                                    <Truck size={28} strokeWidth={1.5} />
                                 </div>
                                 <div className="space-y-1">
                                    <h4 className="font-black text-[var(--text-main)] uppercase text-xs tracking-tight">Cash on Delivery</h4>
                                    <p className="text-[11px] text-[var(--text-muted)] font-medium">Pay securely at your doorstep</p>
                                 </div>
                              </div>
                              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${formData.paymentMethod === 'cod' ? 'border-[var(--primary)] bg-[var(--primary)] shadow-md shadow-[var(--primary)]/20' : 'border-[var(--border-light)] bg-white'}`}>
                                 {formData.paymentMethod === 'cod' && <div className="w-2 h-2 rounded-full bg-white animate-in zoom-in duration-300"></div>}
                              </div>
                           </div>
                           <p className="mt-8 text-center text-[10px] font-bold text-[var(--text-muted)] opacity-60 uppercase tracking-widest bg-[var(--bg-section)]/50 py-3 rounded-xl border border-[var(--border-light)] border-dashed">
                              Online payments (UPI/Cards) arriving soon
                           </p>
                        </div>
                     </div>

                     {/* Action Buttons */}
                     <div className="flex flex-col sm:flex-row gap-5 pt-4">
                        <button
                           type="button"
                           onClick={() => navigate('/user/addtocart')}
                           className="flex-1 h-14 rounded-2xl bg-white border border-[var(--border-light)] text-xs font-black uppercase tracking-widest text-[var(--text-muted)] hover:border-[var(--primary)] hover:text-[var(--primary)] hover:bg-[var(--bg-section)]/30 transition-all duration-300 flex items-center justify-center gap-2 group shadow-sm active:scale-95"
                        >
                           <ArrowLeft size={16} className="group-hover:-translate-x-2 transition-transform duration-300" />
                           Return to Bag
                        </button>
                        <Button
                           variant="orange"
                           type="submit"
                           className="flex-[2] h-14 rounded-2xl text-[13px] font-black tracking-[0.2em] shadow-xl shadow-[var(--accent)]/30 uppercase relative overflow-hidden group border-none hover:scale-[1.02] active:scale-95 transition-all duration-300"
                           style={{ background: 'var(--gradient-accent)' }}
                        >
                           <span className="relative z-10 flex items-center gap-2.5">
                              Place Order Now
                              <ChevronRight size={20} className="group-hover:translate-x-2 transition-transform duration-300" strokeWidth={3} />
                           </span>
                           <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                           <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer transition-transform duration-1000"></div>
                        </Button>
                     </div>
                  </form>
               </div>

               {/* Right: Summary Card */}
               <div className="lg:col-span-4 lg:sticky lg:top-20">
                  <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-light)] shadow-lg shadow-slate-200/40 overflow-hidden animate-in slide-in-from-right duration-700">
                     <div className="bg-[var(--bg-section)]/30 px-5 py-4 border-b border-[var(--border-light)]">
                        <h3 className="text-base font-bold text-[var(--text-main)] font-[var(--font-heading)] flex items-center gap-2">
                           Order Summary
                        </h3>
                     </div>
                     <div className="p-5 space-y-4 text-[13px]">
                        <div className="space-y-2.5">
                           <div className="flex justify-between text-[var(--text-muted)] font-medium">
                              <span>Subtotal</span>
                              <span className="text-[var(--text-main)] font-bold">₹{Math.floor(summaryData?.checkout?.subtotal || 0).toLocaleString()}</span>
                           </div>
                           <div className="flex justify-between text-[var(--success)] font-bold">
                              <span>Saved Extra</span>
                              <span className="bg-[var(--success)]/10 px-2 py-0.5 rounded-md">-₹{Math.floor(summaryData?.checkout?.discount || 0).toLocaleString()}</span>
                           </div>
                           <div className="flex justify-between text-[var(--text-muted)] font-medium">
                              <span>Shipping</span>
                              <span className="text-[var(--success)] font-bold uppercase text-[9px] tracking-widest bg-[var(--success)]/10 px-2 py-0.5 rounded-md">
                                 {summaryData?.checkout?.shipping === 0 ? "Free" : `₹${summaryData?.checkout?.shipping}`}
                              </span>
                           </div>
                           <div className="flex justify-between text-[var(--text-muted)] font-medium">
                              <span>Taxes (GST)</span>
                              <span className="text-[var(--text-main)] font-bold">₹{Math.floor(summaryData?.checkout?.tax || 0).toLocaleString()}</span>
                           </div>
                        </div>

                        <div className="pt-4 border-t border-dashed border-[var(--border-light)]">
                           <div className="flex justify-between items-end">
                              <div className="space-y-0.5">
                                 <span className="block text-[9px] font-black text-[var(--text-muted)] uppercase tracking-widest">Grand Total</span>
                                 <span className="text-[8px] text-[var(--success)] font-bold bg-[var(--success)]/10 px-1.5 py-0.5 rounded">Final price</span>
                              </div>
                              <span className="text-2xl font-black text-[var(--primary)] tracking-tight">₹{Math.floor(summaryData?.checkout?.totalAmount || 0).toLocaleString()}</span>
                           </div>
                        </div>

                        <div className="pt-4 space-y-3">
                           <div className="p-3 bg-[var(--bg-section)]/50 rounded-xl border border-[var(--border-light)] flex items-start gap-2.5 group transition-premium hover:bg-white hover:shadow-md">
                              <ShieldCheck size={18} className="text-[var(--success)] mt-0.5" />
                              <div className="space-y-0.5">
                                 <p className="text-[9px] font-black text-[var(--text-main)] uppercase tracking-tight">Safe Delivery Guarantee</p>
                                 <p className="text-[9px] text-[var(--text-muted)] font-medium leading-tight">Your package is handled with 100% safety protocols.</p>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
};

export default Checkout;
