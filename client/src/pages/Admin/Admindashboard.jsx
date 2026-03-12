
import React from 'react';
import { useSelector } from 'react-redux';
import { Users, ShoppingBag, DollarSign, TrendingUp, Package, CheckCircle, Clock, ArrowRight } from 'lucide-react';
import { Card, CardBody, CardHeader } from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import { useNavigate } from 'react-router-dom';

const Admindashboard = () => {
   const user = useSelector((state) => state.user.user);
   const navigate = useNavigate();

   // Placeholder stats for the dashboard look
   const stats = [
      { label: 'Total Revenue', value: '₹1,24,500', icon: <DollarSign size={24} />, color: 'text-blue-600', bg: 'bg-blue-50', trend: '+12.5%' },
      { label: 'Total Orders', value: '458', icon: <ShoppingBag size={24} />, color: 'text-orange-600', bg: 'bg-orange-50', trend: '+5.4%' },
      { label: 'Total Products', value: '1,245', icon: <Package size={24} />, color: 'text-indigo-600', bg: 'bg-indigo-50', trend: '+2 NEW' },
      { label: 'New Customers', value: '89', icon: <Users size={24} />, color: 'text-emerald-600', bg: 'bg-emerald-50', trend: '+18.2%' },
   ];

   return (
      <div className="max-w-[1400px] mx-auto p-4 md:p-8 space-y-10 animate-in fade-in duration-700">
         {/* Welcome Banner */}
         <div className="relative overflow-hidden rounded-[2.5rem] bg-slate-900 p-8 md:p-12 text-white shadow-2xl">
            <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none">
               <TrendingUp size={400} className="absolute -top-20 -right-20 transform rotate-12" />
            </div>
            <div className="relative z-10 space-y-6 max-w-2xl">
               <div className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-[0.3em] text-blue-400">Admin Control Center</span>
                  <h1 className="text-4xl md:text-6xl font-black italic" style={{ fontFamily: 'var(--font-heading)' }}>
                     Welcome back, <span className="text-[var(--primary)]">{user?.name || 'Admin'}</span>
                  </h1>
               </div>
               <p className="text-slate-400 font-medium text-lg leading-relaxed">
                  Your store is performing exceptionally well today. You have <span className="text-white underline decoration-blue-500 decoration-2 underline-offset-4">12 pending orders</span> that require your immediate attention.
               </p>
               <div className="flex flex-wrap gap-4 pt-4">
                  <Button variant="primary" onClick={() => navigate('/admin/allorder')} className="h-14 px-8 rounded-2xl gap-3 font-bold shadow-xl shadow-blue-500/20">
                     Manage Orders <ArrowRight size={18} />
                  </Button>
                  <Button variant="outline" onClick={() => navigate('/admin/product')} className="h-14 px-8 rounded-2xl border-slate-700 text-white hover:bg-slate-800 gap-3 font-bold">
                     View Inventory
                  </Button>
               </div>
            </div>
         </div>

         {/* Stats Grid */}
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
               <Card key={index} className="border-none shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group">
                  <CardBody className="p-8">
                     <div className="flex justify-between items-start mb-6">
                        <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color} transition-colors group-hover:scale-110 duration-500`}>
                           {stat.icon}
                        </div>
                        <span className="text-xs font-bold px-2 py-1 bg-green-50 text-green-600 rounded-lg">{stat.trend}</span>
                     </div>
                     <div className="space-y-1">
                        <h3 className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em]">{stat.label}</h3>
                        <p className="text-3xl font-black text-[var(--text-main)] italic">{stat.value}</p>
                     </div>
                  </CardBody>
               </Card>
            ))}
         </div>

         <div className="grid lg:grid-cols-12 gap-8">
            {/* Recent Activities (Placeholder) */}
            <div className="lg:col-span-8">
               <Card className="border-none shadow-xl h-full overflow-hidden">
                  <CardHeader className="bg-white border-b border-[var(--border-light)] py-6 px-8 flex justify-between items-center">
                     <h3 className="text-xl font-bold text-[var(--text-main)] flex items-center gap-3">
                        <Clock size={20} className="text-[var(--primary)]" />
                        Recent Store Activity
                     </h3>
                     <Button variant="ghost" size="sm" className="font-bold text-[var(--primary)] hover:bg-blue-50">View Log</Button>
                  </CardHeader>
                  <CardBody className="p-0">
                     <div className="divide-y divide-[var(--border-light)]/40">
                        {[
                           { type: 'order', msg: 'New order #ORD-4589 placed by Ronit Korat', time: '2 mins ago', icon: <ShoppingBag size={14} />, color: 'bg-blue-100 text-blue-600' },
                           { type: 'product', msg: 'Product "Premium Leather Watch" is out of stock', time: '45 mins ago', icon: <Package size={14} />, color: 'bg-red-100 text-red-600' },
                           { type: 'customer', msg: 'New user registration completed', time: '3 hours ago', icon: <Users size={14} />, color: 'bg-emerald-100 text-emerald-600' },
                           { type: 'order', msg: 'Order #ORD-4572 marked as Delivered', time: 'Yesterday', icon: <CheckCircle size={14} />, color: 'bg-green-100 text-green-600' },
                        ].map((item, i) => (
                           <div key={i} className="px-8 py-5 flex items-center justify-between hover:bg-[var(--bg-body)]/40 transition-colors group cursor-default">
                              <div className="flex items-center gap-4">
                                 <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.color} transform group-hover:rotate-12 transition-transform`}>
                                    {item.icon}
                                 </div>
                                 <div>
                                    <p className="text-sm font-bold text-[var(--text-main)]">{item.msg}</p>
                                    <p className="text-[10px] text-[var(--text-muted)] font-medium uppercase tracking-widest">{item.time}</p>
                                 </div>
                              </div>
                              <ArrowRight size={16} className="text-[var(--border-light)] group-hover:text-[var(--primary)] group-hover:translate-x-1 transition-all" />
                           </div>
                        ))}
                     </div>
                  </CardBody>
               </Card>
            </div>

            {/* Quick Actions */}
            <div className="lg:col-span-4">
               <Card className="border-none shadow-xl bg-white h-full">
                  <CardHeader className="py-6 px-8 border-b border-[var(--border-light)]">
                     <h3 className="text-xl font-bold text-[var(--text-main)]">Quick Actions</h3>
                  </CardHeader>
                  <CardBody className="p-8 space-y-4">
                     <Button variant="orange" onClick={() => navigate('/admin/product')} className="w-full h-16 rounded-2xl gap-3 font-bold text-lg shadow-lg">
                        <Package size={20} />
                        Add New Product
                     </Button>
                     <Button variant="primary" onClick={() => navigate('/admin/category')} className="w-full h-16 rounded-2xl gap-3 font-bold text-lg shadow-lg">
                        <TrendingUp size={20} />
                        Manage Categories
                     </Button>
                     <Button variant="outline" onClick={() => window.open('/', '_blank')} className="w-full h-16 rounded-2xl gap-3 font-bold text-lg">
                        <ShoppingBag size={20} />
                        Preview Store
                     </Button>
                  </CardBody>
               </Card>
            </div>
         </div>
      </div>
   );
};

export default Admindashboard;
