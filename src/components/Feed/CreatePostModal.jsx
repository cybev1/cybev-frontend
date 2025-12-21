import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Image as ImageIcon,
  Smile,
  MapPin,
  Send,
  Loader2
} from 'lucide-react';

export default function CreatePostModal({ isOpen, onClose, onPostCreated }) {
  const [content, setContent] = useState('');
  const [images, setImages] = useState([]);
  const [visibility, setVisibility] = useState('public');
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const fileInputRef = useRef(null);

  const maxLength = 5000;
  const remaining = maxLength - content.length;

  // Get user data on mount
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (e) {
        console.error('Failed to parse user data:', e);
      }
    }
  }, []);

  // Mobile UX: lock background scroll while modal is open
  useEffect(() => {
    if (typeof document === 'undefined') return;
    if (!isOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen]);

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    
    for (const file of files) {
      // Validation
      if (file.size > 10 * 1024 * 1024) {
        alert(`${file.name} is too large. Maximum size is 10MB.`);
        continue;
      }

      if (!file.type.startsWith('image/')) {
        alert(`${file.name} is not an image file.`);
        continue;
      }

      // Show preview immediately
      const reader = new FileReader();
      reader.onload = (event) => {
        setImages(prev => [...prev, {
          file,
          localPreview: event.target.result,
          uploading: true,
          url: null,
          alt: file.name
        }]);
      };
      reader.readAsDataURL(file);

      // Upload to Cloudinary
      try {
        const formData = new FormData();
        formData.append('image', file);

        const token = localStorage.getItem('token');
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.cybev.io';

        console.log('📸 Uploading image to Cloudinary:', file.name);

        const response = await fetch(`${API_URL}/api/upload/image`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData
        });

        const data = await response.json();

        if (data.success) {
          console.log('✅ Image uploaded:', data.url);
          
          // Update image with real URL
          setImages(prev => prev.map(img => 
            img.file === file ? {
              ...img,
              url: data.url,
              uploading: false
            } : img
          ));
        } else {
          throw new Error(data.error || 'Upload failed');
        }
      } catch (error) {
        console.error('❌ Upload failed:', error);
        alert(`Failed to upload ${file.name}: ${error.message}`);
        
        // Remove failed image
        setImages(prev => prev.filter(img => img.file !== file));
      }
    }
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!content.trim() && images.length === 0) {
      alert('Please add some content or images!');
      return;
    }

    // Check if any images are still uploading
    const stillUploading = images.some(img => img.uploading);
    if (stillUploading) {
      alert('⏳ Please wait for images to finish uploading...');
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.cybev.io';

      // Get only successfully uploaded images with real URLs
      const imageUrls = images
        .filter(img => img.url && !img.uploading) // Only uploaded images
        .map(img => ({
          url: img.url, // Real Cloudinary URL
          alt: img.alt
        }));

      console.log('📤 Creating post with', imageUrls.length, 'images');

      const response = await fetch(`${API_URL}/posts`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          content,
          images: imageUrls,
          type: imageUrls.length > 0 ? 'image' : 'text',
          visibility
        })
      });

      const data = await response.json();

      if (data.success) {
        alert(`🎉 ${data.message}`);
        
        // Reset form
        setContent('');
        setImages([]);
        setVisibility('public');
        
        // Call callback
        if (onPostCreated) {
          onPostCreated(data.post);
        }
        
        // Close modal
        onClose();
      } else {
        throw new Error(data.error || 'Failed to create post');
      }

    } catch (error) {
      console.error('❌ Post creation error:', error);
      alert('Failed to create post: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-0 sm:p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white sm:rounded-3xl rounded-none shadow-2xl w-full sm:max-w-2xl h-[100dvh] sm:h-auto sm:max-h-[90vh] overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">Create Post</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-gray-600" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto ios-scroll p-4 sm:p-6">
            {/* User Info */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center text-white font-bold text-lg">
                {user?.name?.[0]?.toUpperCase() || user?.username?.[0]?.toUpperCase() || 'U'}
              </div>
              <div>
                <div className="font-bold text-gray-900">
                  {user?.name || user?.username || 'User'}
                </div>
                <select
                  value={visibility}
                  onChange={(e) => setVisibility(e.target.value)}
                  className="text-sm text-gray-600 bg-gray-100 rounded-lg px-3 py-1 border-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="public">🌍 Public</option>
                  <option value="followers">👥 Followers</option>
                  <option value="private">🔒 Only me</option>
                </select>
              </div>
            </div>

            {/* Text Area */}
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What's on your mind?"
              className="w-full min-h-[160px] sm:min-h-[200px] text-lg resize-none border-none focus:ring-0 focus:outline-none placeholder-gray-400"
              maxLength={maxLength}
            />

            {/* Character Count */}
            <div className="text-sm text-right text-gray-500 mb-4">
              {remaining} characters remaining
            </div>

            {/* Image Preview */}
            {images.length > 0 && (
              <div className="grid grid-cols-2 gap-4 mb-4">
                {images.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={image.localPreview || image.url}
                      alt={image.alt}
                      className="w-full h-48 object-cover rounded-xl"
                    />
                    
                    {/* Uploading overlay */}
                    {image.uploading && (
                      <div className="absolute inset-0 bg-black/50 rounded-xl flex items-center justify-center">
                        <div className="text-white text-center">
                          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
                          <p className="text-sm font-semibold">Uploading...</p>
                        </div>
                      </div>
                    )}
                    
                    {/* Success checkmark */}
                    {!image.uploading && image.url && (
                      <div className="absolute top-2 left-2 bg-green-500 text-white rounded-full p-1">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                    
                    <button
                      onClick={() => removeImage(index)}
                      disabled={image.uploading}
                      className={`absolute top-2 right-2 p-2 bg-red-600 text-white rounded-full transition-opacity ${
                        image.uploading 
                          ? 'opacity-50 cursor-not-allowed' 
                          : 'opacity-0 group-hover:opacity-100'
                      }`}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Action Buttons */}
            <div className="border border-gray-200 rounded-xl p-4">
              <p className="text-sm font-semibold text-gray-700 mb-3">Add to your post</p>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors font-medium"
                >
                  <ImageIcon className="w-5 h-5" />
                  <span className="hidden sm:inline">Photo</span>
                </button>
                <button
                  onClick={() => alert('🎨 Emoji picker coming soon!')}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors font-medium"
                >
                  <Smile className="w-5 h-5" />
                  <span className="hidden sm:inline">Feeling</span>
                </button>
                <button
                  onClick={() => alert('📍 Location coming soon!')}
                  className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium"
                >
                  <MapPin className="w-5 h-5" />
                  <span className="hidden sm:inline">Location</span>
                </button>
              </div>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>

          {/* Footer */}
          <div className="p-4 sm:p-6 border-t border-gray-200 bg-white/95 backdrop-blur sticky bottom-0">
            <button
              onClick={handleSubmit}
              disabled={loading || (!content.trim() && images.length === 0)}
              className={`w-full py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 ${
                loading || (!content.trim() && images.length === 0)
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg hover:scale-[1.02]'
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Posting...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Post
                </>
              )}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
