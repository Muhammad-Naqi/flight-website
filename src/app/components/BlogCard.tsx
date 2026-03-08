/* eslint-disable @next/next/no-img-element */
'use client';

import { useState } from 'react';
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

function ImagePlaceholder() {
  return (
    <div className="w-full h-full bg-[#e4e9dd] flex items-center justify-center">
      <svg className="w-12 h-12 text-[#adc09b]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    </div>
  );
}

export default function BlogCard({ blog, featuredImageUrl }: BlogCardProps) {
  const [imgError, setImgError] = useState(false);

  return (
    <Link
      href={`/blogs/${blog.id}`}
      className="group bg-white rounded-lg overflow-hidden flex flex-col hover:-translate-y-1 transition-transform duration-300"
    >
      <div className="relative h-64 w-full flex-shrink-0 overflow-hidden rounded-lg">
        {featuredImageUrl && !imgError ? (
          <img
            src={featuredImageUrl}
            alt={blog.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            onError={() => setImgError(true)}
          />
        ) : (
          <ImagePlaceholder />
        )}
      </div>
      <div className="pt-6 flex-grow flex flex-col min-h-0">
        <div className="flex items-center text-xs uppercase tracking-widest text-[#455a30] mb-3">
          <span>
            {new Date(blog.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </span>
        </div>
        <h3 className="text-xl sm:text-2xl font-normal tracking-tight mb-3 text-[#272220] group-hover:text-[#455a30] transition-colors">{blog.title}</h3>
        {blog.excerpt && (
          <p className="text-gray-500 mb-4 line-clamp-2 text-base font-light flex-grow leading-relaxed">{blog.excerpt}</p>
        )}
      </div>
    </Link>
  );
}
