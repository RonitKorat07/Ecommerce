  import mongoose from "mongoose";

  const productSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    sizes: [String],
    colors: [String],
    images: [String],    // ✅ array of image URLs
    stock: {
      type: Number,
      default: 0,
    },
      discount: {
      type: Number,
      default: 0,  // discount percentage, default 0 means no discount
      min: 0,
      max: 99,
    },
  }, { timestamps: true });


  const Product = mongoose.model("Product", productSchema);

  export default Product;
