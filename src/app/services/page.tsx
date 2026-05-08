'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, Layers, Award, ShieldCheck, 
  Upload, Ruler, Box, MessageSquare, 
  ChevronRight, ArrowRight, CheckCircle2,
  Cpu, Diamond, HardDrive, RefreshCcw
} from 'lucide-react';
import Link from 'next/link';
import FadeIn from '@/components/FadeIn';
import { supabase } from '@/lib/supabase';
import toast from 'react-hot-toast';

const SERVICES = [
  { 
    title: 'Precision Laser Marking', 
    id: 'marking',
    icon: <Zap size={32} />, 
    desc: 'High-frequency fiber laser technology for permanent, high-contrast markings on all metal surfaces.',
    benefits: ['Permanent Surface Change', 'Micron Accuracy', 'Fast Processing', 'Logos & Text']
  },
  { 
    title: 'Industrial Laser Cutting', 
    id: 'cutting',
    icon: <Layers size={32} />, 
    desc: 'Clean, professional cutting of stainless steel, carbon steel, and aluminum up to industrial thicknesses.',
    benefits: ['Smooth Edges', 'No Thermal Damage', 'Complex Geometries', 'Prototypes & Batch']
  },
  { 
    title: 'Corporate Branding', 
    id: 'corporate',
    icon: <Award size={32} />, 
    desc: 'Scale your brand with precision. Bulk laser marking for company assets, gifts, and promotional items.',
    benefits: ['Consistent Quality', 'Volume Pricing', 'Asset Tracking', 'VIP Gifting']
  },
];

