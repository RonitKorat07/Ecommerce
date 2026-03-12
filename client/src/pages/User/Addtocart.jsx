import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  removeFromCart,
  updateCartQuantity,
  fetchCart,
  fetchCheckoutSummary,
} from "../../redux/Cartslice";
import { ShoppingBag, Trash2, Minus, Plus, ArrowLeft, CreditCard, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import Button from "../../components/UI/Button";
import { Card, CardBody, CardHeader, CardFooter } from "../../components/UI/Card";

const Addtocart = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);
  const user = useSelector((state) => state.user.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (user?._id) {
      dispatch(fetchCart(user._id));
      window.scrollTo({ top: 0, behavior: "smooth" });
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
    <div className="min-h-screen bg-[var(--bg-body)] py-12 px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto space-y-12 animate-in fade-in duration-700">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl md:text-5xl font-bold text-[var(--text-main)] flex items-center gap-4" style={{ fontFamily: 'var(--font-heading)' }}>
          <ShoppingBag size={32} className="text-[var(--primary)]" />
          Shopping <span className="text-[var(--primary)]">Bag</span>
        </h1>
        <p className="text-[var(--text-muted)] font-medium">Review your items and proceed to a secure checkout.</p>
      </div>

      {cartItems.length === 0 ? (
        <Card className="max-w-md mx-auto py-16 text-center animate-in zoom-in duration-500">
          <CardBody className="space-y-6">
            <div className="mx-auto h-24 w-24 bg-[var(--bg-body)] rounded-full flex items-center justify-center text-[var(--border-light)] transform -rotate-12">
              <ShoppingBag size={48} strokeWidth={1} />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-[var(--text-main)]">Your bag is empty</h3>
              <p className="text-[var(--text-muted)]">Looks like you haven't added anything yet.</p>
            </div>
            <Button
              onClick={() => navigate("/")}
              variant="primary"
              size="lg"
              className="w-full rounded-2xl gap-2 shadow-lg"
            >
              <ArrowLeft size={18} />
              Start Shopping
            </Button>
          </CardBody>
        </Card>
      ) : (
        <div className="grid lg:grid-cols-12 gap-12 items-start">
          {/* Cart Items Section - Left */}
          <div className="lg:col-span-8 space-y-6">
            {cartItems.map((item) => (
              <Card
                key={item._id || item.productId._id}
                className="group overflow-hidden border-[var(--border-light)] hover:border-[var(--primary)] hover:shadow-2xl transition-all duration-500"
              >
                <CardBody className="p-0 flex flex-col md:flex-row">
                  <div className="md:w-1/4 bg-[var(--bg-body)] p-6 flex justify-center items-center group-hover:bg-white transition-colors">
                    <img
                      src={item.productId.images[0]}
                      alt={item.productId.name}
                      className="w-32 h-32 md:w-full md:h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-700"
                    />
                  </div>

                  <div className="flex-1 p-6 md:p-8 flex flex-col justify-between space-y-6">
                    <div className="flex justify-between items-start gap-4">
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold text-[var(--primary)] uppercase tracking-widest leading-none">{item.productId.category?.name}</p>
                        <h3 className="text-xl font-bold text-[var(--text-main)] leading-tight">{item.productId.name}</h3>
                        <div className="flex gap-4 mt-2">
                          <div className="flex items-center gap-1.5 bg-[var(--bg-body)] px-3 py-1 rounded-lg border border-[var(--border-light)]">
                            <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase">Size</span>
                            <span className="text-xs font-bold text-[var(--text-main)]">{item.selectedSize}</span>
                          </div>
                          <div className="flex items-center gap-1.5 bg-[var(--bg-body)] px-3 py-1 rounded-lg border border-[var(--border-light)]">
                            <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase">Color</span>
                            <div className="w-2.5 h-2.5 rounded-full shadow-sm" style={{ backgroundColor: item.selectedColor.toLowerCase() }}></div>
                            <span className="text-xs font-bold text-[var(--text-main)]">{item.selectedColor}</span>
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        onClick={() => handleRemove(item._id || item.productId._id)}
                        className="p-2 h-10 w-10 text-[var(--text-muted)] hover:text-[var(--danger)] hover:bg-red-50 rounded-xl transition-all"
                      >
                        <Trash2 size={20} />
                      </Button>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-6 pt-4 border-t border-[var(--border-light)]/50">
                      <div className="flex items-center bg-[var(--bg-body)] border border-[var(--border-light)] rounded-xl p-1 shadow-inner">
                        <Button
                          variant="ghost"
                          onClick={() => handleQuantityChange(item, item.quantity - 1)}
                          className="w-8 h-8 md:w-10 md:h-10 p-0 text-[var(--text-main)] hover:bg-white rounded-lg transition-all"
                        >
                          <Minus size={14} />
                        </Button>
                        <span className="w-8 md:w-12 text-center font-bold text-[var(--text-main)]">{item.quantity}</span>
                        <Button
                          variant="ghost"
                          onClick={() => handleQuantityChange(item, item.quantity + 1)}
                          className="w-8 h-8 md:w-10 md:h-10 p-0 text-[var(--text-main)] hover:bg-white rounded-lg transition-all"
                        >
                          <Plus size={14} />
                        </Button>
                      </div>

                      <div className="flex flex-col items-end">
                        <span className="text-2xl font-black text-[var(--text-main)]">
                          ₹{Math.floor((item.productId.price - (item.productId.price * item.productId.discount) / 100) * item.quantity)}
                        </span>
                        <span className="text-[10px] text-[var(--text-muted)] font-bold">₹{Math.floor(item.productId.price - (item.productId.price * (item.productId.discount || 0)) / 100)} per unit</span>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>

          {/* Order Summary Section - Right */}
          <div className="lg:col-span-4 sticky top-24">
            <Card className="shadow-2xl border-none overflow-hidden">
              <CardHeader className="bg-[var(--bg-body)]/50 border-b border-[var(--border-light)] py-6">
                <h2 className="text-xl font-bold text-[var(--text-main)] flex items-center gap-2">
                  <CreditCard size={20} className="text-[var(--primary)]" />
                  Order Summary
                </h2>
              </CardHeader>
              <CardBody className="p-8 space-y-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[var(--text-muted)] font-medium">Subtotal ({cartItems.reduce((acc, item) => acc + item.quantity, 0)} items)</span>
                    <span className="text-[var(--text-main)] font-bold">₹{Math.floor(totalPrice)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[var(--text-muted)] font-medium">Shipping & Delivery</span>
                    <span className="text-green-600 font-bold uppercase text-[10px] tracking-widest px-2 py-1 bg-green-50 rounded-lg">Free</span>
                  </div>
                  <div className="flex justify-between items-center text-xs text-[var(--text-muted)] italic">
                    <span>Tax included</span>
                    <span>₹0.00</span>
                  </div>
                </div>

                <div className="pt-6 border-t border-[var(--border-light)] flex justify-between items-end">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)]">Total Amount</span>
                    <span className="text-xs text-green-600 font-bold">(You saved ₹{Math.floor(cartItems.reduce((acc, item) => acc + (item.productId.price * (item.productId.discount || 0) / 100) * item.quantity, 0))})</span>
                  </div>
                  <span className="text-4xl font-black text-[var(--primary)]">₹{Math.floor(totalPrice)}</span>
                </div>

                <Button
                  onClick={handlechekout}
                  variant="orange"
                  size="lg"
                  className="w-full h-16 rounded-2xl text-lg font-bold gap-3 shadow-xl hover:shadow-2xl transition-all"
                >
                  <ShieldCheck size={22} />
                  Secure Checkout
                </Button>

                <div className="pt-4 flex flex-col items-center gap-4">
                  <button onClick={() => navigate("/")} className="text-sm font-bold text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors flex items-center gap-2 group">
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                    Continue Shopping
                  </button>
                  <div className="flex items-center gap-2 px-4 py-2 bg-[var(--bg-body)] rounded-xl border border-[var(--border-light)]">
                    <ShieldCheck size={14} className="text-green-600" />
                    <span className="text-[10px] font-bold uppercase tracking-tighter text-[var(--text-muted)]">100% Encrypted & Secure Payments</span>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default Addtocart;
