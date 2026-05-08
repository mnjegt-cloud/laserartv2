'use client';

import Link from 'next/link';
import { ShoppingBag, Search, Menu, Zap, Command, ChevronDown, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import CartDrawer from './CartDrawer';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
        isScrolled ? 'py-4 px-6' : 'py-8 px-10'
      }`}>
        <div className={`max-w-7xl mx-auto flex justify-between items-center transition-all duration-500 ${
          isScrolled ? 'glass-dark rounded-full px-8 py-3 border border-white/10' : ''
        }`}>
          <div className="flex items-center gap-12">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-black group-hover:rotate-[15deg] transition-transform duration-500 shadow-xl">
                <Zap size={22} fill="currentColor" />
              </div>
              <span className="text-2xl font-black tracking-tighter text-white">
                LASER<span className="text-zinc-500">CRAFT</span>
              </span>
            </Link>
            
            <div className="hidden lg:flex items-center space-x-10">
              {[
                { label: 'The Catalog', href: '/shop' },
                { label: 'Services', href: '/services' },
                { label: 'Track Order', href: '/track' },
              ].map((link, i) => (
                <Link 
                  key={i}
                  href={link.href} 
                  className={`text-[11px] font-black tracking-[0.2em] uppercase transition-colors relative group ${
                    pathname === link.href ? 'text-white' : 'text-zinc-500 hover:text-white'
                  }`}
                >
                  {link.label}
                  <span className={`absolute -bottom-1 left-0 h-[2px] bg-white transition-all duration-300 ${
                    pathname === link.href ? 'w-full' : 'w-0 group-hover:w-full'
                  }`} />
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-3 text-zinc-400 hover:text-white hover:bg-white/10 rounded-full transition-all"
            >
              <Search size={20} />
            </button>
            
            <button 
              onClick={() => setIsCartOpen(true)}
              className="p-3 text-zinc-400 hover:text-white hover:bg-white/10 rounded-full transition-all relative group"
            >
              <ShoppingBag size={20} />
              <span className="absolute top-2 right-2 w-4 h-4 bg-white text-black text-[10px] font-black rounded-full flex items-center justify-center border-2 border-black group-hover:scale-110 transition-transform">
                2
              </span>
            </button>
            
            <div className="h-6 w-[1px] bg-white/10 mx-2 hidden sm:block" />
            
            <Link href="/admin" className="p-3 text-zinc-400 hover:text-white hover:bg-white/10 rounded-full transition-all hidden sm:flex">
              <Command size={20} />
            </Link>
            
            <button className="lg:hidden p-3 text-zinc-400 hover:text-white hover:bg-white/10 rounded-full transition-all">
              <Menu size={20} />
            </button>
          </div>
        </div>
      </nav>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      {/* Fullscreen Search Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-[110] glass-dark flex flex-col items-center justify-start pt-40 px-6"
          >
            <div className="w-full max-w-4xl relative">
              <input 
                autoFocus
                type="text" 
                placeholder="Search for premium products..." 
                className="w-full bg-transparent border-b-2 border-white/10 pb-6 text-4xl md:text-6xl font-black tracking-tighter focus:outline-none focus:border-white transition-all placeholder:text-zinc-800"
              />
              <button 
                onClick={() => setIsSearchOpen(false)}
                className="absolute top-0 right-0 p-4 text-zinc-500 hover:text-white transition-colors flex items-center gap-2 text-[10px] font-black tracking-widest uppercase"
              >
                CLOSE <X size={20} />
              </button>
            </div>
            <div className="w-full max-w-4xl mt-12 grid grid-cols-2 md:grid-cols-4 gap-8">
              <p className="col-span-full text-xs font-black tracking-widest text-zinc-500 uppercase">Trending Searches</p>
              {['Stainless Steel', 'Custom Keychains', 'Logo Engraving', 'Gift Boxes'].map((term, i) => (
                <button key={i} className="text-left p-6 glass rounded-3xl hover:bg-white/10 transition-all group">
                  <p className="font-bold group-hover:text-white transition-colors">{term}</p>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
