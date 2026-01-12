// ============================================
// FILE: src/pages/nft/index.jsx
// PATH: cybev-frontend/src/pages/nft/index.jsx
// PURPOSE: NFT Marketplace - Browse, search, filter NFTs
// ============================================

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import AppLayout from '@/components/Layout/AppLayout';
import {
  Plus,
  Search,
  Filter,
  Grid,
  List,
  Heart,
  Eye,
  Clock,
  TrendingUp,
  Sparkles,
  Image as ImageIcon,
  Music,
  Video,
  Camera,
  Gamepad2,
  Package,
  ChevronDown,
  X,
  Verified,
  Gavel
} from 'lucide-react';
import api from '@/lib/api';

// NFT Card Component
function NFTCard({ nft }) {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(nft.likes || 0);

  const handleLike = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
      const response = await api.post(`/api/nft/${nft._id}/like`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.ok) {
        setLiked(response.data.liked);
        setLikes(response.data.likes);
      }
    } catch (error) {
      console.error('Like failed');
    }
  };

  return (
    <Link href={`/nft/${nft._id}`}>
      <div className="group bg-white/50 rounded-2xl overflow-hidden border border-gray-200 hover:border-purple-500/50 transition-all duration-300 hover:transform hover:scale-[1.02] hover:shadow-xl hover:shadow-purple-500/10">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden">
          {nft.image ? (
            <img
              src={nft.image}
              alt={nft.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
              <Sparkles className="w-16 h-16 text-white/50" />
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-3 left-3 flex gap-2">
            {nft.listingType === 'auction' && (
              <span className="px-2 py-1 bg-yellow-500 text-black text-xs font-bold rounded-lg flex items-center gap-1">
                <Gavel className="w-3 h-3" />
                AUCTION
              </span>
            )}
            {nft.isFeatured && (
              <span className="px-2 py-1 bg-purple-500 text-gray-900 text-xs font-bold rounded-lg">
                FEATURED
              </span>
            )}
          </div>

          {/* Like button */}
          <button
            onClick={handleLike}
            className="absolute top-3 right-3 p-2 bg-gray-900/50 backdrop-blur-sm rounded-full hover:bg-gray-900/70 transition-colors"
          >
            <Heart className={`w-5 h-5 ${liked ? 'text-red-500 fill-red-500' : 'text-white'}`} />
          </button>

          {/* Quick stats overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="flex items-center justify-between text-gray-900 text-sm">
              <span className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                {nft.views || 0}
              </span>
              <span className="flex items-center gap-1">
                <Heart className="w-4 h-4" />
                {likes}
              </span>
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="p-4">
          {/* Collection */}
          {nft.collection && (
            <p className="text-purple-600 text-xs mb-1 flex items-center gap-1">
              {nft.collection.name}
              <Verified className="w-3 h-3" />
            </p>
          )}

          {/* Name */}
          <h3 className="text-gray-900 font-bold truncate mb-2">{nft.name}</h3>

          {/* Creator */}
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-gray-900 text-xs font-bold">
              {nft.creator?.name?.[0] || 'C'}
            </div>
            <span className="text-gray-500 text-sm">@{nft.creator?.username || 'creator'}</span>
          </div>

          {/* Price */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-200">
            {nft.isListed ? (
              <div>
                <p className="text-gray-500 text-xs">
                  {nft.listingType === 'auction' ? 'Current Bid' : 'Price'}
                </p>
                <p className="text-gray-900 font-bold">
                  {nft.listingType === 'auction' 
                    ? (nft.highestBid || nft.listingPrice) 
                    : nft.listingPrice
                  } CYBEV
                </p>
              </div>
            ) : (
              <div>
                <p className="text-gray-500 text-xs">Status</p>
                <p className="text-gray-600">Not Listed</p>
              </div>
            )}

            {nft.isListed && (
              <button className="px-4 py-2 bg-purple-500 text-gray-900 text-sm rounded-lg hover:bg-purple-600 transition-colors">
                {nft.listingType === 'auction' ? 'Bid' : 'Buy'}
              </button>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

// Categories
const CATEGORIES = [
  { id: 'all', label: 'All', icon: Grid },
  { id: 'art', label: 'Art', icon: ImageIcon },
  { id: 'music', label: 'Music', icon: Music },
  { id: 'video', label: 'Video', icon: Video },
  { id: 'photography', label: 'Photography', icon: Camera },
  { id: 'gaming', label: 'Gaming', icon: Gamepad2 },
  { id: 'collectible', label: 'Collectibles', icon: Package }
];

// Sort options
const SORT_OPTIONS = [
  { value: 'recent', label: 'Recently Added' },
  { value: 'price_low', label: 'Price: Low to High' },
  { value: 'price_high', label: 'Price: High to Low' },
  { value: 'popular', label: 'Most Viewed' },
  { value: 'likes', label: 'Most Liked' }
];

export default function NFTMarketplace() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [nfts, setNfts] = useState([]);
  const [featuredNfts, setFeaturedNfts] = useState([]);
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [showListedOnly, setShowListedOnly] = useState(false);
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [showFilters, setShowFilters] = useState(false);
  
  // Pagination
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [total, setTotal] = useState(0);

  // Sample NFTs for demo
  const sampleNfts = [
    {
      _id: '1',
      name: 'Cosmic Dream #001',
      description: 'A journey through the cosmos',
      image: 'https://images.unsplash.com/photo-1634017839464-5c339bbe3c9c?w=500',
      creator: { name: 'ArtistX', username: 'artistx' },
      owner: { name: 'Collector1', username: 'collector1' },
      category: 'art',
      isListed: true,
      listingPrice: 250,
      listingType: 'fixed',
      views: 1250,
      likes: 89,
      isFeatured: true
    },
    {
      _id: '2',
      name: 'Digital Symphony',
      description: 'Music meets visual art',
      image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500',
      creator: { name: 'MusicMaker', username: 'musicmaker' },
      category: 'music',
      isListed: true,
      listingPrice: 150,
      listingType: 'auction',
      highestBid: 180,
      views: 890,
      likes: 67
    },
    {
      _id: '3',
      name: 'Neon City',
      description: 'Cyberpunk vibes',
      image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=500',
      creator: { name: 'CyberArt', username: 'cyberart' },
      category: 'art',
      isListed: true,
      listingPrice: 500,
      listingType: 'fixed',
      views: 2100,
      likes: 156,
      isFeatured: true
    },
    {
      _id: '4',
      name: 'Abstract Motion',
      description: 'Movement captured in pixels',
      image: 'https://images.unsplash.com/photo-1549490349-8643362247b5?w=500',
      creator: { name: 'MotionArt', username: 'motionart' },
      category: 'video',
      isListed: true,
      listingPrice: 75,
      listingType: 'fixed',
      views: 560,
      likes: 34
    },
    {
      _id: '5',
      name: 'Nature Essence',
      description: 'Beauty of the natural world',
      image: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=500',
      creator: { name: 'PhotoPro', username: 'photopro' },
      category: 'photography',
      isListed: true,
      listingPrice: 120,
      listingType: 'fixed',
      views: 780,
      likes: 45
    },
    {
      _id: '6',
      name: 'Game Character #42',
      description: 'Rare gaming collectible',
      image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=500',
      creator: { name: 'GameDev', username: 'gamedev' },
      category: 'gaming',
      isListed: true,
      listingPrice: 350,
      listingType: 'auction',
      highestBid: 420,
      views: 1890,
      likes: 98
    }
  ];

  useEffect(() => {
    const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
    if (!token) {
      router.push('/auth/login');
      return;
    }

    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (e) {}
    }

    fetchNFTs();
    fetchFeatured();
  }, [router]);

  useEffect(() => {
    fetchNFTs();
  }, [selectedCategory, sortBy, showListedOnly, page]);

  const fetchNFTs = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
      const params = new URLSearchParams({
        page,
        limit: 20,
        sort: sortBy,
        ...(selectedCategory !== 'all' && { category: selectedCategory }),
        ...(showListedOnly && { listed: 'true' }),
        ...(priceRange.min && { minPrice: priceRange.min }),
        ...(priceRange.max && { maxPrice: priceRange.max }),
        ...(searchQuery && { search: searchQuery })
      });

      const response = await api.get(`/api/nft?${params}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.ok) {
        setNfts(response.data.nfts);
        setTotal(response.data.total);
        setHasMore(response.data.hasMore);
      }
    } catch (error) {
      console.log('Using sample NFTs');
      setNfts(sampleNfts);
      setTotal(sampleNfts.length);
    } finally {
      setLoading(false);
    }
  };

  const fetchFeatured = async () => {
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
      const response = await api.get('/api/nft/featured', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.ok) {
        setFeaturedNfts(response.data.nfts);
      }
    } catch (error) {
      setFeaturedNfts(sampleNfts.filter(n => n.isFeatured));
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchNFTs();
  };

  return (
    <AppLayout>
      <Head>
        <title>NFT Marketplace - CYBEV</title>
      </Head>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Sparkles className="w-8 h-8 text-purple-600" />
              NFT Marketplace
            </h1>
            <p className="text-gray-500 mt-1">Discover, collect, and trade unique digital assets</p>
          </div>

          <Link href="/nft/create">
            <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-gray-900 rounded-xl font-medium hover:opacity-90 transition-opacity">
              <Plus className="w-5 h-5" />
              Create NFT
            </button>
          </Link>
        </div>

        {/* Featured Section */}
        {featuredNfts.length > 0 && selectedCategory === 'all' && !searchQuery && (
          <div className="mb-10">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-purple-600" />
              Featured
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredNfts.slice(0, 3).map((nft) => (
                <NFTCard key={nft._id} nft={nft} />
              ))}
            </div>
          </div>
        )}

        {/* Search and Filters */}
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          {/* Search */}
          <form onSubmit={handleSearch} className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder="Search NFTs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/50 border border-gray-200 rounded-xl pl-12 pr-4 py-3 text-gray-900 placeholder-gray-400 focus:border-purple-500 focus:outline-none"
            />
          </form>

          {/* Sort */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none bg-white/50 border border-gray-200 rounded-xl px-4 py-3 pr-10 text-gray-900 focus:border-purple-500 focus:outline-none cursor-pointer"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl transition-colors ${
              showFilters ? 'bg-purple-500 text-white' : 'bg-white/50 text-gray-500 border border-gray-200'
            }`}
          >
            <Filter className="w-5 h-5" />
            Filters
          </button>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-white/50 rounded-xl p-4 mb-6 border border-gray-200">
            <div className="flex flex-wrap gap-4 items-center">
              {/* Listed Only */}
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showListedOnly}
                  onChange={(e) => setShowListedOnly(e.target.checked)}
                  className="w-4 h-4 rounded bg-gray-700 border-gray-300 text-purple-500 focus:ring-purple-500"
                />
                <span className="text-gray-600">Listed Only</span>
              </label>

              {/* Price Range */}
              <div className="flex items-center gap-2">
                <span className="text-gray-500">Price:</span>
                <input
                  type="number"
                  placeholder="Min"
                  value={priceRange.min}
                  onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                  className="w-24 bg-gray-700 border border-gray-300 rounded-lg px-3 py-2 text-gray-900 text-sm"
                />
                <span className="text-gray-500">-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                  className="w-24 bg-gray-700 border border-gray-300 rounded-lg px-3 py-2 text-gray-900 text-sm"
                />
                <span className="text-gray-500">CYBEV</span>
              </div>

              {/* Apply */}
              <button
                onClick={() => { setPage(1); fetchNFTs(); }}
                className="px-4 py-2 bg-purple-500 text-gray-900 rounded-lg text-sm"
              >
                Apply
              </button>

              {/* Clear */}
              <button
                onClick={() => {
                  setPriceRange({ min: '', max: '' });
                  setShowListedOnly(false);
                  setSearchQuery('');
                  setSelectedCategory('all');
                  setPage(1);
                }}
                className="px-4 py-2 bg-gray-700 text-gray-600 rounded-lg text-sm"
              >
                Clear All
              </button>
            </div>
          </div>
        )}

        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-6 scrollbar-hide">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => { setSelectedCategory(cat.id); setPage(1); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-purple-500 text-white'
                  : 'bg-white text-gray-500 hover:bg-gray-100'
              }`}
            >
              <cat.icon className="w-4 h-4" />
              {cat.label}
            </button>
          ))}
        </div>

        {/* Results Count */}
        <p className="text-gray-500 mb-4">
          {total} NFT{total !== 1 ? 's' : ''} found
        </p>

        {/* NFT Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : nfts.length === 0 ? (
          <div className="text-center py-20">
            <Sparkles className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No NFTs found</h3>
            <p className="text-gray-500 mb-6">Be the first to create one!</p>
            <Link href="/nft/create">
              <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-gray-900 rounded-xl">
                Create NFT
              </button>
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {nfts.map((nft) => (
                <NFTCard key={nft._id} nft={nft} />
              ))}
            </div>

            {/* Load More */}
            {hasMore && (
              <div className="text-center mt-8">
                <button
                  onClick={() => setPage(page + 1)}
                  className="px-8 py-3 bg-white text-gray-900 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  Load More
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </AppLayout>
  );
}