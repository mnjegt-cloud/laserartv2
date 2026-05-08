'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, ShoppingBag, ArrowRight, Search, ChevronDown, SlidersHorizontal, Grid3X3, List, RefreshCcw } from 'lucide-react';
import FadeIn from '@/components/FadeIn';

import { supabase } from '@/lib/supabase';

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  description: string;
  image?: string;
  trending?: boolean;
}

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [sortBy, setSortBy] = useState('Featured');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function fetchProducts() {
      const { data, error } = await supabase
        .from('products')
        .select('*');
      
      if (!error && data) {
        setProducts(data);
      }
      setLoading(false);
    }
    fetchProducts();
  }, []);
  
  const categories = ['All', 'Keychains', 'Souvenirs', 'Home Decor'];

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesCategory = activeCategory === 'All' || p.category.toLowerCase() === activeCategory.toLowerCase();
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            (p.description || '').toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    }).sort((a, b) => {
      if (sortBy === 'Price: Low to High') return a.price - b.price;
      if (sortBy === 'Price: High to Low') return b.price - a.price;
      return 0;
    });
  }, [products, activeCategory, searchQuery, sortBy]);

  return (
    <div className="min-h-screen bg-black pt-40 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-40">
            <RefreshCcw size={48} className="text-zinc-800 animate-spin mb-8" />
            <p className="text-[10px] font-black tracking-[0.3em] uppercase text-zinc-600">Initializing Catalog...</p>
          </div>
        ) : (
          <>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-12">
          <div>
            <FadeIn direction="none">
              <span className="text-[10px] font-black tracking-[0.3em] uppercase text-zinc-600 mb-4 block">Storefront</span>
              <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase italic">The Catalog</h1>
            </FadeIn>
          </div>
          
          <FadeIn delay={0.2} direction="none">
            <div className="flex flex-wrap gap-4 items-center">
              <div className="relative group">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-white transition-colors" />
                <input 
                  type="text" 
                  placeholder="Search catalog..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-zinc-950/50 border border-white/5 rounded-2xl pl-12 pr-6 py-4 text-sm font-medium focus:outline-none focus:border-white/20 transition-all w-full md:w-64"
                />
              </div>
              <div className="flex bg-zinc-950/50 p-1.5 rounded-2xl border border-white/5">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-6 py-2.5 rounded-xl text-[10px] font-black tracking-widest uppercase transition-all ${
                      activeCategory === cat 
                      ? 'bg-white text-black shadow-lg' 
                      : 'text-zinc-500 hover:text-white'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>

        {/* Toolbar */}
        <FadeIn delay={0.3} direction="none">
          <div className="flex flex-col sm:flex-row justify-between items-center py-6 border-y border-white/5 mb-16 gap-6">
            <div className="flex items-center gap-6 text-xs font-bold text-zinc-500">
              <p>SHOWING <span className="text-white">{filteredProducts.length}</span> RESULTS</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-zinc-500">
                <SlidersHorizontal size={14} />
                <span className="text-[10px] font-black tracking-widest uppercase">Sort By:</span>
              </div>
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent text-white text-[10px] font-black tracking-widest uppercase focus:outline-none cursor-pointer"
              >
                <option>Featured</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Newest</option>
              </select>
            </div>
          </div>
        </FadeIn>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16">
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((product, i) => (
              <motion.div 
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                key={product.id} 
                className="group relative"
              >
                <Link href={`/shop/${product.id}`} className="block">
                  <div className="aspect-[4/5] bg-zinc-950 rounded-[2.5rem] overflow-hidden mb-8 relative border border-white/5 group-hover:border-white/20 transition-all duration-700 shadow-2xl">
                    {/* Background Glow */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(39,39,42,1)_0%,rgba(9,9,11,1)_100%)] opacity-50" />
                    
                    {/* Product Mockup Visualization */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center pointer-events-none">
                      <div className="w-full aspect-[2/3] border border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center gap-4 group-hover:scale-105 transition-transform duration-700">
                        <ShoppingBag size={40} className="text-zinc-800 opacity-20" />
                        <span className="text-zinc-800 font-black text-2xl uppercase tracking-tighter opacity-10">
                          {product.name.split(':')[0]}
                        </span>
                      </div>
                    </div>

                    {/* Tags Overlay */}
                    <div className="absolute top-6 left-6 flex flex-col gap-2">
                      <span className="glass-dark px-4 py-1.5 rounded-full text-[9px] font-black tracking-[0.2em] uppercase border border-white/10">
                        {product.category}
                      </span>
                      {product.trending && (
                        <span className="bg-white text-black px-4 py-1.5 rounded-full text-[9px] font-black tracking-[0.2em] uppercase shadow-xl">
                          Trending
                        </span>
                      )}
                    </div>

                    {/* Quick Add Button */}
                    <div className="absolute bottom-8 right-8 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                      <div className="w-14 h-14 bg-white text-black rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform">
                        <ShoppingBag size={20} />
                      </div>
                    </div>
                  </div>
                  
                  <div className="px-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-black tracking-tight group-hover:text-zinc-400 transition-colors">{product.name}</h3>
                      <p className="text-xl font-black">${product.price}</p>
                    </div>
                    <p className="text-zinc-500 text-xs leading-relaxed line-clamp-2 font-medium">{product.description}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <div className="py-40 text-center">
            <FadeIn>
              <h3 className="text-4xl font-black tracking-tighter text-zinc-800 mb-4">NO PRODUCTS FOUND</h3>
              <p className="text-zinc-500 mb-8">Try adjusting your filters or search terms.</p>
              <button 
                onClick={() => {setActiveCategory('All'); setSearchQuery('');}}
                className="btn-outline"
              >
                RESET FILTERS
              </button>
            </FadeIn>
          </div>
        )}
          </>
        )}
      </div>
    </div>
  );
}


