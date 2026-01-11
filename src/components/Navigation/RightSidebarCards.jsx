// ============================================
// FILE: src/components/Navigation/RightSidebarCards.jsx
// PURPOSE: Right sidebar (SIMPLIFIED - Desktop only)
// VERSION: 3.0 - Fixed mobile issues
// ============================================

import Link from 'next/link';
import { Calendar, Users, TrendingUp, Sparkles } from 'lucide-react';

export default function RightSidebarCards() {
  return (
    // Only show on desktop (hidden on mobile)
    <div className="hidden lg:block sticky top-20 space-y-4">
      <SuggestedCard />
      <TrendingCard />
      <EventsCard />
      <FooterLinks />
    </div>
  );
}

function SuggestedCard() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
      <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-purple-500" />
        Suggested for you
      </h3>
      <div className="space-y-3">
        <SuggestedItem name="Create your first post" href="/post/create" />
        <SuggestedItem name="Complete your profile" href="/settings/profile" />
        <SuggestedItem name="Explore the community" href="/explore" />
      </div>
    </div>
  );
}

function SuggestedItem({ name, href }) {
  return (
    <Link 
      href={href}
      className="block p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition text-sm text-gray-700 dark:text-gray-300"
    >
      {name}
    </Link>
  );
}

function TrendingCard() {
  const topics = [
    { tag: 'CYBEV', posts: 1234 },
    { tag: 'Web3', posts: 892 },
    { tag: 'CreatorEconomy', posts: 567 }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
      <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
        <TrendingUp className="w-4 h-4 text-orange-500" />
        Trending
      </h3>
      <div className="space-y-3">
        {topics.map((topic, i) => (
          <Link 
            key={topic.tag}
            href={`/hashtag/${topic.tag}`}
            className="block hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg p-2 transition"
          >
            <p className="text-xs text-gray-400">{i + 1} · Trending</p>
            <p className="font-medium text-gray-900 dark:text-white">#{topic.tag}</p>
            <p className="text-xs text-gray-500">{topic.posts} posts</p>
          </Link>
        ))}
      </div>
      <Link 
        href="/explore/trending"
        className="block mt-3 text-center text-sm text-purple-600 hover:underline"
      >
        Show more
      </Link>
    </div>
  );
}

function EventsCard() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
      <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
        <Calendar className="w-4 h-4 text-blue-500" />
        Upcoming
      </h3>
      <p className="text-sm text-gray-500">No upcoming events</p>
      <Link 
        href="/events"
        className="block mt-3 text-center text-sm text-purple-600 hover:underline"
      >
        View all events
      </Link>
    </div>
  );
}

function FooterLinks() {
  return (
    <div className="text-xs text-gray-400 px-2">
      <div className="flex flex-wrap gap-2 mb-2">
        <Link href="/about" className="hover:underline">About</Link>
        <span>·</span>
        <Link href="/help" className="hover:underline">Help</Link>
        <span>·</span>
        <Link href="/privacy" className="hover:underline">Privacy</Link>
        <span>·</span>
        <Link href="/terms" className="hover:underline">Terms</Link>
      </div>
      <p>© {new Date().getFullYear()} CYBEV</p>
    </div>
  );
}
