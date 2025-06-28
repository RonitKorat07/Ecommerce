import Cart from "../models/cartschema.js";
import CheckoutSummary from "../models/checkoutsummaryschema.js";
import Order from "../models/orderschema.js";
import Product from "../models/productschema.js";

// ✅ Simple function to update product stock
async function updateStock(items) {
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const product = await Product.findById(item.productId);
    if (product) {
      product.stock -= item.quantity;
      await product.save();
    }
  }
}

export const placeOrder = async (req, res) => {
  try {
    const {
      userId,
      items,
      shippingAddress,
      tax,
      shippingCharges,
      discount,
      totalPrice,
      finalPrice,
    } = req.body;

    // const userId = req.user._id; // ✅ consistent userId usage

    // ✅ Update stock before placing the order
    await updateStock(items);

    // ✅ Create the order
    const order = await Order.create({
      userId,
      items,
      shippingAddress,
      tax,
      shippingCharges,
      discount,
      totalPrice,
      finalPrice,
    });

    

    // ✅ Clear CheckoutSummary & Cart for that user
    await CheckoutSummary.deleteMany({ userId });
    await Cart.deleteMany({ userId });

      res.status(201).json({
        success: true,
        message: "Order placed successfully",
        order,
      });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Order placement failed",
      error: error.message,
    });
  }
};

export const getAllOrdersForUser = async (req, res) => {
  try {
    const { userId } = req.params;  // or get from req.user._id if auth is used

    const orders = await Order.find({ userId })
      .populate("items.productId"); // Populate product details for each order's items

    if (orders.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No orders found for this user",
      });
    }

    res.status(200).json({
      success: true,
      message: "Orders fetched successfully",
      orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
      error: error.message,
    });
  }
};


export const getAllOrdersAdmin = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 20;
    const skip = (page - 1) * limit;

const orders = await Order.find()
  .sort({ createdAt: -1 }) // ✅ latest orders first
  .skip(skip)
  .limit(limit)
  .populate("items.productId");

    const totalOrders = await Order.countDocuments();

    res.status(200).json({
      success: true,
      message: "All orders fetched successfully",
      orders,
      totalOrders,
      currentPage: page,
      totalPages: Math.ceil(totalOrders / limit),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
      error: error.message,
    });
  }
};

