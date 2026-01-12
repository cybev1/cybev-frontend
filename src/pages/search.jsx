// ============================================
// FILE: src/pages/search.jsx
// CYBEV Search - Clean White Design v7.0
// ============================================

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import AppLayout from '@/components/Layout/AppLayout';
import api from '@/lib/api';
import { Search as SearchIcon, X, TrendingUp, Clock, Users, FileText, User, Hash, Loader2 } from 'lucide-react';

export default function SearchPage() {
  const router = useRouter();
  const { q } = router.query;
  const [query, setQuery] = useState(q || '');
  const [results, setResults] = useState({ users: [], blogs: [], groups: [] });
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [recentSearches, setRecentSearches] = useState([]);
  const [trending, setTrending] = useState(['AI Writing', 'Church Ministry', 'Web3', 'Content Creation', 'Social Media']);

  useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) setRecentSearches(JSON.parse(saved));
  }, []);

  useEffect(() => { if (q) { setQuery(q); handleSearch(q); } }, [q]);

  const handleSearch = async (searchQuery) => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await api.get(`/api/search?q=${encodeURIComponent(searchQuery)}`, { headers });
      setResults({
        users: res.data.users || [],
        blogs: res.data.blogs || res.data.posts || [],
        groups: res.data.groups || []
      });
      // Save to recent
      const updated = [searchQuery, ...recentSearches.filter(s => s !== searchQuery)].slice(0, 5);
      setRecentSearches(updated);
      localStorage.setItem('recentSearches', JSON.stringify(updated));
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleSubmit = (e) => { e.preventDefault(); handleSearch(query); router.push(`/search?q=${encodeURIComponent(query)}`, undefined, { shallow: true }); };
  const clearRecent = () => { setRecentSearches([]); localStorage.removeItem('recentSearches'); };

  const tabs = [
    { id: 'all', label: 'All' },
    { id: 'users', label: 'People', icon: Users },
    { id: 'blogs', label: 'Posts', icon: FileText },
    { id: 'groups', label: 'Groups', icon: Hash },
  ];

  const allResults = [...results.users.map(u => ({ ...u, type: 'user' })), ...results.blogs.map(b => ({ ...b, type: 'blog' })), ...results.groups.map(g => ({ ...g, type: 'group' }))];
  const filteredResults = activeTab === 'all' ? allResults : (activeTab === 'users' ? results.users : activeTab === 'blogs' ? results.blogs : results.groups);

  return (
    <AppLayout>
      <Head><title>{q ? `${q} - Search` : 'Search'} | CYBEV</title></Head>
      <div className="min-h-screen bg-gray-100">
        <div className="max-w-2xl mx-auto px-4 py-6">
          {/* Search Input */}
          <form onSubmit={handleSubmit} className="relative mb-6">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input type="text" value={query} onChange={e => setQuery(e.target.value)}
              placeholder="Search people, posts, groups..." autoFocus
              className="w-full pl-12 pr-12 py-4 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 text-lg shadow-sm" />
            {query && (
              <button type="button" onClick={() => setQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            )}
          </form>

          {/* No Query State */}
          {!q && !loading && (
            <div className="space-y-6">
              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2"><Clock className="w-4 h-4" />Recent</h3>
                    <button onClick={clearRecent} className="text-sm text-purple-600 hover:underline">Clear</button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map((s, i) => (
                      <button key={i} onClick={() => { setQuery(s); handleSearch(s); }}
                        className="px-3 py-1.5 bg-gray-100 rounded-full text-sm text-gray-700 hover:bg-gray-200 transition-colors">{s}</button>
                    ))}
                  </div>
                </div>
              )}
              {/* Trending */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2 mb-3"><TrendingUp className="w-4 h-4" />Trending</h3>
                <div className="flex flex-wrap gap-2">
                  {trending.map((t, i) => (
                    <button key={i} onClick={() => { setQuery(t); handleSearch(t); }}
                      className="px-3 py-1.5 bg-purple-50 text-purple-600 rounded-full text-sm font-medium hover:bg-purple-100 transition-colors">{t}</button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Results */}
          {q && (
            <>
              {/* Tabs */}
              <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                {tabs.map(tab => (
                  <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                    className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                      activeTab === tab.id ? 'bg-purple-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                    }`}>
                    {tab.icon && <tab.icon className="w-4 h-4" />}{tab.label}
                  </button>
                ))}
              </div>

              {loading ? (
                <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 text-purple-600 animate-spin" /></div>
              ) : filteredResults.length === 0 ? (
                <div className="bg-white rounded-2xl p-12 text-center">
                  <SearchIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="font-semibold text-gray-900 mb-2">No results for "{q}"</h3>
                  <p className="text-gray-500">Try different keywords</p>
                </div>
              ) : (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 divide-y divide-gray-100 overflow-hidden">
                  {filteredResults.map((item, i) => (
                    <Link key={i} href={item.type === 'user' ? `/profile/${item.username}` : item.type === 'blog' ? `/blog/${item._id}` : `/groups/${item._id}`}>
                      <div className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors cursor-pointer">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold overflow-hidden">
                          {item.profilePicture || item.featuredImage ? (
                            <img src={item.profilePicture || item.featuredImage} alt="" className="w-full h-full object-cover" />
                          ) : (
                            (item.name || item.title)?.[0] || '?'
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-900 truncate">{item.name || item.title}</p>
                          <p className="text-sm text-gray-500 truncate">{item.username ? `@${item.username}` : item.excerpt || item.description}</p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          item.type === 'user' ? 'bg-purple-100 text-purple-600' : item.type === 'blog' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'
                        }`}>
                          {item.type === 'user' ? 'Person' : item.type === 'blog' ? 'Post' : 'Group'}
                        </span>
                      </div>
                    </Link>
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
