import { useEffect, useState } from 'react';
import getUserProfile from '@/utils/getUserProfile';
import withAuth from '@/utils/withAuth';

function ProfilePage() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    getUserProfile().then(setUser);
  }, []);

  if (!user) return <div className="text-center py-20 text-gray-400">Loading profile...</div>;

  return (
    <div className="max-w-xl mx-auto mt-12 p-6 bg-white dark:bg-zinc-900 rounded-xl shadow-md text-gray-800 dark:text-white">
      <h1 className="text-2xl font-bold mb-4">My Profile</h1>
      <div className="space-y-2">
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        {user.referral && <p><strong>Referral Code:</strong> {user.referral}</p>}
      </div>
    </div>
  );
}

export default withAuth(ProfilePage);