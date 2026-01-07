// ============================================
// FILE: src/lib/imageCompression.js
// Image Compression Utility
// VERSION: 1.0
// ============================================

/**
 * Compress an image file before upload
 * @param {File} file - The image file to compress
 * @param {Object} options - Compression options
 * @returns {Promise<File>} - Compressed image file
 */
export async function compressImage(file, options = {}) {
  const {
    maxWidth = 1920,
    maxHeight = 1920,
    quality = 0.8,
    maxSizeMB = 2,
    mimeType = 'image/jpeg'
  } = options;
  
  // Skip compression for small files (less than 500KB)
  if (file.size < 500 * 1024) {
    console.log('[ImageCompression] File small enough, skipping:', formatBytes(file.size));
    return file;
  }
  
  // Skip compression for non-image files
  if (!file.type.startsWith('image/')) {
    console.log('[ImageCompression] Not an image, skipping');
    return file;
  }
  
  // Skip compression for GIFs (to preserve animation)
  if (file.type === 'image/gif') {
    console.log('[ImageCompression] GIF detected, skipping to preserve animation');
    return file;
  }
  
  try {
    console.log('[ImageCompression] Original size:', formatBytes(file.size));
    
    // Load image
    const img = await loadImage(file);
    
    // Calculate new dimensions
    const { width, height } = calculateDimensions(
      img.width,
      img.height,
      maxWidth,
      maxHeight
    );
    
    // Create canvas and draw resized image
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    
    const ctx = canvas.getContext('2d');
    
    // Enable image smoothing for better quality
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    
    // Draw image
    ctx.drawImage(img, 0, 0, width, height);
    
    // Convert to blob with quality setting
    let blob = await canvasToBlob(canvas, mimeType, quality);
    
    // If still too large, reduce quality iteratively
    let currentQuality = quality;
    while (blob.size > maxSizeMB * 1024 * 1024 && currentQuality > 0.3) {
      currentQuality -= 0.1;
      blob = await canvasToBlob(canvas, mimeType, currentQuality);
      console.log('[ImageCompression] Reducing quality to:', currentQuality.toFixed(1));
    }
    
    // Create new file from blob
    const compressedFile = new File(
      [blob],
      file.name.replace(/\.[^/.]+$/, '.jpg'),
      { type: mimeType, lastModified: Date.now() }
    );
    
    console.log('[ImageCompression] Compressed size:', formatBytes(compressedFile.size));
    console.log('[ImageCompression] Reduction:', 
      Math.round((1 - compressedFile.size / file.size) * 100) + '%'
    );
    
    return compressedFile;
  } catch (error) {
    console.error('[ImageCompression] Error:', error);
    // Return original file if compression fails
    return file;
  }
}

/**
 * Compress multiple images
 * @param {File[]} files - Array of image files
 * @param {Object} options - Compression options
 * @returns {Promise<File[]>} - Array of compressed files
 */
export async function compressImages(files, options = {}) {
  const compressed = await Promise.all(
    files.map(file => compressImage(file, options))
  );
  return compressed;
}

/**
 * Create thumbnail from image
 * @param {File} file - Image file
 * @param {number} size - Thumbnail size (square)
 * @returns {Promise<string>} - Base64 data URL
 */
export async function createThumbnail(file, size = 200) {
  if (!file.type.startsWith('image/')) {
    return null;
  }
  
  try {
    const img = await loadImage(file);
    
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    
    // Calculate crop dimensions for square thumbnail
    const minDim = Math.min(img.width, img.height);
    const sx = (img.width - minDim) / 2;
    const sy = (img.height - minDim) / 2;
    
    ctx.drawImage(img, sx, sy, minDim, minDim, 0, 0, size, size);
    
    return canvas.toDataURL('image/jpeg', 0.7);
  } catch (error) {
    console.error('[ImageCompression] Thumbnail error:', error);
    return null;
  }
}

/**
 * Get image dimensions without loading full image
 * @param {File} file - Image file
 * @returns {Promise<{width: number, height: number}>}
 */
export async function getImageDimensions(file) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.width, height: img.height });
      URL.revokeObjectURL(img.src);
    };
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}

/**
 * Check if file is a valid image
 * @param {File} file - File to check
 * @returns {boolean}
 */
export function isValidImage(file) {
  const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
  return validTypes.includes(file.type);
}

/**
 * Convert image file to base64
 * @param {File} file - Image file
 * @returns {Promise<string>} - Base64 string
 */
export function imageToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// Helper: Load image from file
function loadImage(file) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(img.src);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(img.src);
      reject(new Error('Failed to load image'));
    };
    img.src = URL.createObjectURL(file);
  });
}

// Helper: Calculate new dimensions maintaining aspect ratio
function calculateDimensions(width, height, maxWidth, maxHeight) {
  if (width <= maxWidth && height <= maxHeight) {
    return { width, height };
  }
  
  const ratio = Math.min(maxWidth / width, maxHeight / height);
  
  return {
    width: Math.round(width * ratio),
    height: Math.round(height * ratio)
  };
}

// Helper: Convert canvas to blob
function canvasToBlob(canvas, mimeType, quality) {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Canvas to blob conversion failed'));
        }
      },
      mimeType,
      quality
    );
  });
}

// Helper: Format bytes to human readable
function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

// Export utilities
export default {
  compressImage,
  compressImages,
  createThumbnail,
  getImageDimensions,
  isValidImage,
  imageToBase64
};
