// ============================================
// FILE: src/pages/feed.jsx
// PATH: cybev-frontend/src/pages/feed.jsx
// PURPOSE: Main feed with posts, reactions, FIXED IMAGE PREVIEWS
// ============================================

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import AppLayout from '@/components/Layout/AppLayout';
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  MoreHorizontal,
  Image as ImageIcon,
  Video,
  Smile,
  Send,
  Clock,
  TrendingUp,
  Users,
  Eye,
  X,
  Play,
  ChevronLeft,
  ChevronRight,
  Loader2
} from 'lucide-react';
import api from '@/lib/api';

// Reaction types
const REACTIONS = [
  { type: 'like', emoji: '👍', label: 'Like' },
  { type: 'love', emoji: '❤️', label: 'Love' },
  { type: 'fire', emoji: '🔥', label: 'Fire' },
  { type: 'haha', emoji: '😂', label: 'Haha' },
  { type: 'wow', emoji: '😮', label: 'Wow' },
  { type: 'sad', emoji: '😢', label: 'Sad' },
  { type: 'angry', emoji: '😠', label: 'Angry' }
];

// ==========================================
// IMAGE GALLERY MODAL
// ==========================================
function ImageGallery({ images, onClose, initialIndex = 0 }) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  if (!images || images.length === 0) return null;

  return (
    <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center" onClick={onClose}>
      <button onClick={onClose} className="absolute top-4 right-4 p-2 text-white hover:bg-white/10 rounded-full z-10">
        <X className="w-8 h-8" />
      </button>

      {images.length > 1 && (
        <>
          <button
            onClick={(e) => { e.stopPropagation(); setCurrentIndex((prev) => (prev - 1 + images.length) % images.length); }}
            className="absolute left-4 p-3 text-white hover:bg-white/10 rounded-full z-10"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); setCurrentIndex((prev) => (prev + 1) % images.length); }}
            className="absolute right-4 p-3 text-white hover:bg-white/10 rounded-full z-10"
          >
            <ChevronRight className="w-8 h-8" />
          </button>
        </>
      )}

      <img
        src={images[currentIndex]}
        alt={`Image ${currentIndex + 1}`}
        className="max-w-[90vw] max-h-[90vh] object-contain"
        onClick={(e) => e.stopPropagation()}
      />

      {images.length > 1 && (
        <div className="absolute bottom-6 flex gap-2">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={(e) => { e.stopPropagation(); setCurrentIndex(i); }}
              className={`w-3 h-3 rounded-full transition-colors ${i === currentIndex ? 'bg-white' : 'bg-white/40'}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ==========================================
// POST MEDIA DISPLAY COMPONENT
// ==========================================
function PostMedia({ post, onImageClick }) {
  // Extract ALL possible images from the post
  const getImages = () => {
    const imgs = [];
    
    // Direct image fields
    if (post.featuredImage) imgs.push(post.featuredImage);
    if (post.coverImage) imgs.push(post.coverImage);
    if (post.image) imgs.push(post.image);
    if (post.thumbnail) imgs.push(post.thumbnail);
    if (post.banner) imgs.push(post.banner);
    if (post.heroImage) imgs.push(post.heroImage);
    
    // Images array
    if (Array.isArray(post.images)) {
      post.images.forEach(img => {
        if (typeof img === 'string') imgs.push(img);
        else if (img?.url) imgs.push(img.url);
      });
    }
    
    // Media array
    if (Array.isArray(post.media)) {
      post.media.forEach(m => {
        if (m?.type === 'image' && m?.url) imgs.push(m.url);
        else if (typeof m === 'string' && m.match(/\.(jpg|jpeg|png|gif|webp)$/i)) imgs.push(m);
      });
    }
    
    // Attachments
    if (Array.isArray(post.attachments)) {
      post.attachments.forEach(a => {
        if (a?.type === 'image' && a?.url) imgs.push(a.url);
      });
    }
    
    // Remove duplicates and invalid
    return [...new Set(imgs)].filter(img => img && typeof img === 'string');
  };

  // Get video URL
  const getVideo = () => {
    if (post.videoUrl) return post.videoUrl;
    if (post.video) return post.video;
    if (Array.isArray(post.media)) {
      const video = post.media.find(m => m?.type === 'video' || (typeof m === 'string' && m.match(/\.(mp4|webm|mov)$/i)));
      return video?.url || (typeof video === 'string' ? video : null);
    }
    return null;
  };

  const images = getImages();
  const video = getVideo();

  // No media
  if (images.length === 0 && !video) return null;

  // Video takes priority
  if (video) {
    return (
      <div className="relative bg-black">
        <video
          src={video}
          controls
          poster={images[0]}
          className="w-full max-h-[500px] object-contain"
          preload="metadata"
        />
      </div>
    );
  }

  // Single image - full width display
  if (images.length === 1) {
    return (
      <div 
        className="relative cursor-pointer overflow-hidden bg-gray-900"
        onClick={() => onImageClick(images, 0)}
      >
        <img
          src={images[0]}
          alt="Post image"
          className="w-full max-h-[500px] object-cover hover:opacity-95 transition-opacity"
          loading="lazy"
          onError={(e) => { e.target.style.display = 'none'; }}
        />
      </div>
    );
  }

  // Two images - side by side
  if (images.length === 2) {
    return (
      <div className="grid grid-cols-2 gap-0.5 bg-gray-900">
        {images.map((img, i) => (
          <div 
            key={i} 
            className="aspect-square cursor-pointer overflow-hidden"
            onClick={() => onImageClick(images, i)}
          >
            <img
              src={img}
              alt={`Image ${i + 1}`}
              className="w-full h-full object-cover hover:opacity-95 transition-opacity"
              loading="lazy"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          </div>
        ))}
      </div>
    );
  }

  // Three images - one large, two small
  if (images.length === 3) {
    return (
      <div className="grid grid-cols-2 gap-0.5 bg-gray-900">
        <div 
          className="row-span-2 cursor-pointer overflow-hidden"
          onClick={() => onImageClick(images, 0)}
        >
          <img
            src={images[0]}
            alt="Image 1"
            className="w-full h-full object-cover hover:opacity-95 transition-opacity"
            loading="lazy"
          />
        </div>
        {images.slice(1, 3).map((img, i) => (
          <div 
            key={i} 
            className="aspect-square cursor-pointer overflow-hidden"
            onClick={() => onImageClick(images, i + 1)}
          >
            <img
              src={img}
              alt={`Image ${i + 2}`}
              className="w-full h-full object-cover hover:opacity-95 transition-opacity"
              loading="lazy"
            />
          </div>
        ))}
      </div>
    );
  }

  // Four or more images - 2x2 grid with +N overlay
  return (
    <div className="grid grid-cols-2 gap-0.5 bg-gray-900">
      {images.slice(0, 4).map((img, i) => (
        <div 
          key={i} 
          className="relative aspect-square cursor-pointer overflow-hidden"
          onClick={() => onImageClick(images, i)}
        >
          <img
            src={img}
            alt={`Image ${i + 1}`}
            className="w-full h-full object-cover hover:opacity-95 transition-opacity"
            loading="lazy"
          />
          {i === 3 && images.length > 4 && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <span className="text-white text-3xl font-bold">+{images.length - 4}</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ==========================================
// POST CARD COMPONENT
// ==========================================
function PostCard({ post }) {
  const [userReaction, setUserReaction] = useState(null);
  const [reactionCount, setReactionCount] = useState(post.likes?.length || post.reactionCount || post.likesCount || 0);
  const [showReactions, setShowReactions] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState(post.comments || []);
  const [newComment, setNewComment] = useState('');
  const [bookmarked, setBookmarked] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  const [galleryImages, setGalleryImages] = useState([]);
  const [galleryIndex, setGalleryIndex] = useState(0);

  const handleReaction = async (reactionType) => {
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
      await api.post(`/api/reactions/post/${post._id}`, { type: reactionType }, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (error) {}
    
    if (userReaction === reactionType) {
      setUserReaction(null);
      setReactionCount(prev => Math.max(0, prev - 1));
    } else {
      if (!userReaction) setReactionCount(prev => prev + 1);
      setUserReaction(reactionType);
    }
    setShowReactions(false);
  };

  const handleComment = async () => {
    if (!newComment.trim()) return;
    
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      
      const response = await api.post(`/api/comments/${post._id}`, { content: newComment }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.ok) {
        setComments([...comments, response.data.comment]);
      } else {
        setComments([...comments, {
          _id: Date.now(),
          content: newComment,
          author: { name: userData.name || 'You' },
          createdAt: new Date()
        }]);
      }
    } catch (error) {
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      setComments([...comments, {
        _id: Date.now(),
        content: newComment,
        author: { name: userData.name || 'You' },
        createdAt: new Date()
      }]);
    }
    setNewComment('');
  };

  const handleBookmark = () => setBookmarked(!bookmarked);

  const handleShare = (platform) => {
    const url = `${window.location.origin}/post/${post._id}`;
    const text = post.content?.slice(0, 100) || post.title || 'Check this out!';
    
    switch (platform) {
      case 'copy':
        navigator.clipboard.writeText(url);
        alert('Link copied!');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`);
        break;
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`);
        break;
    }
    setShowShareMenu(false);
  };

  const openGallery = (images, index) => {
    setGalleryImages(images);
    setGalleryIndex(index);
    setShowGallery(true);
  };

  const getReactionEmoji = () => {
    if (!userReaction) return null;
    return REACTIONS.find(r => r.type === userReaction)?.emoji || '👍';
  };

  const author = post.author || post.user || {};

  return (
    <div className="bg-gray-800/50 rounded-2xl border border-purple-500/20 overflow-hidden">
      {/* Author Header */}
      <div className="p-4 flex items-center justify-between">
        <Link href={`/profile/${author.username || 'user'}`}>
          <div className="flex items-center gap-3 cursor-pointer hover:opacity-80">
            <div className="w-11 h-11 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold overflow-hidden">
              {author.avatar ? (
                <img src={author.avatar} alt="" className="w-full h-full object-cover" />
              ) : (
                author.name?.[0] || 'U'
              )}
            </div>
            <div>
              <h4 className="text-white font-semibold">{author.name || 'Anonymous'}</h4>
              <p className="text-gray-400 text-sm">@{author.username || 'user'} · {new Date(post.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
        </Link>
        <button className="p-2 hover:bg-gray-700 rounded-full">
          <MoreHorizontal className="w-5 h-5 text-gray-400" />
        </button>
      </div>

      {/* Content */}
      <div className="px-4 pb-3">
        {post.title && (
          <Link href={`/blog/${post.slug || post._id}`}>
            <h3 className="text-xl font-bold text-white mb-2 hover:text-purple-400 cursor-pointer">{post.title}</h3>
          </Link>
        )}
        {(post.content || post.excerpt || post.description || post.body) && (
          <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">
            {post.content || post.excerpt || post.description || post.body}
          </p>
        )}
      </div>

      {/* MEDIA SECTION - Images & Videos */}
      <PostMedia post={post} onImageClick={openGallery} />

      {/* Stats */}
      <div className="px-4 py-2 flex items-center justify-between text-gray-400 text-sm border-t border-gray-700/50">
        <div className="flex items-center gap-3">
          {reactionCount > 0 && (
            <span>{getReactionEmoji() || '👍'} {reactionCount}</span>
          )}
        </div>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1"><Eye className="w-4 h-4" />{post.views || 0}</span>
          <span>{comments.length} comments</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="px-2 py-1 flex items-center justify-around border-t border-gray-700/50">
        {/* Like */}
        <div className="relative">
          <button
            onClick={() => handleReaction('like')}
            onMouseEnter={() => setShowReactions(true)}
            onMouseLeave={() => setTimeout(() => setShowReactions(false), 200)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition-colors ${userReaction ? 'text-purple-400' : 'text-gray-400 hover:bg-gray-700/50'}`}
          >
            {userReaction ? <span className="text-xl">{getReactionEmoji()}</span> : <Heart className="w-5 h-5" />}
            <span className="hidden sm:inline">{userReaction ? REACTIONS.find(r => r.type === userReaction)?.label : 'Like'}</span>
          </button>
          
          {showReactions && (
            <div
              className="absolute bottom-full left-0 mb-2 bg-gray-800 rounded-full px-3 py-2 flex gap-1 shadow-xl border border-gray-700 z-20"
              onMouseEnter={() => setShowReactions(true)}
              onMouseLeave={() => setShowReactions(false)}
            >
              {REACTIONS.map((r) => (
                <button
                  key={r.type}
                  onClick={() => handleReaction(r.type)}
                  className="text-2xl hover:scale-125 transition-transform p-1"
                  title={r.label}
                >
                  {r.emoji}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Comment */}
        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-gray-400 hover:bg-gray-700/50 transition-colors"
        >
          <MessageCircle className="w-5 h-5" />
          <span className="hidden sm:inline">Comment</span>
        </button>

        {/* Share */}
        <div className="relative">
          <button
            onClick={() => setShowShareMenu(!showShareMenu)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-gray-400 hover:bg-gray-700/50 transition-colors"
          >
            <Share2 className="w-5 h-5" />
            <span className="hidden sm:inline">Share</span>
          </button>
          
          {showShareMenu && (
            <div className="absolute bottom-full right-0 mb-2 bg-gray-800 rounded-xl p-2 shadow-xl border border-gray-700 min-w-[140px] z-20">
              <button onClick={() => handleShare('copy')} className="w-full px-3 py-2 text-left text-gray-300 hover:bg-gray-700 rounded-lg text-sm">Copy Link</button>
              <button onClick={() => handleShare('twitter')} className="w-full px-3 py-2 text-left text-gray-300 hover:bg-gray-700 rounded-lg text-sm">Twitter</button>
              <button onClick={() => handleShare('whatsapp')} className="w-full px-3 py-2 text-left text-gray-300 hover:bg-gray-700 rounded-lg text-sm">WhatsApp</button>
            </div>
          )}
        </div>

        {/* Bookmark */}
        <button
          onClick={handleBookmark}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition-colors ${bookmarked ? 'text-yellow-400' : 'text-gray-400 hover:bg-gray-700/50'}`}
        >
          <Bookmark className={`w-5 h-5 ${bookmarked ? 'fill-yellow-400' : ''}`} />
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="p-4 bg-gray-900/40 border-t border-gray-700/50">
          <div className="flex gap-3 mb-4">
            <div className="w-9 h-9 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex-shrink-0"></div>
            <div className="flex-1 flex gap-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleComment()}
                placeholder="Write a comment..."
                className="flex-1 bg-gray-800 border border-gray-700 rounded-full px-4 py-2 text-white text-sm focus:border-purple-500 focus:outline-none"
              />
              <button
                onClick={handleComment}
                disabled={!newComment.trim()}
                className="p-2 bg-purple-500 text-white rounded-full hover:bg-purple-600 disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <div className="space-y-3 max-h-60 overflow-y-auto">
            {comments.length === 0 ? (
              <p className="text-gray-500 text-center text-sm py-4">No comments yet</p>
            ) : (
              comments.map((comment) => (
                <div key={comment._id} className="flex gap-3">
                  <div className="w-8 h-8 bg-gray-700 rounded-full flex-shrink-0 flex items-center justify-center text-white text-xs font-bold">
                    {comment.author?.name?.[0] || 'U'}
                  </div>
                  <div className="flex-1">
                    <div className="bg-gray-800 rounded-2xl px-4 py-2">
                      <p className="text-white text-sm font-medium">{comment.author?.name || 'User'}</p>
                      <p className="text-gray-300 text-sm">{comment.content}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Gallery Modal */}
      {showGallery && (
        <ImageGallery
          images={galleryImages}
          initialIndex={galleryIndex}
          onClose={() => setShowGallery(false)}
        />
      )}
    </div>
  );
}

// ==========================================
// CREATE POST COMPONENT
// ==========================================
function CreatePost({ onPostCreated }) {
  const [content, setContent] = useState('');
  const [images, setImages] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [posting, setPosting] = useState(false);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => setImages(prev => [...prev, e.target.result]);
      reader.readAsDataURL(file);
    });
  };

  const handlePost = async () => {
    if (!content.trim() && images.length === 0) return;
    setPosting(true);
    
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
      const response = await api.post('/api/posts', { content, images }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.ok) {
        setContent('');
        setImages([]);
        setIsExpanded(false);
        if (onPostCreated) onPostCreated(response.data.post);
      }
    } catch (error) {
      console.error('Post error:', error);
    } finally {
      setPosting(false);
    }
  };

  return (
    <div className="bg-gray-800/50 rounded-2xl p-4 border border-purple-500/20 mb-6">
      <div className="flex gap-3">
        <div className="w-11 h-11 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex-shrink-0"></div>
        <div className="flex-1">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onFocus={() => setIsExpanded(true)}
            placeholder="What's on your mind?"
            rows={isExpanded ? 4 : 1}
            className="w-full bg-transparent text-white placeholder-gray-400 resize-none focus:outline-none"
          />
          
          {images.length > 0 && (
            <div className="grid grid-cols-4 gap-2 mt-3">
              {images.map((img, i) => (
                <div key={i} className="relative aspect-square rounded-lg overflow-hidden">
                  <img src={img} alt="" className="w-full h-full object-cover" />
                  <button onClick={() => setImages(images.filter((_, idx) => idx !== i))} className="absolute top-1 right-1 p-1 bg-black/60 rounded-full">
                    <X className="w-3 h-3 text-white" />
                  </button>
                </div>
              ))}
            </div>
          )}
          
          {isExpanded && (
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-700">
              <div className="flex gap-2">
                <label className="p-2 hover:bg-gray-700 rounded-lg cursor-pointer">
                  <ImageIcon className="w-5 h-5 text-green-400" />
                  <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" />
                </label>
                <button className="p-2 hover:bg-gray-700 rounded-lg"><Video className="w-5 h-5 text-red-400" /></button>
                <button className="p-2 hover:bg-gray-700 rounded-lg"><Smile className="w-5 h-5 text-yellow-400" /></button>
              </div>
              <div className="flex gap-2">
                <button onClick={() => { setIsExpanded(false); setContent(''); setImages([]); }} className="px-4 py-2 text-gray-400">Cancel</button>
                <button
                  onClick={handlePost}
                  disabled={(!content.trim() && images.length === 0) || posting}
                  className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-medium disabled:opacity-50 flex items-center gap-2"
                >
                  {posting && <Loader2 className="w-4 h-4 animate-spin" />}
                  Post
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ==========================================
// MAIN FEED PAGE
// ==========================================
export default function Feed() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const [filter, setFilter] = useState('latest');

  // Sample posts with IMAGES
  const samplePosts = [
    {
      _id: '1',
      author: { name: 'Sarah Chen', username: 'sarahchen' },
      content: 'Just finished my latest digital artwork! 🎨 What do you think?',
      featuredImage: 'https://images.unsplash.com/photo-1634017839464-5c339bbe3c9c?w=800&h=600&fit=crop',
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      likes: [1, 2, 3],
      views: 245,
      comments: []
    },
    {
      _id: '2',
      author: { name: 'Alex Rivera', username: 'alexrivera' },
      title: 'The Future of Web3 Content Creation',
      content: 'I\'ve been exploring how blockchain technology is revolutionizing the way creators monetize their work...',
      coverImage: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&h=600&fit=crop',
      createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
      likes: [1, 2, 3, 4, 5],
      views: 892,
      comments: [{ _id: '1', author: { name: 'Mike' }, content: 'Great insights!', createdAt: new Date() }]
    },
    {
      _id: '3',
      author: { name: 'Emma Wilson', username: 'emmawilson' },
      content: 'Beach vibes this weekend! 🏖️ Sometimes you need to disconnect to reconnect.',
      images: [
        'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1473116763249-2faaef81ccda?w=800&h=600&fit=crop'
      ],
      createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000),
      likes: [1, 2],
      views: 567,
      comments: []
    },
    {
      _id: '4',
      author: { name: 'Tech Daily', username: 'techdaily' },
      title: 'NFT Market Reaches New Highs',
      content: 'The NFT marketplace has seen unprecedented growth this quarter. Major brands are entering the space.',
      image: 'https://images.unsplash.com/photo-1620321023374-d1a68fbc720d?w=800&h=600&fit=crop',
      createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
      likes: [1, 2, 3, 4, 5, 6, 7, 8],
      views: 2341,
      comments: []
    },
    {
      _id: '5',
      author: { name: 'Creative Studio', username: 'creativestudio' },
      content: 'Our latest project showcase! 4 unique pieces from our team 🖼️',
      images: [
        'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1549490349-8643362247b5?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1551913902-c92207136625?w=800&h=600&fit=crop'
      ],
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
      likes: [1, 2, 3, 4, 5, 6],
      views: 1567,
      comments: []
    },
    {
      _id: '6',
      author: { name: 'Nature Lover', username: 'naturelover' },
      content: 'Morning hike in the mountains ⛰️ The view was absolutely breathtaking!',
      featuredImage: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&h=600&fit=crop',
      createdAt: new Date(Date.now() - 36 * 60 * 60 * 1000),
      likes: [1, 2, 3, 4],
      views: 890,
      comments: []
    }
  ];

  useEffect(() => {
    const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
    if (!token) {
      router.push('/auth/login');
      return;
    }

    const userData = localStorage.getItem('user');
    if (userData) {
      try { setUser(JSON.parse(userData)); } catch (e) {}
    }

    fetchPosts();
  }, [router, filter]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
      const response = await api.get(`/api/feed?sort=${filter}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.ok && response.data.posts?.length > 0) {
        setPosts(response.data.posts);
      } else {
        setPosts(samplePosts);
      }
    } catch (error) {
      console.log('Using sample posts');
      setPosts(samplePosts);
    } finally {
      setLoading(false);
    }
  };

  const handlePostCreated = (newPost) => setPosts([newPost, ...posts]);

  return (
    <AppLayout>
      <Head><title>Feed - CYBEV</title></Head>

      <div className="max-w-2xl mx-auto px-4 py-6">
        <CreatePost onPostCreated={handlePostCreated} />

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {[
            { id: 'latest', label: 'Latest', icon: Clock },
            { id: 'trending', label: 'Trending', icon: TrendingUp },
            { id: 'following', label: 'Following', icon: Users }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                filter === tab.id ? 'bg-purple-500 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Posts */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-purple-500 animate-spin" />
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400">No posts yet. Be the first!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
