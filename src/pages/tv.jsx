// ============================================
// FILE: tv.jsx
// PATH: /src/pages/tv.jsx
// CYBEV TV 2.0 — Redesigned TV Experience
// ============================================
import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import api from '@/lib/api';
import AppLayout from '@/components/Layout/AppLayout';
import {
  Play, Tv, Radio, Clock, Eye, Heart, Users, Search,
  ChevronRight, ChevronLeft, Film, Mic, Headphones,
  Video, Flame, TrendingUp, Star, Zap, Globe, Loader2,
  PlayCircle, Pause, Volume2, Calendar, PlusCircle
} from 'lucide-react';

// ─── Categories ───
const CATEGORIES = [
  { id: 'all', label: 'All', icon: Globe },
  { id: 'live', label: '🔴 Live Now', icon: Radio },
  { id: 'trending', label: 'Trending', icon: Flame },
  { id: 'ministry', label: 'Ministry', icon: Star },
  { id: 'music', label: 'Music', icon: Headphones },
  { id: 'teaching', label: 'Teaching', icon: Mic },
  { id: 'entertainment', label: 'Entertainment', icon: Film },
  { id: 'tech', label: 'Tech', icon: Zap },
  { id: 'lifestyle', label: 'Lifestyle', icon: Heart },
];

