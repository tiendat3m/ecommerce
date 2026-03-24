'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingCart, User, Menu, X, Search, Heart } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';
import FloatingNavbar from '@/components/ui/FloatingNavbar';
import GradientButton from '@/components/ui/GradientButton';
import { cn } from '@/lib/utils';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { getItemCount } = useCartStore();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <FloatingNavbar>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <motion.span
              className="text-xl font-bold bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent whitespace-nowrap"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              🛒 TechMart VN
            </motion.span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex md:items-center md:space-x-8 md:ml-12">
            {[
              { href: '/', label: 'Trang chủ' },
              { href: '/products', label: 'Sản phẩm' },
              { href: '/products?featured=true', label: 'Nổi bật' },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-gray-700 hover:text-primary-600 dark:text-gray-300 font-medium transition-colors whitespace-nowrap"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hidden md:flex md:flex-1 md:max-w-md md:mx-8">
            <div className="relative w-full group">
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-full border border-gray-200 bg-white/50 backdrop-blur-sm py-2.5 pl-10 pr-4 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:bg-white transition-all duration-300 dark:border-gray-600 dark:bg-gray-800/50 dark:text-white"
              />
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
            </div>
          </form>

          {/* Desktop Actions */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {/* Wishlist */}
            <Link href="/wishlist" className="relative p-2 text-gray-700 hover:text-primary-600 dark:text-gray-300 transition-colors">
              <Heart className="h-6 w-6" />
            </Link>

            {/* Cart */}
            <Link href="/cart" className="relative p-2 text-gray-700 hover:text-primary-600 dark:text-gray-300 transition-colors group">
              <ShoppingCart className="h-6 w-6" />
              {getItemCount() > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-r from-primary-500 to-accent-500 text-xs text-white font-bold"
                >
                  {getItemCount()}
                </motion.span>
              )}
            </Link>

            {/* User Menu */}
            {isAuthenticated ? (
              <div className="relative group">
                <button className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 dark:text-gray-300 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary-500 to-accent-500 flex items-center justify-center">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <span className="font-medium">{user?.name}</span>
                </button>
                <div className="absolute right-0 mt-2 w-48 rounded-xl bg-white/90 backdrop-blur-xl py-2 shadow-xl ring-1 ring-black/5 dark:bg-gray-800/90 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                  <Link href="/account" className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors">
                    Tài khoản của tôi
                  </Link>
                  <Link href="/account/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors">
                    Đơn hàng
                  </Link>
                  {user?.role === 'ADMIN' && (
                    <Link href="/admin" className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors">
                      Quản trị
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-primary-50 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
                  >
                    Đăng xuất
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link href="/login" className="text-gray-700 hover:text-primary-600 dark:text-gray-300 font-medium transition-colors">
                  Đăng nhập
                </Link>
                <GradientButton size="sm" onClick={() => router.push('/register')}>
                  Đăng ký
                </GradientButton>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-gray-700 dark:text-gray-300"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden overflow-hidden"
            >
              <div className="space-y-4 pb-4">
                {/* Mobile Search */}
                <form onSubmit={handleSearch}>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Tìm kiếm sản phẩm..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full rounded-full border border-gray-200 bg-white/50 backdrop-blur-sm py-2.5 pl-10 pr-4 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 dark:border-gray-600 dark:bg-gray-800/50 dark:text-white"
                    />
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  </div>
                </form>

                {/* Mobile Navigation */}
                <nav className="space-y-2">
                  {[
                    { href: '/', label: 'Trang chủ' },
                    { href: '/products', label: 'Sản phẩm' },
                    { href: '/cart', label: `Giỏ hàng (${getItemCount()})` },
                    { href: '/wishlist', label: 'Yêu thích' },
                  ].map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="block py-2 text-gray-700 hover:text-primary-600 dark:text-gray-300 font-medium transition-colors"
                    >
                      {item.label}
                    </Link>
                  ))}
                </nav>

                {/* Mobile Auth */}
                {isAuthenticated ? (
                  <div className="space-y-2 border-t border-gray-200 dark:border-gray-700 pt-4">
                    <Link href="/account" className="block py-2 text-gray-700 hover:text-primary-600 dark:text-gray-300 transition-colors">
                      Tài khoản của tôi
                    </Link>
                    <Link href="/account/orders" className="block py-2 text-gray-700 hover:text-primary-600 dark:text-gray-300 transition-colors">
                      Đơn hàng
                    </Link>
                    {user?.role === 'ADMIN' && (
                      <Link href="/admin" className="block py-2 text-gray-700 hover:text-primary-600 dark:text-gray-300 transition-colors">
                        Quản trị
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="block w-full py-2 text-left text-gray-700 hover:text-primary-600 dark:text-gray-300 transition-colors"
                    >
                      Đăng xuất
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2 border-t border-gray-200 dark:border-gray-700 pt-4">
                    <Link href="/login" className="block py-2 text-gray-700 hover:text-primary-600 dark:text-gray-300 transition-colors">
                      Đăng nhập
                    </Link>
                    <Link href="/register" className="block py-2 text-gray-700 hover:text-primary-600 dark:text-gray-300 transition-colors">
                      Đăng ký
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </FloatingNavbar>
  );
}