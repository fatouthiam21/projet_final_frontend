'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

export default function PromoSection() {
  return (
    <section className="py-20">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Big promo */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative overflow-hidden aspect-[4/3] lg:aspect-auto group"
          >
            <Image
              src="https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80"
              alt="Promo jeans"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent" />
            <div className="absolute inset-0 flex items-center p-10">
              <div className="text-white">
                <span className="text-xs uppercase tracking-[0.3em] text-white/70 block mb-2">Édition Limitée</span>
                <h3 className="font-display text-4xl font-bold mb-2">Collection Jeans</h3>
                <p className="text-white/70 mb-6">Les meilleures coupes de la saison</p>
                <Link href="/products?category=jeans" className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wide border-b border-white pb-1 hover:gap-3 transition-all">
                  Découvrir <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Two small promos */}
          <div className="grid grid-rows-2 gap-6">
            {[
              {
                title: 'Sneakers Collection',
                subtitle: '-20% sur les nouveautés',
                href: '/products?category=sneakers',
                image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80',
              },
              {
                title: 'Style Casual',
                subtitle: 'T-shirts & Chemises',
                href: '/products?category=t-shirts',
                image: 'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=600&q=80',
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative overflow-hidden group"
              >
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/40" />
                <div className="absolute inset-0 flex items-center p-6">
                  <div className="text-white">
                    <p className="text-xs text-white/70 mb-1">{item.subtitle}</p>
                    <h3 className="font-display text-2xl font-bold mb-3">{item.title}</h3>
                    <Link href={item.href} className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide border-b border-white pb-0.5 hover:gap-3 transition-all">
                      Voir <ArrowRight size={12} />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
