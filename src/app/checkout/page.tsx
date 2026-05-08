'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, Truck, MessageSquare, 
  ChevronLeft, CreditCard, Lock, Zap,
  CheckCircle2, ArrowRight, Info, RefreshCcw
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import FadeIn from '@/components/FadeIn';
import { useCart } from '@/lib/store';
import { supabase } from '@/lib/supabase';
import toast from 'react-hot-toast';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotalPrice, clearCart } = useCart();
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    city: '',
    address: '',
    notes: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const subtotal = getTotalPrice();
  const shipping = subtotal >= 75 ? 0 : 5;
  const total = subtotal + shipping;

  // Prevent empty checkout
  useEffect(() => {
    if (items.length === 0 && !isSuccess) {
      router.push('/shop');
    }
  }, [items, isSuccess, router]);

  const handleCompleteOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      // 1. Create Order in Supabase
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          total_amount: total,
          status: 'pending',
          payment_status: 'pending',
          shipping_address: {
            fullName: formData.fullName,
            phone: formData.phone,
            city: formData.city,
            address: formData.address,
            notes: formData.notes
          },
          timeline: [{ stage: 'received', time: new Date().toISOString() }]
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // 2. Create Order Items
      const orderItems = items.map(item => ({
        order_id: order.id,
        product_id: item.id,
        quantity: item.quantity,
        price_at_purchase: item.price,
        personalization_details: item.personalization
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // 3. Success Feedback
      setIsSuccess(true);
      toast.success('Order Initialized Successfully');
      
      // 4. WhatsApp Integration
      const message = `Hi LaserCraft! I've placed a new order!\n\n*Order ID:* ${order.id.slice(0, 8)}\n*Name:* ${formData.fullName}\n*Total:* $${total}\n\nI'm waiting for your confirmation!`;
      window.open(`https://wa.me/96181388115?text=${encodeURIComponent(message)}`, '_blank');
      
      // 5. Cleanup
      clearCart();

    } catch (error: any) {
      console.error('Checkout Error:', error);
      toast.error(error.message || 'Checkout failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6">
        <FadeIn direction="up">
          <div className="max-w-md w-full glass rounded-[4rem] border border-white/10 p-12 text-center">
            <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8 text-black">
              <CheckCircle2 size={48} />
            </div>
            <h1 className="text-4xl font-black tracking-tighter uppercase italic mb-4">Crafting Initiated</h1>
            <p className="text-zinc-500 mb-10 leading-relaxed font-medium">
              Your order has been logged in our secure cluster. We've opened WhatsApp to finalize the details with you.
            </p>
            <Link href="/track" className="w-full py-6 bg-white text-black font-black text-lg rounded-2xl flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all shadow-xl mb-4">
              TRACK YOUR ORDER <Truck size={20} />
            </Link>
            <Link href="/shop" className="text-[10px] font-black text-zinc-600 uppercase tracking-widest hover:text-white transition-colors">
              RETURN TO CATALOG
            </Link>
          </div>
        </FadeIn>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pt-40 pb-32 px-6">
      <div className="max-w-7xl mx-auto">
        <FadeIn direction="none">
          <Link href="/shop" className="group inline-flex items-center gap-2 text-zinc-500 hover:text-white mb-12 transition-colors">
            <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-[10px] font-black tracking-[0.2em] uppercase">Return to Crafting</span>
          </Link>
        </FadeIn>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
          {/* Left: Checkout Form */}
          <div className="space-y-12">
            <div>
              <h1 className="text-6xl font-black tracking-tighter uppercase italic mb-4">Secured Checkout</h1>
              <p className="text-zinc-500 font-medium">Complete your details to initialize your bespoke order.</p>
            </div>

            <form onSubmit={handleCompleteOrder} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-black tracking-widest uppercase text-zinc-600">Full Name</label>
                  <input 
                    required
                    type="text" 
                    placeholder="e.g. Samer Rahme"
                    className="w-full bg-zinc-950 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:border-white outline-none transition-all"
                    value={formData.fullName}
                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black tracking-widest uppercase text-zinc-600">Phone Number</label>
                  <input 
                    required
                    type="tel" 
                    placeholder="e.g. +961 81 123 456"
                    className="w-full bg-zinc-950 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:border-white outline-none transition-all"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black tracking-widest uppercase text-zinc-600">City / District</label>
                <input 
                  required
                  type="text" 
                  placeholder="e.g. Beirut, Ashrafieh"
                  className="w-full bg-zinc-950 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:border-white outline-none transition-all"
                  value={formData.city}
                  onChange={(e) => setFormData({...formData, city: e.target.value})}
                />
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black tracking-widest uppercase text-zinc-600">Exact Delivery Address</label>
                <textarea 
                  required
                  placeholder="Street name, building, floor..."
                  className="w-full h-32 bg-zinc-950 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:border-white outline-none transition-all"
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                />
              </div>

              <div className="p-8 glass rounded-[2.5rem] border border-white/5 flex gap-6 items-center">
                 <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-zinc-500">
                   <Lock size={20} />
                 </div>
                 <div>
                   <p className="text-[10px] font-black tracking-widest uppercase text-white">Payment Method</p>
                   <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest mt-1">Cash on Delivery / Wish Money</p>
                 </div>
              </div>

              <button 
                type="submit"
                disabled={isProcessing}
                className="w-full py-8 bg-white text-black font-black text-xl rounded-[2.5rem] hover:scale-[1.02] active:scale-95 transition-all shadow-[0_30px_60px_rgba(255,255,255,0.1)] flex items-center justify-center gap-4"
              >
                {isProcessing ? (
                  <>PROCESSING... <RefreshCcw size={20} className="animate-spin" /></>
                ) : (
                  <>COMPLETE ORDER <ArrowRight size={24} /></>
                )}
              </button>
            </form>
          </div>

          {/* Right: Order Summary */}
          <FadeIn direction="right">
            <div className="p-12 glass rounded-[4rem] border border-white/5 sticky top-40">
               <h3 className="text-2xl font-black tracking-tight uppercase mb-8">Collection Summary</h3>
               
               <div className="space-y-6 mb-10 pb-10 border-b border-white/5">
                  {items.map((item, i) => (
                    <div key={i} className="flex justify-between items-start">
                      <div>
                        <p className="font-bold text-sm">{item.name} (x{item.quantity})</p>
                        <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mt-1">
                          {item.personalization?.text || 'Standard'} | {item.personalization?.side}
                        </p>
                      </div>
                      <p className="font-black">${item.price * item.quantity}</p>
                    </div>
                  ))}
               </div>

               <div className="space-y-4 mb-10">
                 <div className="flex justify-between text-sm">
                   <span className="text-zinc-500 font-bold uppercase tracking-widest">Subtotal</span>
                   <span className="font-bold">${subtotal}.00</span>
                 </div>
                 <div className="flex justify-between text-sm">
                   <span className="text-zinc-500 font-bold uppercase tracking-widest">Shipping</span>
                   <span className="font-bold">{shipping === 0 ? 'FREE' : `$${shipping}.00`}</span>
                 </div>
                 <div className="flex justify-between items-end pt-4 border-t border-white/5">
                   <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Total Investment</span>
                   <span className="text-5xl font-black tracking-tighter">${total}.00</span>
                 </div>
               </div>

               <div className="space-y-4">
                 <div className="flex gap-4 p-4 bg-zinc-950 rounded-2xl border border-white/5">
                   <Truck size={18} className="text-zinc-600 shrink-0" />
                   <p className="text-[10px] font-bold text-zinc-500 uppercase leading-relaxed tracking-widest">
                     Dispatched within 24-48 hours. Lebanon-wide tracking included.
                   </p>
                 </div>
                 <div className="flex gap-4 p-4 bg-zinc-950 rounded-2xl border border-white/5">
                   <ShieldCheck size={18} className="text-zinc-600 shrink-0" />
                   <p className="text-[10px] font-bold text-zinc-500 uppercase leading-relaxed tracking-widest">
                     Hand-inspected for precision quality before shipping.
                   </p>
                 </div>
               </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </div>
  );
}
