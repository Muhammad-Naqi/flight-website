'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { apiClient } from '@/lib';
import type { LoginDto } from '@/lib';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [formData, setFormData] = useState<LoginDto>({
    email: '',
    password: '',
  });

  useEffect(() => {
    if (searchParams.get('registered') === 'true') {
      setSuccess('Account created successfully! Please sign in.');
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.login(formData);
      if (response.success) {
        window.location.replace('/me');
      } else {
        setError('Login failed. Please check your credentials.');
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        'Login failed. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Premium Image Background */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url("/luxury_tent_mountain_1772975254608.png")' }}
      ></div>
      <div className="absolute inset-0 z-0 bg-black/30 backdrop-blur-[2px]"></div>

      <div className="relative z-10 max-w-md w-full mx-4 sm:mx-6 lg:mx-8">
        {/* Glassmorphic Auth Card */}
        <div className="bg-white/95 backdrop-blur-md rounded-xl shadow-2xl border border-white/20 p-8 sm:p-10">
          <div className="text-center mb-10">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <span className="text-4xl grayscale">🌿</span>
              <h1 className="text-3xl font-medium tracking-tight text-foreground">Sign In</h1>
            </div>
            <p className="text-gray-500 font-light">Welcome back to Flight Travel</p>
          </div>

          {success && (
            <div className="mb-6 p-4 bg-primary-50 border-l-4 border-primary-500 text-primary-800 rounded-r-md text-sm font-medium">
              {success}
            </div>
          )}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-800 rounded-r-md text-sm font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all outline-none text-foreground placeholder-gray-400 bg-white/50 focus:bg-white"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all outline-none text-foreground placeholder-gray-400 bg-white/50 focus:bg-white"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3.5 mt-2"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="mt-8 text-center text-sm font-light text-gray-600">
            Don&apos;t have an account?{' '}
            <a href="/signup" className="text-primary-700 hover:text-primary-900 font-medium transition-colors">
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="text-primary-800 text-lg font-light tracking-widest uppercase animate-pulse">Loading...</div>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
