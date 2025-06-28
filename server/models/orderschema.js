import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
      },
      selectedColor: String,
      selectedSize: String,
      quantity: Number,
    
    }
  ],
  shippingAddress: {
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    address: { type: String, required: true },
    city: String,
    state: String,
    pincode: String,
  },
  tax: {
    type: Number,
    default: 0.0
  },
  shippingCharges: {
    type: Number,
    default: 0.0
  },
  discount: {
    type: Number,
    default: 0.0
  },
  totalPrice: {
    type: Number,
    required: true
  },
  finalPrice: {
    type: Number,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Order = mongoose.model('Order', orderSchema);
export default Order;
