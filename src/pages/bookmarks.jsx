// ============================================
// FILE: src/pages/bookmarks.jsx
// ============================================
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import AppLayout from '@/components/Layout/AppLayout';
import { bookmarkAPI } from '@/lib/api';
import { Bookmark, Trash2, Eye, Heart, Calendar } from 'lucide-react';
import { toast } from 'react-toastify';

export default function BookmarksPage() {
  const router = useRouter();
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/login');
      return;
    }
    fetchBookmarks();
  }, []);

  const fetchBookmarks = async () => {
    setLoading(true);
    try {
      const { data } = await bookmarkAPI.getBookmarks();
      if (data.ok) {
        setBookmarks(data.bookmarks);
      }
    } catch (error) {
      console.error('Failed to fetch bookmarks:', error);
      toast.error('Failed to load bookmarks');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveBookmark = async (blogId) => {
    try {
      await bookmarkAPI.deleteBookmark(blogId);
      setBookmarks(bookmarks.filter(b => b.blog._id !== blogId));
      toast.success('Bookmark removed');
    } catch (error) {
      console.error('Failed to remove bookmark:', error);
      toast.error('Failed to remove bookmark');
    }
  };

  return (
    <AppLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-blue-50 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <Bookmark className="w-8 h-8 text-purple-600" />
              <h1 className="text-4xl font-bold text-gray-900">Saved Posts</h1>
            </div>
            <p className="text-gray-600">Your bookmarked articles for later reading</p>
          </div>

          {/* Bookmarks List */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-white rounded-xl p-6 border border-gray-200 animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                </div>
              ))}
            </div>
          ) : bookmarks.length === 0 ? (
            <div className="bg-white rounded-xl p-12 text-center border border-gray-200">
              <Bookmark className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Bookmarks Yet</h3>
              <p className="text-gray-500 mb-6">
                Start bookmarking posts to read them later
              </p>
              <Link href="/blog">
                <button className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium">
                  Explore Blogs
                </button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bookmarks.map((bookmark) => {
                const blog = bookmark.blog;
                if (!blog) return null;

                return (
                  <div
                    key={bookmark._id}
                    className="bg-white rounded-xl border border-gray-200 hover:border-purple-300 hover:shadow-lg transition-all overflow-hidden"
                  >
                    <div className="p-6">
                      {/* Category Badge */}
                      <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium mb-3">
                        {blog.category || 'Article'}
                      </span>

                      {/* Title */}
                      <Link href={`/blog/${blog._id}`}>
                        <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 hover:text-purple-600 transition-colors cursor-pointer">
                          {blog.title}
                        </h3>
                      </Link>

                      {/* Excerpt */}
                      <div
                        className="text-gray-600 text-sm mb-4 line-clamp-3"
                        dangerouslySetInnerHTML={{
                          __html: blog.content?.replace(/<[^>]*>/g, '').substring(0, 150) + '...' || 'No content'
                        }}
                      />

                      {/* Author */}
                      <Link href={`/profile/${blog.author?.username || 'user'}`}>
                        <div className="flex items-center gap-2 mb-4 cursor-pointer hover:opacity-80">
                          <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                            {blog.author?.name?.charAt(0).toUpperCase() || 'U'}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-900">
                              {blog.author?.name || 'Unknown'}
                            </p>
                          </div>
                        </div>
                      </Link>

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

                      {/* Stats & Actions */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div className="flex items-center gap-4 text-gray-500 text-sm">
                          <div className="flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            {blog.views || 0}
                          </div>
                          <div className="flex items-center gap-1">
                            <Heart className="w-4 h-4" />
                            {blog.likes?.length || 0}
                          </div>
                        </div>

                        <button
                          onClick={() => handleRemoveBookmark(blog._id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Remove bookmark"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Date */}
                      <div className="flex items-center gap-1 text-xs text-gray-400 mt-2">
                        <Calendar className="w-3 h-3" />
                        Saved {new Date(bookmark.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}

