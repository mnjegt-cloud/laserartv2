'use client';

import { useState } from 'react';
import { 
  Plus, Trash2, Search, ArrowLeft, 
  Tag, Percent, Calendar, RefreshCcw, 
  X, Save, Zap, CheckCircle2
} from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import FadeIn from '@/components/FadeIn';

interface Discount {
  id: string;
  code: string;
  type: 'percent' | 'fixed';
  value: number;
  status: 'active' | 'expired';
  usage: number;
}

export default function DiscountManagement() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [discounts, setDiscounts] = useState<Discount[]>([
    { id: '1', code: 'LASER10', type: 'percent', value: 10, status: 'active', usage: 145 },
    { id: '2', code: 'BEIRUT_VIP', type: 'fixed', value: 15, status: 'active', usage: 42 },
    { id: '3', code: 'WELCOME2026', type: 'percent', value: 15, status: 'expired', usage: 890 },
  ]);

  const [newDiscount, setNewDiscount] = useState({
    code: '',
    type: 'percent' as const,
    value: 0
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const discountToAdd: Discount = {
      ...newDiscount,
      id: (discounts.length + 1).toString(),
      status: 'active',
      usage: 0
    };
    setDiscounts([discountToAdd, ...discounts]);
    setIsModalOpen(false);
    setNewDiscount({ code: '', type: 'percent', value: 0 });
    setFeedback('Discount Code Generated');
    setTimeout(() => setFeedback(null), 3000);
  };

  const deleteDiscount = (id: string) => {
    setDiscounts(discounts.filter(d => d.id !== id));
    setFeedback('Code Revoked');
    setTimeout(() => setFeedback(null), 3000);
  };

  return (
    <div className="min-h-screen bg-black pt-32 pb-20 px-6 lg:px-12">
      <div className="max-w-[1200px] mx-auto">
        <FadeIn direction="none">
          <Link href="/admin" className="group inline-flex items-center gap-2 text-zinc-600 hover:text-white mb-12 transition-colors uppercase font-black text-[10px] tracking-[0.2em]">
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back to Command Center
          </Link>
        </FadeIn>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-12 mb-20">
          <div>
            <FadeIn direction="none">
              <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase italic leading-none mb-6">Discounts</h1>
              <p className="text-zinc-500 font-bold uppercase tracking-[0.3em] text-xs">Manage promotional codes and campaigns</p>
            </FadeIn>
          </div>
          <FadeIn delay={0.2} direction="none">
            <button 
              onClick={() => setIsModalOpen(true)}
              className="px-10 py-6 bg-white text-black font-black rounded-2xl flex items-center gap-3 hover:scale-[1.02] active:scale-95 transition-all shadow-xl"
            >
              <Plus size={20} /> CREATE CAMPAIGN
            </button>
          </FadeIn>
        </div>

        {/* List */}
        <div className="space-y-6">
          <AnimatePresence>
            {discounts.map((d, i) => (
              <motion.div 
                key={d.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.05 }}
                className="p-8 glass rounded-[2.5rem] border border-white/5 flex flex-col md:flex-row items-center justify-between gap-8 group hover:border-white/10 transition-all"
              >
                <div className="flex items-center gap-8">
                   <div className="w-20 h-20 bg-zinc-950 rounded-[1.5rem] border border-white/5 flex items-center justify-center text-zinc-700 group-hover:text-white transition-colors">
                      <Tag size={32} />
                   </div>
                   <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-2xl font-black tracking-tighter uppercase italic">{d.code}</h3>
                        <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${
                          d.status === 'active' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'
                        }`}>
                          {d.status}
                        </span>
                      </div>
                      <p className="text-[10px] font-black tracking-widest text-zinc-600 uppercase">
                        {d.type === 'percent' ? `${d.value}% Off Storewide` : `$${d.value} Flat Discount`}
                      </p>
                   </div>
                </div>

                <div className="flex items-center gap-12">
                   <div className="text-right">
                      <p className="text-[10px] font-black tracking-widest text-zinc-600 uppercase mb-1">Total Uses</p>
                      <p className="text-2xl font-black tracking-tighter">{d.usage.toLocaleString()}</p>
                   </div>
                   <button 
                    onClick={() => deleteDiscount(d.id)}
                    className="p-4 bg-rose-500/5 text-rose-500 hover:bg-rose-500/20 rounded-2xl transition-all"
                   >
                     <Trash2 size={20} />
                   </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Modal */}
        <AnimatePresence>
          {isModalOpen && (
            <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
               <motion.div 
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 exit={{ opacity: 0 }}
                 onClick={() => setIsModalOpen(false)}
                 className="absolute inset-0 bg-black/90 backdrop-blur-xl"
               />
               <motion.div 
                 initial={{ opacity: 0, scale: 0.95, y: 20 }}
                 animate={{ opacity: 1, scale: 1, y: 0 }}
                 exit={{ opacity: 0, scale: 0.95, y: 20 }}
                 className="w-full max-w-xl bg-zinc-950 border border-white/10 rounded-[3rem] p-12 relative shadow-2xl overflow-hidden"
               >
                 <div className="flex justify-between items-center mb-10">
                   <h2 className="text-4xl font-black tracking-tighter uppercase italic">New Campaign</h2>
                   <button onClick={() => setIsModalOpen(false)} className="p-4 hover:bg-white/5 rounded-full transition-colors"><X/></button>
                 </div>

                 <form onSubmit={handleCreate} className="space-y-8">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black tracking-widest uppercase text-zinc-600">Promo Code</label>
                      <input 
                        required
                        type="text" 
                        placeholder="E.G. SUMMER26"
                        className="w-full bg-black border border-white/5 rounded-2xl px-6 py-4 text-xl font-black italic focus:border-white outline-none transition-all uppercase"
                        value={newDiscount.code}
                        onChange={(e) => setNewDiscount({...newDiscount, code: e.target.value.toUpperCase()})}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                       <div className="space-y-3">
                          <label className="text-[10px] font-black tracking-widest uppercase text-zinc-600">Type</label>
                          <select 
                            className="w-full bg-black border border-white/5 rounded-2xl px-6 py-4 text-lg font-bold focus:border-white outline-none transition-all"
                            value={newDiscount.type}
                            onChange={(e) => setNewDiscount({...newDiscount, type: e.target.value as any})}
                          >
                            <option value="percent">Percentage</option>
                            <option value="fixed">Fixed Amount</option>
                          </select>
                       </div>
                       <div className="space-y-3">
                          <label className="text-[10px] font-black tracking-widest uppercase text-zinc-600">Value</label>
                          <input 
                            required
                            type="number" 
                            className="w-full bg-black border border-white/5 rounded-2xl px-6 py-4 text-lg font-bold focus:border-white outline-none transition-all"
                            value={newDiscount.value}
                            onChange={(e) => setNewDiscount({...newDiscount, value: Number(e.target.value)})}
                          />
                       </div>
                    </div>

                    <button type="submit" className="w-full py-6 bg-white text-black font-black text-xl rounded-2xl flex items-center justify-center gap-3">
                       <Zap size={20} fill="currentColor"/> INITIALIZE CAMPAIGN
                    </button>
                 </form>
               </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Feedback Toast */}
        <AnimatePresence>
          {feedback && (
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="fixed bottom-12 left-1/2 -translate-x-1/2 z-50 glass-dark border border-white/10 px-8 py-4 rounded-full flex items-center gap-4 shadow-2xl"
            >
              <CheckCircle2 size={18} className="text-emerald-500" />
              <span className="text-sm font-black tracking-widest uppercase">{feedback}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
