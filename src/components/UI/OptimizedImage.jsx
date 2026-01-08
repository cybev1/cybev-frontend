// ============================================
// FILE: src/components/UI/OptimizedImage.jsx
// Lazy Loading Image Component with Blur Placeholder
// VERSION: 1.0
// ============================================

import { useState, useRef, useEffect } from 'react';
import { ImageOff } from 'lucide-react';

// Cloudinary transformation helper
const getCloudinaryUrl = (url, options = {}) => {
  if (!url || !url.includes('cloudinary.com')) return url;
  
  const { width, height, quality = 'auto', format = 'auto' } = options;
  
  // Find /upload/ in URL and insert transformations after it
  const uploadIndex = url.indexOf('/upload/');
  if (uploadIndex === -1) return url;
  
  let transforms = `f_${format},q_${quality}`;
  if (width) transforms += `,w_${width}`;
  if (height) transforms += `,h_${height}`;
  transforms += ',c_limit'; // Maintain aspect ratio
  
  return url.slice(0, uploadIndex + 8) + transforms + '/' + url.slice(uploadIndex + 8);
};

// Generate blur placeholder
const shimmer = (w, h) => `
<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#f3f4f6" offset="20%" />
      <stop stop-color="#e5e7eb" offset="50%" />
      <stop stop-color="#f3f4f6" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#f3f4f6" />
  <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
  <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
</svg>`;

const toBase64 = (str) =>
  typeof window === 'undefined'
    ? Buffer.from(str).toString('base64')
    : window.btoa(str);

export default function OptimizedImage({
  src,
  alt = '',
  width,
  height,
  className = '',
  objectFit = 'cover',
  priority = false,
  quality = 'auto',
  sizes = '100vw',
  placeholder = 'blur',
  fallback = null,
  onClick,
  onLoad,
  ...props
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const imgRef = useRef(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority || !imgRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '200px', // Start loading 200px before in view
        threshold: 0
      }
    );

    observer.observe(imgRef.current);
    return () => observer.disconnect();
  }, [priority]);

  // Get optimized URL
  const optimizedSrc = getCloudinaryUrl(src, {
    width: width ? Math.min(width * 2, 2000) : undefined, // 2x for retina, max 2000
    height: height ? Math.min(height * 2, 2000) : undefined,
    quality
  });

  // Low quality placeholder
  const placeholderSrc = getCloudinaryUrl(src, {
    width: 20,
    quality: 10
  });

  const handleLoad = (e) => {
    setIsLoaded(true);
    onLoad?.(e);
  };

  const handleError = () => {
    setHasError(true);
  };

  if (hasError) {
    return fallback || (
      <div
        className={`flex items-center justify-center bg-gray-100 dark:bg-gray-800 ${className}`}
        style={{ width, height }}
      >
        <ImageOff className="w-8 h-8 text-gray-400" />
      </div>
    );
  }

  return (
    <div
      ref={imgRef}
      className={`relative overflow-hidden ${className}`}
      style={{ width, height }}
      onClick={onClick}
    >
      {/* Blur placeholder */}
      {placeholder === 'blur' && !isLoaded && (
        <div
          className="absolute inset-0 animate-pulse"
          style={{
            backgroundImage: `url("data:image/svg+xml;base64,${toBase64(shimmer(width || 700, height || 400))}")`,
            backgroundSize: 'cover'
          }}
        />
      )}
      
      {/* Main image */}
      {isInView && (
        <img
          src={optimizedSrc}
          alt={alt}
          width={width}
          height={height}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          onLoad={handleLoad}
          onError={handleError}
          className={`transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            objectFit,
            width: '100%',
            height: '100%'
          }}
          {...props}
        />
      )}
    </div>
  );
}

// Avatar variant with circular shape
export function OptimizedAvatar({
  src,
  name = '',
  size = 40,
  className = '',
  ...props
}) {
  const initials = name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const fallbackUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'U')}&background=7c3aed&color=fff&size=${size * 2}`;

  return (
    <OptimizedImage
      src={src || fallbackUrl}
      alt={name}
      width={size}
      height={size}
      className={`rounded-full ${className}`}
      fallback={
        <div
          className={`flex items-center justify-center rounded-full bg-purple-600 text-white font-medium ${className}`}
          style={{ width: size, height: size, fontSize: size * 0.4 }}
        >
          {initials || 'U'}
        </div>
      }
      {...props}
    />
  );
}

// Thumbnail variant for cards
export function OptimizedThumbnail({
  src,
  alt = '',
  aspectRatio = '16/9',
  className = '',
  ...props
}) {
  return (
    <div className={`relative ${className}`} style={{ aspectRatio }}>
      <OptimizedImage
        src={src}
        alt={alt}
        className="absolute inset-0 w-full h-full"
        objectFit="cover"
        {...props}
      />
    </div>
  );
}
