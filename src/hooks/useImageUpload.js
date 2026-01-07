// ============================================
// FILE: src/hooks/useImageUpload.js
// Image Upload Hook with Compression
// VERSION: 1.0
// ============================================

import { useState, useCallback } from 'react';
import { compressImage, compressImages, createThumbnail, isValidImage } from '@/lib/imageCompression';

/**
 * Hook for handling image uploads with compression
 * 
 * @param {Object} options - Configuration options
 * @returns {Object} - Upload state and handlers
 */
export function useImageUpload(options = {}) {
  const {
    maxFiles = 10,
    maxSizeMB = 5,
    maxWidth = 1920,
    maxHeight = 1920,
    quality = 0.8,
    compress = true,
    generateThumbnails = false,
    thumbnailSize = 200,
    onUploadStart,
    onUploadComplete,
    onError
  } = options;

  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [thumbnails, setThumbnails] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);

  // Process and add files
  const addFiles = useCallback(async (newFiles) => {
    const fileArray = Array.from(newFiles);
    
    // Validate file count
    if (files.length + fileArray.length > maxFiles) {
      const errorMsg = `Maximum ${maxFiles} files allowed`;
      setError(errorMsg);
      if (onError) onError(new Error(errorMsg));
      return;
    }

    // Filter valid images
    const validFiles = fileArray.filter(file => {
      if (!isValidImage(file)) {
        console.warn('[useImageUpload] Invalid file type:', file.type);
        return false;
      }
      if (file.size > maxSizeMB * 1024 * 1024 * 2) { // Allow 2x max for compression
        console.warn('[useImageUpload] File too large:', file.name);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) {
      setError('No valid images selected');
      return;
    }

    setIsProcessing(true);
    setError(null);
    setProgress(0);
    
    if (onUploadStart) onUploadStart();

    try {
      const processedFiles = [];
      const newPreviews = [];
      const newThumbnails = [];

      for (let i = 0; i < validFiles.length; i++) {
        const file = validFiles[i];
        
        // Compress if enabled
        let processedFile = file;
        if (compress && file.type !== 'image/gif') {
          processedFile = await compressImage(file, {
            maxWidth,
            maxHeight,
            quality,
            maxSizeMB
          });
        }

        processedFiles.push(processedFile);

        // Generate preview URL
        const previewUrl = URL.createObjectURL(processedFile);
        newPreviews.push(previewUrl);

        // Generate thumbnail if requested
        if (generateThumbnails) {
          const thumbnail = await createThumbnail(processedFile, thumbnailSize);
          newThumbnails.push(thumbnail);
        }

        // Update progress
        setProgress(Math.round(((i + 1) / validFiles.length) * 100));
      }

      setFiles(prev => [...prev, ...processedFiles]);
      setPreviews(prev => [...prev, ...newPreviews]);
      setThumbnails(prev => [...prev, ...newThumbnails]);

      if (onUploadComplete) onUploadComplete(processedFiles);
    } catch (err) {
      console.error('[useImageUpload] Processing error:', err);
      setError('Failed to process images');
      if (onError) onError(err);
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  }, [files.length, maxFiles, maxSizeMB, maxWidth, maxHeight, quality, compress, generateThumbnails, thumbnailSize, onUploadStart, onUploadComplete, onError]);

  // Remove file at index
  const removeFile = useCallback((index) => {
    // Revoke preview URL to free memory
    if (previews[index]) {
      URL.revokeObjectURL(previews[index]);
    }

    setFiles(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
    setThumbnails(prev => prev.filter((_, i) => i !== index));
  }, [previews]);

  // Clear all files
  const clearFiles = useCallback(() => {
    // Revoke all preview URLs
    previews.forEach(url => URL.revokeObjectURL(url));
    
    setFiles([]);
    setPreviews([]);
    setThumbnails([]);
    setError(null);
  }, [previews]);

  // Reorder files (for drag and drop)
  const reorderFiles = useCallback((fromIndex, toIndex) => {
    const reorder = (arr) => {
      const result = [...arr];
      const [removed] = result.splice(fromIndex, 1);
      result.splice(toIndex, 0, removed);
      return result;
    };

    setFiles(prev => reorder(prev));
    setPreviews(prev => reorder(prev));
    setThumbnails(prev => reorder(prev));
  }, []);

  // Handle file input change
  const handleFileChange = useCallback((event) => {
    const selectedFiles = event.target.files;
    if (selectedFiles && selectedFiles.length > 0) {
      addFiles(selectedFiles);
    }
    // Reset input so same file can be selected again
    event.target.value = '';
  }, [addFiles]);

  // Handle drag and drop
  const handleDrop = useCallback((event) => {
    event.preventDefault();
    const droppedFiles = event.dataTransfer.files;
    if (droppedFiles && droppedFiles.length > 0) {
      addFiles(droppedFiles);
    }
  }, [addFiles]);

  const handleDragOver = useCallback((event) => {
    event.preventDefault();
  }, []);

  return {
    // State
    files,
    previews,
    thumbnails,
    isProcessing,
    progress,
    error,
    hasFiles: files.length > 0,
    fileCount: files.length,
    canAddMore: files.length < maxFiles,

    // Actions
    addFiles,
    removeFile,
    clearFiles,
    reorderFiles,

    // Event handlers
    handleFileChange,
    handleDrop,
    handleDragOver,

    // Clear error
    clearError: () => setError(null)
  };
}

/**
 * Simple single image upload hook
 */
export function useSingleImageUpload(options = {}) {
  const hook = useImageUpload({ ...options, maxFiles: 1 });

  return {
    ...hook,
    file: hook.files[0] || null,
    preview: hook.previews[0] || null,
    thumbnail: hook.thumbnails[0] || null,
    setFile: (file) => {
      hook.clearFiles();
      if (file) hook.addFiles([file]);
    },
    clearFile: hook.clearFiles
  };
}

export default useImageUpload;
