// ============================================
// FILE: src/pages/blog/index.jsx
// CYBEV Blog List - Clean White Design v7.0
// ============================================

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import AppLayout from '@/components/Layout/AppLayout';
import api, { blogAPI } from '@/lib/api';
import { Search, Filter, TrendingUp, Clock, Bookmark, Heart, Eye, Loader2, Plus, ChevronRight } from 'lucide-react';

export default function BlogIndexPage() {
  const router = useRouter();
  const [blogs, setBlogs] = useState([]);
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('latest');

  useEffect(() => { fetchBlogs(); }, [activeTab]);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const res = await blogAPI.getBlogs({ page: 1, limit: 12, sort: activeTab === 'trending' ? 'views' : 'createdAt' });
      setBlogs(res.data.blogs || res.data.data?.blogs || []);
      const trendingRes = await blogAPI.getTrendingBlogs();
      setTrending(trendingRes.data.blogs || trendingRes.data || []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const tabs = [
    { id: 'latest', label: 'Latest', icon: Clock },
    { id: 'trending', label: 'Trending', icon: TrendingUp },
  ];

  return (
    <AppLayout>
      <Head><title>Blog | CYBEV</title></Head>
      <div className="min-h-screen bg-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Explore Blogs</h1>
              <p className="text-gray-500">Discover amazing content from creators</p>
            </div>
            <div className="flex gap-3">
              <div className="relative flex-1 md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search blogs..." className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900" />
              </div>
              <Link href="/studio/ai-blog">
                <button className="px-4 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold shadow-lg hover:opacity-90 flex items-center gap-2">
                  <Plus className="w-5 h-5" />Write
                </button>
              </Link>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6">
            {tabs.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-xl font-medium flex items-center gap-2 transition-colors ${
                  activeTab === tab.id ? 'bg-purple-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                }`}>
                <tab.icon className="w-4 h-4" />{tab.label}
              </button>
            ))}
          </div>

          {/* Grid */}
          {loading ? (
            <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 text-purple-600 animate-spin" /></div>
          ) : blogs.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No blogs found</h3>
              <p className="text-gray-500 mb-4">Be the first to write something!</p>
              <Link href="/studio/ai-blog">
                <button className="px-6 py-3 bg-purple-600 text-white rounded-xl font-semibold">Create Blog</button>
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogs.map(blog => (
                <Link key={blog._id} href={`/blog/${blog._id}`}>
                  <article className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all cursor-pointer group">
                    <div className="aspect-video bg-gradient-to-br from-purple-100 to-pink-100 relative">
                      {blog.featuredImage && <img src={blog.featuredImage} alt="" className="w-full h-full object-cover" />}
                      <div className="absolute top-3 left-3">
                        {blog.category && <span className="px-2.5 py-1 bg-white/90 backdrop-blur rounded-full text-xs font-semibold text-purple-600">{blog.category}</span>}
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-purple-600 transition-colors">{blog.title}</h3>
                      <p className="text-sm text-gray-500 line-clamp-2 mb-3">{blog.excerpt || blog.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold">
                            {blog.author?.name?.[0] || 'A'}
                          </div>
                          <span className="text-sm text-gray-600">{blog.author?.name || 'Anonymous'}</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-400">
                          <span className="flex items-center gap-1"><Eye className="w-4 h-4" />{blog.views || 0}</span>
                          <span className="flex items-center gap-1"><Heart className="w-4 h-4" />{blog.likesCount || 0}</span>
                        </div>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
