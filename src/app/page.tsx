import Link from 'next/link';
import { apiClient } from '@/lib';
import SearchForm from './components/SearchForm';
import BlogCard from './components/BlogCard';

// Helper function to get featured image URL
function getFeaturedImageUrl(blog: any): string | null {
  if (blog.images && blog.images.length > 0) {
    const featuredImage = blog.images.find((img: any) => img.isFeaturedImage);
    if (featuredImage) {
      const url = featuredImage.url;
      if (url.startsWith('http://') || url.startsWith('https://')) {
        return url;
      }
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3000';
      return `${apiUrl}${url}`;
    }
    // Fallback to first image if no featured image is set
    const firstImage = blog.images[0];
    const url = firstImage.url;
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3000';
    return `${apiUrl}${url}`;
  }
  // Fallback to old featuredImage field
  return blog.featuredImage || null;
}

// Helper function to fetch blogs with timeout
async function fetchBlogsWithTimeout(timeoutMs: number = 10000): Promise<any[]> {
  return Promise.race([
    apiClient.getBlogs(1, 3, true).then((response) => response.data),
    new Promise<any[]>((_, reject) => setTimeout(() => reject(new Error('Timeout')), timeoutMs)),
  ]).catch((error: any) => {
    console.error('Error fetching featured blogs:', error);
    console.error('API URL:', process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000');
    return [];
  });
}

async function getFeaturedBlogs() {
  return fetchBlogsWithTimeout(10000);
}

export default async function HomePage() {
  const featuredBlogs = await getFeaturedBlogs();

  return (
    <>
      {/* Hero Section with Search - Expedia Style */}
      <section className="relative bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 text-white">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24">
          <div className="text-center mb-8 sm:mb-12">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4">
              Where to?
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-primary-100 px-4">
              Search flights, hotels, and travel packages
            </p>
          </div>

          {/* Search Form - Expedia Style */}
          <SearchForm />
        </div>
      </section>

      {/* Quick Links Section */}
      <section className="py-8 sm:py-12 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
            <Link
              href="/blogs"
              className="flex items-center space-x-2 text-gray-700 hover:text-primary-500 transition-colors"
            >
              <span className="text-2xl">✈️</span>
              <span className="font-medium">Travel Blogs</span>
            </Link>
            <Link
              href="/about"
              className="flex items-center space-x-2 text-gray-700 hover:text-primary-500 transition-colors"
            >
              <span className="text-2xl">🏨</span>
              <span className="font-medium">Hotels</span>
            </Link>
            <Link
              href="/contact"
              className="flex items-center space-x-2 text-gray-700 hover:text-primary-500 transition-colors"
            >
              <span className="text-2xl">🚗</span>
              <span className="font-medium">Car Rentals</span>
            </Link>
            <Link
              href="/contact"
              className="flex items-center space-x-2 text-gray-700 hover:text-primary-500 transition-colors"
            >
              <span className="text-2xl">🎫</span>
              <span className="font-medium">Activities</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section - Expedia Style Cards */}
      <section className="py-12 sm:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12 text-gray-900">
            Why book with us?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <div className="bg-white rounded-lg shadow-md p-6 sm:p-8 hover:shadow-xl transition-shadow">
              <div className="text-4xl sm:text-5xl mb-3 sm:mb-4">🌍</div>
              <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-gray-900">
                Best Price Guarantee
              </h3>
              <p className="text-sm sm:text-base text-gray-600">
                Find a lower price? We&apos;ll match it and give you 10% back in Expedia Rewards.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 sm:p-8 hover:shadow-xl transition-shadow">
              <div className="text-4xl sm:text-5xl mb-3 sm:mb-4">⭐</div>
              <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-gray-900">
                Free Cancellation
              </h3>
              <p className="text-sm sm:text-base text-gray-600">
                Cancel for free on most hotels up to 24 hours before your trip.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 sm:p-8 hover:shadow-xl transition-shadow sm:col-span-2 lg:col-span-1">
              <div className="text-4xl sm:text-5xl mb-3 sm:mb-4">🛡️</div>
              <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-gray-900">
                24/7 Support
              </h3>
              <p className="text-sm sm:text-base text-gray-600">
                Our dedicated team is available round the clock to assist you with any questions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Blogs Section - Expedia Style */}
      {featuredBlogs.length > 0 && (
        <section className="py-12 sm:py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Featured Travel Stories
              </h2>
              <Link
                href="/blogs"
                className="text-primary-500 hover:text-primary-600 font-semibold text-sm"
              >
                View all →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {featuredBlogs.map((blog) => {
                const featuredImageUrl = getFeaturedImageUrl(blog);
                return <BlogCard key={blog.id} blog={blog} featuredImageUrl={featuredImageUrl} />;
              })}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-12 sm:py-16 bg-primary-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">
            Ready to explore the world?
          </h2>
          <p className="text-lg sm:text-xl mb-6 sm:mb-8 text-primary-100 px-4">
            Sign up for exclusive deals and travel inspiration
          </p>
          <Link
            href="/contact"
            className="inline-block px-6 sm:px-8 py-2 sm:py-3 bg-white text-primary-500 rounded-md font-bold hover:bg-gray-100 transition-colors text-sm sm:text-base"
          >
            Get Started
          </Link>
        </div>
      </section>
    </>
  );
}
