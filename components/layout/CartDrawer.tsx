'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store/store';
import { closeCart, updateCartItem, removeFromCart } from '@/store/cartSlice';
import { CartItem } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import { formatPrice } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function CartDrawer() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { isOpen, cart, loading } = useSelector((state: RootState) => state.cart);
  const { isAuthenticated } = useAuth();

  const handleUpdateQuantity = async (itemId: string, quantity: number) => {
    try {
      await dispatch(updateCartItem({ itemId, quantity })).unwrap();
    } catch (err: unknown) {
      toast.error((err as { message: string }).message || 'Erreur');
    }
  };

  const handleRemove = async (itemId: string) => {
    try {
      await dispatch(removeFromCart(itemId)).unwrap();
      toast.success('Article retiré');
    } catch {
      toast.error('Erreur lors de la suppression');
    }
  };

  const handleCheckout = () => {
    dispatch(closeCart());
    if (!isAuthenticated) {
      router.push('/login?redirect=/checkout');
    } else {
      router.push('/checkout');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => dispatch(closeCart())}
            className="fixed inset-0 bg-black/50 z-[200]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-background border-l border-border z-[201] flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div className="flex items-center gap-2">
                <ShoppingBag size={20} />
                <h2 className="font-display text-lg font-bold uppercase tracking-wider">
                  Mon Panier {cart?.totalItems ? `(${cart.totalItems})` : ''}
                </h2>
              </div>
              <button
                onClick={() => dispatch(closeCart())}
                className="p-2 hover:bg-muted rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-6">
              {!cart || cart.items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <ShoppingBag size={64} className="text-muted-foreground/30 mb-4" />
                  <p className="font-display text-xl mb-2">Votre panier est vide</p>
                  <p className="text-muted-foreground text-sm mb-6">Découvrez notre collection</p>
                  <Link
                    href="/products"
                    onClick={() => dispatch(closeCart())}
                    className="btn-primary"
                  >
                    Continuer mes achats
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.items.map((item: CartItem) => (
                    <motion.div
                      key={item._id}
                      layout
                      exit={{ opacity: 0, x: 50 }}
                      className="flex gap-4 py-4 border-b border-border last:border-0"
                    >
                      <div className="w-24 h-28 bg-muted flex-shrink-0 overflow-hidden">
                        {item.image && (
                          <Image
                            src={item.image}
                            alt={item.name}
                            width={96}
                            height={112}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-sm leading-tight mb-1 truncate">{item.name}</h3>
                        <p className="text-xs text-muted-foreground mb-2">
                          {item.size} / {item.color}
                        </p>
                        <p className="font-bold">{formatPrice(item.price)}</p>

                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center border border-border">
                            <button
                              onClick={() => handleUpdateQuantity(item._id, item.quantity - 1)}
                              disabled={loading || item.quantity <= 1}
                              className="p-1.5 hover:bg-muted transition-colors disabled:opacity-50"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="px-3 text-sm font-medium">{item.quantity}</span>
                            <button
                              onClick={() => handleUpdateQuantity(item._id, item.quantity + 1)}
                              disabled={loading}
                              className="p-1.5 hover:bg-muted transition-colors disabled:opacity-50"
                            >
                              <Plus size={14} />
                            </button>
                          </div>

                          <button
                            onClick={() => handleRemove(item._id)}
                            className="text-muted-foreground hover:text-destructive transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {cart && cart.items.length > 0 && (
              <div className="p-6 border-t border-border space-y-4 bg-muted/30">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Sous-total</span>
                    <span>{formatPrice(cart.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Livraison</span>
                    <span>{cart.subtotal >= 50000 ? 'Gratuite' : formatPrice(2500)}</span>
                  </div>
                  {cart.discount > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Réduction</span>
                      <span>-{formatPrice(cart.discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-lg border-t border-border pt-2">
                    <span>Total</span>
                    <span>{formatPrice(cart.total + (cart.subtotal >= 50000 ? 0 : 2500))}</span>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full btn-primary flex items-center justify-center gap-2"
                >
                  Commander <ArrowRight size={18} />
                </button>

                <Link
                  href="/products"
                  onClick={() => dispatch(closeCart())}
                  className="block text-center text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Continuer mes achats
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
