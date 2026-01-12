// ============================================
// FILE: src/pages/nft/create.jsx
// PATH: cybev-frontend/src/pages/nft/create.jsx
// PURPOSE: Create and mint new NFTs
// ============================================

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import AppLayout from '@/components/Layout/AppLayout';
import {
  Upload,
  Image as ImageIcon,
  Music,
  Video,
  X,
  Plus,
  Sparkles,
  Tag,
  DollarSign,
  Lock,
  Globe,
  ChevronLeft,
  Check,
  Loader2,
  Info,
  Percent,
  Clock,
  Layers,
  ExternalLink
} from 'lucide-react';
import api from '@/lib/api';

// Attribute input component
function AttributeInput({ attribute, onChange, onRemove }) {
  return (
    <div className="flex gap-2 items-center">
      <input
        type="text"
        placeholder="Property"
        value={attribute.trait_type}
        onChange={(e) => onChange({ ...attribute, trait_type: e.target.value })}
        className="flex-1 bg-gray-700 border border-gray-300 rounded-lg px-3 py-2 text-gray-900 text-sm focus:border-purple-500 focus:outline-none"
      />
      <input
        type="text"
        placeholder="Value"
        value={attribute.value}
        onChange={(e) => onChange({ ...attribute, value: e.target.value })}
        className="flex-1 bg-gray-700 border border-gray-300 rounded-lg px-3 py-2 text-gray-900 text-sm focus:border-purple-500 focus:outline-none"
      />
      <button
        onClick={onRemove}
        className="p-2 text-gray-500 hover:text-red-400 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

export default function CreateNFT() {
  const router = useRouter();
  const fileInputRef = useRef(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [step, setStep] = useState(1); // 1: Upload, 2: Details, 3: Pricing, 4: Review
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: null,
    imagePreview: null,
    category: 'art',
    attributes: [],
    collection: '',
    royaltyPercentage: 10,
    isListed: false,
    listingPrice: '',
    listingType: 'fixed',
    auctionDuration: 24, // hours
    hasUnlockable: false,
    unlockableContent: '',
    externalUrl: ''
  });

  const [collections, setCollections] = useState([]);
  const [errors, setErrors] = useState({});

  const CATEGORIES = [
    { id: 'art', label: 'Art', icon: ImageIcon },
    { id: 'music', label: 'Music', icon: Music },
    { id: 'video', label: 'Video', icon: Video },
    { id: 'photography', label: 'Photography', icon: ImageIcon },
    { id: 'gaming', label: 'Gaming', icon: Sparkles },
    { id: 'collectible', label: 'Collectible', icon: Layers }
  ];

  useEffect(() => {
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

    fetchCollections();
  }, [router]);

  const fetchCollections = async () => {
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
      const response = await api.get('/api/nft/collections/all', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.ok) {
        setCollections(response.data.collections.filter(c => c.creator._id === user?._id));
      }
    } catch (error) {
      console.log('No collections found');
    }
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'audio/mpeg', 'audio/wav'];
    if (!validTypes.includes(file.type)) {
      setErrors({ ...errors, file: 'Invalid file type. Supported: JPG, PNG, GIF, WEBP, MP4, MP3, WAV' });
      return;
    }

    // Validate file size (max 100MB)
    if (file.size > 100 * 1024 * 1024) {
      setErrors({ ...errors, file: 'File too large. Maximum size is 100MB' });
      return;
    }

    setUploading(true);
    setErrors({ ...errors, file: null });

    try {
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData(prev => ({
          ...prev,
          imagePreview: e.target.result
        }));
      };
      reader.readAsDataURL(file);

      // Upload to server/cloudinary
      const uploadData = new FormData();
      uploadData.append('file', file);

      const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
      const response = await api.post('/api/upload', uploadData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.ok || response.data.url) {
        setFormData(prev => ({
          ...prev,
          image: response.data.url || response.data.secure_url
        }));
      }
    } catch (error) {
      console.error('Upload failed:', error);
      // For demo, use the preview as image
      setFormData(prev => ({
        ...prev,
        image: prev.imagePreview
      }));
    } finally {
      setUploading(false);
    }
  };

  const addAttribute = () => {
    setFormData(prev => ({
      ...prev,
      attributes: [...prev.attributes, { trait_type: '', value: '' }]
    }));
  };

  const updateAttribute = (index, attr) => {
    setFormData(prev => ({
      ...prev,
      attributes: prev.attributes.map((a, i) => i === index ? attr : a)
    }));
  };

  const removeAttribute = (index) => {
    setFormData(prev => ({
      ...prev,
      attributes: prev.attributes.filter((_, i) => i !== index)
    }));
  };

  const validateStep = (stepNum) => {
    const newErrors = {};

    if (stepNum >= 1) {
      if (!formData.image && !formData.imagePreview) {
        newErrors.file = 'Please upload a file';
      }
    }

    if (stepNum >= 2) {
      if (!formData.name.trim()) {
        newErrors.name = 'Name is required';
      }
    }

    if (stepNum >= 3 && formData.isListed) {
      if (!formData.listingPrice || parseFloat(formData.listingPrice) <= 0) {
        newErrors.price = 'Please enter a valid price';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const handleSubmit = async () => {
    if (!validateStep(3)) return;

    setLoading(true);

    try {
      const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
      
      const nftData = {
        name: formData.name,
        description: formData.description,
        image: formData.image || formData.imagePreview,
        category: formData.category,
        attributes: formData.attributes.filter(a => a.trait_type && a.value),
        collection: formData.collection || null,
        royaltyPercentage: formData.royaltyPercentage,
        isListed: formData.isListed,
        listingPrice: formData.isListed ? parseFloat(formData.listingPrice) : 0,
        listingType: formData.listingType,
        auctionEndTime: formData.listingType === 'auction' 
          ? new Date(Date.now() + formData.auctionDuration * 60 * 60 * 1000)
          : null,
        hasUnlockable: formData.hasUnlockable,
        unlockableContent: formData.unlockableContent,
        externalUrl: formData.externalUrl
      };

      const response = await api.post('/api/nft', nftData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.ok) {
        // In production, trigger blockchain minting here
        // await mintOnBlockchain(response.data.nft);
        
        alert('NFT created successfully!');
        router.push(`/nft/${response.data.nft._id}`);
      }
    } catch (error) {
      console.error('Create NFT error:', error);
      alert('Failed to create NFT. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <Head>
        <title>Create NFT - CYBEV</title>
      </Head>

      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-white rounded-lg transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-gray-500" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Create NFT</h1>
            <p className="text-gray-500">Mint your unique digital asset on Polygon</p>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-8">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors ${
                step >= s ? 'bg-purple-500 text-white' : 'bg-gray-700 text-gray-500'
              }`}>
                {step > s ? <Check className="w-5 h-5" /> : s}
              </div>
              {s < 4 && (
                <div className={`w-16 md:w-24 h-1 mx-2 ${step > s ? 'bg-purple-500' : 'bg-gray-700'}`} />
              )}
            </div>
          ))}
        </div>

        {/* Step Labels */}
        <div className="flex justify-between text-sm text-gray-500 mb-8">
          <span className={step === 1 ? 'text-purple-600' : ''}>Upload</span>
          <span className={step === 2 ? 'text-purple-600' : ''}>Details</span>
          <span className={step === 3 ? 'text-purple-600' : ''}>Pricing</span>
          <span className={step === 4 ? 'text-purple-600' : ''}>Review</span>
        </div>

        {/* Step 1: Upload */}
        {step === 1 && (
          <div className="space-y-6">
            <div
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-colors ${
                formData.imagePreview 
                  ? 'border-purple-500 bg-purple-500/10' 
                  : 'border-gray-300 hover:border-purple-500 hover:bg-purple-500/5'
              } ${errors.file ? 'border-red-500' : ''}`}
            >
              {uploading ? (
                <div className="flex flex-col items-center">
                  <Loader2 className="w-16 h-16 text-purple-600 animate-spin mb-4" />
                  <p className="text-gray-600">Uploading...</p>
                </div>
              ) : formData.imagePreview ? (
                <div className="relative">
                  <img
                    src={formData.imagePreview}
                    alt="Preview"
                    className="max-h-64 mx-auto rounded-xl"
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setFormData({ ...formData, image: null, imagePreview: null });
                    }}
                    className="absolute top-2 right-2 p-2 bg-gray-900/50 rounded-full hover:bg-gray-900/70"
                  >
                    <X className="w-4 h-4 text-gray-900" />
                  </button>
                </div>
              ) : (
                <>
                  <Upload className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-900 text-lg mb-2">Upload your file</p>
                  <p className="text-gray-500 text-sm">
                    Drag and drop or click to browse
                  </p>
                  <p className="text-gray-500 text-xs mt-2">
                    JPG, PNG, GIF, WEBP, MP4, MP3, WAV. Max 100MB.
                  </p>
                </>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,video/mp4,audio/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>

            {errors.file && (
              <p className="text-red-400 text-sm">{errors.file}</p>
            )}

            <button
              onClick={nextStep}
              disabled={!formData.imagePreview}
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-gray-900 rounded-xl font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              Continue
            </button>
          </div>
        )}

        {/* Step 2: Details */}
        {step === 2 && (
          <div className="space-y-6">
            {/* Preview Thumbnail */}
            {formData.imagePreview && (
              <div className="w-24 h-24 rounded-xl overflow-hidden">
                <img src={formData.imagePreview} alt="Preview" className="w-full h-full object-cover" />
              </div>
            )}

            {/* Name */}
            <div>
              <label className="block text-gray-900 font-medium mb-2">Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Cosmic Dream #001"
                className={`w-full bg-white border rounded-xl px-4 py-3 text-gray-900 focus:border-purple-500 focus:outline-none ${
                  errors.name ? 'border-red-500' : 'border-gray-200'
                }`}
              />
              {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
            </div>

            {/* Description */}
            <div>
              <label className="block text-gray-900 font-medium mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Tell the story behind your creation..."
                rows={4}
                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:border-purple-500 focus:outline-none resize-none"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-gray-900 font-medium mb-2">Category</label>
              <div className="grid grid-cols-3 gap-3">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setFormData({ ...formData, category: cat.id })}
                    className={`p-3 rounded-xl border transition-colors flex flex-col items-center gap-2 ${
                      formData.category === cat.id
                        ? 'border-purple-500 bg-purple-500/20 text-white'
                        : 'border-gray-200 text-gray-500 hover:border-gray-300'
                    }`}
                  >
                    <cat.icon className="w-5 h-5" />
                    <span className="text-sm">{cat.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Attributes */}
            <div>
              <label className="block text-gray-900 font-medium mb-2">
                Properties
                <span className="text-gray-500 text-sm font-normal ml-2">(Optional)</span>
              </label>
              <div className="space-y-2">
                {formData.attributes.map((attr, index) => (
                  <AttributeInput
                    key={index}
                    attribute={attr}
                    onChange={(updated) => updateAttribute(index, updated)}
                    onRemove={() => removeAttribute(index)}
                  />
                ))}
                <button
                  onClick={addAttribute}
                  className="flex items-center gap-2 text-purple-600 hover:text-purple-600 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add Property
                </button>
              </div>
            </div>

            {/* External Link */}
            <div>
              <label className="block text-gray-900 font-medium mb-2">
                External Link
                <span className="text-gray-500 text-sm font-normal ml-2">(Optional)</span>
              </label>
              <input
                type="url"
                value={formData.externalUrl}
                onChange={(e) => setFormData({ ...formData, externalUrl: e.target.value })}
                placeholder="https://yourwebsite.com/item"
                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:border-purple-500 focus:outline-none"
              />
            </div>

            {/* Navigation */}
            <div className="flex gap-4">
              <button
                onClick={prevStep}
                className="flex-1 py-4 bg-gray-100 text-gray-900 rounded-xl font-medium hover:bg-gray-600 transition-colors"
              >
                Back
              </button>
              <button
                onClick={nextStep}
                className="flex-1 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-gray-900 rounded-xl font-medium hover:opacity-90 transition-opacity"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Pricing */}
        {step === 3 && (
          <div className="space-y-6">
            {/* List for Sale */}
            <div className="bg-white/50 rounded-xl p-4 border border-gray-200">
              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <p className="text-gray-900 font-medium">List for Sale</p>
                  <p className="text-gray-500 text-sm">Put this NFT up for sale immediately</p>
                </div>
                <div
                  onClick={() => setFormData({ ...formData, isListed: !formData.isListed })}
                  className={`w-14 h-7 rounded-full transition-colors cursor-pointer ${
                    formData.isListed ? 'bg-purple-500' : 'bg-gray-600'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full bg-white mt-0.5 transition-transform ${
                    formData.isListed ? 'translate-x-7' : 'translate-x-0.5'
                  }`} />
                </div>
              </label>
            </div>

            {formData.isListed && (
              <>
                {/* Listing Type */}
                <div>
                  <label className="block text-gray-900 font-medium mb-2">Sale Type</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setFormData({ ...formData, listingType: 'fixed' })}
                      className={`p-4 rounded-xl border transition-colors ${
                        formData.listingType === 'fixed'
                          ? 'border-purple-500 bg-purple-500/20'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <DollarSign className={`w-6 h-6 mx-auto mb-2 ${
                        formData.listingType === 'fixed' ? 'text-purple-600' : 'text-gray-500'
                      }`} />
                      <p className="text-gray-900 font-medium">Fixed Price</p>
                      <p className="text-gray-500 text-xs">Sell at a set price</p>
                    </button>
                    <button
                      onClick={() => setFormData({ ...formData, listingType: 'auction' })}
                      className={`p-4 rounded-xl border transition-colors ${
                        formData.listingType === 'auction'
                          ? 'border-purple-500 bg-purple-500/20'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <Clock className={`w-6 h-6 mx-auto mb-2 ${
                        formData.listingType === 'auction' ? 'text-purple-600' : 'text-gray-500'
                      }`} />
                      <p className="text-gray-900 font-medium">Timed Auction</p>
                      <p className="text-gray-500 text-xs">Auction to highest bidder</p>
                    </button>
                  </div>
                </div>

                {/* Price */}
                <div>
                  <label className="block text-gray-900 font-medium mb-2">
                    {formData.listingType === 'fixed' ? 'Price' : 'Starting Price'}
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={formData.listingPrice}
                      onChange={(e) => setFormData({ ...formData, listingPrice: e.target.value })}
                      placeholder="0"
                      className={`w-full bg-white border rounded-xl px-4 py-3 pr-20 text-gray-900 focus:border-purple-500 focus:outline-none ${
                        errors.price ? 'border-red-500' : 'border-gray-200'
                      }`}
                    />
                    <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500">
                      CYBEV
                    </span>
                  </div>
                  {errors.price && <p className="text-red-400 text-sm mt-1">{errors.price}</p>}
                </div>

                {/* Auction Duration */}
                {formData.listingType === 'auction' && (
                  <div>
                    <label className="block text-gray-900 font-medium mb-2">Auction Duration</label>
                    <select
                      value={formData.auctionDuration}
                      onChange={(e) => setFormData({ ...formData, auctionDuration: parseInt(e.target.value) })}
                      className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:border-purple-500 focus:outline-none"
                    >
                      <option value={6}>6 hours</option>
                      <option value={12}>12 hours</option>
                      <option value={24}>24 hours</option>
                      <option value={48}>2 days</option>
                      <option value={72}>3 days</option>
                      <option value={168}>7 days</option>
                    </select>
                  </div>
                )}
              </>
            )}

            {/* Royalties */}
            <div>
              <label className="block text-gray-900 font-medium mb-2 flex items-center gap-2">
                <Percent className="w-4 h-4 text-purple-600" />
                Creator Royalties
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  max="50"
                  value={formData.royaltyPercentage}
                  onChange={(e) => setFormData({ ...formData, royaltyPercentage: Math.min(50, parseInt(e.target.value) || 0) })}
                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 pr-12 text-gray-900 focus:border-purple-500 focus:outline-none"
                />
                <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500">%</span>
              </div>
              <p className="text-gray-500 text-sm mt-1">
                You'll receive {formData.royaltyPercentage}% on secondary sales (max 50%)
              </p>
            </div>

            {/* Unlockable Content */}
            <div className="bg-white/50 rounded-xl p-4 border border-gray-200">
              <label className="flex items-center justify-between cursor-pointer mb-4">
                <div className="flex items-center gap-3">
                  <Lock className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="text-gray-900 font-medium">Unlockable Content</p>
                    <p className="text-gray-500 text-sm">Include content only visible to the owner</p>
                  </div>
                </div>
                <div
                  onClick={() => setFormData({ ...formData, hasUnlockable: !formData.hasUnlockable })}
                  className={`w-14 h-7 rounded-full transition-colors cursor-pointer ${
                    formData.hasUnlockable ? 'bg-purple-500' : 'bg-gray-600'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full bg-white mt-0.5 transition-transform ${
                    formData.hasUnlockable ? 'translate-x-7' : 'translate-x-0.5'
                  }`} />
                </div>
              </label>

              {formData.hasUnlockable && (
                <textarea
                  value={formData.unlockableContent}
                  onChange={(e) => setFormData({ ...formData, unlockableContent: e.target.value })}
                  placeholder="Enter exclusive content, links, access codes, etc."
                  rows={3}
                  className="w-full bg-gray-700 border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:border-purple-500 focus:outline-none resize-none"
                />
              )}
            </div>

            {/* Navigation */}
            <div className="flex gap-4">
              <button
                onClick={prevStep}
                className="flex-1 py-4 bg-gray-100 text-gray-900 rounded-xl font-medium hover:bg-gray-600 transition-colors"
              >
                Back
              </button>
              <button
                onClick={nextStep}
                className="flex-1 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-gray-900 rounded-xl font-medium hover:opacity-90 transition-opacity"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Review */}
        {step === 4 && (
          <div className="space-y-6">
            <div className="bg-white/50 rounded-2xl p-6 border border-gray-200">
              <div className="flex gap-6">
                {/* Preview */}
                <div className="w-40 h-40 rounded-xl overflow-hidden flex-shrink-0">
                  {formData.imagePreview && (
                    <img src={formData.imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  )}
                </div>

                {/* Details */}
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{formData.name || 'Untitled'}</h2>
                  <p className="text-gray-500 mb-4">{formData.description || 'No description'}</p>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-500 text-sm">Category</p>
                      <p className="text-gray-900 capitalize">{formData.category}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm">Royalties</p>
                      <p className="text-gray-900">{formData.royaltyPercentage}%</p>
                    </div>
                    {formData.isListed && (
                      <>
                        <div>
                          <p className="text-gray-500 text-sm">Sale Type</p>
                          <p className="text-gray-900 capitalize">{formData.listingType}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-sm">Price</p>
                          <p className="text-gray-900 font-bold">{formData.listingPrice} CYBEV</p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Attributes */}
              {formData.attributes.filter(a => a.trait_type && a.value).length > 0 && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <p className="text-gray-500 text-sm mb-3">Properties</p>
                  <div className="flex flex-wrap gap-2">
                    {formData.attributes.filter(a => a.trait_type && a.value).map((attr, i) => (
                      <div key={i} className="bg-purple-500/20 rounded-lg px-3 py-2">
                        <p className="text-purple-600 text-xs">{attr.trait_type}</p>
                        <p className="text-gray-900 font-medium">{attr.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Unlockable */}
              {formData.hasUnlockable && (
                <div className="mt-6 pt-6 border-t border-gray-200 flex items-center gap-2 text-purple-600">
                  <Lock className="w-4 h-4" />
                  <span>Includes unlockable content</span>
                </div>
              )}
            </div>

            {/* Fees Notice */}
            <div className="bg-white/50 rounded-xl p-4 border border-gray-200">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-gray-500 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-gray-500">
                  <p className="mb-2">By minting this NFT, you agree to:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Pay network gas fees (Polygon MATIC)</li>
                    <li>CYBEV platform fee: 2.5% on sales</li>
                    <li>Confirm you own the rights to this content</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex gap-4">
              <button
                onClick={prevStep}
                className="flex-1 py-4 bg-gray-100 text-gray-900 rounded-xl font-medium hover:bg-gray-600 transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-gray-900 rounded-xl font-medium hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Create NFT
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
