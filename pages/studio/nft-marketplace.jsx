import { useEffect, useState } from 'react';
import AutoMintButton from '@/components/mint/AutoMintButton';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function NFTMarketplace() {
  const [nfts, setNfts] = useState([]);

  useEffect(() => {
    fetch('/api/nft/list')
      .then(res => res.json())
      .then(data => setNfts(data.nfts || []));

    localStorage.setItem('wallet', '0x84E98A08aBb7378d81b2DC1b0F591e0fe5172265');
  }, []);

  return (
    <div className="min-h-screen p-6 bg-white text-black">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">NFT Marketplace</h1>
        {nfts.length === 0 ? (
          <p>No NFTs available.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {nfts.map((nft, index) => (
              <div key={index} className="border p-4 rounded-xl shadow bg-gray-50">
                <img src={nft.mediaUrl} alt={nft.title} className="w-full h-48 object-cover rounded mb-3" />
                <h2 className="text-xl font-semibold">{nft.title}</h2>
                <p className="text-sm text-gray-600 mb-2">{nft.description}</p>
                <p className="text-xs text-gray-400 mb-2">Owned by: {nft.wallet}</p>

                {nft.txHash ? (
                  <p className="text-green-600 text-sm font-bold">✅ Minted</p>
                ) : (
                  <AutoMintButton
                    getData={() => ({
                      title: nft.title,
                      description: nft.description,
                      mediaUrl: nft.mediaUrl
                    })}
                  />
                )}
              </div>
            ))}
          </div>
        )}
        <ToastContainer />
      </div>
    </div>
  );
}