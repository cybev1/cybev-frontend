// ============================================
// FILE: src/pages/nft/create.jsx
// CYBEV NFT Create - CLEAN WHITE DESIGN
// VERSION: 7.1.0 - Solid white, black text, readable
// ============================================

import { useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { useDropzone } from 'react-dropzone';
import AppLayout from '@/components/Layout/AppLayout';
import { toast } from 'react-toastify';
import api from '@/lib/api';
import {
  Upload, ArrowLeft, ArrowRight, Loader2, Check, Image as ImageIcon,
  FileText, Tag, DollarSign, Settings, Eye, Sparkles, X, AlertCircle
} from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.cybev.io';

const CATEGORIES = [
  'Art', 'Music', 'Video', 'Photography', 'Collectibles',
  'Gaming', 'Sports', 'Memes', 'Domain Names', 'Virtual Worlds'
];

export default function CreateNFTPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    royalty: 10,
    properties: [],
    unlockableContent: '',
    isExplicit: false
  });

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      setUploadedFile(file);
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
      'video/*': ['.mp4', '.webm'],
      'audio/*': ['.mp3', '.wav']
    },
    maxSize: 100 * 1024 * 1024, // 100MB
    multiple: false
  });

  const removeFile = () => {
    setUploadedFile(null);
    setPreview(null);
  };

  const handleMint = async () => {
    if (!uploadedFile) {
      toast.error('Please upload a file');
      return;
    }
    if (!formData.name.trim()) {
      toast.error('Please enter a name');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login to mint NFT');
        router.push('/auth/login');
        return;
      }

      // Upload file first
      const fileFormData = new FormData();
      fileFormData.append('file', uploadedFile);

      const uploadRes = await api.post('/api/upload', fileFormData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      if (!uploadRes.data.url) {
        throw new Error('File upload failed');
      }

      // Create NFT
      const nftRes = await api.post('/api/nfts', {
        name: formData.name,
        description: formData.description,
        category: formData.category,
        price: parseFloat(formData.price) || 0,
        royalty: formData.royalty,
        image: uploadRes.data.url,
        properties: formData.properties,
        unlockableContent: formData.unlockableContent,
        isExplicit: formData.isExplicit
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (nftRes.data.ok || nftRes.data.success || nftRes.data.nft) {
        toast.success('NFT created successfully!');
        router.push(`/nft/${nftRes.data.nft?._id || nftRes.data._id}`);
      }
    } catch (err) {
      console.error('Mint error:', err);
      toast.error(err.response?.data?.message || 'Failed to create NFT');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <Head>
        <title>Create NFT | CYBEV</title>
      </Head>

      {/* SOLID WHITE/GRAY BACKGROUND - NO GRADIENTS */}
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-3xl mx-auto px-4 py-6">
            <Link href="/nft">
              <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 font-medium">
                <ArrowLeft className="w-5 h-5" />
                Back to NFT Gallery
              </button>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Create NFT</h1>
            <p className="text-gray-600">Mint your unique digital asset on Polygon</p>
          </div>
        </div>

        {/* Steps Progress */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-3xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              {[
                { num: 1, label: 'Upload' },
                { num: 2, label: 'Details' },
                { num: 3, label: 'Pricing' },
                { num: 4, label: 'Review' }
              ].map((s, i) => (
                <div key={s.num} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                    step >= s.num ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-500'
                  }`}>
                    {step > s.num ? <Check className="w-4 h-4" /> : s.num}
                  </div>
                  <span className={`ml-2 text-sm font-medium hidden sm:block ${step >= s.num ? 'text-gray-900' : 'text-gray-400'}`}>
                    {s.label}
                  </span>
                  {i < 3 && <div className={`w-8 sm:w-16 h-0.5 mx-2 sm:mx-4 ${step > s.num ? 'bg-purple-600' : 'bg-gray-200'}`} />}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-3xl mx-auto px-4 py-8">
          {/* Step 1: Upload */}
          {step === 1 && (
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-2">Upload your file</h2>
              <p className="text-gray-600 mb-6">Supported: JPG, PNG, GIF, WEBP, MP4, MP3, WAV. Max 100MB.</p>

              {!uploadedFile ? (
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all ${
                    isDragActive ? 'border-purple-500 bg-purple-50' : 'border-gray-300 hover:border-purple-400 hover:bg-gray-50'
                  }`}
                >
                  <input {...getInputProps()} />
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-lg font-semibold text-gray-900 mb-2">Upload your file</p>
                  <p className="text-gray-500">Drag and drop or click to browse</p>
                  <p className="text-sm text-gray-400 mt-2">JPG, PNG, GIF, WEBP, MP4, MP3, WAV. Max 100MB.</p>
                </div>
              ) : (
                <div className="relative">
                  {/* Preview */}
                  <div className="aspect-square max-w-md mx-auto bg-gray-100 rounded-2xl overflow-hidden">
                    {uploadedFile.type.startsWith('image/') ? (
                      <img src={preview} alt="Preview" className="w-full h-full object-contain" />
                    ) : uploadedFile.type.startsWith('video/') ? (
                      <video src={preview} controls className="w-full h-full object-contain" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="text-center">
                          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-600">{uploadedFile.name}</p>
                        </div>
                      </div>
                    )}
                  </div>
                  {/* Remove Button */}
                  <button
                    onClick={removeFile}
                    className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                  {/* File Info */}
                  <div className="mt-4 p-4 bg-gray-50 rounded-xl">
                    <p className="font-semibold text-gray-900">{uploadedFile.name}</p>
                    <p className="text-sm text-gray-500">{(uploadedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                </div>
              )}

              {/* Next Button */}
              <div className="mt-8 flex justify-end">
                <button
                  onClick={() => setStep(2)}
                  disabled={!uploadedFile}
                  className="px-8 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
                >
                  Continue
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Details */}
          {step === 2 && (
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-2">NFT Details</h2>
              <p className="text-gray-600 mb-6">Add information about your NFT</p>

              <div className="space-y-5">
                {/* Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent focus:bg-white transition-all"
                    placeholder="e.g., Cosmic Dreams #001"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent focus:bg-white transition-all resize-none"
                    placeholder="Tell the story behind your creation..."
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Category</label>
                  <div className="flex flex-wrap gap-2">
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setFormData({ ...formData, category: cat })}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                          formData.category === cat
                            ? 'bg-purple-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <div className="mt-8 flex justify-between">
                <button
                  onClick={() => setStep(1)}
                  className="px-6 py-3 text-gray-700 font-semibold hover:bg-gray-100 rounded-xl flex items-center gap-2 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  disabled={!formData.name.trim()}
                  className="px-8 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 disabled:opacity-50 flex items-center gap-2 transition-colors"
                >
                  Continue
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Pricing */}
          {step === 3 && (
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-2">Set your price</h2>
              <p className="text-gray-600 mb-6">Choose how you want to sell your NFT</p>

              <div className="space-y-5">
                {/* Price */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Price (MATIC)</label>
                  <div className="relative">
                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent focus:bg-white transition-all"
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <p className="text-sm text-gray-500 mt-1">Leave empty to list without a price</p>
                </div>

                {/* Royalty */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Creator Royalty: {formData.royalty}%
                  </label>
                  <input
                    type="range"
                    value={formData.royalty}
                    onChange={(e) => setFormData({ ...formData, royalty: parseInt(e.target.value) })}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                    min="0"
                    max="25"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>0%</span>
                    <span>25%</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    You'll earn {formData.royalty}% on all future sales
                  </p>
                </div>
              </div>

              {/* Navigation */}
              <div className="mt-8 flex justify-between">
                <button
                  onClick={() => setStep(2)}
                  className="px-6 py-3 text-gray-700 font-semibold hover:bg-gray-100 rounded-xl flex items-center gap-2 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Back
                </button>
                <button
                  onClick={() => setStep(4)}
                  className="px-8 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 flex items-center gap-2 transition-colors"
                >
                  Continue
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Review */}
          {step === 4 && (
            <div className="space-y-6">
              {/* Preview */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="aspect-square max-w-sm mx-auto p-4">
                  {preview && uploadedFile?.type.startsWith('image/') && (
                    <img src={preview} alt="Preview" className="w-full h-full object-contain rounded-xl" />
                  )}
                </div>
                <div className="p-6 border-t border-gray-200">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{formData.name}</h3>
                  {formData.description && (
                    <p className="text-gray-600 mb-4">{formData.description}</p>
                  )}
                  <div className="flex flex-wrap gap-4 text-sm">
                    {formData.category && (
                      <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full">{formData.category}</span>
                    )}
                    {formData.price && (
                      <span className="font-semibold text-gray-900">{formData.price} MATIC</span>
                    )}
                    <span className="text-gray-500">{formData.royalty}% royalty</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <button
                    onClick={() => setStep(3)}
                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 flex items-center justify-center gap-2 transition-colors"
                  >
                    <ArrowLeft className="w-5 h-5" />
                    Back
                  </button>
                  <button
                    onClick={handleMint}
                    disabled={loading}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg transition-all"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Minting...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5" />
                        Mint NFT
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
