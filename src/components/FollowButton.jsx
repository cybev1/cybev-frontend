import { useEffect, useMemo, useState } from 'react';
import { UserPlus, UserMinus, Loader2 } from 'lucide-react';
import { followAPI } from '@/lib/api';

/**
 * Reusable Follow/Unfollow button.
 *
 * Props:
 * - targetUserId (string)  : user ID to follow/unfollow
 * - initialIsFollowing (boolean)
 * - onChanged({ isFollowing }) (optional)
 */
export default function FollowButton({
  targetUserId,
  initialIsFollowing = false,
  onChanged,
  className = '',
  size = 'md',
}) {
  const [isFollowing, setIsFollowing] = useState(!!initialIsFollowing);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setIsFollowing(!!initialIsFollowing);
  }, [initialIsFollowing]);

  const ui = useMemo(() => {
    const base =
      'inline-flex items-center justify-center gap-2 rounded-xl border transition px-3 py-2 text-sm font-medium';
    const sizes = {
      sm: 'px-2 py-1 text-xs',
      md: 'px-3 py-2 text-sm',
      lg: 'px-4 py-2.5 text-base',
    };
    const variant = isFollowing
      ? 'bg-white/10 border-white/20 hover:bg-white/15'
      : 'bg-white text-black border-white hover:bg-white/90';
    return `${base} ${sizes[size] || sizes.md} ${variant} ${className}`;
  }, [className, isFollowing, size]);

  const toggle = async () => {
    if (!targetUserId || loading) return;
    setLoading(true);
    setError('');

    try {
      if (isFollowing) {
        await followAPI.unfollow(targetUserId);
        setIsFollowing(false);
        onChanged?.({ isFollowing: false });
      } else {
        await followAPI.follow(targetUserId);
        setIsFollowing(true);
        onChanged?.({ isFollowing: true });
      }
    } catch (e) {
      console.error(e);
      setError('Could not update follow. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="inline-flex flex-col items-start">
      <button type="button" onClick={toggle} className={ui} disabled={loading}>
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>...</span>
          </>
        ) : isFollowing ? (
          <>
            <UserMinus className="h-4 w-4" />
            <span>Following</span>
          </>
        ) : (
          <>
            <UserPlus className="h-4 w-4" />
            <span>Follow</span>
          </>
        )}
      </button>

      {error ? <div className="mt-1 text-xs text-red-300">{error}</div> : null}
    </div>
  );
}
