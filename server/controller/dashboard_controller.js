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

    // Timeframes calculations
    const now = new Date();
    const startOfToday = new Date(now.setHours(0, 0, 0, 0));
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const [
      todayRevenueResult,
      last7DaysRevenue,
      last30DaysRevenue,
      allTimeRevenue
    ] = await Promise.all([
      // Today
      Order.aggregate([
        { $match: { createdAt: { $gte: startOfToday } } },
        { $group: { _id: null, total: { $sum: "$finalPrice" } } }
      ]),
      // Last 7 Days (Daily)
      Order.aggregate([
        { $match: { createdAt: { $gte: sevenDaysAgo } } },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            revenue: { $sum: "$finalPrice" }
          }
        },
        { $sort: { _id: 1 } }
      ]),
      // Last 30 Days (Daily)
      Order.aggregate([
        { $match: { createdAt: { $gte: thirtyDaysAgo } } },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            revenue: { $sum: "$finalPrice" }
          }
        },
        { $sort: { _id: 1 } }
      ]),
      // All Time (Monthly)
      Order.aggregate([
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
            revenue: { $sum: "$finalPrice" }
          }
        },
        { $sort: { _id: 1 } }
      ])
    ]);

    const todayRevenue = todayRevenueResult.length > 0 ? todayRevenueResult[0].total : 0;

    // Order Status Distribution with fallback for old data
    const orderStatusStats = await Order.aggregate([
      {
        $group: {
          _id: { $ifNull: ["$status", "processing"] },
          count: { $sum: 1 }
        }
      }
    ]);

    // Top Selling Products
    const topProducts = await Order.aggregate([
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.productId",
          totalSold: { $sum: "$items.quantity" },
          revenue: { $sum: { $multiply: ["$items.quantity", "$totalPrice"] } } 
        }
      },
      { $sort: { totalSold: -1 } },
      { $limit: 8 },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "productInfo"
        }
      },
      { $unwind: "$productInfo" },
      {
        $project: {
          name: "$productInfo.name",
          image: { $arrayElemAt: ["$productInfo.images", 0] },
          totalSold: 1,
          revenue: 1
        }
      }
    ]);

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
        todayRevenue,
        last7DaysRevenue,
        last30DaysRevenue,
        allTimeRevenue,
        orderStatusStats,
        topProducts
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
