// ============================================
// FILE: src/components/UI/OptimizedImage.jsx
// Optimized Image Component with Lazy Loading
// ============================================

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';

// Cloudinary transformations
const cloudinaryLoader = ({ src, width, quality }) => {
  if (!src) return '';
  
  // If it's a Cloudinary URL, add transformations
  if (src.includes('cloudinary.com')) {
    const parts = src.split('/upload/');
    if (parts.length === 2) {
      const transforms = `f_auto,q_${quality || 75},w_${width}`;
      return `${parts[0]}/upload/${transforms}/${parts[1]}`;
    }
  }
  
  // Return as-is for other URLs
  return src;
};

export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  fill = false,
  priority = false,
  className = '',
  objectFit = 'cover',
  placeholder = 'blur',
  fallback = '/placeholder-image.png',
  onLoad,
  onError
}) {
  const [imgSrc, setImgSrc] = useState(src || fallback);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    setImgSrc(src || fallback);
    setHasError(false);
  }, [src, fallback]);

  const handleLoad = (e) => {
    setIsLoaded(true);
    onLoad?.(e);
  };

  const handleError = (e) => {
    setHasError(true);
    setImgSrc(fallback);
    onError?.(e);
  };

  // Generate blur placeholder
  const blurDataURL = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAAUH/8QAIhAAAgEDBAMBAAAAAAAAAAAAAQIDAAQRBQYSIRMxQVH/xAAVAQEBAAAAAAAAAAAAAAAAAAADBP/EABkRAAIDAQAAAAAAAAAAAAAAAAECAAMRIf/aAAwDAQACEQMRAD8AzfW9U3C02ym5otSvorYPwEEZCly3nA4jPXWKzj+69w/v2of1/wAr9pSjJdmJqQ4g2f/Z';

  // If using fill, return fill variant
  if (fill) {
    return (
      <div className={`relative overflow-hidden ${className}`}>
        <Image
          ref={imgRef}
          src={imgSrc}
          alt={alt || ''}
          fill
          priority={priority}
          placeholder={placeholder}
          blurDataURL={blurDataURL}
          className={`object-${objectFit} transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={handleLoad}
          onError={handleError}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          loader={cloudinaryLoader}
        />
        {!isLoaded && !hasError && (
          <div className="absolute inset-0 bg-gray-200 dark:bg-gray-800 animate-pulse" />
        )}
      </div>
    );
  }

  // Regular sized image
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <Image
        ref={imgRef}
        src={imgSrc}
        alt={alt || ''}
        width={width}
        height={height}
        priority={priority}
        placeholder={placeholder}
        blurDataURL={blurDataURL}
        className={`transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'} object-${objectFit}`}
        onLoad={handleLoad}
        onError={handleError}
        loader={cloudinaryLoader}
      />
      {!isLoaded && !hasError && (
        <div 
          className="absolute inset-0 bg-gray-200 dark:bg-gray-800 animate-pulse"
          style={{ width, height }}
        />
      )}
    </div>
  );
}

// Avatar variant with circular styling
export function Avatar({ 
  src, 
  name, 
  size = 40, 
  className = '',
  showOnline = false,
  isOnline = false
}) {
  const fallbackUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'U')}&background=7c3aed&color=fff&size=${size * 2}`;

  return (
    <div className={`relative inline-block ${className}`}>
      <OptimizedImage
        src={src || fallbackUrl}
        alt={name || 'User'}
        width={size}
        height={size}
        className="rounded-full"
        objectFit="cover"
        fallback={fallbackUrl}
      />
      {showOnline && (
        <span 
          className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white dark:border-gray-900 ${
            isOnline ? 'bg-green-500' : 'bg-gray-400'
          }`}
        />
      )}
    </div>
  );
}

// Thumbnail variant for blog cards
export function Thumbnail({
  src,
  alt,
  aspectRatio = '16/9',
  className = ''
}) {
  return (
    <div 
      className={`relative overflow-hidden ${className}`}
      style={{ aspectRatio }}
    >
      <OptimizedImage
        src={src}
        alt={alt}
        fill
        className="rounded-lg"
        objectFit="cover"
      />
    </div>
  );
}

// Background image variant
export function BackgroundImage({
  src,
  alt,
  children,
  overlay = true,
  className = ''
}) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <OptimizedImage
        src={src}
        alt={alt || ''}
        fill
        priority
        objectFit="cover"
      />
      {overlay && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
      )}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
