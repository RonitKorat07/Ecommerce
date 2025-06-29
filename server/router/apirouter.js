import express from 'express';
import { createProduct, deleteProduct, getAllProducts, getFilteredProducts, getProductById, searchproduct, updateProduct } from '../controller/product_controller.js';
import { addCategory, deleteCategory, getAllCategories, updateCategory } from '../controller/category_controller.js';
import { user_signin_controller } from '../controller/user_signin_controller.js';
import { user_signup_controller } from '../controller/user_signup_controller.js';
import { addToCart, getCart, removeFromCart, updateCartQuantity } from '../controller/addtocart_controller.js';
import { saveCheckoutSummary } from '../controller/checkoutsummary_controller.js';
import { getAllOrdersAdmin, getAllOrdersForUser, placeOrder } from '../controller/order_controller.js';
import requiresignin from '../middleware/requiresignin.js';

const router = express.Router();

// categorey 
router.post('/category/add' , addCategory , requiresignin)
router.put('/category/update/:id', updateCategory , requiresignin);
router.delete('/category/delete/:id', deleteCategory , requiresignin);
router.get('/category' , getAllCategories , requiresignin)

// product 
router.post("/product/add", createProduct ,requiresignin);
router.get("/product", getAllProducts ,requiresignin);
router.put("/product/update/:id", updateProduct ,requiresignin);
router.delete("/product/delete/:id", deleteProduct ,requiresignin);
router.get("/product/:id", getProductById ,requiresignin);
router.get('/products/filter', getFilteredProducts ,requiresignin);
router.get('/search', searchproduct   ,requiresignin);

//addtocart 
router.post('/cart/add',  addToCart, requiresignin );
router.get("/cart/:userId", getCart , requiresignin); // Get user's cart
router.delete("/cart/remove/:userId/:itemId", removeFromCart , requiresignin);
router.put("/cart/update/:userId/", updateCartQuantity , requiresignin);

// checkoutsummry
router.post("/cart/checkoutsummary" ,saveCheckoutSummary , requiresignin);

// palce order 
router.post("/order/placeorder" ,placeOrder , requiresignin);

//GET ALL ORDER FOR USER AND ADMIN

router.get("/order/admin/all", getAllOrdersAdmin , requiresignin); //ADMIN
router.get("/order/user/:userId", getAllOrdersForUser , requiresignin); // USER



//auth 
router.post('/signup', user_signup_controller);
router.post('/signin', user_signin_controller);

export default router;
