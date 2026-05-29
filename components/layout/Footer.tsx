'use client';

import Link from 'next/link';
import { Instagram, Facebook, Twitter, Mail, Phone, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

const footerLinks = {
  shop: [
    { label: 'Nouveautés', href: '/products?sort=newest' },
    { label: 'Jeans', href: '/products?category=jeans' },
    { label: 'Sneakers', href: '/products?category=sneakers' },
    { label: 'Soldes', href: '/products?onSale=true' },
    { label: 'Tous les produits', href: '/products' },
  ],
  help: [
    { label: 'Livraison', href: '/shipping' },
    { label: 'Retours', href: '/returns' },
    { label: 'Guide des tailles', href: '/size-guide' },
    { label: 'FAQ', href: '/faq' },
    { label: 'Contact', href: '/contact' },
  ],
  account: [
    { label: 'Mon compte', href: '/profile' },
    { label: 'Mes commandes', href: '/orders' },
    { label: 'Wishlist', href: '/profile?tab=wishlist' },
    { label: 'Se connecter', href: '/login' },
    { label: 'Créer un compte', href: '/register' },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-premium-dark text-white">
      {/* Newsletter */}
      <div className="border-b border-white/10">
        <div className="container-custom py-12">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="font-display text-2xl mb-2">Restez informé</h3>
            <p className="text-white/60 text-sm mb-6">
              Inscrivez-vous pour recevoir nos dernières nouveautés et offres exclusives
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/register"
                className="bg-white text-black px-8 py-3 text-sm font-semibold uppercase tracking-widest hover:bg-white/90 transition-colors"
              >
                S'inscrire
              </Link>
              <Link
                href="/login"
                className="border border-white/40 text-white px-8 py-3 text-sm font-semibold uppercase tracking-widest hover:bg-white/10 transition-colors"
              >
                Se connecter
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="font-display text-2xl font-bold mb-4">
              URBAN <span className="font-light tracking-widest">STYLE</span>
            </div>
            <p className="text-white/60 text-sm leading-relaxed mb-6 max-w-xs">
              Votre destination mode masculine premium au Sénégal. Qualité, style et authenticité depuis 2024.
            </p>
            <div className="space-y-2 text-sm text-white/60">
              <div className="flex items-center gap-2">
                <MapPin size={14} /> <span>Dakar, Sénégal</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={14} /> <span>+221 77 000 00 00</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={14} /> <span>contact@urbanstyle.sn</span>
              </div>
            </div>
            <div className="flex gap-4 mt-6">
              {[Instagram, Facebook, Twitter].map((Icon, i) => (
                <motion.a
                  key={i}
                  href="#"
                  whileHover={{ scale: 1.1 }}
                  className="w-10 h-10 border border-white/20 flex items-center justify-center hover:bg-white hover:text-black transition-all"
                >
                  <Icon size={16} />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Links */}
          {[
            { title: 'Boutique', links: footerLinks.shop },
            { title: 'Aide', links: footerLinks.help },
            { title: 'Mon compte', links: footerLinks.account },
          ].map((section) => (
            <div key={section.title}>
              <h4 className="font-semibold uppercase tracking-widest text-xs mb-4 text-white/80">
                {section.title}
              </h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-white/50 text-sm hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-white/10">
        <div className="container-custom py-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-white/40">
          <span>© {new Date().getFullYear()} Urban Style. Tous droits réservés.</span>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-white/60 transition-colors">Confidentialité</Link>
            <Link href="/terms" className="hover:text-white/60 transition-colors">CGV</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
