'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface OptimizedImageProps {
  src: string | undefined | null;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  className?: string;
  priority?: boolean;
  fallback?: string;
}

export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  fill = false,
  className = '',
  priority = false,
  fallback = '/placeholder-image.jpg',
}: OptimizedImageProps) {
  const [imageSrc, setImageSrc] = useState<string>(fallback);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (!src) {
      setImageSrc(fallback);
      setIsLoading(false);
      return;
    }

    // Use image URL directly (no API proxy)
    setImageSrc(src);
    setIsLoading(true);
    setHasError(false);

    // Preload image to check if it's valid
    const img = new window.Image();
    img.onload = () => {
      setIsLoading(false);
      setHasError(false);
    };
    img.onerror = () => {
      setIsLoading(false);
      setHasError(true);
      setImageSrc(fallback);
    };
    img.src = src;
  }, [src, fallback]);

  if (fill) {
    return (
      <div className={`relative ${className}`}>
        {isLoading && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
            <span className="text-gray-400 text-sm">Loading...</span>
          </div>
        )}
        <Image
          src={imageSrc}
          alt={alt}
          fill
          className={className}
          priority={priority}
          onError={() => {
            setHasError(true);
            setImageSrc(fallback);
          }}
        />
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
          <span className="text-gray-400 text-sm">Loading...</span>
        </div>
      )}
      <Image
        src={imageSrc}
        alt={alt}
        width={width || 800}
        height={height || 600}
        className={className}
        priority={priority}
        onError={() => {
          setHasError(true);
          setImageSrc(fallback);
        }}
      />
    </div>
  );
}
