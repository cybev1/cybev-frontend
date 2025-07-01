import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function PublicProfile() {
  const router = useRouter();
  const { username } = router.query;
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    if (username) {
      setProfile({
        name: username,
        bio: 'Creative thinker & digital builder.',
        location: 'Accra, Ghana',
        followers: 1324,
        posts: 25,
        earnings: 823.5,
        avatar: '/default-avatar.png'
      });
    }
  }, [username]);

  if (!profile) return <div className="text-center py-10">Loading profile...</div>;

  return (
    <div className="min-h-screen px-6 py-10 bg-gray-50 dark:bg-black text-gray-900 dark:text-white">
      <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
        <div className="flex items-center space-x-4 mb-6">
          <img src={profile.avatar} alt="avatar" className="w-20 h-20 rounded-full" />
          <div>
            <h1 className="text-3xl font-bold">@{profile.name}</h1>
            <p className="text-sm text-gray-600 dark:text-gray-300">{profile.location}</p>
          </div>
        </div>
        <p className="mb-4 text-gray-700 dark:text-gray-300">{profile.bio}</p>
        <div className="grid grid-cols-3 gap-4 text-center text-sm">
          <div>
            <p className="font-bold text-xl">{profile.posts}</p>
            <p className="text-gray-500 dark:text-gray-400">Posts</p>
          </div>
          <div>
            <p className="font-bold text-xl">{profile.followers}</p>
            <p className="text-gray-500 dark:text-gray-400">Followers</p>
          </div>
          <div>
            <p className="font-bold text-xl">₿ {profile.earnings.toFixed(2)}</p>
            <p className="text-gray-500 dark:text-gray-400">Earnings</p>
          </div>
        </div>
      </div>
    </div>
  );
}