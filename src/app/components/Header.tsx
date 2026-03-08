'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib';
import type { User } from '@/lib';

export default function Header() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = apiClient.getToken();
      if (token) {
        setIsLoggedIn(true);
        try {
          const response = await apiClient.getCurrentUser();
          setUser(response.data);
        } catch (error) {
          console.error('Failed to fetch user:', error);
          setIsLoggedIn(false);
          setUser(null);
        }
      } else {
        setIsLoggedIn(false);
        setUser(null);
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const [isScrolled, setIsScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getUserInitials = (user: User | null): string => {
    if (!user) return '';
    const firstInitial = user.firstName?.[0]?.toUpperCase() || '';
    const lastInitial = user.lastName?.[0]?.toUpperCase() || '';
    return `${firstInitial}${lastInitial}`;
  };

  return (
    <header className={`fixed w-full top-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-background shadow-sm border-b border-gray-200/50 py-2' : 'bg-transparent py-4'}`}>
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2 group">
              <span className="text-2xl sm:text-3xl grayscale group-hover:grayscale-0 transition-all duration-500">🌿</span>
              <span className="text-xl sm:text-2xl font-medium tracking-tight text-foreground">Flight Travel</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className="text-foreground hover:text-primary-600 transition-colors font-medium text-xs tracking-wider uppercase"
            >
              Home
            </Link>
            <Link
              href="/blogs"
              className="text-foreground hover:text-primary-600 transition-colors font-medium text-xs tracking-wider uppercase"
            >
              Stories
            </Link>
            <Link
              href="/about"
              className="text-foreground hover:text-primary-600 transition-colors font-medium text-xs tracking-wider uppercase"
            >
              Cabins
            </Link>
            <Link
              href="/contact"
              className="text-foreground hover:text-primary-600 transition-colors font-medium text-xs tracking-wider uppercase"
            >
              Contact
            </Link>
            {!loading && isLoggedIn && user ? (
              <Link
                href="/me"
                className="w-10 h-10 flex items-center justify-center bg-primary-700 text-white rounded-full hover:bg-primary-800 transition-colors font-medium text-sm"
                title={`${user.firstName} ${user.lastName}`}
              >
                {getUserInitials(user)}
              </Link>
            ) : !loading && !isLoggedIn ? (
              <Link
                href="/login"
                className="btn-primary"
              >
                Sign In
              </Link>
            ) : null}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-md text-foreground hover:text-primary-600 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-2 bg-background/95 backdrop-blur-sm rounded-lg mt-2 px-4 shadow-lg border border-gray-100/50">
            <Link
              href="/"
              className="block px-3 py-2 text-foreground hover:text-primary-700 font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/blogs"
              className="block px-3 py-2 text-foreground hover:text-primary-700 font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Blogs
            </Link>
            <Link
              href="/about"
              className="block px-3 py-2 text-foreground hover:text-primary-700 font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            <Link
              href="/contact"
              className="block px-3 py-2 text-foreground hover:text-primary-700 font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>
            {!loading && isLoggedIn && user ? (
              <Link
                href="/me"
                className="block px-3 py-2 bg-primary-700 text-white rounded-md mt-4 text-center font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                <div className="flex items-center justify-center space-x-2">
                  <span>My Profile</span>
                </div>
              </Link>
            ) : !loading && !isLoggedIn ? (
              <Link
                href="/login"
                className="block px-3 py-2 bg-primary-700 text-white rounded-md mt-4 text-center font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </Link>
            ) : null}
          </div>
        )}
      </nav>
    </header>
  );
}
