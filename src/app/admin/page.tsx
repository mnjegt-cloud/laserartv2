'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, Users, ShoppingBag, DollarSign, 
  ArrowUpRight, ArrowDownRight, Clock, CheckCircle2, 
  AlertCircle, ChevronRight, Package, Search, Filter, 
  MoreHorizontal, Zap, Layers, Award, BarChart3, ShieldCheck,
  RefreshCcw, Eye, Download, LogOut, Activity, Wifi, Settings,
  MapPin, Smartphone, Info, ExternalLink, Box
} from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import toast from 'react-hot-toast';
import './admin-styles.css';

type Tab = 'insights' | 'live' | 'orders' | 'inventory' | 'settings';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('insights');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Data States
  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [stats, setStats] = useState({
    revenue: 0,
    todayRevenue: 0,
    activeOrders: 0,
    totalVisitors: 1240, // Mock for now until live tracking is in web
    liveVisitors: 0,
    lowStock: 0
  });

  useEffect(() => {
    fetchData();
    // Simulate live visitors
    const interval = setInterval(() => {
        setStats(prev => ({
            ...prev,
            liveVisitors: Math.floor(Math.random() * 5) + 1
        }));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  async function fetchData() {
    setIsRefreshing(true);
    try {
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (ordersError) throw ordersError;

      const { data: productsData, error: prodError } = await supabase
        .from('products')
        .select('*');

      if (prodError) throw prodError;

      const totalRevenue = ordersData.reduce((acc, o) => acc + Number(o.total_amount), 0);
      const today = new Date().toISOString().split('T')[0];
      const todayRevenue = ordersData
        .filter(o => o.created_at.startsWith(today))
        .reduce((acc, o) => acc + Number(o.total_amount), 0);
      
      const activeOrders = ordersData.filter(o => o.status !== 'delivered' && o.status !== 'cancelled').length;
      const lowStock = productsData.filter(p => p.stock !== undefined && p.stock <= 5).length;

      setOrders(ordersData);
      setProducts(productsData);
      setStats(prev => ({
        ...prev,
        revenue: totalRevenue,
        todayRevenue: todayRevenue,
        activeOrders: activeOrders,
        lowStock: lowStock
      }));

    } catch (error: any) {
      toast.error('Sync failed');
    } finally {
      setIsRefreshing(false);
      setLoading(false);
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('admin_session');
    window.location.reload();
  };

  if (loading) {
    return (
      <div className="admin-screen flex flex-col items-center justify-center">
         <div className="w-8 h-8 border-2 border-white/10 border-t-white rounded-full animate-spin mb-4" />
         <p className="admin-subtitle animate-pulse">Analyzing Pulse...</p>
      </div>
    );
  }

  const renderTab = () => {
    switch (activeTab) {
      case 'insights': return <InsightsTab stats={stats} isRefreshing={isRefreshing} onRefresh={fetchData} />;
      case 'live': return <LiveTab liveCount={stats.liveVisitors} />;
      case 'orders': return <OrdersTab orders={orders} />;
      case 'inventory': return <InventoryTab products={products} />;
      case 'settings': return <SettingsTab onLogout={handleLogout} onRefresh={fetchData} />;
    }
  };

  return (
    <div className="admin-screen font-sans">
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {renderTab()}
        </motion.div>
      </AnimatePresence>

      {/* Bottom Navigation */}
      <div className="admin-bottom-nav">
        <NavItem icon={<Activity size={20} />} label="Insights" active={activeTab === 'insights'} onClick={() => setActiveTab('insights')} />
        <NavItem icon={<Wifi size={20} />} label="Live" active={activeTab === 'live'} onClick={() => setActiveTab('live')} showDot={stats.liveVisitors > 0} />
        <NavItem icon={<ShoppingBag size={20} />} label="Orders" active={activeTab === 'orders'} onClick={() => setActiveTab('orders')} />
        <NavItem icon={<Layers size={20} />} label="Stock" active={activeTab === 'inventory'} onClick={() => setActiveTab('inventory')} />
        <NavItem icon={<Settings size={20} />} label="Admin" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
      </div>
    </div>
  );
}

function NavItem({ icon, label, active, onClick, showDot }: any) {
  return (
    <button onClick={onClick} className={`admin-nav-item ${active ? 'admin-nav-item--active' : ''}`}>
      <div className="relative">
        {icon}
        {showDot && <div className="admin-dot-live absolute -top-1 -right-1" />}
      </div>
      <span>{label}</span>
    </button>
  );
}

// ─── TABS ─────────────────────────────────────────────────────────────

function InsightsTab({ stats, isRefreshing, onRefresh }: any) {
  return (
    <div className="space-y-6">
      <div className="admin-header">
        <div>
          <h1 className="admin-title italic">Insights</h1>
          <p className="admin-subtitle">Live Intelligence</p>
        </div>
        <button onClick={onRefresh} className="p-3 bg-zinc-900 border border-white/5 rounded-xl text-zinc-500 hover:text-white transition-all">
          <RefreshCcw size={18} className={isRefreshing ? 'animate-spin' : ''} />
        </button>
      </div>

      <div className="admin-stats-grid">
        <div className="admin-stat-card admin-stat-card--red">
          <div className="admin-stat-label"><Activity size={10} /> Live Now</div>
          <div className="admin-stat-value text-red-500">{stats.liveVisitors}</div>
          <div className="admin-dot-live absolute top-4 right-4" />
        </div>
        <div className="admin-stat-card admin-stat-card--green">
          <div className="admin-stat-label"><DollarSign size={10} /> Revenue</div>
          <div className="admin-stat-value-sm text-green-500">${stats.revenue.toLocaleString()}</div>
          <div className="flex items-center gap-1 text-[8px] font-bold text-green-500 mt-1 uppercase">
            <ArrowUpRight size={8} /> ${stats.todayRevenue} Today
          </div>
        </div>
        <div className="admin-stat-card admin-stat-card--yellow">
          <div className="admin-stat-label"><ShoppingBag size={10} /> Orders</div>
          <div className="admin-stat-value text-yellow-500">{stats.activeOrders}</div>
        </div>
      </div>

      <div className="admin-glass-card">
         <div className="admin-section-title"><BarChart3 size={14} className="text-zinc-500" /> Traffic Pulse</div>
         <div className="h-24 flex items-end gap-1.5 px-2">
            {[40, 70, 45, 90, 65, 80, 55, 30, 60, 85, 40, 50].map((h, i) => (
              <div key={i} className="flex-1 bg-zinc-900 rounded-t-sm relative group overflow-hidden">
                 <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: `${h}%` }}
                    className={`w-full absolute bottom-0 ${i === 11 ? 'bg-white' : 'bg-zinc-700'}`}
                 />
              </div>
            ))}
         </div>
         <div className="flex justify-between mt-4 text-[8px] font-black text-zinc-700 uppercase tracking-widest px-2">
            <span>Morning</span>
            <span>Afternoon</span>
            <span>Evening</span>
         </div>
      </div>

      <div className="admin-glass-card">
         <div className="admin-section-title"><Award size={14} className="text-purple-500" /> Featured Storefront</div>
         <div className="grid grid-cols-2 gap-3">
            <div className="p-4 bg-zinc-950/50 border border-white/5 rounded-2xl flex flex-col items-center gap-2 text-center group">
               <div className="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center text-purple-500 group-hover:bg-purple-500 group-hover:text-white transition-all">
                  <Zap size={18} />
               </div>
               <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">New Promo</span>
            </div>
            <div className="p-4 bg-zinc-950/50 border border-white/5 rounded-2xl flex flex-col items-center gap-2 text-center group">
               <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-all">
                  <Package size={18} />
               </div>
               <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Restock</span>
            </div>
         </div>
      </div>
    </div>
  );
}

function LiveTab({ liveCount }: any) {
  return (
    <div className="space-y-6">
      <div className="admin-header">
        <div>
          <h1 className="admin-title italic">Live Traffic</h1>
          <p className="admin-subtitle">Real-time Cluster</p>
        </div>
        <div className="admin-badge-live">
           <div className="admin-dot-live" /> LIVE
        </div>
      </div>

      <div className="admin-glass-card">
         <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500">
               <Users size={24} />
            </div>
            <div>
               <p className="text-2xl font-black">{liveCount}</p>
               <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Active Visitors</p>
            </div>
         </div>

         <div className="space-y-3">
            {[
              { city: 'Beirut', device: 'Mobile', page: 'Home', time: 'Just now' },
              { city: 'Byblos', device: 'Desktop', page: 'McLaren Tag', time: '2m ago' },
              { city: 'Tripoli', device: 'Mobile', page: 'Checkout', time: '5m ago' },
            ].map((v, i) => (
              <div key={i} className="admin-feed-item">
                 <div className="flex items-center gap-3">
                    <span className="text-xl">{v.device === 'Mobile' ? '📱' : '💻'}</span>
                    <div>
                       <p className="text-xs font-bold">{v.city}</p>
                       <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Viewing {v.page}</p>
                    </div>
                 </div>
                 <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">{v.time}</span>
              </div>
            ))}
         </div>
      </div>
    </div>
  );
}

function OrdersTab({ orders }: any) {
  return (
    <div className="space-y-6">
      <div className="admin-header">
        <div>
          <h1 className="admin-title italic">Activity</h1>
          <p className="admin-subtitle">Order History</p>
        </div>
        <Link href="/admin/orders" className="text-[10px] font-black text-zinc-500 underline decoration-zinc-800 underline-offset-4 uppercase tracking-widest">All History</Link>
      </div>

      <div className="space-y-3">
        {orders.slice(0, 10).map((o, i) => (
          <div key={i} className="admin-glass-card !p-4 flex justify-between items-center group hover:border-white/20 transition-all">
             <div className="flex flex-col gap-1">
                <p className="text-xs font-black">ORD-{o.order_number}</p>
                <p className="text-[9px] font-bold text-zinc-500 uppercase">{o.shipping_address?.fullName || 'Guest'}</p>
             </div>
             <div className="text-right">
                <p className="text-sm font-black text-emerald-500">${o.total_amount}</p>
                <span className={`text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest ${
                  o.status === 'pending' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                }`}>
                  {o.status}
                </span>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function InventoryTab({ products }: any) {
  return (
    <div className="space-y-6">
      <div className="admin-header">
        <div>
          <h1 className="admin-title italic">Inventory</h1>
          <p className="admin-subtitle">SKU Tracking</p>
        </div>
        <Link href="/admin/products" className="p-3 bg-white text-black rounded-xl hover:scale-105 transition-all">
          <Zap size={18} fill="currentColor" />
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3">
         {products.slice(0, 6).map((p, i) => (
           <div key={i} className="admin-glass-card !p-2 flex flex-col gap-2 group">
              <div className="aspect-square bg-zinc-900 rounded-xl overflow-hidden relative">
                 <img src={p.image || '/images/logo.jpg'} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                 {p.stock <= 5 && <div className="absolute top-2 right-2 bg-red-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded-md uppercase animate-pulse">Low</div>}
              </div>
              <div className="px-1 py-1">
                 <p className="text-[10px] font-black truncate uppercase">{p.name}</p>
                 <div className="flex justify-between items-center mt-1">
                    <p className="text-[9px] font-black text-zinc-500 uppercase">{p.stock} Units</p>
                    <p className="text-[10px] font-black text-white">${p.price}</p>
                 </div>
              </div>
           </div>
         ))}
      </div>
    </div>
  );
}

function SettingsTab({ onLogout, onRefresh }: any) {
  return (
    <div className="space-y-6">
      <div className="admin-header">
        <div>
          <h1 className="admin-title italic">Settings</h1>
          <p className="admin-subtitle">Security & Config</p>
        </div>
      </div>

      <div className="space-y-4">
         <div className="admin-glass-card">
            <div className="admin-section-title">Authorized Personnel</div>
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center">
                  <Users size={20} className="text-zinc-500" />
               </div>
               <div>
                  <p className="text-sm font-black">Primary Admin</p>
                  <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Authorized Account</p>
               </div>
            </div>
         </div>

         <div className="grid grid-cols-2 gap-3">
            <button 
                onClick={async () => {
                    const confirmScan = confirm("Initialize Cluster Scan?\nThis will re-map all product images to optimized local assets.");
                    if (!confirmScan) return;
                    
                    toast.loading("Scanning Cluster...");
                    try {
                        const { data: prods, error } = await supabase.from('products').select('*');
                        if (error) throw error;
                        
                        let fixedCount = 0;
                        for (const p of (prods || [])) {
                            if (p.image) {
                                // Extract the clean filename
                                const filename = p.image.split('/').pop()?.split('?')[0] || '';
                                const baseName = filename.split('.')[0];
                                
                                // Point to local /images/ folder
                                // We prioritized .jpg in our compression script
                                const newPath = `/images/${baseName.toLowerCase()}.jpg`;
                                
                                if (p.image !== newPath) {
                                    await supabase.from('products').update({ image: newPath }).eq('id', p.id);
                                    fixedCount++;
                                }
                            }
                        }
                        toast.dismiss();
                        toast.success(`Cluster Sync Complete: ${fixedCount} Assets Re-mapped`);
                        onRefresh();
                    } catch (err) {
                        toast.error("Scan Failed");
                    }
                }}
                className="p-6 bg-zinc-900 border border-white/5 rounded-[2rem] flex flex-col items-center gap-3 hover:border-white/20 transition-all group"
            >
               <Wifi size={24} className="text-zinc-600 group-hover:text-amber-500 transition-colors" />
               <span className="text-[9px] font-black uppercase tracking-widest">Fix Paths</span>
            </button>
            <button onClick={onRefresh} className="p-6 bg-zinc-900 border border-white/5 rounded-[2rem] flex flex-col items-center gap-3 hover:border-white/20 transition-all group">
               <RefreshCcw size={24} className="text-zinc-600 group-hover:text-blue-500 transition-colors" />
               <span className="text-[9px] font-black uppercase tracking-widest">Resync DB</span>
            </button>
         </div>

         <button 
           onClick={onLogout}
           className="w-full py-5 bg-red-500/10 border border-red-500/20 text-red-500 rounded-[2rem] font-black uppercase tracking-[0.2em] text-[11px] hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-3"
         >
           <LogOut size={18} /> INITIALIZE LOGOUT
         </button>

         <div className="pt-10 text-center">
            <p className="text-[8px] font-black text-zinc-800 uppercase tracking-widest italic">LaserArt Command Shell v2.2.0 PRO</p>
         </div>
      </div>
    </div>
  );
}
