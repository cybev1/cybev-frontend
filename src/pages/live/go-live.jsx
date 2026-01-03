// ============================================
// FILE: src/pages/live/go-live.jsx
// Go Live - Live Streaming with Camera
// ============================================

import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ArrowLeft, Radio, Video, Mic, MicOff, VideoOff, Settings, Users, MessageCircle, Share2, X, Loader2, Copy, ExternalLink } from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'react-toastify';

export default function GoLivePage() {
  const router = useRouter();
  const videoRef = useRef(null);
  const mediaStreamRef = useRef(null);
  
  const [user, setUser] = useState(null);
  const [isLive, setIsLive] = useState(false);
  const [isPreview, setIsPreview] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [viewerCount, setViewerCount] = useState(0);
  const [streamKey, setStreamKey] = useState('');
  const [showRTMP, setShowRTMP] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const [streamId, setStreamId] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      router.push('/login');
      return;
    }
    
    // Start camera preview
    startCamera();
    
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      setCameraError('');
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        },
        audio: true
      });
      
      mediaStreamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Camera error:', error);
      let errorMsg = 'Unable to access camera';
      
      if (error.name === 'NotAllowedError') {
        errorMsg = 'Camera permission denied. Please allow camera access in your browser settings.';
      } else if (error.name === 'NotFoundError') {
        errorMsg = 'No camera found. Please connect a camera or use RTMP streaming.';
      } else if (error.name === 'NotReadableError') {
        errorMsg = 'Camera is in use by another application.';
      }
      
      setCameraError(errorMsg);
      toast.error(errorMsg);
    }
  };

  const stopCamera = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const toggleVideo = () => {
    if (mediaStreamRef.current) {
      const videoTrack = mediaStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoEnabled;
        setVideoEnabled(!videoEnabled);
      }
    }
  };

  const toggleAudio = () => {
    if (mediaStreamRef.current) {
      const audioTrack = mediaStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioEnabled;
        setAudioEnabled(!audioEnabled);
      }
    }
  };

  const generateStreamKey = () => {
    const key = 'sk_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    setStreamKey(key);
    return key;
  };

  const startLiveStream = async () => {
    if (!title.trim()) {
      toast.error('Please enter a title for your stream');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
      const key = streamKey || generateStreamKey();
      
      const response = await api.post('/api/live/start', {
        title,
        description,
        streamKey: key
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data?.success || response.data?.stream) {
        setIsLive(true);
        setIsPreview(false);
        setStreamId(response.data.stream?._id || response.data.streamId);
        toast.success('🔴 You are now LIVE!');
      }
    } catch (error) {
      console.error('Start stream error:', error);
      toast.error(error.response?.data?.error || 'Failed to start stream');
    }
    setLoading(false);
  };

  const endLiveStream = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
      
      if (streamId) {
        await api.post(`/api/live/${streamId}/end`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      
      setIsLive(false);
      stopCamera();
      toast.success('Stream ended');
      router.push('/feed');
    } catch (error) {
      toast.error('Failed to end stream');
    }
    setLoading(false);
  };

  const copyStreamKey = () => {
    navigator.clipboard.writeText(streamKey);
    toast.success('Stream key copied!');
  };

  const rtmpUrl = 'rtmp://live.cybev.io/live';

  return (
    <>
      <Head>
        <title>Go Live | CYBEV</title>
      </Head>

      <div className="min-h-screen bg-gray-900">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-gray-900/95 backdrop-blur border-b border-gray-800 px-4 py-3">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={() => router.back()} className="p-2 text-white hover:bg-gray-800 rounded-full">
                <ArrowLeft className="w-6 h-6" />
              </button>
              <div className="flex items-center gap-2">
                <Radio className={`w-5 h-5 ${isLive ? 'text-red-500 animate-pulse' : 'text-white'}`} />
                <span className="text-white font-bold">Go Live</span>
              </div>
            </div>
            
            {isLive ? (
              <button
                onClick={endLiveStream}
                disabled={loading}
                className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 flex items-center gap-2"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <X className="w-4 h-4" />}
                End Stream
              </button>
            ) : (
              <button
                onClick={startLiveStream}
                disabled={loading || (!mediaStreamRef.current && !showRTMP)}
                className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center gap-2"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Radio className="w-4 h-4" />}
                Go Live
              </button>
            )}
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 py-6">
          <div className="grid md:grid-cols-3 gap-6">
            {/* Video Preview */}
            <div className="md:col-span-2">
              <div className="relative bg-black rounded-xl overflow-hidden aspect-video">
                {/* Live Badge */}
                {isLive && (
                  <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
                    <div className="px-3 py-1 bg-red-600 text-white text-sm font-bold rounded-lg flex items-center gap-2">
                      <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                      LIVE
                    </div>
                    <div className="px-3 py-1 bg-black/50 text-white text-sm rounded-lg flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {viewerCount}
                    </div>
                  </div>
                )}

                {/* Preview Mode Badge */}
                {isPreview && !isLive && (
                  <div className="absolute top-4 left-4 z-10 px-3 py-1 bg-gray-800 text-white text-sm rounded-lg">
                    Preview Mode
                  </div>
                )}

                {/* Video Element */}
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  playsInline
                  className={`w-full h-full object-cover ${!videoEnabled ? 'hidden' : ''}`}
                />

                {/* Camera Off / Error State */}
                {(!videoEnabled || cameraError) && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                    {cameraError ? (
                      <div className="text-center p-6">
                        <VideoOff className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                        <p className="text-white mb-2">Camera Unavailable</p>
                        <p className="text-gray-400 text-sm max-w-xs">{cameraError}</p>
                        <button
                          onClick={startCamera}
                          className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg text-sm"
                        >
                          Try Again
                        </button>
                      </div>
                    ) : (
                      <div className="text-center">
                        <VideoOff className="w-16 h-16 text-gray-500 mx-auto mb-2" />
                        <p className="text-gray-400">Camera Off</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Controls */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3 z-10">
                  <button
                    onClick={toggleVideo}
                    className={`p-3 rounded-full transition ${videoEnabled ? 'bg-gray-700 text-white' : 'bg-red-600 text-white'}`}
                  >
                    {videoEnabled ? <Video className="w-6 h-6" /> : <VideoOff className="w-6 h-6" />}
                  </button>
                  <button
                    onClick={toggleAudio}
                    className={`p-3 rounded-full transition ${audioEnabled ? 'bg-gray-700 text-white' : 'bg-red-600 text-white'}`}
                  >
                    {audioEnabled ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
                  </button>
                  <button
                    onClick={() => {}}
                    className="p-3 bg-gray-700 text-white rounded-full"
                  >
                    <Share2 className="w-6 h-6" />
                  </button>
                  <button
                    onClick={() => setShowRTMP(!showRTMP)}
                    className={`p-3 rounded-full transition ${showRTMP ? 'bg-purple-600' : 'bg-gray-700'} text-white`}
                  >
                    <Settings className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* RTMP Settings */}
              {showRTMP && (
                <div className="mt-4 bg-gray-800 rounded-xl p-4">
                  <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                    <ExternalLink className="w-5 h-5" />
                    RTMP Streaming (OBS, Streamlabs)
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="text-gray-400 text-sm mb-1 block">Server URL</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={rtmpUrl}
                          readOnly
                          className="flex-1 px-3 py-2 bg-gray-700 text-white rounded-lg text-sm"
                        />
                        <button
                          onClick={() => { navigator.clipboard.writeText(rtmpUrl); toast.success('Copied!'); }}
                          className="px-3 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-gray-400 text-sm mb-1 block">Stream Key</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={streamKey || 'Click generate to get your stream key'}
                          readOnly
                          className="flex-1 px-3 py-2 bg-gray-700 text-white rounded-lg text-sm"
                        />
                        {streamKey ? (
                          <button
                            onClick={copyStreamKey}
                            className="px-3 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                        ) : (
                          <button
                            onClick={generateStreamKey}
                            className="px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm"
                          >
                            Generate
                          </button>
                        )}
                      </div>
                    </div>
                    
                    <p className="text-gray-500 text-xs">
                      Use these settings in OBS Studio or Streamlabs to stream from your desktop.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Stream Settings */}
            <div className="space-y-4">
              <div className="bg-gray-800 rounded-xl p-4">
                <h3 className="text-white font-semibold mb-4">Stream Settings</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-gray-400 text-sm mb-1 block">Title *</label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="What's your stream about?"
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      maxLength={100}
                    />
                  </div>
                  
                  <div>
                    <label className="text-gray-400 text-sm mb-1 block">Description</label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Tell viewers what to expect..."
                      rows={3}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>
              </div>

              {/* Quick Tips */}
              <div className="bg-gray-800 rounded-xl p-4">
                <h3 className="text-white font-semibold mb-3">Quick Tips</h3>
                <ul className="text-gray-400 text-sm space-y-2">
                  <li>• Good lighting helps quality</li>
                  <li>• Test your audio before going live</li>
                  <li>• Engage with your viewers</li>
                  <li>• Use RTMP for desktop streaming</li>
                </ul>
              </div>

              {/* User Info */}
              {user && (
                <div className="bg-gray-800 rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center overflow-hidden">
                      {user.profilePicture ? (
                        <img src={user.profilePicture} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-white font-bold text-lg">{user.name?.[0]}</span>
                      )}
                    </div>
                    <div>
                      <p className="text-white font-semibold">{user.name}</p>
                      <p className="text-gray-400 text-sm">@{user.username}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
