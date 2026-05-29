'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Search, ChevronDown } from 'lucide-react';
import { useRouter } from 'next/navigation';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { useAuth } from '@/context/AuthContext';
import { orderService } from '@/services/orderService';
import { Order } from '@/types';
import { formatPrice, formatDate, getStatusColor, getStatusLabel } from '@/lib/utils';
import toast from 'react-hot-toast';
import api from '@/services/api';

const STATUS_OPTIONS = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];

export default function AdminOrdersPage() {
  const { isAuthenticated, isAdmin } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const res = await orderService.getAllOrders({ search, status: statusFilter, page, limit: 20 });
      setOrders(res.data.data as unknown as Order[]);
      setTotalPages(res.data.pagination?.pages || 1);
    } catch {}
    setLoading(false);
  }, [search, statusFilter, page]);

  useEffect(() => {
    if (!isAuthenticated || !isAdmin) { router.push('/login'); return; }
    fetchOrders();
  }, [isAuthenticated, isAdmin, router, fetchOrders]);

  const handleStatusUpdate = async (orderId: string, status: string) => {
    setUpdatingId(orderId);
    try {
      await api.patch(`/orders/${orderId}/status`, { status, message: `Commande ${getStatusLabel(status).toLowerCase()}` });
      toast.success('Statut mis à jour');
      fetchOrders();
    } catch {
      toast.error('Erreur lors de la mise à jour');
    }
    setUpdatingId(null);
  };

  return (
    <div className="flex min-h-screen bg-muted/30">
      <AdminSidebar />
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="font-display text-3xl font-bold">Commandes</h1>
            <p className="text-muted-foreground mt-1">Gérez toutes les commandes</p>
          </div>

          {/* Filters */}
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Rechercher par numéro..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="input-custom pl-12 bg-card"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
              className="border border-border bg-card px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
            >
              <option value="">Tous les statuts</option>
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>{getStatusLabel(s)}</option>
              ))}
            </select>
          </div>

          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    {['Commande', 'Client', 'Articles', 'Total', 'Paiement', 'Statut', 'Date', 'Action'].map((h) => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {loading
                    ? Array.from({ length: 10 }).map((_, i) => (
                        <tr key={i}>
                          {Array.from({ length: 8 }).map((_, j) => (
                            <td key={j} className="px-4 py-4">
                              <div className="h-4 bg-muted animate-pulse rounded" />
                            </td>
                          ))}
                        </tr>
                      ))
                    : orders.map((order) => (
                        <tr key={order._id} className="hover:bg-muted/30 transition-colors">
                          <td className="px-4 py-4 text-sm font-medium">#{order.orderNumber}</td>
                          <td className="px-4 py-4 text-sm">
                            {typeof order.user === 'object' && order.user !== null
                              ? `${order.user.firstName} ${order.user.lastName}`
                              : (order.user as string) || 'Client supprimé'}
                          </td>
                          <td className="px-4 py-4 text-sm text-muted-foreground">{order.items.length}</td>
                          <td className="px-4 py-4 text-sm font-bold">{formatPrice(order.total)}</td>
                          <td className="px-4 py-4">
                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(order.paymentStatus)}`}>
                              {getStatusLabel(order.paymentStatus)}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(order.orderStatus)}`}>
                              {getStatusLabel(order.orderStatus)}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-sm text-muted-foreground">{formatDate(order.createdAt)}</td>
                          <td className="px-4 py-4">
                            <select
                              value={order.orderStatus}
                              onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                              disabled={updatingId === order._id}
                              className="text-xs border border-border bg-background px-2 py-1 focus:outline-none rounded"
                            >
                              {STATUS_OPTIONS.map((s) => (
                                <option key={s} value={s}>{getStatusLabel(s)}</option>
                              ))}
                            </select>
                          </td>
                        </tr>
                      ))}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center gap-2 p-4 border-t border-border">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-8 h-8 text-sm border transition-colors ${
                      page === p ? 'bg-primary text-primary-foreground border-primary' : 'border-border hover:bg-muted'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
