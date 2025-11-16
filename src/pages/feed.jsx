import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AppLayout from '@/components/Layout/AppLayout';
import GreetingHeader from '@/components/Feed/GreetingHeader';
import QuickActions from '@/components/Feed/QuickActions';
import PostCard from '@/components/Feed/PostCard';
import { TrendingUp, Users, Hash, Radio } from 'lucide-react';

export default function UnifiedFeed() {
  const [activeTab, setActiveTab] = useState('for-you');
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    views: 1234,
    virality: 95,
    tokens: 450,
    growth: 15,
    streak: 7
  });

  useEffect(() => {
    fetchUserData();
    fetchPosts();
  }, [activeTab]);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.cybev.io';

      const response = await fetch(`${API_URL}/api/auth/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data);
      }
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.cybev.io';

      // Fetch published blogs
      const response = await fetch(`${API_URL}/api/blogs?status=published&limit=20`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setPosts(data.blogs || data.data || []);
      } else {
        // If blogs endpoint doesn't exist yet, use mock data
        setPosts(getMockPosts());
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
      setPosts(getMockPosts());
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'for-you', label: 'For You', icon: '🏠' },
    { id: 'following', label: 'Following', icon: '⚡' },
    { id: 'trending', label: 'Trending', icon: '🔥' },
    { id: 'ai-generated', label: 'AI', icon: '🤖' }
  ];

  return (
    <AppLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-pink-50">
        {/* Greeting Header */}
        <GreetingHeader user={user} stats={stats} />

        {/* Quick Actions */}
        <QuickActions />

        <div className="max-w-7xl mx-auto px-4 py-6 md:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Main Feed - Left/Center Column */}
            <div className="lg:col-span-8">
              {/* Tabs - white theme */}
              <div className="mb-6 bg-white/80 backdrop-blur-xl rounded-3xl p-1.5 border-2 border-purple-100 shadow-xl">
                <div className="grid grid-cols-4 gap-2">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`px-4 py-3 rounded-2xl font-bold text-sm transition-all ${
                        activeTab === tab.id
                          ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                          : 'text-gray-700 hover:bg-gray-50 border-2 border-transparent hover:border-purple-200'
                      }`}
                    >
                      <span className="hidden sm:inline">{tab.icon} </span>
                      <span className="hidden md:inline">{tab.label}</span>
                      <span className="md:hidden">{tab.icon}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Posts Feed */}
              {loading ? (
                <div className="space-y-6">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6 animate-pulse"
                    >
                      <div className="h-4 bg-white/20 rounded w-3/4 mb-4"></div>
                      <div className="h-48 bg-white/20 rounded mb-4"></div>
                      <div className="h-4 bg-white/20 rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
              ) : posts.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white/80 backdrop-blur-xl rounded-3xl border-2 border-purple-100 p-12 text-center shadow-xl"
                >
                  <div className="text-7xl mb-4">📝</div>
                  <h3 className="text-3xl font-black mb-3">
                    <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
                      No posts yet!
                    </span>
                  </h3>
                  <p className="text-gray-600 text-lg mb-8">
                    Be the first to create something amazing
                  </p>
                  <button
                    onClick={() => window.location.href = '/studio/ai-blog'}
                    className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl font-bold text-white hover:scale-105 transition-transform shadow-xl hover:shadow-2xl"
                  >
                    🤖 Generate AI Blog
                  </button>
                </motion.div>
              ) : (
                <div className="space-y-6">
                  {posts.map((post, index) => (
                    <PostCard
                      key={post._id || index}
                      post={post}
                      isAIGenerated={post.isAIGenerated || index % 3 === 0}
                      isPinned={index === 0}
                      isLive={false}
                    />
                  ))}
                </div>
              )}

              {/* Load More */}
              {!loading && posts.length > 0 && (
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onClick={() => alert('Loading more posts...')}
                  className="w-full mt-6 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-semibold text-purple-300 transition-all"
                >
                  Load More Posts
                </motion.button>
              )}
            </div>

            {/* Right Sidebar - Desktop Only */}
            <div className="hidden lg:block lg:col-span-4">
              <div className="sticky top-24 space-y-6">
                {/* Trending Topics - white theme */}
                <div className="bg-white/80 backdrop-blur-xl rounded-3xl border-2 border-purple-100 p-6 shadow-xl">
                  <h3 className="text-xl font-black text-gray-800 mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                    Trending Topics
                  </h3>
                  <div className="space-y-3">
                    {['#AIBlogging', '#Web3', '#ContentCreation', '#CYBEV', '#TechTrends'].map((tag, i) => (
                      <motion.div
                        key={tag}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="flex items-center justify-between p-3 bg-white/80 rounded-2xl hover:bg-gray-50 hover:border-purple-300 cursor-pointer transition-all border-2 border-purple-100"
                      >
                        <div>
                          <div className="font-bold text-gray-800">{tag}</div>
                          <div className="text-xs text-gray-600">{Math.floor(Math.random() * 10000)} posts</div>
                        </div>
                        <Hash className="w-4 h-4 text-purple-600" />
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Suggested Creators */}
                <div className="bg-white/80 backdrop-blur-xl rounded-3xl border-2 border-purple-100 p-6 shadow-xl">
                  <h3 className="text-xl font-black text-gray-800 mb-4 flex items-center gap-2">
                    <Users className="w-5 h-5 text-blue-600" />
                    Suggested Creators
                  </h3>
                  <div className="space-y-3">
                    {['Sarah', 'Mike', 'Alex'].map((name, i) => (
                      <motion.div
                        key={name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center text-white font-bold shadow-lg">
                            {name[0]}
                          </div>
                          <div>
                            <div className="font-bold text-gray-800">@{name.toLowerCase()}</div>
                            <div className="text-xs text-gray-600">Content Creator</div>
                          </div>
                        </div>
                        <button className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 rounded-xl text-sm font-bold text-white transition-all shadow-lg">
                          Follow
                        </button>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Live Streams */}
                <div className="bg-white/80 backdrop-blur-xl rounded-3xl border-2 border-purple-100 p-6 shadow-xl">
                  <h3 className="text-xl font-black text-gray-800 mb-4 flex items-center gap-2">
                    <Radio className="w-5 h-5 text-red-600" />
                    Live Now
                  </h3>
                  <div className="text-center py-8 text-gray-600">
                    <Radio className="w-12 h-12 mx-auto mb-3 opacity-50 text-gray-400" />
                    <p className="text-sm font-semibold">No live streams right now</p>
                    <button className="mt-4 px-5 py-3 bg-gradient-to-r from-red-600 to-orange-600 hover:opacity-90 rounded-2xl text-sm font-bold text-white transition-all shadow-lg">
                      🔴 Go Live
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

// Mock data for when API is not ready
function getMockPosts() {
  return [
    {
      _id: '1',
      title: 'Welcome to CYBEV - The Future of Content Creation',
      content: 'CYBEV is revolutionizing how creators build and monetize content. With AI-powered tools, Web3 integration, and a thriving community, we\'re building the ultimate platform for creators.',
      authorName: 'CYBEV Team',
      createdAt: new Date().toISOString(),
      readTime: 5,
      featuredImage: 'https://images.unsplash.com/photo-1677442136019-21780ecad995',
      tags: ['CYBEV', 'Web3', 'AI', 'ContentCreation'],
      views: 1523,
      likes: [],
      likeCount: 234,
      comments: 45,
      viralityScore: 95,
      tokensEarned: 100,
      trending: true,
      isAIGenerated: false
    }
  ];
}
