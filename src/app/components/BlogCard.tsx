'use client';

import Link from 'next/link';

interface BlogCardProps {
  blog: {
    id: string;
    title: string;
    excerpt?: string;
    createdAt: string;
    author?: {
      firstName: string;
      lastName: string;
    };
  };
  featuredImageUrl: string | null;
}

export default function BlogCard({ blog, featuredImageUrl }: BlogCardProps) {
  return (
    <Link
      href={`/blogs/${blog.id}`}
      className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow flex flex-col"
    >
      {featuredImageUrl && (
        <div className="relative h-48 w-full bg-gray-100 flex-shrink-0 overflow-hidden">
          <img
            src={featuredImageUrl}
            alt={blog.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/placeholder-image.jpg';
            }}
          />
        </div>
      )}
      <div className="p-6 flex-grow flex flex-col min-h-0">
        <h3 className="text-xl font-bold mb-2 text-gray-900 line-clamp-2">{blog.title}</h3>
        {blog.excerpt && (
          <p className="text-gray-600 mb-4 line-clamp-2 text-sm flex-grow">{blog.excerpt}</p>
        )}
        <div className="flex items-center text-xs text-gray-500 mt-auto">
          <span>
            {new Date(blog.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}
          </span>
        </div>
      </div>
    </Link>
  );
}
