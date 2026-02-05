// ============================================
// FILE: src/pages/reels/[id].jsx
// Reels → Vlog Redirect (Reels is the Vlog feature)
// VERSION: 2.0.0 - Redirect to vlog viewer
// ============================================

import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function ReelRedirect() {
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (id) {
      router.replace(`/vlog/${id}`);
    }
  }, [id]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
    </div>
  );
}
