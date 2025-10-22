```javascript
import { useState, useEffect } from 'react';
import { UserPlus, UserCheck } from 'lucide-react';
import { followAPI } from '@/lib/api';
import { toast } from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';

export default function FollowButton({ userId, username, size = 'md', className = '' }) {
  const { user, isAuthenticated } = useAuth();
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated && userId) {
      checkFollowStatus();
    }
  }, [userId, isAuthenticated]);

  const checkFollowStatus = async () => {
    try {
      const { data } = await followAPI.checkFollowing(userId);
      setIsFollowing(data.isFollowing);
    } catch (error) {
      console.error('Failed to check follow status:', error);
    }
  };

  const handleFollow = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to follow users');
      return;
    }

    setLoading(true);
    try {
      if (isFollowing) {
        await followAPI.unfollowUser(userId);
        setIsFollowing(false);
        toast.success(`Unfollowed ${username}`);
      } else {
        await followAPI.followUser(userId);
        setIsFollowing(true);
        toast.success(`Following ${username}`);
      }
    } catch (error) {
      console.error('Follow action failed:', error);
      toast.error(error.response?.data?.error || 'Failed to update follow status');
    } finally {
      setLoading(false);
    }
  };

  // Don't show button for own profile
  if (user?._id === userId) {
    return null;
  }

  const sizeClasses = {
    sm: 'px-3 py-1 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg'
  };

  return (
    
      {isFollowing ? (
        <>
          
          Following
        </>
      ) : (
        <>
          
          Follow
        </>
      )}
    
  );
}
```

---

### Frontend - User Profile Page with Follow
