
import React, { useEffect, useState } from 'react';
import { CheckCircle, LockOpen } from 'lucide-react';
import { toast } from 'react-toastify';

export default function UnlockReward({ start = Date.now(), durationDays = 30 }) {
  const [unlocked, setUnlocked] = useState(false);
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    const end = new Date(start).getTime() + durationDays * 24 * 60 * 60 * 1000;

    const interval = setInterval(() => {
      const now = Date.now();
      const progress = ((now - start) / (end - start)) * 100;
      setPercent(progress.toFixed(1));
      setUnlocked(progress >= 100);
    }, 1000);

    return () => clearInterval(interval);
  }, [start, durationDays]);

  const handleUnlock = () => {
    toast.success("🎉 Reward unlocked and added to your wallet!");
    setUnlocked(false);
  };

  return (
    <div className="mt-6">
      {unlocked ? (
        <button
          onClick={handleUnlock}
          className="w-full px-4 py-2 bg-green-600 text-white rounded flex items-center justify-center gap-2 hover:bg-green-700"
        >
          <LockOpen size={16} /> Unlock Reward
        </button>
      ) : (
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <CheckCircle size={14} className="text-gray-300" />
          {percent}% — reward unlock in progress
        </div>
      )}
    </div>
  );
}
