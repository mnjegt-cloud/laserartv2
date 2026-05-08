'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Zap, Shield, Truck, Star, CheckCircle2, ChevronRight, MessageSquare, Package, Clock, Layers, Award } from 'lucide-react';
import Link from 'next/link';
import FadeIn from '@/components/FadeIn';

export default function Home() {
  const categories = [
    { name: 'Elite Keychains', count: '48 items', icon: <Package size={24}/>, href: '/shop?category=Keychains' },
    { name: 'Corporate Gifts', count: '12 services', icon: <Award size={24}/>, href: '/services' },
    { name: 'Home Decor', count: '24 items', icon: <Layers size={24}/>, href: '/shop?category=Home%20Decor' },
    { name: 'Custom Souvenirs', count: '86 items', icon: <Star size={24}/>, href: '/shop?category=Souvenirs' },
  ];

  return (
    <div className="flex flex-col bg-black text-white selection:bg-white/10 overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
        {/* Animated Background Gradients */}
        <div className="absolute top-0 left-0 w-full h-full z-0 overflow-hidden">
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
              x: [0, 100, 0],
              y: [0, -100, 0]
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute -top-[20%] -left-[10%] w-[80%] h-[80%] bg-zinc-900/50 rounded-full blur-[120px]"
          />
          <motion.div 
            animate={{ 
              scale: [1.2, 1, 1.2],
              opacity: [0.2, 0.4, 0.2],
              x: [0, -100, 0],
              y: [0, 100, 0]
            }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute -bottom-[20%] -right-[10%] w-[80%] h-[80%] bg-zinc-800/30 rounded-full blur-[120px]"
          />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <FadeIn direction="none">
            <span className="inline-block px-4 py-1.5 mb-8 text-[10px] font-black tracking-[0.3em] uppercase bg-white/5 border border-white/10 rounded-full text-zinc-500">
              The Gold Standard of Laser Artistry
            </span>
          </FadeIn>
          
          <div className="mb-12">
            <FadeIn delay={0.2}>
              <h1 className="text-7xl md:text-[10rem] font-black tracking-tighter leading-[0.8] mb-4">
                LASER<span className="text-zinc-600 italic">CRAFT</span>
              </h1>
            </FadeIn>
            <FadeIn delay={0.4}>
              <h2 className="text-4xl md:text-8xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-400 to-zinc-600 italic">
                DEFINING PRECISION.
              </h2>
            </FadeIn>
          </div>

          <FadeIn delay={0.6}>
            <p className="text-zinc-500 text-lg md:text-2xl max-w-3xl mx-auto mb-16 leading-relaxed font-medium">
              Premium stainless steel artistry and custom laser precision. 
              From bespoke keychains to industrial marking, we define the edge of excellence.
            </p>
          </FadeIn>

          <FadeIn delay={0.8} direction="none">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link 
                href="/shop" 
                className="group btn-premium"
              >
                EXPLORE CATALOG <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                href="/services" 
                className="btn-outline"
              >
                CUSTOM SERVICES
              </Link>
            </div>
          </FadeIn>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <div className="w-6 h-10 rounded-full border-2 border-white/10 flex justify-center pt-2">
            <div className="w-1 h-2 bg-white rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* Featured Categories Grid */}
      <section className="py-40 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-8">
            <FadeIn>
              <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-none">
                CHOOSE YOUR<br/>
                <span className="text-zinc-600 italic">COLLECTION</span>
              </h2>
            </FadeIn>
            <FadeIn delay={0.2}>
              <p className="text-zinc-500 max-w-sm mb-2 font-medium">
                Every category is curated with the highest quality materials and precision marking standards.
              </p>
            </FadeIn>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {categories.map((cat, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <Link href={cat.href} className="group premium-card block h-full">
                  <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-white group-hover:text-black transition-all duration-500 shadow-xl">
                    {cat.icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-2 uppercase tracking-tighter">{cat.name}</h3>
                  <p className="text-zinc-500 text-sm font-bold tracking-widest uppercase mb-8">{cat.count}</p>
                  <div className="flex items-center gap-2 text-xs font-black tracking-[0.2em] text-zinc-600 group-hover:text-white transition-colors">
                    VIEW ALL <ChevronRight size={14} />
                  </div>
                </Link>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* The Process Section */}
      <section className="py-40 bg-zinc-950/50 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-32">
            <FadeIn>
              <span className="text-[10px] font-black tracking-[0.3em] uppercase text-zinc-600 mb-6 block">Our Craftsmanship</span>
              <h2 className="text-6xl md:text-8xl font-black tracking-tighter">THE PROCESS</h2>
            </FadeIn>
          </div>

          <div className="grid md:grid-cols-4 gap-12 relative">
            {/* Connecting Line (Desktop) */}
            <div className="hidden md:block absolute top-10 left-[15%] right-[15%] h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            
            {[
              { step: '01', title: 'Design', desc: 'Custom mockups prepared for your approval.', icon: <Layers size={20}/> },
              { step: '02', title: 'Precision', desc: 'Fiber laser marking with micron accuracy.', icon: <Zap size={20}/> },
              { step: '03', title: 'Polish', desc: 'Surface finishing and quality inspection.', icon: <Award size={20}/> },
              { step: '04', title: 'Ship', desc: 'Premium packaging and nationwide delivery.', icon: <Truck size={20}/> }
            ].map((p, i) => (
              <FadeIn key={i} delay={i * 0.15}>
                <div className="relative group text-center md:text-left">
                  <div className="w-20 h-20 bg-zinc-900 rounded-[2rem] flex items-center justify-center mb-8 mx-auto md:mx-0 border border-white/5 group-hover:border-white/20 transition-all shadow-2xl relative z-10">
                    <span className="absolute -top-4 -right-4 text-4xl font-black text-white/5 group-hover:text-white/10 transition-colors">{p.step}</span>
                    {p.icon}
                  </div>
                  <h4 className="text-xl font-bold mb-4 uppercase tracking-tighter">{p.title}</h4>
                  <p className="text-zinc-500 text-sm leading-relaxed">{p.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Client Voices */}
      <section className="py-40">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center mb-32 gap-12">
            <FadeIn>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex gap-1 text-amber-500">
                  {[...Array(5)].map((_, i) => <Star key={i} size={18} fill="currentColor" />)}
                </div>
                <span className="font-bold tracking-widest text-zinc-500 uppercase text-xs">4.9/5 RATING</span>
              </div>
              <h2 className="text-6xl font-black tracking-tighter uppercase italic">Client Voices</h2>
            </FadeIn>
            <FadeIn delay={0.2}>
              <Link href="/reviews" className="btn-outline flex items-center gap-2">
                VIEW ALL STORIES <MessageSquare size={16} />
              </Link>
            </FadeIn>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: 'Jad H.', review: 'The detail on the custom keychain was insane. Best gift I ever bought.', role: 'Elite Member' },
              { name: 'Maria K.', review: 'Needed 50 logos for my business event. They delivered in 2 days. Flawless.', role: 'Corporate Partner' },
              { name: 'Omar S.', review: 'High quality steel, definitely doesn\'t rust. Very professional team.', role: 'Verified Buyer' }
            ].map((t, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div className="p-12 glass rounded-[3rem] border border-white/5 relative overflow-hidden group hover:border-white/20 transition-all">
                  <div className="absolute top-0 right-0 p-12 opacity-5 scale-150 rotate-12 group-hover:rotate-0 transition-all duration-700">
                    <MessageSquare size={80} />
                  </div>
                  <p className="text-zinc-300 italic text-xl mb-12 leading-relaxed relative z-10">"{t.review}"</p>
                  <div className="relative z-10">
                    <p className="font-black text-lg tracking-tight">{t.name}</p>
                    <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-[0.2em] mt-1">{t.role}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-60 relative overflow-hidden bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black z-0" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <FadeIn>
            <h2 className="text-7xl md:text-[12rem] font-black tracking-tighter mb-12 leading-none">
              READY TO<br/>
              <span className="text-zinc-600 italic">CREATE?</span>
            </h2>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
              <Link 
                href="/shop" 
                className="btn-premium px-16 py-8 text-2xl"
              >
                START SHOPPING
              </Link>
              <div className="flex flex-col items-start text-left gap-2 px-6">
                <div className="flex items-center gap-2 text-emerald-500 font-black tracking-widest text-[10px] uppercase">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" /> Production Active
                </div>
                <p className="text-zinc-500 text-sm max-w-[200px]">Current production time for custom orders: <span className="text-white">24-48 Hours</span></p>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* WhatsApp Floating */}
      <Link 
        href="https://wa.me/96181388115" 
        target="_blank"
        className="fixed bottom-24 right-8 md:bottom-12 md:right-12 z-[90] p-5 bg-[#25D366] text-white rounded-2xl shadow-2xl hover:scale-110 active:scale-95 transition-all shadow-emerald-500/20"
      >
        <MessageSquare size={28} fill="currentColor" />
      </Link>
    </div>
  );
}


