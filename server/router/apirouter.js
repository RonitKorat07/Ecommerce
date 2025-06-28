import express from 'express';
import { createProduct, deleteProduct, getAllProducts, getFilteredProducts, getProductById, searchproduct, updateProduct } from '../controller/product_controller.js';
import { addCategory, deleteCategory, getAllCategories, updateCategory } from '../controller/category_controller.js';
import { user_signin_controller } from '../controller/user_signin_controller.js';
import { user_signup_controller } from '../controller/user_signup_controller.js';
import { addToCart, getCart, removeFromCart, updateCartQuantity } from '../controller/addtocart_controller.js';
import { saveCheckoutSummary } from '../controller/checkoutsummary_controller.js';
import { getAllOrdersAdmin, getAllOrdersForUser, placeOrder } from '../controller/order_controller.js';

const router = express.Router();

// categorey 
router.post('/category/add' , addCategory)
router.put('/category/update/:id', updateCategory);
router.delete('/category/delete/:id', deleteCategory);
router.get('/category' , getAllCategories)

// product 
router.post("/product/add", createProduct);
router.get("/product", getAllProducts);
router.put("/product/update/:id", updateProduct);
router.delete("/product/delete/:id", deleteProduct);
router.get("/product/:id", getProductById);
router.get('/products/filter', getFilteredProducts);
router.get('/search', searchproduct  );

//addtocart 
router.post('/cart/add', addToCart);
router.get("/cart/:userId", getCart); // Get user's cart
router.delete("/cart/remove/:userId/:itemId", removeFromCart);
router.put("/cart/update/:userId/", updateCartQuantity);


// checkoutsummry
router.post("/cart/checkoutsummary" ,saveCheckoutSummary);

// palce order 
router.post("/order/placeorder" ,placeOrder);

//GET ALL ORDER FOR USER AND ADMIN

router.get("/order/admin/all", getAllOrdersAdmin); //ADMIN
router.get("/order/user/:userId", getAllOrdersForUser); // USER



//auth 
router.post('/signup', user_signup_controller);
router.post('/signin', user_signin_controller);

export default router;
