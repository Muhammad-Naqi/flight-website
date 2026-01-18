'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from 'react-query';
import { apiClient, UserStatus } from '@/lib';
import type { User } from '@/lib';

export default function MePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  const { data, isLoading, error } = useQuery('current-user', () => apiClient.getCurrentUser());

  useEffect(() => {
    const token = apiClient.getToken();
    if (!token) {
      router.push('/login');
      return;
    }
    setLoading(false);
  }, [router]);

  useEffect(() => {
    if (error && !isLoading) {
      // If there's an error and we're not loading, redirect to login
      const timer = setTimeout(() => {
        router.push('/login');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [error, isLoading, router]);

  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-red-600 mb-4">Failed to load profile. Redirecting to login...</p>
        </div>
      </div>
    );
  }

  const user: User = data.data;

  const handleLogout = () => {
    apiClient.logout();
    router.push('/');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900">My Account</h1>
        <p className="text-gray-600 mt-2">Manage your account information</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-8">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Personal Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <p className="text-gray-900 text-lg">
                {user.firstName} {user.lastName}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <p className="text-gray-900 text-lg">{user.email}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <span className="inline-block px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm font-medium">
                {user.role}
              </span>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Account Status</label>
              <span
                className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                  String(user.status || '').toUpperCase() === UserStatus.ACTIVE ||
                  (user.isActive && !user.status)
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {String(user.status || '').toUpperCase() === UserStatus.ACTIVE ||
                (user.isActive && !user.status)
                  ? 'Active'
                  : 'Inactive'}
              </span>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Member Since</label>
              <p className="text-gray-900">
                {new Date(user.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <button
            onClick={handleLogout}
            className="px-6 py-3 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors font-semibold"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
