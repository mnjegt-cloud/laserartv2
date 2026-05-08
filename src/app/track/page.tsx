'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Package, Zap, Layers, Box, 
  Truck, CheckCircle2, Clock, ShieldCheck, 
  ChevronRight, ArrowLeft, RefreshCcw, MessageSquare
} from 'lucide-react';
import Link from 'next/link';
import FadeIn from '@/components/FadeIn';
import { supabase } from '@/lib/supabase';
import toast from 'react-hot-toast';

const TRACKING_STAGES = [
  { id: 'received', label: 'Order Received', icon: <Clock size={20}/>, desc: 'Your order has been logged in our system.' },
  { id: 'processing', label: 'Processing', icon: <Layers size={20}/>, desc: 'Raw materials are being prepared for crafting.' },
  { id: 'crafting', label: 'Crafting & Engraving', icon: <Zap size={20}/>, desc: 'High-precision fiber laser marking in progress.' },
  { id: 'ready', label: 'Ready for Shipping', icon: <ShieldCheck size={20}/>, desc: 'Bespoke wrapping and quality inspection.' },
  { id: 'shipping', label: 'Out for Delivery', icon: <Truck size={20}/>, desc: 'Courier is on the way to your destination.' },
  { id: 'delivered', label: 'Delivered', icon: <CheckCircle2 size={20}/>, desc: 'Package successfully reached the client.' },
];

export default function TrackingPage() {
  const [trackingCode, setTrackingCode] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [orderData, setOrderData] = useState<any>(null);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingCode) return;
    
    setIsSearching(true);
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .or(`id.eq.${trackingCode},order_number.eq.${trackingCode}`)
        .single();

      if (error) {
        toast.error('Order not found in our cluster');
        setOrderData(null);
      } else {
        setOrderData(data);
      }
    } catch (err) {
      toast.error('Network error during sync');
    } finally {
      setIsSearching(false);
    }
  };

  const currentStageIndex = orderData ? TRACKING_STAGES.findIndex(s => s.id === orderData.status) : -1;

  return (
    <div className="min-h-screen bg-black pt-40 pb-32 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-20">
          <FadeIn direction="none">
            <span className="text-[10px] font-black tracking-[0.3em] uppercase text-zinc-600 mb-4 block">Traceability</span>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase italic">Track Order</h1>
            <p className="text-zinc-500 text-lg mt-6 font-medium max-w-xl mx-auto">
              Enter your unique order number or tracking code to view the real-time status of your precision-crafted piece.
            </p>
          </FadeIn>
        </div>

        {/* Search Bar */}
        <FadeIn delay={0.2} direction="up">
          <form onSubmit={handleTrack} className="relative group mb-20">
            <input 
              type="text" 
              placeholder="e.g. ORD-1002 or UUID"
              value={trackingCode}
              onChange={(e) => setTrackingCode(e.target.value)}
              className="w-full bg-zinc-950 border border-white/5 rounded-[2rem] p-8 pl-10 pr-40 text-2xl font-black tracking-tight focus:border-white transition-all outline-none placeholder:text-zinc-800"
            />
            <button 
              type="submit"
              disabled={isSearching}
              className="absolute right-4 top-4 bottom-4 px-10 bg-white text-black font-black rounded-2xl hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-3"
            >
              {isSearching ? <RefreshCcw size={20} className="animate-spin" /> : (
                <>TRACK <Search size={20} /></>
              )}
            </button>
          </form>
        </FadeIn>

        <AnimatePresence mode="wait">
          {orderData ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-12"
            >
              <div className="p-10 glass rounded-[3rem] border border-white/5 grid md:grid-cols-2 gap-8 relative overflow-hidden">
                 <div className="relative z-10">
                   <p className="text-[10px] font-black tracking-widest text-zinc-600 uppercase mb-2">Order Status</p>
                   <h3 className="text-3xl font-black tracking-tighter uppercase">{orderData.status}</h3>
                   <div className="flex items-center gap-2 mt-4 text-emerald-500">
                     <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                     <span className="text-[10px] font-black uppercase tracking-[0.2em]">Live Sync Active</span>
                   </div>
                 </div>
                 <div className="relative z-10 text-left md:text-right">
                   <p className="text-[10px] font-black tracking-widest text-zinc-600 uppercase mb-2">Recipient</p>
                   <h3 className="text-3xl font-black tracking-tighter uppercase italic">{orderData.shipping_address.fullName}</h3>
                   <p className="text-[10px] text-zinc-500 font-bold uppercase mt-2 tracking-widest">To: {orderData.shipping_address.city}</p>
                 </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center mb-8 px-4">
                  <h4 className="text-sm font-black tracking-[0.2em] uppercase text-zinc-500">Milestones</h4>
                  <span className="text-[10px] font-black text-white bg-white/10 px-4 py-1.5 rounded-full uppercase tracking-widest">
                    {Math.round((Math.max(0, currentStageIndex) / (TRACKING_STAGES.length - 1)) * 100)}% Complete
                  </span>
                </div>

                <div className="space-y-4 relative">
                  <div className="absolute left-10 top-10 bottom-10 w-[2px] bg-white/5" />
                  
                  {TRACKING_STAGES.map((stage, i) => {
                    const isActive = i <= currentStageIndex;
                    const isCurrent = i === currentStageIndex;
                    
                    return (
                      <motion.div 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        key={stage.id} 
                        className={`flex gap-8 p-6 rounded-[2rem] border transition-all duration-500 ${
                          isCurrent ? 'bg-white/5 border-white shadow-2xl scale-[1.02]' : 
                          isActive ? 'bg-transparent border-white/10 opacity-60' : 
                          'bg-transparent border-transparent opacity-20 grayscale'
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border-2 transition-all duration-500 ${
                          isActive ? 'bg-white border-white text-black' : 'bg-transparent border-white/10 text-zinc-700'
                        }`}>
                          {isActive ? <CheckCircle2 size={16} /> : stage.icon}
                        </div>
                        <div>
                          <div className="flex items-center gap-4">
                            <h5 className="font-black tracking-tight uppercase text-lg">{stage.label}</h5>
                            {isCurrent && (
                              <span className="px-3 py-1 bg-white text-black text-[8px] font-black uppercase tracking-widest rounded-full animate-pulse">
                                Current
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-zinc-500 mt-1 font-medium">{stage.desc}</p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          ) : (
            <FadeIn delay={0.4} direction="up" key="empty">
              <div className="p-20 glass rounded-[4rem] border border-dashed border-white/10 flex flex-col items-center text-center">
                 <div className="w-24 h-24 bg-white/5 rounded-[2rem] flex items-center justify-center mb-8 text-zinc-800">
                   <Package size={40} />
                 </div>
                 <h3 className="text-2xl font-black tracking-tighter uppercase mb-4 text-zinc-500">Awaiting Signal</h3>
                 <p className="text-zinc-700 max-w-sm text-sm font-medium">
                   Enter your code above to sync with our production servers and view your order's journey.
                 </p>
              </div>
            </FadeIn>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
