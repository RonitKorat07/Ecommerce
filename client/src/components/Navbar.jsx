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
  const isAdmin = user?.role === 'admin';

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearCart());
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/signin");
  };

  useEffect(() => {
    if (user?._id && !isAdmin) {
      dispatch(fetchCart(user._id));
    }
  }, [dispatch, user, isAdmin]);

  const getPageLabel = (path) => {
    if (!isAdmin) return 'ShopEase'; // For normal users, the logo/name is better than a page title
    
    const segments = path.split('/').filter(Boolean);
    const titleMap = {
      'admin/dashboard': 'Overview',
      'admin/category': 'Categories',
      'admin/product': 'Inventory',
      'admin/order': 'Fulfill Orders',
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

  const navLinks = [
    { name: 'Store', path: '/user/dashboard' },
    { name: 'My Orders', path: '/user/myorder' },
  ];

  return (
    <nav
      className={`fixed top-0 right-0 z-[50] h-[var(--topbar-height)] transition-all duration-300 glass-effect flex items-center ${
        isAdmin && isSidebarOpen ? "left-[var(--sidebar-width)]" : isAdmin ? "left-0 lg:left-[var(--sidebar-collapsed-width)]" : "left-0"
      }`}
    >
      <div className="w-full h-full px-6 md:px-8 flex items-center justify-between">

        {/* ── Left: Hamburger/Logo + Page Title ── */}
        <div className="flex items-center gap-6">
          {isAdmin && (
            <button 
              onClick={onToggleSidebar}
              className="p-2 -ml-2 rounded-lg hover:bg-slate-100 text-slate-500 lg:hidden transition-colors flex-shrink-0"
            >
              <Menu size={22} />
            </button>
          )}
          
          <div 
            className="flex items-center gap-2.5 cursor-pointer"
            onClick={() => navigate(isAdmin ? '/admin/dashboard' : '/user/dashboard')}
          >
            {isAdmin ? (
               <span className="w-1.5 h-5 rounded-full" style={{ background: 'var(--gradient-primary)' }} />
            ) : (
               <div className="w-8 h-8 rounded-xl bg-[var(--primary)] flex items-center justify-center text-white shadow-md">
                  <ShoppingBag size={18} strokeWidth={2.5} />
               </div>
            )}
            <h1 
              className={`font-bold tracking-tight ${isAdmin ? 'text-xl' : 'text-2xl'}`}
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
        {!isAdmin && (
          <div className="hidden md:flex flex-1 max-w-md mx-8 transition-transform group-focus-within:max-w-xl">
            <form onSubmit={handelsearchsubmit} className="relative w-full group">
              <input
                type="text"
                placeholder="Search products..."
                value={searchquery}
                onChange={(e) => setsearchquery(e.target.value)}
                className="w-full bg-slate-100 border-2 border-transparent focus:bg-white focus:border-[var(--primary)] focus:shadow-[0_0_15px_rgba(var(--primary-rgb),0.2)] px-11 py-2.5 rounded-full text-sm font-medium transition-all outline-none text-slate-700 placeholder:text-slate-400"
              />
              <Search className="absolute top-1/2 -translate-y-1/2 left-4 text-slate-400 group-focus-within:text-[var(--primary)] transition-colors" size={18} />
            </form>
          </div>
        )}

        {/* ── Right: Cart + Notifications + Profile ── */}
        <div className="flex items-center gap-3">
          {/* Cart Icon (User only) */}
          {!isAdmin && (
             <button 
                onClick={() => navigate('/user/addtocart')}
                className="relative p-2.5 rounded-xl bg-slate-50 text-slate-600 hover:bg-[var(--primary)] hover:text-white transition-all shadow-sm group"
             >
                <ShoppingBag size={20} className="group-hover:scale-110 transition-transform" />
                {cartCount > 0 && (
                   <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-[var(--danger)] text-white text-[10px] font-black tracking-tighter flex items-center justify-center rounded-full shadow-md ring-2 ring-white">
                      {cartCount}
                   </span>
                )}
             </button>
          )}

          {/* Notification Bell */}
          <button className="relative p-2.5 rounded-xl bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-all shadow-sm hidden sm:block">
            <Bell size={20} />
            <span 
              className="absolute top-2 right-2 w-2 h-2 rounded-full ring-2 ring-white"
              style={{ backgroundColor: 'var(--accent)' }}
            />
          </button>

          {/* Profile Dropdown */}
          <Dropdown
            trigger={
              <div className="flex items-center gap-3 pl-2 pr-4 py-1.5 ml-2 rounded-full border-2 border-slate-100 cursor-pointer hover:border-[var(--primary-light)] hover:bg-slate-50 transition-all group bg-white shadow-sm">
                <div 
                  className="w-8 h-8 rounded-full text-white flex items-center justify-center font-bold text-sm shadow-md transition-transform group-hover:scale-105"
                  style={{ background: 'var(--gradient-primary)' }}
                >
                  {user?.name?.[0]?.toUpperCase()}
                </div>
                <div className="hidden sm:flex items-center justify-between min-w-[70px]">
                  <span className="text-[13px] font-bold text-[var(--text-main)] group-hover:text-[var(--primary)] transition-colors line-clamp-1 max-w-[80px]">
                    {user?.name}
                  </span>
                  <ChevronDown size={14} className="text-slate-400 group-hover:text-[var(--primary)] transition-all transform group-hover:-rotate-180" />
                </div>
              </div>
            }
          >
            {/* User Specific Dropdown Options */}
            {!isAdmin && (
              <>
                <DropdownItem onClick={() => navigate("/user/dashboard")} className="gap-3 font-semibold text-slate-700 hover:text-[var(--primary)]">
                  <ShoppingBag size={16} /> Store
                </DropdownItem>
                <DropdownItem onClick={() => navigate("/user/myorder")} className="gap-3 font-semibold text-slate-700 hover:text-[var(--primary)]">
                  <User size={16} /> My Orders
                </DropdownItem>
                <div className="h-px bg-slate-100 my-1 -mx-2" />
              </>
            )}
            
            <DropdownItem onClick={() => navigate("/profile")} className="gap-3 font-medium text-slate-600">
              <User size={16} className="text-slate-400" /> Account Profile
            </DropdownItem>
            <DropdownItem onClick={() => navigate("/settings")} className="gap-3 font-medium text-slate-600">
              <Settings size={16} className="text-slate-400" /> Settings
            </DropdownItem>
            <div className="h-px bg-slate-100 my-2 -mx-2" />
            <DropdownItem onClick={handleLogout} className="text-rose-600 hover:bg-rose-50 hover:text-rose-700 gap-3 font-bold rounded-lg transition-colors">
              <LogOut size={16} /> Secure Logout
            </DropdownItem>
          </Dropdown>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
