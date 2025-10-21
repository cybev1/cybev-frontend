import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import AppLayout from '@/components/Layout/AppLayout';
import AdvancedSearch from '@/components/AdvancedSearch';
import { blogAPI } from '@/lib/api';
import { toast } from 'react-toastify';
import { 
  Eye, Heart, Clock, PenTool, Sparkles, ChevronRight 
} from 'lucide-react';

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

  const BlogCard = ({ blog }) => {
    const user = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user') || '{}') : {};
    const isOwner = user.id === blog.author;
    
    return (
      <Link href={`/blog/${blog._id}`}>
        <div className="group bg-white backdrop-blur-lg border border-gray-200 rounded-xl p-6 hover:border-purple-300 hover:shadow-xl transition-all cursor-pointer">
          {/* Category Badge */}
          <div className="flex items-center justify-between mb-3">
            <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
              {blog.category}
            </span>
            {isOwner && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  router.push(`/blog/edit/${blog._id}`);
                }}
                className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium hover:bg-blue-100 transition-colors"
              >
                Edit
              </button>
            )}
          </div>

          {/* Title */}
          <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-purple-600 transition-colors line-clamp-2">
            {blog.title}
          </h3>

          {/* Content Preview */}
          <div 
            className="text-gray-600 text-sm mb-4 line-clamp-3"
            dangerouslySetInnerHTML={{ 
              __html: blog.content.replace(/<[^>]*>/g, '').substring(0, 150) + '...'
            }}
          />

          {/* Tags */}
          {blog.tags && blog.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {blog.tags.slice(0, 3).map((tag, idx) => (
                <span key={idx} className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Meta Info */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div className="flex items-center gap-4 text-gray-500 text-sm">
              <div className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                {blog.views}
              </div>
              <button
                onClick={(e) => handleLike(blog._id, e)}
                className="flex items-center gap-1 hover:text-pink-600 transition-colors"
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
          <div className="mt-3 text-gray-500 text-sm">
            By {blog.authorName}
          </div>
        </div>
      </Link>
    );
  };

  return (
    <AppLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-blue-50 pb-20">
        {/* Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">Discover Stories</h1>
                <p className="text-gray-600">Explore amazing content from our community</p>
              </div>
              <Link href="/blog/create">
                <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg transition-all font-semibold shadow-md">
                  <PenTool className="w-4 h-4" />
                  Write a Blog
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <AdvancedSearch 
            onSearch={(filters) => {
              setSearchQuery(filters.search);
              setSelectedCategory(filters.category);
              fetchBlogs(1);
            }}
            onFilterChange={(filters) => {
              setSearchQuery(filters.search);
              setSelectedCategory(filters.category);
            }}
          />
        </div>

        {/* Trending Section */}
        {trending.length > 0 && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-orange-500" />
              <h2 className="text-2xl font-bold text-gray-900">Trending Now</h2>
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
            <h2 className="text-2xl font-bold text-gray-900">
              {selectedCategory === 'All' ? 'All Blogs' : selectedCategory}
            </h2>
            <span className="text-gray-500 text-sm">
              {pagination.total} posts found
            </span>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white backdrop-blur-lg border border-gray-200 rounded-xl p-6 animate-pulse">
                  <div className="h-6 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : blogs.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-white rounded-xl p-12 border border-gray-200">
                <Sparkles className="w-16 h-16 text-purple-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No blogs found</h3>
                <p className="text-gray-600 mb-6">Be the first to write about {selectedCategory}!</p>
                <Link href="/blog/create">
                  <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold">
                    Create First Blog
                  </button>
                </Link>
              </div>
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
                          : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
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
