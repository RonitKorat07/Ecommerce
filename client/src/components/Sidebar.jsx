import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { 
  ShoppingBag, 
  LayoutDashboard, 
  Settings, 
  HelpCircle, 
  ClipboardList,
  Layers,
  PanelLeftClose,
  PanelLeftOpen,
  User as UserIcon,
  Package
} from 'lucide-react';
import Logo from './Logo';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const location = useLocation();
  const user = useSelector((state) => state.user.user);

  const adminLinks = [
    { name: 'Overview', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Categories', path: '/admin/category', icon: Layers },
    { name: 'Inventory', path: '/admin/product', icon: ShoppingBag },
    { name: 'Orders', path: '/admin/order', icon: ClipboardList },
  ];

  const userLinks = [
    { name: 'Store', path: '/user/dashboard', icon: LayoutDashboard },
    { name: 'My Orders', path: '/user/myorder', icon: Package },
    { name: 'Help', path: '/support', icon: HelpCircle },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  const links = user?.role === 'admin' ? adminLinks : userLinks;

  return (
    <>
      {/* Mobile Overlay */}
      <div 
        className={`fixed inset-0 z-[60] bg-slate-900/40 backdrop-blur-sm lg:hidden transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsOpen(false)}
      />

      <aside 
        className={`fixed left-0 top-0 bottom-0 z-[70] bg-white border-r border-[var(--border-light)] transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] overflow-hidden ${
          isOpen 
            ? 'w-[var(--sidebar-width)]' 
            : '-translate-x-full lg:translate-x-0 lg:w-[var(--sidebar-collapsed-width)] shadow-xl lg:shadow-none'
        }`}
      >
        <div className="flex flex-col h-full">

          {/* ── Header: Logo + Collapse Button ── */}
          <div className={`h-[var(--topbar-height)] flex items-center shrink-0 border-b border-[var(--border-light)] ${
            isOpen ? 'justify-between px-5' : 'justify-center'
          }`}>
            {isOpen ? (
              <>
                <Link to="/" className="flex items-center group">
                  <Logo className="w-7 h-7 group-hover:scale-105 transition-transform duration-200" />
                </Link>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg text-[var(--text-muted)] hover:bg-[var(--primary-light)] hover:text-[var(--primary)] transition-all duration-200"
                >
                  <PanelLeftClose size={18} />
                </button>
              </>
            ) : (
              <div 
                onClick={() => setIsOpen(true)}
                className="cursor-pointer group"
              >
                <Logo className="w-7 h-7 group-hover:scale-105 transition-transform duration-200" hideText />
              </div>
            )}
          </div>

          {/* ── Navigation ── */}
          <div className={`flex-1 px-3 pt-6 pb-4 ${isOpen ? 'overflow-y-auto custom-scrollbar' : 'overflow-hidden'}`}>
            {/* Section Label */}
            {isOpen && (
              <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] px-3 mb-3">
                Menu
              </div>
            )}

            <nav className="flex flex-col gap-1">
              {links.map((link) => {
                const Icon = link.icon;
                const isActive = location.pathname === link.path;
                
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    onClick={() => window.innerWidth < 1024 && setIsOpen(false)}
                    className={`group relative flex items-center rounded-xl text-sm no-underline transition-all duration-200
                      ${isActive 
                        ? 'bg-[var(--primary-light)] text-[var(--primary)] font-semibold' 
                        : 'text-[var(--text-muted)] hover:bg-[var(--primary-light)] hover:text-[var(--primary)] font-medium'
                      }
                      ${isOpen 
                        ? 'gap-3 px-3 py-2.5' 
                        : 'justify-center py-2 mx-auto w-10 h-10'
                      }
                    `}
                  >
                    {/* Active indicator bar — only when expanded */}
                    {isActive && isOpen && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-[60%] rounded-r-full bg-[var(--primary)]" />
                    )}

                    <Icon 
                      size={20} 
                      strokeWidth={isActive ? 2.2 : 1.8} 
                      className="flex-shrink-0" 
                    />

                    {isOpen && (
                      <span className="truncate">{link.name}</span>
                    )}

                    {/* Collapsed tooltip */}
                    {!isOpen && (
                      <div className="absolute left-full ml-3 px-2.5 py-1 bg-slate-800 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 whitespace-nowrap z-50 shadow-lg">
                        {link.name}
                      </div>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* ── Footer: Admin Profile ── */}
          <div className="px-3 pb-4 pt-3 shrink-0 border-t border-[var(--border-light)]">
            <div className={`bg-[var(--bg-section)] rounded-xl hover:bg-[var(--primary-light)] transition-all duration-200 ${
              isOpen ? 'p-3' : 'p-2 flex items-center justify-center'
            }`}>
              <div className={`flex items-center ${isOpen ? 'gap-3' : 'justify-center'}`}>
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  <div 
                    className="w-9 h-9 rounded-lg flex items-center justify-center text-white font-semibold text-sm shadow-sm"
                    style={{ background: 'var(--gradient-primary)' }}
                  >
                    {user?.name?.[0]?.toUpperCase() || <UserIcon size={18} />}
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
                </div>

                {/* Name + Badge */}
                {isOpen && (
                  <div className="flex flex-col min-w-0 flex-1">
                    <span className="text-[13px] font-semibold text-[var(--text-main)] truncate leading-tight">
                      {user?.name}
                    </span>
                    <span className="text-[9px] font-bold uppercase tracking-widest mt-0.5 px-1.5 py-px rounded-sm w-fit bg-[var(--accent-light)] text-[var(--accent-dark)]">
                      {user?.role}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </aside>
    </>
  );
};

export default Sidebar;
