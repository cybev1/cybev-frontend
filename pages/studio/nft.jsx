import React, { useState, useEffect } from 'react';
import StudioLayout from '../../components/layout/StudioLayout';
import axios from 'axios';
import Head from 'next/head';

const SeoHead = () => (
  <Head>
    <title>CYBEV.IO – NFT Minting</title>
    <meta name="description" content="Mint and manage your NFTs on CYBEV.IO. Secure, Web3-powered digital ownership." />
    <meta property="og:title" content="CYBEV.IO – Mint NFTs" />
    <meta property="og:image" content="https://app.cybev.io/og-banner.png" />
  </Head>
);

export default function NFTMinting() {
  const [form, setForm] = useState({ title: '', description: '', imageUrl: '', price: '' });
  const [minting, setMinting] = useState(false);
  const [nfts, setNfts] = useState([]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setMinting(true);
    const token = localStorage.getItem('token');

    const tokenId = Math.floor(Math.random() * 100000).toString();
    const txHash = '0xFakeTransactionHash' + Date.now();

    try {
      await axios.post('/api/nft', { ...form, tokenId, txHash }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setForm({ title: '', description: '', imageUrl: '', price: '' });
      fetchMyNFTs();
    } catch (err) {
      alert('Minting failed');
    } finally {
      setMinting(false);
    }
  };

  const fetchMyNFTs = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.get('/api/nft/my', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNfts(res.data || []);
    } catch (err) {
      console.error('Failed to fetch NFTs');
    }
  };

  useEffect(() => {
    fetchMyNFTs();
  }, []);

  return (
    <StudioLayout>
      <SeoHead />
      <h2 className="text-2xl font-bold mb-4">🎨 Mint Your NFT</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" name="title" placeholder="Title" value={form.title} onChange={handleChange} required className="input" />
        <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} required className="input" />
        <input type="text" name="imageUrl" placeholder="Image URL" value={form.imageUrl} onChange={handleChange} required className="input" />
        <input type="number" name="price" placeholder="Price in CYBEV Token" value={form.price} onChange={handleChange} required className="input" />
        <button type="submit" disabled={minting} className="btn-primary">
          {minting ? 'Minting...' : 'Mint NFT'}
        </button>
      </form>

      {nfts.length > 0 && (
        <div className="mt-10">
          <h3 className="text-xl font-bold mb-2">🧾 Your Minted NFTs</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {nfts.map(nft => (
              <div key={nft._id} className="p-4 bg-white dark:bg-gray-800 rounded shadow">
                <p><strong>Title:</strong> {nft.title}</p>
                <p><strong>Price:</strong> {nft.price} CYBEV</p>
                <p><strong>Token ID:</strong> {nft.tokenId}</p>
                <p><strong>Tx Hash:</strong> {nft.txHash}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </StudioLayout>
  );
}
