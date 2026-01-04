// ============================================
// FILE: src/pages/live/go-live.jsx
// Facebook Live-Style Streaming - Camera + OBS Support
// FIXED: OBS preview loading, WebRTC status checking
// ============================================

import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Script from 'next/script';
import { 
  ArrowLeft, Radio, Video, Mic, MicOff, VideoOff, Settings, Users, 
  MessageCircle, Share2, X, Loader2, Copy, ExternalLink, Camera,
  Monitor, Smartphone, RefreshCw, ChevronDown, Eye, Clock, Heart,
  Zap, Globe, Lock, CheckCircle, AlertCircle, Wifi, WifiOff,
  RotateCcw, SwitchCamera, Sparkles, Play, Key, Server, EyeOff,
  Upload, Trash2, StopCircle
} from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'react-toastify';

const STREAM_MODES = { CAMERA: 'camera', SOFTWARE: 'software' };
const PRIVACY_OPTIONS = [
  { value: 'public', label: 'Public', icon: Globe, desc: 'Anyone can watch' },
  { value: 'followers', label: 'Followers', icon: Users, desc: 'Only followers can watch' },
  { value: 'private', label: 'Private', icon: Lock, desc: 'Only you can watch' }
];

export default function GoLivePage() {
  const router = useRouter();
  const videoRef = useRef(null);
  const previewVideoRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const hlsRef = useRef(null);
  
  const [user, setUser] = useState(null);
  const [streamMode, setStreamMode] = useState(STREAM_MODES.CAMERA);
  const [isLive, setIsLive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [streamId, setStreamId] = useState(null);
  const [streamDuration, setStreamDuration] = useState(0);
  
  // Camera
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [cameraError, setCameraError] = useState('');
  const [facingMode, setFacingMode] = useState('user');
  const [devices, setDevices] = useState({ video: [], audio: [] });
  const [selectedCamera, setSelectedCamera] = useState('');
  const [selectedMic, setSelectedMic] = useState('');
  
  // Stream settings
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [privacy, setPrivacy] = useState('public');
  const [showPrivacyDropdown, setShowPrivacyDropdown] = useState(false);
  
  // Thumbnail
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const thumbnailInputRef = useRef(null);
  
  // OBS
  const [streamCredentials, setStreamCredentials] = useState(null);
  const [showStreamKey, setShowStreamKey] = useState(false);
  const [generatingCredentials, setGeneratingCredentials] = useState(false);
  const [obsConnected, setObsConnected] = useState(false);
  const [obsPreviewReady, setObsPreviewReady] = useState(false);
  const [muxStreamStatus, setMuxStreamStatus] = useState('idle'); // idle, active, disconnected
  
  // WebRTC
  const [webrtcSupported, setWebrtcSupported] = useState(false);
  
  // Stats
  const [viewerCount, setViewerCount] = useState(0);
  
  // Existing stream
  const [existingStream, setExistingStream] = useState(null);
  const [showExistingStreamModal, setShowExistingStreamModal] = useState(false);

  // HLS.js loaded state
  const [hlsLoaded, setHlsLoaded] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
      checkExistingStream();
      checkWebRTCSupport();
    } else {
      router.push('/auth/login');
    }
    enumerateDevices();
    return () => { stopCamera(); destroyHls(); };
  }, []);

  // Camera mode - start camera
  useEffect(() => {
    if (streamMode === STREAM_MODES.CAMERA && !isLive) {
      const timer = setTimeout(() => startCamera(), 500);
      return () => clearTimeout(timer);
    } else if (streamMode === STREAM_MODES.SOFTWARE) {
      stopCamera();
    }
  }, [streamMode, selectedCamera, selectedMic]);

  // Duration timer
  useEffect(() => {
    let interval;
    if (isLive) {
      interval = setInterval(() => setStreamDuration(prev => prev + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isLive]);

  // Poll OBS connection
  useEffect(() => {
    let interval;
    if (streamMode === STREAM_MODES.SOFTWARE && streamCredentials && !isLive) {
      // Check immediately
      checkOBSConnection();
      // Then poll every 3 seconds
      interval = setInterval(checkOBSConnection, 3000);
    }
    return () => clearInterval(interval);
  }, [streamMode, streamCredentials, isLive, hlsLoaded]);

  // Stats polling when live
  useEffect(() => {
    let interval;
    if (isLive && streamId) {
      interval = setInterval(fetchStreamStats, 5000);
    }
    return () => clearInterval(interval);
  }, [isLive, streamId]);

  const checkWebRTCSupport = async () => {
    try {
      const response = await api.get('/api/webrtc/status');
      console.log('WebRTC status:', response.data);
      setWebrtcSupported(response.data?.webrtc?.available || false);
    } catch (error) {
      console.log('WebRTC not available:', error.message);
      setWebrtcSupported(false);
    }
  };

  const destroyHls = () => {
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }
  };

  const enumerateDevices = async () => {
    try {
      const deviceList = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = deviceList.filter(d => d.kind === 'videoinput');
      const audioDevices = deviceList.filter(d => d.kind === 'audioinput');
      setDevices({ video: videoDevices, audio: audioDevices });
      if (videoDevices.length > 0 && !selectedCamera) setSelectedCamera(videoDevices[0].deviceId);
      if (audioDevices.length > 0 && !selectedMic) setSelectedMic(audioDevices[0].deviceId);
    } catch {}
  };

  const checkExistingStream = async () => {
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
      const response = await api.get('/api/live/my-stream', { headers: { Authorization: `Bearer ${token}` } });
      if (response.data?.hasActiveStream && response.data?.stream) {
        setExistingStream(response.data.stream);
        setShowExistingStreamModal(true);
      }
    } catch {}
  };

  // Thumbnail
  const handleThumbnailSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) { toast.error('Please select an image'); return; }
      if (file.size > 5 * 1024 * 1024) { toast.error('Image must be < 5MB'); return; }
      setThumbnail(file);
      setThumbnailPreview(URL.createObjectURL(file));
    }
  };

  const removeThumbnail = () => {
    setThumbnail(null);
    setThumbnailPreview(null);
    if (thumbnailInputRef.current) thumbnailInputRef.current.value = '';
  };

  const uploadThumbnail = async () => {
    if (!thumbnail) return null;
    try {
      const formData = new FormData();
      formData.append('file', thumbnail);
      const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
      const response = await api.post('/api/upload', formData, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
      });
      return response.data?.url || response.data?.secure_url;
    } catch { return null; }
  };

  // Generate OBS credentials
  const generateStreamCredentials = async () => {
    setGeneratingCredentials(true);
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
      const response = await api.post('/api/live/generate-key', {
        keyType: 'one-time',
        title: title || 'My Stream'
      }, { headers: { Authorization: `Bearer ${token}` } });

      console.log('Generated credentials:', response.data);

      if (response.data?.success) {
        setStreamCredentials({
          streamKey: response.data.streamKey,
          rtmpUrl: response.data.rtmpUrl || 'rtmps://global-live.mux.com:443/app',
          playbackId: response.data.playbackId,
          muxStreamId: response.data.muxStreamId,
          streamId: response.data.streamId
        });
        setStreamId(response.data.streamId);
        toast.success('Stream credentials generated! Copy them to OBS.');
      }
    } catch (error) {
      console.error('Generate credentials error:', error);
      toast.error(error.response?.data?.error || 'Failed to generate credentials');
    }
    setGeneratingCredentials(false);
  };

  // Check if OBS is connected to Mux
  const checkOBSConnection = async () => {
    if (!streamCredentials?.muxStreamId || isLive) return;
    
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
      const response = await api.get(`/api/live/check-connection/${streamCredentials.muxStreamId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log('OBS connection check:', response.data);
      
      const connected = response.data?.connected;
      const status = response.data?.status || 'idle';
      
      setObsConnected(connected);
      setMuxStreamStatus(status);
      
      // Only try to initialize HLS if connected and HLS.js is loaded
      if (connected && !obsPreviewReady && hlsLoaded) {
        console.log('OBS connected, initializing preview...');
        initializeHLSPreview(streamCredentials.playbackId);
      }
    } catch (error) {
      console.log('Connection check error:', error.message);
    }
  };

  // Initialize HLS preview for OBS
  const initializeHLSPreview = (playbackId) => {
    if (!playbackId || !previewVideoRef.current) {
      console.log('Cannot init HLS: missing playbackId or video ref');
      return;
    }
    
    if (typeof window === 'undefined' || !window.Hls) {
      console.log('HLS.js not loaded yet');
      return;
    }

    const hlsUrl = `https://stream.mux.com/${playbackId}.m3u8`;
    console.log('Initializing HLS preview:', hlsUrl);

    const Hls = window.Hls;
    
    if (Hls.isSupported()) {
      // Destroy existing instance
      if (hlsRef.current) {
        hlsRef.current.destroy();
      }

      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 90
      });

      hls.loadSource(hlsUrl);
      hls.attachMedia(previewVideoRef.current);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        console.log('✅ HLS Preview loaded successfully');
        setObsPreviewReady(true);
        previewVideoRef.current?.play().catch(e => console.log('Autoplay prevented:', e));
      });

      hls.on(Hls.Events.ERROR, (event, data) => {
        console.log('HLS error:', data.type, data.details);
        if (data.fatal) {
          if (data.type === Hls.ErrorTypes.NETWORK_ERROR) {
            console.log('Network error - stream may not be ready yet');
            // Retry after delay
            setTimeout(() => hls.startLoad(), 3000);
          } else if (data.type === Hls.ErrorTypes.MEDIA_ERROR) {
            hls.recoverMediaError();
          }
        }
      });

      hlsRef.current = hls;
    } else if (previewVideoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
      // Safari native
      previewVideoRef.current.src = hlsUrl;
      previewVideoRef.current.addEventListener('loadedmetadata', () => {
        setObsPreviewReady(true);
        previewVideoRef.current?.play().catch(() => {});
      });
    }
  };

  // Camera functions
  const startCamera = async () => {
    setCameraError('');
    try {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => track.stop());
      }
      
      const constraints = {
        video: selectedCamera 
          ? { deviceId: { exact: selectedCamera }, width: { ideal: 1280 }, height: { ideal: 720 } }
          : { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode },
        audio: selectedMic ? { deviceId: { exact: selectedMic } } : true
      };
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      mediaStreamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play().catch(() => {});
      }
      
      enumerateDevices();
      return true;
    } catch (error) {
      console.error('Camera error:', error);
      let errorMsg = 'Unable to access camera';
      if (error.name === 'NotAllowedError') errorMsg = 'Camera permission denied';
      else if (error.name === 'NotFoundError') errorMsg = 'No camera found';
      else if (error.name === 'NotReadableError') errorMsg = 'Camera in use';
      setCameraError(errorMsg);
      return false;
    }
  };

  const stopCamera = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
    if (videoRef.current) videoRef.current.srcObject = null;
  };

  const switchCamera = () => setFacingMode(facingMode === 'user' ? 'environment' : 'user');
  
  const toggleVideo = () => {
    if (mediaStreamRef.current) {
      const track = mediaStreamRef.current.getVideoTracks()[0];
      if (track) { track.enabled = !videoEnabled; setVideoEnabled(!videoEnabled); }
    }
  };
  
  const toggleAudio = () => {
    if (mediaStreamRef.current) {
      const track = mediaStreamRef.current.getAudioTracks()[0];
      if (track) { track.enabled = !audioEnabled; setAudioEnabled(!audioEnabled); }
    }
  };

  const fetchStreamStats = async () => {
    if (!streamId) return;
    try {
      const response = await api.get(`/api/live/${streamId}`);
      if (response.data?.stream) {
        const viewers = response.data.stream.viewers;
        setViewerCount(Array.isArray(viewers) ? viewers.length : (viewers || 0));
      }
    } catch {}
  };

  // Go Live
  const goLive = async () => {
    if (!title.trim()) {
      toast.error('Please enter a title');
      return;
    }

    if (streamMode === STREAM_MODES.CAMERA && !mediaStreamRef.current) {
      toast.error('Camera not available');
      return;
    }

    if (streamMode === STREAM_MODES.SOFTWARE && !obsConnected) {
      toast.error('Please connect OBS first');
      return;
    }

    setLoading(true);
    
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
      let thumbnailUrl = thumbnail ? await uploadThumbnail() : null;

      if (streamMode === STREAM_MODES.SOFTWARE && streamId) {
        // Activate existing OBS stream
        const response = await api.post(`/api/live/${streamId}/activate`, {
          title,
          description,
          privacy,
          thumbnail: thumbnailUrl,
          postToFeed: true
        }, { headers: { Authorization: `Bearer ${token}` } });

        if (response.data?.success) {
          setIsLive(true);
          setStreamDuration(0);
          toast.success('🔴 You are now LIVE!');
        }
      } else {
        // Camera mode - create new stream
        const response = await api.post('/api/live/start', {
          title,
          description,
          streamType: 'camera',
          privacy,
          thumbnail: thumbnailUrl,
          postToFeed: true
        }, { headers: { Authorization: `Bearer ${token}` } });

        if (response.data?.success) {
          setStreamId(response.data.streamId);
          setIsLive(true);
          setStreamDuration(0);
          toast.info('Stream started! Note: Device camera streaming is in preview mode.');
        }
      }
    } catch (error) {
      console.error('Go live error:', error);
      toast.error(error.response?.data?.error || 'Failed to start stream');
    }
    
    setLoading(false);
  };

  // End Stream
  const endStream = async () => {
    if (!streamId) return;
    setLoading(true);
    
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
      await api.post(`/api/live/${streamId}/end`, {}, { headers: { Authorization: `Bearer ${token}` } });
      
      setIsLive(false);
      stopCamera();
      toast.success('Stream ended! Recording will be available soon.');
      
      setTimeout(() => router.push('/tv'), 2000);
    } catch (error) {
      toast.error('Failed to end stream');
    }
    setLoading(false);
  };

  const cleanupExistingStream = async () => {
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
      await api.post('/api/live/cleanup', {}, { headers: { Authorization: `Bearer ${token}` } });
      setShowExistingStreamModal(false);
      setExistingStream(null);
      toast.success('Previous stream cleaned up');
    } catch { toast.error('Failed to cleanup'); }
  };

  const copyToClipboard = async (text, label) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`${label} copied!`);
    } catch { toast.error('Failed to copy'); }
  };

  const formatDuration = (s) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return h > 0 
      ? `${h}:${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`
      : `${m}:${sec.toString().padStart(2, '0')}`;
  };

  return (
    <>
      <Head>
        <title>{isLive ? '🔴 LIVE - ' : ''}Go Live | CYBEV</title>
      </Head>
      
      <Script
        src="https://cdn.jsdelivr.net/npm/hls.js@latest"
        strategy="beforeInteractive"
        onLoad={() => {
          console.log('✅ HLS.js loaded');
          setHlsLoaded(true);
        }}
      />

      <div className="min-h-screen bg-gray-900">
        {/* Header */}
        <header className="bg-gray-800 border-b border-gray-700 px-4 py-3">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/tv">
                <button className="p-2 text-gray-400 hover:text-white rounded-full">
                  <ArrowLeft className="w-5 h-5" />
                </button>
              </Link>
              <div className="flex items-center gap-2">
                {isLive && (
                  <span className="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded flex items-center gap-1">
                    <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                    LIVE
                  </span>
                )}
                <span className="text-white font-semibold">{isLive ? 'Broadcasting' : 'Go Live'}</span>
              </div>
            </div>
            
            {isLive && (
              <div className="flex items-center gap-4 text-white text-sm">
                <div className="flex items-center gap-1"><Eye className="w-4 h-4" />{viewerCount}</div>
                <div className="flex items-center gap-1"><Clock className="w-4 h-4" />{formatDuration(streamDuration)}</div>
              </div>
            )}
          </div>
        </header>

        <div className="max-w-6xl mx-auto p-4">
          <div className="grid lg:grid-cols-3 gap-6">
            
            {/* Main Video Area */}
            <div className="lg:col-span-2">
              {/* Mode selector */}
              {!isLive && (
                <div className="flex gap-2 mb-4">
                  <button
                    onClick={() => setStreamMode(STREAM_MODES.CAMERA)}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition ${
                      streamMode === STREAM_MODES.CAMERA
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    <Smartphone className="w-5 h-5" />
                    Device Camera
                    {webrtcSupported && (
                      <span className="px-1.5 py-0.5 bg-green-500/20 text-green-400 text-xs rounded">Ready</span>
                    )}
                  </button>
                  <button
                    onClick={() => setStreamMode(STREAM_MODES.SOFTWARE)}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition ${
                      streamMode === STREAM_MODES.SOFTWARE
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    <Monitor className="w-5 h-5" />
                    OBS / Software
                  </button>
                </div>
              )}

              {/* Video Preview */}
              <div className="relative bg-black rounded-xl overflow-hidden aspect-video">
                {streamMode === STREAM_MODES.CAMERA ? (
                  <>
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className={`w-full h-full object-cover ${!videoEnabled ? 'hidden' : ''}`}
                    />
                    
                    {!videoEnabled && (
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                        <VideoOff className="w-16 h-16 text-gray-500" />
                      </div>
                    )}
                    
                    {cameraError && (
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-800/90">
                        <div className="text-center p-6">
                          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-3" />
                          <p className="text-white mb-4">{cameraError}</p>
                          <div className="flex gap-2 justify-center">
                            <button onClick={startCamera} className="px-4 py-2 bg-purple-600 text-white rounded-lg">Retry</button>
                            <button onClick={() => setStreamMode(STREAM_MODES.SOFTWARE)} className="px-4 py-2 bg-gray-700 text-white rounded-lg">Use OBS</button>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Camera controls */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
                      <button onClick={toggleVideo} className={`p-3 rounded-full ${videoEnabled ? 'bg-gray-800/80 text-white' : 'bg-red-500 text-white'}`}>
                        {videoEnabled ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
                      </button>
                      <button onClick={toggleAudio} className={`p-3 rounded-full ${audioEnabled ? 'bg-gray-800/80 text-white' : 'bg-red-500 text-white'}`}>
                        {audioEnabled ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                      </button>
                      {devices.video.length > 1 && (
                        <button onClick={switchCamera} className="p-3 rounded-full bg-gray-800/80 text-white">
                          <SwitchCamera className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    {/* OBS Preview */}
                    {obsConnected && obsPreviewReady ? (
                      <video
                        ref={previewVideoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center p-6">
                          {!streamCredentials ? (
                            <>
                              <Key className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                              <p className="text-white mb-2">Generate Stream Key</p>
                              <p className="text-gray-400 text-sm">Click below to get your OBS credentials</p>
                            </>
                          ) : obsConnected ? (
                            <>
                              <Loader2 className="w-12 h-12 text-purple-500 animate-spin mx-auto mb-3" />
                              <p className="text-white mb-2">Loading preview...</p>
                              <p className="text-gray-400 text-sm">OBS is connected, loading video feed...</p>
                            </>
                          ) : (
                            <>
                              <Server className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                              <p className="text-white mb-2">Waiting for OBS connection...</p>
                              <p className="text-gray-400 text-sm mb-2">Copy credentials below and paste in OBS</p>
                              <p className="text-yellow-400 text-xs">Status: {muxStreamStatus}</p>
                            </>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {/* Hidden video for HLS */}
                    {!obsPreviewReady && (
                      <video ref={previewVideoRef} className="hidden" />
                    )}
                  </>
                )}
                
                {/* Live indicator */}
                {isLive && (
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1.5 bg-red-500 text-white text-sm font-bold rounded-lg flex items-center gap-2">
                      <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                      LIVE
                    </span>
                  </div>
                )}
              </div>

              {/* OBS Credentials */}
              {streamMode === STREAM_MODES.SOFTWARE && !isLive && (
                <div className="mt-4 bg-gray-800 rounded-xl p-4">
                  <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                    <Key className="w-5 h-5" />
                    Stream Credentials
                  </h3>
                  
                  {streamCredentials ? (
                    <div className="space-y-3">
                      <div>
                        <label className="text-gray-400 text-sm">Server URL</label>
                        <div className="flex items-center gap-2 mt-1">
                          <input type="text" value={streamCredentials.rtmpUrl} readOnly className="flex-1 px-3 py-2 bg-gray-700 text-white rounded-lg text-sm" />
                          <button onClick={() => copyToClipboard(streamCredentials.rtmpUrl, 'URL')} className="p-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600">
                            <Copy className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      
                      <div>
                        <label className="text-gray-400 text-sm">Stream Key</label>
                        <div className="flex items-center gap-2 mt-1">
                          <input type={showStreamKey ? 'text' : 'password'} value={streamCredentials.streamKey} readOnly className="flex-1 px-3 py-2 bg-gray-700 text-white rounded-lg text-sm font-mono" />
                          <button onClick={() => setShowStreamKey(!showStreamKey)} className="p-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600">
                            {showStreamKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                          <button onClick={() => copyToClipboard(streamCredentials.streamKey, 'Key')} className="p-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600">
                            <Copy className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      
                      {/* Connection status */}
                      <div className={`flex items-center gap-2 p-3 rounded-lg ${obsConnected ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                        {obsConnected ? (
                          <><CheckCircle className="w-5 h-5" />OBS Connected - Ready to go live!</>
                        ) : (
                          <><AlertCircle className="w-5 h-5" />Waiting for OBS... Start streaming in OBS to continue</>
                        )}
                      </div>
                      
                      {/* Debug info */}
                      <div className="text-xs text-gray-500">
                        Playback ID: {streamCredentials.playbackId || 'N/A'} | 
                        Status: {muxStreamStatus} | 
                        HLS.js: {hlsLoaded ? 'Ready' : 'Loading'}
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={generateStreamCredentials}
                      disabled={generatingCredentials}
                      className="w-full py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {generatingCredentials ? <Loader2 className="w-5 h-5 animate-spin" /> : <Key className="w-5 h-5" />}
                      {generatingCredentials ? 'Generating...' : 'Generate Stream Key'}
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              <div className="bg-gray-800 rounded-xl p-4">
                <h3 className="text-white font-semibold mb-4">Stream Details</h3>
                
                <div className="mb-4">
                  <label className="text-gray-400 text-sm">Title *</label>
                  <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Stream title" disabled={isLive} className="w-full mt-1 px-3 py-2 bg-gray-700 text-white rounded-lg disabled:opacity-50" />
                </div>
                
                <div className="mb-4">
                  <label className="text-gray-400 text-sm">Description</label>
                  <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" disabled={isLive} rows={3} className="w-full mt-1 px-3 py-2 bg-gray-700 text-white rounded-lg disabled:opacity-50 resize-none" />
                </div>
                
                <div className="mb-4">
                  <label className="text-gray-400 text-sm">Privacy</label>
                  <div className="relative mt-1">
                    <button onClick={() => !isLive && setShowPrivacyDropdown(!showPrivacyDropdown)} disabled={isLive} className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg flex items-center justify-between disabled:opacity-50">
                      <span>{PRIVACY_OPTIONS.find(p => p.value === privacy)?.label}</span>
                      <ChevronDown className="w-4 h-4" />
                    </button>
                    {showPrivacyDropdown && (
                      <div className="absolute z-10 w-full mt-1 bg-gray-700 rounded-lg shadow-lg overflow-hidden">
                        {PRIVACY_OPTIONS.map(o => (
                          <button key={o.value} onClick={() => { setPrivacy(o.value); setShowPrivacyDropdown(false); }} className="w-full px-3 py-2 text-left text-white hover:bg-gray-600">{o.label}</button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                
                {!isLive && (
                  <div className="mb-4">
                    <label className="text-gray-400 text-sm">Thumbnail</label>
                    <div className="mt-1">
                      {thumbnailPreview ? (
                        <div className="relative">
                          <img src={thumbnailPreview} alt="" className="w-full h-32 object-cover rounded-lg" />
                          <button onClick={removeThumbnail} className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <button onClick={() => thumbnailInputRef.current?.click()} className="w-full h-24 border-2 border-dashed border-gray-600 rounded-lg flex flex-col items-center justify-center text-gray-400 hover:border-purple-500">
                          <Upload className="w-6 h-6 mb-1" /><span className="text-sm">Upload</span>
                        </button>
                      )}
                      <input ref={thumbnailInputRef} type="file" accept="image/*" onChange={handleThumbnailSelect} className="hidden" />
                    </div>
                  </div>
                )}
              </div>

              {/* Action Button */}
              {isLive ? (
                <button onClick={endStream} disabled={loading} className="w-full py-4 bg-red-600 text-white rounded-xl font-bold text-lg hover:bg-red-700 disabled:opacity-50 flex items-center justify-center gap-2">
                  {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <><StopCircle className="w-6 h-6" />End Stream</>}
                </button>
              ) : (
                <button onClick={goLive} disabled={loading || !title.trim() || (streamMode === STREAM_MODES.SOFTWARE && !obsConnected)} className="w-full py-4 bg-red-600 text-white rounded-xl font-bold text-lg hover:bg-red-700 disabled:opacity-50 flex items-center justify-center gap-2">
                  {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <><Radio className="w-6 h-6" />Go Live</>}
                </button>
              )}

              {/* Checklist */}
              {!isLive && (
                <div className="bg-gray-800 rounded-xl p-4">
                  <h3 className="text-white font-semibold mb-3">Ready?</h3>
                  <div className="space-y-2 text-sm">
                    <div className={title.trim() ? 'text-green-400' : 'text-gray-400'}>
                      {title.trim() ? <CheckCircle className="w-4 h-4 inline mr-2" /> : '○ '}Title added
                    </div>
                    {streamMode === STREAM_MODES.CAMERA ? (
                      <div className={mediaStreamRef.current ? 'text-green-400' : 'text-gray-400'}>
                        {mediaStreamRef.current ? <CheckCircle className="w-4 h-4 inline mr-2" /> : '○ '}Camera ready
                      </div>
                    ) : (
                      <div className={obsConnected ? 'text-green-400' : 'text-gray-400'}>
                        {obsConnected ? <CheckCircle className="w-4 h-4 inline mr-2" /> : '○ '}OBS connected
                      </div>
                    )}
                    <div className="text-blue-400"><Sparkles className="w-4 h-4 inline mr-2" />Posts to feed</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Existing Stream Modal */}
      {showExistingStreamModal && existingStream && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-white mb-4">Existing Stream</h3>
            <p className="text-gray-300 mb-4">Active stream: <strong>{existingStream.title || 'Untitled'}</strong></p>
            <div className="flex gap-3">
              <button onClick={() => router.push(`/live/${existingStream._id}`)} className="flex-1 py-2 bg-purple-600 text-white rounded-lg">Continue</button>
              <button onClick={cleanupExistingStream} className="flex-1 py-2 bg-gray-700 text-white rounded-lg">Start Fresh</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
