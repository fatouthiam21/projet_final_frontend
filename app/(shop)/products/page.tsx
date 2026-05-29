'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { SlidersHorizontal, X, ChevronDown, Search } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CartDrawer from '@/components/layout/CartDrawer';
import WhatsAppButton from '@/components/common/WhatsAppButton';
import ProductCard from '@/components/products/ProductCard';
import { SkeletonGrid } from '@/components/common/SkeletonCard';
import { productService } from '@/services/productService';
import { Product, ProductFilters } from '@/types';

const sortOptions = [
  { value: 'newest', label: 'Plus récents' },
  { value: 'popular', label: 'Populaires' },
  { value: 'price-asc', label: 'Prix croissant' },
  { value: 'price-desc', label: 'Prix décroissant' },
  { value: 'rating', label: 'Mieux notés' },
];

const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '40', '41', '42', '43', '44', '45'];
const categoryOptions = [
  { value: 'jeans', label: 'Jeans' },
  { value: 'cargos', label: 'Cargos' },
  { value: 't-shirts', label: 'T-Shirts' },
  { value: 'chemises', label: 'Chemises' },
  { value: 'sneakers', label: 'Sneakers' },
  { value: 'chaussures', label: 'Chaussures' },
];

export default function ProductsPage() {
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const [filters, setFilters] = useState<ProductFilters>({
    category: '',
    sort: 'newest',
    minPrice: undefined,
    maxPrice: undefined,
    size: '',
    search: '',
    onSale: false,
    page: 1,
    limit: 12,
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setFilters((prev) => ({
      ...prev,
      category: params.get('category') || '',
      sort: params.get('sort') || 'newest',
      search: params.get('search') || '',
      onSale: params.get('onSale') === 'true',
      page: 1,
    }));
  }, []);


  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await productService.getProducts(filters);
      setProducts(res.data.data as unknown as Product[]);
      setTotal(res.data.pagination?.total || 0);
      setPages(res.data.pagination?.pages || 1);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const updateFilter = (key: keyof ProductFilters, value: unknown) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  const clearFilters = () => {
    setFilters({ sort: 'newest', page: 1, limit: 12 });
    router.push('/products');
  };

  const hasActiveFilters = !!(filters.category || filters.minPrice || filters.maxPrice || filters.size || filters.search || filters.onSale);

  return (
    <>
      <Navbar />
      <main className="pt-24 pb-20">
        <div className="container-custom">
          {/* Header */}
          <div className="mb-8">
            <h1 className="font-display text-3xl font-bold">
              {filters.onSale
                ? 'Soldes'
                : filters.category
                ? categoryOptions.find((c) => c.value === filters.category)?.label || 'Produits'
                : filters.search
                ? `Résultats pour "${filters.search}"`
                : 'Tous les produits'}
            </h1>
            <p className="text-muted-foreground mt-1">{total} produits</p>
          </div>

          {/* Search bar */}
          <div className="relative mb-6">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Rechercher un produit..."
              value={filters.search || ''}
              onChange={(e) => updateFilter('search', e.target.value)}
              className="input-custom pl-12"
            />
          </div>

          <div className="flex gap-8">
            {/* Filters sidebar - desktop */}
            <aside className="hidden lg:block w-64 flex-shrink-0">
              <div className="sticky top-24 space-y-6">
                {/* Categories */}
                <div>
                  <h3 className="font-semibold text-sm uppercase tracking-wider mb-3">Catégories</h3>
                  <div className="space-y-2">
                    <button
                      onClick={() => updateFilter('category', '')}
                      className={`block text-sm w-full text-left px-2 py-1 rounded transition-colors ${!filters.category ? 'font-semibold text-primary' : 'text-muted-foreground hover:text-primary'}`}
                    >
                      Tous les produits
                    </button>
                    {categoryOptions.map((cat) => (
                      <button
                        key={cat.value}
                        onClick={() => updateFilter('category', cat.value === filters.category ? '' : cat.value)}
                        className={`block text-sm w-full text-left px-2 py-1 rounded transition-colors ${filters.category === cat.value ? 'font-semibold text-primary' : 'text-muted-foreground hover:text-primary'}`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price */}
                <div>
                  <h3 className="font-semibold text-sm uppercase tracking-wider mb-3">Prix (XOF)</h3>
                  <div className="space-y-3">
                    <input
                      type="number"
                      placeholder="Prix min"
                      value={filters.minPrice || ''}
                      onChange={(e) => updateFilter('minPrice', e.target.value ? Number(e.target.value) : undefined)}
                      className="input-custom text-sm"
                    />
                    <input
                      type="number"
                      placeholder="Prix max"
                      value={filters.maxPrice || ''}
                      onChange={(e) => updateFilter('maxPrice', e.target.value ? Number(e.target.value) : undefined)}
                      className="input-custom text-sm"
                    />
                  </div>
                </div>

                {/* Sizes */}
                <div>
                  <h3 className="font-semibold text-sm uppercase tracking-wider mb-3">Taille</h3>
                  <div className="flex flex-wrap gap-2">
                    {sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => updateFilter('size', filters.size === size ? '' : size)}
                        className={`px-3 py-1.5 text-xs border transition-colors ${
                          filters.size === size
                            ? 'border-primary bg-primary text-primary-foreground'
                            : 'border-border hover:border-primary'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {hasActiveFilters && (
                  <button onClick={clearFilters} className="flex items-center gap-2 text-sm text-destructive hover:underline">
                    <X size={14} /> Réinitialiser les filtres
                  </button>
                )}
              </div>
            </aside>

            {/* Products */}
            <div className="flex-1 min-w-0">
              {/* Sort bar */}
              <div className="flex items-center justify-between mb-6 gap-4">
                <button
                  onClick={() => setFiltersOpen(true)}
                  className="lg:hidden flex items-center gap-2 text-sm border border-border px-4 py-2 hover:bg-muted transition-colors"
                >
                  <SlidersHorizontal size={16} /> Filtres
                  {hasActiveFilters && <span className="bg-primary text-primary-foreground text-xs w-5 h-5 rounded-full flex items-center justify-center">!</span>}
                </button>
                <select
                  value={filters.sort}
                  onChange={(e) => updateFilter('sort', e.target.value)}
                  className="ml-auto border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                >
                  {sortOptions.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>

              {loading ? (
                <SkeletonGrid count={12} />
              ) : products.length === 0 ? (
                <div className="text-center py-20">
                  <p className="text-muted-foreground text-lg mb-4">Aucun produit trouvé</p>
                  <button onClick={clearFilters} className="btn-outline">Voir tous les produits</button>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                    {products.map((product) => (
                      <ProductCard key={product._id} product={product} />
                    ))}
                  </div>

                  {/* Pagination */}
                  {pages > 1 && (
                    <div className="flex justify-center gap-2 mt-12">
                      {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                        <button
                          key={p}
                          onClick={() => setFilters((prev) => ({ ...prev, page: p }))}
                          className={`w-10 h-10 border text-sm font-medium transition-colors ${
                            filters.page === p
                              ? 'bg-primary text-primary-foreground border-primary'
                              : 'border-border hover:bg-muted'
                          }`}
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <CartDrawer />
      <WhatsAppButton />
    </>
  );
}
