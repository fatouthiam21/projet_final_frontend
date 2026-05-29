import type { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CartDrawer from '@/components/layout/CartDrawer';
import WhatsAppButton from '@/components/common/WhatsAppButton';
import HeroSection from '@/components/home/HeroSection';
import CategoriesSection from '@/components/home/CategoriesSection';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import NewArrivals from '@/components/home/NewArrivals';
import PromoSection from '@/components/home/PromoSection';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import BrandsSection from '@/components/home/BrandsSection';

export const metadata: Metadata = {
  title: 'Urban Style | Mode Masculine Premium au Sénégal',
  description: 'Découvrez la collection Urban Style - mode masculine premium. Jeans, sneakers, chemises, cargos et plus. Livraison au Sénégal.',
};

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <CategoriesSection />
        <FeaturedProducts />
        <PromoSection />
        <NewArrivals />
        <TestimonialsSection />
        <BrandsSection />
      </main>
      <Footer />
      <CartDrawer />
      <WhatsAppButton />
    </>
  );
}
