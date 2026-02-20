// ============================================
// FILE: src/pages/vlog/create.jsx
// Create Vlog/Story Page
// VERSION: 2.0 - FIXED upload timeout
// FIXES:
//   - 5-minute timeout for video uploads (was 30 seconds)
//   - Better progress tracking
//   - Improved error handling
// ============================================

import { useState, useRef, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { ArrowLeft, Upload, Camera, Video, X, Loader2, Play, Music, Hash, Globe, Users, Lock } from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'react-toastify';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.cybev.io';

export default function CreateVlogPage() {
  const router = useRouter();
  const fileInputRef = useRef(null);
  const [user, setUser] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [caption, setCaption] = useState('');
  const [hashtags, setHashtags] = useState('');
  const [visibility, setVisibility] = useState('public');
  const [isStory, setIsStory] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState('');

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      router.push('/login');
    }
  }, []);

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type
    if (!file.type.startsWith('video/')) {
      toast.error('Please select a video file');
      return;
    }

    // Check file size (max 100MB)
    if (file.size > 100 * 1024 * 1024) {
      toast.error('Video must be less than 100MB');
      return;
    }

    setVideoFile(file);
    setVideoPreview(URL.createObjectURL(file));
  };

  const handleUpload = async () => {
    if (!videoFile) {
      toast.error('Please select a video');
      return;
    }

    setUploading(true);
    setUploadProgress(5);
    setUploadStatus('Preparing upload...');

    try {
      const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
      
      // Prepare form data
      const formData = new FormData();
      formData.append('file', videoFile);
      formData.append('type', 'vlog');

      setUploadProgress(10);
      setUploadStatus('Uploading video...');

      // FIXED: Use axios directly with 5-minute timeout for large videos
      const uploadResponse = await axios.post(`${API_URL}/api/upload/video`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        },
        timeout: 300000, // 5 minutes timeout (was 30 seconds)
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            // Upload progress: 10% to 80%
            const percentCompleted = Math.round((progressEvent.loaded * 70) / progressEvent.total);
            setUploadProgress(10 + percentCompleted);
            
            const uploadedMB = (progressEvent.loaded / (1024 * 1024)).toFixed(1);
            const totalMB = (progressEvent.total / (1024 * 1024)).toFixed(1);
            setUploadStatus(`Uploading: ${uploadedMB}MB / ${totalMB}MB`);
          }
        }
      });

      // Check if upload was successful
      if (!uploadResponse.data?.success && !uploadResponse.data?.url && !uploadResponse.data?.ok) {
        if (uploadResponse.data?.error?.includes('not configured')) {
          toast.error('Video storage not configured. Contact admin.');
          setUploading(false);
          return;
        }
        throw new Error(uploadResponse.data?.error || 'Upload failed');
      }

      const videoUrl = uploadResponse.data?.url || uploadResponse.data?.videoUrl;
      const thumbnailUrl = uploadResponse.data?.thumbnailUrl || uploadResponse.data?.thumbnail;
      
      if (!videoUrl) {
        toast.error('Video upload failed. Please try again.');
        setUploading(false);
        return;
      }

      setUploadProgress(85);
      setUploadStatus('Creating vlog post...');

      // Create vlog entry
      const vlogData = {
        videoUrl: videoUrl,
        thumbnailUrl: thumbnailUrl || '',
        caption: caption.trim(),
        hashtags: hashtags.split(',').map(t => t.trim()).filter(Boolean),
        visibility,
        isStory,
        duration: 0
      };

      const response = await api.post('/api/vlogs', vlogData, {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 30000 // 30 seconds for vlog creation
      });

      setUploadProgress(100);
      setUploadStatus('Done!');

      if (response.data?.success) {
        toast.success('🎉 Vlog posted successfully!');
        setTimeout(() => router.push('/feed'), 500);
      } else {
        throw new Error(response.data?.error || 'Failed to create vlog');
      }

    } catch (error) {
      console.error('Upload error:', error);
      
      // Provide helpful error messages
      if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
        toast.error('Upload timed out. Please try a smaller video or check your connection.');
      } else if (error.response?.status === 413) {
        toast.error('Video too large. Maximum size is 100MB.');
      } else if (error.response?.status === 401) {
        toast.error('Session expired. Please login again.');
        router.push('/login');
      } else {
        toast.error(error.response?.data?.error || error.message || 'Failed to upload vlog');
      }
    }

    setUploading(false);
    setUploadStatus('');
  };

  const removeVideo = () => {
    setVideoFile(null);
    setVideoPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const gradients = [
    'from-purple-500 to-pink-500',
    'from-blue-500 to-cyan-500',
    'from-green-500 to-teal-500',
    'from-orange-500 to-red-500',
    'from-indigo-500 to-purple-500'
  ];

  const fileSizeMB = videoFile ? (videoFile.size / (1024 * 1024)).toFixed(1) : 0;

  return (
    <>
      <Head>
        <title>Create Vlog | CYBEV</title>
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-200 px-4 py-3">
          <div className="max-w-lg mx-auto flex items-center justify-between">
            <button onClick={() => router.back()} className="p-2 text-gray-600 hover:bg-gray-100 rounded-full">
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-lg font-bold text-gray-900">Create Vlog</h1>
            <button
              onClick={handleUpload}
              disabled={!videoFile || uploading}
              className="px-4 py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? 'Posting...' : 'Post'}
            </button>
          </div>
        </header>

        <main className="max-w-lg mx-auto px-4 py-6">
          {/* Video Preview / Upload Area */}
          <div className="aspect-[9/16] rounded-2xl overflow-hidden mb-6 relative bg-gray-900">
            {videoPreview ? (
              <>
                <video
                  src={videoPreview}
                  className="w-full h-full object-cover"
                  controls
                  autoPlay
                  muted
                  loop
                />
                <button
                  onClick={removeVideo}
                  className="absolute top-4 right-4 p-2 bg-black/50 rounded-full text-white hover:bg-black/70"
                >
                  <X className="w-5 h-5" />
                </button>
                {/* File size indicator */}
                <div className="absolute bottom-4 left-4 px-3 py-1 bg-black/50 rounded-full text-white text-sm">
                  {fileSizeMB} MB
                </div>
              </>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className={`w-full h-full flex flex-col items-center justify-center cursor-pointer bg-gradient-to-br ${gradients[0]} hover:opacity-90 transition-opacity`}
              >
                <div className="w-20 h-20 bg-white/20 backdrop-blur rounded-full flex items-center justify-center mb-4">
                  <Video className="w-10 h-10 text-white" />
                </div>
                <p className="text-white font-semibold text-lg">Upload Video</p>
                <p className="text-white/70 text-sm mt-1">Tap to select a video</p>
                <p className="text-white/50 text-xs mt-4">Max 100MB · MP4, MOV, WebM</p>
              </div>
            )}

            {/* Upload Progress */}
            {uploading && (
              <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center">
                <Loader2 className="w-12 h-12 text-purple-500 animate-spin mb-4" />
                <p className="text-white font-semibold text-lg">{uploadProgress}%</p>
                <p className="text-white/70 text-sm mt-1">{uploadStatus}</p>
                <div className="w-48 h-2 bg-gray-700 rounded-full mt-4 overflow-hidden">
                  <div
                    className="h-full bg-purple-500 transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                {uploadProgress < 80 && (
                  <p className="text-white/50 text-xs mt-4">Large videos may take a few minutes...</p>
                )}
              </div>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="video/*"
            onChange={handleFileSelect}
            className="hidden"
          />

          {/* Caption */}
          <div className="bg-white rounded-xl p-4 mb-4 shadow-sm">
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Write a caption..."
              className="w-full bg-transparent text-gray-900 placeholder-gray-400 resize-none focus:outline-none"
              rows={3}
              maxLength={500}
            />
            <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
              <span>{caption.length}/500</span>
            </div>
          </div>

          {/* Hashtags */}
          <div className="bg-white rounded-xl p-4 mb-4 shadow-sm">
            <div className="flex items-center gap-2 text-gray-500 mb-2">
              <Hash className="w-4 h-4" />
              <span className="text-sm">Hashtags</span>
            </div>
            <input
              type="text"
              value={hashtags}
              onChange={(e) => setHashtags(e.target.value)}
              placeholder="trending, viral, fyp (comma separated)"
              className="w-full bg-transparent text-gray-900 placeholder-gray-400 focus:outline-none"
            />
          </div>

          {/* Settings */}
          <div className="bg-white rounded-xl p-4 space-y-4 shadow-sm">
            {/* Visibility */}
            <div>
              <label className="text-gray-500 text-sm mb-2 block">Who can see this?</label>
              <div className="flex gap-2">
                {[
                  { value: 'public', label: 'Public', icon: Globe },
                  { value: 'friends', label: 'Friends', icon: Users },
                  { value: 'private', label: 'Only Me', icon: Lock }
                ].map(option => (
                  <button
                    key={option.value}
                    onClick={() => setVisibility(option.value)}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition ${
                      visibility === option.value
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <option.icon className="w-4 h-4" />
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Story Toggle */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-900 font-medium">Story Mode</p>
                <p className="text-gray-500 text-xs">Disappears after 24 hours</p>
              </div>
              <button
                onClick={() => setIsStory(!isStory)}
                className={`w-12 h-6 rounded-full transition ${
                  isStory ? 'bg-purple-600' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full transition-transform shadow ${
                    isStory ? 'translate-x-6' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-6 grid grid-cols-2 gap-3">
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="flex items-center justify-center gap-2 py-3 bg-white text-gray-900 rounded-xl hover:bg-gray-100 shadow-sm disabled:opacity-50"
            >
              <Upload className="w-5 h-5" />
              Upload
            </button>
            <button
              onClick={() => toast.info('Camera coming soon!')}
              disabled={uploading}
              className="flex items-center justify-center gap-2 py-3 bg-white text-gray-900 rounded-xl hover:bg-gray-100 shadow-sm disabled:opacity-50"
            >
              <Camera className="w-5 h-5" />
              Record
            </button>
          </div>
        </main>
      </div>
    </>
  );
}
