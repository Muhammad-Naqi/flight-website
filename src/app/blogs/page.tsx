import { apiClient } from '@/lib';
import Link from 'next/link';
import type { Metadata } from 'next';
import ApiStatus from '../components/ApiStatus';
import BlogCardList from '../components/BlogCardList';

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

export const metadata: Metadata = {
  title: 'Travel Blogs',
  description:
    'Discover amazing travel stories, tips, and destination guides from our travel experts.',
  openGraph: {
    title: 'Travel Blogs - Flight Travel Agency',
    description: 'Discover amazing travel stories, tips, and destination guides.',
  },
};

async function getBlogs(page = 1) {
  try {
    const response = await apiClient.getBlogs(page, 12, true);
    return response;
  } catch (error: any) {
    console.error('Error fetching blogs:', error);
    console.error('Error details:', {
      message: error?.message,
      response: error?.response?.data,
      status: error?.response?.status,
      url: error?.config?.url,
      baseURL: error?.config?.baseURL,
    });
    return {
      data: [],
      meta: { totalPages: 0, page: 1 },
      error: error?.message || 'Failed to fetch blogs',
    };
  }
}

export default async function BlogsPage({ searchParams }: { searchParams: { page?: string } }) {
  const currentPage = parseInt(searchParams.page || '1', 10);
  const blogsData = await getBlogs(currentPage);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <ApiStatus />
      <div className="mb-6 sm:mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">Travel Blogs</h1>
        <p className="text-lg sm:text-xl text-gray-600">
          Explore our collection of travel stories, tips, and destination guides
        </p>
      </div>

      {blogsData.data.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg mb-2">No blog posts available yet.</p>
          {(blogsData as any).error && (
            <p className="text-red-600 text-sm mt-2">Error: {(blogsData as any).error}</p>
          )}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
            {blogsData.data.map((blog) => {
              const featuredImageUrl = getFeaturedImageUrl(blog);
              return <BlogCardList key={blog.id} blog={blog} featuredImageUrl={featuredImageUrl} />;
            })}
          </div>

          {blogsData.meta.totalPages > 1 && (
            <div className="flex justify-center items-center space-x-4">
              {currentPage > 1 && (
                <Link
                  href={`/blogs?page=${currentPage - 1}`}
                  className="px-5 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors font-medium text-sm"
                >
                  Previous
                </Link>
              )}
              <span className="text-gray-600 text-sm">
                Page {currentPage} of {blogsData.meta.totalPages}
              </span>
              {currentPage < blogsData.meta.totalPages && (
                <Link
                  href={`/blogs?page=${currentPage + 1}`}
                  className="px-5 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors font-medium text-sm"
                >
                  Next
                </Link>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
