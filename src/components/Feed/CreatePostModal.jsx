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

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    
    files.forEach(file => {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert(`${file.name} is too large. Maximum size is 5MB.`);
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        // For now, just store the placeholder
        // In production, upload to Cloudinary/S3 first
        setImages(prev => [...prev, {
          url: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809', // Placeholder
          file,
          alt: file.name,
          localPreview: event.target.result // For preview only
        }]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!content.trim() && images.length === 0) {
      alert('Please add some content or images!');
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.cybev.io/api';

      // For now, use placeholder images instead of base64
      // TODO: Upload images to Cloudinary/S3 first
      const imageUrls = images.map(img => ({
        url: img.url, // Use placeholder URL
        alt: img.alt
      }));

      const response = await fetch(`${API_URL}/posts`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          content,
          images: imageUrls,
          type: images.length > 0 ? 'image' : 'text',
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
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">Create Post</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-gray-600" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
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
              className="w-full min-h-[200px] text-lg resize-none border-none focus:ring-0 focus:outline-none placeholder-gray-400"
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
                    <button
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
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
          <div className="p-6 border-t border-gray-200">
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
