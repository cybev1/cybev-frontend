import { useEffect, useState } from 'react';

export default function useCurrentUser() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }

    fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/auth/me`, {
      headers: { Authorization: token }
    })
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data) {
          setUser(data);
        }
      })
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  return { user, loading };
}