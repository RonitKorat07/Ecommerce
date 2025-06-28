import Product from "../models/productschema.js";

// CREATE Product Controller
export const createProduct = async (req, res) => {
  try {
    // Create new product without image handling
    const product = new Product({
      name: req.body.name,
      price: req.body.price,
      description: req.body.description,
      category: req.body.category,
      sizes: req.body.sizes || [],
      colors: req.body.colors || [],
      stock: req.body.stock || 0,
      discount: req.body.discount || 0,  // <-- add here
      images:req.body.images || [], // Empty array for now
    });

    await product.save();
    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      success: false,
      message: 'Server Error',
      error: error.message 
    });
  }
};

// GET ALL Products Controller
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate("category", "name");
    res.status(200).json({ products });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// GET Single Product Controller
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("category", "name");

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ product });
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// UPDATE Product Controller
export const updateProduct = async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ message: "Product updated successfully", product: updatedProduct });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// DELETE Product Controller
export const deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);

    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// GET Products with optional filters (category, exclude)
export const getFilteredProducts = async (req, res) => {
  try {
    const { category, exclude } = req.query;

    // Build filter object dynamically
    let filter = {};

    if (category) {
      filter.category = category;  // Filter by category id
    }

    if (exclude) {
      filter._id = { $ne: exclude }; // Exclude a product by id
    }

    // Find products matching filter and populate category name
    const products = await Product.find(filter).populate("category", "name");

    res.status(200).json({ products });
  } catch (error) {
    console.error("Error fetching filtered products:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Simple function to update product stock
async function updateStock(cartItems) {
  for (let i = 0; i < cartItems.length; i++) {
    const item = cartItems[i];
    const product = await Product.findById(item.productId);
    if (product) {
      product.stock = product.stock - item.quantity;
      await product.save();
    }
  }
}

export const searchproduct = async (req, res) => {
  const { q } = req.query;

  try {
    if (!q) {
      return res.status(400).json({ message: "Query parameter 'name' is required." });
    }

    const products = await Product.find({
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } }
      ]
    });

    res.status(200).json({ products });

  } catch (error) {
    console.error("Error searching products:", error);
    res.status(500).json({ message: "Server error" });
  }
};
