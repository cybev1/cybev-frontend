// ============================================
// FILE: src/pages/web3/index.jsx
// Web3 Dashboard - Wallet, Staking, NFTs
// ============================================
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';
import AppLayout from '@/components/Layout/AppLayout';
import WalletButton from '@/components/Web3/WalletButton';
import TokenStaking from '@/components/Web3/TokenStaking';
import { useWeb3 } from '@/context/Web3Context';
import { 
  Wallet, Coins, Image, TrendingUp, Gift, Lock,
  ExternalLink, ArrowRight, Sparkles
} from 'lucide-react';
import { toast } from 'react-toastify';

export default function Web3Dashboard() {
  const router = useRouter();
  const { wallet, isConnected, tokenBalance, balance, getCurrentChain } = useWeb3();
  const [activeTab, setActiveTab] = useState('overview');
  const [nfts, setNfts] = useState([]);
  const [loadingNFTs, setLoadingNFTs] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/login');
      return;
    }
    
    if (isConnected) {
      fetchNFTs();
    }
  }, [isConnected]);

  const fetchNFTs = async () => {
    setLoadingNFTs(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/nft/my-nfts', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setNfts(data.nfts || []);
      }
    } catch (error) {
      console.error('Failed to fetch NFTs:', error);
    } finally {
      setLoadingNFTs(false);
    }
  };

  const chain = getCurrentChain();

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Wallet },
    { id: 'staking', label: 'Staking', icon: Lock },
    { id: 'nfts', label: 'My NFTs', icon: Image }
  ];

  return (
    <AppLayout>
      <Head>
        <title>Web3 Dashboard - CYBEV</title>
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                <Sparkles className="w-8 h-8 text-purple-400" />
                Web3 Dashboard
              </h1>
              <p className="text-gray-400 mt-1">Manage your wallet, stake tokens, and view NFTs</p>
            </div>
            <WalletButton compact />
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-800/50 text-gray-400 hover:text-white hover:bg-gray-700/50'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Wallet Overview */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 rounded-xl p-6 border border-purple-500/30">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                      <Wallet className="w-6 h-6 text-purple-400" />
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Wallet Status</p>
                      <p className={`font-medium ${isConnected ? 'text-green-400' : 'text-red-400'}`}>
                        {isConnected ? 'Connected' : 'Not Connected'}
                      </p>
                    </div>
                  </div>
                  {isConnected && (
                    <div className="bg-black/20 rounded-lg p-3">
                      <p className="text-gray-400 text-xs mb-1">Address</p>
                      <p className="text-white font-mono text-sm truncate">{wallet}</p>
                      <p className="text-gray-500 text-xs mt-1">{chain.name}</p>
                    </div>
                  )}
                </div>

                <div className="bg-gray-800/30 rounded-xl p-6 border border-purple-500/20">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center">
                      <Coins className="w-6 h-6 text-yellow-400" />
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">CYBEV Balance</p>
                      <p className="text-2xl font-bold text-white">{parseFloat(tokenBalance).toLocaleString()}</p>
                    </div>
                  </div>
                  <Link href="/rewards/dashboard">
                    <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 rounded-lg transition-colors">
                      <Gift className="w-4 h-4" />
                      Earn More
                    </button>
                  </Link>
                </div>

                <div className="bg-gray-800/30 rounded-xl p-6 border border-purple-500/20">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">{chain.symbol} Balance</p>
                      <p className="text-2xl font-bold text-white">{balance}</p>
                    </div>
                  </div>
                  {isConnected && (
                    <a
                      href={`${chain.explorer}/address/${wallet}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                      View on Explorer
                    </a>
                  )}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-gray-800/30 rounded-xl p-6 border border-purple-500/20">
                <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button
                    onClick={() => setActiveTab('staking')}
                    className="flex items-center gap-3 p-4 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 rounded-xl transition-colors"
                  >
                    <Lock className="w-8 h-8 text-purple-400" />
                    <div className="text-left">
                      <p className="text-white font-medium">Stake Tokens</p>
                      <p className="text-gray-400 text-sm">Earn up to 25% APY</p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-purple-400 ml-auto" />
                  </button>

                  <Link href="/studio/ai-blog">
                    <button className="w-full flex items-center gap-3 p-4 bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 rounded-xl transition-colors">
                      <Sparkles className="w-8 h-8 text-green-400" />
                      <div className="text-left">
                        <p className="text-white font-medium">Create & Mint</p>
                        <p className="text-gray-400 text-sm">Write blog → Mint NFT</p>
                      </div>
                      <ArrowRight className="w-5 h-5 text-green-400 ml-auto" />
                    </button>
                  </Link>

                  <button
                    onClick={() => setActiveTab('nfts')}
                    className="flex items-center gap-3 p-4 bg-pink-500/20 hover:bg-pink-500/30 border border-pink-500/30 rounded-xl transition-colors"
                  >
                    <Image className="w-8 h-8 text-pink-400" />
                    <div className="text-left">
                      <p className="text-white font-medium">My NFTs</p>
                      <p className="text-gray-400 text-sm">{nfts.length} minted</p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-pink-400 ml-auto" />
                  </button>
                </div>
              </div>

              {/* Recent NFTs Preview */}
              {nfts.length > 0 && (
                <div className="bg-gray-800/30 rounded-xl p-6 border border-purple-500/20">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-white">Recent NFTs</h2>
                    <button
                      onClick={() => setActiveTab('nfts')}
                      className="text-purple-400 text-sm hover:text-purple-300"
                    >
                      View All →
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {nfts.slice(0, 3).map((nft) => (
                      <div key={nft._id} className="bg-gray-900/50 rounded-lg p-4">
                        {nft.blog?.featuredImage ? (
                          <img
                            src={nft.blog.featuredImage}
                            alt={nft.metadata?.name}
                            className="w-full h-32 object-cover rounded-lg mb-3"
                          />
                        ) : (
                          <div className="w-full h-32 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg mb-3 flex items-center justify-center">
                            <Image className="w-12 h-12 text-white/50" />
                          </div>
                        )}
                        <p className="text-white font-medium truncate">{nft.metadata?.name}</p>
                        <p className="text-gray-500 text-sm">Token #{nft.tokenId?.slice(-8)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'staking' && <TokenStaking />}

          {activeTab === 'nfts' && (
            <div className="space-y-6">
              <div className="bg-gray-800/30 rounded-xl p-6 border border-purple-500/20">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                    <Image className="w-6 h-6 text-purple-400" />
                    My NFT Collection
                  </h2>
                  <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm">
                    {nfts.length} NFTs
                  </span>
                </div>

                {loadingNFTs ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
                  </div>
                ) : nfts.length === 0 ? (
                  <div className="text-center py-12">
                    <Image className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400 mb-2">No NFTs yet</p>
                    <p className="text-gray-500 text-sm mb-4">Create a blog post and mint it as an NFT</p>
                    <Link href="/studio/ai-blog">
                      <button className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors">
                        Create Blog
                      </button>
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {nfts.map((nft) => (
                      <div key={nft._id} className="bg-gray-900/50 rounded-xl overflow-hidden border border-gray-700 hover:border-purple-500/50 transition-colors">
                        {nft.blog?.featuredImage ? (
                          <img
                            src={nft.blog.featuredImage}
                            alt={nft.metadata?.name}
                            className="w-full h-48 object-cover"
                          />
                        ) : (
                          <div className="w-full h-48 bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                            <Image className="w-16 h-16 text-white/50" />
                          </div>
                        )}
                        <div className="p-4">
                          <h3 className="text-white font-medium mb-2 line-clamp-2">{nft.metadata?.name}</h3>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500">Token #{nft.tokenId?.slice(-8)}</span>
                            <span className="text-purple-400">{new Date(nft.mintedAt).toLocaleDateString()}</span>
                          </div>
                          <div className="flex gap-2 mt-4">
                            <Link href={`/blog/${nft.blog?._id}`} className="flex-1">
                              <button className="w-full px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm transition-colors">
                                View Blog
                              </button>
                            </Link>
                            <a
                              href={`https://opensea.io/assets/${nft.contractAddress}/${nft.tokenId}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm transition-colors"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
