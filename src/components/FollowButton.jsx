// ============================================
// FILE: src/components/FollowButton.jsx
// Reusable Follow/Unfollow Button Component
// ============================================

import { useState } from 'react';
import { UserPlus, UserMinus, Loader2, UserCheck } from 'lucide-react';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.cybev.io';

export default function FollowButton({ 
  userId, 
  initialIsFollowing = false,
  onFollowChange,
  size = 'default', // 'small', 'default', 'large'
  variant = 'default', // 'default', 'outline', 'minimal'
  showIcon = true,
  className = ''
}) {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [loading, setLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleToggleFollow = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (loading) return;
    
    setLoading(true);
    
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
      
      if (!token) {
        // Redirect to login
        window.location.href = '/auth/login';
        return;
      }

      const res = await axios.post(
        `${API_URL}/api/follow/${userId}/toggle`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.ok) {
        setIsFollowing(res.data.isFollowing);
        onFollowChange?.(res.data.isFollowing, res.data.counts);
      }
    } catch (err) {
      console.error('Follow toggle error:', err);
      // Show error message
      const errorMsg = err.response?.data?.error || 'Failed to update follow status';
      alert(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Size classes
  const sizeClasses = {
    small: 'px-3 py-1 text-xs',
    default: 'px-4 py-2 text-sm',
    large: 'px-6 py-3 text-base'
  };

  // Icon sizes
  const iconSizes = {
    small: 'w-3 h-3',
    default: 'w-4 h-4',
    large: 'w-5 h-5'
  };

  // Variant classes
  const getVariantClasses = () => {
    if (isFollowing) {
      // Following state
      if (isHovered) {
        // Hover - show unfollow
        return 'bg-red-500/20 text-red-400 border-red-500/50 hover:bg-red-500/30';
      }
      // Normal following state
      switch (variant) {
        case 'outline':
          return 'bg-transparent border-purple-500 text-purple-400 hover:bg-purple-500/10';
        case 'minimal':
          return 'bg-white/10 text-white hover:bg-white/20';
        default:
          return 'bg-white/10 text-white border-white/20 hover:bg-white/20';
      }
    } else {
      // Not following state
      switch (variant) {
        case 'outline':
          return 'bg-transparent border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white';
        case 'minimal':
          return 'bg-purple-600 text-white hover:bg-purple-700';
        default:
          return 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg hover:shadow-purple-500/30';
      }
    }
  };

  const getButtonContent = () => {
    if (loading) {
      return (
        <>
          <Loader2 className={`${iconSizes[size]} animate-spin`} />
          <span>Loading...</span>
        </>
      );
    }

    if (isFollowing) {
      if (isHovered) {
        return (
          <>
            {showIcon && <UserMinus className={iconSizes[size]} />}
            <span>Unfollow</span>
          </>
        );
      }
      return (
        <>
          {showIcon && <UserCheck className={iconSizes[size]} />}
          <span>Following</span>
        </>
      );
    }

    return (
      <>
        {showIcon && <UserPlus className={iconSizes[size]} />}
        <span>Follow</span>
      </>
    );
  };

  return (
    <button
      onClick={handleToggleFollow}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      disabled={loading}
      className={`
        inline-flex items-center justify-center gap-2 
        font-semibold rounded-lg border border-transparent
        transition-all duration-200 
        disabled:opacity-50 disabled:cursor-not-allowed
        ${sizeClasses[size]}
        ${getVariantClasses()}
        ${className}
      `}
    >
      {getButtonContent()}
    </button>
  );
}

// Compact version for lists
export function FollowButtonCompact({ userId, initialIsFollowing, onFollowChange }) {
  return (
    <FollowButton
      userId={userId}
      initialIsFollowing={initialIsFollowing}
      onFollowChange={onFollowChange}
      size="small"
      variant="minimal"
      showIcon={false}
    />
  );
}
