import { useState } from 'react';

export default function MintNFTPage() {
  const [title, setTitle] = useState('');
  const [media, setMedia] = useState(null);
  const [minting, setMinting] = useState(false);
  const [result, setResult] = useState(null);

  const handleMediaUpload = (e) => {
    setMedia(e.target.files[0]);
  };

  const handleMint = async () => {
    if (!title || !media) return alert('Title and media required');

    const formData = new FormData();
    formData.append('title', title);
    formData.append('media', media);

    setMinting(true);
    const res = await fetch('/api/mint', {
      method: 'POST',
      body: formData,
    });
    const data = await res.json();
    setResult(data);
    setMinting(false);
  };

  return (
    <div className="max-w-xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold mb-4">🪙 Mint Your NFT</h1>
      <input
        type="text"
        placeholder="Title for NFT"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full mb-4 px-4 py-2 rounded-md border"
      />
      <input
        type="file"
        onChange={handleMediaUpload}
        accept="image/*,video/*"
        className="w-full mb-4"
      />
      <button
        onClick={handleMint}
        className="bg-purple-600 text-white px-6 py-2 rounded-lg"
        disabled={minting}
      >
        {minting ? 'Minting...' : 'Mint Now'}
      </button>

      {result && (
        <div className="mt-4 bg-green-100 text-green-800 p-3 rounded-lg">
          <p><strong>Minted!</strong></p>
          <p>Token ID: {result.tokenId}</p>
          <p>Transaction: <a href={`https://mumbai.polygonscan.com/tx/${result.tx}`} className="underline" target="_blank">View</a></p>
        </div>
      )}
    </div>
  );
}