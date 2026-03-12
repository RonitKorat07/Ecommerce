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
   const navigate = useNavigate()
   const dispatch = useDispatch();

   useEffect(() => {
      const storedSummary = localStorage.getItem("checkoutSummary");
      if (storedSummary) {
         setSummaryData(JSON.parse(storedSummary));
      }
      window.scrollTo({ top: 0, behavior: "smooth" });
   }, []);

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

      // In a real app, we'd use a Modal. For now, a clean toast/simple confirm is fine.
      const confirmed = window.confirm("Ready to complete your purchase? By clicking OK, your order will be placed.");
      if (!confirmed) return;

      dispatch(placeOrder({
         userId: user._id,
         cartitem: cartItems,
         formData,
         summaryData: summaryData?.checkout,
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
      <div className="min-h-screen bg-[var(--bg-body)] py-12 px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto space-y-12 animate-in fade-in duration-700">
         <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">
               <span className="hover:text-[var(--primary)] cursor-pointer" onClick={() => navigate('/user/addtocart')}>Bag</span>
               <div className="h-1 w-1 rounded-full bg-[var(--border-light)]"></div>
               <span className="text-[var(--primary)]">Checkout</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-[var(--text-main)] flex items-center gap-4" style={{ fontFamily: 'var(--font-heading)' }}>
               Secure <span className="text-[var(--primary)]">Checkout</span>
            </h1>
         </div>

         <div className="grid lg:grid-cols-12 gap-12 items-start">
            {/* Checkout Form */}
            <div className="lg:col-span-8 space-y-8">
               <form onSubmit={handleSubmit} className="space-y-8">
                  <Card className="border-none shadow-xl overflow-hidden">
                     <CardHeader className="bg-[var(--bg-body)]/50 border-b border-[var(--border-light)] py-6 px-8">
                        <h2 className="text-xl font-bold text-[var(--text-main)] flex items-center gap-3">
                           <User size={20} className="text-[var(--primary)]" />
                           Personal Information
                        </h2>
                     </CardHeader>
                     <CardBody className="p-8 space-y-6">
                        <div className="grid md:grid-cols-12 gap-6">
                           <div className="md:col-span-12">
                              <Input
                                 label="Full Name"
                                 name="name"
                                 required
                                 value={formData.name}
                                 onChange={handleChange}
                                 placeholder="Your full name"
                                 icon={<User size={18} />}
                              />
                           </div>
                           <div className="md:col-span-6">
                              <Input
                                 label="Email Address"
                                 type="email"
                                 name="email"
                                 required
                                 value={formData.email}
                                 onChange={handleChange}
                                 placeholder="yourname@example.com"
                                 icon={<Mail size={18} />}
                              />
                           </div>
                           <div className="md:col-span-6">
                              <Input
                                 label="Phone Number"
                                 name="phone"
                                 required
                                 value={formData.phone}
                                 onChange={handleChange}
                                 placeholder="+91 00000 00000"
                                 icon={<Phone size={18} />}
                              />
                           </div>
                        </div>
                     </CardBody>
                  </Card>

                  <Card className="border-none shadow-xl overflow-hidden">
                     <CardHeader className="bg-[var(--bg-body)]/50 border-b border-[var(--border-light)] py-6 px-8">
                        <h2 className="text-xl font-bold text-[var(--text-main)] flex items-center gap-3">
                           <MapPin size={20} className="text-[var(--primary)]" />
                           Shipping Address
                        </h2>
                     </CardHeader>
                     <CardBody className="p-8 space-y-6">
                        <div className="grid md:grid-cols-12 gap-6">
                           <div className="md:col-span-12">
                              <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mb-2 block">Complete Address</label>
                              <textarea
                                 name="address"
                                 rows={3}
                                 required
                                 value={formData.address}
                                 onChange={handleChange}
                                 className="w-full bg-[var(--bg-body)] border border-[var(--border-light)] rounded-2xl px-5 py-4 text-sm font-medium text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-all placeholder:text-[var(--text-muted)] placeholder:font-normal"
                                 placeholder="House no., Street, Locality..."
                              ></textarea>
                           </div>
                           <div className="md:col-span-4">
                              <Input
                                 label="City"
                                 name="city"
                                 required
                                 value={formData.city}
                                 onChange={handleChange}
                                 placeholder="City"
                              />
                           </div>
                           <div className="md:col-span-4">
                              <Input
                                 label="State"
                                 name="state"
                                 required
                                 value={formData.state}
                                 onChange={handleChange}
                                 placeholder="State"
                              />
                           </div>
                           <div className="md:col-span-4">
                              <Input
                                 label="Pincode"
                                 name="pincode"
                                 required
                                 value={formData.pincode}
                                 onChange={handleChange}
                                 placeholder="Pincode"
                              />
                           </div>
                        </div>
                     </CardBody>
                  </Card>

                  <Card className="border-none shadow-xl overflow-hidden">
                     <CardHeader className="bg-[var(--bg-body)]/50 border-b border-[var(--border-light)] py-6 px-8">
                        <h2 className="text-xl font-bold text-[var(--text-main)] flex items-center gap-3">
                           <CreditCard size={20} className="text-[var(--primary)]" />
                           Payment Method
                        </h2>
                     </CardHeader>
                     <CardBody className="p-8">
                        <div
                           className={`flex items-center justify-between p-6 rounded-2xl border-2 transition-all cursor-pointer ${formData.paymentMethod === 'cod' ? 'border-[var(--primary)] bg-[var(--primary-light)]' : 'border-[var(--border-light)]'}`}
                           onClick={() => setFormData({ ...formData, paymentMethod: 'cod' })}
                        >
                           <div className="flex items-center gap-4">
                              <div className={`p-3 rounded-xl ${formData.paymentMethod === 'cod' ? 'bg-[var(--primary)] text-white' : 'bg-[var(--bg-body)] text-[var(--text-muted)]'}`}>
                                 <Truck size={24} />
                              </div>
                              <div>
                                 <h4 className="font-bold text-[var(--text-main)]">Cash on Delivery</h4>
                                 <p className="text-xs text-[var(--text-muted)]">Pay when your order arrives at your door.</p>
                              </div>
                           </div>
                           <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${formData.paymentMethod === 'cod' ? 'border-[var(--primary)] bg-[var(--primary)]' : 'border-[var(--border-light)]'}`}>
                              {formData.paymentMethod === 'cod' && <div className="w-2 h-2 rounded-full bg-white animate-in zoom-in duration-300"></div>}
                           </div>
                        </div>

                        <p className="mt-6 text-center text-xs text-[var(--text-muted)] font-medium italic">
                           Other payment methods (UPI, Cards) will be available soon.
                        </p>
                     </CardBody>
                  </Card>

                  <div className="flex gap-4">
                     <Button
                        variant="outline"
                        type="button"
                        onClick={() => navigate('/user/addtocart')}
                        className="flex-1 h-16 rounded-2xl gap-2 font-bold"
                     >
                        <ArrowLeft size={18} />
                        Back to Bag
                     </Button>
                     <Button
                        variant="orange"
                        type="submit"
                        className="flex-[2] h-16 rounded-2xl gap-3 text-lg font-bold shadow-xl"
                     >
                        <CheckCircle size={22} />
                        Complete Order
                     </Button>
                  </div>
               </form>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-4 sticky top-24">
               <Card className="shadow-2xl border-none overflow-hidden animate-in slide-in-from-right duration-700">
                  <CardHeader className="bg-[var(--bg-body)]/50 border-b border-[var(--border-light)] py-6">
                     <h3 className="text-xl font-bold text-[var(--text-main)] flex items-center gap-2">
                        <ShieldCheck size={20} className="text-[var(--primary)]" />
                        Final Summary
                     </h3>
                  </CardHeader>

                  <CardBody className="p-8 space-y-6">
                     <div className="space-y-4">
                        <div className="flex justify-between items-center">
                           <span className="text-[var(--text-muted)] font-medium">Subtotal</span>
                           <span className="text-[var(--text-main)] font-bold">₹{Math.floor(summaryData?.checkout.subtotal || 0)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                           <span className="text-[var(--text-muted)] font-medium">Extra Discount</span>
                           <span className="text-green-600 font-bold px-2 py-1 bg-green-50 rounded-lg text-xs">-₹{Math.floor(summaryData?.checkout.discount || 0)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                           <span className="text-[var(--text-muted)] font-medium">Shipping Fee</span>
                           <span className="text-green-600 font-bold uppercase text-[10px] tracking-widest px-2 py-1 bg-green-50 rounded-lg">₹{Math.floor(summaryData?.checkout.shipping || 0)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                           <span className="text-[var(--text-muted)] font-medium">GST / Taxes</span>
                           <span className="text-[var(--text-main)] font-medium">₹{Math.floor(summaryData?.checkout.tax || 0)}</span>
                        </div>
                     </div>

                     <div className="pt-6 border-t border-[var(--border-light)]">
                        <div className="flex justify-between items-end mb-1">
                           <span className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)]">Payable Amount</span>
                           <span className="text-4xl font-black text-[var(--primary)]">₹{Math.floor(summaryData?.checkout.totalAmount || 0)}</span>
                        </div>
                     </div>

                     <div className="space-y-4 pt-6">
                        <div className="p-4 bg-[var(--bg-body)] rounded-2xl border border-[var(--border-light)] flex items-start gap-3">
                           <ShieldCheck size={20} className="text-slate-400 mt-0.5" />
                           <div className="space-y-1">
                              <p className="text-[10px] font-bold text-[var(--text-main)] uppercase tracking-tight">Purchase Protection</p>
                              <p className="text-[10px] text-[var(--text-muted)] leading-tight">Your order is protected by our 100% money-back guarantee.</p>
                           </div>
                        </div>
                     </div>
                  </CardBody>
               </Card>
            </div>
         </div>
      </div>
   );
};

export default Checkout;
