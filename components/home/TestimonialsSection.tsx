'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: 'Amadou Diallo',
    role: 'Client fidèle',
    avatar: 'AD',
    rating: 5,
    comment: 'Qualité exceptionnelle ! Les jeans Urban Style sont les meilleurs que j\'ai eu. La livraison était rapide et l\'emballage soigné.',
  },
  {
    id: 2,
    name: 'Ibrahim Sow',
    role: 'Client vérifié',
    avatar: 'IS',
    rating: 5,
    comment: 'J\'ai commandé des sneakers et un cargo. Tout était parfait. Le site est très facile à utiliser et le paiement via PayDunya est fluide.',
  },
  {
    id: 3,
    name: 'Oumar Ba',
    role: 'Client régulier',
    avatar: 'OB',
    rating: 5,
    comment: 'Urban Style est ma boutique préférée à Dakar. Les prix sont raisonnables pour la qualité qu\'on reçoit. Très satisfait !',
  },
];

export default function TestimonialsSection() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Témoignages</span>
          <h2 className="section-title mt-2">Ils nous font confiance</h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-card border border-border p-8 relative"
            >
              <Quote size={40} className="text-muted-foreground/20 absolute top-4 right-4" />
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} size={16} className="fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed mb-6">"{t.comment}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-sm">
                  {t.avatar}
                </div>
                <div>
                  <p className="font-semibold text-sm">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
