// ============================================
// FILE: src/pages/marketplace.jsx
// Marketplace - Buy/Sell Products
// ============================================

import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { 
  ArrowLeft, Search, Plus, Filter, Grid, List,
  Heart, ShoppingCart, MapPin, Tag, Star, Share2,
  MoreVertical, Loader2, Package, Store, DollarSign
} from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'react-toastify';

export default function MarketplacePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [savedProducts, setSavedProducts] = useState([]);

  const categories = ['All', 'Electronics', 'Fashion', 'Home', 'Services', 'Digital', 'Books', 'Sports', 'Other'];

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    fetchProducts();
  }, [activeCategory]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = activeCategory !== 'All' ? `?category=${activeCategory}` : '';
      const response = await api.get(`/api/marketplace/products${params}`);
      if (response.data?.products) {
        setProducts(response.data.products);
      }
    } catch (error) {
      console.log('Using demo products');
      // Demo products
      setProducts([
        {
          _id: 'p1',
          title: 'iPhone 15 Pro Max',
          description: 'Brand new, sealed in box',
          price: 1200,
          currency: 'USD',
          images: [],
          category: 'Electronics',
          seller: { _id: 's1', name: 'TechStore', username: 'techstore', profilePicture: null, verified: true },
          location: 'Lagos, Nigeria',
          condition: 'New',
          rating: 4.8,
          reviews: 24,
          saved: false
        },
        {
          _id: 'p2',
          title: 'Designer Sneakers',
          description: 'Limited edition, size 42',
          price: 350,
          currency: 'USD',
          images: [],
          category: 'Fashion',
          seller: { _id: 's2', name: 'Fashion Hub', username: 'fashionhub', profilePicture: null },
          location: 'Accra, Ghana',
          condition: 'New',
          rating: 4.5,
          reviews: 12,
          saved: true
        },
        {
          _id: 'p3',
          title: 'Web Development Course',
          description: 'Full stack React & Node.js',
          price: 49,
          currency: 'USD',
          images: [],
          category: 'Digital',
          seller: { _id: 's3', name: 'CodeMaster', username: 'codemaster', profilePicture: null, verified: true },
          location: 'Online',
          condition: 'Digital',
          rating: 4.9,
          reviews: 156,
          saved: false
        },
        {
          _id: 'p4',
          title: 'Smart Home Speaker',
          description: 'Voice assistant enabled',
          price: 89,
          currency: 'USD',
          images: [],
          category: 'Electronics',
          seller: { _id: 's4', name: 'GadgetWorld', username: 'gadgetworld', profilePicture: null },
          location: 'Nairobi, Kenya',
          condition: 'New',
          rating: 4.3,
          reviews: 45,
          saved: false
        }
      ]);
    }
    setLoading(false);
  };

  const toggleSaveProduct = async (productId) => {
    if (!user) {
      toast.info('Please login to save products');
      router.push('/login');
      return;
    }

    try {
      const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
      await api.post(`/api/marketplace/products/${productId}/save`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setProducts(prev => prev.map(p => 
        p._id === productId ? { ...p, saved: !p.saved } : p
      ));
      
      toast.success('Product saved!');
    } catch (error) {
      // Demo mode - just toggle locally
      setProducts(prev => prev.map(p => 
        p._id === productId ? { ...p, saved: !p.saved } : p
      ));
    }
  };

  const filteredProducts = products.filter(p => 
    p.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatPrice = (price, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(price);
  };

  return (
    <>
      <Head>
        <title>Marketplace | CYBEV</title>
      </Head>

      <div className="min-h-screen bg-white">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-white border-b border-gray-200 px-4 py-3">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/feed">
                <button className="p-2 hover:bg-gray-100 rounded-full">
                  <ArrowLeft className="w-5 h-5 text-gray-700" />
                </button>
              </Link>
              <div className="flex items-center gap-2">
                <Store className="w-6 h-6 text-purple-600" />
                <span className="font-bold text-xl text-gray-900">Marketplace</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Link href="/marketplace/saved">
                <button className="p-2 hover:bg-gray-100 rounded-full relative">
                  <Heart className="w-5 h-5 text-gray-600" />
                </button>
              </Link>
              <Link href="/marketplace/sell">
                <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-gray-900 font-semibold rounded-lg hover:bg-purple-700">
                  <Plus className="w-4 h-4" />
                  Sell
                </button>
              </Link>
            </div>
          </div>
        </header>

        {/* Search */}
        <div className="bg-white border-b border-gray-100 px-4 py-3">
          <div className="max-w-6xl mx-auto">
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search marketplace..."
                  className="w-full pl-10 pr-4 py-3 bg-gray-100 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-300"
                />
              </div>
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className="px-4 py-2 border border-gray-300 rounded-lg flex items-center gap-2 text-gray-700 hover:bg-gray-50"
              >
                <Filter className="w-4 h-4" />
                Filters
              </button>
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="bg-white border-b border-gray-100 px-4 py-3 overflow-x-auto">
          <div className="max-w-6xl mx-auto flex gap-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition ${
                  activeCategory === cat
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* View Toggle */}
        <div className="bg-white px-4 py-3 border-b border-gray-100">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <p className="text-gray-600 text-sm">{filteredProducts.length} products</p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-purple-100 text-purple-600' : 'text-gray-500 hover:bg-gray-100'}`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${viewMode === 'list' ? 'bg-purple-100 text-purple-600' : 'text-gray-500 hover:bg-gray-100'}`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <main className="max-w-6xl mx-auto px-4 py-6 pb-24">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-20">
              <Package className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-500 mb-6">Try a different search or category</p>
              <Link href="/marketplace/sell">
                <button className="px-6 py-3 bg-purple-600 text-gray-900 font-semibold rounded-lg hover:bg-purple-700">
                  Sell Something
                </button>
              </Link>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredProducts.map(product => (
                <ProductCard 
                  key={product._id} 
                  product={product} 
                  onSave={() => toggleSaveProduct(product._id)}
                  formatPrice={formatPrice}
                />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredProducts.map(product => (
                <ProductListItem 
                  key={product._id} 
                  product={product} 
                  onSave={() => toggleSaveProduct(product._id)}
                  formatPrice={formatPrice}
                />
              ))}
            </div>
          )}
        </main>

        {/* Bottom Navigation */}
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 flex items-center justify-around z-50">
          <Link href="/feed">
            <button className="flex flex-col items-center py-2 px-4 text-gray-500">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span className="text-xs mt-1 text-gray-600">Feed</span>
            </button>
          </Link>
          
          <Link href="/groups">
            <button className="flex flex-col items-center py-2 px-4 text-gray-500">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span className="text-xs mt-1 text-gray-600">Groups</span>
            </button>
          </Link>
          
          <Link href="/create">
            <button className="relative -mt-6">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
                <Plus className="w-7 h-7 text-gray-900" />
              </div>
            </button>
          </Link>
          
          <button className="flex flex-col items-center py-2 px-4 text-purple-600">
            <Store className="w-6 h-6" />
            <span className="text-xs mt-1 font-medium">Shop</span>
          </button>
          
          <Link href="/menu">
            <button className="flex flex-col items-center py-2 px-4 text-gray-500">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <span className="text-xs mt-1 text-gray-600">Menu</span>
            </button>
          </Link>
        </nav>
      </div>
    </>
  );
}

