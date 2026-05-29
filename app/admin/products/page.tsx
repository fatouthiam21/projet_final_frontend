'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Search, Eye } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { productService } from '@/services/productService';
import { Product } from '@/types';
import { formatPrice } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await productService.getProducts({ search, page, limit: 15 });
      setProducts(res.data.data as unknown as Product[]);
      setTotalPages(res.data.pagination?.pages || 1);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { fetchProducts(); }, [search, page]);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Supprimer "${name}" ?`)) return;
    try {
      await productService.delete(id);
      toast.success('Produit supprimé');
      fetchProducts();
    } catch {
      toast.error('Erreur lors de la suppression');
    }
  };

  return (
    <div className="flex min-h-screen bg-muted/30">
      <AdminSidebar />
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-display text-3xl font-bold">Produits</h1>
              <p className="text-muted-foreground mt-1">Gérez votre catalogue</p>
            </div>
            <Link href="/admin/products/create" className="btn-primary flex items-center gap-2">
              <Plus size={18} /> Ajouter
            </Link>
          </div>

          {/* Search */}
          <div className="relative mb-6">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Rechercher un produit..."
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
                    {['Produit', 'Catégorie', 'Prix', 'Stock', 'Statut', 'Actions'].map((h) => (
                      <th key={h} className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {loading
                    ? Array.from({ length: 8 }).map((_, i) => (
                        <tr key={i}>
                          {Array.from({ length: 6 }).map((_, j) => (
                            <td key={j} className="px-6 py-4">
                              <div className="h-4 bg-muted animate-pulse rounded" />
                            </td>
                          ))}
                        </tr>
                      ))
                    : products.map((product) => (
                        <motion.tr
                          key={product._id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="hover:bg-muted/30 transition-colors"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 bg-muted flex-shrink-0 overflow-hidden rounded">
                                {product.images[0] && (
                                  <Image src={product.images[0].url} alt={product.name} width={48} height={48} className="w-full h-full object-cover" />
                                )}
                              </div>
                              <div>
                                <p className="font-medium text-sm">{product.name}</p>
                                <p className="text-xs text-muted-foreground">{product.brand}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-muted-foreground">
                            {product.category?.name}
                          </td>
                          <td className="px-6 py-4">
                            <div>
                              <p className="text-sm font-bold">{formatPrice(product.price)}</p>
                              {product.originalPrice && <p className="text-xs text-muted-foreground line-through">{formatPrice(product.originalPrice)}</p>}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`text-sm font-medium ${(product.totalStock || 0) < 5 ? 'text-red-500' : 'text-green-600'}`}>
                              {product.totalStock || 0}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-col gap-1">
                              {product.isActive && <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full w-fit">Actif</span>}
                              {product.isFeatured && <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full w-fit">Vedette</span>}
                              {product.isOnSale && <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full w-fit">Promo</span>}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <Link href={`/product/${product.slug}`} className="p-1.5 hover:bg-muted rounded transition-colors" target="_blank">
                                <Eye size={15} />
                              </Link>
                              <Link href={`/admin/products/edit/${product._id}`} className="p-1.5 hover:bg-muted rounded transition-colors">
                                <Edit size={15} />
                              </Link>
                              <button
                                onClick={() => handleDelete(product._id, product.name)}
                                className="p-1.5 hover:bg-destructive/10 text-destructive rounded transition-colors"
                              >
                                <Trash2 size={15} />
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
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
