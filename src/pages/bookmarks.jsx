import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import AppLayout from '@/components/Layout/AppLayout';
import EmptyState from '@/components/EmptyState';
import { toast } from 'react-toastify';
import { Bookmark, Folder, Eye, Heart, Clock, X } from 'lucide-react';
import api from '../lib/api';

export default function BookmarksPage() {
  const router = useRouter();
  const [bookmarks, setBookmarks] = useState([]);
  const [collections, setCollections] = useState([]);
  const [selectedCollection, setSelectedCollection] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please login to view bookmarks');
      router.push('/auth/login');
      return;
    }
    fetchBookmarks();
    fetchCollections();
  }, [selectedCollection, router]);

  const fetchBookmarks = async () => {
    setLoading(true);
    try {
      const params = selectedCollection !== 'all' 
        ? { collection: selectedCollection }
        : {};
      
      const response = await api.get('/bookmarks', { params });
      if (response.data.ok) {
        setBookmarks(response.data.bookmarks);
      }
    } catch (error) {
      toast.error('Failed to load bookmarks');
    } finally {
      setLoading(false);
    }
  };

  const fetchCollections = async () => {
    try {
      const response = await api.get('/bookmarks/collections/list');
      if (response.data.ok) {
        setCollections(response.data.collections);
      }
    } catch (error) {
      console.error('Failed to load collections');
    }
  };

  const handleRemoveBookmark = async (blogId, e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const response = await api.delete(`/bookmarks/${blogId}`);
      if (response.data.ok) {
        toast.success('Bookmark removed');
        fetchBookmarks();
        fetchCollections();
      }
    } catch (error) {
      toast.error('Failed to remove bookmark');
    }
  };

  return (
    <AppLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-blue-50 pb-20">
        {/* Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center gap-3 mb-2">
              <Bookmark className="w-8 h-8 text-purple-600" />
              <h1 className="text-4xl font-bold text-gray-900">Saved Blogs</h1>
            </div>
            <p className="text-gray-600">Your bookmarked articles for later reading</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar - Collections */}
            <div className="lg:w-64 flex-shrink-0">
              <div className="bg-white rounded-xl p-6 border border-gray-200 sticky top-20">
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Folder className="w-5 h-5 text-purple-600" />
                  Collections
                </h2>
                
                <div className="space-y-2">
                  <button
                    onClick={() => setSelectedCollection('all')}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                      selectedCollection === 'all'
                        ? 'bg-purple-100 text-purple-700 border border-purple-200'
                        : 'hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">All Saved</span>
                      <span className="text-sm">
                        {collections.reduce((sum, c) => sum + c.count, 0)}
                      </span>
                    </div>
                  </button>

                  {collections.map((collection) => (
                    <button
                      key={collection.name}
                      onClick={() => setSelectedCollection(collection.name)}
                      className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                        selectedCollection === collection.name
                          ? 'bg-purple-100 text-purple-700 border border-purple-200'
                          : 'hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium capitalize">{collection.name}</span>
                        <span className="text-sm">{collection.count}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1">
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="bg-white rounded-xl p-6 border border-gray-200 animate-pulse">
                      <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                    </div>
                  ))}
                </div>
              ) : bookmarks.length === 0 ? (
                <EmptyState
                  type="blogs"
                  actionText="Explore Blogs"
                  actionUrl="/blog"
                />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {bookmarks.map((bookmark) => (
                    <Link key={bookmark._id} href={`/blog/${bookmark.blog._id}`}>
                      <div className="group bg-white rounded-xl p-6 border border-gray-200 hover:border-purple-300 hover:shadow-lg transition-all cursor-pointer relative">
                        {/* Remove Button */}
                        <button
                          onClick={(e) => handleRemoveBookmark(bookmark.blog._id, e)}
                          className="absolute top-4 right-4 p-2 bg-gray-100 hover:bg-red-100 text-gray-600 hover:text-red-600 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                        >
                          <X className="w-4 h-4" />
                        </button>

                        <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium mb-3">
                          {bookmark.blog.category}
                        </span>

                        <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-purple-600 transition-colors">
                          {bookmark.blog.title}
                        </h3>

                        <div
                          className="text-gray-600 text-sm mb-4 line-clamp-3"
                          dangerouslySetInnerHTML={{
                            __html: bookmark.blog.content.replace(/<[^>]*>/g, '').substring(0, 150) + '...'
                          }}
                        />

                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                          <div className="flex items-center gap-4 text-gray-500 text-sm">
                            <div className="flex items-center gap-1">
                              <Eye className="w-4 h-4" />
                              {bookmark.blog.views}
                            </div>
                            <div className="flex items-center gap-1">
                              <Heart className="w-4 h-4" />
                              {bookmark.blog.likes?.length || 0}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {bookmark.blog.readTime}m
                            </div>
                          </div>
                        </div>

                        <div className="mt-3 text-gray-500 text-sm">
                          By {bookmark.blog.authorName}
                        </div>

                        {bookmark.note && (
                          <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <p className="text-yellow-800 text-sm italic">"{bookmark.note}"</p>
                          </div>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
