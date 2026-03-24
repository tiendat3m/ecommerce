'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { ArrowRight, Star, Truck, Shield, Headphones, Zap, Gift, Sparkles } from 'lucide-react';
import api from '@/lib/axios';
import { Product, Category } from '@/types';
import ProductCard from '@/components/products/ProductCard';
import GlassCard from '@/components/ui/GlassCard';
import GradientButton from '@/components/ui/GradientButton';
import AnimatedText from '@/components/ui/AnimatedText';

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const heroRef = useRef(null);
  const featuresRef = useRef(null);
  const categoriesRef = useRef(null);
  const productsRef = useRef(null);

  const isHeroInView = useInView(heroRef, { once: true });
  const isFeaturesInView = useInView(featuresRef, { once: true });
  const isCategoriesInView = useInView(categoriesRef, { once: true });
  const isProductsInView = useInView(productsRef, { once: true });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          api.get('/products?featured=true&limit=8'),
          api.get('/categories'),
        ]);
        setFeaturedProducts(productsRes.data.data);
        setCategories(categoriesRes.data.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const features = [
    {
      icon: Truck,
      title: 'Miễn phí vận chuyển',
      description: 'Giao hàng miễn phí cho đơn hàng trên 500.000đ',
      color: 'from-primary-500 to-primary-600',
    },
    {
      icon: Shield,
      title: 'Bảo hành chính hãng',
      description: '100% sản phẩm chính hãng, bảo hành toàn quốc',
      color: 'from-secondary-500 to-secondary-600',
    },
    {
      icon: Headphones,
      title: 'Hỗ trợ 24/7',
      description: 'Tư vấn miễn phí, hỗ trợ tận tâm',
      color: 'from-accent-500 to-accent-600',
    },
    {
      icon: Zap,
      title: 'Giao hàng nhanh',
      description: 'Giao hàng trong 2 giờ tại nội thành',
      color: 'from-yellow-500 to-orange-500',
    },
  ];

  const stats = [
    { number: '10K+', label: 'Khách hàng hài lòng' },
    { number: '500+', label: 'Sản phẩm chính hãng' },
    { number: '99%', label: 'Đánh giá tích cực' },
    { number: '24/7', label: 'Hỗ trợ khách hàng' },
  ];

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section
        ref={heroRef}
        className="relative min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-primary-500 via-primary-600 to-accent-500 overflow-hidden"
      >
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <div className="text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start gap-2 mb-6">
                <Sparkles className="h-5 w-5 text-yellow-300" />
                <span className="text-white/90 font-medium">Mua sắm công nghệ Việt Nam</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                TechMart
                <span className="block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                  Việt Nam
                </span>
              </h1>

              <p className="text-lg text-white/80 mb-8 max-w-lg mx-auto lg:mx-0">
                Điện thoại, laptop, máy tính bảng, phụ kiện chính hãng từ Samsung, Apple, Xiaomi, OPPO, Sony và nhiều hãng khác với giá tốt nhất.
              </p>

              <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                <GradientButton
                  size="lg"
                  variant="secondary"
                  onClick={() => window.location.href = '/products'}
                >
                  Mua sắm ngay <ArrowRight className="ml-2 h-5 w-5" />
                </GradientButton>
                <GradientButton
                  size="lg"
                  variant="primary"
                  onClick={() => window.location.href = '/products?featured=true'}
                >
                  Sản phẩm nổi bật
                </GradientButton>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-2xl md:text-3xl font-bold text-white mb-1">
                      {stat.number}
                    </div>
                    <div className="text-white/70 text-sm">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="relative h-64 md:h-80 lg:h-96 rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&h=400&fit=crop"
                  alt="Apple Products"
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        ref={featuresRef}
        className="py-20 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isFeaturesInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                Tại sao chọn chúng tôi?
              </span>
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Cam kết mang đến trải nghiệm mua sắm tốt nhất với dịch vụ chuyên nghiệp
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={isFeaturesInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <GlassCard hover className="p-6 text-center h-full">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.color} mb-6`}>
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold mb-3">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section
        ref={categoriesRef}
        className="py-20 bg-white dark:bg-gray-900"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isCategoriesInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                Danh mục sản phẩm
              </span>
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Khám phá bộ sưu tập Apple chính hãng đa dạng
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={isCategoriesInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link href={`/products?category=${category.slug}`} className="group block">
                  <GlassCard hover className="p-4 text-center">
                    <div className="relative mb-4 aspect-square overflow-hidden rounded-xl">
                      <Image
                        src={category.image || 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=400'}
                        alt={category.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                    </div>
                    <h3 className="font-semibold text-sm mb-1">{category.name}</h3>
                    {category.productCount !== undefined && (
                      <p className="text-xs text-gray-500">
                        {category.productCount} sản phẩm
                      </p>
                    )}
                  </GlassCard>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section
        ref={productsRef}
        className="py-20 bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isProductsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                Sản phẩm nổi bật
              </span>
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Những sản phẩm được yêu thích nhất hiện nay
            </p>
          </motion.div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[...Array(8)].map((_, i) => (
                <GlassCard key={i} className="animate-pulse">
                  <div className="aspect-square rounded-xl bg-gray-200 dark:bg-gray-700 mb-4"></div>
                  <div className="space-y-3">
                    <div className="h-4 w-3/4 rounded bg-gray-200 dark:bg-gray-700"></div>
                    <div className="h-4 w-1/2 rounded bg-gray-200 dark:bg-gray-700"></div>
                    <div className="h-6 w-1/3 rounded bg-gray-200 dark:bg-gray-700"></div>
                  </div>
                </GlassCard>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredProducts.map((product: Product, index: number) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={isProductsInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isProductsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mt-12 text-center"
          >
            <GradientButton
              size="lg"
              onClick={() => window.location.href = '/products'}
            >
              Xem tất cả sản phẩm <ArrowRight className="ml-2 h-5 w-5" />
            </GradientButton>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 via-primary-700 to-accent-600 relative overflow-hidden">
        <div className="absolute inset-0">
          <motion.div
            animate={{
              rotate: 360,
              scale: [1, 1.3, 1],
            }}
            transition={{
              duration: 30,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute top-0 left-0 w-full h-full"
          >
            <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-white/5 rounded-full blur-xl" />
            <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-white/5 rounded-full blur-xl" />
          </motion.div>
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Sẵn sàng mua sắm?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Đăng ký ngay để nhận ưu đãi đặc biệt và cập nhật sản phẩm mới nhất!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <GradientButton
                size="lg"
                variant="secondary"
                onClick={() => window.location.href = '/register'}
              >
                Tạo tài khoản <ArrowRight className="ml-2 h-5 w-5" />
              </GradientButton>
              <GradientButton
                size="lg"
                variant="primary"
                onClick={() => window.location.href = '/products'}
              >
                Khám phá sản phẩm
              </GradientButton>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}