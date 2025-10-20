import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import AppLayout from '@/components/Layout/AppLayout';
import { blogAPI } from '@/lib/api';
import { toast } from 'react-toastify';
import { 
  Search, Filter, TrendingUp, Clock, Eye, Heart, 
  PenTool, Sparkles, ChevronRight 
} from 'lucide-react';

const CATEGORIES = [
  'All',
  'Technology',
  'Health & Wellness',
  'Business & Finance',
  'Lifestyle',
  'Travel',
  'Food & Cooking',
  'Education',
  'Entertainment',
  'Science',
  'Sports',
  'Fashion & Beauty',
  'Personal Development',
  'News & Politics',
  'Environment',
  'Other'
];

export default function BlogFeed() {
  const router = useRouter();
  const [blogs, setBlogs] = useState([]);
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [pagination, setPagination] = useState({ page: 1, hasMore: true });

  useEffect(() => {
    fetchBlogs();
    fetchTrending();
  }, [selectedCategory, searchQuery]);

  const fetchBlogs = async (page = 1) => {
    setLoading(true);
    try {
      const params = {
        page,
        limit: 12,
        category: selectedCategory !== 'All' ? selectedCategory : undefined,
        search: searchQuery || undefined
      };

      const response = await blogAPI.getBlogs(params);
      
      if (response.data.ok) {
        setBlogs(response.data.blogs);
        setPagination(response.data.pagination);
      }
    } catch (error) {
      toast.error('Failed to load blogs');
    } finally {
      setLoading(false);
    }
  };

  const fetchTrending = async () => {
    try {
      const response = await blogAPI.getTrendingBlogs();
      if (response.data.ok) {
        setTrending(response.data.blogs);
      }
    } catch (error) {
      console.error('Failed to load trending blogs');
    }
  };

  const handleLike = async (blogId, e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please login to like posts');
      router.push('/auth/login');
      return;
    }

    try {
      const response = await blogAPI.toggleLike(blogId);
      if (response.data.ok) {
        // Update local state
        setBlogs(blogs.map(blog => 
          blog._id === blogId 
            ? { ...blog, likes: response.data.liked 
                ? [...blog.likes, 'current_user'] 
                : blog.likes.filter(id => id !== 'current_user'),
                likeCount: response.data.likeCount }
            : blog
        ));
      }
    } catch (error) {
      toast.error('Failed to like post');
    }
  };

  const BlogCard = ({ blog }) => (
    <Link href={`/blog/${blog._id}`}>
      <div className="group bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6 hover:bg-white/15 hover:border-purple-500/50 transition-all cursor-pointer">
        {/* Category Badge */}
        <span className="inline-block px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs font-medium mb-3">
          {blog.category}
        </span>

        {/* Title */}
        <h3 className="text-xl font-bold text-white mb-3 group-hover:text-purple-400 transition-colors line-clamp-2">
          {blog.title}
        </h3>

        {/* Content Preview */}
        <div 
          className="text-gray-400 text-sm mb-4 line-clamp-3"
          dangerouslySetInnerHTML={{ 
            __html: blog.content.replace(/<[^>]*>/g, '').substring(0, 150) + '...'
          }}
        />

        {/* Tags */}
        {blog.tags && blog.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {blog.tags.slice(0, 3).map((tag, idx) => (
              <span key={idx} className="px-2 py-1 bg-white/5 text-gray-400 rounded text-xs">
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Meta Info */}
        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          <div className="flex items-center gap-4 text-gray-400 text-sm">
            <div className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              {blog.views}
            </div>
            <button
              onClick={(e) => handleLike(blog._id, e)}
              className="flex items-center gap-1 hover:text-pink-400 transition-colors"
            >
              <Heart className={`w-4 h-4 ${blog.likes?.includes('current_user') ? 'fill-pink-500 text-pink-500' : ''}`} />
              {blog.likes?.length || 0}
            </button>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {blog.readTime} min
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-purple-400 group-hover:translate-x-1 transition-transform" />
        </div>

        {/* Author */}
        <div className="mt-3 text-gray-400 text-sm">
          By {blog.authorName}
        </div>
      </div>
    </Link>
  );

  return (
    <AppLayout>
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      {/* Header */}
      <div className="bg-black/30 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Discover Stories</h1>
              <p className="text-gray-400">Explore amazing content from our community</p>
            </div>
            <Link href="/blog/create">
              <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg transition-all">
                <PenTool className="w-4 h-4" />
                Write a Blog
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search blogs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Category Dropdown */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="pl-10 pr-8 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none cursor-pointer min-w-[200px]"
            >
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat} className="bg-gray-900">
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Trending Section */}
      {trending.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-orange-400" />
            <h2 className="text-2xl font-bold text-white">Trending Now</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {trending.slice(0, 3).map((blog) => (
              <BlogCard key={blog._id} blog={blog} />
            ))}
          </div>
        </div>
      )}

      {/* Main Blog Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">
            {selectedCategory === 'All' ? 'All Blogs' : selectedCategory}
          </h2>
          <span className="text-gray-400 text-sm">
            {pagination.total} posts found
          </span>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6 animate-pulse">
                <div className="h-6 bg-white/20 rounded mb-4"></div>
                <div className="h-4 bg-white/20 rounded mb-2"></div>
                <div className="h-4 bg-white/20 rounded mb-2"></div>
                <div className="h-4 bg-white/20 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-12">
            <Sparkles className="w-16 h-16 text-purple-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No blogs found</h3>
            <p className="text-gray-400 mb-6">Be the first to write about {selectedCategory}!</p>
            <Link href="/blog/create">
              <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg">
                Create First Blog
              </button>
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogs.map((blog) => (
                <BlogCard key={blog._id} blog={blog} />
              ))}
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                {[...Array(pagination.pages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => fetchBlogs(i + 1)}
                    className={`px-4 py-2 rounded-lg transition-all ${
                      pagination.page === i + 1
                        ? 'bg-purple-600 text-white'
                        : 'bg-white/10 text-gray-400 hover:bg-white/20'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
    </AppLayout>
  );
}
