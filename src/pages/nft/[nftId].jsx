// ============================================
// FILE: src/pages/nft/[nftId].jsx
// PATH: cybev-frontend/src/pages/nft/[nftId].jsx
// PURPOSE: Single NFT detail view with buy/bid/manage
// ============================================

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import AppLayout from '@/components/Layout/AppLayout';
import {
  Heart,
  Share2,
  Eye,
  Clock,
  Tag,
  ExternalLink,
  MoreVertical,
  Edit,
  Trash2,
  Copy,
  Check,
  Loader2,
  ChevronLeft,
  Verified,
  Lock,
  History,
  Gavel,
  ShoppingCart,
  TrendingUp,
  User,
  Wallet,
  AlertCircle,
  X,
  Sparkles
} from 'lucide-react';
import api from '@/lib/api';

// History Event Component
function HistoryItem({ event }) {
  const getEventIcon = () => {
    switch (event.event) {
      case 'minted': return <Sparkles className="w-4 h-4 text-purple-600" />;
      case 'listed': return <Tag className="w-4 h-4 text-green-400" />;
      case 'unlisted': return <X className="w-4 h-4 text-gray-500" />;
      case 'sold': return <ShoppingCart className="w-4 h-4 text-blue-400" />;
      case 'transferred': return <TrendingUp className="w-4 h-4 text-yellow-400" />;
      case 'bid': return <Gavel className="w-4 h-4 text-pink-600" />;
      default: return <History className="w-4 h-4 text-gray-500" />;
    }
  };

  const getEventText = () => {
    switch (event.event) {
      case 'minted': return `Minted by ${event.to?.name || 'Creator'}`;
      case 'listed': return `Listed for ${event.price} CYBEV`;
      case 'unlisted': return 'Removed from sale';
      case 'sold': return `Sold to ${event.to?.name || 'Buyer'} for ${event.price} CYBEV`;
      case 'transferred': return `Transferred to ${event.to?.name || 'New Owner'}`;
      case 'bid': return `Bid placed: ${event.price} CYBEV`;
      default: return event.event;
    }
  };

  return (
    <div className="flex items-center gap-3 py-3 border-b border-gray-200 last:border-0">
      <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
        {getEventIcon()}
      </div>
      <div className="flex-1">
        <p className="text-gray-900 text-sm">{getEventText()}</p>
        <p className="text-gray-500 text-xs">
          {new Date(event.createdAt).toLocaleDateString()} at {new Date(event.createdAt).toLocaleTimeString()}
        </p>
      </div>
      {event.transactionHash && (
        <a
          href={`https://polygonscan.com/tx/${event.transactionHash}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-purple-600 hover:text-purple-600"
        >
          <ExternalLink className="w-4 h-4" />
        </a>
      )}
    </div>
  );
}

export default function NFTDetail() {
  const router = useRouter();
  const { nftId } = router.query;
  
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [nft, setNft] = useState(null);
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(0);
  const [copied, setCopied] = useState(false);
  
  // Modals
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [showBidModal, setShowBidModal] = useState(false);
  const [showListModal, setShowListModal] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  
  // Forms
  const [bidAmount, setBidAmount] = useState('');
  const [listPrice, setListPrice] = useState('');
  const [listType, setListType] = useState('fixed');
  const [processing, setProcessing] = useState(false);

  // Sample NFT for demo
  const sampleNft = {
    _id: nftId,
    name: 'Cosmic Dream #001',
    description: 'A mesmerizing journey through the cosmos, capturing the essence of infinite possibility and the beauty of the unknown universe. This piece represents the intersection of human imagination and digital artistry.',
    image: 'https://images.unsplash.com/photo-1634017839464-5c339bbe3c9c?w=800',
    creator: { _id: 'creator1', name: 'ArtistX', username: 'artistx', avatar: null },
    owner: { _id: 'owner1', name: 'Collector1', username: 'collector1', avatar: null },
    collection: { name: 'Cosmic Series', image: null },
    category: 'art',
    tokenId: '1234',
    contractAddress: '0x1234...5678',
    chainId: 137,
    isListed: true,
    listingPrice: 250,
    listingType: 'fixed',
    royaltyPercentage: 10,
    views: 1250,
    likes: 89,
    attributes: [
      { trait_type: 'Background', value: 'Nebula' },
      { trait_type: 'Rarity', value: 'Legendary' },
      { trait_type: 'Edition', value: '1 of 1' }
    ],
    history: [
      { event: 'minted', to: { name: 'ArtistX' }, createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
      { event: 'listed', from: { name: 'ArtistX' }, price: 250, createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000) }
    ],
    hasUnlockable: true,
    status: 'minted'
  };

  useEffect(() => {
    if (!nftId) return;

    const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
    if (!token) {
      router.push('/auth/login');
      return;
    }

    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (e) {}
    }

    fetchNFT();
  }, [nftId, router]);

  const fetchNFT = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
      const response = await api.get(`/api/nft/${nftId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.ok) {
        setNft(response.data.nft);
        setLikes(response.data.nft.likes || 0);
        setLiked(response.data.nft.likedBy?.includes(user?._id));
      }
    } catch (error) {
      console.log('Using sample NFT');
      setNft(sampleNft);
      setLikes(sampleNft.likes);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
      const response = await api.post(`/api/nft/${nftId}/like`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.ok) {
        setLiked(response.data.liked);
        setLikes(response.data.likes);
      }
    } catch (error) {
      // Toggle locally for demo
      setLiked(!liked);
      setLikes(liked ? likes - 1 : likes + 1);
    }
  };

  const handleShare = () => {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({ title: nft?.name, url });
    } else {
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleBuy = async () => {
    setProcessing(true);
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
      
      // In production, trigger blockchain transaction here
      // const tx = await contract.buyNFT(nft.tokenId, { value: nft.listingPrice });
      // await tx.wait();
      
      const response = await api.post(`/api/nft/${nftId}/buy`, {
        transactionHash: '0x' + Math.random().toString(16).slice(2)
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.ok) {
        alert('NFT purchased successfully!');
        fetchNFT();
      }
    } catch (error) {
      console.error('Buy failed:', error);
      alert('Purchase failed. Please try again.');
    } finally {
      setProcessing(false);
      setShowBuyModal(false);
    }
  };

  const handleBid = async () => {
    if (!bidAmount || parseFloat(bidAmount) <= 0) {
      alert('Please enter a valid bid amount');
      return;
    }

    if (parseFloat(bidAmount) <= (nft?.highestBid || nft?.listingPrice || 0)) {
      alert('Bid must be higher than the current highest bid');
      return;
    }

    setProcessing(true);
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
      const response = await api.post(`/api/nft/${nftId}/bid`, {
        amount: parseFloat(bidAmount)
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.ok) {
        alert('Bid placed successfully!');
        fetchNFT();
        setBidAmount('');
      }
    } catch (error) {
      console.error('Bid failed:', error);
      alert('Failed to place bid. Please try again.');
    } finally {
      setProcessing(false);
      setShowBidModal(false);
    }
  };

  const handleList = async () => {
    if (!listPrice || parseFloat(listPrice) <= 0) {
      alert('Please enter a valid price');
      return;
    }

    setProcessing(true);
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
      const response = await api.post(`/api/nft/${nftId}/list`, {
        price: parseFloat(listPrice),
        listingType: listType
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.ok) {
        alert('NFT listed for sale!');
        fetchNFT();
        setListPrice('');
      }
    } catch (error) {
      console.error('List failed:', error);
      alert('Failed to list NFT. Please try again.');
    } finally {
      setProcessing(false);
      setShowListModal(false);
    }
  };

  const handleUnlist = async () => {
    if (!confirm('Remove this NFT from sale?')) return;

    try {
      const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
      const response = await api.post(`/api/nft/${nftId}/unlist`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.ok) {
        alert('NFT removed from sale');
        fetchNFT();
      }
    } catch (error) {
      console.error('Unlist failed:', error);
      alert('Failed to unlist NFT.');
    }
    setShowMenu(false);
  };

  const isOwner = user?._id === nft?.owner?._id;
  const isCreator = user?._id === nft?.creator?._id;

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-12 h-12 text-purple-500 animate-spin" />
        </div>
      </AppLayout>
    );
  }

  if (!nft) {
    return (
      <AppLayout>
        <div className="text-center py-20">
          <AlertCircle className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">NFT not found</h2>
          <Link href="/nft">
            <button className="px-6 py-3 bg-purple-500 text-gray-900 rounded-lg">
              Browse NFTs
            </button>
          </Link>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <Head>
        <title>{nft.name} - CYBEV NFT</title>
      </Head>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-6 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Image */}
          <div>
            <div className="relative rounded-2xl overflow-hidden bg-white">
              <img
                src={nft.image}
                alt={nft.name}
                className="w-full aspect-square object-cover"
              />
              
              {/* Badges */}
              <div className="absolute top-4 left-4 flex gap-2">
                {nft.listingType === 'auction' && nft.isListed && (
                  <span className="px-3 py-1 bg-yellow-500 text-black text-sm font-bold rounded-lg flex items-center gap-1">
                    <Gavel className="w-4 h-4" />
                    AUCTION
                  </span>
                )}
                {nft.hasUnlockable && (
                  <span className="px-3 py-1 bg-purple-500 text-gray-900 text-sm font-bold rounded-lg flex items-center gap-1">
                    <Lock className="w-4 h-4" />
                    UNLOCKABLE
                  </span>
                )}
              </div>

              {/* Actions */}
              <div className="absolute top-4 right-4 flex gap-2">
                <button
                  onClick={handleLike}
                  className="p-3 bg-gray-900/50 backdrop-blur-sm rounded-full hover:bg-gray-900/70 transition-colors"
                >
                  <Heart className={`w-5 h-5 ${liked ? 'text-red-500 fill-red-500' : 'text-white'}`} />
                </button>
                <button
                  onClick={handleShare}
                  className="p-3 bg-gray-900/50 backdrop-blur-sm rounded-full hover:bg-gray-900/70 transition-colors"
                >
                  {copied ? <Check className="w-5 h-5 text-green-400" /> : <Share2 className="w-5 h-5 text-gray-900" />}
                </button>
                {isOwner && (
                  <div className="relative">
                    <button
                      onClick={() => setShowMenu(!showMenu)}
                      className="p-3 bg-gray-900/50 backdrop-blur-sm rounded-full hover:bg-gray-900/70 transition-colors"
                    >
                      <MoreVertical className="w-5 h-5 text-gray-900" />
                    </button>
                    
                    {showMenu && (
                      <div className="absolute right-0 top-full mt-2 bg-white rounded-xl border border-gray-200 overflow-hidden z-10 min-w-[160px]">
                        {nft.isListed ? (
                          <button
                            onClick={handleUnlist}
                            className="w-full px-4 py-3 text-left text-gray-600 hover:bg-gray-100 flex items-center gap-2"
                          >
                            <X className="w-4 h-4" />
                            Remove from sale
                          </button>
                        ) : (
                          <button
                            onClick={() => { setShowListModal(true); setShowMenu(false); }}
                            className="w-full px-4 py-3 text-left text-gray-600 hover:bg-gray-100 flex items-center gap-2"
                          >
                            <Tag className="w-4 h-4" />
                            List for sale
                          </button>
                        )}
                        <Link href={`/nft/${nftId}/edit`}>
                          <button className="w-full px-4 py-3 text-left text-gray-600 hover:bg-gray-100 flex items-center gap-2">
                            <Edit className="w-4 h-4" />
                            Edit
                          </button>
                        </Link>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-6 mt-4 text-gray-500">
              <span className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                {nft.views} views
              </span>
              <span className="flex items-center gap-1">
                <Heart className="w-4 h-4" />
                {likes} likes
              </span>
            </div>
          </div>

          {/* Right: Details */}
          <div className="space-y-6">
            {/* Collection */}
            {nft.collection && (
              <Link href={`/nft/collection/${nft.collection._id}`}>
                <p className="text-purple-600 hover:text-purple-600 flex items-center gap-1">
                  {nft.collection.name}
                  <Verified className="w-4 h-4" />
                </p>
              </Link>
            )}

            {/* Name */}
            <h1 className="text-3xl font-bold text-gray-900">{nft.name}</h1>

            {/* Creator & Owner */}
            <div className="flex gap-6">
              <div>
                <p className="text-gray-500 text-sm mb-1">Creator</p>
                <Link href={`/profile/${nft.creator?.username}`}>
                  <div className="flex items-center gap-2 hover:opacity-80">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-gray-900 text-sm font-bold">
                      {nft.creator?.name?.[0] || 'C'}
                    </div>
                    <span className="text-gray-900">@{nft.creator?.username}</span>
                  </div>
                </Link>
              </div>
              <div>
                <p className="text-gray-500 text-sm mb-1">Owner</p>
                <Link href={`/profile/${nft.owner?.username}`}>
                  <div className="flex items-center gap-2 hover:opacity-80">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-gray-900 text-sm font-bold">
                      {nft.owner?.name?.[0] || 'O'}
                    </div>
                    <span className="text-gray-900">@{nft.owner?.username}</span>
                  </div>
                </Link>
              </div>
            </div>

            {/* Price Card */}
            <div className="bg-white/50 rounded-2xl p-6 border border-gray-200">
              {nft.isListed ? (
                <>
                  <p className="text-gray-500 mb-2">
                    {nft.listingType === 'auction' ? 'Current Bid' : 'Current Price'}
                  </p>
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-3xl font-bold text-gray-900">
                      {nft.listingType === 'auction' ? (nft.highestBid || nft.listingPrice) : nft.listingPrice}
                    </span>
                    <span className="text-gray-500">CYBEV</span>
                  </div>

                  {nft.listingType === 'auction' && nft.auctionEndTime && (
                    <div className="flex items-center gap-2 text-yellow-400 mb-4">
                      <Clock className="w-4 h-4" />
                      <span>Ends {new Date(nft.auctionEndTime).toLocaleString()}</span>
                    </div>
                  )}

                  {!isOwner && (
                    <div className="flex gap-3">
                      {nft.listingType === 'fixed' ? (
                        <button
                          onClick={() => setShowBuyModal(true)}
                          className="flex-1 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-gray-900 rounded-xl font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                        >
                          <Wallet className="w-5 h-5" />
                          Buy Now
                        </button>
                      ) : (
                        <button
                          onClick={() => setShowBidModal(true)}
                          className="flex-1 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-gray-900 rounded-xl font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                        >
                          <Gavel className="w-5 h-5" />
                          Place Bid
                        </button>
                      )}
                    </div>
                  )}

                  {isOwner && (
                    <button
                      onClick={handleUnlist}
                      className="w-full py-4 bg-gray-100 text-gray-900 rounded-xl font-medium hover:bg-gray-600 transition-colors"
                    >
                      Remove from Sale
                    </button>
                  )}
                </>
              ) : (
                <>
                  <p className="text-gray-500 mb-4">Not listed for sale</p>
                  {isOwner && (
                    <button
                      onClick={() => setShowListModal(true)}
                      className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-gray-900 rounded-xl font-bold hover:opacity-90 transition-opacity"
                    >
                      List for Sale
                    </button>
                  )}
                </>
              )}
            </div>

            {/* Description */}
            <div>
              <h3 className="text-gray-900 font-medium mb-2">Description</h3>
              <p className="text-gray-500">{nft.description || 'No description provided.'}</p>
            </div>

            {/* Attributes */}
            {nft.attributes?.length > 0 && (
              <div>
                <h3 className="text-gray-900 font-medium mb-3">Properties</h3>
                <div className="grid grid-cols-3 gap-3">
                  {nft.attributes.map((attr, i) => (
                    <div key={i} className="bg-purple-500/10 border border-gray-200 rounded-xl p-3 text-center">
                      <p className="text-purple-600 text-xs uppercase">{attr.trait_type}</p>
                      <p className="text-gray-900 font-medium truncate">{attr.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Details */}
            <div>
              <h3 className="text-gray-900 font-medium mb-3">Details</h3>
              <div className="bg-white/50 rounded-xl p-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-500">Contract</span>
                  <a
                    href={`https://polygonscan.com/address/${nft.contractAddress}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-600 hover:text-purple-600 flex items-center gap-1"
                  >
                    {nft.contractAddress?.slice(0, 6)}...{nft.contractAddress?.slice(-4)}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Token ID</span>
                  <span className="text-gray-900">{nft.tokenId || 'Pending'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Chain</span>
                  <span className="text-gray-900">Polygon</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Royalties</span>
                  <span className="text-gray-900">{nft.royaltyPercentage}%</span>
                </div>
              </div>
            </div>

            {/* History */}
            <div>
              <h3 className="text-gray-900 font-medium mb-3 flex items-center gap-2">
                <History className="w-5 h-5 text-purple-600" />
                Activity
              </h3>
              <div className="bg-white/50 rounded-xl p-4">
                {nft.history?.length > 0 ? (
                  nft.history.map((event, i) => (
                    <HistoryItem key={i} event={event} />
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4">No activity yet</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Buy Modal */}
      {showBuyModal && (
        <div className="fixed inset-0 bg-gray-900/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-50 rounded-2xl p-6 max-w-md w-full border border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Confirm Purchase</h2>
            
            <div className="flex items-center gap-4 mb-6">
              <img src={nft.image} alt={nft.name} className="w-20 h-20 rounded-xl object-cover" />
              <div>
                <h3 className="text-gray-900 font-medium">{nft.name}</h3>
                <p className="text-gray-500">@{nft.creator?.username}</p>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 mb-6">
              <div className="flex justify-between mb-2">
                <span className="text-gray-500">Price</span>
                <span className="text-gray-900">{nft.listingPrice} CYBEV</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-500">Platform Fee (2.5%)</span>
                <span className="text-gray-900">{(nft.listingPrice * 0.025).toFixed(2)} CYBEV</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-gray-200">
                <span className="text-gray-900 font-medium">Total</span>
                <span className="text-gray-900 font-bold">{(nft.listingPrice * 1.025).toFixed(2)} CYBEV</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowBuyModal(false)}
                className="flex-1 py-3 bg-gray-100 text-gray-900 rounded-xl hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleBuy}
                disabled={processing}
                className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-gray-900 rounded-xl font-medium hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {processing ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Confirm Purchase'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bid Modal */}
      {showBidModal && (
        <div className="fixed inset-0 bg-gray-900/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-50 rounded-2xl p-6 max-w-md w-full border border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Place a Bid</h2>
            
            <p className="text-gray-500 mb-4">
              Current highest bid: <span className="text-gray-900 font-bold">{nft.highestBid || nft.listingPrice} CYBEV</span>
            </p>

            <div className="mb-6">
              <label className="block text-gray-500 mb-2">Your Bid</label>
              <div className="relative">
                <input
                  type="number"
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  placeholder="0"
                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 pr-20 text-gray-900 focus:border-purple-500 focus:outline-none"
                />
                <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500">CYBEV</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowBidModal(false)}
                className="flex-1 py-3 bg-gray-100 text-gray-900 rounded-xl hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleBid}
                disabled={processing}
                className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-gray-900 rounded-xl font-medium hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {processing ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Place Bid'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* List Modal */}
      {showListModal && (
        <div className="fixed inset-0 bg-gray-900/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-50 rounded-2xl p-6 max-w-md w-full border border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-4">List for Sale</h2>
            
            <div className="mb-4">
              <label className="block text-gray-500 mb-2">Sale Type</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setListType('fixed')}
                  className={`p-3 rounded-xl border transition-colors ${
                    listType === 'fixed' ? 'border-purple-500 bg-purple-500/20' : 'border-gray-200'
                  }`}
                >
                  <p className="text-gray-900 font-medium">Fixed Price</p>
                </button>
                <button
                  onClick={() => setListType('auction')}
                  className={`p-3 rounded-xl border transition-colors ${
                    listType === 'auction' ? 'border-purple-500 bg-purple-500/20' : 'border-gray-200'
                  }`}
                >
                  <p className="text-gray-900 font-medium">Auction</p>
                </button>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-gray-500 mb-2">
                {listType === 'fixed' ? 'Price' : 'Starting Price'}
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={listPrice}
                  onChange={(e) => setListPrice(e.target.value)}
                  placeholder="0"
                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 pr-20 text-gray-900 focus:border-purple-500 focus:outline-none"
                />
                <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500">CYBEV</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowListModal(false)}
                className="flex-1 py-3 bg-gray-100 text-gray-900 rounded-xl hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleList}
                disabled={processing}
                className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-gray-900 rounded-xl font-medium hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {processing ? <Loader2 className="w-5 h-5 animate-spin" /> : 'List NFT'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
