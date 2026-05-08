'use client';

import Link from 'next/link';
import { Home, ShoppingBag, Search, MessageSquare, Menu } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function MobileNav() {
  const pathname = usePathname();

  const navItems = [
    { icon: <Home size={20} />, label: 'Home', href: '/' },
    { icon: <ShoppingBag size={20} />, label: 'Shop', href: '/shop' },
    { icon: <Search size={20} />, label: 'Search', href: '/search' },
    { icon: <MessageSquare size={20} />, label: 'Chat', href: 'https://wa.me/96181388115' },
    { icon: <Menu size={20} />, label: 'More', href: '/menu' },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 px-4 pb-4">
      <div className="glass-dark rounded-[2rem] flex justify-between items-center px-6 py-3 border border-white/10 shadow-2xl">
        {navItems.map((item, i) => {
          const isActive = pathname === item.href;
          return (
            <Link 
              key={i} 
              href={item.href}
              className={`flex flex-col items-center gap-1 transition-all ${
                isActive ? 'text-white' : 'text-zinc-500 hover:text-white'
              }`}
            >
              <div className={`p-2 rounded-xl transition-all ${isActive ? 'bg-white/10' : ''}`}>
                {item.icon}
              </div>
              <span className="text-[10px] font-bold uppercase tracking-tighter">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