export default function ServicesPage() {
  const [selectedService, setSelectedService] = useState('marking');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    details: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('service_requests')
        .insert({
          name: formData.name,
          email: formData.email,
          service_type: selectedService,
          specifications: formData.details,
          status: 'pending'
        });

      if (error) throw error;

      setIsSubmitted(true);
      toast.success('Technical Blueprint Logged');
    } catch (err: any) {
      toast.error(err.message || 'Transmission failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black pt-40 pb-32 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-24 gap-12">
          <div>
            <FadeIn direction="none">
              <span className="text-[10px] font-black tracking-[0.3em] uppercase text-zinc-600 mb-4 block">Industrial Precision</span>
              <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase italic leading-none">Our Services</h1>
              <p className="text-zinc-500 text-lg mt-6 font-medium max-w-xl">
                We provide the highest standard of laser marking and cutting in Lebanon, serving both individual creative needs and industrial scale requirements.
              </p>
            </FadeIn>
          </div>
          <FadeIn delay={0.2} direction="none">
             <Link href="https://wa.me/96181388115" className="btn-premium flex items-center gap-2">
               TALK TO AN ENGINEER <MessageSquare size={20} />
             </Link>
          </FadeIn>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-32">
          {SERVICES.map((service, i) => (
            <FadeIn key={service.id} delay={i * 0.1}>
              <button 
                onClick={() => setSelectedService(service.id)}
                className={`w-full text-left p-12 glass rounded-[3rem] border transition-all duration-700 h-full group ${
                  selectedService === service.id ? 'border-white bg-white/5' : 'border-white/5 hover:border-white/20'
                }`}
              >
                <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center mb-8 transition-all duration-500 ${
                  selectedService === service.id ? 'bg-white text-black' : 'bg-zinc-950 text-zinc-600 group-hover:text-white'
                }`}>
                  {service.icon}
                </div>
                <h3 className="text-3xl font-black tracking-tighter uppercase mb-4 italic">{service.title}</h3>
                <p className="text-zinc-500 text-sm leading-relaxed mb-10 font-medium">{service.desc}</p>
                <ul className="space-y-4">
                  {service.benefits.map((b, i) => (
                    <li key={i} className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-zinc-700 group-hover:text-zinc-400 transition-colors">
                      <div className={`w-1.5 h-1.5 rounded-full ${selectedService === service.id ? 'bg-white' : 'bg-zinc-800'}`} />
                      {b}
                    </li>
                  ))}
                </ul>
              </button>
            </FadeIn>
          ))}
        </div>

        {/* Quote Request Area */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-20 items-start">
          <FadeIn direction="left">
             <div className="space-y-12">
               <div>
                 <h2 className="text-5xl font-black tracking-tighter uppercase italic mb-6">Request a Quote</h2>
                 <p className="text-zinc-500 text-lg leading-relaxed">
                   Provide your technical specifications below. Our engineering team will review your files and provide a detailed estimate within 24 hours.
                 </p>
               </div>
               
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                 {[
                   { icon: <Cpu size={24}/>, label: '316L Stainless', desc: 'Surgical grade excellence.' },
                   { icon: <Diamond size={24}/>, label: 'Titanium Grade 5', desc: 'Extreme strength-to-weight.' },
                   { icon: <HardDrive size={24}/>, label: 'Alu 6061', desc: 'Versatile industrial alloy.' },
                   { icon: <Ruler size={24}/>, label: 'Custom Gauge', desc: 'Sized to your blueprint.' }
                 ].map((m, i) => (
                   <div key={i} className="flex gap-4 group">
                     <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center shrink-0 text-zinc-700 group-hover:text-white transition-colors">
                       {m.icon}
                     </div>
                     <div>
                       <p className="font-bold uppercase tracking-tight text-sm">{m.label}</p>
                       <p className="text-[10px] text-zinc-600 font-bold uppercase mt-1 tracking-widest">{m.desc}</p>
                     </div>
                   </div>
                 ))}
               </div>
             </div>
          </FadeIn>

          <FadeIn direction="up">
             <form onSubmit={handleSubmit} className="p-12 glass rounded-[4rem] border border-white/5 shadow-2xl relative">
                <AnimatePresence>
                  {isSubmitted && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute inset-0 z-50 bg-black/90 backdrop-blur-xl rounded-[4rem] flex flex-col items-center justify-center p-12 text-center"
                    >
                      <div className="w-20 h-20 bg-white text-black rounded-full flex items-center justify-center mb-8">
                        <CheckCircle2 size={40} />
                      </div>
                      <h3 className="text-3xl font-black tracking-tighter uppercase italic mb-4">Blueprint Received</h3>
                      <p className="text-zinc-500 text-sm mb-10 font-medium">Our specialists are reviewing your request. Expect a formal quote in your inbox shortly.</p>
                      <button 
                        type="button"
                        onClick={() => setIsSubmitted(false)}
                        className="px-10 py-4 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/5 transition-all"
                      >
                        SEND ANOTHER REQUEST
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black tracking-widest uppercase text-zinc-600">Full Name</label>
                      <input required type="text" className="w-full bg-zinc-950 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:border-white outline-none transition-all" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black tracking-widest uppercase text-zinc-600">Email Address</label>
                      <input required type="email" className="w-full bg-zinc-950 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:border-white outline-none transition-all" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black tracking-widest uppercase text-zinc-600">Selected Service</label>
                    <div className="p-4 bg-zinc-950 border border-white/10 rounded-2xl text-xs font-black uppercase tracking-widest text-zinc-400">
                      {SERVICES.find(s => s.id === selectedService)?.title}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black tracking-widest uppercase text-zinc-600">Technical Details / Dimensions</label>
                    <textarea required placeholder="e.g. 500x500mm plate, 2mm thickness, 100 units..." className="w-full h-32 bg-zinc-950 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:border-white outline-none transition-all" value={formData.details} onChange={(e) => setFormData({...formData, details: e.target.value})} />
                  </div>

                  <button type="submit" disabled={isSubmitting} className="w-full py-8 bg-white text-black font-black text-xl rounded-[2rem] hover:scale-[1.02] active:scale-95 transition-all shadow-xl flex items-center justify-center gap-4">
                    {isSubmitting ? <RefreshCcw className="animate-spin" /> : <>INITIALIZE QUOTE <ChevronRight size={24} /></>}
                  </button>
                </div>
             </form>
          </FadeIn>
        </div>
      </div>
    </div>
  );
}
