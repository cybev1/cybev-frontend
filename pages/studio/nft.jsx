
import React, { useState } from 'react';
import StudioLayout from '../../components/layout/StudioLayout';

export default function NFTMinting() {
  const [form, setForm] = useState({ title: '', description: '', imageUrl: '', price: '' });
  const [minting, setMinting] = useState(false);
  const [result, setResult] = useState(null);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setMinting(true);
    setTimeout(() => {
      setResult({
        ...form,
        tokenId: Math.floor(Math.random() * 100000),
        txHash: '0xFakeTransactionHash1234567890'
      });
      setMinting(false);
    }, 2000);
  };

  return (
    <StudioLayout>
      <h2 className="text-2xl font-bold mb-4">🎨 Mint Your NFT</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" name="title" placeholder="Title" onChange={handleChange} required className="input" />
        <textarea name="description" placeholder="Description" onChange={handleChange} required className="input" />
        <input type="text" name="imageUrl" placeholder="Image URL" onChange={handleChange} required className="input" />
        <input type="number" name="price" placeholder="Price in CYBEV Token" onChange={handleChange} required className="input" />
        <button type="submit" disabled={minting} className="btn-primary">
          {minting ? 'Minting...' : 'Mint NFT'}
        </button>
      </form>
      {result && (
        <div className="mt-6">
          <h4>🎉 Minted Successfully!</h4>
          <p><strong>Title:</strong> {result.title}</p>
          <p><strong>Token ID:</strong> {result.tokenId}</p>
          <p><strong>Tx Hash:</strong> {result.txHash}</p>
        </div>
      )}
    </StudioLayout>
  );
}
