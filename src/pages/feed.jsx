import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import AppLayout from '@/components/Layout/AppLayout';
import SuggestedUsers from '@/components/SuggestedUsers';
import GreetingHeader from '@/components/Feed/GreetingHeader';
import QuickActions from '@/components/Feed/QuickActions';
import PostCard from '@/components/Feed/PostCard';
import { 
  TrendingUp, Users, Hash, Radio,
  Wand2, Lightbulb, Sparkles, BarChart3, 
  Plus, FileText, Image as ImageIcon, DollarSign 
} from 'lucide-react';
import { authAPI, blogAPI, followAPI } from '@/lib/api';

export default function UnifiedFeed() {
  const [activeTab, setActiveTab] = useState('for-you');
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [followingIds, setFollowingIds] = useState([]);
  const [loadingFollowing, setLoadingFollowing] = useState(false);
  const [stats, setStats] = useState({
    views: 1234,
    virality: 95,
    tokens: 450,
    growth: 15,
    streak: 7
  });
  
  // New state for tour and quick actions
  const [showTour, setShowTour] = useState(false);
  const [tourStep, setTourStep] = useState(0);
  const [showQuickActions, setShowQuickActions] = useState(false);

  useEffect(() => {
    fetchUserData();
    fetchPosts();
  }, [activeTab]);

  // Tour effect
  useEffect(() => {
    const hasSeenTour = localStorage.getItem('hasSeenFeedTour');
    if (!hasSeenTour && user) {
      setTimeout(() => setShowTour(true), 1000);
    }
  }, [user]);

  const completeTour = () => {
    localStorage.setItem('hasSeenFeedTour', 'true');
    setShowTour(false);
  };

  const fetchUserData = async () => {
    try {
      const response = await authAPI.getProfile();
      if (response.data) {
        setUser(response.data);
      }
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };


  const fetchFollowingIds = async () => {
    if (!user?.id) return;
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) {
      setFollowingIds([]);
      return;
    }

    setLoadingFollowing(true);
    try {
      const { data } = await followAPI.getFollowing(user.id, { limit: 200, skip: 0 });
      if (data?.ok) {
        const ids = (data.following || []).map(u => String(u._id));
        // include your own id so your posts show in Following
        ids.push(String(user.id));
        setFollowingIds(Array.from(new Set(ids)));
      } else {
        setFollowingIds([String(user.id)]);
      }
    } catch (err) {
      console.error('Failed to fetch following list:', err);
      setFollowingIds([String(user.id)]);
    } finally {
      setLoadingFollowing(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'following' && user?.id) {
      fetchFollowingIds();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, user?.id]);

  const fetchPosts = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem('token');
      
      // API base URL - already includes everything needed
      const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://api.cybev.io';
      
      console.log('🔍 Fetching posts and blogs from:', API_BASE);

      // Fetch both posts and blogs
      const [postsResponse, blogsResponse] = await Promise.all([
        // Fetch social posts
        fetch(`${API_BASE}/posts/feed?limit=50`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }).then(res => {
          console.log('Posts fetch status:', res.status, res.statusText);
          return res.json();
        }).catch(err => {
          console.error('❌ Error fetching posts:', err);
          return { success: false, posts: [] };
        }),
        
        // Fetch blog articles
        fetch(`${API_BASE}/blogs?limit=50`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }).then(res => {
          console.log('Blogs fetch status:', res.status, res.statusText);
          return res.json();
        }).catch(err => {
          console.error('❌ Error fetching blogs:', err);
          return { success: false, data: { blogs: [] } };
        })
      ]);

      console.log('📊 Posts response:', postsResponse);
      console.log('📊 Blogs response:', blogsResponse);
      console.log('📊 Blogs response structure:', {
        success: blogsResponse.success,
        hasData: !!blogsResponse.data,
        hasBlogs: !!blogsResponse.blogs,
        dataKeys: blogsResponse.data ? Object.keys(blogsResponse.data) : [],
        blogsLength: blogsResponse.blogs?.length || 0
      });

      // Extract posts
      const socialPosts = postsResponse.success ? postsResponse.posts : [];
      console.log(`✅ Got ${socialPosts.length} social posts`);

      // Extract blogs - handle multiple response formats
      let blogArticles = [];
      
      // Try different response structures
      if (blogsResponse.success && blogsResponse.data?.blogs) {
        blogArticles = blogsResponse.data.blogs;
      } else if (blogsResponse.success && blogsResponse.blogs) {
        blogArticles = blogsResponse.blogs;
      } else if (blogsResponse.data?.data?.blogs) {
        blogArticles = blogsResponse.data.data.blogs;
      } else if (blogsResponse.data?.blogs) {
        blogArticles = blogsResponse.data.blogs;
      } else if (blogsResponse.blogs) {
        blogArticles = blogsResponse.blogs;
      }
      
      console.log(`✅ Got ${blogArticles.length} blog articles`);

      // Mark posts vs articles
      const allPosts = [
        ...socialPosts.map(p => ({ 
          ...p, 
          postType: 'social',
          authorName: p.authorName || 'Anonymous'
        })),
        ...blogArticles.map(b => ({ 
          ...b, 
          postType: 'article',
          authorName: b.authorName || 'Anonymous'
        }))
      ];

      console.log(`📦 Total posts to display: ${allPosts.length}`);

      // Sort by creation date (newest first)
      allPosts.sort((a, b) => {
        const dateA = new Date(a.createdAt || a.updatedAt || 0);
        const dateB = new Date(b.createdAt || b.updatedAt || 0);
        return dateB - dateA;
      });

      setPosts(allPosts);

      if (allPosts.length === 0) {
        console.log('⚠️ No posts found, showing mock data');
        setPosts(getMockPosts());
      }

    } catch (error) {
      console.error('❌ Fatal error fetching feed:', error);
      setPosts(getMockPosts());
    } finally {
      setLoading(false);
    }
  };

  // Handle new post creation
  const handlePostCreated = (newPost) => {
    console.log('✅ New post created:', newPost);
    // Add new post to the top of the feed
    setPosts(prev => [{ ...newPost, postType: 'social' }, ...prev]);
    
    // Update stats
    setStats(prev => ({
      ...prev,
      tokens: prev.tokens + 10 // User earned 10 tokens
    }));

    // Refresh feed to ensure consistency
    setTimeout(() => {
      fetchPosts();
    }, 1000);
  };

  const tabs = [
    { id: 'for-you', label: 'For You', icon: '🏠' },
    { id: 'following', label: 'Following', icon: '⚡' },
    { id: 'trending', label: 'Trending', icon: '🔥' },
    { id: 'ai-generated', label: 'AI', icon: '🤖' }
  ];

  // Filter posts based on active tab
  const getFilteredPosts = () => {
    if (!posts || posts.length === 0) return [];
    
    switch (activeTab) {
      case 'for-you':
        // Show all posts
        return posts;
      
      case 'following': {
        // Show posts/blogs only from accounts you follow (+ your own)
        if (!user?.id) return [];
        if (loadingFollowing) return [];
        if (!followingIds || followingIds.length === 0) return [];

        return posts.filter((p) => {
          // social posts: authorId (may be populated object)
          if (p.postType === 'social') {
            const id = p.authorId?._id || p.authorId;
            return id ? followingIds.includes(String(id)) : false;
          }

          // blogs/articles: author (populated) or authorId
          const id = p.author?._id || p.authorId || p.author;
          return id ? followingIds.includes(String(id)) : false;
        });
      }
      
      case 'trending':
        // Show posts with high engagement
        return [...posts].sort((a, b) => {
          const scoreA = (a.likeCount || 0) + (a.commentCount || 0) * 2 + (a.views || 0) * 0.1;
          const scoreB = (b.likeCount || 0) + (b.commentCount || 0) * 2 + (b.views || 0) * 0.1;
          return scoreB - scoreA;
        });
      
      case 'ai-generated':
        // Show only AI-generated content
        return posts.filter(p => p.isAIGenerated || p.postType === 'article');
      
      default:
        return posts;
    }
  };

  const filteredPosts = getFilteredPosts();

  return (
    <AppLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-pink-50">
        {/* Greeting Header */}
        <GreetingHeader user={user} stats={stats} />

        {/* Quick Actions */}
        <QuickActions onPostCreated={handlePostCreated} />

        <div className="max-w-7xl mx-auto px-4 py-6 md:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Main Feed - Left/Center Column */}
            <div className="lg:col-span-8">
              {/* Debug Info */}
              {process.env.NODE_ENV === 'development' && (
                <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                  <p className="text-sm font-mono">
                    🔍 Debug: {posts.length} total posts loaded, {filteredPosts.length} showing
                    ({posts.filter(p => p.postType === 'social').length} social, 
                    {posts.filter(p => p.postType === 'article').length} articles)
                    | Active Tab: {activeTab}
                  </p>
                </div>
              )}

              {/* Tabs */}
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

              {/* Smart Suggestions Banner */}
              {user && filteredPosts.length < 5 && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-xl border border-blue-500/20 rounded-2xl p-6 mb-6"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Lightbulb className="w-6 h-6 text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-white mb-2">
                        ✨ Ready to create amazing content?
                      </h3>
                      <p className="text-gray-300 mb-4">
                        Use our AI-powered Studio to generate blog posts, social content, and more in seconds!
                      </p>
                      <div className="flex items-center gap-3 flex-wrap">
                        <Link href="/studio">
                          <button className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all flex items-center gap-2">
                            <Wand2 className="w-4 h-4" />
                            Open Studio
                          </button>
                        </Link>
                        <button 
                          onClick={() => setShowTour(true)}
                          className="px-4 py-2 bg-white/10 text-white rounded-lg font-semibold hover:bg-white/20 transition-all"
                        >
                          Show me around
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

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
              ) : filteredPosts.length === 0 ? (
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
                  <div className="flex gap-4 justify-center">
                    <button
                      onClick={() => document.querySelector('[data-action="create-post"]')?.click()}
                      className="px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl font-bold text-white hover:scale-105 transition-transform shadow-xl"
                    >
                      📝 Create Post
                    </button>
                    <button
                      onClick={() => window.location.href = '/studio/ai-blog'}
                      className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl font-bold text-white hover:scale-105 transition-transform shadow-xl"
                    >
                      🤖 Generate AI Blog
                    </button>
                  </div>
                </motion.div>
              ) : (
                <div className="space-y-6">
                  {filteredPosts.map((post, index) => (
                    <PostCard
                      key={post._id || index}
                      post={post}
                      isAIGenerated={post.isAIGenerated || post.postType === 'article'}
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
                  onClick={() => fetchPosts()}
                  className="w-full mt-6 px-6 py-4 bg-white/80 hover:bg-white border-2 border-purple-200 hover:border-purple-400 rounded-2xl font-bold text-gray-700 transition-all shadow-lg"
                >
                  🔄 Refresh Feed
                </motion.button>
              )}
            </div>

            {/* Right Sidebar - Desktop Only */}
            <div className="hidden lg:block lg:col-span-4">
              <div className="sticky top-24 space-y-6">
                {/* Trending Topics */}
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
                          <div className="text-xs text-gray-600">10k+ posts</div>
                        </div>
                        <Hash className="w-4 h-4 text-purple-600" />
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Suggested Creators */}
                <SuggestedUsers />

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

        {/* Welcome Tour Modal */}
        {showTour && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={completeTour}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-gradient-to-br from-purple-900 to-blue-900 rounded-3xl p-8 max-w-md w-full border-2 border-purple-500/50 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                {tourStep === 0 && (
                  <>
                    <div className="w-20 h-20 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Sparkles className="w-10 h-10 text-purple-400" />
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-4">
                      Welcome to CYBEV! 🎉
                    </h2>
                    <p className="text-gray-300 mb-6">
                      Your AI-powered content creation platform. Let's show you around!
                    </p>
                  </>
                )}

                {tourStep === 1 && (
                  <>
                    <div className="w-20 h-20 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                      <TrendingUp className="w-10 h-10 text-blue-400" />
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-4">
                      Discover Content
                    </h2>
                    <p className="text-gray-300 mb-6">
                      Your feed shows content from creators you follow and trending posts.
                    </p>
                  </>
                )}

                {tourStep === 2 && (
                  <>
                    <div className="w-20 h-20 bg-pink-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Wand2 className="w-10 h-10 text-pink-400" />
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-4">
                      Create with AI Studio
                    </h2>
                    <p className="text-gray-300 mb-6">
                      Generate blog posts, social content, images in seconds!
                    </p>
                  </>
                )}

                {tourStep === 3 && (
                  <>
                    <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                      <DollarSign className="w-10 h-10 text-green-400" />
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-4">
                      Earn Tokens
                    </h2>
                    <p className="text-gray-300 mb-6">
                      Get rewarded for creating and engaging with content!
                    </p>
                  </>
                )}

                {tourStep === 4 && (
                  <>
                    <div className="w-20 h-20 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                      <BarChart3 className="w-10 h-10 text-yellow-400" />
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-4">
                      Track Growth
                    </h2>
                    <p className="text-gray-300 mb-6">
                      Visit Dashboard to see analytics and manage content.
                    </p>
                  </>
                )}

                <div className="flex items-center justify-center gap-2 mb-6">
                  {[0, 1, 2, 3, 4].map((step) => (
                    <div
                      key={step}
                      className={`h-2 rounded-full transition-all ${
                        step === tourStep ? 'w-8 bg-purple-500' : 'w-2 bg-gray-600'
                      }`}
                    />
                  ))}
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={completeTour}
                    className="flex-1 px-6 py-3 bg-white/10 text-white rounded-xl font-semibold hover:bg-white/20 transition-all"
                  >
                    Skip
                  </button>
                  <button
                    onClick={() => {
                      if (tourStep < 4) {
                        setTourStep(tourStep + 1);
                      } else {
                        completeTour();
                      }
                    }}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                  >
                    {tourStep < 4 ? 'Next' : 'Get Started'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Floating Quick Actions */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="fixed bottom-8 right-8 z-40"
        >
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowQuickActions(!showQuickActions)}
              className="w-14 h-14 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center shadow-2xl hover:shadow-purple-500/50 transition-all"
            >
              <Plus className="w-6 h-6 text-white" />
            </motion.button>

            {showQuickActions && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute bottom-16 right-0 bg-black/90 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-2 min-w-[200px] shadow-2xl"
              >
                <Link href="/studio">
                  <button className="w-full px-4 py-3 text-white hover:bg-white/10 rounded-xl transition-all text-left flex items-center gap-3">
                    <Wand2 className="w-5 h-5 text-purple-400" />
                    <span>AI Studio</span>
                  </button>
                </Link>
                <Link href="/post/create">
                  <button className="w-full px-4 py-3 text-white hover:bg-white/10 rounded-xl transition-all text-left flex items-center gap-3">
                    <FileText className="w-5 h-5 text-blue-400" />
                    <span>Write Blog</span>
                  </button>
                </Link>
                <Link href="/dashboard">
                  <button className="w-full px-4 py-3 text-white hover:bg-white/10 rounded-xl transition-all text-left flex items-center gap-3">
                    <BarChart3 className="w-5 h-5 text-yellow-400" />
                    <span>Dashboard</span>
                  </button>
                </Link>
              </motion.div>
            )}
          </div>
        </motion.div>
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
      comments: [],
      commentCount: 45,
      viralityScore: 95,
      tokensEarned: 100,
      trending: true,
      isAIGenerated: false,
      postType: 'article'
    }
  ];
}
