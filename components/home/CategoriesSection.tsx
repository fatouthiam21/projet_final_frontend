'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const categories = [
  {
    name: 'Jeans',
    slug: 'jeans',
    image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&q=80',
    count: '25+ styles',
  },
  {
    name: 'Sneakers',
    slug: 'sneakers',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80',
    count: '30+ modèles',
  },
  {
    name: 'T-Shirts',
    slug: 't-shirts',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80',
    count: '40+ designs',
  },
  {
    name: 'Chemises',
    slug: 'chemises',
    image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&q=80',
    count: '20+ coupes',
  },
];

export default function CategoriesSection() {
  return (
    <section className="py-20">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Collections</span>
          <h2 className="section-title mt-2">Explorez nos catégories</h2>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((cat, index) => (
            <motion.div
              key={cat.slug}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Link href={`/products?category=${cat.slug}`} className="group block relative overflow-hidden aspect-[3/4] bg-muted">
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-xs text-white/60 mb-1">{cat.count}</p>
                      <h3 className="font-display text-xl font-bold">{cat.name}</h3>
                    </div>
                    <ArrowRight
                      size={20}
                      className="opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-300"
                    />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
