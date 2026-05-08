'use client';

import { motion } from 'framer-motion';
import { 
  ShoppingBag, Trash2, ArrowRight, 
  ChevronLeft, Plus, Minus, Zap 
} from 'lucide-react';
import Link from 'next/link';
import FadeIn from '@/components/FadeIn';

const MOCK_CART = [
  { id: '1', name: 'Elite Steel Rectangular', price: 25, qty: 1, engraving: 'SAMER' },
  { id: '2', name: 'Signature Circular Matte', price: 28, qty: 1, engraving: 'NOUR' },
];

export default function CartPage() {
  const subtotal = MOCK_CART.reduce((acc, item) => acc + (item.price * item.qty), 0);

  return (
    <div className="min-h-screen bg-black pt-40 pb-32 px-6">
      <div className="max-w-5xl mx-auto">
        <FadeIn direction="none">
          <Link href="/shop" className="group inline-flex items-center gap-2 text-zinc-500 hover:text-white mb-12 transition-colors">
            <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-[10px] font-black tracking-[0.2em] uppercase">Continue Shopping</span>
          </Link>
        </FadeIn>

        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase italic">The Collection</h1>
            <p className="text-zinc-500 font-medium mt-4 uppercase tracking-[0.3em] text-xs">Review your precision pieces</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-1">Total Items</p>
            <p className="text-3xl font-black">{MOCK_CART.length}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          <div className="lg:col-span-2 space-y-6">
            {MOCK_CART.map((item, i) => (
              <FadeIn key={item.id} delay={i * 0.1}>
                <div className="p-8 glass rounded-[3rem] border border-white/5 flex flex-col sm:flex-row gap-8 items-center group">
                  <div className="w-32 h-32 bg-zinc-900 rounded-[2rem] border border-white/5 flex items-center justify-center shrink-0">
                    <Zap size={40} className="text-zinc-800" />
                  </div>
                  <div className="flex-1 text-center sm:text-left">
                    <h3 className="text-xl font-black tracking-tight uppercase mb-1">{item.name}</h3>
                    <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-6">Custom Engraving: {item.engraving}</p>
                    
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-8">
                       <div className="flex items-center bg-zinc-950 border border-white/10 rounded-xl px-3 py-1.5">
                          <button className="p-1 text-zinc-500 hover:text-white"><Minus size={14}/></button>
                          <span className="px-5 font-bold text-sm">{item.qty}</span>
                          <button className="p-1 text-zinc-500 hover:text-white"><Plus size={14}/></button>
                       </div>
                       <button className="text-[10px] font-black text-zinc-800 hover:text-rose-500 transition-colors uppercase tracking-widest flex items-center gap-2">
                         <Trash2 size={14} /> Remove Item
                       </button>
                    </div>
                  </div>
                  <div className="sm:text-right">
                    <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-1">Price</p>
                    <p className="text-2xl font-black">${item.price}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>

          <FadeIn direction="right">
            <div className="p-10 bg-zinc-950 rounded-[4rem] border border-white/5 sticky top-40">
               <h3 className="text-xl font-black tracking-tight uppercase mb-8">Order Summary</h3>
               <div className="space-y-4 mb-10 pb-10 border-b border-white/5">
                 <div className="flex justify-between items-center">
                   <span className="text-zinc-500 font-bold uppercase tracking-widest text-[10px]">Subtotal</span>
                   <span className="font-bold">${subtotal}.00</span>
                 </div>
                 <div className="flex justify-between items-center text-emerald-500">
                   <span className="font-bold uppercase tracking-widest text-[10px]">Shipping</span>
                   <span className="font-bold uppercase text-[10px]">Calculated Next</span>
                 </div>
               </div>
               <div className="flex justify-between items-end mb-12">
                 <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Est. Total</span>
                 <span className="text-5xl font-black tracking-tighter">${subtotal}.00</span>
               </div>
               
               <Link href="/checkout" className="w-full py-6 bg-white text-black font-black text-lg rounded-[2rem] flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all shadow-xl">
                 GO TO CHECKOUT <ArrowRight size={20} />
               </Link>
            </div>
          </FadeIn>
        </div>
      </div>
    </div>
  );
}
