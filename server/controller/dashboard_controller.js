import Order from "../models/orderschema.js";
import Product from "../models/productschema.js";
import User from "../models/userschema.js";
import Category from "../models/categoryschema.js";

export const getDashboardStats = async (req, res) => {
  try {
    // Run all queries in parallel for performance
    const [
      totalOrders,
      totalProducts,
      totalUsers,
      totalCategories,
      revenueResult,
      recentOrders,
      lowStockProducts,
      topCategories,
    ] = await Promise.all([
      // Counts
      Order.countDocuments(),
      Product.countDocuments(),
      User.countDocuments({ role: "user" }),
      Category.countDocuments(),

      // Total Revenue
      Order.aggregate([
        { $group: { _id: null, total: { $sum: "$finalPrice" } } },
      ]),

      // Recent 5 orders
      Order.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .populate("items.productId", "name images price"),

      // Low stock products (stock <= 10)
      Product.find({ stock: { $lte: 10 } })
        .sort({ stock: 1 })
        .limit(8)
        .select("name stock images price category")
        .populate("category", "name"),

      // Top categories by product count
      Product.aggregate([
        {
          $group: {
            _id: "$category",
            count: { $sum: 1 },
          },
        },
        { $sort: { count: -1 } },
        { $limit: 5 },
        {
          $lookup: {
            from: "categories",
            localField: "_id",
            foreignField: "_id",
            as: "categoryInfo",
          },
        },
        { $unwind: "$categoryInfo" },
        {
          $project: {
            name: "$categoryInfo.name",
            image: "$categoryInfo.image",
            count: 1,
          },
        },
      ]),
    ]);

    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

    res.status(200).json({
      success: true,
      stats: {
        totalRevenue,
        totalOrders,
        totalProducts,
        totalUsers,
        totalCategories,
        recentOrders,
        lowStockProducts,
        topCategories,
      },
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard stats",
      error: error.message,
    });
  }
};
