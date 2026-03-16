import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { placeOrder } from '../../redux/Orderslice';
import { useNavigate } from "react-router-dom";
import { clearCart } from "../../redux/Cartslice";
import { CheckCircle, CreditCard, Truck, ShieldCheck, ArrowLeft, MapPin, Phone, Mail, User } from "lucide-react";
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
         <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 pt-6">
            
            {/* Modern Step Indicator (Synchronized with Bag) */}
            <div className="flex items-center justify-between mb-8 overflow-x-auto pb-2 scrollbar-none">
               <div className="flex items-center gap-8 min-w-max">
                  <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate('/user/addtocart')}>
                     <div className="w-8 h-8 rounded-full bg-[var(--success)] text-white flex items-center justify-center transition-premium group-hover:scale-110">
                        <CheckCircle size={18} />
                     </div>
                     <span className="text-sm font-bold text-[var(--success)] tracking-tight">Shopping Bag</span>
                  </div>
                  <ChevronRight size={16} className="text-[var(--border-light)]" />
                  <div className="flex items-center gap-3">
                     <div className="w-8 h-8 rounded-full bg-[var(--primary)] text-white flex items-center justify-center text-xs font-bold shadow-lg shadow-[var(--primary)]/20 ring-4 ring-[var(--primary-light)]">2</div>
                     <span className="text-sm font-bold text-[var(--primary)] tracking-tight">Checkout</span>
                  </div>
                  <ChevronRight size={16} className="text-[var(--border-light)]" />
                  <div className="flex items-center gap-3 opacity-40">
                     <div className="w-8 h-8 rounded-full bg-white border border-[var(--border-light)] text-[var(--text-muted)] flex items-center justify-center text-xs font-bold">3</div>
                     <span className="text-sm font-semibold text-[var(--text-muted)] tracking-tight">Payment</span>
                  </div>
               </div>
            </div>

            <div className="flex items-baseline justify-between mb-10 border-b border-[var(--border-light)] pb-6">
               <h1 className="text-3xl md:text-4xl font-extrabold text-[var(--text-main)] font-[var(--font-heading)] tracking-tight">
                  Secure <span className="text-[var(--primary)]">Checkout</span>
               </h1>
               <div className="hidden sm:flex items-center gap-2 text-[var(--text-muted)] font-medium text-xs bg-[var(--bg-section)] px-4 py-1.5 rounded-full border border-[var(--border-light)]">
                  <ShieldCheck size={14} className="text-[var(--success)]" />
                  100% Secure Transaction
               </div>
            </div>

            <div className="grid lg:grid-cols-12 gap-10 items-start">
               {/* Left: Checkout Form */}
               <div className="lg:col-span-8 space-y-8">
                  <form onSubmit={handleSubmit} className="space-y-8">
                     {/* Personal Info */}
                     <div className="bg-[var(--bg-card)] rounded-3xl border border-[var(--border-light)] shadow-sm overflow-hidden animate-in slide-in-from-left duration-500">
                        <div className="bg-[var(--bg-section)]/50 px-8 py-5 border-b border-[var(--border-light)] flex items-center gap-3">
                           <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-[var(--primary)] shadow-sm"><User size={20} /></div>
                           <h2 className="text-lg font-bold text-[var(--text-main)] font-[var(--font-heading)]">Personal Information</h2>
                        </div>
                        <div className="p-8 grid md:grid-cols-2 gap-6">
                           <Input
                              label="Full Name"
                              name="name"
                              required
                              value={formData.name}
                              onChange={handleChange}
                              placeholder="Your full name"
                              className="rounded-xl border-slate-200"
                           />
                           <Input
                              label="Email Address"
                              type="email"
                              name="email"
                              required
                              value={formData.email}
                              onChange={handleChange}
                              placeholder="yourname@example.com"
                              className="rounded-xl border-slate-200"
                           />
                           <div className="md:col-span-2">
                              <Input
                                 label="Phone Number"
                                 name="phone"
                                 required
                                 value={formData.phone}
                                 onChange={handleChange}
                                 placeholder="+91 XXXXX XXXXX"
                                 className="rounded-xl border-slate-200"
                                 icon={<Phone size={16} />}
                              />
                           </div>
                        </div>
                     </div>

                     {/* Shipping Address */}
                     <div className="bg-[var(--bg-card)] rounded-3xl border border-[var(--border-light)] shadow-sm overflow-hidden animate-in slide-in-from-left duration-600">
                        <div className="bg-[var(--bg-section)]/50 px-8 py-5 border-b border-[var(--border-light)] flex items-center gap-3">
                           <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-[var(--accent)] shadow-sm"><MapPin size={20} /></div>
                           <h2 className="text-lg font-bold text-[var(--text-main)] font-[var(--font-heading)]">Shipping Address</h2>
                        </div>
                        <div className="p-8 space-y-6">
                           <div className="space-y-2">
                              <label className="text-[11px] font-black text-[var(--text-muted)] uppercase tracking-widest pl-1">Street Address</label>
                              <textarea
                                 name="address"
                                 rows={3}
                                 required
                                 value={formData.address}
                                 onChange={handleChange}
                                 className="w-full bg-white border border-slate-200 rounded-2xl px-5 py-4 text-sm font-medium text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)] transition-all placeholder:text-slate-300"
                                 placeholder="House no., Apartment, Locality..."
                              ></textarea>
                           </div>
                           <div className="grid md:grid-cols-3 gap-6">
                              <Input label="City" name="city" required value={formData.city} onChange={handleChange} placeholder="City" className="rounded-xl border-slate-200" />
                              <Input label="State" name="state" required value={formData.state} onChange={handleChange} placeholder="State" className="rounded-xl border-slate-200" />
                              <Input label="Pincode" name="pincode" required value={formData.pincode} onChange={handleChange} placeholder="123456" className="rounded-xl border-slate-200" />
                           </div>
                        </div>
                     </div>

                     {/* Payment Method */}
                     <div className="bg-[var(--bg-card)] rounded-3xl border border-[var(--border-light)] shadow-sm overflow-hidden animate-in slide-in-from-left duration-700">
                        <div className="bg-[var(--bg-section)]/50 px-8 py-5 border-b border-[var(--border-light)] flex items-center gap-3">
                           <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-[var(--success)] shadow-sm"><CreditCard size={20} /></div>
                           <h2 className="text-lg font-bold text-[var(--text-main)] font-[var(--font-heading)]">Payment Method</h2>
                        </div>
                        <div className="p-8">
                           <div
                              className={`flex items-center justify-between p-6 rounded-2xl border-2 transition-premium cursor-pointer group ${formData.paymentMethod === 'cod' ? 'border-[var(--primary)] bg-[var(--primary-light)]/30' : 'border-slate-100 bg-slate-50/50 hover:bg-slate-50'}`}
                              onClick={() => setFormData({ ...formData, paymentMethod: 'cod' })}
                           >
                              <div className="flex items-center gap-5">
                                 <div className={`p-4 rounded-xl shadow-sm transition-premium ${formData.paymentMethod === 'cod' ? 'bg-[var(--primary)] text-white' : 'bg-white text-slate-400 group-hover:text-slate-600'}`}>
                                    <Truck size={28} strokeWidth={1.5} />
                                 </div>
                                 <div className="space-y-1">
                                    <h4 className="font-black text-[var(--text-main)] uppercase text-sm tracking-tight">Cash on Delivery</h4>
                                    <p className="text-xs text-[var(--text-muted)] font-medium">Pay securely at your doorstep</p>
                                 </div>
                              </div>
                              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-premium ${formData.paymentMethod === 'cod' ? 'border-[var(--primary)] bg-[var(--primary)]' : 'border-slate-300 bg-white'}`}>
                                 {formData.paymentMethod === 'cod' && <div className="w-2 h-2 rounded-full bg-white animate-in zoom-in duration-300"></div>}
                              </div>
                           </div>
                           <p className="mt-8 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 py-2 rounded-xl border border-slate-100 border-dashed">
                              Online payments (UPI/Cards) arriving soon
                           </p>
                        </div>
                     </div>

                     {/* Action Buttons */}
                     <div className="flex flex-col sm:flex-row gap-4 pt-4">
                        <button
                           type="button"
                           onClick={() => navigate('/user/addtocart')}
                           className="flex-1 h-14 rounded-2xl bg-white border border-slate-200 text-sm font-bold text-[var(--text-muted)] hover:border-[var(--primary)] hover:text-[var(--primary)] transition-premium flex items-center justify-center gap-2 group shadow-sm"
                        >
                           <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                           Return to Bag
                        </button>
                        <Button
                           variant="orange"
                           type="submit"
                           className="flex-[2] h-14 rounded-2xl text-base font-black tracking-widest shadow-xl shadow-[var(--accent)]/20 uppercase relative overflow-hidden group border-none"
                           style={{ background: 'var(--gradient-accent)' }}
                        >
                           <span className="relative z-10 flex items-center gap-3">
                              Place Order Now
                              <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                           </span>
                           <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                        </Button>
                     </div>
                  </form>
               </div>

               {/* Right: Summary Card */}
               <div className="lg:col-span-4 lg:sticky lg:top-24">
                  <div className="bg-[var(--bg-card)] rounded-3xl border border-[var(--border-light)] shadow-xl shadow-slate-200/50 overflow-hidden animate-in slide-in-from-right duration-700">
                     <div className="bg-[var(--bg-section)]/50 px-6 py-5 border-b border-[var(--border-light)]">
                        <h3 className="text-lg font-bold text-[var(--text-main)] font-[var(--font-heading)] flex items-center gap-2">
                           Order Summary
                        </h3>
                     </div>
                     <div className="p-6 space-y-5 text-sm">
                        <div className="space-y-3">
                           <div className="flex justify-between text-[var(--text-muted)] font-medium">
                              <span>Subtotal</span>
                              <span className="text-[var(--text-main)] font-bold">₹{Math.floor(summaryData?.checkout?.subtotal || 0).toLocaleString()}</span>
                           </div>
                           <div className="flex justify-between text-[var(--success)] font-bold">
                              <span>Saved Extra</span>
                              <span className="bg-emerald-50 px-2 py-0.5 rounded-lg">-₹{Math.floor(summaryData?.checkout?.discount || 0).toLocaleString()}</span>
                           </div>
                           <div className="flex justify-between text-[var(--text-muted)] font-medium">
                              <span>Shipping</span>
                              <span className="text-[var(--success)] font-bold uppercase text-[10px] tracking-widest bg-emerald-50 px-2 py-0.5 rounded-lg">
                                 {summaryData?.checkout?.shipping === 0 ? "Free" : `₹${summaryData?.checkout?.shipping}`}
                              </span>
                           </div>
                           <div className="flex justify-between text-[var(--text-muted)] font-medium">
                              <span>Taxes (GST)</span>
                              <span className="text-[var(--text-main)] font-bold">₹{Math.floor(summaryData?.checkout?.tax || 0).toLocaleString()}</span>
                           </div>
                        </div>

                        <div className="pt-6 border-t border-dashed border-[var(--border-light)]">
                           <div className="flex justify-between items-end">
                              <div className="space-y-1">
                                 <span className="block text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest">Grand Total</span>
                                 <span className="text-[8px] text-[var(--success)] font-bold bg-emerald-50 px-2 py-0.5 rounded-md">Final price includes taxes</span>
                              </div>
                              <span className="text-3xl font-black text-[var(--primary)] tracking-tight">₹{Math.floor(summaryData?.checkout?.totalAmount || 0).toLocaleString()}</span>
                           </div>
                        </div>

                        <div className="pt-6 space-y-4">
                           <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-start gap-3 group transition-premium hover:bg-white hover:shadow-md">
                              <ShieldCheck size={20} className="text-[var(--success)] mt-0.5" />
                              <div className="space-y-1">
                                 <p className="text-[10px] font-black text-[var(--text-main)] uppercase tracking-tight">Safe Delivery Guarantee</p>
                                 <p className="text-[10px] text-[var(--text-muted)] font-medium leading-tight">Your package is handled with 100% care and contact-less safety protocols.</p>
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
