import React, { useState } from 'react';
import OrderModal from './OrderModal';
import { Eye, Calendar, MapPin, CreditCard, CheckCircle2, Package, ChevronRight, TrendingUp } from 'lucide-react';

const OrderList = ({ orders, role }) => {
  const [selectedOrder, setSelectedOrder] = useState(null);

  return (
    <div className="space-y-4 px-0 pb-2">
      {/* Header Info */}
      <div className="flex items-center justify-between px-4 py-2.5 mx-4 mt-4 bg-[var(--bg-body)] rounded-lg border border-[var(--border-light)] mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-md bg-white shadow-sm flex items-center justify-center text-[var(--primary)]">
            <Package size={16} />
          </div>
          <div>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-0.5">Total Orders</p>
            <h4 className="text-sm font-bold text-slate-800 leading-none">{orders.length} <span className="text-[var(--primary)]">Orders</span></h4>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-emerald-50 text-emerald-600 border border-emerald-100">
          <TrendingUp size={12} />
          <span className="text-[9px] font-bold uppercase tracking-wider">Active Status</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 px-4 pb-2">
        {orders.map((order) => (
          <div
            key={order._id}
            className="group relative bg-white rounded-xl border border-slate-100 shadow-sm hover:shadow-lg hover:shadow-slate-200/50 hover:border-[var(--primary-light)] transition-all duration-300 overflow-hidden"
          >
            {/* Top Bar with ID and Status */}
            <div className="flex items-center justify-between p-3 border-b border-slate-50 bg-slate-50/30">
              <div className="flex items-center gap-2">
                <div className="flex flex-col">
                  <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1 pl-0.5">Reference</span>
                  <span className="font-mono text-[10px] font-bold bg-white px-2 py-1 rounded-md border border-slate-100 text-slate-600 shadow-sm group-hover:text-[var(--primary)] group-hover:border-[var(--primary-light)] transition-colors">
                    #{order._id.slice(-8).toUpperCase()}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100 shadow-sm shadow-emerald-100/30">
                  <CheckCircle2 size={11} className="animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Confirmed</span>
                </div>
              </div>
            </div>

            {/* Main Content Body */}
            <div className="p-4 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 items-center">
              
              {/* Date & Time */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-500 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-500 group-hover:text-white transition-all duration-300 shadow-sm">
                  <Calendar size={14} />
                </div>
                <div className="flex flex-col">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Order Date</span>
                  <span className="text-xs font-bold text-slate-800 tracking-tight">
                    {new Date(order.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </span>
                  <span className="text-[9px] text-slate-500 font-semibold mt-0.5">
                    {new Date(order.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>

              {/* Location/Customer */}
              <div className="flex items-start gap-3 border-l-0 md:border-l border-slate-100 pl-0 md:pl-4">
                <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-500 flex items-center justify-center flex-shrink-0 group-hover:bg-amber-500 group-hover:text-white transition-all duration-300 shadow-sm">
                  <MapPin size={14} />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Shipping To</span>
                  {role === 'admin' ? (
                    <>
                      <span className="text-xs font-bold text-slate-800 tracking-tight truncate">{order.shippingAddress.fullName}</span>
                      <span className="text-[9px] text-slate-500 font-semibold truncate mt-0.5">{order.shippingAddress.email}</span>
                    </>
                  ) : (
                    <>
                      <span className="text-xs font-bold text-slate-800 tracking-tight">{order.shippingAddress.city}</span>
                      <span className="text-[9px] text-slate-500 font-semibold truncate mt-0.5">{order.shippingAddress.address?.slice(0, 25)}...</span>
                    </>
                  )}
                </div>
              </div>

              {/* Payment Info */}
              <div className="flex items-start gap-3 border-l-0 md:border-l border-slate-100 pl-0 md:pl-4">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-500 flex items-center justify-center flex-shrink-0 group-hover:bg-indigo-500 group-hover:text-white transition-all duration-300 shadow-sm">
                  <CreditCard size={14} />
                </div>
                <div className="flex flex-col">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Payment info</span>
                  <span className="text-xs font-bold text-slate-800 tracking-tight flex items-center gap-1.5">
                    {order.paymentMode || 'COD'}
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  </span>
                  <span className="text-[9px] text-emerald-600 font-bold uppercase mt-0.5">Success</span>
                </div>
              </div>

              {/* Amount & CTA */}
              <div className="flex md:flex-col lg:flex-row items-center justify-between lg:justify-end gap-3 lg:gap-5 bg-slate-50/50 md:bg-transparent p-3 md:p-0 rounded-lg md:pl-4 border-t md:border-t-0 md:border-l border-slate-100">
                <div className="flex flex-col items-end md:items-start lg:items-end">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Grand Total</span>
                  <span className="text-lg font-bold text-[var(--primary)] tracking-tight">
                    ₹{order.finalPrice.toLocaleString()}
                  </span>
                </div>
                <button 
                  onClick={() => setSelectedOrder(order)}
                  className="w-10 h-10 rounded-full bg-white border border-slate-100 text-[var(--primary)] flex items-center justify-center hover:bg-[var(--primary)] hover:text-white hover:shadow-xl transition-all duration-300 group/btn"
                >
                  <ChevronRight size={18} className="group-hover/btn:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>
            
            {/* Subtle bottom accent line */}
            <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-[var(--primary)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        ))}
      </div>

      {selectedOrder && (
        <OrderModal
          order={selectedOrder}
          role={role}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </div>
  );
};

export default OrderList;