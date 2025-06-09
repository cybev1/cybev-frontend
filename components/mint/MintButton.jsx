import React, { useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';

export default function MintButton({ title, description, mediaUrl, userWallet }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleMint = async () => {
    setLoading(true);
    try {
      const res = await axios.post('/api/mint', {
        title,
        description,
        mediaUrl,
        userWallet
      });
      toast.success('NFT Minted! Token ID: ' + res.data.tokenId);
      setOpen(false);
    } catch (err) {
      toast.error('Minting failed: ' + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button onClick={() => setOpen(true)} className="px-4 py-2 bg-purple-600 text-white rounded-md">
        🪙 Mint as NFT
      </button>

      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-xl w-96 shadow-xl">
            <h2 className="text-xl font-bold mb-2">Confirm Mint</h2>
            <p><strong>Title:</strong> {title}</p>
            <p><strong>Description:</strong> {description}</p>
            <p className="text-sm truncate"><strong>Media:</strong> {mediaUrl}</p>
            <p className="text-sm break-all"><strong>Wallet:</strong> {userWallet}</p>

            <div className="mt-4 flex justify-end gap-2">
              <button onClick={() => setOpen(false)} className="px-3 py-1 bg-gray-300 rounded">Cancel</button>
              <button
                onClick={handleMint}
                disabled={loading}
                className="px-4 py-1 bg-purple-700 text-white rounded"
              >
                {loading ? 'Minting...' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}