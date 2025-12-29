// ============================================
// FILE: src/pages/live/start.jsx
// PATH: cybev-frontend/src/pages/live/start.jsx
// PURPOSE: Start a new live stream with settings
// ============================================

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  Monitor,
  Settings,
  Radio,
  Eye,
  Users,
  MessageCircle,
  Share2,
  Gift,
  Heart,
  X,
  Check,
  Camera,
  ScreenShare,
  Sparkles,
  Zap,
  Globe,
  Lock,
  Clock,
  Image as ImageIcon,
  ChevronLeft
} from 'lucide-react';
import api from '@/lib/api';

// Stream categories
const CATEGORIES = [
  'Just Chatting',
  'Gaming',
  'Music',
  'Creative',
  'Education',
  'Talk Show',
  'Sports',
  'Technology',
  'Lifestyle',
  'News',
  'Other'
];

export default function StartStream() {
  const router = useRouter();
  const videoRef = useRef(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);
  
  // Stream settings
  const [streamSettings, setStreamSettings] = useState({
    title: '',
    description: '',
    category: 'Just Chatting',
    visibility: 'public', // public, followers, private
    enableChat: true,
    enableTips: true,
    thumbnail: null,
    scheduledTime: null
  });
  
  // Media state
  const [mediaStream, setMediaStream] = useState(null);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [screenShare, setScreenShare] = useState(false);
  const [devices, setDevices] = useState({ video: [], audio: [] });
  const [selectedDevices, setSelectedDevices] = useState({ video: '', audio: '' });
  
  // UI state
  const [showSettings, setShowSettings] = useState(false);
  const [step, setStep] = useState(1); // 1: Setup, 2: Preview, 3: Live

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
      } catch (e) {
        console.error('Failed to parse user data');
      }
    }

    // Get available devices
    getDevices();
    setLoading(false);

    return () => {
      // Cleanup media stream on unmount
      if (mediaStream) {
        mediaStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [router]);

  const getDevices = async () => {
    try {
      const deviceList = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = deviceList.filter(d => d.kind === 'videoinput');
      const audioDevices = deviceList.filter(d => d.kind === 'audioinput');
      
      setDevices({ video: videoDevices, audio: audioDevices });
      
      if (videoDevices.length > 0) {
        setSelectedDevices(prev => ({ ...prev, video: videoDevices[0].deviceId }));
      }
      if (audioDevices.length > 0) {
        setSelectedDevices(prev => ({ ...prev, audio: audioDevices[0].deviceId }));
      }
    } catch (error) {
      console.error('Failed to get devices:', error);
    }
  };

  const startPreview = async () => {
    try {
      const constraints = {
        video: videoEnabled ? {
          deviceId: selectedDevices.video ? { exact: selectedDevices.video } : undefined,
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        } : false,
        audio: audioEnabled ? {
          deviceId: selectedDevices.audio ? { exact: selectedDevices.audio } : undefined
        } : false
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      setMediaStream(stream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      
      setStep(2);
    } catch (error) {
      console.error('Failed to start preview:', error);
      alert('Failed to access camera/microphone. Please check permissions.');
    }
  };

  const toggleVideo = () => {
    if (mediaStream) {
      const videoTrack = mediaStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setVideoEnabled(videoTrack.enabled);
      }
    }
  };

  const toggleAudio = () => {
    if (mediaStream) {
      const audioTrack = mediaStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setAudioEnabled(audioTrack.enabled);
      }
    }
  };

  const startScreenShare = async () => {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true
      });
      
      // Replace video track with screen share
      if (mediaStream && videoRef.current) {
        const [screenTrack] = screenStream.getVideoTracks();
        
        screenTrack.onended = () => {
          // Revert to camera when screen share ends
          setScreenShare(false);
          startPreview();
        };
        
        const sender = mediaStream.getVideoTracks()[0];
        if (sender) {
          mediaStream.removeTrack(sender);
          sender.stop();
        }
        mediaStream.addTrack(screenTrack);
        videoRef.current.srcObject = mediaStream;
        setScreenShare(true);
      }
    } catch (error) {
      console.error('Failed to start screen share:', error);
    }
  };

  const goLive = async () => {
    if (!streamSettings.title.trim()) {
      alert('Please enter a stream title');
      return;
    }

    setStarting(true);
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
      const response = await api.post('/api/live/start', {
        title: streamSettings.title,
        description: streamSettings.description,
        category: streamSettings.category,
        visibility: streamSettings.visibility,
        enableChat: streamSettings.enableChat,
        enableTips: streamSettings.enableTips
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.ok) {
        // Redirect to live stream page
        router.push(`/live/${response.data.stream._id}?host=true`);
      } else {
        throw new Error(response.data.error || 'Failed to start stream');
      }
    } catch (error) {
      console.error('Failed to go live:', error);
      alert('Failed to start stream. Please try again.');
    } finally {
      setStarting(false);
    }
  };

  const handleThumbnailUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setStreamSettings(prev => ({ ...prev, thumbnail: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Go Live - CYBEV</title>
      </Head>

      <div className="min-h-screen bg-gray-900">
        {/* Header */}
        <div className="bg-gray-950 border-b border-gray-800">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/live')}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-gray-400" />
              </button>
              <h1 className="text-xl font-bold text-white flex items-center gap-2">
                <Radio className="w-6 h-6 text-red-500" />
                Go Live
              </h1>
            </div>

            <div className="flex items-center gap-2">
              {step === 2 && (
                <button
                  onClick={goLive}
                  disabled={starting || !streamSettings.title.trim()}
                  className="px-6 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {starting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Starting...
                    </>
                  ) : (
                    <>
                      <Radio className="w-4 h-4" />
                      Go Live
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content - Video Preview */}
            <div className="lg:col-span-2">
              <div className="bg-gray-950 rounded-2xl overflow-hidden border border-gray-800">
                {/* Video Preview */}
                <div className="aspect-video bg-black relative">
                  {step === 1 ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <Video className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                        <p className="text-gray-400 mb-4">Camera preview will appear here</p>
                        <button
                          onClick={startPreview}
                          className="px-6 py-3 bg-purple-500 text-white rounded-lg font-medium hover:bg-purple-600 transition-colors"
                        >
                          Enable Camera
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <video
                        ref={videoRef}
                        autoPlay
                        muted
                        playsInline
                        className="w-full h-full object-cover"
                      />
                      
                      {/* Stream Info Overlay */}
                      <div className="absolute top-4 left-4 flex items-center gap-2">
                        <span className="px-3 py-1.5 bg-gray-900/80 text-white text-sm rounded-lg backdrop-blur-sm">
                          Preview Mode
                        </span>
                      </div>
                    </>
                  )}
                </div>

                {/* Controls */}
                {step === 2 && (
                  <div className="p-4 flex items-center justify-center gap-4 bg-gray-900">
                    <button
                      onClick={toggleVideo}
                      className={`p-3 rounded-full transition-colors ${
                        videoEnabled ? 'bg-gray-700 hover:bg-gray-600' : 'bg-red-500 hover:bg-red-600'
                      }`}
                    >
                      {videoEnabled ? (
                        <Video className="w-5 h-5 text-white" />
                      ) : (
                        <VideoOff className="w-5 h-5 text-white" />
                      )}
                    </button>
                    
                    <button
                      onClick={toggleAudio}
                      className={`p-3 rounded-full transition-colors ${
                        audioEnabled ? 'bg-gray-700 hover:bg-gray-600' : 'bg-red-500 hover:bg-red-600'
                      }`}
                    >
                      {audioEnabled ? (
                        <Mic className="w-5 h-5 text-white" />
                      ) : (
                        <MicOff className="w-5 h-5 text-white" />
                      )}
                    </button>
                    
                    <button
                      onClick={startScreenShare}
                      className={`p-3 rounded-full transition-colors ${
                        screenShare ? 'bg-purple-500 hover:bg-purple-600' : 'bg-gray-700 hover:bg-gray-600'
                      }`}
                    >
                      <ScreenShare className="w-5 h-5 text-white" />
                    </button>
                    
                    <button
                      onClick={() => setShowSettings(!showSettings)}
                      className="p-3 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors"
                    >
                      <Settings className="w-5 h-5 text-white" />
                    </button>
                  </div>
                )}
              </div>

              {/* Device Settings */}
              {showSettings && step === 2 && (
                <div className="mt-4 bg-gray-950 rounded-xl p-4 border border-gray-800">
                  <h3 className="text-white font-medium mb-4">Device Settings</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Camera</label>
                      <select
                        value={selectedDevices.video}
                        onChange={(e) => setSelectedDevices(prev => ({ ...prev, video: e.target.value }))}
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white"
                      >
                        {devices.video.map(device => (
                          <option key={device.deviceId} value={device.deviceId}>
                            {device.label || `Camera ${device.deviceId.slice(0, 8)}`}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Microphone</label>
                      <select
                        value={selectedDevices.audio}
                        onChange={(e) => setSelectedDevices(prev => ({ ...prev, audio: e.target.value }))}
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white"
                      >
                        {devices.audio.map(device => (
                          <option key={device.deviceId} value={device.deviceId}>
                            {device.label || `Mic ${device.deviceId.slice(0, 8)}`}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar - Stream Settings */}
            <div className="lg:col-span-1">
              <div className="bg-gray-950 rounded-2xl border border-gray-800 p-6">
                <h2 className="text-lg font-bold text-white mb-6">Stream Settings</h2>

                <div className="space-y-6">
                  {/* Title */}
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Stream Title *</label>
                    <input
                      type="text"
                      value={streamSettings.title}
                      onChange={(e) => setStreamSettings(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Enter a catchy title..."
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none"
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Description</label>
                    <textarea
                      value={streamSettings.description}
                      onChange={(e) => setStreamSettings(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="What's your stream about?"
                      rows={3}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none resize-none"
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Category</label>
                    <select
                      value={streamSettings.category}
                      onChange={(e) => setStreamSettings(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-purple-500 focus:outline-none"
                    >
                      {CATEGORIES.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  {/* Thumbnail */}
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Thumbnail</label>
                    <div className="relative">
                      {streamSettings.thumbnail ? (
                        <div className="relative aspect-video rounded-lg overflow-hidden">
                          <img src={streamSettings.thumbnail} alt="Thumbnail" className="w-full h-full object-cover" />
                          <button
                            onClick={() => setStreamSettings(prev => ({ ...prev, thumbnail: null }))}
                            className="absolute top-2 right-2 p-1 bg-red-500 rounded-full"
                          >
                            <X className="w-4 h-4 text-white" />
                          </button>
                        </div>
                      ) : (
                        <label className="flex flex-col items-center justify-center w-full aspect-video bg-gray-800 border-2 border-dashed border-gray-700 rounded-lg cursor-pointer hover:border-purple-500 transition-colors">
                          <ImageIcon className="w-8 h-8 text-gray-600 mb-2" />
                          <span className="text-sm text-gray-500">Click to upload</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleThumbnailUpload}
                            className="hidden"
                          />
                        </label>
                      )}
                    </div>
                  </div>

                  {/* Visibility */}
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Visibility</label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'public', icon: Globe, label: 'Public' },
                        { id: 'followers', icon: Users, label: 'Followers' },
                        { id: 'private', icon: Lock, label: 'Private' }
                      ].map((option) => (
                        <button
                          key={option.id}
                          onClick={() => setStreamSettings(prev => ({ ...prev, visibility: option.id }))}
                          className={`p-3 rounded-lg border transition-colors flex flex-col items-center gap-1 ${
                            streamSettings.visibility === option.id
                              ? 'bg-purple-500/20 border-purple-500 text-purple-400'
                              : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600'
                          }`}
                        >
                          <option.icon className="w-5 h-5" />
                          <span className="text-xs">{option.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Options */}
                  <div className="space-y-3">
                    <label className="flex items-center justify-between p-3 bg-gray-800 rounded-lg cursor-pointer">
                      <div className="flex items-center gap-3">
                        <MessageCircle className="w-5 h-5 text-gray-400" />
                        <span className="text-white">Enable Chat</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={streamSettings.enableChat}
                        onChange={(e) => setStreamSettings(prev => ({ ...prev, enableChat: e.target.checked }))}
                        className="w-5 h-5 rounded bg-gray-700 border-gray-600 text-purple-500 focus:ring-purple-500"
                      />
                    </label>

                    <label className="flex items-center justify-between p-3 bg-gray-800 rounded-lg cursor-pointer">
                      <div className="flex items-center gap-3">
                        <Gift className="w-5 h-5 text-gray-400" />
                        <span className="text-white">Enable Tips</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={streamSettings.enableTips}
                        onChange={(e) => setStreamSettings(prev => ({ ...prev, enableTips: e.target.checked }))}
                        className="w-5 h-5 rounded bg-gray-700 border-gray-600 text-purple-500 focus:ring-purple-500"
                      />
                    </label>
                  </div>

                  {/* Start Button (Mobile) */}
                  {step === 1 && (
                    <button
                      onClick={startPreview}
                      className="w-full py-3 bg-purple-500 text-white rounded-lg font-medium hover:bg-purple-600 transition-colors flex items-center justify-center gap-2"
                    >
                      <Camera className="w-5 h-5" />
                      Setup Camera
                    </button>
                  )}

                  {step === 2 && (
                    <button
                      onClick={goLive}
                      disabled={starting || !streamSettings.title.trim()}
                      className="w-full py-3 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {starting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Starting Stream...
                        </>
                      ) : (
                        <>
                          <Radio className="w-5 h-5" />
                          Go Live Now
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
