import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/Userslice";
import { ShoppingBag, Search, User, LogOut, Menu, Settings, Bell, ChevronDown } from "lucide-react";
import { clearCart, fetchCart } from "../redux/Cartslice";
import { Dropdown, DropdownItem } from "./UI/Dropdown";

function Navbar({ isSidebarOpen, onToggleSidebar }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const navigate = useNavigate();
  const location = useLocation();
  const [searchquery, setsearchquery] = useState("");

  const cartCount = useSelector((state) => state.cart.items.length);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearCart());
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/signin");
  };

  useEffect(() => {
    if (user?._id && user?.role !== 'admin') {
      dispatch(fetchCart(user._id));
    }
  }, [dispatch, user]);

  const getPageLabel = (path) => {
    const segments = path.split('/').filter(Boolean);
    const titleMap = {
      'admin/dashboard': 'Overview',
      'admin/category': 'Categories',
      'admin/product': 'Inventory',
      'admin/order': 'Fulfill Orders',
      'user/dashboard': 'Store',
      'user/myorder': 'My Orders',
      'user/addtocart': 'Cart',
    };
    const fullPath = segments.join('/');
    return titleMap[fullPath] || segments[segments.length - 1]?.charAt(0).toUpperCase() + segments[segments.length - 1]?.slice(1) || 'Dashboard';
  };

  const currentPage = getPageLabel(location.pathname);

  const handelsearchsubmit = (e) => {
    e.preventDefault();
    if (searchquery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchquery.trim())}`);
    }
  };

  return (
    <nav
      className={`fixed top-0 right-0 z-[50] h-[var(--topbar-height)] transition-all duration-300 glass-effect flex items-center ${
        isSidebarOpen ? "left-[var(--sidebar-width)]" : "left-0 lg:left-[var(--sidebar-collapsed-width)]"
      }`}
    >
      <div className="w-full h-full px-6 md:px-8 flex items-center justify-between">

        {/* ── Left: Hamburger + Page Title ── */}
        <div className="flex items-center gap-4">
          <button 
            onClick={onToggleSidebar}
            className="p-2 -ml-2 rounded-lg hover:bg-slate-100 text-slate-500 lg:hidden transition-colors"
          >
            <Menu size={22} />
          </button>
          
          <div className="flex items-center gap-2.5">
            <span className="w-1.5 h-5 rounded-full" style={{ background: 'var(--gradient-primary)' }} />
            <h1 
              className="text-xl font-bold tracking-tight"
              style={{ 
                color: 'var(--text-main)',
                fontFamily: 'var(--font-heading)' 
              }}
            >
              {currentPage}
            </h1>
          </div>
        </div>

        {/* ── Center: Search Bar (User only) ── */}
        {user?.role !== "admin" && (
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <form onSubmit={handelsearchsubmit} className="relative w-full group">
              <input
                type="text"
                placeholder="Search products..."
                value={searchquery}
                onChange={(e) => setsearchquery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-300 focus:ring-2 focus:ring-blue-100 px-10 py-2 rounded-xl text-sm transition-all outline-none"
              />
              <Search className="absolute top-1/2 -translate-y-1/2 left-3.5 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={16} />
            </form>
          </div>
        )}

        {/* ── Right: Notifications + Profile ── */}
        <div className="flex items-center gap-2">
          {/* Notification Bell */}
          <button className="relative p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors">
            <Bell size={20} />
            <span 
              className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full border-2 border-white"
              style={{ backgroundColor: 'var(--accent)' }}
            />
          </button>

          {/* Divider */}
          <div className="h-6 w-px bg-slate-200 mx-1 hidden sm:block" />

          {/* Profile Dropdown */}
          <Dropdown
            trigger={
              <div className="flex items-center gap-2.5 pl-1.5 pr-3 py-1 rounded-full border border-slate-200 cursor-pointer hover:border-[var(--primary)] hover:shadow-sm transition-all group">
                <div 
                  className="w-8 h-8 rounded-full text-white flex items-center justify-center font-semibold text-sm shadow-sm"
                  style={{ background: 'var(--gradient-primary)' }}
                >
                  {user?.name?.[0]?.toUpperCase()}
                </div>
                <div className="hidden sm:flex items-center gap-1.5">
                  <span className="text-[13px] font-semibold text-[var(--text-main)]">
                    {user?.name}
                  </span>
                  <ChevronDown size={13} className="text-slate-400 group-hover:text-[var(--primary)] transition-colors" />
                </div>
              </div>
            }
          >
            <DropdownItem onClick={() => navigate("/profile")} className="gap-3">
              <User size={16} className="text-slate-400" /> Profile
            </DropdownItem>
            <DropdownItem onClick={() => navigate("/settings")} className="gap-3">
              <Settings size={16} className="text-slate-400" /> Settings
            </DropdownItem>
            <div className="h-px bg-slate-100 my-1" />
            <DropdownItem onClick={handleLogout} className="text-rose-600 hover:bg-rose-50 gap-3">
              <LogOut size={16} /> Logout
            </DropdownItem>
          </Dropdown>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
