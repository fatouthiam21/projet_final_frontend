'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag, Star, Eye } from 'lucide-react';
import { Product } from '@/types';
import { formatPrice } from '@/lib/utils';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store/store';
import { addToCart, openCart } from '@/store/cartSlice';
import { useAuth } from '@/context/AuthContext';
import { authService } from '@/services/authService';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export default function ProductCard({ product, priority = false }: ProductCardProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated, user, updateUser } = useAuth();
  const router = useRouter();
  const [isWishlisted, setIsWishlisted] = useState(
    user?.wishlist?.includes(product._id) || false
  );
  const [addingToCart, setAddingToCart] = useState(false);

  const mainImage = product.images[0]?.url;

  const handleQuickAdd = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    if (!product.isInStock) {
      toast.error('Produit épuisé');
      return;
    }

    // If only one variant, add directly
    const firstVariant = product.variants[0];
    if (!firstVariant) {
      router.push(`/product/${product.slug}`);
      return;
    }

    setAddingToCart(true);
    try {
      await dispatch(addToCart({
        productId: product._id,
        quantity: 1,
        size: firstVariant.size,
        color: firstVariant.color,
      })).unwrap();
      dispatch(openCart());
      toast.success('Ajouté au panier !');
    } catch (err: unknown) {
      toast.error((err as { message: string }).message || 'Erreur');
    } finally {
      setAddingToCart(false);
    }
  };

  const handleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    try {
      setIsWishlisted(!isWishlisted);
      const res = await authService.toggleWishlist(product._id);
      toast.success(isWishlisted ? 'Retiré des favoris' : 'Ajouté aux favoris');
    } catch {
      setIsWishlisted(isWishlisted);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      className="product-card group"
    >
      <Link href={`/product/${product.slug}`}>
        {/* Image */}
        <div className="product-card-image relative">
          {mainImage && (
            <Image
              src={mainImage}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover transition-all duration-500 group-hover:scale-105"
              priority={priority}
            />
          )}

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1">
            {product.isNewArrival && (
              <span className="bg-primary text-primary-foreground text-xs px-2 py-1 font-semibold uppercase tracking-wide">
                Nouveau
              </span>
            )}
            {product.isOnSale && product.discountPercentage > 0 && (
              <span className="bg-red-500 text-white text-xs px-2 py-1 font-semibold uppercase tracking-wide">
                -{product.discountPercentage}%
              </span>
            )}
            {!product.isInStock && (
              <span className="bg-muted text-muted-foreground text-xs px-2 py-1 font-semibold uppercase tracking-wide">
                Épuisé
              </span>
            )}
          </div>

          {/* Actions */}
          <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleWishlist}
              className={`w-9 h-9 bg-background shadow-md flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors ${
                isWishlisted ? 'text-red-500' : ''
              }`}
            >
              <Heart size={16} fill={isWishlisted ? 'currentColor' : 'none'} />
            </motion.button>
            <Link
              href={`/product/${product.slug}`}
              className="w-9 h-9 bg-background shadow-md flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <Eye size={16} />
            </Link>
          </div>

          {/* Quick Add */}
          {product.isInStock && (
            <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
              <button
                onClick={handleQuickAdd}
                disabled={addingToCart}
                className="w-full bg-primary text-primary-foreground py-3 text-xs font-semibold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors disabled:opacity-70"
              >
                {addingToCart ? (
                  <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <ShoppingBag size={14} /> Ajouter au panier
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="pt-4 pb-2">
          <div className="flex items-start justify-between gap-2 mb-1">
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-0.5">{product.brand}</p>
              <h3 className="font-medium text-sm leading-tight group-hover:text-primary/80 transition-colors truncate">
                {product.name}
              </h3>
            </div>
          </div>

          {product.averageRating > 0 && (
            <div className="flex items-center gap-1 mb-2">
              <Star size={12} className="fill-yellow-400 text-yellow-400" />
              <span className="text-xs text-muted-foreground">
                {product.averageRating} ({product.totalReviews})
              </span>
            </div>
          )}

          <div className="flex items-center gap-2">
            <span className="font-bold">{formatPrice(product.price)}</span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-sm text-muted-foreground line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>

          {/* Color swatches */}
          {product.variants.length > 0 && (
            <div className="flex gap-1 mt-2 flex-wrap">
              {[...new Map(product.variants.map((v) => [v.color, v])).values()].slice(0, 5).map((v) => (
                <div
                  key={v.color}
                  title={v.color}
                  className="w-4 h-4 rounded-full border border-border cursor-pointer hover:scale-110 transition-transform"
                  style={{ backgroundColor: v.colorHex || '#000' }}
                />
              ))}
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
}
