import express from 'express';
import { createProduct, deleteProduct, getAllProducts, getFilteredProducts, getProductById, searchproduct, updateProduct } from '../controller/product_controller.js';
import { addCategory, deleteCategory, getAllCategories, updateCategory } from '../controller/category_controller.js';
import { user_signin_controller } from '../controller/user_signin_controller.js';
import { user_signup_controller } from '../controller/user_signup_controller.js';
import { addToCart, getCart, removeFromCart, updateCartQuantity } from '../controller/addtocart_controller.js';
import { saveCheckoutSummary } from '../controller/checkoutsummary_controller.js';
import { getAllOrdersAdmin, getAllOrdersForUser, placeOrder } from '../controller/order_controller.js';
import { getDashboardStats } from '../controller/dashboard_controller.js';
import { updateUserProfile } from '../controller/user_profile_controller.js';
import requiresignin from '../middleware/requiresignin.js';

const router = express.Router();

// dashboard
router.get('/dashboard/stats', requiresignin, getDashboardStats);

// category 
router.post('/category/add' , requiresignin, addCategory)
router.put('/category/update/:id', requiresignin, updateCategory);
router.delete('/category/delete/:id', requiresignin, deleteCategory);
router.get('/category' , getAllCategories) // Public

// product 
router.post("/product/add", requiresignin, createProduct);
router.get("/product", getAllProducts); // Public
router.put("/product/update/:id", requiresignin, updateProduct);
router.delete("/product/delete/:id", requiresignin, deleteProduct);
router.get("/product/:id", getProductById); // Public
router.get('/products/filter', getFilteredProducts); // Public
router.get('/search', searchproduct); // Public

// addtocart 
router.post('/cart/add',  requiresignin, addToCart);
router.get("/cart/:userId", requiresignin, getCart);
router.delete("/cart/remove/:userId/:itemId", requiresignin, removeFromCart);
router.put("/cart/update/:userId/", requiresignin, updateCartQuantity);

// checkoutsummary
router.post("/cart/checkoutsummary", requiresignin, saveCheckoutSummary);

// place order 
router.post("/order/placeorder", requiresignin, placeOrder);

// GET ALL ORDER FOR USER AND ADMIN
router.get("/order/admin/all", requiresignin, getAllOrdersAdmin); // ADMIN
router.get("/order/user/:userId", requiresignin, getAllOrdersForUser); // USER

// auth 
router.post('/signup', user_signup_controller);
router.post('/signin', user_signin_controller);
router.put('/user/profile/update', requiresignin, updateUserProfile);

export default router;
