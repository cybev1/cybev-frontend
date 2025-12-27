// ============================================
// FILE: src/components/Web3/NFTMinter.jsx
// Mint Blog Posts as NFTs
// ============================================
import { useState } from 'react';
import { useWeb3 } from '@/context/Web3Context';
import { 
  Image, Loader2, Check, AlertCircle, ExternalLink,
  Sparkles, Coins, Lock
} from 'lucide-react';
import { toast } from 'react-toastify';

export default function NFTMinter({ blog, onMinted }) {
  const { wallet, isConnected, connectWallet, signMessage } = useWeb3();
  const [minting, setMinting] = useState(false);
  const [minted, setMinted] = useState(blog?.nft || null);
  const [showModal, setShowModal] = useState(false);
  const [mintPrice, setMintPrice] = useState(10); // CYBEV tokens

  const handleMint = async () => {
    if (!isConnected) {
      await connectWallet();
      return;
    }

    if (!blog) {
      toast.error('No blog selected for minting');
      return;
    }

    setMinting(true);
    try {
      // Sign message to prove ownership
      const message = `Mint Blog NFT\nBlog: ${blog.title}\nID: ${blog._id}\nTimestamp: ${Date.now()}`;
      const signature = await signMessage(message);

      if (!signature) {
        setMinting(false);
        return;
      }

      // Call backend to mint NFT
      const token = localStorage.getItem('token');
      const response = await fetch('/api/nft/mint', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          blogId: blog._id,
          wallet,
          signature,
          message
        })
      });

      const data = await response.json();

      if (data.ok || data.success) {
        setMinted(data.nft);
        toast.success('🎉 NFT minted successfully!');
        setShowModal(false);
        onMinted?.(data.nft);
      } else {
        toast.error(data.error || 'Minting failed');
      }
    } catch (error) {
      console.error('Mint error:', error);
      toast.error('Failed to mint NFT');
    } finally {
      setMinting(false);
    }
  };

  // Already minted
  if (minted) {
    return (
      <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 border border-purple-500/30 rounded-xl p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
            <Check className="w-5 h-5 text-green-400" />
          </div>
          <div>
            <p className="text-white font-medium">NFT Minted!</p>
            <p className="text-gray-400 text-sm">Token #{minted.tokenId || '---'}</p>
          </div>
        </div>
        
        {minted.tokenId && (
          <a
            href={`https://opensea.io/assets/${minted.contractAddress}/${minted.tokenId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-purple-400 hover:text-purple-300 text-sm"
          >
            <ExternalLink className="w-4 h-4" />
            View on OpenSea
          </a>
        )}
      </div>
    );
  }

  return (
    <>
      {/* Mint Button */}
      <button
        onClick={() => setShowModal(true)}
        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-medium transition-all"
      >
        <Sparkles className="w-4 h-4" />
        Mint as NFT
      </button>

      {/* Mint Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-2xl p-6 max-w-md w-full border border-purple-500/30">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Image className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Mint Blog as NFT</h3>
              <p className="text-gray-400">Turn your blog post into a unique NFT on the blockchain</p>
            </div>

            {/* Blog Preview */}
            <div className="bg-gray-900/50 rounded-xl p-4 mb-6">
              <p className="text-white font-medium mb-2 line-clamp-2">{blog?.title}</p>
              <div className="flex items-center gap-4 text-sm text-gray-400">
                <span>By {blog?.authorName}</span>
                <span>•</span>
                <span>{blog?.views || 0} views</span>
              </div>
            </div>

            {/* Mint Details */}
            <div className="space-y-3 mb-6">
              <div className="flex justify-between items-center py-2 border-b border-gray-700">
                <span className="text-gray-400">Mint Price</span>
                <span className="text-white font-medium flex items-center gap-1">
                  <Coins className="w-4 h-4 text-yellow-400" />
                  {mintPrice} CYBEV
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-700">
                <span className="text-gray-400">Network</span>
                <span className="text-white font-medium">Polygon</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-700">
                <span className="text-gray-400">Royalties</span>
                <span className="text-white font-medium">5%</span>
              </div>
            </div>

            {/* Benefits */}
            <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4 mb-6">
              <p className="text-purple-300 font-medium mb-2">NFT Benefits:</p>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• Proof of original authorship</li>
                <li>• Tradeable on NFT marketplaces</li>
                <li>• Earn royalties on secondary sales</li>
                <li>• Exclusive creator badge</li>
              </ul>
            </div>

            {/* Wallet Status */}
            {!isConnected && (
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 mb-4 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-yellow-400" />
                <span className="text-yellow-300 text-sm">Connect wallet to mint</span>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleMint}
                disabled={minting}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg transition-all disabled:opacity-50"
              >
                {minting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Minting...
                  </>
                ) : !isConnected ? (
                  <>
                    <Lock className="w-4 h-4" />
                    Connect Wallet
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Mint NFT
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
