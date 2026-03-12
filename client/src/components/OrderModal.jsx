import React from 'react';
import { createPortal } from 'react-dom';
import { X, Package, MapPin, User, CreditCard, Hash, ShoppingBag, Truck, ShieldCheck } from 'lucide-react';

const OrderModal = ({ order, role, onClose }) => {
   const {
      shippingAddress,
      items,
      totalPrice,
      finalPrice,
      tax,
      discount,
      shippingCharges,
      createdAt,
      _id,
      paymentMode
   } = order;

   const modalContent = (
      <div
         className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
         onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
         style={{ animation: 'fadeIn 0.2s ease-out' }}
      >
         <div
            className="bg-white rounded-2xl w-full max-w-5xl relative shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
            style={{ animation: 'slideUp 0.3s ease-out' }}
         >
            {/* ── Header ── */}
            <div className="px-6 py-4 border-b border-[var(--border-light)] flex justify-between items-center flex-shrink-0">
               <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[var(--primary)] text-white rounded-xl flex items-center justify-center shadow-sm">
                     <Package size={18} />
                  </div>
                  <div>
                     <h2 className="text-lg font-bold text-[var(--text-main)]" style={{ fontFamily: 'var(--font-heading)' }}>
                        Order <span className="text-[var(--primary)]">Details</span>
                     </h2>
                     <span className="text-[10px] font-mono font-medium text-[var(--text-muted)]">
                        #{_id.slice(-10).toUpperCase()}
                     </span>
                  </div>
               </div>
               <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
               >
                  <X size={18} />
               </button>
            </div>

            {/* ── Body ── */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
               <div className="flex flex-col lg:flex-row">

                  {/* ── Left Panel: Info ── */}
                  <div className="lg:w-[360px] flex-shrink-0 p-5 space-y-5 bg-[var(--bg-body)]/50 lg:border-r border-[var(--border-light)]">
                     {/* Date & Status */}
                     <div className="bg-white rounded-xl p-4 border border-[var(--border-light)]">
                        <div className="flex justify-between items-center">
                           <div>
                              <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider">Order Date</p>
                              <p className="text-sm font-semibold text-[var(--text-main)] mt-0.5">
                                 {new Date(createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                 <span className="text-xs text-[var(--text-muted)] ml-1.5">
                                    {new Date(createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                                 </span>
                              </p>
                           </div>
                           <span className="px-2.5 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-bold uppercase flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                              Success
                           </span>
                        </div>
                     </div>

                     {/* Shipping */}
                     <div className="bg-white rounded-xl border border-[var(--border-light)]">
                        <div className="px-4 py-2.5 border-b border-[var(--border-light)] flex items-center gap-2">
                           <User size={13} className="text-[var(--primary)]" />
                           <span className="text-[11px] font-bold text-[var(--text-main)] uppercase tracking-wider">Shipping Details</span>
                        </div>
                        <div className="p-4 space-y-3">
                           <div>
                              <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase">Name</p>
                              <p className="text-sm font-semibold text-[var(--text-main)]">{shippingAddress.fullName}</p>
                           </div>
                           <div className="grid grid-cols-2 gap-3">
                              <div>
                                 <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase">Email</p>
                                 <p className="text-xs font-medium text-[var(--text-main)] truncate">{shippingAddress.email}</p>
                              </div>
                              <div>
                                 <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase">Phone</p>
                                 <p className="text-xs font-medium text-[var(--text-main)]">{shippingAddress.phoneNumber}</p>
                              </div>
                           </div>
                           <div className="pt-2 border-t border-[var(--border-light)]">
                              <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase flex items-center gap-1 mb-0.5">
                                 <MapPin size={10} /> Address
                              </p>
                              <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                                 {shippingAddress.address},<br />
                                 {shippingAddress.city}, {shippingAddress.state} - {shippingAddress.pincode}
                              </p>
                           </div>
                        </div>
                     </div>

                     {/* Payment Summary */}
                     <div className="bg-white rounded-xl border border-[var(--border-light)] overflow-hidden">
                        <div className="px-4 py-2.5 border-b border-[var(--border-light)] flex items-center gap-2">
                           <CreditCard size={13} className="text-[var(--primary)]" />
                           <span className="text-[11px] font-bold text-[var(--text-main)] uppercase tracking-wider">Payment</span>
                        </div>
                        <div className="bg-[var(--primary-light)] px-4 py-2">
                           <span className="text-[11px] font-bold text-[var(--primary)] uppercase">{paymentMode || 'Cash on Delivery'}</span>
                        </div>
                        <div className="p-4 space-y-2">
                           <div className="flex justify-between text-xs text-[var(--text-muted)]">
                              <span>Subtotal</span><span>₹{Math.floor(totalPrice)}</span>
                           </div>
                           <div className="flex justify-between text-xs text-[var(--text-muted)]">
                              <span>Tax (GST)</span><span>₹{Math.floor(tax)}</span>
                           </div>
                           <div className="flex justify-between text-xs text-[var(--text-muted)]">
                              <span>Shipping</span><span>₹{Math.floor(shippingCharges)}</span>
                           </div>
                           {discount > 0 && (
                              <div className="flex justify-between text-xs text-emerald-600">
                                 <span>Discount</span><span>-₹{Math.floor(discount)}</span>
                              </div>
                           )}
                           <div className="pt-2 mt-1 border-t border-[var(--border-light)] flex justify-between items-center">
                              <span className="text-xs font-bold text-[var(--text-main)] uppercase">Total</span>
                              <span className="text-xl font-bold text-[var(--primary)]">₹{Math.floor(finalPrice)}</span>
                           </div>
                        </div>
                     </div>
                  </div>

                  {/* ── Right Panel: Items ── */}
                  <div className="flex-1 p-5">
                     <div className="flex items-center gap-2 mb-4">
                        <ShoppingBag size={16} className="text-[var(--primary)]" />
                        <h3 className="text-sm font-bold text-[var(--text-main)]">Order Items</h3>
                        <span className="bg-[var(--bg-body)] text-[10px] font-bold px-2 py-0.5 rounded-full text-[var(--text-muted)] border border-[var(--border-light)]">{items.length}</span>
                     </div>

                     <div className="space-y-3">
                        {items.map((item, i) => {
                           const discountedPrice = Math.floor(item.productId.price * (1 - item.productId.discount / 100));
                           const subtotal = discountedPrice * item.quantity;

                           return (
                              <div key={i} className="flex gap-4 p-4 rounded-xl border border-[var(--border-light)] hover:border-[var(--primary-light)] transition-colors">
                                 {/* Image */}
                                 <div className="w-20 h-20 bg-[var(--bg-body)] rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden">
                                    <img
                                       src={item.productId.images[0] || "/noimage.png"}
                                       alt={item.productId.name}
                                       className="w-full h-full object-cover rounded-xl"
                                    />
                                 </div>

                                 {/* Details */}
                                 <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start gap-2">
                                       <h4 className="text-sm font-semibold text-[var(--text-main)] truncate">{item.productId.name}</h4>
                                       <span className="text-sm font-bold text-[var(--text-main)] flex-shrink-0">₹{subtotal}</span>
                                    </div>

                                    <div className="flex gap-2 mt-2">
                                       {item.selectedColor && (
                                          <span className="flex items-center gap-1 px-2 py-0.5 bg-[var(--bg-body)] rounded text-[10px] font-medium text-[var(--text-muted)] border border-[var(--border-light)]">
                                             <span className="w-2.5 h-2.5 rounded-full border border-slate-200" style={{ backgroundColor: item.selectedColor }} />
                                             {item.selectedColor}
                                          </span>
                                       )}
                                       {item.selectedSize && (
                                          <span className="px-2 py-0.5 bg-[var(--bg-body)] rounded text-[10px] font-medium text-[var(--text-muted)] border border-[var(--border-light)]">
                                             Size: {item.selectedSize}
                                          </span>
                                       )}
                                    </div>

                                    <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-[var(--border-light)]">
                                       <span className="text-[11px] text-[var(--text-muted)]">
                                          ₹{discountedPrice} × {item.quantity}
                                       </span>
                                       <span className="bg-[var(--primary)] text-white px-2.5 py-0.5 rounded-md text-[10px] font-bold">
                                          Qty: {item.quantity}
                                       </span>
                                    </div>
                                 </div>
                              </div>
                           );
                        })}
                     </div>

                     {/* Trust Badges */}
                     <div className="grid grid-cols-3 gap-3 mt-6 pt-5 border-t border-[var(--border-light)]">
                        <div className="flex flex-col items-center gap-1.5 text-center">
                           <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-500 flex items-center justify-center"><ShieldCheck size={16} /></div>
                           <span className="text-[9px] font-bold uppercase text-[var(--text-muted)]">Authentic</span>
                        </div>
                        <div className="flex flex-col items-center gap-1.5 text-center">
                           <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-500 flex items-center justify-center"><Truck size={16} /></div>
                           <span className="text-[9px] font-bold uppercase text-[var(--text-muted)]">Fast Shipping</span>
                        </div>
                        <div className="flex flex-col items-center gap-1.5 text-center">
                           <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-500 flex items-center justify-center"><Package size={16} /></div>
                           <span className="text-[9px] font-bold uppercase text-[var(--text-muted)]">Quality Pack</span>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );

   // Use portal to render modal at document.body level, bypassing sidebar layout
   return createPortal(modalContent, document.body);
};

export default OrderModal;
