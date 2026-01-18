import { apiClient, BlogStatus } from '@/lib';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { format } from 'date-fns';
import BlogImage from '../../components/BlogImage';

async function getBlog(id: string) {
  try {
    const response = await apiClient.getBlogById(id);
    return response.data;
  } catch (error) {
    return null;
  }
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const blog = await getBlog(params.id);

  // Check if blog exists and is published
  if (!blog) {
    return {
      title: 'Blog Post Not Found',
    };
  }

  // Normalize status to string and check if published
  const blogStatus = blog.status ? String(blog.status).toUpperCase() : '';
  if (blogStatus !== BlogStatus.PUBLISHED) {
    return {
      title: 'Blog Post Not Found',
    };
  }

  // Get image URLs for metadata
  const getImageUrls = () => {
    if (blog.images && blog.images.length > 0) {
      return blog.images.map((img) => {
        const imageUrl = img.url.startsWith('http')
          ? img.url
          : `${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3000'}${img.url}`;
        return imageUrl;
      });
    }
    return blog.featuredImage ? [blog.featuredImage] : [];
  };

  const imageUrls = getImageUrls();

  return {
    title: blog.title,
    description: blog.excerpt || blog.content.substring(0, 160),
    openGraph: {
      title: blog.title,
      description: blog.excerpt || blog.content.substring(0, 160),
      images: imageUrls,
      type: 'article',
      publishedTime: blog.createdAt,
      modifiedTime: blog.updatedAt,
    },
    twitter: {
      card: 'summary_large_image',
      title: blog.title,
      description: blog.excerpt || blog.content.substring(0, 160),
      images: imageUrls,
    },
  };
}

export default async function BlogDetailPage({ params }: { params: { id: string } }) {
  const blog = await getBlog(params.id);

  // Check if blog exists
  if (!blog) {
    notFound();
  }

  // Normalize status to string and check if published
  const blogStatus = blog.status ? String(blog.status).toUpperCase() : '';
  if (blogStatus !== BlogStatus.PUBLISHED) {
    notFound();
  }

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <header className="mb-6 sm:mb-8">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-3 sm:mb-4">
          {blog.title}
        </h1>
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm sm:text-base text-gray-600">
          {blog.author && (
            <>
              <span>
                By {blog.author.firstName} {blog.author.lastName}
              </span>
              <span className="hidden sm:inline">•</span>
            </>
          )}
          <time dateTime={blog.createdAt}>{format(new Date(blog.createdAt), 'MMMM d, yyyy')}</time>
        </div>
      </header>

      {/* Blog Images */}
      {blog.images && blog.images.length > 0 ? (
        <div className="mb-6 sm:mb-8 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {blog.images.map((image, index) => {
            const imageUrl = image.url.startsWith('http')
              ? image.url
              : `${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3000'}${image.url}`;
            return (
              <div
                key={image.id}
                className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col"
              >
                <div className="w-full h-48 sm:h-56 overflow-hidden bg-gray-100 flex-shrink-0">
                  <BlogImage src={imageUrl} alt={image.name || blog.title} priority={index === 0} />
                </div>
                {image.name && (
                  <div className="p-3 border-t border-gray-100">
                    <p className="text-sm text-gray-600 truncate">{image.name}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : blog.featuredImage ? (
        <div className="mb-6 sm:mb-8 bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
          <div className="h-48 sm:h-64 md:h-96 w-full overflow-hidden bg-gray-100">
            <BlogImage src={blog.featuredImage} alt={blog.title} priority />
          </div>
        </div>
      ) : (
        <div className="mb-6 sm:mb-8 bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
          <div className="h-48 sm:h-64 md:h-96 w-full rounded-lg overflow-hidden bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400 text-sm sm:text-base">No image available</span>
          </div>
        </div>
      )}

      {blog.excerpt && (
        <p className="text-lg sm:text-xl text-gray-700 mb-6 sm:mb-8 font-medium">{blog.excerpt}</p>
      )}

      <div
        className="prose prose-lg max-w-none"
        dangerouslySetInnerHTML={{
          __html: blog.content.replace(/\n/g, '<br />'),
        }}
      />

      <div className="mt-12 pt-8 border-t border-gray-200">
        <a href="/blogs" className="text-primary-600 hover:text-primary-700 font-semibold">
          ← Back to Blogs
        </a>
      </div>
    </article>
  );
}
