import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  TrendingUp, 
  BookOpen, 
  Users, 
  DollarSign,
  Eye,
  Heart,
  MessageCircle,
  Clock,
  Edit,
  Trash2,
  Plus,
  Search,
  Filter,
  BarChart3
} from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalPosts: 0,
    totalViews: 0,
    totalLikes: 0,
    totalComments: 0,
    totalEarnings: 0
  });

  useEffect(() => {
    fetchBlogs();
    fetchStats();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/blogs/my-blogs', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setBlogs(data.blogs);
      }
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/blogs/stats', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleDelete = async (blogId) => {
    if (!confirm('Are you sure you want to delete this post?')) return;

    try {
      const response = await fetch(`http://localhost:5000/api/blogs/${blogId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setBlogs(blogs.filter(blog => blog._id !== blogId));
        fetchStats(); // Refresh stats
      }
    } catch (error) {
      console.error('Error deleting blog:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white">
      {/* Header */}
      <div className="border-b border-purple-500/20 bg-black/20 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Your Dashboard
              </h1>
              <p className="text-gray-400 mt-1">Manage your content and track your growth</p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/feed')}
                className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300 flex items-center gap-2"
              >
                <TrendingUp className="w-5 h-5" />
                View Feed
              </button>
              <button
                onClick={() => navigate('/create-blog')}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300 flex items-center gap-2"
              >
                <Sparkles className="w-5 h-5" />
                Write New Post
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <BookOpen className="w-8 h-8 text-purple-400" />
              <BarChart3 className="w-5 h-5 text-purple-400/50" />
            </div>
            <div className="text-3xl font-bold mb-1">{stats.totalPosts}</div>
            <div className="text-gray-400 text-sm">Total Posts</div>
          </div>

          <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 backdrop-blur-xl border border-blue-500/20 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <Eye className="w-8 h-8 text-blue-400" />
              <BarChart3 className="w-5 h-5 text-blue-400/50" />
            </div>
            <div className="text-3xl font-bold mb-1">{stats.totalViews.toLocaleString()}</div>
            <div className="text-gray-400 text-sm">Total Views</div>
          </div>

          <div className="bg-gradient-to-br from-pink-500/10 to-pink-600/10 backdrop-blur-xl border border-pink-500/20 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <Heart className="w-8 h-8 text-pink-400" />
              <BarChart3 className="w-5 h-5 text-pink-400/50" />
            </div>
            <div className="text-3xl font-bold mb-1">{stats.totalLikes.toLocaleString()}</div>
            <div className="text-gray-400 text-sm">Total Likes</div>
          </div>

          <div className="bg-gradient-to-br from-green-500/10 to-green-600/10 backdrop-blur-xl border border-green-500/20 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <MessageCircle className="w-8 h-8 text-green-400" />
              <BarChart3 className="w-5 h-5 text-green-400/50" />
            </div>
            <div className="text-3xl font-bold mb-1">{stats.totalComments.toLocaleString()}</div>
            <div className="text-gray-400 text-sm">Total Comments</div>
          </div>

          <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/10 backdrop-blur-xl border border-yellow-500/20 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <DollarSign className="w-8 h-8 text-yellow-400" />
              <BarChart3 className="w-5 h-5 text-yellow-400/50" />
            </div>
            <div className="text-3xl font-bold mb-1">${stats.totalEarnings.toFixed(2)}</div>
            <div className="text-gray-400 text-sm">Total Earnings</div>
          </div>
        </div>

        {/* Blog Posts Section */}
        <div className="bg-black/20 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Your Blog Posts</h2>
            <div className="flex items-center gap-3">
              <button className="p-2 hover:bg-purple-500/10 rounded-lg transition-colors">
                <Search className="w-5 h-5 text-gray-400" />
              </button>
              <button className="p-2 hover:bg-purple-500/10 rounded-lg transition-colors">
                <Filter className="w-5 h-5 text-gray-400" />
              </button>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto"></div>
              <p className="text-gray-400 mt-4">Loading your posts...</p>
            </div>
          ) : blogs.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No posts yet</h3>
              <p className="text-gray-400 mb-6">Start creating content to see it here</p>
              <button
                onClick={() => navigate('/create-blog')}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300"
              >
                Create Your First Post
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {blogs.map((blog) => (
                <div
                  key={blog._id}
                  className="bg-gradient-to-br from-purple-500/5 to-pink-500/5 border border-purple-500/20 rounded-xl p-6 hover:border-purple-500/40 transition-all duration-300"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-2">{blog.title}</h3>
                      <p className="text-gray-400 mb-4 line-clamp-2">{blog.excerpt}</p>
                      
                      <div className="flex items-center gap-6 text-sm text-gray-400">
                        <div className="flex items-center gap-2">
                          <Eye className="w-4 h-4" />
                          <span>{blog.views || 0} views</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Heart className="w-4 h-4" />
                          <span>{blog.likes || 0} likes</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MessageCircle className="w-4 h-4" />
                          <span>{blog.comments || 0} comments</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      <button
                        onClick={() => navigate(`/edit-blog/${blog._id}`)}
                        className="p-2 hover:bg-purple-500/10 rounded-lg transition-colors"
                      >
                        <Edit className="w-5 h-5 text-purple-400" />
                      </button>
                      <button
                        onClick={() => handleDelete(blog._id)}
                        className="p-2 hover:bg-red-500/10 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-5 h-5 text-red-400" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
