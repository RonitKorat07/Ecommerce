import Cart from "../models/cartschema.js";
import Product from "../models/productschema.js";

export const addToCart = async (req, res) => {
  try {
    const { userId, productId, selectedSize, selectedColor, quantity } = req.body;

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    if (product.stock < quantity) {
      return res.status(400).json({ message: "No stock available" });
    }

    let cart = await Cart.findOne({ userId }).populate("items.productId");
    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    const existingIndex = cart.items.findIndex(
      (item) =>
        item.productId._id.toString() === productId &&
        item.selectedSize === selectedSize &&
        item.selectedColor === selectedColor
    );

    if (existingIndex > -1) {
      cart.items[existingIndex].quantity += quantity;

      if (cart.items[existingIndex].quantity > product.stock) {
        return res.status(400).json({ message: "No stock available" });
      }
    } else {
      cart.items.push({ productId, selectedSize, selectedColor, quantity });
    }

    await cart.save();

    const populatedCart = await Cart.findById(cart._id).populate("items.productId");

    return res.status(200).json({ message: "Added to cart successfully", cart: populatedCart });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getCart = async (req, res) => {
  try {
    const { userId } = req.params;

    const cart = await Cart.findOne({ userId }).populate("items.productId");

    if (!cart) {
      return res.status(404).json({ message: "Cart is empty", cart: { items: [] } });
    }

    return res.status(200).json({ message: "Cart fetched successfully", cart });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const { userId, itemId } = req.params;

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = cart.items.filter((item) => item._id.toString() !== itemId);
    await cart.save();

    const populatedCart = await Cart.findById(cart._id).populate("items.productId");

    return res.status(200).json({ message: "Item removed successfully", cart: populatedCart });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const updateCartQuantity = async (req, res) => {
  const { userId } = req.params;
  const { productId, selectedSize, selectedColor, quantity } = req.body;

  try {
    const cart = await Cart.findOne({ userId }).populate("items.productId");
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const cartItem = cart.items.find(
      (item) =>
        item.productId._id.toString() === productId &&
        item.selectedSize === selectedSize &&
        item.selectedColor === selectedColor
    );

    if (!cartItem) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (quantity > product.stock) {
      return res.status(400).json({ message: `Only ${product.stock} items available in stock` });
    }

    cartItem.quantity = quantity;
    await cart.save();

    const populatedCart = await Cart.findById(cart._id).populate("items.productId");

    return res.status(200).json({ message: "Quantity updated", cart: populatedCart });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
