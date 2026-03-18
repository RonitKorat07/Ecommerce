import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import useToast from "../../components/UI/Toast/useToast";
import useModal from "../../components/UI/Modal/useModal";
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
   const { showToast } = useToast();
   const { openModal } = useModal();

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
         showToast("Checkout Missing", "Checkout summary missing. Please go back to bag.", "error");
         return;
      }

      openModal({
         title: 'Confirm Order',
         type: 'confirm',
         content: 'Ready to complete your purchase? By clicking Confirm, your order will be placed and processed.',
         confirmText: 'Place Order',
         onConfirm: () => {
            dispatch(placeOrder({
               userId: user._id,
               cartitem: cartItems,
               formData,
               summaryData: summaryData?.checkout || summaryData, // Support both nested or flat
            }))
               .unwrap()
               .then(() => {
                  showToast("Success", 'Your order has been placed successfully!', "success");
                  dispatch(clearCart());
                  localStorage.removeItem('checkoutSummary');
                  navigate('/user/myorder', { replace: true });
               })
               .catch((error) => {
                  showToast("Failed", 'Failed to place order. Please check your details and try again.', "error");
                  console.error("Order placement error:", error);
               });
         }
      });
   };

   return (
      <div className="min-h-screen bg-[var(--bg-body)] pb-16 font-[var(--font-body)] animate-in fade-in duration-700">
         <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 pt-4">
            
            {/* Simplified Step Indicator */}
            <div className="flex items-center justify-between mb-5 overflow-x-auto pb-1 scrollbar-none">
               <div className="flex items-center gap-4 min-w-max">
                  <div className="flex items-center gap-2 cursor-pointer group" onClick={() => navigate('/user/addtocart')}>
                     <div className="w-6 h-6 rounded-full bg-[var(--success)] text-white flex items-center justify-center transition-premium group-hover:scale-105">
                        <CheckCircle size={14} />
                     </div>
                     <span className="text-[12px] font-bold text-[var(--success)] tracking-tight">Cart</span>
                  </div>
                  <ChevronRight size={12} className="text-[var(--border-light)]" />
                  <div className="flex items-center gap-2">
                     <div className="w-6 h-6 rounded-full bg-[var(--primary)] text-white flex items-center justify-center text-[9px] font-bold shadow-md shadow-[var(--primary)]/20 ring-1 ring-[var(--primary-light)]">2</div>
                     <span className="text-[12px] font-bold text-[var(--primary)] tracking-tight">Checkout</span>
                  </div>
                  <ChevronRight size={12} className="text-[var(--border-light)]" />
                  <div className="flex items-center gap-2 opacity-40">
                     <div className="w-6 h-6 rounded-full bg-white border border-[var(--border-light)] text-[var(--text-muted)] flex items-center justify-center text-[9px] font-bold">3</div>
                     <span className="text-[12px] font-semibold text-[var(--text-muted)] tracking-tight">Payment</span>
                  </div>
               </div>
            </div>

            <div className="flex items-baseline justify-between mb-6 border-b border-[var(--border-light)] pb-3">
               <h1 className="text-xl md:text-2xl font-black text-[var(--text-main)] font-[var(--font-heading)] tracking-tighter">
                  Secure <span className="text-[var(--primary)] text-lg">Checkout</span>
               </h1>
               <div className="hidden sm:flex items-center gap-1.5 text-[var(--text-muted)] font-black text-[9px] bg-[var(--bg-section)] px-2.5 py-1 rounded-lg border border-[var(--border-light)] uppercase tracking-wider">
                  <ShieldCheck size={10} className="text-[var(--success)]" />
                  Secure
               </div>
            </div>

            <div className="grid lg:grid-cols-12 gap-8 items-start">
               {/* Left: Checkout Form */}
               <div className="lg:col-span-8 space-y-6">
                  <form onSubmit={handleSubmit} className="space-y-6">
                     {/* Personal Info */}
                     <div className="bg-[var(--bg-card)] rounded-[20px] border border-[var(--border-light)] shadow-sm overflow-hidden animate-in slide-in-from-left duration-500 hover:shadow-md transition-all duration-300 group/card">
                        <div className="bg-[var(--bg-section)]/50 px-5 py-3 border-b border-[var(--border-light)] flex items-center gap-2.5">
                           <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-[var(--primary)] shadow-sm group-hover/card:scale-105 transition-transform"><User size={16} /></div>
                           <h2 className="text-[12px] font-black text-[var(--text-main)] font-[var(--font-heading)] uppercase tracking-tight">Personal Details</h2>
                        </div>
                        <div className="p-5 md:p-6 grid md:grid-cols-2 gap-4">
                           <Input
                              label="Name"
                              name="name"
                              required
                              value={formData.name}
                              onChange={handleChange}
                              placeholder="Your name"
                              className="text-[13px]"
                           />
                           <Input
                              label="Email"
                              type="email"
                              name="email"
                              required
                              value={formData.email}
                              onChange={handleChange}
                              placeholder="yourname@example.com"
                              className="text-[13px]"
                           />
                           <div className="md:col-span-2">
                              <Input
                                 label="Phone"
                                 name="phone"
                                 required
                                 value={formData.phone}
                                 onChange={handleChange}
                                 placeholder="+91 XXXXX XXXXX"
                                 icon={Phone}
                                 className="text-[13px]"
                              />
                           </div>
                        </div>
                     </div>

                     {/* Shipping Address */}
                     <div className="bg-[var(--bg-card)] rounded-[20px] border border-[var(--border-light)] shadow-sm overflow-hidden animate-in slide-in-from-left duration-600 hover:shadow-md transition-all duration-300 group/card">
                        <div className="bg-[var(--bg-section)]/50 px-5 py-3 border-b border-[var(--border-light)] flex items-center gap-2.5">
                           <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-[var(--accent)] shadow-sm group-hover/card:scale-105 transition-transform"><MapPin size={16} /></div>
                           <h2 className="text-[12px] font-black text-[var(--text-main)] font-[var(--font-heading)] uppercase tracking-tight">Shipping</h2>
                        </div>
                        <div className="p-5 md:p-6 space-y-4">
                           <div className="space-y-1">
                              <label className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-widest pl-1">Street Address</label>
                              <textarea
                                 name="address"
                                 rows={2}
                                 required
                                 value={formData.address}
                                 onChange={handleChange}
                                 className="w-full bg-[var(--bg-body)] border border-[var(--border-light)] rounded-lg px-3 py-2 text-[13px] font-medium text-[var(--text-main)] outline-none transition-all focus:border-[var(--primary)] focus:ring-1 focus:ring-[rgba(37,99,235,0.1)] placeholder:text-gray-400 min-h-[80px]"
                                 placeholder="House no., Apartment, Locality..."
                              ></textarea>
                           </div>
                           <div className="grid md:grid-cols-3 gap-4">
                              <Input label="City" name="city" required value={formData.city} onChange={handleChange} placeholder="City" className="text-[13px]" />
                              <Input label="State" name="state" required value={formData.state} onChange={handleChange} placeholder="State" className="text-[13px]" />
                              <Input label="Pincode" name="pincode" required value={formData.pincode} onChange={handleChange} placeholder="123456" className="text-[13px]" />
                           </div>
                        </div>
                     </div>

                     {/* Payment Method */}
                     <div className="bg-[var(--bg-card)] rounded-[20px] border border-[var(--border-light)] shadow-sm overflow-hidden animate-in slide-in-from-left duration-700 hover:shadow-md transition-all duration-300 group/card">
                        <div className="bg-[var(--bg-section)]/50 px-5 py-3 border-b border-[var(--border-light)] flex items-center gap-2.5">
                           <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-[var(--success)] shadow-sm group-hover/card:scale-105 transition-transform"><CreditCard size={16} /></div>
                           <h2 className="text-[12px] font-black text-[var(--text-main)] font-[var(--font-heading)] uppercase tracking-tight">Payment</h2>
                        </div>
                        <div className="p-5 md:p-6">
                           <div
                              className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all duration-300 cursor-pointer group/pay ${formData.paymentMethod === 'cod' ? 'border-[var(--primary)] bg-[var(--primary-light)]/20 shadow-sm' : 'border-[var(--border-light)] bg-[var(--bg-section)]/50 hover:bg-[var(--bg-section)]'}`}
                              onClick={() => setFormData({ ...formData, paymentMethod: 'cod' })}
                           >
                              <div className="flex items-center gap-4">
                                 <div className={`p-3 rounded-lg shadow-sm transition-all duration-500 ${formData.paymentMethod === 'cod' ? 'bg-[var(--primary)] text-white scale-105' : 'bg-white text-[var(--text-muted)] group-hover/pay:text-[var(--text-main)]'}`}>
                                    <Truck size={24} strokeWidth={1.5} />
                                 </div>
                                 <div className="space-y-0.5">
                                    <h4 className="font-black text-[var(--text-main)] uppercase text-[10px] tracking-tight">Cash on Delivery</h4>
                                    <p className="text-[10px] text-[var(--text-muted)] font-medium">Pay at your doorstep</p>
                                 </div>
                              </div>
                              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${formData.paymentMethod === 'cod' ? 'border-[var(--primary)] bg-[var(--primary)] shadow-md shadow-[var(--primary)]/20' : 'border-[var(--border-light)] bg-white'}`}>
                                 {formData.paymentMethod === 'cod' && <div className="w-1.5 h-1.5 rounded-full bg-white animate-in zoom-in duration-300"></div>}
                              </div>
                           </div>
                           <p className="mt-4 text-center text-[9px] font-bold text-[var(--text-muted)] opacity-60 uppercase tracking-widest bg-[var(--bg-section)]/50 py-2 rounded-lg border border-[var(--border-light)] border-dashed">
                              Digital payments coming soon
                           </p>
                        </div>
                     </div>

                     {/* Action Buttons */}
                     <div className="flex flex-col sm:flex-row gap-3 pt-3">
                        <Button
                           variant="outline"
                           type="button"
                           onClick={() => navigate('/user/addtocart')}
                           className="flex-1 h-11 rounded-lg text-[10px] font-black uppercase tracking-widest gap-2 group shadow-sm"
                        >
                           <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform duration-300" />
                           Return
                        </Button>
                        <Button
                           variant="orange"
                           type="submit"
                           size="lg"
                           className="flex-[2] h-11 rounded-lg text-[11px] font-black tracking-[0.1em] shadow-lg shadow-[var(--accent)]/15 uppercase relative overflow-hidden group border-none"
                           style={{ background: 'var(--gradient-accent)' }}
                        >
                           <span className="relative z-10 flex items-center gap-2">
                              Place Order
                              <ChevronRight size={16} className="group-hover:translate-x-0.5 transition-transform duration-300" strokeWidth={3} />
                           </span>
                        </Button>
                     </div>
                  </form>
               </div>

                {/* Right: Summary Card */}
                <div className="lg:col-span-4 lg:sticky lg:top-20">
                   <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border-light)] shadow-lg shadow-slate-200/20 overflow-hidden animate-in slide-in-from-right duration-700">
                      <div className="bg-[var(--bg-section)]/30 px-5 py-3 border-b border-[var(--border-light)]">
                         <h3 className="text-[12px] font-black text-[var(--text-main)] font-[var(--font-heading)] uppercase tracking-tight flex items-center gap-2">
                            Summary
                         </h3>
                      </div>
                      <div className="p-5 space-y-3.5 text-[12px]">
                         <div className="space-y-2.5">
                            <div className="flex justify-between text-[var(--text-muted)] font-medium">
                               <span>Subtotal</span>
                               <span className="text-[var(--text-main)] font-bold font-mono">₹{Math.floor(summaryData?.checkout?.subtotal || 0).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-[var(--success)] font-bold">
                               <span>Discount</span>
                               <span className="bg-[var(--success)]/10 px-2 py-0.5 rounded-md">-₹{Math.floor(summaryData?.checkout?.discount || 0).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-[var(--text-muted)] font-medium">
                               <span>Shipping</span>
                               <span className="text-[var(--success)] font-bold uppercase text-[9px] tracking-widest bg-[var(--success)]/10 px-2 py-0.5 rounded-md">
                                  {summaryData?.checkout?.shipping === 0 ? "Free" : `₹${summaryData?.checkout?.shipping}`}
                               </span>
                            </div>
                            <div className="flex justify-between text-[var(--text-muted)] font-medium">
                               <span>Taxes</span>
                               <span className="text-[var(--text-main)] font-bold font-mono">₹{Math.floor(summaryData?.checkout?.tax || 0).toLocaleString()}</span>
                            </div>
                         </div>
 
                         <div className="pt-4 border-t border-dashed border-[var(--border-light)]">
                            <div className="flex justify-between items-center">
                               <div className="space-y-0.5">
                                  <span className="block text-[9px] font-black text-[var(--text-muted)] uppercase tracking-widest leading-none">Net Total</span>
                               </div>
                               <span className="text-xl font-black text-[var(--primary)] tracking-tighter">₹{Math.floor(summaryData?.checkout?.totalAmount || 0).toLocaleString()}</span>
                            </div>
                         </div>
 
                         <div className="pt-2">
                            <div className="p-3 bg-[var(--bg-section)]/50 rounded-lg border border-[var(--border-light)] flex items-start gap-2.5 group transition-premium hover:bg-white hover:shadow-sm">
                               <ShieldCheck size={14} className="text-[var(--success)] mt-0.5 flex-shrink-0" />
                               <div className="space-y-0.5 min-w-0">
                                  <p className="text-[9px] font-black text-[var(--text-main)] uppercase tracking-tight">100% Secure</p>
                                  <p className="text-[9px] text-[var(--text-muted)] font-medium leading-tight truncate">Safe handlers confirmed.</p>
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
