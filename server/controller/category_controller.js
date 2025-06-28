import Category from "../models/categoryschema.js";

// ✅ Add a new category
export const addCategory = async (req, res) => {
  const { name, image } = req.body;

  if (!name || !image) {
    return res.status(400).json({ message: "Name and image are required" });
  }

  try {
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res.status(400).json({ message: "Category already exists" });
    }

    const newCategory = new Category({ name, image });
    await newCategory.save();

    return res.status(201).json({
      message: "Category added successfully",
      category: newCategory,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

// ✅ Update a category by ID
export const updateCategory = async (req, res) => {
  const { id } = req.params;
  const { name, image } = req.body;

  if (!name || !image) {
    return res.status(400).json({ message: "Name and image are required" });
  }

  try {
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    category.name = name;
    category.image = image;
    await category.save();

    return res.status(200).json({
      message: "Category updated successfully",
      category,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

// ✅ Delete a category by ID
export const deleteCategory = async (req, res) => {
  const { id } = req.params;

  try {
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    await category.deleteOne();
    return res.status(200).json({ message: "Category deleted successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

// ✅ Get all categories
export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    return res.status(200).json(categories);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};
