// ============================================
// FILE: src/pages/stories.jsx
// PATH: cybev-frontend/src/pages/stories.jsx
// PURPOSE: Web Stories gallery — browse visual stories
// VERSION: 1.0.0
// ============================================
import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import AppLayout from '@/components/Layout/AppLayout';
import { BookOpen, Loader2, ExternalLink } from 'lucide-react';

const API = process.env.NEXT_PUBLIC_API_URL || 'https://api.cybev.io';

export default function WebStories() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStories();
  }, []);

  const fetchStories = async () => {
    try {
      const res = await fetch(`${API}/api/web-stories?limit=30`);
      const data = await res.json();
      if (data.ok) setStories(data.stories || []);
    } catch (err) {
      console.error('Fetch stories error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <Head>
        <title>Web Stories | CYBEV</title>
        <meta name="description" content="Browse visual stories from CYBEV creators. Swipeable, full-screen stories powered by the latest articles." />
      </Head>

      <div className="max-w-5xl mx-auto px-4 py-5">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <BookOpen className="w-7 h-7 text-purple-600" /> Web Stories
          </h1>
          <p className="text-sm text-gray-500 mt-1">Swipeable visual stories from our latest articles</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
          </div>
        ) : stories.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center shadow-sm">
            <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-900 mb-2">No stories yet</h3>
            <p className="text-gray-500">Stories are auto-generated from published blog posts with cover images.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {stories.map(story => (
              <a key={story.id} href={story.storyUrl} target="_blank" rel="noopener noreferrer"
                className="group block no-underline">
                <div className="relative rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all aspect-[9/16] bg-gray-100">
                  {story.image ? (
                    <img src={story.image} alt={story.title}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <h3 className="text-white font-bold text-sm leading-tight line-clamp-3 mb-1.5">{story.title}</h3>
                    <div className="flex items-center gap-1.5">
                      <span className="text-white/70 text-[11px]">{story.author}</span>
                      {story.category && (
                        <>
                          <span className="text-white/40">·</span>
                          <span className="text-white/60 text-[10px] capitalize">{story.category}</span>
                        </>
                      )}
                    </div>
                  </div>
                  {/* Story ring indicator */}
                  <div className="absolute top-2 right-2 w-6 h-6 rounded-full border-2 border-white/50 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-white/80" />
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}

        {/* Info section */}
        <div className="mt-8 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-5 border border-purple-100">
          <h3 className="font-bold text-gray-900 mb-2">About Web Stories</h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            Web Stories are visual, tap-through stories that appear in Google Discover, Google Search, and across the web. 
            They're auto-generated from our published articles. Each story distills the key points into 
            a swipeable, mobile-first experience with a link back to the full article.
          </p>
        </div>
      </div>
    </AppLayout>
  );
}
