import { useState } from 'react'

const dummyPosts = [
  { _id: '1', title: 'The Rise of Digital Creators', content: 'Explore how creators are monetizing content with NFTs.' },
  { _id: '2', title: 'AI in Content Creation', content: 'CYBEV AI helps automate blogging, SEO, and engagement.' }
];

export default function Mint() {
  const [selected, setSelected] = useState(null);
  const [minting, setMinting] = useState(false);
  const [minted, setMinted] = useState(false);

  const handleMint = () => {
    setMinting(true);
    setTimeout(() => {
      setMinting(false);
      setMinted(true);
    }, 2000); // simulate minting delay
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-bold text-purple-800 mb-4">Mint a Post as NFT</h1>

        <select
          onChange={(e) => {
            const post = dummyPosts.find(p => p._id === e.target.value);
            setSelected(post);
            setMinted(false);
          }}
          className="w-full mb-4 p-2 border rounded"
        >
          <option value="">Select a post to mint</option>
          {dummyPosts.map(post => (
            <option key={post._id} value={post._id}>{post.title}</option>
          ))}
        </select>

        {selected && (
          <div className="border p-4 rounded bg-gray-50 mb-4">
            <h2 className="text-lg font-semibold text-blue-900">{selected.title}</h2>
            <p className="text-gray-700 mt-2">{selected.content}</p>
            <p className="text-sm text-green-600 mt-2 font-medium">Estimated Mint Cost: ₡15</p>
          </div>
        )}

        {selected && !minted && (
          <button onClick={handleMint} disabled={minting}
            className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700">
            {minting ? 'Minting...' : 'Mint as NFT'}
          </button>
        )}

        {minted && (
          <p className="text-green-700 font-semibold mt-4">🎉 Successfully minted on testnet!</p>
        )}
      </div>
    </div>
  );
}