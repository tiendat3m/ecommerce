'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Star, ShoppingCart, Heart, Eye } from 'lucide-react';
import { Product } from '@/types';
import { useCartStore } from '@/store/cartStore';
import { toast } from 'sonner';
import GlassCard from '@/components/ui/GlassCard';
import GradientButton from '@/components/ui/GradientButton';
import { cn, formatPrice, calculateDiscount } from '@/lib/utils';
import { useState } from 'react';

interface ProductCardProps {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { addItem } = useCartStore();
  const [isWishlisted, setIsWishlisted] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (product.stock <= 0) {
      toast.error('Sản phẩm đã hết hàng');
      return;
    }

    addItem(product, 1);
    toast.success(`Đã thêm ${product.name} vào giỏ hàng`);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
    toast.success(isWishlisted ? 'Đã xóa khỏi yêu thích' : 'Đã thêm vào yêu thích');
  };

  const productImage = (() => {
    try {
      const images: string[] = JSON.parse(product.images);
      return images[0] || 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=400';
    } catch {
      return 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=400';
    }
  })();

  const discount = product.comparePrice && product.comparePrice > product.price
    ? calculateDiscount(product.comparePrice, product.price)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link href={`/products/${product.slug}`} className="group block">
        <GlassCard hover className="overflow-hidden">
          {/* Image Container */}
          <div className="relative aspect-square overflow-hidden rounded-t-xl bg-gray-100">
            <Image
              src={productImage}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              priority={false}
            />

            {/* Badges */}
            {discount > 0 && (
              <span className="absolute top-3 left-3 px-2 py-1 text-xs font-bold text-white bg-red-500 rounded-full">
                -{discount}%
              </span>
            )}

            {/* Out of Stock Overlay */}
            {product.stock <= 0 && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                <span className="text-sm font-bold text-white px-3 py-1 bg-red-500 rounded">
                  Hết hàng
                </span>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-5">
            {/* Category */}
            <p className="text-xs font-medium text-primary-600 dark:text-primary-400 mb-2 uppercase tracking-wider">
              {product.category.name}
            </p>

            {/* Title */}
            <h3 className="font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 group-hover:text-primary-600 transition-colors">
              {product.name}
            </h3>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "h-4 w-4",
                      i < Math.round(product.avgRating || 0)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300 dark:text-gray-600'
                    )}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                ({product.reviewCount || 0})
              </span>
            </div>

            {/* Price */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex flex-col">
                <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                  {formatPrice(product.price)}
                </span>
                {product.comparePrice && product.comparePrice > product.price && (
                  <span className="text-sm text-gray-500 line-through">
                    {formatPrice(product.comparePrice)}
                  </span>
                )}
              </div>
              <div className="text-right">
                <span className={cn(
                  "text-xs font-medium px-2 py-1 rounded-full",
                  product.stock > 10
                    ? "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400"
                    : product.stock > 0
                      ? "bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-400"
                      : "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-400"
                )}>
                  {product.stock > 10 ? 'Còn hàng' : product.stock > 0 ? `Còn ${product.stock}` : 'Hết hàng'}
                </span>
              </div>
            </div>

            {/* Add to Cart Button */}
            <GradientButton
              onClick={() => handleAddToCart({} as React.MouseEvent)}
              disabled={product.stock <= 0}
              className="w-full"
              size="sm"
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              {product.stock <= 0 ? 'Hết hàng' : 'Thêm vào giỏ'}
            </GradientButton>
          </div>
        </GlassCard>
      </Link>
    </motion.div>
  );
}