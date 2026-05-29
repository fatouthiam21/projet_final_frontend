'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';

export default function WhatsAppButton() {
  const [showTooltip, setShowTooltip] = useState(false);
  const phone = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '+221000000000').replace(/[^0-9]/g, '');
  const message = encodeURIComponent('Bonjour ! Je souhaite obtenir des informations sur vos produits Urban Style.');
  const whatsappUrl = `https://wa.me/${phone}?text=${message}`;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            className="bg-card text-card-foreground border border-border shadow-xl rounded-lg p-3 max-w-[200px] text-sm font-medium"
          >
            Besoin d'aide ? Écrivez-nous sur WhatsApp !
          </motion.div>
        )}
      </AnimatePresence>

      <motion.a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onHoverStart={() => setShowTooltip(true)}
        onHoverEnd={() => setShowTooltip(false)}
        className="w-14 h-14 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow"
        aria-label="Contact WhatsApp"
      >
        <motion.div
          animate={{ rotate: [0, -10, 10, -10, 0] }}
          transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 3 }}
        >
          <MessageCircle size={28} fill="white" />
        </motion.div>

        {/* Ping animation */}
        <span className="absolute w-14 h-14 rounded-full bg-[#25D366] opacity-30 animate-ping" />
      </motion.a>
    </div>
  );
}
