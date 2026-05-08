'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, Users, ShoppingBag, DollarSign, 
  ArrowUpRight, ArrowDownRight, Clock, CheckCircle2, 
  AlertCircle, ChevronRight, Package, Search, Filter, 
  MoreHorizontal, Zap, Layers, Award, BarChart3, ShieldCheck,
  RefreshCcw, Eye, Download, LogOut
} from 'lucide-react';
import Link from 'next/link';
import FadeIn from '@/components/FadeIn';
import { supabase } from '@/lib/supabase';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
  const [activeRange, setActiveRange] = useState('7D');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [stats, setStats] = useState<any[]>([]);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  async function fetchDashboardData() {
    setIsRefreshing(true);
    try {
      // 1. Fetch Orders for Stats
      const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (ordersError) throw ordersError;

      // 2. Fetch Products for Inventory Count
      const { count: productCount, error: prodError } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true });

      if (prodError) throw prodError;

      // 3. Process Stats
      const totalRevenue = orders.reduce((acc, o) => acc + Number(o.total_amount), 0);
      const activeOrders = orders.filter(o => o.status !== 'delivered' && o.status !== 'cancelled').length;
      
      setStats([
        { label: 'Total Revenue', value: `$${totalRevenue.toLocaleString()}`, trend: '+12.5%', icon: <DollarSign size={20}/>, positive: true },
        { label: 'Active Orders', value: activeOrders.toString(), trend: '+4', icon: <ShoppingBag size={20}/>, positive: true },
        { label: 'Inventory SKU', value: productCount?.toString() || '0', trend: 'Stable', icon: <Package size={20}/>, positive: true },
        { label: 'Total Customers', value: '1,240', trend: '+18%', icon: <Users size={20}/>, positive: true },
      ]);

      setRecentOrders(orders.slice(0, 5).map(o => ({
        id: `ORD-${o.order_number}`,
        customer: o.shipping_address.fullName,
        product: 'Bespoke Order',
        status: o.status.charAt(0).toUpperCase() + o.status.slice(1),
        priority: 'Normal',
        date: new Date(o.created_at).toLocaleDateString()
      })));

    } catch (error: any) {
      console.error('Admin Fetch Error:', error);
      toast.error('Failed to sync with production database');
    } finally {
      setIsRefreshing(false);
      setLoading(false);
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('admin_auth');
    window.location.reload();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
          <RefreshCcw size={32} className="text-zinc-500" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pt-32 pb-20 px-6 lg:px-12">
      <div className="max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8">
          <div>
            <FadeIn direction="none">
              <div className="flex items-center gap-4 mb-4">
                <div className={`w-2 h-2 rounded-full ${isRefreshing ? 'bg-amber-500 animate-spin' : 'bg-emerald-500 animate-pulse'}`} />
                <span className="text-[10px] font-black tracking-[0.3em] uppercase text-zinc-600">
                  {isRefreshing ? 'Synchronizing Cluster...' : 'Command Center Online'}
                </span>
              </div>
              <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic">The Dashboard</h1>
            </FadeIn>
          </div>
          
          <FadeIn delay={0.2} direction="none">
            <div className="flex gap-4">
              <button 
                onClick={fetchDashboardData}
                disabled={isRefreshing}
                className="p-4 glass rounded-2xl border border-white/5 text-zinc-500 hover:text-white transition-all"
              >
                <RefreshCcw size={20} className={isRefreshing ? 'animate-spin' : ''} />
              </button>
              <button 
                onClick={handleLogout}
                className="p-4 bg-rose-500/10 text-rose-500 border border-rose-500/20 rounded-2xl hover:bg-rose-500/20 transition-all flex items-center gap-2 font-black text-[10px] tracking-widest"
              >
                LOGOUT <LogOut size={16} />
              </button>
              <Link href="/admin/products" className="btn-premium flex items-center gap-2 py-4 px-10">
                ADD PRODUCT <Zap size={16} fill="currentColor" />
              </Link>
            </div>
          </FadeIn>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((s, i) => (
            <FadeIn key={i} delay={i * 0.1}>
              <div className="p-8 glass rounded-[2.5rem] border border-white/5 hover:border-white/10 transition-all group">
                <div className="flex justify-between items-start mb-6">
                  <div className="p-3 bg-white/5 rounded-xl group-hover:bg-white group-hover:text-black transition-all">
                    {s.icon}
                  </div>
                  <div className={`flex items-center gap-1 text-[10px] font-black uppercase tracking-widest ${s.positive ? 'text-emerald-500' : 'text-rose-500'}`}>
                    {s.trend}
                  </div>
                </div>
                <p className="text-zinc-500 text-[10px] font-black tracking-widest uppercase mb-1">{s.label}</p>
                <h3 className="text-3xl font-black tracking-tighter">{s.value}</h3>
              </div>
            </FadeIn>
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">
          {/* Main Analytics Chart Area */}
          <div className="xl:col-span-2 space-y-12">
            <FadeIn direction="up">
              <div className="p-10 glass rounded-[3rem] border border-white/5 h-[500px] flex flex-col">
                <div className="flex justify-between items-center mb-12">
                  <div>
                    <h3 className="text-xl font-black tracking-tight uppercase">Revenue Analytics</h3>
                    <p className="text-xs text-zinc-600 font-bold uppercase tracking-widest mt-1">Real-time DB Query</p>
                  </div>
                  <div className="flex gap-4">
                     {['7D', '30D', '90D'].map(t => (
                       <button 
                        key={t} 
                        onClick={() => setActiveRange(t)}
                        className={`px-4 py-2 rounded-lg text-[10px] font-black border transition-all uppercase ${
                          activeRange === t ? 'border-white text-white bg-white/10' : 'border-white/5 text-zinc-500 hover:text-white'
                        }`}
                       >
                         {t}
                       </button>
                     ))}
                  </div>
                </div>
                
                <div className="flex-1 flex items-end justify-between gap-2 px-4 relative">
                   <div className="absolute inset-0 flex flex-col justify-between opacity-[0.03] pointer-events-none">
                      {[...Array(5)].map((_, i) => <div key={i} className="w-full h-[1px] bg-white" />)}
                   </div>
                   {[40, 70, 45, 90, 65, 80, 55].map((h, i) => (
                     <motion.div 
                       key={i}
                       initial={{ height: 0 }}
                       animate={{ height: `${h}%` }}
                       className="w-full bg-gradient-to-t from-white/5 to-white/20 rounded-t-xl relative group"
                     >
                       <div className="absolute -top-12 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity p-2 glass rounded-lg text-[10px] font-black z-20 whitespace-nowrap">
                         ${(h * 12).toLocaleString()}
                       </div>
                     </motion.div>
                   ))}
                </div>
                <div className="flex justify-between mt-8 px-4 text-[10px] font-black text-zinc-700 uppercase tracking-widest">
                   {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => <span key={d}>{d}</span>)}
                </div>
              </div>
            </FadeIn>

            {/* Orders Table Area */}
            <FadeIn direction="up" delay={0.2}>
              <div className="p-10 glass rounded-[3rem] border border-white/5 overflow-hidden">
                <div className="flex justify-between items-center mb-12">
                   <h3 className="text-xl font-black tracking-tight uppercase">Recent Activity</h3>
                   <Link href="/admin/orders" className="text-[10px] font-black text-zinc-600 hover:text-white uppercase tracking-widest underline decoration-white/10 underline-offset-8">View All</Link>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-white/5">
                        <th className="pb-6 text-[10px] font-black text-zinc-600 uppercase tracking-widest">Order ID</th>
                        <th className="pb-6 text-[10px] font-black text-zinc-600 uppercase tracking-widest">Client</th>
                        <th className="pb-6 text-[10px] font-black text-zinc-600 uppercase tracking-widest text-center">Status</th>
                        <th className="pb-6 text-[10px] font-black text-zinc-600 uppercase tracking-widest text-right">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {recentOrders.map((order, i) => (
                        <tr key={i} className="group hover:bg-white/[0.02] transition-all">
                          <td className="py-6">
                            <p className="font-bold text-sm tracking-tight">{order.id}</p>
                          </td>
                          <td className="py-6">
                            <p className="font-bold text-sm tracking-tight">{order.customer}</p>
                          </td>
                          <td className="py-6 text-center">
                            <span className={`px-4 py-1.5 rounded-full text-[9px] font-black tracking-widest uppercase border ${
                              order.status === 'Delivered' ? 'border-emerald-500/20 text-emerald-500 bg-emerald-500/5' :
                              order.status === 'Processing' ? 'border-amber-500/20 text-amber-500 bg-amber-500/5' :
                              'border-zinc-500/20 text-zinc-500 bg-zinc-500/5'
                            }`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="py-6 text-right font-bold text-xs text-zinc-500">
                             {order.date}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </FadeIn>
          </div>

          {/* Quick Controls */}
          <div className="space-y-12">
            <FadeIn direction="left" delay={0.2}>
               <div className="p-10 bg-zinc-950 rounded-[3rem] border border-white/5 relative overflow-hidden group">
                  <h3 className="text-xl font-black tracking-tight uppercase mb-8">Quick Settings</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { icon: <Award size={18}/>, label: 'Promotions', href: '/admin/discounts' },
                      { icon: <Layers size={18}/>, label: 'Inventory', href: '/admin/products' },
                      { icon: <BarChart3 size={18}/>, label: 'Reports', href: '/admin' },
                      { icon: <ShieldCheck size={18}/>, label: 'Security', href: '/admin' }
                    ].map((tool, i) => (
                      <Link key={i} href={tool.href} className="p-6 glass rounded-2xl border border-white/5 hover:border-white/20 transition-all flex flex-col items-center gap-3 text-center group/btn">
                        <div className="text-zinc-600 group-hover/btn:text-white transition-colors">{tool.icon}</div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 group-hover/btn:text-zinc-300">{tool.label}</span>
                      </Link>
                    ))}
                  </div>
               </div>
            </FadeIn>
          </div>
        </div>
      </div>
    </div>
  );
}
