'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Zap, Eye, EyeOff, ShieldAlert } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import toast from 'react-hot-toast';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [locked, setLocked] = useState(false);
  const [lockTimer, setLockTimer] = useState(0);
  const timerRef = useRef<any>(null);

  useEffect(() => {
    checkSession();
  }, []);

  async function checkSession() {
    const auth = localStorage.getItem('admin_session');
    if (auth === 'active') {
      // Also verify with supabase if possible, but for now local is enough for UI
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }

  const startLockout = () => {
    let seconds = 30;
    setLocked(true);
    setLockTimer(seconds);
    timerRef.current = setInterval(() => {
      seconds--;
      setLockTimer(seconds);
      if (seconds <= 0) {
        clearInterval(timerRef.current);
        setLocked(false);
        setAttempts(0);
        setError('');
      }
    }, 1000);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (locked || loading) return;

    setLoading(true);
    setError('');

    try {
      // 1. Check Master Access Key (Matching APK/EXE logic)
      if (password === '123456' || password === 'laseradmin2026') {
          // Check if device is approved
          const isDeviceApproved = localStorage.getItem('admin_device_approved');
          
          if (isDeviceApproved === 'true') {
              localStorage.setItem('admin_session', 'active');
              setIsAuthenticated(true);
          } else {
              // Trigger Master Key Approval
              const masterKey = window.prompt("DEVICE NOT RECOGNIZED\nEnter Master Approval Key to authorize this device:");
              if (masterKey === 'LASER-ADMIN-PRO') {
                  localStorage.setItem('admin_device_approved', 'true');
                  localStorage.setItem('admin_session', 'active');
                  setIsAuthenticated(true);
                  toast.success("Device Authorized");
              } else {
                  setError("UNAUTHORIZED DEVICE");
                  startLockout();
              }
          }
          return;
      }

      // 2. Fallback to Supabase Auth if they want to use an email
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: 'info@lasercraftlb.com', // Using the email found in layout
        password: password
      });

      if (authError) {
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);
        if (newAttempts >= 3) {
          setError('TOO MANY ATTEMPTS. SYSTEM LOCKED.');
          startLockout();
        } else {
          setError(`INVALID KEY. ${3 - newAttempts} ATTEMPTS REMAINING.`);
        }
        return;
      }

      localStorage.setItem('admin_session', 'active');
      localStorage.setItem('admin_device_approved', 'true'); // Email login auto-approves device
      setIsAuthenticated(true);
    } catch (err) {
      setError('ENCRYPTION ERROR. RETRY LATER.');
    } finally {
      setLoading(false);
    }
  };

  if (isAuthenticated === null) {
    return <div className="min-h-screen bg-black" />;
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#030303] flex items-center justify-center p-6 font-sans">
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
           <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-red-500/10 rounded-full blur-[120px]" />
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-[380px] bg-[#0a0a0a] border border-white/5 rounded-[2.5rem] p-10 text-center relative z-10 shadow-2xl"
        >
          <div className="flex justify-center mb-8">
             <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center justify-center text-red-500 shadow-[0_0_30px_rgba(239,68,68,0.1)]">
                <Zap size={32} strokeWidth={2.5} fill="currentColor" />
             </div>
          </div>

          <h1 className="text-3xl font-black tracking-tighter uppercase mb-1 italic">LASERART LB</h1>
          <p className="text-zinc-500 text-[10px] font-black tracking-[0.2em] uppercase mb-8">Admin Command Center</p>

          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-zinc-900/50 border border-white/5 rounded-full text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-10">
             <Lock size={12} />
             RESTRICTED ACCESS ONLY
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
             <div className="relative group">
                <input 
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter Access Key"
                  className={`w-full bg-black border ${error ? 'border-red-500' : 'border-white/10 group-hover:border-white/20'} rounded-2xl px-6 py-4 text-center text-lg font-bold tracking-[0.3em] focus:border-white outline-none transition-all placeholder:tracking-normal placeholder:text-zinc-700 placeholder:text-sm`}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(''); }}
                  disabled={locked}
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
             </div>

             {error && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center justify-center gap-2 text-red-500 text-[10px] font-black uppercase tracking-widest py-2"
                >
                   <ShieldAlert size={14} />
                   {error}
                </motion.div>
             )}

             {locked && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl py-3 text-red-500 text-[10px] font-black uppercase tracking-widest">
                   LOCKOUT ACTIVE: RETRY IN {lockTimer}S
                </div>
             )}

             <button 
               type="submit"
               disabled={locked || loading || !password}
               className="w-full py-4 bg-white text-black font-black rounded-2xl hover:scale-[1.02] active:scale-95 disabled:opacity-30 disabled:scale-100 transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-[11px] shadow-[0_10px_30px_rgba(255,255,255,0.1)]"
             >
               {loading ? (
                 <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
               ) : (
                 <>UNLOCK DASHBOARD <Zap size={16} fill="currentColor" /></>
               )}
             </button>
          </form>

          <p className="mt-10 text-[9px] font-bold text-zinc-700 uppercase tracking-widest">
             Version 2.2.0 PRO · Secured by LaserCraft
          </p>
        </motion.div>
      </div>
    );
  }

  return <>{children}</>;
}
