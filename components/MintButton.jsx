import { useState } from 'react';

export default function MintButton({ post }) {
  const [loading, setLoading] = useState(false);
  const [txHash, setTxHash] = useState('');

  const handleMint = async () => {
    setLoading(true);
    setTxHash('');
    try {
      const res = await fetch('/api/blog/mint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: post.title,
          slug: post.slug,
          author: post.author,
          content: post.content
        }),
      });
      const data = await res.json();
      if (data.success) {
        setTxHash(data.txHash);
        alert(data.message);
      } else {
        alert(data.message || 'Mint failed.');
      }
    } catch (err) {
      console.error(err);
      alert('Minting error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4">
      <button
        onClick={handleMint}
        disabled={loading}
        className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-2 rounded font-semibold"
      >
        {loading ? 'Minting...' : '🪙 Mint Article'}
      </button>
      {txHash && (
        <p className="text-sm text-green-600 mt-2">Minted: <span className="font-mono">{txHash}</span></p>
      )}
    </div>
  );
}