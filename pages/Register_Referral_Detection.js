
import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Register() {
  const router = useRouter();

  useEffect(() => {
    const ref = router.query.ref;
    if (ref) {
      localStorage.setItem('cybev_ref', ref);
    }
  }, [router.query]);

  // continue with existing registration logic...
}
