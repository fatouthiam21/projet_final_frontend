'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Shield, ShieldOff } from 'lucide-react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { User } from '@/types';
import { formatDate, getInitials } from '@/lib/utils';
import api from '@/services/api';
import toast from 'react-hot-toast';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get('/users', { params: { search, page, limit: 20 } });
      setUsers(res.data.data);
      setTotalPages(res.data.pagination?.pages || 1);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { fetchUsers(); }, [search, page]);

  const toggleUserStatus = async (userId: string, isActive: boolean) => {
    try {
      await api.patch(`/users/${userId}`, { isActive: !isActive });
      toast.success(isActive ? 'Compte désactivé' : 'Compte activé');
      fetchUsers();
    } catch {
      toast.error('Erreur');
    }
  };

  return (
    <div className="flex min-h-screen bg-muted/30">
      <AdminSidebar />
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="font-display text-3xl font-bold">Utilisateurs</h1>
            <p className="text-muted-foreground mt-1">Gérez les comptes clients</p>
          </div>

          <div className="relative mb-6">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Rechercher un utilisateur..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="input-custom pl-12 bg-card"
            />
          </div>

          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    {['Utilisateur', 'Email', 'Rôle', 'Statut', 'Inscrit le', 'Actions'].map((h) => (
                      <th key={h} className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {loading
                    ? Array.from({ length: 10 }).map((_, i) => (
                        <tr key={i}>{Array.from({ length: 6 }).map((_, j) => (
                          <td key={j} className="px-6 py-4"><div className="h-4 bg-muted animate-pulse rounded" /></td>
                        ))}</tr>
                      ))
                    : users.map((user) => (
                        <tr key={user._id} className="hover:bg-muted/30 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                                {getInitials(user.fullName || `${user.firstName} ${user.lastName}`)}
                              </div>
                              <p className="font-medium text-sm">{user.firstName} {user.lastName}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-muted-foreground">{user.email}</td>
                          <td className="px-6 py-4">
                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                              {user.role}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${user.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                              {user.isActive ? 'Actif' : 'Inactif'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-muted-foreground">{formatDate(user.createdAt)}</td>
                          <td className="px-6 py-4">
                            {user.role !== 'admin' && (
                              <button
                                onClick={() => toggleUserStatus(user._id, user.isActive)}
                                className={`p-1.5 rounded transition-colors ${user.isActive ? 'hover:bg-red-50 text-red-500' : 'hover:bg-green-50 text-green-500'}`}
                                title={user.isActive ? 'Désactiver' : 'Activer'}
                              >
                                {user.isActive ? <ShieldOff size={16} /> : <Shield size={16} />}
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
