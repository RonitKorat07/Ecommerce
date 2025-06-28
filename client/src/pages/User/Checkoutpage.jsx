import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { placeOrder } from '../../redux/Orderslice'; // In Checkoutpage.jsx
import { useNavigate } from "react-router-dom";
import { clearCart } from "../../redux/Cartslice";

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
  }, []);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
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
    
    const confirmed = window.confirm("Are you sure you want to place this order?");
    if (!confirmed) return;

    dispatch(placeOrder({
      userId: user._id,
      cartitem: cartItems,
      formData,
      summaryData: summaryData?.checkout,
    }))
      .unwrap()
      .then(() => {
        toast.success('✅ Order placed successfully!');
        dispatch(clearCart()); // if using Redux
        localStorage.removeItem('checkoutSummary');
        navigate('/user/myorder', { replace: true }); // Fixed path (added leading slash)
      })
      .catch((error) => {
        toast.error('❌ Failed to place order. Try again.');
        console.error("Order placement error:", error); // Add error logging
      });
  };
  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Checkout</h2>

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12">
        {/* Checkout Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-lg shadow-md p-8 flex-1 space-y-6"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="mt-1 w-full border border-gray-300 rounded-md px-4 py-2"
              placeholder="John Doe"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="mt-1 w-full border border-gray-300 rounded-md px-4 py-2"
                placeholder="john@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone</label>
              <input
                type="tel"
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                className="mt-1 w-full border border-gray-300 rounded-md px-4 py-2"
                placeholder="+91 9876543210"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Address</label>
            <textarea
              name="address"
              rows={3}
              required
              value={formData.address}
              onChange={handleChange}
              className="mt-1 w-full border border-gray-300 rounded-md px-4 py-2"
              placeholder="House no., Street, Locality"
            ></textarea>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">City</label>
              <input
                type="text"
                name="city"
                required
                value={formData.city}
                onChange={handleChange}
                className="mt-1 w-full border border-gray-300 rounded-md px-4 py-2"
                placeholder="City"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">State</label>
              <input
                type="text"
                name="state"
                required
                value={formData.state}
                onChange={handleChange}
                className="mt-1 w-full border border-gray-300 rounded-md px-4 py-2"
                placeholder="State"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Pincode</label>
              <input
                type="text"
                name="pincode"
                required
                value={formData.pincode}
                onChange={handleChange}
                className="mt-1 w-full border border-gray-300 rounded-md px-4 py-2"
                placeholder="123456"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Payment Method</label>
            <select
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleChange}
              className="mt-1 w-full border border-gray-300 rounded-md px-4 py-2"
            >
              <option value="cod">Cash on Delivery</option>
              <option value="card" disabled>Credit/Debit Card (Coming Soon)</option>
              <option value="upi" disabled>UPI (Coming Soon)</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-md font-semibold transition"
          >
            Place Order
          </button>
        </form>

        {/* Order Summary */}
        <aside className="w-full lg:w-96 bg-white rounded-lg shadow-md p-8 sticky top-20 h-fit">
          <h3 className="text-xl font-semibold text-gray-800 mb-6 border-b pb-3">
            Order Summary
          </h3>

          <div className="space-y-4 text-gray-700 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{Math.floor(summaryData?.checkout.subtotal || 0)}</span>
            </div>
            <div className="flex justify-between text-green-600 font-medium">
              <span>Lucky Discount</span>
              <span>-₹{Math.floor(summaryData?.checkout.discount || 0)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span className="text-green-600 font-medium">
                ₹{Math.floor(summaryData?.checkout.shipping || 0)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Tax (18%)</span>
              <span>₹{Math.floor(summaryData?.checkout.tax || 0)}</span>
            </div>

            <div className="border-t pt-4 flex justify-between font-bold text-gray-900 text-lg">
              <span>Total</span>
              <span>₹{Math.floor(summaryData?.checkout.totalAmount || 0)}</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Checkout;
