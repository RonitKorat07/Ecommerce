import React from 'react';
import { AiOutlineClose } from 'react-icons/ai';

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
    } = order;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 p-4">
            <div className="bg-white p-6 rounded-xl max-w-5xl w-full relative shadow-2xl flex flex-col max-h-[90vh]">
                {/* Close Button */}
                <button
                    className="absolute top-4 right-5 text-red-600 hover:text-red-700 transition text-3xl"
                    onClick={onClose}
                    aria-label="Close modal"
                >
                    <AiOutlineClose />
                </button>

                <h2 className="text-3xl font-bold mb-6 text-center border-b pb-3">Order Details</h2>

                <div className="flex flex-col md:flex-row gap-6 overflow-y-auto md:overflow-hidden flex-1">
                    {/* Left Panel: Order & User Info */}
                    <div className="md:w-1/3 flex flex-col gap-4 md:overflow-y-auto  pr-4 border-r border-gray-200">
                        <div className="space-y-2 text-sm">
                            <p><strong>Order ID:</strong> <span className="font-mono">{_id}</span></p>
                            <p><strong>Date:</strong> {new Date(createdAt).toLocaleString()}</p>
                        </div>

                        {role === 'admin' && (
                            <div className="space-y-2 text-sm mt-4">
                                <h3 className="text-lg font-semibold border-b pb-1 mb-2">User Details</h3>
                                <p><strong>Name:</strong> {shippingAddress.fullName}</p>
                                <p><strong>Email:</strong> {shippingAddress.email}</p>
                                <p><strong>Phone:</strong> {shippingAddress.phoneNumber}</p>
                            </div>
                        )}

                        <div className="mt-4 text-sm">
                            <h3 className="font-semibold border-b pb-1 mb-2">Shipping Address</h3>
                            <p>
                                {shippingAddress.address},<br />
                                {shippingAddress.city}, {shippingAddress.state} - {shippingAddress.pincode}
                            </p>
                        </div>

                        {/* Price Summary */}
                        <div className="mt-auto border-t pt-4 text-sm space-y-2">
                            <div className="flex justify-between">
                                <span><strong>Total Price:</strong></span>
                                <span>₹{Math.floor(totalPrice)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span><strong>Tax:</strong></span>
                                <span>₹{Math.floor(tax)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span><strong>Shipping Charges:</strong></span>
                                <span>₹{Math.floor(shippingCharges)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span><strong>Discount:</strong></span>
                                <span>₹{Math.floor(discount)}</span>
                            </div>
                            <div className="flex justify-between text-xl font-bold text-green-700 mt-2">
                                <span>Final Price:</span>
                                <span>₹{Math.floor(finalPrice)}</span>
                            </div>
                        </div>

                    </div>

                    {/* Right Panel: Items List */}
                    <div className="md:w-2/3  max-h-[70vh] pr-2 md:overflow-y-auto">
                        <h3 className="text-xl font-semibold mb-4 border-b pb-2">Items</h3>

                        <div className="space-y-5">
                            {items.map((item, i) => {
                                const discountedPrice = Math.floor(item.productId.price * (1 - item.productId.discount / 100));
                                const subtotal = discountedPrice * item.quantity;

                                return (
                                    <div
                                        key={i}
                                        className="flex gap-5 p-3 border rounded shadow-sm hover:shadow-md transition"
                                    >
                                        <img
                                            src={item.productId.images[0] || "/noimage.png"}
                                            alt={item.productId.name}
                                            className="w-32 h-32 object-contain rounded"
                                        />
                                        <div className="flex flex-col justify-between text-sm w-full">
                                            <div>
                                                <p className="font-semibold text-lg">{item.productId.name}</p>
                                                <p>Brand: {item.productId.brand}</p>
                                                <p>Price: ₹{discountedPrice}</p>
                                                <p>Color: {item.selectedColor} | Size: {item.selectedSize} | Qty: {item.quantity}</p>
                                            </div>
                                            <p className="font-semibold text-right text-green-700">
                                                Subtotal: ₹{subtotal}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderModal;
