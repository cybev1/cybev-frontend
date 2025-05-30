
import React, { useState } from 'react';

export default function NFTMinting() {
  const [form, setForm] = useState({
    title: '', description: '', imageUrl: '', price: ''
  });

  const [minting, setMinting] = useState(false);
  const [result, setResult] = useState(null);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setMinting(true);
    try {
      // Simulated minting process
      setTimeout(() => {
        setResult({
          ...form,
          tokenId: Math.floor(Math.random() * 100000),
          txHash: '0xFakeTransactionHash1234567890'
        });
        setMinting(false);
      }, 2000);
    } catch (err) {
      setMinting(false);
      alert("Minting failed");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Mint Your NFT</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="title" placeholder="Title" onChange={handleChange} required /><br />
        <textarea name="description" placeholder="Description" onChange={handleChange} required /><br />
        <input type="text" name="imageUrl" placeholder="Image URL" onChange={handleChange} required /><br />
        <input type="number" name="price" placeholder="Price in CYBEV Token" onChange={handleChange} required /><br />
        <button type="submit" disabled={minting}>{minting ? 'Minting...' : 'Mint NFT'}</button>
      </form>

      {result && (
        <div style={{ marginTop: 20 }}>
          <h4>🎉 Minted Successfully!</h4>
          <p><strong>Title:</strong> {result.title}</p>
          <p><strong>Token ID:</strong> {result.tokenId}</p>
          <p><strong>Tx Hash:</strong> {result.txHash}</p>
        </div>
      )}
    </div>
  );
}
