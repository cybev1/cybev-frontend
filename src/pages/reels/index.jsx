// Reels index → redirect to /vlog
import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function ReelsIndex() {
  const router = useRouter();
  useEffect(() => { router.replace('/vlog'); }, []);
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
    </div>
  );
}
