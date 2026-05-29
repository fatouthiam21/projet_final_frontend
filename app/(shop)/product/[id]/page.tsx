'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ShoppingBag, Heart, ChevronRight, Minus, Plus, MessageCircle, Truck, RotateCcw, Shield } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CartDrawer from '@/components/layout/CartDrawer';
import WhatsAppButton from '@/components/common/WhatsAppButton';
import ProductCard from '@/components/products/ProductCard';
import { SkeletonProductDetail } from '@/components/common/SkeletonCard';
import { productService } from '@/services/productService';
import { Product, ProductVariant } from '@/types';
import { formatPrice } from '@/lib/utils';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store/store';
import { addToCart, openCart } from '@/store/cartSlice';
import { useAuth } from '@/context/AuthContext';
import { authService } from '@/services/authService';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();

  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    if (!id) return;
    productService.getProduct(id)
      .then((res) => {
        setProduct(res.data.data.product);
        setRelated(res.data.data.related);
        setIsWishlisted(user?.wishlist?.includes(res.data.data.product._id) || false);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id, user]);

  const uniqueSizes = product ? [...new Set(product.variants.map((v) => v.size))] : [];
  const colorsForSize = product && selectedSize
    ? [...new Map(
        product.variants
          .filter((v) => v.size === selectedSize)
          .map((v) => [v.color, v])
      ).values()]
    : product
    ? [...new Map(product.variants.map((v) => [v.color, v])).values()]
    : [];

  const selectedVariant = product?.variants.find(
    (v) => v.size === selectedSize && v.color === selectedColor
  );

  const handleAddToCart = async () => {
    if (!isAuthenticated) { router.push('/login'); return; }
    if (!selectedSize) { toast.error('Veuillez sélectionner une taille'); return; }
    if (!selectedColor) { toast.error('Veuillez sélectionner une couleur'); return; }
    if (!selectedVariant || selectedVariant.stock < quantity) {
      toast.error('Stock insuffisant'); return;
    }
    setAdding(true);
    try {
      await dispatch(addToCart({ productId: product!._id, quantity, size: selectedSize, color: selectedColor })).unwrap();
      dispatch(openCart());
      toast.success('Ajouté au panier !');
    } catch (err: unknown) {
      toast.error((err as { message: string }).message || 'Erreur');
    } finally {
      setAdding(false);
    }
  };

  const handleWishlist = async () => {
    if (!isAuthenticated) { router.push('/login'); return; }
    setIsWishlisted(!isWishlisted);
    await authService.toggleWishlist(product!._id);
    toast.success(isWishlisted ? 'Retiré des favoris' : 'Ajouté aux favoris');
  };

  const whatsappUrl = product
    ? `https://wa.me/${(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '').replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Bonjour, je suis intéressé(e) par *${product.name}* à ${formatPrice(product.price)}.`)}`
    : '#';

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="pt-24 pb-20">
          <div className="container-custom">
            <SkeletonProductDetail />
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Navbar />
        <main className="pt-24 pb-20 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <p className="text-xl mb-4">Produit introuvable</p>
            <Link href="/products" className="btn-primary">Voir les produits</Link>
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
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
            <Link href="/" className="hover:text-primary">Accueil</Link>
            <ChevronRight size={14} />
            <Link href="/products" className="hover:text-primary">Produits</Link>
            <ChevronRight size={14} />
            <Link href={`/products?category=${product.category?.slug}`} className="hover:text-primary">
              {product.category?.name}
            </Link>
            <ChevronRight size={14} />
            <span className="text-foreground truncate max-w-[200px]">{product.name}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Images */}
            <div className="space-y-4">
              <div className="relative aspect-square bg-muted overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeImage}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0"
                  >
                    {product.images[activeImage] && (
                      <Image
                        src={product.images[activeImage].url}
                        alt={product.images[activeImage].alt || product.name}
                        fill
                        className="object-cover"
                        priority
                      />
                    )}
                  </motion.div>
                </AnimatePresence>

                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {product.isNewArrival && <span className="bg-primary text-primary-foreground text-xs px-2 py-1 font-semibold">NOUVEAU</span>}
                  {product.isOnSale && <span className="bg-red-500 text-white text-xs px-2 py-1 font-semibold">-{product.discountPercentage}%</span>}
                </div>
              </div>

              {/* Thumbnails */}
              {product.images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto">
                  {product.images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImage(i)}
                      className={`w-20 h-20 flex-shrink-0 border-2 overflow-hidden transition-colors ${
                        activeImage === i ? 'border-primary' : 'border-transparent'
                      }`}
                    >
                      <Image src={img.url} alt={img.alt || ''} width={80} height={80} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Details */}
            <div>
              <p className="text-sm text-muted-foreground uppercase tracking-wider mb-2">{product.brand}</p>
              <h1 className="font-display text-3xl md:text-4xl font-bold mb-3">{product.name}</h1>

              {/* Rating */}
              {product.totalReviews > 0 && (
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} size={16} className={s <= Math.round(product.averageRating) ? 'fill-yellow-400 text-yellow-400' : 'text-muted'} />
                    ))}
                  </div>
                  <span className="text-sm font-medium">{product.averageRating}</span>
                  <span className="text-sm text-muted-foreground">({product.totalReviews} avis)</span>
                </div>
              )}

              {/* Price */}
              <div className="flex items-baseline gap-3 mb-6">
                <span className="text-3xl font-bold">{formatPrice(product.price)}</span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-xl text-muted-foreground line-through">{formatPrice(product.originalPrice)}</span>
                )}
              </div>

              <p className="text-muted-foreground leading-relaxed mb-8">{product.shortDescription || product.description.slice(0, 200) + '...'}</p>

              {/* Size selector */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-sm uppercase tracking-wide">Taille</h3>
                  <button className="text-xs text-muted-foreground underline hover:text-primary">Guide des tailles</button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {uniqueSizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => { setSelectedSize(size); setSelectedColor(''); }}
                      className={`min-w-[48px] h-12 px-3 border text-sm font-medium transition-all ${
                        selectedSize === size
                          ? 'border-primary bg-primary text-primary-foreground'
                          : 'border-border hover:border-primary'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color selector */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-sm uppercase tracking-wide">
                    Couleur {selectedColor && <span className="font-normal text-muted-foreground">— {selectedColor}</span>}
                  </h3>
                </div>
                <div className="flex flex-wrap gap-3">
                  {colorsForSize.map((variant: ProductVariant) => (
                    <button
                      key={variant.color}
                      onClick={() => setSelectedColor(variant.color)}
                      title={variant.color}
                      className={`w-8 h-8 rounded-full border-2 transition-all ${
                        selectedColor === variant.color ? 'border-primary scale-110' : 'border-border'
                      }`}
                      style={{ backgroundColor: variant.colorHex || '#000' }}
                    />
                  ))}
                </div>
              </div>

              {/* Stock info */}
              {selectedVariant && (
                <p className={`text-sm mb-4 ${selectedVariant.stock < 5 ? 'text-red-500' : 'text-green-600'}`}>
                  {selectedVariant.stock === 0 ? 'Épuisé' : selectedVariant.stock < 5 ? `Plus que ${selectedVariant.stock} en stock !` : `En stock (${selectedVariant.stock} disponibles)`}
                </p>
              )}

              {/* Quantity */}
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center border border-border">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-3 hover:bg-muted transition-colors">
                    <Minus size={16} />
                  </button>
                  <span className="px-6 font-medium">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="p-3 hover:bg-muted transition-colors">
                    <Plus size={16} />
                  </button>
                </div>
                <span className="text-sm text-muted-foreground">Total: {formatPrice(product.price * quantity)}</span>
              </div>

              {/* CTAs */}
              <div className="flex gap-3 mb-6">
                <button
                  onClick={handleAddToCart}
                  disabled={adding || !product.isInStock}
                  className="flex-1 btn-primary flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {adding
                    ? <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                    : <><ShoppingBag size={18} /> {product.isInStock ? 'Ajouter au panier' : 'Épuisé'}</>
                  }
                </button>
                <button
                  onClick={handleWishlist}
                  className={`w-14 h-14 border flex items-center justify-center hover:bg-muted transition-colors ${isWishlisted ? 'border-primary text-red-500' : 'border-border'}`}
                >
                  <Heart size={20} fill={isWishlisted ? 'currentColor' : 'none'} />
                </button>
              </div>

              {/* WhatsApp */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-green-600 hover:text-green-700 transition-colors mb-8"
              >
                <MessageCircle size={18} /> Nous contacter sur WhatsApp
              </a>

              {/* Features */}
              <div className="border-t border-border pt-6 grid grid-cols-3 gap-4">
                {[
                  { icon: Truck, text: 'Livraison rapide' },
                  { icon: RotateCcw, text: 'Retour 30 jours' },
                  { icon: Shield, text: 'Paiement sécurisé' },
                ].map((f, i) => (
                  <div key={i} className="flex flex-col items-center text-center gap-2">
                    <f.icon size={20} className="text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">{f.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Related products */}
          {related.length > 0 && (
            <div className="mt-24">
              <h2 className="font-display text-2xl font-bold mb-8">Vous pourriez aussi aimer</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {related.map((p) => <ProductCard key={p._id} product={p} />)}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
      <CartDrawer />
      <WhatsAppButton />
    </>
  );
}
