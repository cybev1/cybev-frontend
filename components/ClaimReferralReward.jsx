
import React, { useState } from 'react';
import { Gift } from 'lucide-react';
import { toast } from 'react-toastify';

export default function ClaimReferralReward({ username }) {
  const [loading, setLoading] = useState(false);
  const [claimed, setClaimed] = useState(false);

  const handleClaim = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/rewards/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username })
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`✅ ${data.amount} CYBV claimed!`);
        setClaimed(true);
      } else {
        toast.error(data.message || "No rewards to claim.");
      }
    } catch (err) {
      toast.error("Server error.");
    } finally {
      setLoading(false);
    }
  };

  if (claimed) return null;

  return (
    <button
      onClick={handleClaim}
      disabled={loading}
      className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 flex items-center gap-2"
    >
      <Gift size={16} /> {loading ? "Claiming..." : "Claim Referral Reward"}
    </button>
  );
}
