
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
    { 
      label: 'Total Revenue', 
      value: formatCurrency(stats.totalRevenue), 
      sub: `Today: ${formatCurrency(stats.todayRevenue || 0)}`,
      icon: <DollarSign size={20} />, 
      gradient: 'from-emerald-400 to-teal-500', 
      lightBg: 'bg-emerald-50',
      textColor: 'text-emerald-600',
      sparkColor: '#10b981',
      sparkData: [30, 60, 40, 80, 55, 75, 90]
    },
    { 
      label: 'Total Orders', 
      value: stats.totalOrders?.toLocaleString() || '0', 
      sub: 'All time',
      icon: <ShoppingBag size={20} />, 
      gradient: 'from-blue-400 to-indigo-500', 
      lightBg: 'bg-blue-50',
      textColor: 'text-blue-600',
      sparkColor: '#3b82f6',
      sparkData: [20, 45, 35, 65, 50, 70, 55]
    },
    { 
      label: 'Products', 
      value: stats.totalProducts?.toLocaleString() || '0', 
      sub: `${stats.lowStockProducts?.length || 0} low stock`,
      icon: <Package size={20} />, 
      gradient: 'from-violet-400 to-purple-500', 
      lightBg: 'bg-violet-50',
      textColor: 'text-violet-600',
      sparkColor: '#8b5cf6',
      sparkData: [50, 55, 60, 58, 62, 65, 70]
    },
    { 
      label: 'Customers', 
      value: stats.totalUsers?.toLocaleString() || '0', 
      sub: 'Registered users',
      icon: <Users size={20} />, 
      gradient: 'from-orange-400 to-rose-400', 
      lightBg: 'bg-orange-50',
      textColor: 'text-orange-600',
      sparkColor: '#f97316',
      sparkData: [10, 30, 20, 50, 40, 60, 80]
    },
  ];

  // Sparkline mini SVG generator
  const Sparkline = ({ data, color }) => {
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;
    const w = 80, h = 30;
    const pts = data.map((v, i) => ({
      x: (i / (data.length - 1)) * w,
      y: h - ((v - min) / range) * (h - 4) - 2,
    }));
    const path = pts.reduce((acc, p, i, a) => {
      if (i === 0) return `M${p.x},${p.y}`;
      const prev = a[i-1];
      return `${acc} C${prev.x + (p.x-prev.x)/2},${prev.y} ${prev.x + (p.x-prev.x)/2},${p.y} ${p.x},${p.y}`;
    }, '');
    const area = `${path} L${w},${h} L0,${h}Z`;
    return (
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-full" preserveAspectRatio="none">
        <defs>
          <linearGradient id={`sg-${color.replace('#','')}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.4"/>
            <stop offset="100%" stopColor={color} stopOpacity="0"/>
          </linearGradient>
        </defs>
        <path d={area} fill={`url(#sg-${color.replace('#','')})`}/>
        <path d={path} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round"/>
        <circle cx={pts[pts.length-1].x} cy={pts[pts.length-1].y} r="3" fill="white" stroke={color} strokeWidth="2"/>
      </svg>
    );
  };

  return (
    <div className="p-3 sm:p-5 lg:p-7 max-w-[1440px] mx-auto space-y-5 animate-in fade-in duration-500" style={{ fontFamily: 'var(--font-body)' }}>
      
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--border-light)] pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[var(--text-main)] tracking-tight flex items-center gap-2" style={{ fontFamily: 'var(--font-heading)' }}>
            Dashboard
            <span className="text-[9px] font-black uppercase tracking-widest text-[var(--primary)] bg-[var(--primary-light)] px-2 py-0.5 rounded-md">LIVE</span>
          </h1>
          <p className="text-xs font-medium text-[var(--text-muted)] mt-0.5">
            Welcome back, <span className="font-bold text-[var(--text-main)]">{user?.name}</span>.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-[var(--border-light)] shadow-sm text-xs font-semibold text-[var(--text-muted)]">
            <Clock size={13} className="text-blue-500" />
            Real-time
          </div>
          <Button 
            variant="primary" 
            onClick={() => navigate('/admin/order')}
            className="h-8 px-3 rounded-lg text-xs font-bold shadow-sm"
          >
            Orders
          </Button>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {loading ? Array(4).fill(0).map((_, i) => (
          <div key={i} className="h-32 bg-[var(--bg-card)] rounded-2xl border border-[var(--border-light)] animate-pulse" />
        )) : kpis.map((kpi, i) => (
          <Card key={i} className="relative overflow-hidden bg-white border border-[var(--border-light)] rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
            <CardBody className="p-4">
              {/* Gradient blob */}
              <div className={`absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br ${kpi.gradient} rounded-full opacity-10 group-hover:opacity-20 transition-opacity blur-xl`} />
              
              <div className="flex items-start justify-between mb-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${kpi.lightBg} ${kpi.textColor} shrink-0`}>
                  {kpi.icon}
                </div>
                <div className="w-20 h-8">
                  <Sparkline data={kpi.sparkData} color={kpi.sparkColor} />
                </div>
              </div>

              <div>
                <p className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-[0.18em] mb-1">{kpi.label}</p>
                <h4 className="text-xl sm:text-2xl font-black text-[var(--text-main)] tracking-tighter tabular-nums leading-none">{kpi.value}</h4>
                <p className={`text-[9px] font-bold mt-1 ${kpi.textColor} opacity-80`}>{kpi.sub}</p>
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

            <CardBody className="p-6 flex-1 flex flex-col justify-end min-h-[300px] relative overflow-hidden group/chart">
              {chartData?.length > 0 ? (() => {
                const revenues = chartData.map(it => it.revenue);
                const maxRev = Math.max(...revenues, 1);
                const displayData = timeframe === '30days' ? chartData.slice(-12) : chartData;
                const width = 1000;
                const height = 240;
                
                // Generate SVG Path
                const points = displayData.map((d, i) => ({
                   x: (i / (displayData.length - 1)) * width,
                   y: height - (d.revenue / maxRev) * (height - 40) - 20
                }));

                const pathData = points.reduce((acc, p, i, a) => {
                  if (i === 0) return `M ${p.x},${p.y}`;
                  const prev = a[i - 1];
                  const cp1x = prev.x + (p.x - prev.x) / 3;
                  const cp2x = prev.x + (p.x - prev.x) * 2 / 3;
                  return `${acc} C ${cp1x},${prev.y} ${cp2x},${p.y} ${p.x},${p.y}`;
                }, "");

                const areaPath = `${pathData} L ${width},${height} L 0,${height} Z`;

                return (
                  <div className="w-full h-full relative" style={{ height: `${height}px` }}>
                    {/* SVG Chart */}
                    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible drop-shadow-xl" preserveAspectRatio="none">
                       <defs>
                          <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                             <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.3" />
                             <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
                          </linearGradient>
                       </defs>
                       <path d={areaPath} fill="url(#chartGradient)" />
                       <path d={pathData} fill="none" stroke="var(--primary)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                       
                       {/* Points */}
                       {points.map((p, i) => (
                         <g key={i} className="cursor-pointer group/point">
                            <circle cx={p.x} cy={p.y} r="6" fill="white" stroke="var(--primary)" strokeWidth="3" className="transition-all duration-300 opacity-0 group-hover/chart:opacity-100 scale-0 group-hover/chart:scale-100" />
                            <rect x={p.x - 40} y="0" width="80" height={height} fill="transparent" />
                         </g>
                       ))}
                    </svg>

                    {/* Interactive Labels/Tooltips */}
                    <div className="absolute inset-0 flex justify-between pointer-events-none">
                       {displayData.map((d, i) => (
                         <div key={i} className="flex-1 flex flex-col justify-end items-center group relative cursor-pointer pointer-events-auto">
                            <div className="absolute top-0 opacity-0 group-hover:opacity-100 transition-all transform -translate-y-2 group-hover:-translate-y-4 bg-slate-900 text-white px-3 py-1.5 rounded-lg text-[9px] font-black z-30 shadow-2xl">
                               ₹{d.revenue.toLocaleString()}
                            </div>
                            <div className="h-full w-full border-r border-transparent hover:border-slate-100 transition-colors" />
                            <span className="text-[8px] font-black text-slate-400 uppercase tracking-tighter mt-4">
                               {timeframe === 'today' ? 'Now' : new Date(d._id).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                            </span>
                         </div>
                       ))}
                    </div>
                  </div>
                );
              })() : (
                <div className="w-full h-full flex flex-col items-center justify-center text-slate-300 gap-3">
                  <Calendar size={32} />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em]">Data Sync Required</span>
                </div>
              )}
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