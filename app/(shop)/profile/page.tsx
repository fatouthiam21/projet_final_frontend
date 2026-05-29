'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { User, MapPin, Heart, Package, Lock, LogOut } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CartDrawer from '@/components/layout/CartDrawer';
import { useAuth } from '@/context/AuthContext';
import { authService } from '@/services/authService';
import { getInitials, formatDate } from '@/lib/utils';
import toast from 'react-hot-toast';
import Link from 'next/link';

const tabs = [
  { id: 'profile', label: 'Profil', icon: User },
  { id: 'orders', label: 'Commandes', icon: Package },
  { id: 'wishlist', label: 'Wishlist', icon: Heart },
  { id: 'addresses', label: 'Adresses', icon: MapPin },
  { id: 'security', label: 'Sécurité', icon: Lock },
];

export default function ProfilePage() {
  const { user, isAuthenticated, updateUser, logout } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('profile');
  const [form, setForm] = useState({ firstName: '', lastName: '', phone: '' });
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setActiveTab(params.get('tab') || 'profile');
  }, []);

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) { router.push('/login?redirect=/profile'); return; }
    if (user) setForm({ firstName: user.firstName, lastName: user.lastName, phone: user.phone || '' });
  }, [isAuthenticated, user, router]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await authService.updateMe(form);
      updateUser(res.data.data.user);
      toast.success('Profil mis à jour');
    } catch {
      toast.error('Erreur lors de la mise à jour');
    }
    setSaving(false);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pwForm.newPassword !== pwForm.confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas');
      return;
    }
    setSaving(true);
    try {
      await authService.changePassword({ currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword });
      toast.success('Mot de passe changé');
      setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch {
      toast.error('Mot de passe actuel incorrect');
    }
    setSaving(false);
  };

  if (!user) return null;

  return (
    <>
      <Navbar />
      <main className="pt-24 pb-20">
        <div className="container-custom max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="md:col-span-1">
              <div className="text-center mb-6">
                <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-xl mx-auto mb-3">
                  {getInitials(`${user.firstName} ${user.lastName}`)}
                </div>
                <p className="font-bold">{user.firstName} {user.lastName}</p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>

              <nav className="space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-sm rounded-lg transition-colors ${
                      activeTab === tab.id ? 'bg-primary text-primary-foreground' : 'hover:bg-muted text-muted-foreground'
                    }`}
                  >
                    <tab.icon size={16} /> {tab.label}
                  </button>
                ))}
                <button
                  onClick={() => { logout(); router.push('/'); }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm rounded-lg transition-colors text-destructive hover:bg-destructive/10"
                >
                  <LogOut size={16} /> Déconnexion
                </button>
              </nav>
            </div>

            {/* Content */}
            <div className="md:col-span-3">
              {activeTab === 'profile' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <h2 className="font-display text-2xl font-bold mb-6">Mon profil</h2>
                  <form onSubmit={handleUpdateProfile} className="space-y-4 max-w-md">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium block mb-1.5">Prénom</label>
                        <input value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} className="input-custom" />
                      </div>
                      <div>
                        <label className="text-sm font-medium block mb-1.5">Nom</label>
                        <input value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} className="input-custom" />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium block mb-1.5">Email</label>
                      <input value={user.email} disabled className="input-custom opacity-60 cursor-not-allowed" />
                    </div>
                    <div>
                      <label className="text-sm font-medium block mb-1.5">Téléphone</label>
                      <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="input-custom" placeholder="+221 77 000 00 00" />
                    </div>
                    <button type="submit" disabled={saving} className="btn-primary">
                      {saving ? 'Enregistrement...' : 'Enregistrer'}
                    </button>
                  </form>
                </motion.div>
              )}

              {activeTab === 'orders' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <h2 className="font-display text-2xl font-bold mb-6">Mes commandes</h2>
                  <Link href="/orders" className="btn-primary inline-block">Voir toutes mes commandes</Link>
                </motion.div>
              )}

              {activeTab === 'security' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <h2 className="font-display text-2xl font-bold mb-6">Sécurité</h2>
                  <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
                    {['Mot de passe actuel', 'Nouveau mot de passe', 'Confirmer le nouveau'].map((label, i) => {
                      const keys = ['currentPassword', 'newPassword', 'confirmPassword'] as const;
                      return (
                        <div key={i}>
                          <label className="text-sm font-medium block mb-1.5">{label}</label>
                          <input
                            type="password"
                            value={pwForm[keys[i]]}
                            onChange={(e) => setPwForm({ ...pwForm, [keys[i]]: e.target.value })}
                            className="input-custom"
                            placeholder="••••••••"
                          />
                        </div>
                      );
                    })}
                    <button type="submit" disabled={saving} className="btn-primary">
                      {saving ? 'Enregistrement...' : 'Changer le mot de passe'}
                    </button>
                  </form>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <CartDrawer />
    </>
  );
}
