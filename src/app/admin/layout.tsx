'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Zap, ShieldCheck, ChevronRight } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  useEffect(() => {
    const auth = localStorage.getItem('admin_auth');
    if (auth === 'true') setIsAuthenticated(true);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple secure check - User can change this password later
    if (password === 'laseradmin2026') {
      localStorage.setItem('admin_auth', 'true');
      setIsAuthenticated(true);
      setError(false);
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md p-12 glass rounded-[3rem] border border-white/5 text-center relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          
          <div className="w-20 h-20 bg-white/5 rounded-[2rem] flex items-center justify-center mx-auto mb-8 text-zinc-700">
            <Lock size={32} />
          </div>
          
          <h1 className="text-3xl font-black tracking-tighter uppercase italic mb-2">Command Gate</h1>
          <p className="text-zinc-600 text-xs font-bold uppercase tracking-widest mb-10">Authorized Personnel Only</p>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <input 
              type="password" 
              placeholder="Enter Access Key"
              className={`w-full bg-zinc-950 border ${error ? 'border-rose-500' : 'border-white/10'} rounded-2xl px-6 py-4 text-center text-lg font-bold tracking-widest focus:border-white outline-none transition-all`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button 
              type="submit"
              className="w-full py-4 bg-white text-black font-black rounded-2xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-[10px]"
            >
              INITIALIZE SESSION <ChevronRight size={16} />
            </button>
          </form>

          {error && (
            <p className="text-rose-500 text-[10px] font-black uppercase tracking-widest mt-6">Access Denied</p>
          )}

          <div className="mt-12 pt-8 border-t border-white/5 flex items-center justify-center gap-4 text-zinc-800">
             <Zap size={14} />
             <ShieldCheck size={14} />
             <span className="text-[8px] font-black uppercase tracking-[0.2em]">LaserCraft Encryption Active</span>
          </div>
        </motion.div>
      </div>
    );
  }

  return <>{children}</>;
}
