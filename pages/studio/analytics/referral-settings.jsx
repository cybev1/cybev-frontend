
import React, { useEffect, useState } from 'react';
import { Share2, Info } from 'lucide-react';
import { toast } from 'react-toastify';

export default function ReferralSettings() {
  const [username, setUsername] = useState('prince'); // simulate from session
  const [referralLink, setReferralLink] = useState('');

  useEffect(() => {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    setReferralLink(`${baseUrl}/register?ref=${username}`);
  }, [username]);

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    toast.success("Referral link copied to clipboard!");
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4 flex items-center gap-2">
        <Share2 size={28} /> My Referral Tools
      </h1>

      <div className="bg-white dark:bg-gray-900 p-4 rounded-xl shadow mb-6">
        <p className="font-semibold mb-1">Your referral link:</p>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={referralLink}
            readOnly
            className="w-full p-2 border rounded bg-gray-100 dark:bg-gray-800"
          />
          <button onClick={handleCopy} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Copy
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 p-4 rounded-xl shadow">
        <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
          <Info size={20} /> Referral Rules
        </h2>
        <ul className="list-disc ml-6 space-y-2 text-gray-600 dark:text-gray-300 text-sm">
          <li>Each referral must register and activate their account.</li>
          <li>You earn 5% of their first CYBV token spend.</li>
          <li>You can track all referral performance on the leaderboard.</li>
          <li>Payouts are made weekly or claimable as tokens.</li>
        </ul>
      </div>
    </div>
  );
}
