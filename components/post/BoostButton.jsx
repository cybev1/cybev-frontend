import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function BoostButton({ postId }) {
  const [boosted, setBoosted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleBoost = async () => {
    setLoading(true);
    try {
      const res = await axios.post('/api/post/boost', { postId });
      if (res.data.success) {
        toast.success('🚀 Post Boosted!');
        setBoosted(true);
      } else {
        toast.error('Failed to boost post.');
      }
    } catch (err) {
      toast.error('Boost error: ' + err.message);
    }
    setLoading(false);
  };

  return (
    <button
      onClick={handleBoost}
      disabled={boosted || loading}
      className={\`
        px-4 py-2 text-sm rounded-full font-semibold transition-all
        \${boosted ? 'bg-gradient-to-r from-orange-400 to-pink-500 text-white' :
          'bg-gradient-to-r from-purple-600 to-blue-500 text-white hover:scale-105 shadow-lg'}
      \`}
      style={{
        boxShadow: boosted
          ? '0 0 15px rgba(255, 94, 0, 0.7)'
          : '0 0 12px rgba(124, 58, 237, 0.5)',
        transition: '0.3s ease'
      }}
    >
      {boosted ? '🔥 Boosted' : (loading ? 'Boosting...' : '🚀 Boost Post')}
    </button>
  );
}