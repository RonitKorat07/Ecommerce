import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  removeFromCart,
  updateCartQuantity,
  fetchCart,
  fetchCheckoutSummary,
} from "../../redux/Cartslice";
import { FaTrash, FaMinus, FaPlus, FaShoppingCart } from "react-icons/fa";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

const Addtocart = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);
  const user = useSelector((state) => state.user.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (user?._id) {
      dispatch(fetchCart(user._id));
    }
  }, [dispatch, user?._id]);

  const handleRemove = (itemId) => {
    dispatch(removeFromCart({ userId: user._id, itemId }));
    toast.success("Item removed from cart");
  };

  const handleQuantityChange = (item, newQuantity) => {
    if (newQuantity < 1) return;
    dispatch(
      updateCartQuantity({
        userId: user._id,
        productId: item.productId._id,
        quantity: newQuantity,
        selectedColor: item.selectedColor,
        selectedSize: item.selectedSize,
      })
    )
      .unwrap()
      .then(() => toast.success("Quantity updated"))
      .catch(() => toast.error("Update failed"));
  };

  const handlechekout = () => {
    const userId = user._id;
    dispatch(fetchCheckoutSummary({ userId, cartItems }))
      .unwrap()
      .then((result) => {
        localStorage.setItem("checkoutSummary", JSON.stringify(result));
        navigate("/user/addtocart/checkout");
      })
      .catch((error) => {
        console.error("Checkout fetch failed:", error);
      });
  };

  const totalPrice = cartItems.reduce((acc, item) => {
    const discount = item.productId.discount || 0;
    const priceAfterDiscount = item.productId.price - (item.productId.price * discount) / 100;
    return acc + priceAfterDiscount * item.quantity;
  }, 0);

  return (
    <div className="min-h-screen bg-gray-50 py-8 flex flex-col items-center px-4 sm:px-6 lg:px-8 w-full">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-8 flex items-center gap-3">
        <FaShoppingCart className="text-indigo-600" />
        Your Shopping Cart
      </h1>

      {cartItems.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center w-full max-w-md">
          <div className="mx-auto h-24 w-24 text-gray-400 mb-4">
            <FaShoppingCart className="w-full h-full" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Your cart is empty</h3>
          <p className="text-gray-500 mb-6">Start shopping to add items to your cart</p>
          <Link
            to="/"
            className="inline-flex items-center px-4 py-2 rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="w-full max-w-6xl flex flex-col lg:flex-row gap-10">
          {/* Cart Items Section - Left */}
          <div className="flex-1 space-y-6">
            {cartItems.map((item) => (
              <div
                key={item._id || item.productId._id}
                className="bg-white rounded-lg shadow-sm p-4 flex flex-col md:flex-row items-start md:items-center border border-gray-200"
              >
                <div className="md:w-1/3 flex justify-center items-center mb-4 md:mb-0 w-full">
                  <img
                    src={item.productId.images[0]}
                    alt={item.productId.name}
                    className="w-32 h-32 sm:w-40 sm:h-40 object-contain"
                  />
                </div>

                <div className="md:w-2/3 md:pl-6 w-full">
                  <div className="flex justify-between w-full">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{item.productId.name}</h3>
                      <p className="text-indigo-600 font-semibold text-lg mt-1">
                        ₹
                        {Math.floor(
                          item.productId.price - (item.productId.price * item.productId.discount) / 100
                        )}
                      </p>
                    </div>
                    <button
                      onClick={() => handleRemove(item._id || item.productId._id)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <FaTrash />
                    </button>
                  </div>

                  <div className="mt-3 flex gap-6 text-sm">
                    <div>
                      <span className="text-gray-500 mr-1">Size:</span>
                      <span className="font-medium">{item.selectedSize}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-gray-500">Color:</span>
                      <div
                        className="w-4 h-4 rounded-full border"
                        style={{ backgroundColor: item.selectedColor.toLowerCase() }}
                      ></div>
                      <span className="font-medium ml-1">{item.selectedColor}</span>
                    </div>
                  </div>

                  <div className="mt-4 flex justify-between items-center">
                    <div className="flex items-center border rounded-md">
                      <button
                        onClick={() => handleQuantityChange(item, item.quantity - 1)}
                        className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                      >
                        <FaMinus size={12} />
                      </button>
                      <span className="px-4 py-1 border-x">{item.quantity}</span>
                      <button
                        onClick={() => handleQuantityChange(item, item.quantity + 1)}
                        className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                      >
                        <FaPlus size={12} />
                      </button>
                    </div>

                    <p className="text-indigo-600 font-bold text-lg">
                      ₹
                      {Math.floor(
                        (item.productId.price - (item.productId.price * item.productId.discount) / 100) *
                          item.quantity
                      )}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary Section - Right */}
          <div className="w-full lg:w-96 bg-white rounded-lg shadow-sm p-6 border flex-shrink-0">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">
                  Subtotal ({cartItems.reduce((acc, item) => acc + item.quantity, 0)} items)
                </span>
                <span className="font-medium">₹{Math.floor(totalPrice)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium">Free</span>
              </div>
              <div className="flex justify-between border-t pt-3">
                <span className="text-base font-medium text-gray-900">Total Amount</span>
                <span className="text-base font-bold text-indigo-600">₹{Math.floor(totalPrice)}</span>
              </div>
            </div>

            <button
              onClick={handlechekout}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-md font-medium"
            >
              Proceed to Checkout
            </button>

            <div className="mt-4 text-center text-sm text-gray-500">
              <Link to="/" className="text-indigo-600 hover:underline">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Addtocart;
