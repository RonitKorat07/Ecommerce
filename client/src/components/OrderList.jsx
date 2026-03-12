import React, { useState } from 'react';
import OrderModal from './OrderModal';
import { Eye, Calendar, User, MapPin, CreditCard, Hash } from 'lucide-react';

const OrderList = ({ orders, role }) => {
  const [selectedOrder, setSelectedOrder] = useState(null);

  return (
    <div className="overflow-x-auto w-full">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-[var(--bg-body)]/60">
            <th className="py-3 px-5 text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">
              <div className="flex items-center gap-1.5"><Hash size={11} /> Order ID</div>
            </th>
            <th className="py-3 px-5 text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">
              <div className="flex items-center gap-1.5"><Calendar size={11} /> Date</div>
            </th>
            {role === 'admin' ? (
              <th className="py-3 px-5 text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">
                <div className="flex items-center gap-1.5"><User size={11} /> Customer</div>
              </th>
            ) : (
              <th className="py-3 px-5 text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">
                <div className="flex items-center gap-1.5"><MapPin size={11} /> City</div>
              </th>
            )}
            <th className="py-3 px-5 text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">
              <div className="flex items-center gap-1.5"><CreditCard size={11} /> Payment</div>
            </th>
            <th className="py-3 px-5 text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] text-right">Amount</th>
            <th className="py-3 px-5 text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] text-center">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--border-light)]">
          {orders.map((order) => (
            <tr
              key={order._id}
              className="hover:bg-[var(--bg-body)]/40 transition-colors group"
            >
              {/* Order ID */}
              <td className="py-3.5 px-5">
                <span className="font-mono text-[11px] font-bold bg-[var(--bg-body)] px-2.5 py-1 rounded-md border border-[var(--border-light)] text-[var(--text-main)] group-hover:bg-white group-hover:border-[var(--primary-light)] transition-all">
                  #{order._id.slice(-8).toUpperCase()}
                </span>
              </td>

              {/* Date */}
              <td className="py-3.5 px-5">
                <div>
                  <span className="text-[13px] font-semibold text-[var(--text-main)]">
                    {new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </span>
                  <span className="text-[10px] text-[var(--text-muted)] ml-1.5">
                    {new Date(order.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </td>

              {/* Customer / City */}
              {role === 'admin' ? (
                <td className="py-3.5 px-5">
                  <div>
                    <span className="text-[13px] font-semibold text-[var(--text-main)] block">{order.shippingAddress.fullName}</span>
                    <span className="text-[10px] text-[var(--text-muted)] truncate block max-w-[150px]">{order.shippingAddress.email}</span>
                  </div>
                </td>
              ) : (
                <td className="py-3.5 px-5">
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--primary)] bg-[var(--primary-light)] px-2.5 py-1 rounded-md">
                    <MapPin size={11} />
                    {order.shippingAddress.city}
                  </span>
                </td>
              )}

              {/* Payment */}
              <td className="py-3.5 px-5">
                <div>
                  <span className="text-[11px] font-bold text-[var(--text-main)] uppercase tracking-tight">
                    {order.paymentMode || 'COD'}
                  </span>
                  <div className="flex items-center gap-1 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span className="text-[10px] font-semibold text-emerald-600 uppercase">Paid</span>
                  </div>
                </div>
              </td>

              {/* Amount */}
              <td className="py-3.5 px-5 text-right">
                <span className="text-[15px] font-bold text-[var(--text-main)]">
                  ₹{order.finalPrice.toFixed(0)}
                </span>
              </td>

              {/* Action */}
              <td className="py-3.5 px-5">
                <div className="flex justify-center">
                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-[var(--primary)] bg-[var(--primary-light)] hover:bg-[var(--primary)] hover:text-white transition-all"
                  >
                    <Eye size={13} />
                    View
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

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
