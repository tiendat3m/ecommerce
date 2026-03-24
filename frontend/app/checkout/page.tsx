'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CreditCard, Truck, MapPin } from 'lucide-react';
import api from '@/lib/axios';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { toast } from 'sonner';

const checkoutSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  phone: z.string().min(10, 'Valid phone number is required'),
  street: z.string().min(5, 'Street address is required'),
  city: z.string().min(2, 'City is required'),
  province: z.string().min(2, 'Province is required'),
  note: z.string().optional(),
});

type CheckoutInput = z.infer<typeof checkoutSchema>;

export default function CheckoutPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { items, getTotal, clearCart } = useCartStore();
  const { user, isAuthenticated } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutInput>({
    resolver: zodResolver(checkoutSchema),
  });

  if (!isAuthenticated) {
    router.push('/login');
    return null;
  }

  if (items.length === 0) {
    router.push('/cart');
    return null;
  }

  const shipping = getTotal() >= 100 ? 0 : 10;
  const total = getTotal() + shipping;

  const onSubmit = async (data: CheckoutInput) => {
    setIsLoading(true);
    try {
      const orderData = {
        items: items.map(item => ({
          productId: item.product.id,
          quantity: item.quantity,
        })),
        shippingAddress: {
          fullName: data.fullName,
          phone: data.phone,
          street: data.street,
          city: data.city,
          province: data.province,
        },
        note: data.note,
      };

      const res = await api.post('/orders', orderData);
      const orderId = res.data.data.id;

      // Create payment intent
      const paymentRes = await api.post('/payment/create-intent', { orderId });
      const { clientSecret } = paymentRes.data.data;

      // For demo, we'll simulate payment success
      // In real app, you'd use Stripe Elements here
      clearCart();
      toast.success('Order placed successfully!');
      router.push(`/checkout/success?orderId=${orderId}`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Checkout failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-3xl font-bold">Checkout</h1>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Checkout Form */}
        <div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Shipping Information */}
            <div className="card">
              <div className="mb-4 flex items-center gap-2">
                <Truck className="h-5 w-5 text-primary-600" />
                <h2 className="text-lg font-semibold">Shipping Information</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="label">Full Name</label>
                  <input
                    {...register('fullName')}
                    type="text"
                    className="input"
                    defaultValue={user?.name}
                    placeholder="John Doe"
                  />
                  {errors.fullName && (
                    <p className="mt-1 text-sm text-red-500">{errors.fullName.message}</p>
                  )}
                </div>

                <div>
                  <label className="label">Phone Number</label>
                  <input
                    {...register('phone')}
                    type="tel"
                    className="input"
                    placeholder="+1 (555) 123-4567"
                  />
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-500">{errors.phone.message}</p>
                  )}
                </div>

                <div>
                  <label className="label">Street Address</label>
                  <input
                    {...register('street')}
                    type="text"
                    className="input"
                    placeholder="123 Main Street"
                  />
                  {errors.street && (
                    <p className="mt-1 text-sm text-red-500">{errors.street.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">City</label>
                    <input
                      {...register('city')}
                      type="text"
                      className="input"
                      placeholder="New York"
                    />
                    {errors.city && (
                      <p className="mt-1 text-sm text-red-500">{errors.city.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="label">Province/State</label>
                    <input
                      {...register('province')}
                      type="text"
                      className="input"
                      placeholder="NY"
                    />
                    {errors.province && (
                      <p className="mt-1 text-sm text-red-500">{errors.province.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="label">Order Note (Optional)</label>
                  <textarea
                    {...register('note')}
                    className="input"
                    rows={3}
                    placeholder="Special delivery instructions..."
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="card">
              <div className="mb-4 flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-primary-600" />
                <h2 className="text-lg font-semibold">Payment Method</h2>
              </div>

              <div className="rounded-lg border p-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  For demo purposes, payment will be simulated as successful.
                  In production, Stripe Elements would be integrated here.
                </p>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary w-full"
            >
              {isLoading ? 'Processing...' : `Place Order - $${total.toLocaleString()}`}
            </button>
          </form>
        </div>

        {/* Order Summary */}
        <div>
          <div className="card sticky top-8">
            <h2 className="mb-4 text-lg font-semibold">Order Summary</h2>

            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.product.id} className="flex gap-3">
                  <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg">
                    <img
                      src={item.product.images[0] || 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=100'}
                      alt={item.product.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-medium">{item.product.name}</h3>
                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                    <p className="text-sm font-semibold text-primary-600">
                      ${(item.product.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 space-y-3 border-t pt-6">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                <span>${getTotal().toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Shipping</span>
                <span>{shipping === 0 ? 'Free' : `$${shipping}`}</span>
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span className="text-primary-600">${total.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Free shipping on orders over $100
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}