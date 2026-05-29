'use client';

import React, { useEffect, useState } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { Category } from '@/types';
import api from '@/services/api';
import toast from 'react-hot-toast';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [form, setForm] = useState({ name: '', description: '', icon: '' });

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await api.get('/categories');
      setCategories(res.data.data.categories);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { fetchCategories(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editing) {
        await api.patch(`/categories/${editing._id}`, form);
        toast.success('Catégorie mise à jour');
      } else {
        await api.post('/categories', form);
        toast.success('Catégorie créée');
      }
      setShowForm(false);
      setEditing(null);
      setForm({ name: '', description: '', icon: '' });
      fetchCategories();
    } catch (err: unknown) {
      toast.error((err as { response?: { data?: { message: string } } }).response?.data?.message || 'Erreur');
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Supprimer "${name}" ?`)) return;
    try {
      await api.delete(`/categories/${id}`);
      toast.success('Catégorie supprimée');
      fetchCategories();
    } catch {
      toast.error('Erreur');
    }
  };

  const startEdit = (cat: Category) => {
    setEditing(cat);
    setForm({ name: cat.name, description: cat.description || '', icon: cat.icon || '' });
    setShowForm(true);
  };

  return (
    <div className="flex min-h-screen bg-muted/30">
      <AdminSidebar />
      <main className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-display text-3xl font-bold">Catégories</h1>
              <p className="text-muted-foreground mt-1">Gérez vos catégories de produits</p>
            </div>
            <button onClick={() => { setEditing(null); setForm({ name: '', description: '', icon: '' }); setShowForm(true); }} className="btn-primary flex items-center gap-2">
              <Plus size={18} /> Ajouter
            </button>
          </div>

          {showForm && (
            <div className="bg-card border border-border p-6 mb-6 rounded-lg">
              <h2 className="font-semibold mb-4">{editing ? 'Modifier la catégorie' : 'Nouvelle catégorie'}</h2>
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium block mb-1">Nom *</label>
                  <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="ex: Jeans" className="input-custom" />
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1">Icône (emoji)</label>
                  <input value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} placeholder="👖" className="input-custom" />
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1">Description</label>
                  <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Description..." className="input-custom" />
                </div>
                <div className="md:col-span-3 flex gap-3">
                  <button type="submit" className="btn-primary">{editing ? 'Mettre à jour' : 'Créer'}</button>
                  <button type="button" onClick={() => setShowForm(false)} className="btn-outline">Annuler</button>
                </div>
              </form>
            </div>
          )}

          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  {['Catégorie', 'Slug', 'Produits', 'Statut', 'Actions'].map((h) => (
                    <th key={h} className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {loading
                  ? Array.from({ length: 5 }).map((_, i) => (
                      <tr key={i}>{Array.from({ length: 5 }).map((_, j) => <td key={j} className="px-6 py-4"><div className="h-4 bg-muted animate-pulse rounded" /></td>)}</tr>
                    ))
                  : categories.map((cat) => (
                      <tr key={cat._id} className="hover:bg-muted/30 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <span className="text-xl">{cat.icon}</span>
                            <span className="font-medium">{cat.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-muted-foreground font-mono">{cat.slug}</td>
                        <td className="px-6 py-4 text-sm">{cat.productCount}</td>
                        <td className="px-6 py-4">
                          <span className={`text-xs px-2 py-1 rounded-full ${cat.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {cat.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button onClick={() => startEdit(cat)} className="p-1.5 hover:bg-muted rounded transition-colors">
                              <Edit size={15} />
                            </button>
                            <button onClick={() => handleDelete(cat._id, cat.name)} className="p-1.5 hover:bg-destructive/10 text-destructive rounded transition-colors">
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
