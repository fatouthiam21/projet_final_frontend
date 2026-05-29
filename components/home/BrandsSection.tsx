'use client';

import React from 'react';
import { motion } from 'framer-motion';

const brands = ['Nike', 'Adidas', 'Levi\'s', 'Tommy Hilfiger', 'Calvin Klein', 'Zara'];

export default function BrandsSection() {
  return (
    <section className="py-16 border-y border-border overflow-hidden">
      <div className="container-custom">
        <p className="text-center text-xs uppercase tracking-[0.3em] text-muted-foreground mb-10">Nos marques partenaires</p>
        <div className="flex gap-16 items-center overflow-x-auto pb-4 scrollbar-hide">
          {[...brands, ...brands].map((brand, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="font-display text-2xl font-bold text-muted-foreground/30 hover:text-muted-foreground transition-colors whitespace-nowrap cursor-default"
            >
              {brand}
            </motion.span>
          ))}
        </div>
      </div>
    </section>
  );
}
