'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingBag, ArrowLeft, Truck, ShieldCheck, 
  Clock, Zap, CheckCircle2, ChevronRight, 
  MessageSquare, Upload, Type, Info, Star, Repeat, RefreshCcw
} from 'lucide-react';
import FadeIn from '@/components/FadeIn';
import { supabase } from '@/lib/supabase';
import { useCart } from '@/lib/store';
import toast from 'react-hot-toast';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const addItem = useCart(state => state.addItem);
  
  const [engravingText, setEngravingText] = useState('');
  const [selectedSide, setSelectedSide] = useState<'Front' | 'Back'>('Front');
  const [giftBox, setGiftBox] = useState(false);
  const [delivery, setDelivery] = useState('express');
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    async function fetchProduct() {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching product:', error);
        // Fallback for demo
        setProduct({
          id,
          name: 'Elite Series: Rectangular Steel',
          price: 25,
          category: 'Keychains',
          description: 'Hand-polished 316L stainless steel with deep laser etching. This piece features our signature mirror finish and industrial-grade durability.',
          details: ['316L Stainless Steel', 'Rust Proof', 'Mirror Finish']
        });
      } else {
        setProduct(data);
      }
      setLoading(false);
    }
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
          <RefreshCcw size={32} className="text-zinc-500" />
        </motion.div>
      </div>
    );
  }

  const totalPrice = (product?.price || 0) + (giftBox ? 5 : 0) + (selectedSide === 'Back' ? 10 : 0);

  const handleAddToCart = () => {
    setIsAdding(true);
    addItem({
      id: product.id,
      name: product.name,
      price: totalPrice,
      quantity: 1,
      personalization: {
        text: engravingText,
        side: selectedSide,
        giftBox
      }
    });
    
    setTimeout(() => {
      setIsAdding(false);
      toast.success('Successfully added to collection');
    }, 800);
  };

  const handleWhatsAppOrder = () => {
    const message = `Hi LaserCraft! I'd like to order the ${product.name}.\n\n*Personalization:* ${engravingText || 'None'}\n*Side:* ${selectedSide}\n*Gift Box:* ${giftBox ? 'Yes' : 'No'}\n*Total:* $${totalPrice}`;
    window.open(`https://wa.me/96181388115?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-black pt-40 pb-32">
      <div className="max-w-7xl mx-auto px-6">
        <FadeIn direction="none">
          <Link href="/shop" className="group inline-flex items-center gap-2 text-zinc-500 hover:text-white mb-12 transition-colors">
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-[10px] font-black tracking-[0.2em] uppercase">The Catalog</span>
          </Link>
        </FadeIn>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          {/* Left: Product Visuals */}
          <div className="space-y-8 lg:sticky lg:top-40">
            <FadeIn direction="left">
              <div className="aspect-square glass rounded-[3rem] border border-white/5 relative overflow-hidden flex items-center justify-center p-20 group">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(39,39,42,0.3)_0%,rgba(0,0,0,0)_100%)]" />
                
                {/* 3D-effect Preview Mockup */}
                <motion.div 
                  animate={{ rotateY: selectedSide === 'Back' ? 180 : 0 }}
                  transition={{ type: 'spring', stiffness: 60, damping: 20 }}
                  className="w-full aspect-[2/3] border-2 border-white/20 rounded-2xl flex flex-col items-center justify-center p-8 relative shadow-2xl bg-zinc-900 group-hover:scale-[1.02] transition-transform duration-700 [transform-style:preserve-3d]"
                >
                  <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] rounded-2xl" />
                  
                  {/* Front Side Content */}
                  <div className="flex flex-col items-center justify-center w-full h-full [backface-visibility:hidden]">
                    <div className="absolute top-4 left-4 text-[8px] font-black tracking-widest text-zinc-700 uppercase">FRONT VIEW</div>
                    <AnimatePresence mode="wait">
                      <motion.div 
                        key={engravingText}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center w-full px-4"
                      >
                        {engravingText ? (
                          <p className="text-white font-heading text-2xl font-black tracking-tighter break-words leading-none uppercase italic">
                            {engravingText}
                          </p>
                        ) : (
                          <div className="flex flex-col items-center gap-4 opacity-10">
                            <Type size={40} />
                            <span className="text-xs font-black tracking-widest uppercase text-white">Engraving Area</span>
                          </div>
                        )}
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  {/* Back Side Content */}
                  <div className="absolute inset-0 bg-zinc-800 rounded-2xl flex flex-col items-center justify-center p-8 text-center [transform:rotateY(180deg)] [backface-visibility:hidden]">
                    <div className="absolute top-4 right-4 text-[8px] font-black tracking-widest text-zinc-600 uppercase">BACK VIEW</div>
                    <Repeat size={40} className="text-zinc-700 mb-6" />
                    <span className="text-zinc-600 font-black text-2xl uppercase tracking-tighter leading-tight opacity-20">DUAL SIDED<br/>CRAFTED AREA</span>
                  </div>
                </motion.div>

                {/* View Controls */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-4">
                  {['Front', 'Back'].map(side => (
                    <button 
                      key={side}
                      onClick={() => setSelectedSide(side as any)}
                      className={`px-6 py-2 rounded-full text-[10px] font-black tracking-widest uppercase transition-all border ${
                        selectedSide === side ? 'bg-white text-black' : 'bg-black/50 text-zinc-500 border-white/5 hover:border-white/20'
                      }`}
                    >
                      {side}
                    </button>
                  ))}
                </div>
              </div>
            </FadeIn>
            
            <div className="grid grid-cols-2 gap-4">
              <FadeIn direction="up" delay={0.1}>
                <div className="p-8 glass rounded-[2rem] border border-white/5 flex flex-col items-center text-center">
                  <ShieldCheck className="text-zinc-600 mb-4" />
                  <p className="text-[10px] font-black tracking-widest uppercase text-zinc-500 mb-1">Lifetime Durability</p>
                  <p className="text-xs text-white">316L Surgical Steel</p>
                </div>
              </FadeIn>
              <FadeIn direction="up" delay={0.2}>
                <div className="p-8 glass rounded-[2rem] border border-white/5 flex flex-col items-center text-center">
                  <Truck className="text-zinc-600 mb-4" />
                  <p className="text-[10px] font-black tracking-widest uppercase text-zinc-500 mb-1">Express Network</p>
                  <p className="text-xs text-white">Lebanon-wide</p>
                </div>
              </FadeIn>
            </div>
          </div>

          {/* Right: Personalization */}
          <div className="flex flex-col">
            <FadeIn>
              <span className="text-[10px] font-black tracking-[0.3em] uppercase text-zinc-600 mb-4 block">Reference #{product.id.slice(0, 8)}</span>
              <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic mb-6 leading-none">{product.name}</h1>
              <div className="flex items-baseline gap-4 mb-12">
                <p className="text-4xl font-black">${totalPrice}</p>
                <span className="text-zinc-600 font-bold uppercase text-xs">Customization Included</span>
              </div>
              
              <div className="p-8 bg-zinc-950/50 border border-white/5 rounded-[2.5rem] mb-12">
                <p className="text-zinc-400 leading-relaxed mb-8">{product.description}</p>
                <div className="flex flex-wrap gap-4">
                  {product.details?.map((d: string, i: number) => (
                    <span key={i} className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 flex items-center gap-2">
                      <div className="w-1 h-1 bg-zinc-600 rounded-full" /> {d}
                    </span>
                  ))}
                </div>
              </div>

              {/* Personalization */}
              <div className="space-y-8 mb-16">
                <div>
                  <div className="flex justify-between items-center mb-4 text-[10px] font-black tracking-widest uppercase text-zinc-500">
                    <label>Bespoke Engraving</label>
                    <span>{engravingText.length}/24 Characters</span>
                  </div>
                  <input 
                    type="text" 
                    maxLength={24}
                    placeholder="ENTER TEXT (E.G. SAMER)"
                    value={engravingText}
                    onChange={(e) => setEngravingText(e.target.value.toUpperCase())}
                    className="w-full bg-zinc-950 border border-white/10 rounded-2xl p-6 text-xl font-bold tracking-tight focus:border-white transition-all outline-none placeholder:text-zinc-800 italic"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <button 
                    onClick={() => setSelectedSide(selectedSide === 'Front' ? 'Back' : 'Front')}
                    className={`p-6 rounded-2xl border text-left transition-all ${
                      selectedSide === 'Back' ? 'bg-white/5 border-white' : 'bg-zinc-950 border-white/5 hover:border-white/20'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <Repeat size={20} className={selectedSide === 'Back' ? 'text-white' : 'text-zinc-600'} />
                      <span className="text-[10px] font-black text-zinc-500">+$10</span>
                    </div>
                    <p className="font-bold uppercase tracking-tighter">Dual Sided</p>
                    <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest mt-1">Back engraving</p>
                  </button>

                  <button 
                    onClick={() => setGiftBox(!giftBox)}
                    className={`p-6 rounded-2xl border text-left transition-all ${
                      giftBox ? 'bg-white/5 border-white' : 'bg-zinc-950 border-white/5 hover:border-white/20'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <ShoppingBag size={20} className={giftBox ? 'text-white' : 'text-zinc-600'} />
                      <span className="text-[10px] font-black text-zinc-500">+$5</span>
                    </div>
                    <p className="font-bold uppercase tracking-tighter">Luxury Gift Box</p>
                    <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest mt-1">Matte wrap</p>
                  </button>
                </div>
              </div>

              {/* CTAs */}
              <div className="flex flex-col gap-4">
                <button 
                  onClick={handleAddToCart}
                  disabled={isAdding}
                  className="w-full py-8 bg-white text-black font-black text-xl rounded-[2rem] hover:scale-[1.02] active:scale-95 transition-all shadow-xl flex items-center justify-center gap-4 group"
                >
                  {isAdding ? (
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
                      <Clock size={24} />
                    </motion.div>
                  ) : (
                    <>ADD TO COLLECTION <ShoppingBag size={24} className="group-hover:translate-x-1 transition-transform" /></>
                  )}
                </button>
                <button 
                  onClick={handleWhatsAppOrder}
                  className="w-full py-8 bg-zinc-900 text-white font-black text-xl rounded-[2rem] hover:bg-zinc-800 transition-all flex items-center justify-center gap-4"
                >
                  ORDER VIA WHATSAPP <MessageSquare size={24} />
                </button>
                <p className="text-center text-[9px] text-zinc-500 font-bold uppercase tracking-[0.3em]">Estimated Delivery: 24-48 Hours</p>
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
    </div>
  );
}
