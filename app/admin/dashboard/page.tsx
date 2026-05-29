'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  ShoppingBag, TrendingUp, Users, Package,
  ArrowUp, ArrowDown, MoreHorizontal, Eye
} from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import api from '@/services/api';
import { DashboardStats, Order } from '@/types';
import { formatPrice, formatDate, getStatusColor, getStatusLabel } from '@/lib/utils';
import AdminSidebar from '@/components/admin/AdminSidebar';

export default function AdminDashboardPage() {
  const { isAuthenticated, isAdmin } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated || !isAdmin) {
      router.push('/login');
      return;
    }
    api.get('/dashboard/stats')
      .then((res) => setStats(res.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [isAuthenticated, isAdmin, router]);

  const statCards = stats ? [
    { title: 'Commandes totales', value: stats.orders.total, thisMonth: stats.orders.thisMonth, growth: stats.orders.growth, icon: ShoppingBag, color: 'bg-blue-500' },
    { title: 'Revenus totaux', value: formatPrice(stats.revenue.total), thisMonth: formatPrice(stats.revenue.thisMonth), growth: stats.revenue.growth, icon: TrendingUp, color: 'bg-green-500' },
    { title: 'Clients', value: stats.users.total, thisMonth: `+${stats.users.thisMonth}`, icon: Users, color: 'bg-purple-500' },
    { title: 'Produits actifs', value: stats.products.total, thisMonth: `${stats.products.lowStock.length} stock faible`, icon: Package, color: 'bg-orange-500' },
  ] : [];

  return (
    <div className="flex min-h-screen bg-muted/30">
      <AdminSidebar />
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="font-display text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground mt-1">Vue d'ensemble de votre boutique</p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-32 bg-card border border-border animate-pulse rounded" />
              ))}
            </div>
          ) : (
            <>
              {/* Stat cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {statCards.map((card, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-card border border-border p-6 rounded-lg"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-10 h-10 ${card.color} rounded-lg flex items-center justify-center text-white`}>
                        <card.icon size={20} />
                      </div>
                      {card.growth !== undefined && (
                        <span className={`flex items-center gap-1 text-xs font-medium ${card.growth >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                          {card.growth >= 0 ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
                          {Math.abs(card.growth)}%
                        </span>
                      )}
                    </div>
                    <p className="text-2xl font-bold mb-1">{card.value}</p>
                    <p className="text-xs text-muted-foreground">{card.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">Ce mois: {card.thisMonth}</p>
                  </motion.div>
                ))}
              </div>

              {/* Recent orders */}
              <div className="bg-card border border-border rounded-lg">
                <div className="flex items-center justify-between p-6 border-b border-border">
                  <h2 className="font-semibold">Commandes récentes</h2>
                  <Link href="/admin/orders" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    Voir tout
                  </Link>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted/50">
                      <tr>
                        {['Commande', 'Client', 'Montant', 'Statut', 'Date', 'Actions'].map((h) => (
                          <th key={h} className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {stats?.recentOrders.map((order: Order) => (
                        <tr key={order._id} className="hover:bg-muted/30 transition-colors">
                          <td className="px-6 py-4 text-sm font-medium">#{order.orderNumber}</td>
                          <td className="px-6 py-4 text-sm text-muted-foreground">
                            {typeof order.user === 'object' && order.user !== null ? `${order.user.firstName} ${order.user.lastName}` : (order.user as string) || 'Client supprimé'}
                          </td>
                          <td className="px-6 py-4 text-sm font-bold">{formatPrice(order.total)}</td>
                          <td className="px-6 py-4">
                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(order.orderStatus)}`}>
                              {getStatusLabel(order.orderStatus)}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-muted-foreground">{formatDate(order.createdAt)}</td>
                          <td className="px-6 py-4">
                            <Link href={`/admin/orders?id=${order._id}`} className="p-1.5 hover:bg-muted rounded transition-colors inline-flex">
                              <Eye size={16} />
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
