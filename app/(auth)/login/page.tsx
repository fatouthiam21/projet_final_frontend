'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';
import { authService } from '@/services/authService';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';

const schema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(6, 'Mot de passe trop court'),
});

type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const res = await authService.login(data);
      login(res.data.data.token, res.data.data.user);
      toast.success(`Bienvenue, ${res.data.data.user.firstName} !`);
      router.push(redirect);
    } catch (err: unknown) {
      toast.error((err as { response?: { data?: { message: string } } }).response?.data?.message || 'Identifiants incorrects');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* Left - Image */}
      <div className="hidden lg:block relative bg-premium-dark">
        <div className="absolute inset-0 overflow-hidden">
          <img
            src="https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg?auto=compress&cs=tinysrgb&w=1200"
            alt="Urban Style Mode Masculine"
            className="w-full h-full object-cover opacity-70"
          />
        </div>
        <div className="relative h-full flex flex-col justify-between p-12 text-white">
          <Link href="/" className="font-display text-2xl font-bold">
            URBAN <span className="font-light tracking-widest">STYLE</span>
          </Link>
          <div>
            <blockquote className="font-display text-3xl font-bold leading-tight mb-4">
              "Le style est une façon d'affirmer qui tu es sans avoir à parler."
            </blockquote>
            <p className="text-white/60">— Rachel Zoe</p>
          </div>
        </div>
      </div>

      {/* Right - Form */}
      <div className="flex flex-col justify-center px-6 py-12 lg:px-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-sm w-full mx-auto"
        >
          <Link href="/" className="lg:hidden font-display text-2xl font-bold mb-8 block">
            URBAN <span className="font-light tracking-widest">STYLE</span>
          </Link>

          <h1 className="font-display text-3xl font-bold mb-2">Connexion</h1>
          <p className="text-muted-foreground mb-8">Accédez à votre compte Urban Style</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="text-sm font-medium block mb-1.5">Email</label>
              <input
                {...register('email')}
                type="email"
                placeholder="votre@email.com"
                className="input-custom"
              />
              {errors.email && <p className="text-destructive text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <div className="flex justify-between mb-1.5">
                <label className="text-sm font-medium">Mot de passe</label>
                <Link href="/forgot-password" className="text-xs text-muted-foreground hover:text-primary transition-colors">
                  Oublié ?
                </Link>
              </div>
              <div className="relative">
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="input-custom pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <p className="text-destructive text-xs mt-1">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
              ) : (
                <>Se connecter <ArrowRight size={16} /></>
              )}
            </button>
          </form>

          <div className="mt-6 p-4 bg-muted rounded text-xs text-muted-foreground">
            <p className="font-semibold mb-1">Compte de test :</p>
            <p>Admin: admin@urbanstyle.sn / admin123456</p>
            <p>Client: client@test.sn / client123456</p>
          </div>

          <p className="text-center text-sm text-muted-foreground mt-8">
            Pas encore de compte ?{' '}
            <Link href="/register" className="text-primary font-semibold hover:underline">
              Créer un compte
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
