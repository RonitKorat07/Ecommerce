
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/Userslice";
import { 
  ShoppingBasket, 
  Search, 
  User, 
  LogOut, 
  Menu, 
  Settings, 
  LayoutGrid, 
  ChevronDown,
  ClipboardList,
  UserCircle,
  ShieldCheck,
  LogIn
} from "lucide-react";
import { clearCart, fetchCart } from "../redux/Cartslice";
import { Dropdown, DropdownItem } from "./UI/Dropdown";
import useModal from "./UI/Modal/useModal";
import Logo from "./Logo";
import Button from "./UI/Button";

function Navbar({ isSidebarOpen, onToggleSidebar }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const navigate = useNavigate();
  const location = useLocation();
  const { openModal } = useModal();
  const [searchquery, setsearchquery] = useState("");

  const cartCount = useSelector((state) => state.cart.items.length);
  const isAdmin = user?.role === 'admin';

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    dispatch(logout());
    dispatch(clearCart());
    navigate("/", { replace: true });
  };

  useEffect(() => {
    if (user?._id && !isAdmin) {
      dispatch(fetchCart(user._id));
    }
  }, [dispatch, user, isAdmin]);

  const getPageLabel = (path) => {
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

  return (
    <nav
      className={`fixed top-0 right-0 z-[50] h-[var(--topbar-height)] transition-all duration-300 glass-effect flex items-center ${
        isAdmin && isSidebarOpen ? "left-[var(--sidebar-width)]" : isAdmin ? "left-0 lg:left-[var(--sidebar-collapsed-width)]" : "left-0"
      }`}
    >
      <div className="w-full h-full px-4 sm:px-6 md:px-8 flex items-center justify-between">

        {/* ── Left: Logo + Page Title ── */}
        <div className="flex items-center gap-4 md:gap-6">
          {isAdmin && (
            <button 
              onClick={onToggleSidebar}
              className="p-2 -ml-2 rounded-lg hover:bg-slate-100 text-slate-500 lg:hidden transition-colors flex-shrink-0"
            >
              <Menu size={22} />
            </button>
          )}
          
          <div 
            className="flex items-center gap-3"
            onClick={() => navigate('/')}
          >
            {isAdmin ? (
               <div className="flex items-center gap-2.5">
                  <span className="w-1.5 h-6 rounded-full" style={{ background: 'var(--gradient-primary)' }} />
                  <h1 className="font-bold text-xl tracking-tight text-[var(--text-main)]" style={{ fontFamily: 'var(--font-heading)' }}>
                     {currentPage}
                  </h1>
               </div>
            ) : (
               <Logo className="w-6 h-6 sm:w-7 sm:h-7" textClassName="text-xl sm:text-2xl" />
            )}
          </div>
        </div>

        {/* ── Center: Search Bar (User/Guest only) ── */}
        {!isAdmin && (
          <div className="hidden md:flex flex-1 max-w-md mx-8 transition-transform group-focus-within:max-w-xl">
            <form onSubmit={handelsearchsubmit} className="relative w-full group">
              <input
                type="text"
                placeholder="Search products..."
                value={searchquery}
                onChange={(e) => setsearchquery(e.target.value)}
                className="w-full bg-slate-100/50 border-2 border-transparent focus:bg-white focus:border-[var(--primary)] focus:shadow-[0_0_20px_rgba(var(--primary-rgb),0.15)] px-11 py-2.5 rounded-full text-sm font-medium transition-all outline-none text-slate-700 placeholder:text-slate-400"
              />
              <Search className="absolute top-1/2 -translate-y-1/2 left-4 text-slate-400 group-focus-within:text-[var(--primary)] transition-colors" size={18} />
            </form>
          </div>
        )}

        {/* ── Right: Cart + Profile/Login ── */}
        <div className="flex items-center gap-3 md:gap-4">
          {/* Cart Icon (Non-Admin only) */}
          {!isAdmin && (
             <button 
                onClick={() => navigate('/user/addtocart')}
                className="relative p-2.5 rounded-xl bg-slate-50 text-slate-600 hover:bg-[var(--primary)] hover:text-white transition-all shadow-sm group"
             >
                <ShoppingBasket size={20} className="group-hover:scale-110 transition-transform" />
                {cartCount > 0 && (
                   <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1 bg-[var(--danger)] text-white text-[10px] font-black tracking-tighter flex items-center justify-center rounded-full shadow-md ring-2 ring-white">
                      {cartCount}
                   </span>
                )}
             </button>
          )}

          {/* Profile Dropdown or Login Button */}
          {user ? (
            <Dropdown
              trigger={
                <div className="flex items-center gap-3 pl-2 pr-4 py-1.5 rounded-2xl border-2 border-slate-100/80 cursor-pointer hover:border-[var(--primary-light)] hover:bg-white hover:shadow-md transition-all group bg-slate-50/50">
                  <div 
                    className="w-8 h-8 rounded-xl text-white flex items-center justify-center font-bold text-sm shadow-md transition-transform group-hover:scale-105"
                    style={{ background: 'var(--gradient-primary)' }}
                  >
                    {user?.name?.[0]?.toUpperCase()}
                  </div>
                  <div className="hidden sm:flex items-center gap-2">
                    <span className="text-[13px] font-bold text-[var(--text-main)] group-hover:text-[var(--primary)] transition-colors line-clamp-1 max-w-[80px]">
                      {user?.name}
                    </span>
                    <ChevronDown size={14} className="text-slate-400 group-hover:text-[var(--primary)] transition-all transform group-hover:-rotate-180" />
                  </div>
                </div>
              }
              align="right"
            >
              {!isAdmin && (
                <>
                  <DropdownItem onClick={() => navigate("/")} className="gap-3 font-semibold text-slate-700 hover:text-[var(--primary)] flex items-center py-2.5">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-500 flex items-center justify-center">
                      <LayoutGrid size={16} />
                    </div>
                    <span>Store Home</span>
                  </DropdownItem>
                  <DropdownItem onClick={() => navigate("/user/myorder")} className="gap-3 font-semibold text-slate-700 hover:text-[var(--primary)] flex items-center py-2.5">
                    <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-500 flex items-center justify-center">
                      <ClipboardList size={16} />
                    </div>
                    <span>My Orders</span>
                  </DropdownItem>
                </>
              )}
              
              <DropdownItem onClick={() => navigate("/profile")} className="gap-3 font-medium text-slate-600 flex items-center py-2.5 border-t border-slate-100">
                <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center">
                  <UserCircle size={16} />
                </div>
                <span>Account Profile</span>
              </DropdownItem>

              <DropdownItem 
                onClick={() => {
                  openModal({
                    title: 'Secure Logout',
                    type: 'danger',
                    content: 'Are you sure you want to log out of your account? You will need to sign in again to access your data.',
                    confirmText: 'Logout Now',
                    onConfirm: handleLogout
                  });
                }} 
                className="text-rose-600 hover:bg-rose-50 hover:text-rose-700 gap-3 font-bold rounded-xl transition-all flex items-center py-3 px-4"
              >
                <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center">
                  <LogOut size={16} />
                </div>
                <span>Secure Logout</span>
              </DropdownItem>
            </Dropdown>
          ) : (
            <Button 
              onClick={() => navigate('/signin')}
              variant="primary"
              size="sm"
              className="rounded-xl flex items-center gap-2 px-4 py-2"
            >
              Sign In
              <LogIn size={16} />
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
