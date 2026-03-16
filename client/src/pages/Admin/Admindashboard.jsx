
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Users, ShoppingBag, DollarSign, TrendingUp, Package, Clock, ArrowRight,
  AlertTriangle, BarChart3, Layers, Eye
} from 'lucide-react';
import { Card, CardBody, CardHeader } from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
import API from '../../api/endpoints';

const Admindashboard = () => {
  const user = useSelector((state) => state.user.user);
  const navigate = useNavigate();
  const defaultStats = {
    totalRevenue: 0, totalOrders: 0, totalProducts: 0, totalUsers: 0,
    totalCategories: 0, recentOrders: [], lowStockProducts: [], topCategories: [],
  };
  const [stats, setStats] = useState(defaultStats);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await axiosClient.get(API.dashboard.stats);
        if (data.success) {
          setStats(data.stats);
        }
      } catch (err) {
        console.error('Failed to fetch dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const formatCurrency = (num) => {
    if (num >= 100000) return `₹${(num / 100000).toFixed(1)}L`;
    if (num >= 1000) return `₹${(num / 1000).toFixed(1)}K`;
    return `₹${num?.toLocaleString('en-IN') || '0'}`;
  };

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    const now = new Date();
    const diff = now - d;
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  };

  const statCards = [
    {
      label: 'Total Revenue',
      value: formatCurrency(stats.totalRevenue),
      icon: <DollarSign size={22} />,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      iconBg: 'bg-gradient-to-br from-emerald-400 to-emerald-600',
    },
    {
      label: 'Total Orders',
      value: stats.totalOrders?.toLocaleString() || '0',
      icon: <ShoppingBag size={22} />,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      iconBg: 'bg-gradient-to-br from-blue-400 to-blue-600',
    },
    {
      label: 'Total Products',
      value: stats.totalProducts?.toLocaleString() || '0',
      icon: <Package size={22} />,
      color: 'text-violet-600',
      bg: 'bg-violet-50',
      iconBg: 'bg-gradient-to-br from-violet-400 to-violet-600',
    },
    {
      label: 'Customers',
      value: stats.totalUsers?.toLocaleString() || '0',
      icon: <Users size={22} />,
      color: 'text-orange-600',
      bg: 'bg-orange-50',
      iconBg: 'bg-gradient-to-br from-orange-400 to-orange-600',
    },
  ];

  // Skeleton pulse component
  const Skeleton = ({ className = '' }) => (
    <div className={`animate-pulse bg-slate-200 rounded-xl ${className}`} />
  );

  return (
    <div className="p-5 sm:p-6 lg:p-8 space-y-8 animate-in fade-in duration-700">

      {/* ═══════════════════════════════════════════ */}
      {/* ──  WELCOME BANNER  ────────────────────── */}
      {/* ═══════════════════════════════════════════ */}
      <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-slate-900 via-slate-800 to-[var(--primary-dark)] p-7 md:p-10 text-white shadow-2xl">
        {/* Decorative background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/[0.03] rounded-full" />
          <div className="absolute -bottom-32 -left-16 w-80 h-80 bg-[var(--primary)]/10 rounded-full" />
          <div className="absolute top-1/2 right-10 w-40 h-40 bg-white/[0.02] rounded-full" />
        </div>

        <div className="relative z-10 space-y-5 max-w-2xl">
          <div className="space-y-1.5">
            <span className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] text-blue-300/80">
              <BarChart3 size={12} />
              Admin Control Center
            </span>
            <h1
              className="text-3xl md:text-5xl font-black italic leading-tight"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Welcome, <span className="text-[var(--accent)]">{user?.name || 'Admin'}</span>
            </h1>
          </div>
          <p className="text-slate-400 font-medium text-[15px] leading-relaxed max-w-lg">
            {loading ? 'Loading your dashboard...' : (
              <>
                Your store has <span className="text-white font-bold">{stats?.totalOrders || 0} orders</span> and{' '}
                <span className="text-white font-bold">{stats?.totalProducts || 0} products </span>
                  in the inventory.
              </>
            )}
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Button
              variant="orange"
              onClick={() => navigate('/admin/order')}
              className="h-12 px-6 rounded-xl gap-2.5 font-bold shadow-xl shadow-orange-500/20 text-sm"
            >
              Manage Orders <ArrowRight size={16} />
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate('/admin/product')}
              className="h-12 px-6 rounded-xl border-slate-600 text-white hover:bg-slate-700 gap-2.5 font-bold text-sm"
            >
              <Package size={16} /> View Inventory
            </Button>
          </div>
        </div>
      </div>


      {/* ═══════════════════════════════════════════ */}
      {/* ──  STATS CARDS  ──────────────────────── */}
      {/* ═══════════════════════════════════════════ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {loading ? (
          Array(4).fill(0).map((_, i) => (
            <Card key={i} className="border-none shadow-lg">
              <CardBody className="p-6">
                <div className="flex justify-between items-start mb-5">
                  <Skeleton className="w-12 h-12 rounded-2xl" />
                </div>
                <Skeleton className="h-3 w-20 mb-2" />
                <Skeleton className="h-8 w-28" />
              </CardBody>
            </Card>
          ))
        ) : (
          statCards.map((stat, index) => (
            <Card
              key={index}
              className="border-none shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 group cursor-default"
            >
              <CardBody className="p-6">
                <div className="flex justify-between items-start mb-5">
                  <div className={`p-3 rounded-2xl text-white shadow-lg ${stat.iconBg} group-hover:scale-110 transition-transform duration-500`}>
                    {stat.icon}
                  </div>
                </div>
                <div className="space-y-0.5">
                  <h3 className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em]">
                    {stat.label}
                  </h3>
                  <p className="text-3xl font-black text-[var(--text-main)] italic" style={{ fontFamily: 'var(--font-heading)' }}>
                    {stat.value}
                  </p>
                </div>
              </CardBody>
            </Card>
          ))
        )}
      </div>


      {/* ═══════════════════════════════════════════ */}
      {/* ──  MAIN CONTENT GRID  ────────────────── */}
      {/* ═══════════════════════════════════════════ */}
      <div className="grid lg:grid-cols-12 gap-6">

        {/* ── RECENT ORDERS (8 cols) ── */}
        <div className="lg:col-span-8">
          <Card className="border-none shadow-lg h-full overflow-hidden">
            <CardHeader className="bg-white border-b border-[var(--border-light)] py-5 px-6 flex justify-between items-center">
              <h3 className="text-base font-bold text-[var(--text-main)] flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
                  <Clock size={16} />
                </div>
                Recent Orders
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/admin/order')}
                className="font-bold text-[var(--primary)] hover:bg-blue-50 gap-1.5"
              >
                View All <ArrowRight size={14} />
              </Button>
            </CardHeader>
            <CardBody className="p-0">
              {loading ? (
                <div className="p-6 space-y-4">
                  {Array(4).fill(0).map((_, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <Skeleton className="w-10 h-10 rounded-xl" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-3 w-48" />
                        <Skeleton className="h-2.5 w-24" />
                      </div>
                      <Skeleton className="h-4 w-16" />
                    </div>
                  ))}
                </div>
              ) : stats?.recentOrders?.length > 0 ? (
                <div className="divide-y divide-[var(--border-light)]/50">
                  {stats.recentOrders.map((order, i) => {
                    const itemCount = order.items?.length || 0;
                    const firstProduct = order.items?.[0]?.productId;
                    return (
                      <div
                        key={order._id || i}
                        className="px-6 py-4 flex items-center justify-between hover:bg-[var(--bg-body)]/50 transition-colors group cursor-default"
                      >
                        <div className="flex items-center gap-4 min-w-0">
                          {/* Order icon */}
                          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 flex-shrink-0 group-hover:bg-blue-100 transition-colors">
                            <ShoppingBag size={16} />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-[var(--text-main)] truncate">
                              {firstProduct?.name
                                ? `${firstProduct.name}${itemCount > 1 ? ` +${itemCount - 1} more` : ''}`
                                : `Order with ${itemCount} item${itemCount !== 1 ? 's' : ''}`
                              }
                            </p>
                            <p className="text-[10px] text-[var(--text-muted)] font-medium uppercase tracking-widest mt-0.5">
                              {order.shippingAddress?.fullName || 'Guest'} • {formatDate(order.createdAt)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 flex-shrink-0">
                          <span className="text-sm font-bold text-[var(--text-main)]">
                            ₹{order.finalPrice?.toLocaleString('en-IN')}
                          </span>
                          <ArrowRight size={14} className="text-slate-300 group-hover:text-[var(--primary)] group-hover:translate-x-0.5 transition-all" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="py-16 flex flex-col items-center justify-center gap-2 text-[var(--text-muted)]">
                  <ShoppingBag size={28} strokeWidth={1.5} className="text-slate-300" />
                  <span className="text-sm font-medium">No orders yet</span>
                </div>
              )}
            </CardBody>
          </Card>
        </div>

        {/* ── QUICK ACTIONS + TOP CATEGORIES (4 cols) ── */}
        <div className="lg:col-span-4 space-y-6">

          {/* Quick Actions */}
          <Card className="border-none shadow-lg">
            <CardHeader className="py-4 px-6 border-b border-[var(--border-light)]">
              <h3 className="text-base font-bold text-[var(--text-main)]">Quick Actions</h3>
            </CardHeader>
            <CardBody className="p-5 space-y-3">
              <Button
                variant="orange"
                onClick={() => navigate('/admin/product')}
                className="w-full h-13 rounded-xl gap-2.5 font-bold text-sm shadow-md"
              >
                <Package size={18} />
                Add New Product
              </Button>
              <Button
                variant="primary"
                onClick={() => navigate('/admin/category')}
                className="w-full h-13 rounded-xl gap-2.5 font-bold text-sm shadow-md"
              >
                <Layers size={18} />
                Manage Categories
              </Button>
              <Button
                variant="outline"
                onClick={() => window.open('/', '_blank')}
                className="w-full h-13 rounded-xl gap-2.5 font-bold text-sm"
              >
                <Eye size={18} />
                Preview Store
              </Button>
            </CardBody>
          </Card>

          {/* Top Categories */}
          {!loading && stats?.topCategories?.length > 0 && (
            <Card className="border-none shadow-lg">
              <CardHeader className="py-4 px-6 border-b border-[var(--border-light)] flex justify-between items-center">
                <h3 className="text-base font-bold text-[var(--text-main)] flex items-center gap-2.5">
                  <div className="p-1.5 rounded-lg bg-violet-50 text-violet-600">
                    <BarChart3 size={14} />
                  </div>
                  Top Categories
                </h3>
              </CardHeader>
              <CardBody className="p-4">
                <div className="space-y-2">
                  {stats.topCategories.map((cat, i) => {
                    const maxCount = stats.topCategories[0]?.count || 1;
                    const percentage = Math.round((cat.count / maxCount) * 100);
                    return (
                      <div
                        key={cat._id || i}
                        className="group flex items-center gap-3 p-2.5 rounded-xl hover:bg-[var(--bg-body)] transition-colors cursor-default"
                      >
                        {cat.image ? (
                          <img
                            src={cat.image}
                            alt={cat.name}
                            className="w-9 h-9 rounded-lg object-cover border border-[var(--border-light)] flex-shrink-0"
                          />
                        ) : (
                          <div className="w-9 h-9 rounded-lg bg-violet-50 flex items-center justify-center text-violet-500 flex-shrink-0">
                            <Layers size={14} />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-xs font-semibold text-[var(--text-main)] truncate">{cat.name}</span>
                            <span className="text-[10px] font-bold text-[var(--text-muted)]">{cat.count}</span>
                          </div>
                          <div className="w-full bg-slate-100 rounded-full h-1.5">
                            <div
                              className="bg-gradient-to-r from-violet-400 to-violet-600 h-1.5 rounded-full transition-all duration-700"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardBody>
            </Card>
          )}
        </div>
      </div>


      {/* ═══════════════════════════════════════════ */}
      {/* ──  LOW STOCK ALERT  ──────────────────── */}
      {/* ═══════════════════════════════════════════ */}
      {!loading && stats?.lowStockProducts?.length > 0 && (
        <Card className="border-none shadow-lg overflow-hidden">
          <CardHeader className="bg-white border-b border-[var(--border-light)] py-5 px-6 flex justify-between items-center">
            <h3 className="text-base font-bold text-[var(--text-main)] flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-amber-50 text-amber-600">
                <AlertTriangle size={16} />
              </div>
              Low Stock Alert
              <span className="text-[10px] font-bold px-2 py-0.5 bg-amber-50 text-amber-600 rounded-md ml-1">
                {stats.lowStockProducts.length} items
              </span>
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/admin/product')}
              className="font-bold text-[var(--primary)] hover:bg-blue-50 gap-1.5"
            >
              Manage Stock <ArrowRight size={14} />
            </Button>
          </CardHeader>
          <CardBody className="p-0">
            <div className="overflow-x-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-[var(--border-light)]/40">
                {stats.lowStockProducts.map((product, i) => (
                  <div
                    key={product._id || i}
                    className="bg-white p-4 flex items-center gap-3.5 hover:bg-[var(--bg-body)]/50 transition-colors group"
                  >
                    {/* Product Image */}
                    <div className="w-12 h-12 rounded-xl overflow-hidden border border-[var(--border-light)] flex-shrink-0 bg-[var(--bg-body)]">
                      {product.images?.[0] ? (
                        <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-300">
                          <Package size={18} />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-[var(--text-main)] truncate">{product.name}</p>
                      <p className="text-[10px] text-[var(--text-muted)] font-medium mt-0.5">
                        {product.category?.name || 'Uncategorized'} • ₹{product.price?.toLocaleString('en-IN')}
                      </p>
                    </div>
                    <div className="flex-shrink-0">
                      <span className={`text-xs font-bold px-2 py-1 rounded-lg ${
                        product.stock === 0
                          ? 'bg-red-50 text-red-600'
                          : product.stock <= 5
                            ? 'bg-amber-50 text-amber-600'
                            : 'bg-yellow-50 text-yellow-600'
                      }`}>
                        {product.stock === 0 ? 'Out' : `${product.stock} left`}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardBody>
        </Card>
      )}

    </div>
  );
};

export default Admindashboard;
