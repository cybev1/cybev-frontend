import { useEffect } from 'react';
import { useRouter } from 'next/router';
import useCurrentUser from '../hooks/useCurrentUser';

export default function RequireAuth({ children }) {
  const { user, loading } = useCurrentUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [loading, user]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  return children;
}