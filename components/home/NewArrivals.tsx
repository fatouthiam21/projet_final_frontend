'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import ProductCard from '@/components/products/ProductCard';
import { SkeletonCard } from '@/components/common/SkeletonCard';
import { productService } from '@/services/productService';
import { Product } from '@/types';

export default function NewArrivals() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    productService.getNewArrivals()
      .then((res) => setProducts(res.data.data.products))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="py-20">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-end justify-between mb-12"
        >
          <div>
            <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Fraîchement arrivés</span>
            <h2 className="section-title mt-2">Nouveautés</h2>
          </div>
          <Link href="/products?sort=newest" className="hidden md:flex items-center gap-2 text-sm font-medium hover:gap-3 transition-all">
            Voir tout <ArrowRight size={16} />
          </Link>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
            : products.slice(0, 4).map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
        </div>
      </div>
    </section>
  );
}
