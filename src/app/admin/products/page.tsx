'use client';

import { useState, useEffect } from 'react';
import { 
  Plus, Search, ArrowLeft, Filter, 
  MoreVertical, Zap, Layers, AlertCircle,
  RefreshCcw, X, Save, Box, Upload
} from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import FadeIn from '@/components/FadeIn';
import { supabase } from '@/lib/supabase';
import toast from 'react-hot-toast';

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  description?: string;
  image?: string;
  images?: string[];
  is_best_seller?: boolean;
  has_double_sided?: boolean;
  has_gift_box?: boolean;
  handle?: string;
  created_at: string;
}

export default function ProductManagement() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    setIsRefreshing(true);
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast.error('Failed to fetch inventory');
    } else {
      setProducts(data || []);
    }
    setIsRefreshing(false);
    setLoading(false);
  }

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = editingProduct;

    try {
      if (payload.id && !products.find(p => p.id === payload.id)) {
          // If it has an ID but doesn't exist in our state, it might be an import or a manual entry with ID
      }

      const productData = {
        name: payload.name,
        price: payload.price,
        stock: payload.stock,
        category: payload.category,
        description: payload.description || '',
        image: payload.image || '',
        images: payload.images || [],
        is_best_seller: payload.is_best_seller || false,
        has_double_sided: payload.has_double_sided || false,
        has_gift_box: payload.has_gift_box || false,
        handle: payload.handle || payload.name.toLowerCase().replace(/ /g, '-')
      };

      if (payload.id && products.find(p => p.id === payload.id)) {
        // Update
        const { error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', payload.id);
        if (error) throw error;
        toast.success('Asset Updated');
      } else {
        // Create
        const { error } = await supabase
          .from('products')
          .insert([productData]);
        if (error) throw error;
        toast.success('New Asset Initialized');
      }
      setIsModalOpen(false);
      fetchProducts();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleBulkImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const content = event.target?.result as string;
        let data: any[] = [];
        
        if (file.name.endsWith('.json')) {
          data = JSON.parse(content);
        } else if (file.name.endsWith('.csv')) {
          // Simple CSV parse (could be improved)
          const lines = content.split('\n');
          const headers = lines[0].split(',');
          data = lines.slice(1).filter(line => line.trim()).map(line => {
            const values = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/); // Split by comma outside quotes
            const obj: any = {};
            headers.forEach((header, i) => {
              let val: any = values[i]?.replace(/^"|"$/g, '');
              if (header === 'price' || header === 'stock' || header === 'original_price') val = Number(val);
              if (header === 'is_best_seller' || header === 'has_double_sided' || header === 'has_gift_box') val = val === 'true';
              if (header === 'images') {
                try { val = JSON.parse(val || '[]'); } catch { val = []; }
              }
              obj[header.trim()] = val;
            });
            return obj;
          });
        }

        if (data.length > 0) {
          const confirmImport = confirm(`Import ${data.length} products? This will update existing ones and add new ones.`);
          if (!confirmImport) return;

          setLoading(true);
          
          // Process in batches
          for (let i = 0; i < data.length; i += 50) {
            const batch = data.slice(i, i + 50).map(item => ({
              ...item,
              updated_at: new Date().toISOString()
            }));
            
            const { error } = await supabase
              .from('products')
              .upsert(batch, { onConflict: 'id' });
            
            if (error) throw error;
          }

          toast.success(`Successfully imported ${data.length} products`);
          fetchProducts();
        }
      } catch (err: any) {
        console.error(err);
        toast.error('Import failed: ' + err.message);
      } finally {
        setLoading(false);
      }
    };
    reader.readAsText(file);
  };

  const deleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to archive this asset?')) return;
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error('Failed to archive asset');
    } else {
      toast.success('Asset Archived');
      fetchProducts();
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <RefreshCcw className="animate-spin text-zinc-500" size={32} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pt-32 pb-20 px-6 lg:px-12">
      <div className="max-w-[1400px] mx-auto">
        <FadeIn direction="none">
          <Link href="/admin" className="group inline-flex items-center gap-2 text-zinc-600 hover:text-white mb-12 transition-colors uppercase font-black text-[10px] tracking-[0.2em]">
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back to Command Center
          </Link>
        </FadeIn>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-12 mb-20">
          <div>
            <FadeIn direction="none">
              <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase italic leading-none mb-6">Inventory</h1>
              <p className="text-zinc-500 font-bold uppercase tracking-[0.3em] text-xs">Direct Database Interface</p>
            </FadeIn>
          </div>
          <FadeIn delay={0.2} direction="none" className="flex flex-wrap gap-4">
            <label className="p-6 glass rounded-2xl border border-white/5 text-zinc-500 hover:text-white transition-all cursor-pointer flex items-center gap-3">
              <Upload size={24} />
              <span className="text-[10px] font-black uppercase tracking-widest">Bulk Import</span>
              <input type="file" accept=".json,.csv" onChange={handleBulkImport} className="hidden" />
            </label>
            <button onClick={fetchProducts} className="p-6 glass rounded-2xl border border-white/5 text-zinc-500 hover:text-white transition-all">
              <RefreshCcw size={24} className={isRefreshing ? 'animate-spin text-emerald-500' : ''} />
            </button>
            <button 
              onClick={() => {
                setEditingProduct({ name: '', price: 0, stock: 0, category: 'Keychains', description: '', image: '', is_best_seller: false });
                setIsModalOpen(true);
              }}
              className="px-10 py-6 bg-white text-black font-black rounded-2xl flex items-center gap-3 hover:scale-[1.02] active:scale-95 transition-all shadow-xl"
            >
              <Plus size={20} /> INITIALIZE PRODUCT
            </button>
          </FadeIn>
        </div>

        {/* Filter Bar */}
        <div className="p-4 glass rounded-3xl border border-white/5 mb-12 flex flex-col md:flex-row gap-4">
           <div className="relative flex-1">
              <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-700" />
              <input 
                type="text" 
                placeholder="Filter by name, SKU, or category..."
                className="w-full bg-zinc-950/50 border border-white/5 rounded-2xl pl-14 pr-6 py-4 text-sm focus:border-white/20 outline-none transition-all placeholder:text-zinc-800"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
           </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <AnimatePresence>
            {filteredProducts.map((product, i) => (
              <motion.div 
                key={product.id} 
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <div className="p-10 glass rounded-[3rem] border border-white/5 group hover:border-white/10 transition-all">
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-8">
                    <div className="flex items-center gap-8 flex-1">
                      <div className="w-24 h-24 bg-zinc-950 rounded-[2rem] border border-white/5 flex items-center justify-center text-zinc-800 group-hover:text-white transition-colors">
                        <Zap size={32} />
                      </div>
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <span className="px-3 py-1 bg-white/5 text-zinc-600 rounded-full text-[8px] font-black uppercase tracking-widest">#{product.id.slice(0, 8)}</span>
                          <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">{product.category}</span>
                        </div>
                        <h3 className="text-2xl font-black tracking-tight uppercase group-hover:premium-gradient transition-all">{product.name}</h3>
                      </div>
                    </div>
                    <div className="text-right">
                       <p className="text-[10px] font-black tracking-widest text-zinc-600 uppercase mb-1">Base Value</p>
                       <p className="text-3xl font-black tracking-tighter">${product.price}.00</p>
                    </div>
                  </div>

                  <div className="mt-10 pt-10 border-t border-white/5 flex flex-wrap justify-between items-center gap-6">
                    <div>
                      <p className="text-[10px] font-black tracking-widest text-zinc-600 uppercase mb-2">Stock Level</p>
                      <div className="flex items-center gap-3">
                        <div className="w-24 h-1.5 bg-white/5 rounded-full overflow-hidden">
                            <motion.div 
                              animate={{ width: `${Math.min((product.stock / 50) * 100, 100)}%` }}
                              className={`h-full ${product.stock < 10 ? 'bg-rose-500' : 'bg-white'}`} 
                            />
                        </div>
                        <span className={`text-xs font-black ${product.stock < 10 ? 'text-rose-500' : 'text-zinc-400'}`}>
                            {product.stock} Units
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-3">
                        <button onClick={() => { setEditingProduct(product); setIsModalOpen(true); }} className="px-6 py-3 glass rounded-xl border border-white/5 text-[10px] font-black uppercase tracking-widest hover:bg-white/5 transition-all">Edit</button>
                        <button onClick={() => deleteProduct(product.id)} className="px-6 py-3 bg-rose-500/10 text-rose-500 rounded-xl border border-rose-500/10 text-[10px] font-black uppercase tracking-widest hover:bg-rose-500/20 transition-all">Archive</button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-black/90 backdrop-blur-xl" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="w-full max-w-2xl bg-zinc-950 border border-white/10 rounded-[3rem] p-12 relative overflow-hidden">
              <h2 className="text-4xl font-black tracking-tighter uppercase italic mb-10">{editingProduct?.id ? 'Edit Asset' : 'New Asset'}</h2>
              <form onSubmit={handleSaveProduct} className="space-y-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black tracking-widest uppercase text-zinc-600">Product Name</label>
                  <input required className="w-full bg-black border border-white/5 rounded-2xl px-6 py-4 text-lg font-bold focus:border-white outline-none" value={editingProduct?.name} onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})} />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black tracking-widest uppercase text-zinc-600">Description</label>
                  <textarea className="w-full bg-black border border-white/5 rounded-2xl px-6 py-4 text-sm font-medium focus:border-white outline-none min-h-[100px]" value={editingProduct?.description} onChange={(e) => setEditingProduct({...editingProduct, description: e.target.value})} />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black tracking-widest uppercase text-zinc-600">Category</label>
                    <select className="w-full bg-black border border-white/5 rounded-2xl px-6 py-4 text-lg font-bold focus:border-white outline-none appearance-none" value={editingProduct?.category} onChange={(e) => setEditingProduct({...editingProduct, category: e.target.value})}>
                      <option value="keychain">Keychain</option>
                      <option value="home-decor">Home Decor</option>
                      <option value="souvenir">Souvenir</option>
                    </select>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black tracking-widest uppercase text-zinc-600">Price ($)</label>
                    <input required type="number" className="w-full bg-black border border-white/5 rounded-2xl px-6 py-4 text-lg font-bold focus:border-white outline-none" value={editingProduct?.price} onChange={(e) => setEditingProduct({...editingProduct, price: Number(e.target.value)})} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black tracking-widest uppercase text-zinc-600">Stock</label>
                    <input required type="number" className="w-full bg-black border border-white/5 rounded-2xl px-6 py-4 text-lg font-bold focus:border-white outline-none" value={editingProduct?.stock} onChange={(e) => setEditingProduct({...editingProduct, stock: Number(e.target.value)})} />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black tracking-widest uppercase text-zinc-600">Image URL</label>
                    <input className="w-full bg-black border border-white/5 rounded-2xl px-6 py-4 text-lg font-bold focus:border-white outline-none" value={editingProduct?.image} onChange={(e) => setEditingProduct({...editingProduct, image: e.target.value})} />
                  </div>
                </div>
                <div className="flex gap-6">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" checked={editingProduct?.is_best_seller} onChange={(e) => setEditingProduct({...editingProduct, is_best_seller: e.target.checked})} className="w-5 h-5 rounded bg-black border-white/10" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Best Seller</span>
                  </label>
                </div>
                <button type="submit" className="w-full py-6 bg-white text-black font-black text-xl rounded-2xl flex items-center justify-center gap-3">
                  <Save size={20} /> {editingProduct?.id ? 'SAVE CHANGES' : 'CREATE ASSET'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
