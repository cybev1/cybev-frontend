import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import AppLayout from '@/components/Layout/AppLayout';
import { blogAPI } from '@/lib/api';
import { toast } from 'react-toastify';
import {
  User, MapPin, Calendar, Link as LinkIcon,
  Heart, Eye, BookOpen, Award, TrendingUp
} from 'lucide-react';

export default function UserProfile() {
  const router = useRouter();
  const { username } = router.query; // Changed from 'id' to 'username'
  const [blogs, setBlogs] = useState([]);
  const [badge, setBadge] = useState(null);
  const [stats, setStats] = useState({
    totalBlogs: 0,
    totalViews: 0,
    totalLikes: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (username) {
      fetchUserBlogs();
      fetchBadgeTier();
    }
  }, [username]);

  const fetchBadgeTier = async () => {
    try {
      const response = await fetch(`/api/badge/tier?wallet=${username}`);
      const data = await response.json();
      setBadge(data.tier || 'Unranked');
    } catch (error) {
      console.error('Failed to load badge tier');
    }
  };

  const fetchUserBlogs = async () => {
    setLoading(true);
    try {
      // Try to fetch blogs by author username/id
      const response = await blogAPI.getBlogs({ author: username });
      if (response.data.ok) {
        const userBlogs = response.data.blogs;
        setBlogs(userBlogs);

        // Calculate stats
        const totalViews = userBlogs.reduce((sum, blog) => sum + blog.views, 0);
        const totalLikes = userBlogs.reduce((sum, blog) => sum + (blog.likes?.length || 0), 0);

        setStats({
          totalBlogs: userBlogs.length,
          totalViews,
          totalLikes
        });
      }
    } catch (error) {
      toast.error('Failed to load user profile');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
        </div>
      </AppLayout>
    );
  }

  const author = blogs[0]?.authorName || 'User';

  return (
    <AppLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-blue-50 pb-20">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="flex flex-col md:flex-row items-center gap-8">
              {/* Avatar */}
              <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center text-purple-600 text-5xl font-bold shadow-xl">
                {author.charAt(0)}
              </div>

              {/* Info */}
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-4xl font-bold mb-2">{author}</h1>
                <p className="text-purple-100 mb-4">Content Creator & Writer</p>

                {/* Stats */}
                <div className="flex flex-wrap justify-center md:justify-start gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    <span>{stats.totalBlogs} blogs</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    <span>{stats.totalViews} views</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Heart className="w-4 h-4" />
                    <span>{stats.totalLikes} likes</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-md">
                              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <BookOpen className="w-6 h-6 text-blue-600" />
                </div>
                <TrendingUp className="w-5 h-5 text-green-500" />
              </div>
              <h3 className="text-gray-500 text-sm mb-1">Total Blogs</h3>
              <p className="text-3xl font-bold text-gray-900">{stats.totalBlogs}</p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-md">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Eye className="w-6 h-6 text-purple-600" />
                </div>
                <TrendingUp className="w-5 h-5 text-green-500" />
              </div>
              <h3 className="text-gray-500 text-sm mb-1">Total Views</h3>
              <p className="text-3xl font-bold text-gray-900">{stats.totalViews}</p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-md">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-pink-100 rounded-lg">
                  <Heart className="w-6 h-6 text-pink-600" />
                </div>
                <TrendingUp className="w-5 h-5 text-green-500" />
              </div>
              <h3 className="text-gray-500 text-sm mb-1">Total Likes</h3>
              <p className="text-3xl font-bold text-gray-900">{stats.totalLikes}</p>
            </div>
          </div>
        </div>

        {/* Blogs Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Published Articles</h2>
            <span className="text-gray-500">{stats.totalBlogs} posts</span>
          </div>

          {blogs.length === 0 ? (
            <div className="bg-white rounded-xl p-12 text-center border border-gray-200">
              <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No blogs yet</h3>
              <p className="text-gray-500">This user hasn't published any blogs.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogs.map((blog) => (
                <Link key={blog._id} href={`/blog/${blog._id}`}>
                  <div className="bg-white rounded-xl p-6 border border-gray-200 hover:border-purple-300 hover:shadow-lg transition-all cursor-pointer h-full">
                    <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium mb-3">
                      {blog.category}
                    </span>

                    <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 hover:text-purple-600 transition-colors">
                      {blog.title}
                    </h3>

                    <div
                      className="text-gray-600 text-sm mb-4 line-clamp-3"
                      dangerouslySetInnerHTML={{
                        __html: blog.content.replace(/<[^>]*>/g, '').substring(0, 150) + '...'
                      }}
                    />

                    {blog.tags && blog.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {blog.tags.slice(0, 3).map((tag, idx) => (
                          <span key={idx} className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-4 text-gray-500 text-sm">
                        <div className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          {blog.views}
                        </div>
                        <div className="flex items-center gap-1">
                          <Heart className="w-4 h-4" />
                          {blog.likes?.length || 0}
                        </div>
                      </div>
                      <span className="text-gray-400 text-xs">
                        {new Date(blog.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
