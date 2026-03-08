'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib';
import type { SignupDto } from '@/lib';

export default function SignupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<SignupDto>({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.signup(formData);
      if (response.success) {
        router.push('/login?registered=true');
      } else {
        setError('Signup failed. Please try again.');
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        'Signup failed. Please try again.';
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
        style={{ backgroundImage: 'url("/modern_treehouse_forest_1772975391211.png")' }}
      ></div>
      <div className="absolute inset-0 z-0 bg-black/40 backdrop-blur-[2px]"></div>

      <div className="relative z-10 max-w-md w-full mx-4 sm:mx-6 lg:mx-8">
        {/* Glassmorphic Auth Card */}
        <div className="bg-white/95 backdrop-blur-md rounded-xl shadow-2xl border border-white/20 p-8 sm:p-10 my-8">
          <div className="text-center mb-10">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <span className="text-4xl grayscale">🌿</span>
              <h1 className="text-3xl font-medium tracking-tight text-foreground">Create Account</h1>
            </div>
            <p className="text-gray-500 font-light">Join Flight Travel today</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-800 rounded-r-md text-sm font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                  First Name
                </label>
                <input
                  id="firstName"
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all outline-none text-foreground placeholder-gray-400 bg-white/50 focus:bg-white"
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name
                </label>
                <input
                  id="lastName"
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all outline-none text-foreground placeholder-gray-400 bg-white/50 focus:bg-white"
                />
              </div>
            </div>

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
                minLength={6}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all outline-none text-foreground placeholder-gray-400 bg-white/50 focus:bg-white"
                placeholder="••••••••"
              />
              <p className="mt-2 text-xs text-gray-400 font-light">Minimum 6 characters</p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3.5 mt-4"
            >
              {loading ? 'Creating account...' : 'Sign Up'}
            </button>
          </form>

          <p className="mt-8 text-center text-sm font-light text-gray-600">
            Already have an account?{' '}
            <a href="/login" className="text-primary-700 hover:text-primary-900 font-medium transition-colors">
              Sign In
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
