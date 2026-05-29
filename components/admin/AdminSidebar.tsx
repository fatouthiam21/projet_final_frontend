'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard, ShoppingBag, Tag, ClipboardList, Users,
  Settings, LogOut, Package
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const navItems = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Produits', href: '/admin/products', icon: Package },
  { label: 'Catégories', href: '/admin/categories', icon: Tag },
  { label: 'Commandes', href: '/admin/orders', icon: ClipboardList },
  { label: 'Utilisateurs', href: '/admin/users', icon: Users },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <aside className="w-64 bg-premium-dark text-white flex flex-col min-h-screen sticky top-0 h-screen flex-shrink-0">
      <div className="p-6 border-b border-white/10">
        <Link href="/" className="font-display text-xl font-bold">
          URBAN <span className="font-light tracking-widest">STYLE</span>
        </Link>
        <p className="text-xs text-white/40 mt-1 uppercase tracking-widest">Admin</p>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-white/10 text-white'
                  : 'text-white/60 hover:bg-white/5 hover:text-white'
              }`}
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/10 space-y-1">
        <Link
          href="/"
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-white/60 hover:bg-white/5 hover:text-white transition-colors"
        >
          <ShoppingBag size={18} /> Voir la boutique
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-white/60 hover:bg-white/5 hover:text-red-400 transition-colors w-full text-left"
        >
          <LogOut size={18} /> Déconnexion
        </button>
      </div>
    </aside>
  );
}
