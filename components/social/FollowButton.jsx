import { useState, useEffect } from 'react';

export default function FollowButton({ targetUsername }) {
  const [isFollowing, setIsFollowing] = useState(false);
  const currentUser = typeof window !== 'undefined' ? localStorage.getItem('cybev_username') : null;

  useEffect(() => {
    fetch('/api/users/following')
      .then(res => res.json())
      .then(data => {
        if (data.following?.includes(targetUsername)) setIsFollowing(true);
      });
  }, [targetUsername]);

  const toggleFollow = async () => {
    const res = await fetch('/api/users/follow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: currentUser, to: targetUsername })
    });
    const data = await res.json();
    if (data.success) setIsFollowing(prev => !prev);
  };

  if (!currentUser || currentUser === targetUsername) return null;

  return (
    <button
      onClick={toggleFollow}
      className={`px-3 py-1 text-sm rounded-lg ${
        isFollowing ? 'bg-gray-300 dark:bg-gray-700' : 'bg-blue-600 text-white hover:bg-blue-700'
      }`}
    >
      {isFollowing ? 'Unfollow' : 'Follow'}
    </button>
  );
}