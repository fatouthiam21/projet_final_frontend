'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Package, ChevronDown, ChevronUp } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CartDrawer from '@/components/layout/CartDrawer';
import { useAuth } from '@/context/AuthContext';
import { orderService } from '@/services/orderService';
import { Order } from '@/types';
import { formatPrice, formatDate, getStatusColor, getStatusLabel } from '@/lib/utils';

export default function OrdersPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) { router.push('/login?redirect=/orders'); return; }
    orderService.getMyOrders()
      .then((res) => setOrders(res.data.data as unknown as Order[]))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [isAuthenticated, router]);

  return (
    <>
      <Navbar />
      <main className="pt-24 pb-20">
        <div className="container-custom max-w-4xl">
          <h1 className="font-display text-3xl font-bold mb-8">Mes commandes</h1>

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => <div key={i} className="h-24 bg-muted animate-pulse rounded" />)}
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-20">
              <Package size={64} className="text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-xl mb-2">Aucune commande</p>
              <p className="text-muted-foreground mb-6">Vous n'avez pas encore passé de commande</p>
              <button onClick={() => router.push('/products')} className="btn-primary">Commencer mes achats</button>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <motion.div
                  key={order._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="border border-border bg-card"
                >
                  <div
                    className="flex items-center justify-between p-6 cursor-pointer"
                    onClick={() => setExpandedOrder(expandedOrder === order._id ? null : order._id)}
                  >
                    <div className="flex items-center gap-6">
                      <div>
                        <p className="font-semibold">#{order.orderNumber}</p>
                        <p className="text-sm text-muted-foreground">{formatDate(order.createdAt)}</p>
                      </div>
                      <div className="hidden md:block">
                        <p className="text-sm text-muted-foreground">{order.items.length} article(s)</p>
                        <p className="font-bold">{formatPrice(order.total)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`text-xs px-3 py-1 rounded-full font-medium ${getStatusColor(order.orderStatus)}`}>
                        {getStatusLabel(order.orderStatus)}
                      </span>
                      <span className={`text-xs px-3 py-1 rounded-full font-medium ${getStatusColor(order.paymentStatus)}`}>
                        {getStatusLabel(order.paymentStatus)}
                      </span>
                      {expandedOrder === order._id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </div>
                  </div>

                  {expandedOrder === order._id && (
                    <div className="border-t border-border p-6">
                      <div className="space-y-3 mb-6">
                        {order.items.map((item, i) => (
                          <div key={i} className="flex justify-between items-center text-sm">
                            <span className="text-muted-foreground">
                              {item.name} ({item.size}/{item.color}) × {item.quantity}
                            </span>
                            <span className="font-medium">{formatPrice(item.price * item.quantity)}</span>
                          </div>
                        ))}
                      </div>

                      {order.tracking && order.tracking.length > 0 && (
                        <div className="border-t border-border pt-4">
                          <h3 className="font-semibold text-sm mb-3">Suivi de commande</h3>
                          <div className="space-y-2">
                            {[...order.tracking].reverse().slice(0, 3).map((t, i) => (
                              <div key={i} className="flex items-start gap-3 text-sm">
                                <div className="w-2 h-2 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                                <div>
                                  <p className="font-medium">{getStatusLabel(t.status)}</p>
                                  <p className="text-xs text-muted-foreground">{t.message} — {formatDate(t.timestamp)}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="border-t border-border pt-4 mt-4 flex justify-between items-center">
                        <div className="text-sm text-muted-foreground">
                          <p>Livraison: {formatPrice(order.shippingCost)}</p>
                        </div>
                        <p className="font-bold text-lg">Total: {formatPrice(order.total)}</p>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
      <CartDrawer />
    </>
  );
}
