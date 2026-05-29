'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';
import { authService } from '@/services/authService';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';

const schema = z.object({
  firstName: z.string().min(2, 'Prénom requis'),
  lastName: z.string().min(2, 'Nom requis'),
  email: z.string().email('Email invalide'),
  phone: z.string().optional(),
  password: z.string().min(6, 'Minimum 6 caractères'),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: 'Les mots de passe ne correspondent pas',
  path: ['confirmPassword'],
});

type FormData = z.infer<typeof schema>;

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const { confirmPassword, ...payload } = data;
      const res = await authService.register(payload);
      login(res.data.data.token, res.data.data.user);
      toast.success('Compte créé avec succès !');
      router.push('/');
    } catch (err: unknown) {
      toast.error((err as { response?: { data?: { message: string } } }).response?.data?.message || 'Erreur lors de la création');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full mx-auto"
      >
        <Link href="/" className="font-display text-2xl font-bold mb-8 block">
          URBAN <span className="font-light tracking-widest">STYLE</span>
        </Link>

        <h1 className="font-display text-3xl font-bold mb-2">Créer un compte</h1>
        <p className="text-muted-foreground mb-8">Rejoignez la communauté Urban Style</p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium block mb-1.5">Prénom</label>
              <input {...register('firstName')} placeholder="Mamadou" className="input-custom" />
              {errors.firstName && <p className="text-destructive text-xs mt-1">{errors.firstName.message}</p>}
            </div>
            <div>
              <label className="text-sm font-medium block mb-1.5">Nom</label>
              <input {...register('lastName')} placeholder="Diallo" className="input-custom" />
              {errors.lastName && <p className="text-destructive text-xs mt-1">{errors.lastName.message}</p>}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium block mb-1.5">Email</label>
            <input {...register('email')} type="email" placeholder="votre@email.com" className="input-custom" />
            {errors.email && <p className="text-destructive text-xs mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="text-sm font-medium block mb-1.5">Téléphone (optionnel)</label>
            <input {...register('phone')} type="tel" placeholder="+221 77 000 00 00" className="input-custom" />
          </div>

          <div>
            <label className="text-sm font-medium block mb-1.5">Mot de passe</label>
            <div className="relative">
              <input {...register('password')} type={showPassword ? 'text' : 'password'} placeholder="••••••••" className="input-custom pr-12" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && <p className="text-destructive text-xs mt-1">{errors.password.message}</p>}
          </div>

          <div>
            <label className="text-sm font-medium block mb-1.5">Confirmer le mot de passe</label>
            <input {...register('confirmPassword')} type="password" placeholder="••••••••" className="input-custom" />
            {errors.confirmPassword && <p className="text-destructive text-xs mt-1">{errors.confirmPassword.message}</p>}
          </div>

          <button type="submit" disabled={loading} className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-70 mt-2">
            {loading
              ? <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
              : <>Créer mon compte <ArrowRight size={16} /></>
            }
          </button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-8">
          Déjà un compte ?{' '}
          <Link href="/login" className="text-primary font-semibold hover:underline">Se connecter</Link>
        </p>
      </motion.div>
    </div>
  );
}
