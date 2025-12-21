import { useEffect, useMemo, useState } from 'react';
import { Loader2, UserCheck, UserPlus } from 'lucide-react';
import { followAPI } from '@/lib/api';

function getCurrentUserId() {
  if (typeof window === 'undefined') return null;
  try {
    const u = JSON.parse(localStorage.getItem('user') || 'null');
    return u?._id || u?.id || null;
  } catch {
    return null;
  }
}

/**
 * FollowButton
 * - Auth: expects token in localStorage (axios interceptor adds it)
 * - Backend: /api/follow/*
 */
export default function FollowButton({
  userId,
  username = 'user',
  size = 'md',
  className = '',
  initialFollowing = null,
  onChange
}) {
  const currentUserId = useMemo(() => getCurrentUserId(), []);
  const [isFollowing, setIsFollowing] = useState(Boolean(initialFollowing));
  const [loading, setLoading] = useState(false);

  // Hide for missing target or for self
  if (!userId || (currentUserId && String(currentUserId) === String(userId))) {
    return null;
  }

  useEffect(() => {
    let mounted = true;

    const run = async () => {
      if (typeof window === 'undefined') return;
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const { data } = await followAPI.checkFollowing(userId);
        if (!mounted) return;
        if (data?.ok) setIsFollowing(Boolean(data.isFollowing));
      } catch (err) {
        console.error('Failed to check follow status:', err);
      }
    };

    run();
    return () => {
      mounted = false;
    };
  }, [userId]);

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-5 py-2.5 text-base'
  };

  const handleToggle = async () => {
    if (typeof window === 'undefined') return;
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login to follow users');
      return;
    }

    setLoading(true);
    try {
      if (isFollowing) {
        await followAPI.unfollowUser(userId);
        setIsFollowing(false);
        onChange?.(false);
      } else {
        await followAPI.followUser(userId);
        setIsFollowing(true);
        onChange?.(true);
      }
    } catch (err) {
      console.error('Follow action failed:', err);
      const msg = err?.response?.data?.error || 'Failed to update follow status';
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={[
        'inline-flex items-center gap-2 rounded-xl font-bold transition-all shadow-lg',
        isFollowing
          ? 'bg-white text-gray-900 border-2 border-purple-200 hover:bg-gray-50'
          : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:opacity-90',
        sizeClasses[size] || sizeClasses.md,
        loading ? 'opacity-70 cursor-not-allowed' : '',
        className
      ].join(' ')}
      title={isFollowing ? `Unfollow @${username}` : `Follow @${username}`}
      type="button"
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : isFollowing ? (
        <UserCheck className="w-4 h-4" />
      ) : (
        <UserPlus className="w-4 h-4" />
      )}
      <span>{isFollowing ? 'Following' : 'Follow'}</span>
    </button>
  );
}
