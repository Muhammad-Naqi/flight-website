/* eslint-disable @next/next/no-img-element */
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
      <section className="relative w-full h-screen min-h-[750px] flex flex-col items-center justify-center text-white overflow-hidden">
        {/* Background Image - Stunning Generated AI Cabin/Forest Image */}
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-transform duration-[10s] hover:scale-105"
          style={{ backgroundImage: 'url("/hero_cabin_forest_1772975108024.png")' }}
        ></div>
        {/* Overlays for contrast and blending */}
        <div className="absolute inset-0 z-0 bg-black/40"></div>
        <div className="absolute inset-x-0 bottom-0 z-0 h-64 bg-gradient-to-t from-background via-background/80 to-transparent"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center w-full mt-24">
          <div className="text-center mb-12 sm:mb-20 animate-fade-in-up">
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[96px] font-normal tracking-[-0.04em] mb-6 leading-[1.05] drop-shadow-md">
              Find your <br className="hidden sm:block" /> wild escape.
            </h1>
            <p className="text-lg sm:text-xl text-white/95 font-light max-w-2xl mx-auto drop-shadow-sm">
              Disconnect from the everyday. Reconnect with nature in our curated selection of luxury destinations.
            </p>
          </div>

          {/* Search Form */}
          <div className="w-full max-w-4xl mx-auto bg-white/10 backdrop-blur-md p-2 rounded-xl border border-white/20 shadow-2xl">
             <div className="bg-white rounded-lg shadow-xl overflow-hidden">
               <SearchForm />
             </div>
          </div>
        </div>
      </section>

      {/* Quick Links Section */}
      <section className="py-12 sm:py-16 bg-background relative z-10 border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-8 sm:gap-24">
            <Link href="/blogs" className="flex flex-col items-center space-y-4 group text-foreground transition-all">
              <div className="w-20 h-20 rounded-full bg-primary-100 flex items-center justify-center text-3xl group-hover:bg-primary-200 group-hover:scale-105 transition-all duration-300 shadow-sm border border-primary-200">
                📖
              </div>
              <span className="font-medium tracking-wide text-xs uppercase opacity-80 group-hover:opacity-100 group-hover:text-primary-800 transition-colors">Stories</span>
            </Link>
            <Link href="/about" className="flex flex-col items-center space-y-4 group text-foreground transition-all">
              <div className="w-20 h-20 rounded-full bg-primary-100 flex items-center justify-center text-3xl group-hover:bg-primary-200 group-hover:scale-105 transition-all duration-300 shadow-sm border border-primary-200">
                🪵
              </div>
              <span className="font-medium tracking-wide text-xs uppercase opacity-80 group-hover:opacity-100 group-hover:text-primary-800 transition-colors">Cabins</span>
            </Link>
            <Link href="/contact" className="flex flex-col items-center space-y-4 group text-foreground transition-all">
              <div className="w-20 h-20 rounded-full bg-primary-100 flex items-center justify-center text-3xl group-hover:bg-primary-200 group-hover:scale-105 transition-all duration-300 shadow-sm border border-primary-200">
                🧭
              </div>
              <span className="font-medium tracking-wide text-xs uppercase opacity-80 group-hover:opacity-100 group-hover:text-primary-800 transition-colors">Rentals</span>
            </Link>
            <Link href="/contact" className="flex flex-col items-center space-y-4 group text-foreground transition-all">
              <div className="w-20 h-20 rounded-full bg-primary-100 flex items-center justify-center text-3xl group-hover:bg-primary-200 group-hover:scale-105 transition-all duration-300 shadow-sm border border-primary-200">
                🏔️
              </div>
              <span className="font-medium tracking-wide text-xs uppercase opacity-80 group-hover:opacity-100 group-hover:text-primary-800 transition-colors">Activities</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section - Luxury Style Cards */}
      <section className="py-20 sm:py-32 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div className="max-w-2xl">
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-normal tracking-[-0.03em] text-foreground mb-4">
                The journey awaits
              </h2>
              <p className="text-gray-600 text-lg font-light leading-relaxed">
                 Experience the perfect harmony of untamed wilderness and uncompromising comfort.
              </p>
            </div>
            <Link href="/about" className="text-primary-700 hover:text-primary-900 font-medium text-sm tracking-wide uppercase group flex items-center transition-colors pb-2">
              Discover our ethos <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10">
            {/* Card 1 */}
            <div className="card-premium group cursor-pointer relative">
              <div className="absolute inset-0 bg-[url('/luxury_tent_mountain_1772975254608.png')] bg-cover bg-center opacity-0 group-hover:opacity-10 transition-opacity duration-700 z-0 rounded-lg"></div>
              <div className="relative z-10 flex flex-col h-full">
                <div className="w-14 h-14 rounded-full bg-primary-50 flex items-center justify-center text-2xl mb-8 group-hover:scale-110 group-hover:bg-primary-100 transition-all duration-500">🌍</div>
                <h3 className="text-2xl font-medium mb-4 text-foreground tracking-tight">Curated Experiences</h3>
                <p className="text-base text-gray-500 font-light leading-relaxed mb-6 flex-grow">Hand-picked destinations that offer the definitive balance of luxury and wild nature.</p>
                <div className="w-8 h-[2px] bg-primary-300 group-hover:w-full transition-all duration-500"></div>
              </div>
            </div>
            {/* Card 2 */}
            <div className="card-premium group cursor-pointer relative">
              <div className="absolute inset-0 bg-[url('/modern_treehouse_forest_1772975391211.png')] bg-cover bg-center opacity-0 group-hover:opacity-10 transition-opacity duration-700 z-0 rounded-lg"></div>
              <div className="relative z-10 flex flex-col h-full">
                <div className="w-14 h-14 rounded-full bg-primary-50 flex items-center justify-center text-2xl mb-8 group-hover:scale-110 group-hover:bg-primary-100 transition-all duration-500">⛺</div>
                <h3 className="text-2xl font-medium mb-4 text-foreground tracking-tight">Authentic Stays</h3>
                <p className="text-base text-gray-500 font-light leading-relaxed mb-6 flex-grow">Stay in unique structures built dynamically into their environments for minimal impact.</p>
                <div className="w-8 h-[2px] bg-primary-300 group-hover:w-full transition-all duration-500"></div>
              </div>
            </div>
            {/* Card 3 */}
            <div className="card-premium group cursor-pointer relative">
              <div className="absolute inset-0 bg-[url('/eco_lodge_cliff_1772975423526.png')] bg-cover bg-center opacity-0 group-hover:opacity-10 transition-opacity duration-700 z-0 rounded-lg"></div>
              <div className="relative z-10 flex flex-col h-full">
                <div className="w-14 h-14 rounded-full bg-primary-50 flex items-center justify-center text-2xl mb-8 group-hover:scale-110 group-hover:bg-primary-100 transition-all duration-500">🌿</div>
                <h3 className="text-2xl font-medium mb-4 text-foreground tracking-tight">Sustainable Mindset</h3>
                <p className="text-base text-gray-500 font-light leading-relaxed mb-6 flex-grow">We believe in travel that pays to preserve. A percentage goes directly to local conservation.</p>
                <div className="w-8 h-[2px] bg-primary-300 group-hover:w-full transition-all duration-500"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Reviews Section */}
      <section className="py-24 sm:py-32 bg-white relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-primary-50 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-primary-50 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16 sm:mb-24">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-normal tracking-[-0.03em] text-foreground mb-4">
              Words from travelers
            </h2>
            <div className="h-1 w-16 bg-primary-400 mx-auto rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 sm:gap-16">
            {[
              { text: "The most serene and beautiful cabin we've ever stayed in. The attention to detail is unmatched and the surroundings took our breath away.", author: "Sarah Jenkins", role: "Photographer", img: "/avatar_1_photographer_1772975500999.png" },
              { text: "A truly transformative experience. Waking up to the sound of the forest, wrapped in absolute luxury. It was exactly what we needed to reset.", author: "Michael Chen", role: "Architect", img: "/avatar_2_architect_1772975551308.png" },
              { text: "We booked our honeymoon here and it exceeded every expectation. We felt completely disconnected from the world, yet wonderfully taken care of.", author: "Elena Rodriguez", role: "Writer", img: "/avatar_3_writer_1772975602714.png" }
            ].map((review, i) => (
              <div key={i} className="flex flex-col items-center text-center">
                 <div className="text-primary-300 mb-6 font-serif text-6xl leading-none">&quot;</div>
                 <p className="text-lg font-light text-gray-600 mb-10 italic flex-grow leading-relaxed max-w-sm">
                   {review.text}
                 </p>
                 <div className="flex items-center space-x-4 mt-auto">
                   <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-primary-100 shadow-sm">
                     <img src={review.img} alt={review.author} className="w-full h-full object-cover" />
                   </div>
                   <div className="text-left">
                     <p className="text-sm font-medium text-foreground tracking-wide">{review.author}</p>
                     <p className="text-xs text-primary-600 font-medium uppercase tracking-wider">{review.role}</p>
                   </div>
                 </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Blogs Section */}
      {featuredBlogs.length > 0 && (
        <section className="py-20 sm:py-32 bg-background border-t border-gray-200/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row justify-between items-end mb-16 gap-6">
              <div className="max-w-2xl">
                <h2 className="text-4xl sm:text-5xl font-normal tracking-[-0.03em] text-foreground mb-4">
                  Stories from the wild
                </h2>
                <p className="text-gray-600 text-lg font-light leading-relaxed">
                   Inspiration, guides, and notes from our community of travelers.
                </p>
              </div>
              <Link
                href="/blogs"
                className="text-primary-700 hover:text-primary-900 font-medium text-sm tracking-wide uppercase group flex items-center transition-colors pb-2"
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
      <section className="py-24 sm:py-36 bg-primary-800 text-white overflow-hidden relative">
        <div className="absolute inset-0 bg-[url('/hero_cabin_forest_1772975108024.png')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl sm:text-5xl lg:text-7xl font-normal tracking-[-0.04em] mb-8 drop-shadow-sm">
            Begin your escape
          </h2>
          <p className="text-lg sm:text-2xl mb-12 text-primary-100 font-light max-w-2xl mx-auto leading-relaxed drop-shadow-sm">
            Join our private newsletter to receive early access to new cabins and bespoke itineraries.
          </p>
          <Link
            href="/contact"
            className="inline-block px-10 py-5 bg-white text-foreground rounded-md font-medium text-base hover:bg-background hover:scale-105 transition-all duration-300 shadow-xl focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary-700"
          >
            Start exploring
          </Link>
        </div>
      </section>
    </>
  );
}