// ─── Featured Hero Card ───
function FeaturedHero({ stream, onClick }) {
  if (!stream) return null;
  const isLive = stream.status === 'live';
  return (
    <div
      onClick={() => onClick(stream)}
      className="relative w-full aspect-[21/9] md:aspect-[21/7] rounded-2xl overflow-hidden cursor-pointer group bg-gray-900"
    >
      {getThumbnail(stream) ? (
        <img
          src={getThumbnail(stream)}
          alt={stream.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-purple-900 via-indigo-900 to-gray-900" />
      )}
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />

      {/* Content */}
      <div className="absolute bottom-0 left-0 p-6 md:p-8 max-w-xl">
        {isLive && (
          <div className="inline-flex items-center gap-1.5 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold mb-3">
            <Radio size={12} className="animate-pulse" /> LIVE
          </div>
        )}
        <h2 className="text-white text-xl md:text-3xl font-bold mb-2 line-clamp-2">{stream.title}</h2>
        {stream.description && (
          <p className="text-gray-300 text-sm md:text-base line-clamp-2 mb-3">{stream.description}</p>
        )}
        <div className="flex items-center gap-4 text-gray-400 text-sm">
          {stream.host && (
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-purple-500/40 overflow-hidden">
                {stream.host?.avatar ? (
                  <img src={stream.host.avatar} alt="" className="w-full h-full object-cover" />
                ) : null}
              </div>
              <span className="text-gray-300">{stream.host?.displayName || stream.host?.username}</span>
            </div>
          )}
          <span className="flex items-center gap-1"><Eye size={14} /> {stream.viewerCount || getViewCount(stream)}</span>
        </div>
        {/* Play button */}
        <button className="mt-4 flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-full font-semibold transition-colors">
          <Play size={18} className="ml-0.5" />
          {isLive ? 'Watch Live' : 'Watch Now'}
        </button>
      </div>
    </div>
  );
}

// ─── Stream Card ───
function StreamCard({ stream, onClick, size = 'normal' }) {
  const isLive = stream.status === 'live';
  const isSmall = size === 'small';

  return (
    <div
      onClick={() => onClick(stream)}
      className={`group cursor-pointer flex-shrink-0 ${isSmall ? 'w-48 md:w-56' : 'w-full'}`}
    >
      <div className={`relative rounded-xl overflow-hidden bg-gray-800 ${isSmall ? 'aspect-video' : 'aspect-video'}`}>
        {getThumbnail(stream) ? (
          <img
            src={getThumbnail(stream)}
            alt={stream.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-purple-800 to-indigo-900 flex items-center justify-center">
            <Tv size={32} className="text-white/20" />
          </div>
        )}
        {/* Badges */}
        {isLive && (
          <div className="absolute top-2 left-2 flex items-center gap-1 bg-red-600 text-white px-2 py-0.5 rounded-full text-[10px] font-bold">
            <Radio size={10} className="animate-pulse" /> LIVE
          </div>
        )}
        {stream.duration && !isLive && (
          <div className="absolute bottom-2 right-2 bg-black/70 text-white px-1.5 py-0.5 rounded text-[10px] font-mono">
            {formatDuration(stream.duration)}
          </div>
        )}
        {/* Play overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center">
          <PlayCircle size={40} className="text-white/90 opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-lg" />
        </div>
        {/* Viewer count */}
        {(isLive || stream.viewerCount > 0) && (
          <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-black/60 text-white px-1.5 py-0.5 rounded text-[10px]">
            <Eye size={10} /> {stream.viewerCount || getViewCount(stream)}
          </div>
        )}
      </div>
      <div className="mt-2">
        <h3 className={`font-semibold text-gray-900 line-clamp-2 ${isSmall ? 'text-xs' : 'text-sm'}`}>
          {stream.title}
        </h3>
        <div className="flex items-center gap-2 mt-1">
          {stream.host && (
            <span className={`text-gray-500 ${isSmall ? 'text-[10px]' : 'text-xs'}`}>
              {stream.host?.displayName || stream.host?.username || stream.author?.username}
            </span>
          )}
          {getViewCount(stream) > 0 && (
            <span className={`text-gray-400 ${isSmall ? 'text-[10px]' : 'text-xs'}`}>
              · {formatViews(getViewCount(stream))} views
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Horizontal Scroll Row ───
function ContentRow({ title, icon: Icon, items, onClick, seeAllHref, size = 'normal' }) {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  };

  const scroll = (dir) => {
    scrollRef.current?.scrollBy({ left: dir * 300, behavior: 'smooth' });
  };

  if (!items || items.length === 0) return null;

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-3 px-1">
        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          {Icon && <Icon size={20} className="text-purple-600" />}
          {title}
        </h2>
        {seeAllHref && (
          <Link href={seeAllHref} className="text-purple-600 hover:text-purple-700 text-sm font-medium flex items-center gap-1">
            See all <ChevronRight size={16} />
          </Link>
        )}
      </div>
      <div className="relative group/row">
        {/* Scroll buttons */}
        {canScrollLeft && (
          <button onClick={() => scroll(-1)}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-9 h-9 bg-white shadow-lg rounded-full flex items-center justify-center text-gray-700 hover:text-purple-600 opacity-0 group-hover/row:opacity-100 transition-opacity"
          >
            <ChevronLeft size={20} />
          </button>
        )}
        {canScrollRight && (
          <button onClick={() => scroll(1)}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-9 h-9 bg-white shadow-lg rounded-full flex items-center justify-center text-gray-700 hover:text-purple-600 opacity-0 group-hover/row:opacity-100 transition-opacity"
          >
            <ChevronRight size={20} />
          </button>
        )}
        {/* Scrollable content */}
        <div
          ref={scrollRef}
          onScroll={checkScroll}
          className="flex gap-4 overflow-x-auto scrollbar-hide pb-2"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {items.map((item) => (
            <StreamCard
              key={item._id}
              stream={item}
              onClick={onClick}
              size={size}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Helpers ───

// Generate thumbnail from Cloudinary video URL
const generateThumbnailFromVideoUrl = (videoUrl) => {
  if (!videoUrl) return null;
  try {
    const url = new URL(videoUrl);
    const pathParts = url.pathname.split('/');
    const uploadIndex = pathParts.indexOf('upload');
    if (uploadIndex === -1) return null;
    pathParts.splice(uploadIndex + 1, 0, 'so_1,w_400,h_400,c_fill');
    const lastPart = pathParts[pathParts.length - 1];
    pathParts[pathParts.length - 1] = lastPart.replace(/\.[^.]+$/, '.jpg');
    url.pathname = pathParts.join('/');
    return url.toString();
  } catch { return null; }
};

// Get best available thumbnail for a vlog/stream
function getThumbnail(item) {
  return item.thumbnailUrl || item.thumbnail || item.coverImage
    || generateThumbnailFromVideoUrl(item.videoUrl || item.url)
    || null;
}

function getViewCount(item) {
  if (item.viewsCount !== undefined) return item.viewsCount;
  if (typeof item.views === 'number') return item.views;
  if (Array.isArray(item.views)) return item.views.length;
  return 0;
}

function formatDuration(seconds) {
  if (!seconds) return '';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  if (m >= 60) {
    const h = Math.floor(m / 60);
    return `${h}:${(m % 60).toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function formatViews(n) {
  if (!n) return '0';
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return n.toString();
}

// ─── Main TV Page ───
export default function TVPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Content sections
  const [featured, setFeatured] = useState(null);
  const [liveStreams, setLiveStreams] = useState([]);
  const [trendingVlogs, setTrendingVlogs] = useState([]);
  const [recentVlogs, setRecentVlogs] = useState([]);
  const [watchParties, setWatchParties] = useState([]);
  const [categoryContent, setCategoryContent] = useState([]);

  const fetchContent = useCallback(async () => {
    try {
      setLoading(true);
      const requests = [
        api.get('/api/vlogs?sort=-views&limit=1').catch(() => ({ data: { vlogs: [] } })),
        api.get('/api/vlogs?status=live&limit=20').catch(() => ({ data: { vlogs: [] } })),
        api.get('/api/vlogs?sort=-views&limit=20').catch(() => ({ data: { vlogs: [] } })),
        api.get('/api/vlogs?sort=-createdAt&limit=20').catch(() => ({ data: { vlogs: [] } })),
        api.get('/api/watch-party?status=live&limit=10').catch(() => ({ data: { parties: [] } })),
      ];

      const [featRes, liveRes, trendRes, recentRes, wpRes] = await Promise.all(requests);

      // Featured = top viewed or first live stream
      const liveItems = liveRes.data?.vlogs || liveRes.data || [];
      const featuredItem = liveItems[0] || (featRes.data?.vlogs || featRes.data)?.[0] || null;
      setFeatured(featuredItem);

      setLiveStreams(liveItems);
      setTrendingVlogs(trendRes.data?.vlogs || trendRes.data || []);
      setRecentVlogs(recentRes.data?.vlogs || recentRes.data || []);
      setWatchParties(wpRes.data?.parties || []);
    } catch (err) {
      console.error('Failed to fetch TV content:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchContent(); }, [fetchContent]);

  // Fetch category-specific content
  useEffect(() => {
    if (activeCategory === 'all' || activeCategory === 'live' || activeCategory === 'trending') {
      setCategoryContent([]);
      return;
    }
    const fetchCat = async () => {
      try {
        const { data } = await api.get(`/api/vlogs?category=${activeCategory}&limit=30`);
        setCategoryContent(data?.vlogs || data || []);
      } catch {
        setCategoryContent([]);
      }
    };
    fetchCat();
  }, [activeCategory]);

  const handleStreamClick = (stream) => {
    if (stream.status === 'live' && stream.streamKey) {
      router.push(`/live/${stream._id}`);
    } else {
      router.push(`/vlog/${stream._id}`);
    }
  };

  const handleWatchPartyClick = (party) => {
    router.push(`/watch-party/${party._id}`);
  };

  // Filter displayed content by category
  const getDisplayContent = () => {
    if (activeCategory === 'live') return { items: liveStreams, title: 'Live Now' };
    if (activeCategory === 'trending') return { items: trendingVlogs, title: 'Trending' };
    if (activeCategory !== 'all') return { items: categoryContent, title: CATEGORIES.find(c => c.id === activeCategory)?.label || '' };
    return null;
  };

  const catDisplay = getDisplayContent();

  return (
    <AppLayout>
      <Head>
        <title>CYBEV TV</title>
      </Head>

      <div className="max-w-7xl mx-auto px-4 py-4">
        {/* Top Bar */}
        <div className="flex items-center justify-between mb-5">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Tv className="text-purple-600" size={28} />
            CYBEV TV
          </h1>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text" placeholder="Search videos..."
                value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 border border-gray-300 rounded-full text-sm w-48 md:w-64 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
              />
            </div>
            <Link href="/live/go-live"
              className="flex items-center gap-1.5 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-full text-sm font-medium transition-colors"
            >
              <Radio size={14} /> Go Live
            </Link>
            <Link href="/vlog/create"
              className="flex items-center gap-1.5 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-full text-sm font-medium transition-colors"
            >
              <PlusCircle size={14} /> Upload
            </Link>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex gap-2 overflow-x-auto pb-3 mb-4 scrollbar-hide" style={{ scrollbarWidth: 'none' }}>
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors flex-shrink-0 ${
                activeCategory === cat.id
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={32} className="animate-spin text-purple-600" />
          </div>
        ) : (
          <>
            {/* Category-specific view */}
            {catDisplay ? (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">{catDisplay.title}</h2>
                {catDisplay.items.length === 0 ? (
                  <div className="text-center py-16 text-gray-500">
                    <Tv size={48} className="mx-auto mb-3 text-gray-300" />
                    <p>No content in this category yet</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {catDisplay.items.map(item => (
                      <StreamCard key={item._id} stream={item} onClick={handleStreamClick} />
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <>
                {/* Featured Hero */}
                {featured && <FeaturedHero stream={featured} onClick={handleStreamClick} />}

                {/* Live Now */}
                {liveStreams.length > 0 && (
                  <div className="mt-8">
                    <ContentRow
                      title="🔴 Live Now"
                      items={liveStreams}
                      onClick={handleStreamClick}
                      size="small"
                    />
                  </div>
                )}

                {/* Watch Parties */}
                {watchParties.length > 0 && (
                  <ContentRow
                    title="Watch Parties"
                    icon={Users}
                    items={watchParties.map(wp => ({
                      ...wp,
                      thumbnail: wp.coverImage || wp.videoSource?.thumbnail,
                      host: wp.host,
                      viewerCount: (wp.participants || []).filter(p => p.isActive).length
                    }))}
                    onClick={handleWatchPartyClick}
                    seeAllHref="/watch-party"
                    size="small"
                  />
                )}

                {/* Trending */}
                <ContentRow
                  title="Trending"
                  icon={TrendingUp}
                  items={trendingVlogs}
                  onClick={handleStreamClick}
                />

                {/* Recently Uploaded */}
                <ContentRow
                  title="Recently Uploaded"
                  icon={Clock}
                  items={recentVlogs}
                  onClick={handleStreamClick}
                />
              </>
            )}
          </>
        )}
      </div>
    </AppLayout>
  );
}
