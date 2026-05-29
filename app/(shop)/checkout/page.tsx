'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CreditCard, Truck, MapPin, CheckCircle, ArrowRight, MessageCircle } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Image from 'next/image';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { useAuth } from '@/context/AuthContext';
import { orderService } from '@/services/orderService';
import { formatPrice } from '@/lib/utils';
import toast from 'react-hot-toast';
import Link from 'next/link';

const schema = z.object({
  street: z.string().min(5, 'Adresse requise'),
  city: z.string().min(2, 'Ville requise'),
  state: z.string().optional(),
  postalCode: z.string().optional(),
  country: z.string().default('Sénégal'),
  phone: z.string().min(8, 'Téléphone requis'),
  notes: z.string().optional(),
  paymentMethod: z.enum(['paydunya', 'cash_on_delivery']),
});

type FormData = z.infer<typeof schema>;

export default function CheckoutPage() {
  const { user, isAuthenticated } = useAuth();
  const cart = useSelector((state: RootState) => state.cart.cart);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<{ _id: string; orderNumber: string; total: number } | null>(null);
  const [whatsappUrl, setWhatsappUrl] = useState('');

  useEffect(() => {
    if (!isAuthenticated) { router.push('/login?redirect=/checkout'); }
  }, [isAuthenticated, router]);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      country: 'Sénégal',
      phone: user?.phone || '',
      paymentMethod: 'paydunya',
    },
  });

  const shippingCost = cart && cart.subtotal >= 50000 ? 0 : 2500;
  const total = cart ? cart.subtotal + shippingCost - (cart.discount || 0) : 0;

  const onSubmit = async (data: FormData) => {
    if (!cart || cart.items.length === 0) {
      toast.error('Votre panier est vide');
      return;
    }
    setLoading(true);
    try {
      const res = await orderService.createOrder({
        shippingAddress: {
          street: data.street,
          city: data.city,
          state: data.state,
          postalCode: data.postalCode,
          country: data.country,
          phone: data.phone,
        },
        paymentMethod: data.paymentMethod,
        notes: data.notes,
      });

      const createdOrder = res.data.data.order;
      const waMessage = res.data.data.whatsappMessage;

      setOrder(createdOrder);
      setWhatsappUrl(waMessage?.whatsappUrl || '');

      if (data.paymentMethod === 'paydunya') {
        const payRes = await orderService.initializePayment(createdOrder._id);
        window.location.href = payRes.data.data.paymentUrl;
      } else {
        toast.success('Commande passée avec succès !');
      }
    } catch (err: unknown) {
      toast.error((err as { response?: { data?: { message: string } } }).response?.data?.message || 'Erreur lors de la commande');
    } finally {
      setLoading(false);
    }
  };

  if (order && order._id) {
    return (
      <>
        <Navbar />
        <main className="pt-24 pb-20">
          <div className="container-custom max-w-2xl">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-16">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle size={40} className="text-green-600" />
              </div>
              <h1 className="font-display text-3xl font-bold mb-2">Commande confirmée !</h1>
              <p className="text-muted-foreground mb-2">Commande #{order.orderNumber}</p>
              <p className="text-2xl font-bold mb-8">{formatPrice(order.total)}</p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/orders" className="btn-primary">Voir mes commandes</Link>
                {whatsappUrl && (
                  <a href={whatsappUrl} target="_blank" rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 bg-[#25D366] text-white px-6 py-3 font-semibold text-sm uppercase tracking-wide hover:bg-[#25D366]/90 transition-colors">
                    <MessageCircle size={18} /> Confirmer sur WhatsApp
                  </a>
                )}
              </div>
            </motion.div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="pt-24 pb-20">
        <div className="container-custom">
          <h1 className="font-display text-3xl font-bold mb-8">Finaliser ma commande</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Form */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                {/* Shipping */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <MapPin size={20} />
                    <h2 className="font-semibold text-lg">Adresse de livraison</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="text-sm font-medium block mb-1.5">Adresse</label>
                      <input {...register('street')} placeholder="Rue, numéro, quartier" className="input-custom" />
                      {errors.street && <p className="text-destructive text-xs mt-1">{errors.street.message}</p>}
                    </div>
                    <div>
                      <label className="text-sm font-medium block mb-1.5">Ville</label>
                      <input {...register('city')} placeholder="Dakar" className="input-custom" />
                      {errors.city && <p className="text-destructive text-xs mt-1">{errors.city.message}</p>}
                    </div>
                    <div>
                      <label className="text-sm font-medium block mb-1.5">Téléphone</label>
                      <input {...register('phone')} type="tel" placeholder="+221 77 000 00 00" className="input-custom" />
                      {errors.phone && <p className="text-destructive text-xs mt-1">{errors.phone.message}</p>}
                    </div>
                    <div>
                      <label className="text-sm font-medium block mb-1.5">Pays</label>
                      <input {...register('country')} className="input-custom" />
                    </div>
                    <div>
                      <label className="text-sm font-medium block mb-1.5">Notes (optionnel)</label>
                      <input {...register('notes')} placeholder="Instructions spéciales..." className="input-custom" />
                    </div>
                  </div>
                </div>

                {/* Payment */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <CreditCard size={20} />
                    <h2 className="font-semibold text-lg">Mode de paiement</h2>
                  </div>
                  <div className="space-y-3">
                    {[
                      { value: 'paydunya', label: 'PayDunya', desc: 'Mobile Money, Wave, Orange Money, carte bancaire' },
                      { value: 'cash_on_delivery', label: 'Paiement à la livraison', desc: 'Payez en cash à la réception' },
                    ].map((method) => (
                      <label key={method.value} className="flex items-center gap-4 p-4 border border-border hover:border-primary cursor-pointer transition-colors">
                        <input {...register('paymentMethod')} type="radio" value={method.value} className="w-4 h-4" />
                        <div>
                          <p className="font-medium">{method.label}</p>
                          <p className="text-sm text-muted-foreground">{method.desc}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <button type="submit" disabled={loading} className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-70">
                  {loading
                    ? <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                    : <>Confirmer la commande <ArrowRight size={16} /></>
                  }
                </button>
              </form>
            </div>

            {/* Order summary */}
            <div>
              <div className="sticky top-24 border border-border p-6">
                <h2 className="font-semibold mb-4">Résumé de commande</h2>
                <div className="space-y-3 mb-6">
                  {cart?.items.map((item) => (
                    <div key={item._id} className="flex gap-3">
                      <div className="w-16 h-16 bg-muted flex-shrink-0 overflow-hidden">
                        {item.image && <Image src={item.image} alt={item.name} width={64} height={64} className="w-full h-full object-cover" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{item.name}</p>
                        <p className="text-xs text-muted-foreground">{item.size} / {item.color}</p>
                        <p className="text-sm font-bold">{formatPrice(item.price)} × {item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="border-t border-border pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Sous-total</span>
                    <span>{formatPrice(cart?.subtotal || 0)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Livraison</span>
                    <span>{shippingCost === 0 ? 'Gratuite' : formatPrice(shippingCost)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg border-t border-border pt-2">
                    <span>Total</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
