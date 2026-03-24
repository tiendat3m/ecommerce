'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, Package, Truck, CheckCircle, XCircle, Clock } from 'lucide-react';
import api from '@/lib/axios';
import { Order } from '@/types';

export default function OrderDetailPage() {
  const params = useParams();
  const orderId = params.id as string;
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      const res = await api.get(`/orders/${orderId}`);
      setOrder(res.data.data);
    } catch (error) {
      console.error('Error fetching order:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Clock className="h-6 w-6 text-yellow-500" />;
      case 'PROCESSING':
        return <Package className="h-6 w-6 text-blue-500" />;
      case 'SHIPPED':
        return <Truck className="h-6 w-6 text-purple-500" />;
      case 'DELIVERED':
        return <CheckCircle className="h-6 w-6 text-green-500" />;
      case 'CANCELLED':
        return <XCircle className="h-6 w-6 text-red-500" />;
      default:
        return <Clock className="h-6 w-6 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'PROCESSING':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'SHIPPED':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'DELIVERED':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="mb-8 h-8 w-48 rounded bg-gray-200 dark:bg-gray-700"></div>
        <div className="card">
          <div className="h-40 w-full rounded bg-gray-200 dark:bg-gray-700"></div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center">
        <h1 className="mb-4 text-2xl font-bold">Order not found</h1>
        <Link href="/account/orders" className="btn btn-primary">
          Back to Orders
        </Link>
      </div>
    );
  }

  return (
    <div>
      <Link
        href="/account/orders"
        className="mb-6 inline-flex items-center text-gray-600 hover:text-primary-600 dark:text-gray-400"
      >
        <ChevronLeft className="mr-1 h-4 w-4" />
        Back to Orders
      </Link>

      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Order #{order.id.slice(-8)}</h1>
        <span className={`rounded-full px-4 py-2 text-sm font-medium ${getStatusColor(order.status)}`}>
          {order.status}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Order Items */}
        <div className="lg:col-span-2">
          <div className="card">
            <h2 className="mb-4 text-lg font-semibold">Order Items</h2>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg">
                    <Image
                      src={item.snapshot.image || 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=100'}
                      alt={item.snapshot.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{item.snapshot.name}</h3>
                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                    <p className="font-semibold text-primary-600">
                      ${(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Timeline */}
          <div className="card mt-6">
            <h2 className="mb-4 text-lg font-semibold">Order Timeline</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                {getStatusIcon(order.status)}
                <div>
                  <p className="font-medium">Order {order.status.toLowerCase()}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(order.updatedAt).toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 opacity-60">
                <Clock className="h-6 w-6" />
                <div>
                  <p className="font-medium">Order placed</p>
                  <p className="text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div>
          <div className="card">
            <h2 className="mb-4 text-lg font-semibold">Order Summary</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                <span>${order.total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Shipping</span>
                <span>{order.total >= 100 ? 'Free' : '$10'}</span>
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span className="text-primary-600">
                    ${(order.total + (order.total >= 100 ? 0 : 10)).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="card mt-6">
            <h2 className="mb-4 text-lg font-semibold">Shipping Address</h2>
            <div className="text-sm">
              <p className="font-medium">{order.shippingAddress.fullName}</p>
              <p className="text-gray-600 dark:text-gray-400">
                {order.shippingAddress.street}<br />
                {order.shippingAddress.city}, {order.shippingAddress.province}<br />
                Phone: {order.shippingAddress.phone}
              </p>
            </div>
          </div>

          {/* Payment Status */}
          <div className="card mt-6">
            <h2 className="mb-4 text-lg font-semibold">Payment Status</h2>
            <div className="flex items-center gap-2">
              <div className={`h-3 w-3 rounded-full ${
                order.paymentStatus === 'PAID' ? 'bg-green-500' : 'bg-yellow-500'
              }`}></div>
              <span className={order.paymentStatus === 'PAID' ? 'text-green-600' : 'text-yellow-600'}>
                {order.paymentStatus}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}