// Product Card Component
function ProductCard({ product, onSave, formatPrice }) {
  const router = useRouter();
  
  return (
    <div 
      className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition cursor-pointer"
      onClick={() => router.push(`/marketplace/${product._id}`)}
    >
      {/* Image */}
      <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 relative">
        {product.images?.[0] ? (
          <img src={product.images[0]} alt="" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package className="w-12 h-12 text-gray-500" />
          </div>
        )}
        
        {/* Save Button */}
        <button
          onClick={(e) => { e.stopPropagation(); onSave(); }}
          className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-sm hover:bg-gray-50"
        >
          <Heart className={`w-5 h-5 ${product.saved ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
        </button>
        
        {/* Condition Badge */}
        {product.condition && (
          <div className="absolute bottom-2 left-2 px-2 py-1 bg-white/90 rounded text-xs font-medium text-gray-700">
            {product.condition}
          </div>
        )}
      </div>
      
      {/* Info */}
      <div className="p-3">
        <h3 className="font-semibold text-gray-900 line-clamp-1">{product.title}</h3>
        <p className="text-lg font-bold text-purple-600 mt-1">{formatPrice(product.price, product.currency)}</p>
        
        <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
          <MapPin className="w-3 h-3" />
          <span className="truncate">{product.location}</span>
        </div>
        
        {product.rating && (
          <div className="flex items-center gap-1 mt-2">
            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            <span className="text-xs text-gray-600">{product.rating} ({product.reviews})</span>
          </div>
        )}
      </div>
    </div>
  );
}

// Product List Item Component
function ProductListItem({ product, onSave, formatPrice }) {
  const router = useRouter();
  
  return (
    <div 
      className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition cursor-pointer flex gap-4"
      onClick={() => router.push(`/marketplace/${product._id}`)}
    >
      {/* Image */}
      <div className="w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex-shrink-0 overflow-hidden">
        {product.images?.[0] ? (
          <img src={product.images[0]} alt="" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package className="w-8 h-8 text-gray-500" />
          </div>
        )}
      </div>
      
      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold text-gray-900">{product.title}</h3>
            <p className="text-lg font-bold text-purple-600">{formatPrice(product.price, product.currency)}</p>
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); onSave(); }}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <Heart className={`w-5 h-5 ${product.saved ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
          </button>
        </div>
        
        <p className="text-gray-500 text-sm mt-1 line-clamp-2">{product.description}</p>
        
        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            {product.location}
          </span>
          <span className="flex items-center gap-1">
            <Tag className="w-3 h-3" />
            {product.condition}
          </span>
          {product.rating && (
            <span className="flex items-center gap-1">
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              {product.rating}
            </span>
          )}
        </div>
        
        {/* Seller */}
        <div className="flex items-center gap-2 mt-3">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center overflow-hidden">
            {product.seller?.profilePicture ? (
              <img src={product.seller.profilePicture} alt="" className="w-full h-full object-cover" />
            ) : (
              <span className="text-gray-900 text-xs font-bold">{product.seller?.name?.[0]}</span>
            )}
          </div>
          <span className="text-gray-600 text-sm">{product.seller?.name}</span>
          {product.seller?.verified && (
            <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          )}
        </div>
      </div>
    </div>
  );
}
