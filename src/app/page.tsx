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
      {/* Hero Section with Search - Luxury Nature Style */}
      <section className="relative bg-background text-[#272220] py-16 sm:py-24 lg:py-32 overflow-hidden">
        {/* Subtle grid pattern background */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(#272220 1px, transparent 1px), linear-gradient(90deg, #272220 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-20">
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[85px] font-normal tracking-[-0.04em] mb-6 leading-[1.1]">
              Find your <br/> nature escape
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 px-4 font-light max-w-2xl mx-auto">
              Disconnect from the everyday. Reconnect with nature in our curated selection of luxury destinations.
            </p>
          </div>

          {/* Search Form */}
          <div className="max-w-4xl mx-auto">
            <SearchForm />
          </div>
        </div>
      </section>

      {/* Quick Links Section */}
      <section className="py-12 sm:py-16 bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-8 sm:gap-16">
            <Link
              href="/blogs"
              className="flex flex-col items-center space-y-3 group text-[#272220] transition-colors"
            >
              <div className="w-16 h-16 rounded-full bg-[#f4f6f1] flex items-center justify-center text-2xl group-hover:bg-[#e4e9dd] transition-colors">
                ✈️
              </div>
              <span className="font-medium tracking-wide text-xs uppercase opacity-80">Blogs</span>
            </Link>
            <Link
              href="/about"
              className="flex flex-col items-center space-y-3 group text-[#272220] transition-colors"
            >
              <div className="w-16 h-16 rounded-full bg-[#f4f6f1] flex items-center justify-center text-2xl group-hover:bg-[#e4e9dd] transition-colors">
                🪵
              </div>
              <span className="font-medium tracking-wide text-xs uppercase opacity-80">Cabins</span>
            </Link>
            <Link
              href="/contact"
              className="flex flex-col items-center space-y-3 group text-[#272220] transition-colors"
            >
              <div className="w-16 h-16 rounded-full bg-[#f4f6f1] flex items-center justify-center text-2xl group-hover:bg-[#e4e9dd] transition-colors">
                🚗
              </div>
              <span className="font-medium tracking-wide text-xs uppercase opacity-80">Rentals</span>
            </Link>
            <Link
              href="/contact"
              className="flex flex-col items-center space-y-3 group text-[#272220] transition-colors"
            >
              <div className="w-16 h-16 rounded-full bg-[#f4f6f1] flex items-center justify-center text-2xl group-hover:bg-[#e4e9dd] transition-colors">
                🎒
              </div>
              <span className="font-medium tracking-wide text-xs uppercase opacity-80">Activities</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section - Luxury Style Cards */}
      <section className="py-16 sm:py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-normal tracking-[-0.03em] text-center mb-12 sm:mb-16 text-[#272220]">
            The journey awaits
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12">
            <div className="bg-white rounded-lg p-8 sm:p-10 border border-gray-100 hover:border-[#adc09b] transition-colors duration-300">
              <div className="text-3xl mb-6">🌍</div>
              <h3 className="text-xl font-medium mb-3 text-[#272220] tracking-tight">
                Curated Experiences
              </h3>
              <p className="text-base text-gray-500 font-light leading-relaxed">
                Hand-picked destinations that offer the definitive balance of luxury and wild nature.
              </p>
            </div>
            <div className="bg-white rounded-lg p-8 sm:p-10 border border-gray-100 hover:border-[#adc09b] transition-colors duration-300">
              <div className="text-3xl mb-6">⛺</div>
              <h3 className="text-xl font-medium mb-3 text-[#272220] tracking-tight">
                Authentic Stays
              </h3>
              <p className="text-base text-gray-500 font-light leading-relaxed">
                Stay in unique structures built dynamically into their environments for minimal impact.
              </p>
            </div>
            <div className="bg-white rounded-lg p-8 sm:p-10 border border-gray-100 hover:border-[#adc09b] transition-colors duration-300">
              <div className="text-3xl mb-6">🌿</div>
              <h3 className="text-xl font-medium mb-3 text-[#272220] tracking-tight">
                Sustainable Mindset
              </h3>
              <p className="text-base text-gray-500 font-light leading-relaxed">
                We believe in travel that pays to preserve. A percentage goes directly to local conservation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Blogs Section */}
      {featuredBlogs.length > 0 && (
        <section className="py-16 sm:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row justify-between items-baseline gap-4 mb-10 sm:mb-14 border-b border-gray-200 pb-4">
              <h2 className="text-3xl sm:text-4xl font-normal tracking-[-0.03em] text-[#272220]">
                Stories from the wild
              </h2>
              <Link
                href="/blogs"
                className="text-[#455a30] hover:text-[#2f3c22] font-medium text-sm tracking-wide uppercase group flex items-center"
              >
                Read all notes <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredBlogs.map((blog) => {
                const featuredImageUrl = getFeaturedImageUrl(blog);
                return <BlogCard key={blog.id} blog={blog} featuredImageUrl={featuredImageUrl} />;
              })}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 sm:py-28 bg-[#455a30] text-white overflow-hidden relative">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-normal tracking-[-0.04em] mb-6">
            Begin your escape
          </h2>
          <p className="text-lg sm:text-xl mb-10 text-[#e4e9dd] font-light max-w-2xl mx-auto">
            Join our private newsletter to receive early access to new cabins and bespoke itineraries.
          </p>
          <Link
            href="/contact"
            className="inline-block px-8 py-4 bg-white text-[#272220] rounded-md font-medium hover:bg-[#f5f4ef] transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#455a30]"
          >
            Start exploring
          </Link>
        </div>
      </section>
    </>
  );
}
