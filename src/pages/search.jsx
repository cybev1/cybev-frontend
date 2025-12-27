import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import AppLayout from '@/components/Layout/AppLayout';
import { blogAPI, authAPI } from '@/lib/api';
import { 
  Search, TrendingUp, Clock, Eye, Heart, 
  Filter, X, Tag, User, Calendar, Users, FileText
} from 'lucide-react';
import { toast } from 'react-toastify';
import debounce from 'lodash/debounce';

export default function SearchPage() {
  const router = useRouter();
  const { q: initialQuery } = router.query;

  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [userResults, setUserResults] = useState([]);
  const [trendingTags, setTrendingTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [activeTab, setActiveTab] = useState('blogs'); // 'blogs' or 'users'
  const [filters, setFilters] = useState({
    sort: 'recent',
    tag: '',
    category: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [pagination, setPagination] = useState({ total: 0, hasMore: false });

  useEffect(() => {
    fetchTrendingTags();
  }, []);

  useEffect(() => {
    if (initialQuery) {
      setQuery(initialQuery);
      performSearch(initialQuery);
    }
  }, [initialQuery]);

  const fetchTrendingTags = async () => {
    try {
      const response = await blogAPI.getTrendingTags();
      if (response.data.ok || response.data.success) {
        setTrendingTags(response.data.tags || []);
      }
    } catch (error) {
      console.error('Failed to fetch trending tags');
    }
  };

  const performSearch = async (searchQuery, searchFilters = filters) => {
    if (!searchQuery?.trim()) {
      setResults([]);
      setUserResults([]);
      setSearched(false);
      return;
    }

    setLoading(true);
    setSearched(true);

    try {
      // Search both blogs and users in parallel
      const [blogResponse, userResponse] = await Promise.all([
        blogAPI.search({
          q: searchQuery,
          ...searchFilters,
          limit: 20
        }),
        authAPI.searchUsers({ q: searchQuery, limit: 10 })
      ]);

      if (blogResponse.data.ok || blogResponse.data.success) {
        setResults(blogResponse.data.blogs || []);
        setPagination(blogResponse.data.pagination || { total: 0, hasMore: false });
      }

      if (userResponse.data.ok || userResponse.data.success) {
        setUserResults(userResponse.data.users || []);
      }
    } catch (error) {
      toast.error('Search failed');
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Debounced search
  const debouncedSearch = useCallback(
    debounce((q) => performSearch(q), 500),
    [filters]
  );

  const handleQueryChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    debouncedSearch(value);
  };

  const handleTagClick = (tag) => {
    setQuery(tag);
    performSearch(tag);
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    if (query) {
      performSearch(query, newFilters);
    }
  };

  const clearFilters = () => {
    setFilters({ sort: 'recent', tag: '', category: '' });
    if (query) {
      performSearch(query, { sort: 'recent', tag: '', category: '' });
    }
  };

  return (
    <AppLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 py-8">
        <div className="max-w-4xl mx-auto px-4">
          {/* Search Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              Discover Content
            </h1>
            <p className="text-gray-400">
              Search blogs, posts, and creators
            </p>
          </div>

          {/* Search Input */}
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={handleQueryChange}
              placeholder="Search for blogs, topics, or creators..."
              className="w-full pl-12 pr-12 py-4 bg-gray-800/50 border border-purple-500/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg"
              autoFocus
            />
            {query && (
              <button
                onClick={() => {
                  setQuery('');
                  setResults([]);
                  setSearched(false);
                }}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Filters */}
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                showFilters 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
              }`}
            >
              <Filter className="w-4 h-4" />
              Filters
            </button>

            {/* Sort buttons */}
            <div className="flex gap-2">
              {[
                { key: 'recent', label: 'Recent', icon: Clock },
                { key: 'popular', label: 'Popular', icon: TrendingUp },
                { key: 'likes', label: 'Most Liked', icon: Heart }
              ].map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => handleFilterChange('sort', key)}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm transition-all ${
                    filters.sort === key
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-800/50 text-gray-400 hover:text-white'
                  }`}
                >
                  <Icon className="w-3 h-3" />
                  {label}
                </button>
              ))}
            </div>

            {(filters.tag || filters.category) && (
              <button
                onClick={clearFilters}
                className="text-sm text-purple-400 hover:text-purple-300"
              >
                Clear filters
              </button>
            )}
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <div className="bg-gray-800/30 rounded-xl p-4 mb-6 border border-purple-500/20">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Category</label>
                  <select
                    value={filters.category}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">All Categories</option>
                    <option value="Technology">Technology</option>
                    <option value="Lifestyle">Lifestyle</option>
                    <option value="Business">Business</option>
                    <option value="Health">Health</option>
                    <option value="Entertainment">Entertainment</option>
                    <option value="Education">Education</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Tag</label>
                  <input
                    type="text"
                    value={filters.tag}
                    onChange={(e) => handleFilterChange('tag', e.target.value)}
                    placeholder="Filter by tag..."
                    className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Trending Tags (shown when no search) */}
          {!searched && trendingTags.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-purple-400" />
                <h2 className="text-lg font-semibold text-white">Trending Tags</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {trendingTags.map((item) => (
                  <button
                    key={item.tag}
                    onClick={() => handleTagClick(item.tag)}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-800/50 hover:bg-purple-600/30 border border-purple-500/30 rounded-full text-gray-300 hover:text-white transition-all"
                  >
                    <Tag className="w-3 h-3" />
                    {item.tag}
                    <span className="text-xs text-gray-500">({item.count})</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
            </div>
          )}

          {/* Results */}
          {!loading && searched && (
            <div>
              {/* Tabs */}
              <div className="flex items-center gap-4 mb-6 border-b border-gray-700">
                <button
                  onClick={() => setActiveTab('blogs')}
                  className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
                    activeTab === 'blogs'
                      ? 'border-purple-500 text-white'
                      : 'border-transparent text-gray-400 hover:text-white'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  Blogs ({results.length})
                </button>
                <button
                  onClick={() => setActiveTab('users')}
                  className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
                    activeTab === 'users'
                      ? 'border-purple-500 text-white'
                      : 'border-transparent text-gray-400 hover:text-white'
                  }`}
                >
                  <Users className="w-4 h-4" />
                  Users ({userResults.length})
                </button>
              </div>

              {/* Blog Results */}
              {activeTab === 'blogs' && (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-gray-400">
                      {pagination.total} blog{pagination.total !== 1 ? 's' : ''} found
                    </p>
                  </div>

                  {results.length === 0 ? (
                    <div className="text-center py-12">
                      <Search className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-white mb-2">No blogs found</h3>
                      <p className="text-gray-400">Try different keywords or browse trending tags</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {results.map((blog) => (
                        <Link key={blog._id} href={`/blog/${blog._id}`}>
                          <div className="bg-gray-800/30 hover:bg-gray-800/50 border border-purple-500/20 hover:border-purple-500/40 rounded-xl p-5 transition-all cursor-pointer">
                            <div className="flex items-start gap-4">
                              {/* Featured Image */}
                              {blog.featuredImage && (
                                <img
                                  src={blog.featuredImage}
                                  alt={blog.title}
                                  className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
                                />
                              )}
                              
                              <div className="flex-1 min-w-0">
                                {/* Category */}
                                {blog.category && (
                                  <span className="inline-block px-2 py-0.5 bg-purple-500/20 text-purple-300 rounded text-xs font-medium mb-2">
                                    {blog.category}
                                  </span>
                                )}
                                
                                {/* Title */}
                                <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2 hover:text-purple-400 transition-colors">
                                  {blog.title}
                                </h3>
                                
                                {/* Excerpt */}
                                <p className="text-gray-400 text-sm line-clamp-2 mb-3">
                                  {blog.excerpt || blog.content?.replace(/<[^>]*>/g, '').substring(0, 150)}...
                                </p>
                                
                                {/* Meta */}
                                <div className="flex items-center gap-4 text-xs text-gray-500">
                                  <div className="flex items-center gap-1">
                                    <User className="w-3 h-3" />
                                    {blog.authorName || blog.author?.name || 'Anonymous'}
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    {new Date(blog.createdAt).toLocaleDateString()}
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Eye className="w-3 h-3" />
                                    {blog.views || 0}
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Heart className="w-3 h-3" />
                                    {blog.likes?.length || 0}
                                  </div>
                                </div>
                                
                                {/* Tags */}
                                {blog.tags?.length > 0 && (
                                  <div className="flex flex-wrap gap-1 mt-2">
                                    {blog.tags.slice(0, 3).map((tag, idx) => (
                                      <span
                                        key={idx}
                                        className="px-2 py-0.5 bg-gray-700/50 text-gray-400 rounded text-xs"
                                      >
                                        #{tag}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              )}

              {/* User Results */}
              {activeTab === 'users' && (
                <>
                  {userResults.length === 0 ? (
                    <div className="text-center py-12">
                      <Users className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-white mb-2">No users found</h3>
                      <p className="text-gray-400">Try different keywords</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {userResults.map((user) => (
                        <Link key={user._id} href={`/profile/${user.username}`}>
                          <div className="bg-gray-800/30 hover:bg-gray-800/50 border border-purple-500/20 hover:border-purple-500/40 rounded-xl p-5 transition-all cursor-pointer">
                            <div className="flex items-center gap-4">
                              {/* Avatar */}
                              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
                                {user.avatar ? (
                                  <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
                                ) : (
                                  user.name?.charAt(0) || user.username?.charAt(0) || '?'
                                )}
                              </div>
                              
                              <div className="flex-1 min-w-0">
                                <h3 className="text-lg font-semibold text-white truncate">
                                  {user.name || user.username}
                                </h3>
                                <p className="text-gray-400 text-sm">@{user.username}</p>
                                {user.bio && (
                                  <p className="text-gray-500 text-sm line-clamp-1 mt-1">{user.bio}</p>
                                )}
                                <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                                  <span>{user.followerCount || 0} followers</span>
                                  <span>{user.followingCount || 0} following</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              )}

              {/* Load More */}
              {activeTab === 'blogs' && pagination.hasMore && (
                <div className="text-center mt-6">
                  <button
                    onClick={() => {
                      // Load more implementation
                      toast.info('Loading more...');
                    }}
                    className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                  >
                    Load More
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Initial State */}
          {!searched && !loading && (
            <div className="text-center py-12">
              <Search className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Start Searching</h3>
              <p className="text-gray-400">
                Enter keywords to find blogs, or click on trending tags above
              </p>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
