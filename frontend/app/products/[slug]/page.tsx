'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Star, ShoppingCart, Heart, Share2, ChevronLeft, ChevronRight, Truck, Shield, RotateCcw } from 'lucide-react';
import api from '@/lib/axios';
import { Product, Review } from '@/types';
import { useCartStore } from '@/store/cartStore';
import { toast } from 'sonner';

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCartStore();

  useEffect(() => {
    fetchProduct();
    fetchReviews();
  }, [slug]);

  const fetchProduct = async () => {
    try {
      const res = await api.get(`/products/${slug}`);
      setProduct(res.data.data);
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      // First get product ID from slug
      const productRes = await api.get(`/products/${slug}`);
      const productId = productRes.data.data.id;
      const res = await api.get(`/products/${productId}/reviews`);
      setReviews(res.data.data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    if (product.stock <= 0) {
      toast.error('Product is out of stock');
      return;
    }
    addItem(product, quantity);
    toast.success(`${product.name} added to cart`);
  };

  const handleQuantityChange = (delta: number) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && newQuantity <= (product?.stock || 0)) {
      setQuantity(newQuantity);
    }
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <div className="aspect-square rounded-lg bg-gray-200 dark:bg-gray-700"></div>
            <div className="space-y-4">
              <div className="h-8 w-3/4 rounded bg-gray-200 dark:bg-gray-700"></div>
              <div className="h-4 w-1/2 rounded bg-gray-200 dark:bg-gray-700"></div>
              <div className="h-6 w-1/4 rounded bg-gray-200 dark:bg-gray-700"></div>
              <div className="h-32 w-full rounded bg-gray-200 dark:bg-gray-700"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 text-center sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold">Product not found</h1>
        <Link href="/products" className="btn btn-primary mt-4">
          Back to Products
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav className="mb-8 flex items-center gap-2 text-sm text-gray-500">
        <Link href="/" className="hover:text-primary-600">Home</Link>
        <span>/</span>
        <Link href="/products" className="hover:text-primary-600">Products</Link>
        <span>/</span>
        <Link href={`/products?category=${product.category.slug}`} className="hover:text-primary-600">
          {product.category.name}
        </Link>
        <span>/</span>
        <span className="text-gray-900 dark:text-gray-100">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Image Gallery */}
        <div>
          <div className="relative mb-4 aspect-square overflow-hidden rounded-lg">
            <Image
              src={(() => {
                try {
                  const images: string[] = JSON.parse(product.images);
                  return images[selectedImage] || 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=600';
                } catch {
                  return 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=600';
                }
              })()}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
            {product.comparePrice && product.comparePrice > product.price && (
              <div className="absolute left-4 top-4 rounded-full bg-red-500 px-3 py-1 text-sm text-white">
                -{Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)}% OFF
              </div>
            )}
            {product.stock <= 0 && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <span className="text-2xl font-bold text-white">Out of Stock</span>
              </div>
            )}
          </div>

          {/* Thumbnail Gallery */}
          {(() => {
            try {
              const images: string[] = JSON.parse(product.images);
              return images.length > 1 ? (
                <div className="flex gap-2 overflow-x-auto">
                  {images.map((image: string, index: number) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border-2 ${
                        selectedImage === index ? 'border-primary-500' : 'border-transparent'
                      }`}
                    >
                      <Image
                        src={image}
                        alt={`${product.name} ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              ) : null;
            } catch {
              return null;
            }
          })()}
        </div>

        {/* Product Info */}
        <div>
          <h1 className="mb-2 text-3xl font-bold">{product.name}</h1>
          
          <div className="mb-4 flex items-center gap-4">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${
                    i < Math.round(product.avgRating)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-gray-600 dark:text-gray-400">
              {product.avgRating.toFixed(1)} ({product.reviewCount} reviews)
            </span>
          </div>

          <div className="mb-6">
            <span className="text-3xl font-bold text-primary-600">
              ${product.price.toLocaleString()}
            </span>
            {product.comparePrice && product.comparePrice > product.price && (
              <span className="ml-2 text-xl text-gray-500 line-through">
                ${product.comparePrice.toLocaleString()}
              </span>
            )}
          </div>

          <div className="mb-6">
            <p className="text-gray-700 dark:text-gray-300">{product.description}</p>
          </div>

          {/* Stock Status */}
          <div className="mb-6">
            {product.stock > 0 ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-sm text-green-800 dark:bg-green-900 dark:text-green-200">
                ✓ In Stock ({product.stock} available)
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-3 py-1 text-sm text-red-800 dark:bg-red-900 dark:text-red-200">
                ✗ Out of Stock
              </span>
            )}
          </div>

          {/* Quantity Selector */}
          {product.stock > 0 && (
            <div className="mb-6">
              <label className="label">Quantity</label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                  className="rounded-lg border border-gray-300 p-2 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-600 dark:hover:bg-gray-800"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <span className="w-12 text-center text-lg font-semibold">{quantity}</span>
                <button
                  onClick={() => handleQuantityChange(1)}
                  disabled={quantity >= product.stock}
                  className="rounded-lg border border-gray-300 p-2 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-600 dark:hover:bg-gray-800"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="mb-8 flex gap-4">
            <button
              onClick={handleAddToCart}
              disabled={product.stock <= 0}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ShoppingCart className="h-5 w-5" />
              Add to Cart
            </button>
            <button className="rounded-lg border border-gray-300 p-3 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-800">
              <Heart className="h-5 w-5" />
            </button>
            <button className="rounded-lg border border-gray-300 p-3 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-800">
              <Share2 className="h-5 w-5" />
            </button>
          </div>

          {/* Features */}
          <div className="grid grid-cols-3 gap-4 rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
            <div className="text-center">
              <Truck className="mx-auto mb-2 h-6 w-6 text-primary-600" />
              <p className="text-sm">Free Shipping</p>
            </div>
            <div className="text-center">
              <Shield className="mx-auto mb-2 h-6 w-6 text-primary-600" />
              <p className="text-sm">Secure Payment</p>
            </div>
            <div className="text-center">
              <RotateCcw className="mx-auto mb-2 h-6 w-6 text-primary-600" />
              <p className="text-sm">Easy Returns</p>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-12">
        <h2 className="mb-6 text-2xl font-bold">Customer Reviews</h2>
        {reviews.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400">No reviews yet. Be the first to review this product!</p>
        ) : (
          <div className="space-y-6">
            {reviews.map((review) => (
              <div key={review.id} className="card">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 text-primary-600 dark:bg-primary-900">
                      {review.user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold">{review.user.name}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < review.rating
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                {review.comment && (
                  <p className="text-gray-700 dark:text-gray-300">{review.comment}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}