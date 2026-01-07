// ============================================
// FILE: src/components/UI/Skeleton.jsx
// Skeleton Loading Components
// VERSION: 1.0
// ============================================

import { motion } from 'framer-motion';

// Base skeleton with shimmer effect
export function Skeleton({ className = '', animate = true }) {
  return (
    <div className={`relative overflow-hidden bg-gray-200 dark:bg-gray-700 rounded ${className}`}>
      {animate && (
        <motion.div
          className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent"
          animate={{ translateX: ['−100%', '100%'] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
        />
      )}
    </div>
  );
}

// Post/Feed Card Skeleton
export function PostSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 space-y-4 border border-gray-100 dark:border-gray-800">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Skeleton className="w-12 h-12 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-32 rounded-lg" />
          <Skeleton className="h-3 w-24 rounded-lg" />
        </div>
        <Skeleton className="w-8 h-8 rounded-lg" />
      </div>
      
      {/* Content */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-full rounded-lg" />
        <Skeleton className="h-4 w-full rounded-lg" />
        <Skeleton className="h-4 w-3/4 rounded-lg" />
      </div>
      
      {/* Image placeholder */}
      <Skeleton className="h-64 w-full rounded-xl" />
      
      {/* Actions */}
      <div className="flex items-center gap-4 pt-2">
        <Skeleton className="h-8 w-16 rounded-lg" />
        <Skeleton className="h-8 w-16 rounded-lg" />
        <Skeleton className="h-8 w-16 rounded-lg" />
        <div className="flex-1" />
        <Skeleton className="h-8 w-8 rounded-lg" />
      </div>
    </div>
  );
}

// Compact post skeleton (no image)
export function PostSkeletonCompact() {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 space-y-3 border border-gray-100 dark:border-gray-800">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Skeleton className="w-10 h-10 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-28 rounded-lg" />
          <Skeleton className="h-3 w-20 rounded-lg" />
        </div>
      </div>
      
      {/* Content */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-full rounded-lg" />
        <Skeleton className="h-4 w-2/3 rounded-lg" />
      </div>
      
      {/* Actions */}
      <div className="flex items-center gap-4">
        <Skeleton className="h-6 w-12 rounded-lg" />
        <Skeleton className="h-6 w-12 rounded-lg" />
        <Skeleton className="h-6 w-12 rounded-lg" />
      </div>
    </div>
  );
}

// User/Profile Card Skeleton
export function UserCardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-100 dark:border-gray-800">
      <div className="flex items-center gap-3">
        <Skeleton className="w-12 h-12 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-32 rounded-lg" />
          <Skeleton className="h-3 w-24 rounded-lg" />
        </div>
        <Skeleton className="h-9 w-20 rounded-full" />
      </div>
    </div>
  );
}

// Comment Skeleton
export function CommentSkeleton() {
  return (
    <div className="flex gap-3">
      <Skeleton className="w-8 h-8 rounded-full flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl p-3 space-y-2">
          <Skeleton className="h-3 w-24 rounded-lg" />
          <Skeleton className="h-4 w-full rounded-lg" />
          <Skeleton className="h-4 w-3/4 rounded-lg" />
        </div>
        <div className="flex gap-4 px-2">
          <Skeleton className="h-3 w-12 rounded" />
          <Skeleton className="h-3 w-8 rounded" />
          <Skeleton className="h-3 w-10 rounded" />
        </div>
      </div>
    </div>
  );
}

// Notification Skeleton
export function NotificationSkeleton() {
  return (
    <div className="flex items-start gap-3 p-4 border-b border-gray-100 dark:border-gray-800">
      <Skeleton className="w-10 h-10 rounded-full flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-full rounded-lg" />
        <Skeleton className="h-3 w-24 rounded-lg" />
      </div>
      <Skeleton className="w-10 h-10 rounded-lg flex-shrink-0" />
    </div>
  );
}

