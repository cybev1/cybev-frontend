import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function StudioFeedRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/feed');
  }, [router]);

  return null;
}
