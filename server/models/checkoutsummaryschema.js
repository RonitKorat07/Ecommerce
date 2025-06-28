import mongoose from "mongoose";

const checkoutSummarySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  cartItems: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      quantity: Number,
      selectedSize: String,
      selectedColor: String,
    },
  ],
  subtotal: Number,
  tax: Number,
  shipping: Number,
  discount: Number,
  totalAmount: Number,
  createdAt: { type: Date, default: Date.now },
});

const CheckoutSummary = mongoose.model("CheckoutSummary", checkoutSummarySchema);

export default CheckoutSummary;
