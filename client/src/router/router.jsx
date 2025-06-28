import { createBrowserRouter } from "react-router-dom";
import App from "../App.jsx";
import Signin from "../pages/Signin.jsx";
import Signup from "../pages/Signup.jsx";
import Userdashboard from "../pages/User/Userdashboard.jsx";
import Admindashboard from "../pages/Admin/Admindashboard.jsx";
import PrivateRoute from "./PrivateRoute.jsx";
import Category from "../pages/Admin/Category.jsx";
import Product from "../pages/Admin/Product.jsx";
import Productpage from "../pages/User/Productpage.jsx";
import Categorywiseproduct from "../pages/User/Categorywiseproduct.jsx";
import Addtocart from "../pages/User/Addtocart.jsx";
import Checkoutpage from "../pages/User/Checkoutpage.jsx";
import Myorder from "../pages/User/Myorder.jsx";
import Allorderpage from "../pages/Admin/Allorderpage.jsx";
import SearchPage from "../pages/User/SearchPage.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "signin",
        element: <Signin />,
      },
      {
        path: "signup",
        element: <Signup />,
      },
     

      // USER routes with PrivateRoute
      {
        element: <PrivateRoute allowedRoles={['user']} />,
        children: [
          {
            path: "/",
            element: <Userdashboard />,
          },
          {
            path: "user/product/:id",
            element: <Productpage/>,
          },
          {
            path: "/user/category/:categoryId",
            element: <Categorywiseproduct/>,
          },
          {
            path: "/user/addtocart",
            element: <Addtocart/>,
          },
          {
            path: "/user/addtocart/checkout",
            element: <Checkoutpage/>,
          },
          {
            path: "/user/myorder",
            element: <Myorder/>,
          },
          {
            path: "/search",
            element: <SearchPage/>,
          },
          // aur bhi user routes...
        ],
      },

      // ADMIN routes with PrivateRoute
      {
        element: <PrivateRoute allowedRoles={['admin']} />,
        children: [
          {
            path: "admin/category",
            element: <Category />,
          },
          {
            path: "admin/product",
            element: <Product />,
          },
          {
            path: "admin/order",
            element: <Allorderpage />,
          },
          // aur bhi admin routes...
        ],
      },
    ],
  },
]);

export default router;
