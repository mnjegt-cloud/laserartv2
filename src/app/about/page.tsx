'use client';

import { motion } from 'framer-motion';
import { 
  Zap, Award, Users, ShieldCheck, 
  MapPin, Globe, Clock, Target,
  Cpu, Diamond, HardDrive, Ruler
} from 'lucide-react';
import FadeIn from '@/components/FadeIn';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-black pt-40 pb-32 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="mb-40">
          <FadeIn direction="none">
            <span className="text-[10px] font-black tracking-[0.3em] uppercase text-zinc-600 mb-4 block">The Philosophy</span>
            <h1 className="text-6xl md:text-9xl font-black tracking-tighter uppercase italic leading-[0.8]">
              Precision <br/><span className="text-zinc-800">Is Our</span> <br/>Religion
            </h1>
            <p className="text-zinc-500 text-xl mt-12 max-w-2xl font-medium leading-relaxed">
              Born from the intersection of industrial engineering and fine artistry, LaserCraft LB was founded to redefine the standard of customization in Lebanon.
            </p>
          </FadeIn>
        </div>

        {/* Story Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 mb-40 items-center">
          <FadeIn direction="left">
            <div className="aspect-[4/5] glass rounded-[4rem] border border-white/5 relative overflow-hidden flex items-center justify-center p-20">
               <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(39,39,42,0.3)_0%,rgba(0,0,0,0)_100%)]" />
               <Zap size={120} className="text-white opacity-5" />
               <div className="absolute bottom-12 left-12 right-12">
                 <p className="text-[10px] font-black tracking-[0.3em] uppercase text-zinc-500 mb-2">Our Toolset</p>
                 <h3 className="text-3xl font-black tracking-tighter uppercase italic">20kW Fiber Precision</h3>
               </div>
            </div>
          </FadeIn>
          
          <FadeIn direction="right">
            <div className="space-y-8">
              <h2 className="text-5xl font-black tracking-tighter uppercase italic">The Studio</h2>
              <p className="text-zinc-400 text-lg leading-relaxed">
                Located in the heart of Lebanon, our studio houses state-of-the-art fiber laser technology. Unlike traditional CO2 lasers, our fiber systems allow us to mark metals with microscopic accuracy, creating permanent, high-contrast designs that never fade or peel.
              </p>
              <div className="grid grid-cols-2 gap-8 pt-8">
                <div>
                  <h4 className="text-2xl font-black tracking-tighter uppercase">5,000+</h4>
                  <p className="text-[10px] font-black tracking-widest text-zinc-600 uppercase mt-1">Pieces Crafted</p>
                </div>
                <div>
                  <h4 className="text-2xl font-black tracking-tighter uppercase">0.01mm</h4>
                  <p className="text-[10px] font-black tracking-widest text-zinc-600 uppercase mt-1">Accuracy Tolerance</p>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>

        {/* Values */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-40">
          {[
            { icon: <Target size={32}/>, title: 'Absolute Quality', desc: 'Every piece undergoes a 3-step inspection process before shipment.' },
            { icon: <Clock size={32}/>, title: 'Rapid Deployment', desc: 'Customization shouldn\'t mean waiting. We dispatch within 48 hours.' },
            { icon: <Globe size={32}/>, title: 'Local Heritage', desc: 'Proudly engineered and manufactured in Lebanon by local artisans.' }
          ].map((v, i) => (
            <FadeIn key={i} delay={i * 0.1}>
              <div className="p-12 glass rounded-[3rem] border border-white/5 h-full group hover:border-white/20 transition-all">
                <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-zinc-500 mb-8 group-hover:text-white transition-colors">
                  {v.icon}
                </div>
                <h3 className="text-2xl font-black tracking-tighter uppercase italic mb-4">{v.title}</h3>
                <p className="text-zinc-500 text-sm leading-relaxed font-medium">{v.desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>

        {/* Location / CTA */}
        <FadeIn direction="up">
           <div className="p-20 bg-zinc-950 rounded-[5rem] border border-white/5 text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.05)_0%,rgba(0,0,0,0)_70%)]" />
              <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic mb-8 relative z-10">Visit the Forge</h2>
              <div className="flex flex-col md:flex-row items-center justify-center gap-8 relative z-10 mb-12">
                <div className="flex items-center gap-3 text-zinc-400">
                  <MapPin size={20} />
                  <span className="font-bold uppercase tracking-widest text-xs">Beirut Industrial Zone, LB</span>
                </div>
                <div className="flex items-center gap-3 text-zinc-400">
                  <Globe size={20} />
                  <span className="font-bold uppercase tracking-widest text-xs">Global Shipping Available</span>
                </div>
              </div>
              <Link href="/shop" className="btn-premium inline-flex items-center gap-3 relative z-10">
                EXPLORE THE COLLECTION <ArrowRight size={20} />
              </Link>
           </div>
        </FadeIn>
      </div>
    </div>
  );
}
