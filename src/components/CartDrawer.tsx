'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingBag, X, Plus, Minus, 
  Trash2, ArrowRight, Truck, Zap 
} from 'lucide-react';
import Link from 'next/link';
import { useCart } from '@/lib/store';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, updateQuantity, removeItem, getTotalPrice } = useCart();
  const subtotal = getTotalPrice();
  const shippingThreshold = 75;
  const progress = Math.min((subtotal / shippingThreshold) * 100, 100);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[150]"
          />
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-black border-l border-white/10 z-[160] flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="p-8 border-b border-white/5 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <ShoppingBag size={20} />
                <h2 className="text-xl font-black tracking-tight uppercase">Your Collection</h2>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-all">
                <X size={20} />
              </button>
            </div>

            {/* Free Shipping Progress */}
            <div className="p-8 bg-zinc-950 border-b border-white/5">
              <div className="flex justify-between items-end mb-4">
                <p className="text-[10px] font-black tracking-widest uppercase text-zinc-500">
                  {subtotal >= shippingThreshold ? 'FREE SHIPPING UNLOCKED' : `ADD $${(shippingThreshold - subtotal).toFixed(2)} FOR FREE SHIPPING`}
                </p>
                <Truck size={14} className={subtotal >= shippingThreshold ? 'text-emerald-500' : 'text-zinc-700'} />
              </div>
              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  className={`h-full transition-all duration-1000 ${subtotal >= shippingThreshold ? 'bg-emerald-500' : 'bg-white'}`}
                />
              </div>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-8 space-y-6">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-20">
                   <ShoppingBag size={48} />
                   <p className="text-xs font-black uppercase tracking-widest">Your collection is empty</p>
                </div>
              ) : (
                items.map((item, idx) => (
                  <div key={`${item.id}-${idx}`} className="flex gap-6 group">
                    <div className="w-24 h-24 bg-zinc-900 rounded-2xl border border-white/5 flex items-center justify-center shrink-0">
                      <Zap size={32} className="text-zinc-800" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="font-bold text-sm tracking-tight">{item.name}</h3>
                        <p className="font-black">${item.price}</p>
                      </div>
                      <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-4">
                        Engraving: {item.personalization?.text || 'None'}
                      </p>
                      
                      <div className="flex justify-between items-center">
                        <div className="flex items-center bg-zinc-950 border border-white/10 rounded-lg px-2 py-1">
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1 text-zinc-500 hover:text-white"
                          >
                            <Minus size={12}/>
                          </button>
                          <span className="px-3 text-xs font-bold">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1 text-zinc-500 hover:text-white"
                          >
                            <Plus size={12}/>
                          </button>
                        </div>
                        <button 
                          onClick={() => removeItem(item.id)}
                          className="text-zinc-700 hover:text-rose-500 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-8 bg-zinc-950 border-t border-white/5 space-y-6">
                <div className="flex justify-between items-end">
                  <p className="text-[10px] font-black tracking-widest uppercase text-zinc-500">Subtotal</p>
                  <h3 className="text-4xl font-black tracking-tighter">${subtotal}.00</h3>
                </div>
                <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-[0.2em] text-center">Taxes and shipping calculated at checkout</p>
                
                <Link 
                  href="/checkout"
                  onClick={onClose}
                  className="w-full py-6 bg-white text-black font-black text-lg rounded-2xl flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all shadow-xl"
                >
                  PROCEED TO CHECKOUT <ArrowRight size={20} />
                </Link>
                
                <button 
                  onClick={onClose}
                  className="w-full py-4 text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] hover:text-white transition-colors"
                >
                  CONTINUE CRAFTING
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
