'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, User, Search, Menu, X, Sun, Moon, Heart, LogOut, LayoutDashboard } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store/store';
import { toggleCart } from '@/store/cartSlice';
import { useAuth } from '@/context/AuthContext';
import { productService } from '@/services/productService';
import { Product } from '@/types';
import Image from 'next/image';
import { formatPrice } from '@/lib/utils';

const navLinks = [
  { label: 'Nouveautés', href: '/products?sort=newest' },
  { label: 'Jeans', href: '/products?category=jeans' },
  { label: 'Cargos', href: '/products?category=cargos' },
  { label: 'T-Shirts', href: '/products?category=t-shirts' },
  { label: 'Chemises', href: '/products?category=chemises' },
  { label: 'Sneakers', href: '/products?category=sneakers' },
  { label: 'Chaussures', href: '/products?category=chaussures' },
  { label: 'Soldes', href: '/products?sort=price-asc&onSale=true' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const { theme, setTheme } = useTheme();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const dispatch = useDispatch<AppDispatch>();
  const cartTotalItems = useSelector((state: RootState) => state.cart.cart?.totalItems || 0);
  const router = useRouter();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (searchQuery.length >= 2) {
        try {
          const res = await productService.search(searchQuery, 5);
          setSearchResults(res.data.data.products);
        } catch {}
      } else {
        setSearchResults([]);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-background/95 backdrop-blur-md shadow-sm border-b border-border' : 'bg-transparent'
        }`}
      >
        <div className="container-custom">
          {/* Top bar */}
          <div className="hidden md:flex items-center justify-between py-2 text-xs text-muted-foreground border-b border-border/50">
            <span>Livraison gratuite dès 50 000 XOF</span>
            <span>+221 77 000 00 00 | contact@urbanstyle.sn</span>
          </div>

          {/* Main navbar */}
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0">
              <motion.div whileHover={{ scale: 1.02 }} className="flex items-center">
                <span className="font-display text-2xl font-bold tracking-tight">URBAN</span>
                <span className="font-display text-2xl font-light tracking-widest ml-1">STYLE</span>
              </motion.div>
            </Link>

            {/* Desktop nav links */}
            <div className="hidden lg:flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium tracking-wide hover:text-primary/70 transition-colors duration-200 uppercase"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-4">
              {/* Search */}
              <button onClick={() => setSearchOpen(true)} className="p-2 hover:text-primary/70 transition-colors">
                <Search size={20} />
              </button>

              {/* Theme toggle */}
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-2 hover:text-primary/70 transition-colors hidden md:flex"
              >
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              </button>

              {/* Wishlist */}
              {isAuthenticated && (
                <Link href="/profile?tab=wishlist" className="p-2 hover:text-primary/70 transition-colors hidden md:flex">
                  <Heart size={20} />
                </Link>
              )}

              {/* User */}
              <div className="relative">
                <button
                  onClick={() => isAuthenticated ? setUserMenuOpen(!userMenuOpen) : router.push('/login')}
                  className="p-2 hover:text-primary/70 transition-colors"
                >
                  <User size={20} />
                </button>

                <AnimatePresence>
                  {userMenuOpen && isAuthenticated && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 top-full mt-2 w-52 bg-card border border-border shadow-xl z-50"
                    >
                      <div className="p-3 border-b border-border">
                        <p className="font-semibold text-sm">{user?.firstName} {user?.lastName}</p>
                        <p className="text-xs text-muted-foreground">{user?.email}</p>
                      </div>
                      <div className="p-2">
                        {isAdmin && (
                          <Link
                            href="/admin/dashboard"
                            className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted rounded transition-colors"
                            onClick={() => setUserMenuOpen(false)}
                          >
                            <LayoutDashboard size={16} /> Dashboard Admin
                          </Link>
                        )}
                        <Link
                          href="/profile"
                          className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted rounded transition-colors"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <User size={16} /> Mon profil
                        </Link>
                        <Link
                          href="/orders"
                          className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted rounded transition-colors"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <ShoppingBag size={16} /> Mes commandes
                        </Link>
                        <button
                          onClick={() => { logout(); setUserMenuOpen(false); router.push('/'); }}
                          className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted rounded transition-colors w-full text-left text-destructive"
                        >
                          <LogOut size={16} /> Déconnexion
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Cart */}
              <button
                onClick={() => dispatch(toggleCart())}
                className="relative p-2 hover:text-primary/70 transition-colors"
              >
                <ShoppingBag size={20} />
                {cartTotalItems > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold"
                  >
                    {cartTotalItems > 9 ? '9+' : cartTotalItems}
                  </motion.span>
                )}
              </button>

              {/* Mobile menu */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden p-2 hover:text-primary/70 transition-colors"
              >
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="lg:hidden bg-background border-t border-border overflow-hidden"
            >
              <div className="container-custom py-4 space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="block px-4 py-3 text-sm font-medium uppercase tracking-wide hover:bg-muted rounded transition-colors"
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Search Overlay */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-sm"
          >
            <div className="container-custom pt-24">
              <div className="flex items-center gap-4 border-b-2 border-primary pb-2">
                <Search size={24} className="text-muted-foreground flex-shrink-0" />
                <input
                  autoFocus
                  type="text"
                  placeholder="Rechercher un produit..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 text-xl bg-transparent outline-none placeholder:text-muted-foreground"
                />
                <button onClick={() => { setSearchOpen(false); setSearchQuery(''); setSearchResults([]); }}>
                  <X size={24} />
                </button>
              </div>

              {searchResults.length > 0 && (
                <div className="mt-6 space-y-2">
                  {searchResults.map((product) => (
                    <Link
                      key={product._id}
                      href={`/product/${product.slug}`}
                      onClick={() => { setSearchOpen(false); setSearchQuery(''); setSearchResults([]); }}
                      className="flex items-center gap-4 p-3 hover:bg-muted rounded-lg transition-colors"
                    >
                      <div className="w-16 h-16 bg-muted flex-shrink-0 overflow-hidden">
                        {product.images[0] && (
                          <Image src={product.images[0].url} alt={product.name} width={64} height={64} className="w-full h-full object-cover" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-muted-foreground">{formatPrice(product.price)}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {searchQuery.length >= 2 && searchResults.length === 0 && (
                <p className="mt-8 text-center text-muted-foreground">Aucun résultat pour "{searchQuery}"</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
