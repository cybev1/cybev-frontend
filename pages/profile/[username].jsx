import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function PublicProfile() {
  const router = useRouter();
  const { username } = router.query;
  const [userData, setUserData] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    if (username) {
      // Simulate fetching user data
      setUserData({
        username,
        name: username === 'prince' ? 'Prince' : 'Jane Doe',
        avatar: '/default-avatar.png',
        followers: 42,
        following: 12,
        bio: 'I create content, mint NFTs and earn crypto on CYBEV.'
      });
    }
  }, [username]);

  const toggleFollow = () => {
    setIsFollowing(!isFollowing);
    // await fetch('/api/follow', { method: 'POST', body: JSON.stringify({ username }) })
  };

  if (!userData) return <div className="p-6">Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto px-6 py-8 bg-white dark:bg-gray-900 rounded-2xl shadow-lg mt-10">
      <div className="flex items-center gap-4">
        <img src={userData.avatar} alt="avatar" className="w-20 h-20 rounded-full" />
        <div>
          <h1 className="text-xl font-bold">{userData.name}</h1>
          <p className="text-sm text-gray-600 dark:text-gray-300">@{userData.username}</p>
          <p className="mt-2 text-gray-800 dark:text-white">{userData.bio}</p>
        </div>
      </div>
      <div className="flex gap-6 mt-4 text-sm text-gray-700 dark:text-gray-200">
        <span>👥 {userData.followers} Followers</span>
        <span>➡️ Following {userData.following}</span>
      </div>
      <div className="mt-4">
        <button
          onClick={toggleFollow}
          className={`px-4 py-2 rounded-lg ${isFollowing ? 'bg-red-600' : 'bg-blue-600'} text-white`}
        >
          {isFollowing ? 'Unfollow' : 'Follow'}
        </button>
      </div>
    </div>
  );
}