'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

const slides = [
  {
    id: 1,
    tag: 'Nouvelle Collection',
    title: 'L\'Art du Style Masculin',
    subtitle: 'Jeans, sneakers et pièces signature pour l\'homme moderne',
    cta: 'Découvrir la collection',
    ctaHref: '/products?sort=newest',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&q=80',
    align: 'left',
  },
  {
    id: 2,
    tag: 'Sneakers Premium',
    title: 'Marchez avec Style',
    subtitle: 'La nouvelle vague de sneakers urbaines et élégantes',
    cta: 'Voir les sneakers',
    ctaHref: '/products?category=sneakers',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1920&q=80',
    align: 'right',
  },
  {
    id: 3,
    tag: 'Soldes — Jusqu\'à -40%',
    title: 'Des Prix Exceptionnels',
    subtitle: 'Profitez de nos promotions exclusives sur les meilleures pièces',
    cta: 'Voir les soldes',
    ctaHref: '/products?onSale=true',
    image: 'https://images.pexels.com/photos/2815417/pexels-photo-2815417.jpeg?auto=compress&cs=tinysrgb&w=1920',
    align: 'center',
  },
];

export default function HeroSection() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const goTo = (index: number) => {
    setDirection(index > current ? 1 : -1);
    setCurrent(index);
  };

  const slide = slides[current];

  return (
    <section className="relative h-screen min-h-[600px] overflow-hidden bg-premium-dark">
      {/* Background image */}
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={current}
          custom={direction}
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          className="absolute inset-0"
        >
          <Image
            src={slide.image}
            alt={slide.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="relative h-full flex items-center container-custom">
        <div className={`max-w-xl ${slide.align === 'right' ? 'ml-auto' : slide.align === 'center' ? 'mx-auto text-center' : ''}`}>
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-white"
            >
              <span className="inline-block text-xs uppercase tracking-[0.3em] font-medium mb-4 px-3 py-1 border border-white/30 text-white/80">
                {slide.tag}
              </span>
              <h1 className="font-display text-5xl md:text-7xl font-bold mb-4 leading-none">
                {slide.title}
              </h1>
              <p className="text-white/70 text-lg mb-8 max-w-md">
                {slide.subtitle}
              </p>
              <div className="flex flex-wrap gap-4 items-center">
                <Link href={slide.ctaHref} className="group inline-flex items-center gap-2 bg-white text-black px-8 py-4 font-semibold text-sm uppercase tracking-widest hover:bg-white/90 transition-colors">
                  {slide.cta}
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link href="/products" className="text-white/70 text-sm uppercase tracking-wide hover:text-white transition-colors underline underline-offset-4">
                  Explorer tout
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4">
        <button onClick={() => goTo((current - 1 + slides.length) % slides.length)} className="w-10 h-10 border border-white/30 text-white flex items-center justify-center hover:bg-white/10 transition-colors">
          <ChevronLeft size={18} />
        </button>
        <div className="flex gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`h-0.5 transition-all duration-300 ${i === current ? 'w-8 bg-white' : 'w-4 bg-white/40'}`}
            />
          ))}
        </div>
        <button onClick={() => goTo((current + 1) % slides.length)} className="w-10 h-10 border border-white/30 text-white flex items-center justify-center hover:bg-white/10 transition-colors">
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className="absolute bottom-8 right-8 hidden md:flex flex-col items-center gap-2 text-white/50"
      >
        <div className="w-px h-12 bg-gradient-to-b from-white/50 to-transparent" />
        <span className="text-xs uppercase tracking-widest rotate-90 origin-center translate-x-6">Scroll</span>
      </motion.div>
    </section>
  );
}
