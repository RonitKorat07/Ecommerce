import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/Userslice";
import { FaUser, FaShoppingCart, FaSearch } from "react-icons/fa";
import { clearCart, fetchCart } from "../redux/Cartslice";

function Navbar() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchquery, setsearchquery] = useState('')

  const cartCount = useSelector((state) => state.cart.items.length);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearCart());  // <== यहाँ cart clear किया
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/signin");
  };

  const toggleDropdown = () => {
    console.log("Dropdown toggled");
    setDropdownOpen(!dropdownOpen);
  };

useEffect(() => {
  if (user?._id && user?.role !== 'admin') {
    console.log(user._id);
    dispatch(fetchCart(user._id));
  }
}, [dispatch, user]);

useEffect(() => {
  // Jab bhi user change ho, dropdown close kar do
  setDropdownOpen(false);
}, [user]);


  const handelsearchsubmit = (e) => {
    e.preventDefault();
    if (searchquery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchquery.trim())}`);
    }
  };
  return (
    <nav className="flex items-center justify-between sticky top-0 z-50 p-4 bg-blue-600 text-white">
      {/* Logo */}
      <Link to="/" className="text-lg sm:text-2xl font-bold hover:text-gray-200">
        ShopLogo
      </Link>

      {/* Search Bar */}
        {user?.role !== "admin" && (
          <div className="hidden sm:flex justify-center w-full">
            <form onSubmit={handelsearchsubmit} className="relative w-full sm:max-w-xs md:max-w-sm lg:max-w-md">
              <input
                type="text"
                placeholder="Search products..."
                value={searchquery}
                onChange={(e) => setsearchquery(e.target.value)}
                className="w-full px-4 py-2 pl-10 rounded-full text-black bg-white focus:outline-none"
              />
              <FaSearch className="absolute top-3 left-3 text-gray-400" />
            </form>
          </div>
        )}


      {/* User/Admin Buttons */}
      <div className="flex items-center space-x-3">
        {user ? (
          <>
            {user.role === "admin" ? (
              <div className="relative">
                <button
                  onClick={toggleDropdown}
                  className="flex items-center bg-white text-blue-600 text-sm px-2 py-1 md:px-4 md:py-1 md:text-lg  rounded-full hover:bg-gray-100"
                >
                  <FaUser className="mr-2" />
                  {user.name}
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-6 w-50 bg-white text-blue-600 rounded-md shadow-md">
                    <Link
                      to="admin/category"
                      className="block px-4 py-2 hover:bg-gray-100 border-b border-gray-200"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Category Manage
                    </Link>
                    <Link
                      to="admin/product"
                      className="block px-4 py-2 hover:bg-gray-100 border-b border-gray-200"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Product Manage
                    </Link>
                    <Link
                      to="admin/order"
                      className="block px-4 py-2 hover:bg-gray-100 border-b border-gray-200"
                      onClick={() => setDropdownOpen(false)}
                    >
                      All Orders
                    </Link>
                    <button
                     onClick={() => { 
                        handleLogout(); 
                        setDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/user/addtocart">
                  <button className="relative flex items-center bg-white text-blue-600 text-sm px-2 py-1 md:px-4 md:py-1 md:text-lg rounded-full hover:bg-gray-100">
                    <FaShoppingCart className="mr-2" />
                    Cart

                    {cartCount > 0 && (
                      <span className="absolute  -top-2 -right-1 bg-red-500 text-white text-xs font-semibold w-4 h-4 md:w-6 md:h-6 flex items-center justify-center rounded-full">
                        {cartCount}
                      </span>
                    )}
                  </button>
                </Link>

                <div className="relative">
                  <button
                    onClick={toggleDropdown}
                    className="flex items-center bg-white text-blue-600 px-1 py-1 text-sm md:text-lg md:px-4 md:py-1 rounded-full hover:bg-gray-100"
                  >
                    <FaUser className="mr-2" />
                    {user.name}
                  </button>

                  {dropdownOpen && (
                    <div className="absolute right-0 mt-6 w-50 bg-white text-blue-600 rounded-md shadow-md">
                      <Link
                        to="/user/myorder"
                        className="block px-4 py-2 hover:bg-gray-100 border-b border-gray-200"
                        onClick={() => setDropdownOpen(false)}
                      >
                        My Orders
                      </Link>
                      <button
                       onClick={() => { 
                        handleLogout(); 
                        setDropdownOpen(false);
                      }}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </>
        ) : (
          <Link to="/signin">
            <button className="bg-white text-blue-600 px-4 py-2 rounded-full hover:bg-gray-100">
              Login
            </button>
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
