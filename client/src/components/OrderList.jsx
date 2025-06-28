import React, { useState } from 'react';
import OrderModal from './OrderModal';

const OrderList = ({ orders, role }) => {
  const [selectedOrder, setSelectedOrder] = useState(null);

  return (
    <div className="p-4">
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div className="overflow-x-auto flex justify-start">
          <table className="max-w-5xl m-auto bg-white border border-gray-200 text-xs sm:text-sm rounded-md shadow-sm">
            <thead>
              <tr className="bg-gray-100 text-gray-700 uppercase  leading-normal">
                <th className="py-3 px-6 text-center">Order ID</th>
                <th className="py-3 px-6 text-center">Date</th>
                {role === 'admin' ? (
                  <th className="py-3 px-6 text-center">Customer Name</th>
                ) : (
                  <th className="py-3 px-6 text-center">Shipping City</th> // example for user
                )}
                <th className="py-3 px-6 text-center">Payment Mode</th>
                <th className="py-3 px-6 text-center">Total Payment</th>
                <th className="py-3 px-6 text-center">Details</th>
              </tr>
            </thead>
            <tbody className="text-gray-600">
              {orders.map((order) => (
                <tr
                  key={order._id}
                  className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <td className="py-3 px-6 text-center whitespace-nowrap font-mono">
                    {order._id.slice(-6).toUpperCase()}
                  </td>
                  <td className="py-3 px-6 text-center whitespace-nowrap">
                    {new Date(order.createdAt).toLocaleString()}
                  </td>
                  {role === 'admin' ? (
                    <td className="py-3 px-6 text-center whitespace-nowrap">{order.shippingAddress.fullName}</td>
                  ) : (
                    <td className="py-3 px-6 text-center whitespace-nowrap">{order.shippingAddress.city}</td>
                  )}
                  <td className="py-3 px-6 text-center capitalize whitespace-nowrap">
                    {order.paymentMode || 'CASH ON DELIVERY'}
                  </td>
                  <td className="py-3 px-6 text-center text-green-600 font-semibold whitespace-nowrap">
                    ₹{order.finalPrice.toFixed(2)}
                  </td>
                  <td className="py-3 px-6 text-center whitespace-nowrap">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

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