// Message/Chat Skeleton
export function MessageSkeleton({ isOwn = false }) {
  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[70%] space-y-1 ${isOwn ? 'items-end' : 'items-start'}`}>
        <Skeleton className={`h-10 w-48 ${isOwn ? 'rounded-2xl rounded-br-md' : 'rounded-2xl rounded-bl-md'}`} />
        <Skeleton className="h-3 w-16 rounded" />
      </div>
    </div>
  );
}

// Blog Card Skeleton
export function BlogCardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800">
      {/* Cover Image */}
      <Skeleton className="h-48 w-full" />
      
      {/* Content */}
      <div className="p-5 space-y-3">
        <Skeleton className="h-6 w-full rounded-lg" />
        <Skeleton className="h-6 w-3/4 rounded-lg" />
        
        <div className="space-y-2 pt-2">
          <Skeleton className="h-4 w-full rounded-lg" />
          <Skeleton className="h-4 w-full rounded-lg" />
          <Skeleton className="h-4 w-2/3 rounded-lg" />
        </div>
        
        {/* Footer */}
        <div className="flex items-center gap-3 pt-3">
          <Skeleton className="w-8 h-8 rounded-full" />
          <Skeleton className="h-4 w-24 rounded-lg" />
          <div className="flex-1" />
          <Skeleton className="h-4 w-16 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

// Vlog/Video Card Skeleton
export function VlogCardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800">
      {/* Video Thumbnail */}
      <div className="relative">
        <Skeleton className="aspect-video w-full" />
        <div className="absolute bottom-2 right-2">
          <Skeleton className="h-5 w-12 rounded" />
        </div>
      </div>
      
      {/* Info */}
      <div className="p-3 flex gap-3">
        <Skeleton className="w-10 h-10 rounded-full flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-full rounded-lg" />
          <Skeleton className="h-3 w-32 rounded-lg" />
          <Skeleton className="h-3 w-24 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

// Profile Header Skeleton
export function ProfileHeaderSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800">
      {/* Cover */}
      <Skeleton className="h-32 md:h-48 w-full" />
      
      {/* Profile Info */}
      <div className="px-4 pb-4">
        <div className="flex flex-col md:flex-row md:items-end gap-4 -mt-12 md:-mt-16">
          <Skeleton className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white dark:border-gray-900" />
          
          <div className="flex-1 space-y-2 pb-2">
            <Skeleton className="h-6 w-48 rounded-lg" />
            <Skeleton className="h-4 w-32 rounded-lg" />
          </div>
          
          <div className="flex gap-2">
            <Skeleton className="h-10 w-24 rounded-full" />
            <Skeleton className="h-10 w-10 rounded-full" />
          </div>
        </div>
        
        {/* Bio */}
        <div className="mt-4 space-y-2">
          <Skeleton className="h-4 w-full rounded-lg" />
          <Skeleton className="h-4 w-3/4 rounded-lg" />
        </div>
        
        {/* Stats */}
        <div className="flex gap-6 mt-4">
          <Skeleton className="h-4 w-20 rounded-lg" />
          <Skeleton className="h-4 w-20 rounded-lg" />
          <Skeleton className="h-4 w-20 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

// Sidebar Suggestion Skeleton
export function SuggestionSkeleton() {
  return (
    <div className="flex items-center gap-3 p-2">
      <Skeleton className="w-10 h-10 rounded-full" />
      <div className="flex-1 space-y-1">
        <Skeleton className="h-4 w-24 rounded" />
        <Skeleton className="h-3 w-16 rounded" />
      </div>
      <Skeleton className="h-8 w-16 rounded-full" />
    </div>
  );
}

// Trending Topic Skeleton
export function TrendingSkeleton() {
  return (
    <div className="p-3 space-y-1">
      <Skeleton className="h-3 w-16 rounded" />
      <Skeleton className="h-4 w-28 rounded" />
      <Skeleton className="h-3 w-20 rounded" />
    </div>
  );
}

// Group Card Skeleton
export function GroupCardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800">
      <Skeleton className="h-24 w-full" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-5 w-3/4 rounded-lg" />
        <Skeleton className="h-4 w-full rounded-lg" />
        <div className="flex items-center gap-2">
          <div className="flex -space-x-2">
            <Skeleton className="w-6 h-6 rounded-full" />
            <Skeleton className="w-6 h-6 rounded-full" />
            <Skeleton className="w-6 h-6 rounded-full" />
          </div>
          <Skeleton className="h-3 w-20 rounded" />
        </div>
      </div>
    </div>
  );
}

// Live Stream Card Skeleton
export function LiveStreamSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800">
      <div className="relative">
        <Skeleton className="aspect-video w-full" />
        <div className="absolute top-2 left-2">
          <Skeleton className="h-6 w-14 rounded" />
        </div>
        <div className="absolute bottom-2 right-2">
          <Skeleton className="h-5 w-16 rounded" />
        </div>
      </div>
      <div className="p-3 flex gap-3">
        <Skeleton className="w-10 h-10 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-full rounded-lg" />
          <Skeleton className="h-3 w-24 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

// Feed Loading Component (multiple posts)
export function FeedSkeleton({ count = 3 }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <PostSkeleton key={i} />
      ))}
    </div>
  );
}

// Export all
export default {
  Skeleton,
  PostSkeleton,
  PostSkeletonCompact,
  UserCardSkeleton,
  CommentSkeleton,
  NotificationSkeleton,
  MessageSkeleton,
  BlogCardSkeleton,
  VlogCardSkeleton,
  ProfileHeaderSkeleton,
  SuggestionSkeleton,
  TrendingSkeleton,
  GroupCardSkeleton,
  LiveStreamSkeleton,
  FeedSkeleton
};
