'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { MapPin, Plus, Edit, Trash2, Home, X } from 'lucide-react';
import api from '@/lib/axios';
import { Address } from '@/types';
import { toast } from 'sonner';

const addressSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  phone: z.string().min(10, 'Valid phone number is required'),
  street: z.string().min(5, 'Street address is required'),
  city: z.string().min(2, 'City is required'),
  province: z.string().min(2, 'Province is required'),
});

type AddressInput = z.infer<typeof addressSchema>;

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddressInput>({
    resolver: zodResolver(addressSchema),
  });

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const res = await api.get('/users/addresses');
      setAddresses(res.data.data);
    } catch (error) {
      console.error('Error fetching addresses:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: AddressInput) => {
    try {
      if (editingAddress) {
        await api.put(`/users/addresses/${editingAddress.id}`, data);
        toast.success('Address updated successfully');
      } else {
        await api.post('/users/addresses', data);
        toast.success('Address added successfully');
      }
      fetchAddresses();
      closeModal();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to save address');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this address?')) return;
    try {
      await api.delete(`/users/addresses/${id}`);
      toast.success('Address deleted successfully');
      fetchAddresses();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete address');
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      await api.put(`/users/addresses/${id}/default`);
      toast.success('Default address updated');
      fetchAddresses();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to set default');
    }
  };

  const openModal = (address?: Address) => {
    setEditingAddress(address || null);
    if (address) {
      reset({
        fullName: address.fullName,
        phone: address.phone,
        street: address.street,
        city: address.city,
        province: address.province,
      });
    } else {
      reset({});
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingAddress(null);
    reset({});
  };

  if (isLoading) {
    return (
      <div>
        <h1 className="mb-8 text-3xl font-bold">My Addresses</h1>
        <div className="space-y-4">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="card animate-pulse">
              <div className="h-20 w-full rounded bg-gray-200 dark:bg-gray-700"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">My Addresses</h1>
        <button onClick={() => openModal()} className="btn btn-primary">
          <Plus className="mr-2 h-4 w-4" />
          Add Address
        </button>
      </div>

      {addresses.length === 0 ? (
        <div className="card text-center">
          <MapPin className="mx-auto mb-4 h-16 w-16 text-gray-400" />
          <h2 className="mb-2 text-xl font-semibold">No addresses yet</h2>
          <p className="mb-4 text-gray-600 dark:text-gray-400">
            Add a shipping address to make checkout faster.
          </p>
          <button onClick={() => openModal()} className="btn btn-primary">
            Add Your First Address
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {addresses.map((address) => (
            <div key={address.id} className="card">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900">
                    {address.isDefault ? (
                      <Home className="h-5 w-5 text-primary-600" />
                    ) : (
                      <MapPin className="h-5 w-5 text-primary-600" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{address.fullName}</h3>
                      {address.isDefault && (
                        <span className="rounded-full bg-primary-100 px-2 py-0.5 text-xs text-primary-600 dark:bg-primary-900">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 dark:text-gray-400">
                      {address.street}, {address.city}, {address.province}
                    </p>
                    <p className="text-sm text-gray-500">{address.phone}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => openModal(address)}
                    className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(address.id)}
                    className="rounded-lg p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {!address.isDefault && (
                <div className="mt-4 border-t pt-4">
                  <button
                    onClick={() => handleSetDefault(address.id)}
                    className="text-sm text-primary-600 hover:underline"
                  >
                    Set as default address
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="mx-4 w-full max-w-md rounded-lg bg-white p-6 dark:bg-gray-800">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold">
                {editingAddress ? 'Edit Address' : 'Add New Address'}
              </h2>
              <button onClick={closeModal} className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-700">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="label">Full Name</label>
                <input {...register('fullName')} type="text" className="input" placeholder="John Doe" />
                {errors.fullName && (
                  <p className="mt-1 text-sm text-red-500">{errors.fullName.message}</p>
                )}
              </div>

              <div>
                <label className="label">Phone Number</label>
                <input {...register('phone')} type="tel" className="input" placeholder="+1 (555) 123-4567" />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-500">{errors.phone.message}</p>
                )}
              </div>

              <div>
                <label className="label">Street Address</label>
                <input {...register('street')} type="text" className="input" placeholder="123 Main Street" />
                {errors.street && (
                  <p className="mt-1 text-sm text-red-500">{errors.street.message}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">City</label>
                  <input {...register('city')} type="text" className="input" placeholder="New York" />
                  {errors.city && (
                    <p className="mt-1 text-sm text-red-500">{errors.city.message}</p>
                  )}
                </div>

                <div>
                  <label className="label">Province/State</label>
                  <input {...register('province')} type="text" className="input" placeholder="NY" />
                  {errors.province && (
                    <p className="mt-1 text-sm text-red-500">{errors.province.message}</p>
                  )}
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button type="button" onClick={closeModal} className="btn btn-outline flex-1">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary flex-1">
                  {editingAddress ? 'Update' : 'Add'} Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}