'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';

export default function CartPage() {
  const { items, updateQuantity, removeItem, getTotal } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <ShoppingBag className="mx-auto mb-4 h-16 w-16 text-gray-400" />
        <h1 className="mb-4 text-2xl font-bold">Your cart is empty</h1>
        <p className="mb-8 text-gray-600 dark:text-gray-400">
          Looks like you haven't added any items yet.
        </p>
        <Link href="/products" className="btn btn-primary">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-3xl font-bold">Shopping Cart</h1>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.product.id} className="card flex gap-4">
                <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg">
                  <Image
                    src={item.product.images[0] || 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=200'}
                    alt={item.product.name}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="flex flex-1 flex-col">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="font-semibold">{item.product.name}</h3>
                      <p className="text-sm text-gray-500">{item.product.category.name}</p>
                    </div>
                    <button
                      onClick={() => removeItem(item.product.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="mt-auto flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        className="rounded-lg border p-1 hover:bg-gray-50 disabled:opacity-50 dark:hover:bg-gray-800"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        disabled={item.quantity >= item.product.stock}
                        className="rounded-lg border p-1 hover:bg-gray-50 disabled:opacity-50 dark:hover:bg-gray-800"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                    <span className="font-semibold text-primary-600">
                      ${(item.product.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div>
          <div className="card">
            <h2 className="mb-4 text-lg font-semibold">Order Summary</h2>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                <span>${getTotal().toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Shipping</span>
                <span>{getTotal() >= 100 ? 'Free' : '$10'}</span>
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span className="text-primary-600">
                    ${(getTotal() + (getTotal() >= 100 ? 0 : 10)).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {getTotal() < 100 && (
              <p className="mt-4 text-sm text-gray-500">
                Add ${(100 - getTotal()).toLocaleString()} more for free shipping!
              </p>
            )}

            <Link
              href={isAuthenticated ? '/checkout' : '/login'}
              className="btn btn-primary mt-6 w-full"
            >
              Proceed to Checkout <ArrowRight className="ml-2 h-4 w-4" />
            </Link>

            <Link
              href="/products"
              className="btn btn-outline mt-3 w-full"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}