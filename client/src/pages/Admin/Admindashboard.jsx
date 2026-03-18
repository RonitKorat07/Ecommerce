
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Users, ShoppingBag, DollarSign, TrendingUp, Package, Clock,
  AlertTriangle, BarChart3, CheckCircle2, RefreshCw, Award, Calendar
} from 'lucide-react';
import { Card, CardBody, CardHeader } from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
import API from '../../api/endpoints';

const Admindashboard = () => {
  const user = useSelector((state) => state.user.user);
  const navigate = useNavigate();
  
  const [stats, setStats] = useState({
    totalRevenue: 0, totalOrders: 0, totalProducts: 0, totalUsers: 0,
    totalCategories: 0, recentOrders: [], lowStockProducts: [], topCategories: [],
    todayRevenue: 0, last7DaysRevenue: [], last30DaysRevenue: [], allTimeRevenue: [],
    orderStatusStats: [], topProducts: []
  });
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState('7days'); // 'today', '7days', '30days', 'alltime'

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

  const getTimeframeData = () => {
    switch(timeframe) {
      case 'today': return [{ _id: 'Today', revenue: stats.todayRevenue }];
      case '7days': return stats.last7DaysRevenue;
      case '30days': return stats.last30DaysRevenue;
      case 'alltime': return stats.allTimeRevenue;
      default: return stats.last7DaysRevenue;
    }
  };

  const chartData = getTimeframeData();

  const kpis = [
    { label: 'Total Revenue', value: formatCurrency(stats.totalRevenue), icon: <DollarSign size={20} />, bg: 'bg-emerald-50', text: 'text-emerald-500', bar: 'bg-emerald-400/20' },
    { label: 'Orders', value: stats.totalOrders?.toLocaleString() || '0', icon: <ShoppingBag size={20} />, bg: 'bg-blue-50', text: 'text-blue-500', bar: 'bg-blue-400/20' },
    { label: 'Products', value: stats.totalProducts?.toLocaleString() || '0', icon: <Package size={20} />, bg: 'bg-violet-50', text: 'text-violet-500', bar: 'bg-violet-400/20' },
    { label: 'Customers', value: stats.totalUsers?.toLocaleString() || '0', icon: <Users size={20} />, bg: 'bg-orange-50', text: 'text-orange-500', bar: 'bg-orange-400/20' },
  ];

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-[1440px] mx-auto space-y-6 animate-in fade-in duration-500" style={{ fontFamily: 'var(--font-body)' }}>
      
      {/* Mini Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[var(--border-light)] pb-5 mb-2">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--text-main)] flex items-center gap-2 tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>
            Dashboard 
            <span className="text-[var(--primary)] text-[10px] font-bold uppercase tracking-widest bg-[var(--primary-light)] px-2 py-0.5 rounded-md">PRO</span>
          </h1>
          <p className="text-sm font-medium text-[var(--text-muted)] mt-1">
            Real-time insights tailored to your inventory and sales.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-[var(--border-light)] shadow-sm text-xs font-semibold text-[var(--text-muted)]">
            <Clock size={14} className="text-blue-500" />
            Active Sync
          </div>
          <Button 
            variant="primary" 
            onClick={() => navigate('/admin/order')}
            className="h-9 px-4 rounded-lg text-xs font-semibold shadow-sm"
          >
            Live Monitor
          </Button>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {loading ? Array(4).fill(0).map((_, i) => (
          <div key={i} className="h-24 bg-[var(--bg-card)] rounded-xl border border-[var(--border-light)] animate-pulse" />
        )) : kpis.map((kpi, i) => (
          <Card key={i} className="border border-[var(--border-light)] shadow-sm hover:shadow-md transition-shadow duration-300 bg-[var(--bg-card)] rounded-xl">
            <CardBody className="p-5 flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${kpi.bg} ${kpi.text}`}>
                {kpi.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider truncate mb-0.5">{kpi.label}</p>
                <h4 className="text-2xl font-bold text-[var(--text-main)] tracking-tight">{kpi.value}</h4>
              </div>
              <div className="flex items-end gap-1 h-8 opacity-70">
                 {[40, 70, 50, 90, 60].map((h, j) => (
                   <div key={j} className={`w-1.5 rounded-t-sm ${kpi.bar}`} style={{ height: `${h}%` }} />
                 ))}
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* Main Stats Row */}
      <div className="grid lg:grid-cols-12 gap-5 items-stretch">
        
        {/* Revenue Chart Card (8 cols) */}
        <div className="lg:col-span-8 h-full">
          <Card className="border border-[var(--border-light)] shadow-sm bg-white rounded-xl h-full flex flex-col">
            <CardHeader className="p-5 pb-0 flex flex-col sm:flex-row items-center justify-between border-none gap-4">
               <div className="flex items-center gap-3 w-full sm:w-auto">
                  <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0">
                     <BarChart3 size={18} />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-[var(--text-main)]" style={{ fontFamily: 'var(--font-heading)' }}>Sales Revenue</h3>
                    <p className="text-xs text-[var(--text-muted)] font-medium">Performance over time</p>
                  </div>
               </div>
               
               <div className="flex bg-[var(--bg-section)] p-1 rounded-lg w-full sm:w-auto overflow-x-auto no-scrollbar">
                  {[
                    { id: 'today', label: 'Today' },
                    { id: '7days', label: '7 Days' },
                    { id: '30days', label: '30 Days' },
                    { id: 'alltime', label: 'All Time' }
                  ].map((t) => (
                    <button 
                      key={t.id}
                      onClick={() => setTimeframe(t.id)}
                      className={`px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-tight transition-all whitespace-nowrap ${timeframe === t.id ? 'bg-white shadow-sm text-[var(--text-main)] border border-[var(--border-light)]' : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'}`}
                    >
                      {t.label}
                    </button>
                  ))}
               </div>
            </CardHeader>

            <CardBody className="p-6 flex-1 flex flex-col justify-end">
              <div className="h-[240px] w-full flex items-end justify-between gap-1.5 sm:gap-2">
                {chartData?.length > 0 ? (() => {
                  const revenues = chartData.map(it => it.revenue);
                  const maxRev = Math.max(...revenues, 1);
                  
                  // Limit bars to avoid crowding
                  const displayBars = timeframe === '30days' ? chartData.slice(-15) : chartData;

                  return displayBars.map((d, i) => {
                    const h = Math.max((d.revenue / maxRev) * 100, 5); 
                    return (
                      <div key={i} className="flex-1 flex flex-col items-center gap-2 group relative h-full justify-end">
                         {/* Tooltip */}
                         <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-[var(--text-main)] text-white text-[10px] font-medium px-2 py-1 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20 pointer-events-none">
                            ₹{d.revenue.toLocaleString()}
                         </div>
                         {/* Bar */}
                         <div 
                           className={`w-full max-w-[40px] rounded-t-lg relative overflow-hidden transition-all duration-500 ease-out select-none ${timeframe === 'today' ? 'bg-emerald-500' : 'bg-blue-500/10 group-hover:bg-blue-500/20'}`} 
                           style={{ height: `${h}%` }}
                         >
                            {timeframe !== 'today' && <div className="absolute bottom-0 w-full bg-blue-500 rounded-t-lg" style={{ height: '100%' }} />}
                         </div>
                         {/* Label */}
                         <span className="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-tighter truncate w-full text-center">
                           {timeframe === 'alltime' ? d._id : timeframe === 'today' ? 'Now' : new Date(d._id).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                         </span>
                      </div>
                    );
                  });
                })() : (
                  <div className="w-full h-full border-b border-[var(--border-light)] flex flex-col items-center justify-center text-[var(--text-muted)] gap-3">
                    <Calendar size={36} strokeWidth={1.5} className="opacity-40 text-blue-500" />
                    <span className="text-xs font-semibold tracking-wide uppercase">No records found for this period</span>
                  </div>
                )}
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Status Breakdown Card (4 cols) */}
        <div className="lg:col-span-4 h-full">
          <Card className="border border-[var(--border-light)] shadow-sm bg-white rounded-xl h-full flex flex-col">
             <CardHeader className="p-5 border-b border-[var(--border-light)] space-y-0.5">
                <h3 className="text-base font-semibold text-[var(--text-main)]" style={{ fontFamily: 'var(--font-heading)' }}>Order Lifecycle</h3>
                <p className="text-xs text-[var(--text-muted)] font-medium">Current fulfillment status</p>
             </CardHeader>
             <CardBody className="p-5 flex-1 flex flex-col">
                <div className="space-y-5 flex-1">
                  {stats.orderStatusStats?.length > 0 ? stats.orderStatusStats.map((item, i) => {
                    const total = stats.totalOrders || 1;
                    const percent = Math.round((item.count / total) * 100);
                    return (
                      <div key={i} className="space-y-2">
                         <div className="flex justify-between text-xs font-semibold uppercase tracking-wider">
                            <span className="text-[var(--text-muted)]">{item._id === 'null' ? 'New' : item._id}</span>
                            <span className="text-[var(--text-main)]">{item.count}</span>
                         </div>
                         <div className="h-2 w-full bg-[var(--bg-section)] rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full transition-all duration-1000 ${
                                item._id?.toLowerCase() === 'delivered' ? 'bg-emerald-500' : 
                                item._id?.toLowerCase() === 'cancelled' ? 'bg-rose-500' : 
                                item._id?.toLowerCase() === 'shipped' ? 'bg-blue-500' : 'bg-amber-500'
                              }`}
                              style={{ width: `${percent}%` }}
                            />
                         </div>
                      </div>
                    );
                  }) : (
                     <div className="flex-1 flex items-center justify-center text-[var(--text-muted)] text-xs font-semibold uppercase tracking-widest">
                        Fulfillment tracking inactive
                     </div>
                  )}
                </div>
                
                {/* Footer of Status Card */}
                <div className="pt-5 border-t border-[var(--border-light)] mt-5 flex flex-col gap-2.5">
                   <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-[var(--text-muted)]">Total processed</span>
                      <span className="text-[var(--text-main)] font-bold">{stats.totalOrders} Units</span>
                   </div>
                   <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-[var(--text-muted)]">Inventory Health</span>
                      <span className="text-emerald-500 font-bold flex items-center gap-1.5 uppercase tracking-wider">
                         Stable <TrendingUp size={12} />
                      </span>
                   </div>
                </div>
             </CardBody>
          </Card>
        </div>
      </div>

      {/* Bottom Features Grid */}
      <div className="grid lg:grid-cols-12 gap-5 items-stretch">
        
        {/* Top Products Table (7 cols) */}
        <div className="lg:col-span-7 h-full">
           <Card className="border border-[var(--border-light)] shadow-sm bg-white rounded-xl h-full flex flex-col">
              <CardHeader className="p-5 flex justify-between items-center border-b border-[var(--border-light)]">
                 <div className="flex items-center gap-2">
                    <Award size={18} className="text-amber-500" />
                    <h3 className="text-sm font-semibold text-[var(--text-main)] uppercase tracking-wider">Bestsellers</h3>
                 </div>
                 <span className="text-xs font-medium text-[var(--text-muted)]">Performance Metrics</span>
              </CardHeader>
              <CardBody className="p-0 flex-1 overflow-x-auto">
                 <table className="w-full text-left">
                    <thead className="bg-[var(--bg-section)] text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest">
                       <tr>
                          <th className="px-5 py-4">Product Detail</th>
                          <th className="px-5 py-4">Units Sold</th>
                          <th className="px-5 py-4 text-right">Contribution</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--border-light)]">
                       {stats.topProducts?.length > 0 ? stats.topProducts.map((p, i) => (
                         <tr key={i} className="hover:bg-[var(--bg-section)] group transition-colors">
                            <td className="px-5 py-3.5 flex items-center gap-3">
                               <div className="w-10 h-10 rounded-lg bg-[var(--bg-section)] overflow-hidden flex-shrink-0 flex items-center justify-center border border-[var(--border-light)] group-hover:scale-105 transition-transform">
                                  {p.image ? <img src={p.image} className="w-full h-full object-cover" /> : <Package size={16} className="text-[var(--text-muted)]" />}
                               </div>
                               <span className="text-sm font-semibold text-[var(--text-main)] truncate max-w-[200px]">{p.name}</span>
                            </td>
                            <td className="px-5 py-3.5">
                               <div className="flex items-center gap-2">
                                  <span className="text-sm font-bold text-[var(--text-main)]">{p.totalSold}</span>
                                  <span className="text-[10px] text-[var(--text-muted)] font-medium">Units</span>
                               </div>
                            </td>
                            <td className="px-5 py-3.5 text-right">
                               <span className="text-sm font-black text-emerald-600">₹{p.revenue?.toLocaleString()}</span>
                            </td>
                         </tr>
                       )) : (
                         <tr>
                            <td colSpan="3" className="px-5 py-12 text-center text-[var(--text-muted)] text-sm font-medium italic">
                               Insufficient order data to calculate bestsellers
                            </td>
                         </tr>
                       )}
                    </tbody>
                 </table>
              </CardBody>
           </Card>
        </div>

        {/* Low Stock Tracker (5 cols) */}
        <div className="lg:col-span-5 h-full">
           <Card className="border border-[var(--border-light)] shadow-sm bg-white rounded-xl h-full flex flex-col">
              <CardHeader className="p-5 flex justify-between items-center border-b border-[var(--border-light)]">
                 <div className="flex items-center gap-2">
                    <AlertTriangle size={16} className="text-rose-500" />
                    <h3 className="text-sm font-semibold text-[var(--text-main)] uppercase tracking-wider">Stock Alert</h3>
                 </div>
                 <div className="flex gap-1">
                    <span className="text-[9px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded uppercase tracking-wider">Critical</span>
                 </div>
              </CardHeader>
              <CardBody className="p-5 flex-1 flex flex-col">
                 <div className="space-y-4 flex-1">
                    {stats.lowStockProducts?.length > 0 ? stats.lowStockProducts.slice(0, 5).map((p) => (
                      <div key={p._id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-[var(--bg-section)] transition-colors">
                         <div className="w-11 h-11 rounded-lg bg-[var(--bg-section)] overflow-hidden border border-[var(--border-light)] flex-shrink-0 flex items-center justify-center">
                            {p.images?.[0] ? <img src={p.images[0]} className="w-full h-full object-cover" /> : <Package size={16} className="text-[var(--text-muted)]" />}
                         </div>
                         <div className="flex-1 min-w-0">
                            <h4 className="text-xs font-bold text-[var(--text-main)] truncate uppercase tracking-tight">{p.name}</h4>
                            <p className="text-[10px] font-semibold text-[var(--text-muted)] capitalize mt-0.5">{p.category?.name || 'Standard'}</p>
                         </div>
                         <div className="text-right">
                            <div className={`text-xs font-black ${p.stock <= 2 ? 'text-rose-500' : 'text-amber-500'}`}>
                               {p.stock} <span className="text-[9px] font-medium text-[var(--text-muted)]">left</span>
                            </div>
                         </div>
                      </div>
                    )) : (
                      <div className="h-full flex flex-col items-center justify-center text-emerald-500 text-xs font-bold uppercase tracking-widest py-10 opacity-60">
                         <CheckCircle2 size={32} className="mb-3" />
                         All Items Shelved
                      </div>
                    )}
                 </div>
                 <Button 
                   variant="outline" 
                   size="sm" 
                   fullWidth 
                   onClick={() => navigate('/admin/product')}
                   className="mt-6 h-10 rounded-lg border-[var(--border-light)] text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] hover:text-[var(--primary)] hover:border-[var(--primary)] transition-all"
                 >
                   Inventory Manager <RefreshCw size={12} className="ml-2" />
                 </Button>
              </CardBody>
           </Card>
        </div>
      </div>

    </div>
  );
};

export default Admindashboard;