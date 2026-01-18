'use client';

import { useState, useEffect } from 'react';

interface SafeImageProps {
  src: string | undefined | null;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  className?: string;
  priority?: boolean;
  fallback?: string;
}

export default function SafeImage({
  src,
  alt,
  width,
  height,
  fill = false,
  className = '',
  priority = false,
  fallback = '/placeholder-image.jpg',
}: SafeImageProps) {
  const [imgSrc, setImgSrc] = useState(src || fallback);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (src) {
      setImgSrc(src);
      setHasError(false);
    } else {
      setImgSrc(fallback);
    }
  }, [src, fallback]);

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.error('Image failed to load:', imgSrc);
    if (!hasError && imgSrc !== fallback) {
      setHasError(true);
      setImgSrc(fallback);
    }
  };

  // Use regular img tag for external URLs (works better with redirects and external domains)
  // No API proxy - fetch images directly from the source URL
  if (fill) {
    return (
      <div className={`relative ${className}`}>
        {hasError ? (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400 text-sm">Image not available</span>
          </div>
        ) : (
          <img
            src={imgSrc}
            alt={alt}
            className={`${className} object-cover w-full h-full`}
            onError={handleError}
            onLoad={() => setHasError(false)}
            loading={priority ? 'eager' : 'lazy'}
            style={{ objectFit: 'cover' }}
          />
        )}
      </div>
    );
  }

  return (
    <>
      {hasError ? (
        <div
          className={`bg-gray-200 flex items-center justify-center ${className}`}
          style={{ width, height }}
        >
          <span className="text-gray-400 text-sm">Image not available</span>
        </div>
      ) : (
        <img
          src={imgSrc}
          alt={alt}
          width={width}
          height={height}
          className={className}
          onError={handleError}
          onLoad={() => setHasError(false)}
          loading={priority ? 'eager' : 'lazy'}
        />
      )}
    </>
  );
}
