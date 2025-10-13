import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function EnhancedSocialFeed() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newPost, setNewPost] = useState('');
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [filter, setFilter] = useState('all'); // all, following, trending
  const [stories, setStories] = useState([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [posting, setPosting] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchFeed();
    fetchStories();
    loadCurrentUser();
  }, [filter]);

  const loadCurrentUser = () => {
    const user = {
      id: localStorage.getItem('cybev_user_id') || 'current_user',
      username: localStorage.getItem('cybev_username') || 'user',
      avatar: localStorage.getItem('cybev_avatar') || '/default-avatar.png'
    };
    setCurrentUser(user);
  };

  const fetchFeed = async () => {
    try {
      const token = localStorage.getItem('cybev_token');
      const response = await axios.get(`/api/posts/feed?filter=${filter}`, {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });
      setPosts(response.data.posts || []);
    } catch (error) {
      console.error('Failed to fetch feed:', error);
      // Fallback to mock data
      setPosts(getMockPosts());
    } finally {
      setLoading(false);
    }
  };

  const fetchStories = async () => {
    try {
      const response = await axios.get('/api/stories/feed');
      setStories(response.data.stories || []);
    } catch (error) {
      setStories(getMockStories());
    }
  };

  const handleMediaSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error('File size must be less than 10MB');
        return;
      }
      
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'video/mp4', 'video/webm'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Only images (JPEG, PNG, GIF) and videos (MP4, WebM) are allowed');
        return;
      }

      setSelectedMedia(file);
      setMediaPreview(URL.createObjectURL(file));
    }
  };

  const removeMedia = () => {
    setSelectedMedia(null);
    if (mediaPreview) {
      URL.revokeObjectURL(mediaPreview);
      setMediaPreview(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const createPost = async () => {
    if (!newPost.trim() && !selectedMedia) {
      toast.error('Please add some content or media to your post');
      return;
    }

    setPosting(true);
    const formData = new FormData();
    formData.append('content', newPost);
    if (selectedMedia) {
      formData.append('media', selectedMedia);
    }

    try {
      const token = localStorage.getItem('cybev_token');
      const response = await axios.post('/api/posts/create', formData, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          'Authorization': token ? `Bearer ${token}` : ''
        }
      });
      
      // Add new post to the top of the feed
      const newPostData = {
        id: response.data.postId || Date.now(),
        username: currentUser.username,
        avatar: currentUser.avatar,
        content: newPost,
        media: mediaPreview,
        timestamp: 'now',
        likes: 0,
        comments: 0,
        shares: 0,
        boosted: false,
        liked: false
      };

      setPosts([newPostData, ...posts]);
      setNewPost('');
      removeMedia();
      toast.success('🎉 Post created! You earned 5 CYBEV tokens');
    } catch (error) {
      toast.error('Failed to create post');
      console.error('Post creation error:', error);
    } finally {
      setPosting(false);
    }
  };

  const handleReaction = async (postId, action) => {
    try {
      const token = localStorage.getItem('cybev_token');
      await axios.post(`/api/posts/${postId}/${action}`, {}, {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });
      
      setPosts(posts.map(post => {
        if (post.id === postId) {
          switch (action) {
            case 'like':
              return { 
                ...post, 
                likes: post.liked ? post.likes - 1 : post.likes + 1,
                liked: !post.liked 
              };
            case 'boost':
              return { ...post, boosted: true, boostCount: (post.boostCount || 0) + 1 };
            default:
              return post;
          }
        }
        return post;
      }));

      if (action === 'like') {
        toast.success('👍 Liked! You earned 1 CYBEV token');
      } else if (action === 'boost') {
        toast.success('🚀 Post boosted! Cost: 10 CYBEV tokens');
      }
    } catch (error) {
      toast.error('Action failed');
    }
  };

  const addEmoji = (emoji) => {
    setNewPost(prev => prev + emoji);
    setShowEmojiPicker(false);
  };

  const getMockPosts = () => [
    {
      id: 1,
      username: 'cryptoqueen',
      avatar: 'https://i.pravatar.cc/150?img=1',
      content: 'Just minted my first NFT on CYBEV! The AI-powered content creation is absolutely game-changing 🚀 #Web3 #NFT #CYBEV #ContentCreation',
      media: 'https://source.unsplash.com/400x300?nft,crypto',
      timestamp: '2h ago',
      likes: 34,
      comments: 12,
      shares: 8,
      boosted: true,
      liked: false
    },
    {
      id: 2,
      username: 'blockbuilder',
      avatar: 'https://i.pravatar.cc/150?img=2',
      content: 'AI-powered content generation is changing everything. The quality of blog posts I can create now with CYBEV AI is incredible! What are your thoughts on AI in creative work?',
      media: null,
      timestamp: '4h ago',
      likes: 28,
      comments: 15,
      shares: 6,
      boosted: false,
      liked: true
    },
    {
      id: 3,
      username: 'nftartist',
      avatar: 'https://i.pravatar.cc/150?img=3',
      content: 'Created my blog in under 5 minutes with CYBEV\'s blog builder. The AI suggestions for titles and descriptions are spot on! 💯',
      media: 'https://source.unsplash.com/400x300?blog,website',
      timestamp: '6h ago',
      likes: 45,
      comments: 20,
      shares: 12,
      boosted: true,
      liked: false
    }
  ];

  const getMockStories = () => [
    { id: 1, username: 'You', avatar: currentUser?.avatar, hasStory: false },
    { id: 2, username: 'cryptoqueen', avatar: 'https://i.pravatar.cc/150?img=1', hasStory: true },
    { id: 3, username: 'blockbuilder', avatar: 'https://i.pravatar.cc/150?img=2', hasStory: true },
    { id: 4, username: 'nftartist', avatar: 'https://i.pravatar.cc/150?img=3', hasStory: true },
    { id: 5, username: 'aiexpert', avatar: 'https://i.pravatar.cc/150?img=4', hasStory: true }
  ];

  const popularEmojis = ['😀', '😍', '🤩', '😂', '🔥', '💯', '🚀', '💎', '🎉', '👏', '❤️', '💪'];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      {/* Stories Section */}
      <div className="bg-white dark:bg-gray-900 border-b dark:border-gray-800 p-4 sticky top-0 z-40">
        <div className="flex gap-4 overflow-x-auto pb-2">
          {stories.map((story) => (
            <div key={story.id} className="flex flex-col items-center space-y-1 cursor-pointer flex-shrink-0">
              <div className={`w-16 h-16 rounded-full p-1 ${story.hasStory ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 'bg-gray-300 dark:bg-gray-700'}`}>
                <img
                  src={story.avatar}
                  alt={story.username}
                  className="w-full h-full rounded-full object-cover border-2 border-white"
                />
                {story.username === 'You' && !story.hasStory && (
                  <div className="absolute bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs -mt-2 ml-11">+</div>
                )}
              </div>
              <span className="text-xs text-gray-600 dark:text-gray-400 max-w-16 truncate">
                {story.username}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-2xl mx-auto p-4">
        {/* Create Post Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 mb-6"
        >
          <div className="flex items-start gap-4">
            <img
              src={currentUser?.avatar}
              alt="Your avatar"
              className="w-12 h-12 rounded-full object-cover"
            />
            <div className="flex-1">
              <textarea
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                placeholder="What's happening in Web3? Share your thoughts..."
                className="w-full p-3 border-0 resize-none focus:outline-none bg-gray-50 dark:bg-gray-800 rounded-lg text-lg"
                rows={3}
                maxLength={500}
              />
              
              <div className="text-xs text-gray-500 mt-1 text-right">
                {newPost.length}/500
              </div>
              
              {mediaPreview && (
                <div className="mt-3 relative">
                  {selectedMedia?.type.startsWith('image/') ? (
                    <img
                      src={mediaPreview}
                      alt="Selected media"
                      className="max-w-full h-48 object-cover rounded-lg"
                    />
                  ) : (
                    <video
                      src={mediaPreview}
                      controls
                      className="max-w-full h-48 object-cover rounded-lg"
                    />
                  )}
                  <button
                    onClick={removeMedia}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 transition"
                  >
                    ×
                  </button>
                </div>
              )}

              {/* Emoji Picker */}
              {showEmojiPicker && (
                <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="grid grid-cols-6 gap-2">
                    {popularEmojis.map((emoji) => (
                      <button
                        key={emoji}
                        onClick={() => addEmoji(emoji)}
                        className="text-2xl hover:bg-gray-200 dark:hover:bg-gray-700 rounded p-1"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between mt-4">
                <div className="flex gap-4">
                  <label className="cursor-pointer text-gray-500 hover:text-blue-500 transition flex items-center gap-1">
                    <span className="text-xl">📷</span>
                    <span className="text-sm">Photo/Video</span>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*,video/*"
                      onChange={handleMediaSelect}
                      className="hidden"
                    />
                  </label>
                  
                  <button 
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className="text-gray-500 hover:text-yellow-500 transition flex items-center gap-1"
                  >
                    <span className="text-xl">😀</span>
                    <span className="text-sm">Emoji</span>
                  </button>
                  
                  <button className="text-gray-500 hover:text-purple-500 transition flex items-center gap-1">
                    <span className="text-xl">🤖</span>
                    <span className="text-sm">AI Help</span>
                  </button>
                </div>
                
                <button
                  onClick={createPost}
                  disabled={(!newPost.trim() && !selectedMedia) || posting}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-full hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium"
                >
                  {posting ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Posting...
                    </span>
                  ) : (
                    'Post'
                  )}
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Filter Tabs */}
        <div className="flex gap-1 mb-6 bg-white dark:bg-gray-900 rounded-lg p-1 shadow">
          {[
            { key: 'all', label: 'All Posts', icon: '🌐' },
            { key: 'following', label: 'Following', icon: '👥' },
            { key: 'trending', label: 'Trending', icon: '🔥' }
          ].map((filterType) => (
            <button
              key={filterType.key}
              onClick={() => setFilter(filterType.key)}
              className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition-all ${
                filter === filterType.key
                  ? 'bg-blue-500 text-white transform scale-105'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <span className="mr-2">{filterType.icon}</span>
              {filterType.label}
            </button>
          ))}
        </div>

        {/* Posts Feed */}
        <AnimatePresence>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            posts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg mb-6 overflow-hidden hover:shadow-xl transition-shadow"
              >
                {/* Post Header */}
                <div className="p-6 pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={post.avatar}
                        alt={post.username}
                        className="w-12 h-12 rounded-full object-cover ring-2 ring-gray-200 dark:ring-gray-700"
                      />
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white hover:text-blue-500 cursor-pointer transition">
                          @{post.username}
                        </h3>
                        <p className="text-sm text-gray-500">{post.timestamp}</p>
                      </div>
                    </div>
                    
                    {post.boosted && (
                      <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                        <span>🚀</span>
                        BOOSTED
                      </div>
                    )}
                  </div>
                </div>

                {/* Post Content */}
                <div className="px-6 pb-4">
                  <p className="text-gray-800 dark:text-gray-200 mb-4 leading-relaxed text-lg">
                    {post.content}
                  </p>
                  
                  {post.media && (
                    <div className="rounded-lg overflow-hidden">
                      {post.media.includes('video') ? (
                        <video
                          src={post.media}
                          controls
                          className="w-full max-h-96 object-cover"
                        />
                      ) : (
                        <img
                          src={post.media}
                          alt="Post media"
                          className="w-full max-h-96 object-cover hover:scale-105 transition-transform duration-300 cursor-pointer"
                        />
                      )}
                    </div>
                  )}
                </div>

                {/* Engagement Stats */}
                <div className="px-6 py-2 text-sm text-gray-500 border-t dark:border-gray-800">
                  <div className="flex items-center gap-4">
                    <span>{post.likes} likes</span>
                    <span>{post.comments} comments</span>
                    <span>{post.shares} shares</span>
                    {post.boostCount > 0 && <span>{post.boostCount} boosts</span>}
                  </div>
                </div>

                {/* Engagement Bar */}
                <div className="px-6 py-4 border-t dark:border-gray-800">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      <button
                        onClick={() => handleReaction(post.id, 'like')}
                        className={`flex items-center gap-2 transition-all hover:scale-110 ${
                          post.liked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
                        }`}
                      >
                        <span className="text-xl">{post.liked ? '❤️' : '🤍'}</span>
                        <span className="text-sm font-medium">Like</span>
                      </button>

                      <button className="flex items-center gap-2 text-gray-500 hover:text-blue-500 transition-all hover:scale-110">
                        <span className="text-xl">💬</span>
                        <span className="text-sm font-medium">Comment</span>
                      </button>

                      <button className="flex items-center gap-2 text-gray-500 hover:text-green-500 transition-all hover:scale-110">
                        <span className="text-xl">🔗</span>
                        <span className="text-sm font-medium">Share</span>
                      </button>
                    </div>

                    <button
                      onClick={() => handleReaction(post.id, 'boost')}
                      disabled={post.boosted}
                      className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-medium hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105"
                    >
                      🚀 Boost (10 CYBV)
                    </button>
                  </div>
                </div>

                {/* Quick Comments */}
                <div className="px-6 pb-6">
                  <div className="flex gap-3">
                    <img
                      src={currentUser?.avatar}
                      alt="Your avatar"
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <input
                      type="text"
                      placeholder="Write a comment..."
                      className="flex-1 bg-gray-50 dark:bg-gray-800 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && e.target.value.trim()) {
                          toast.success('Comment added! +2 CYBEV tokens');
                          e.target.value = '';
                        }
                      }}
                    />
                    <button className="text-blue-500 hover:text-blue-600 font-medium text-sm px-3">
                      Post
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>

        {/* Load More */}
        {!loading && posts.length > 0 && (
          <div className="text-center py-8">
            <button
              onClick={fetchFeed}
              className="bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-8 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Load More Posts
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && posts.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📱</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No posts yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Be the first to share something amazing!
            </p>
            <button
              onClick={() => document.querySelector('textarea').focus()}
              className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition"
            >
              Create First Post
            </button>
          </div>
        )}
      </div>

      {/* Floating Action Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-500 to-purple-500 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-2xl z-50"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        ↑
      </motion.button>

      {/* Token Earning Notification */}
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed bottom-20 left-6 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg hidden"
        id="token-notification"
      >
        <span className="text-sm font-medium">+5 CYBV earned! 🎉</span>
      </motion.div>
    </div>
  );
}
