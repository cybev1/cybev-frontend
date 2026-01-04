// ============================================
// FILE: src/pages/live/go-live.jsx
// Facebook Live-Style Streaming - Camera + OBS Support
// With Thumbnail Upload & Auto Feed Post
// ============================================

import { useState, useEffect, useRef, useCallback } from 'react';
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
  Image, Upload, Trash2
} from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'react-toastify';

// Streaming modes
const STREAM_MODES = {
  CAMERA: 'camera',
  SOFTWARE: 'software'
};

// Privacy options
const PRIVACY_OPTIONS = [
  { value: 'public', label: 'Public', icon: Globe, desc: 'Anyone can watch' },
  { value: 'followers', label: 'Followers', icon: Users, desc: 'Only followers can watch' },
  { value: 'private', label: 'Private', icon: Lock, desc: 'Only you can watch' }
];

// Stream key types
const KEY_TYPES = {
  PERSISTENT: 'persistent',
  ONE_TIME: 'one-time'
};

export default function GoLivePage() {
  const router = useRouter();
  const videoRef = useRef(null);
  const previewVideoRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const hlsRef = useRef(null);
  const thumbnailInputRef = useRef(null);
  
  // User state
  const [user, setUser] = useState(null);
  
  // Streaming mode
  const [streamMode, setStreamMode] = useState(STREAM_MODES.CAMERA);
  
  // Stream state
  const [isLive, setIsLive] = useState(false);
  const [isPreview, setIsPreview] = useState(true);
  const [loading, setLoading] = useState(false);
  const [streamId, setStreamId] = useState(null);
  const [streamDuration, setStreamDuration] = useState(0);
  
  // Camera state
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [cameraError, setCameraError] = useState('');
  const [facingMode, setFacingMode] = useState('user');
  const [devices, setDevices] = useState({ video: [], audio: [] });
  const [selectedCamera, setSelectedCamera] = useState('');
  const [selectedMic, setSelectedMic] = useState('');
  const [showDeviceSettings, setShowDeviceSettings] = useState(false);
  
  // Stream settings
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [privacy, setPrivacy] = useState('public');
  const [showPrivacyDropdown, setShowPrivacyDropdown] = useState(false);
  
  // Thumbnail state
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [uploadingThumbnail, setUploadingThumbnail] = useState(false);
  
  // OBS/Software streaming state
  const [streamCredentials, setStreamCredentials] = useState(null);
  const [keyType, setKeyType] = useState(KEY_TYPES.ONE_TIME);
  const [showStreamKey, setShowStreamKey] = useState(false);
  const [generatingCredentials, setGeneratingCredentials] = useState(false);
  const [obsConnected, setObsConnected] = useState(false);
  const [obsPreviewReady, setObsPreviewReady] = useState(false);
  const [checkingConnection, setCheckingConnection] = useState(false);
  
  // Mux details (for when live)
  const [muxDetails, setMuxDetails] = useState(null);
  
  // Viewer stats
  const [viewerCount, setViewerCount] = useState(0);
  const [likeCount, setLikeCount] = useState(0);
  const [comments, setComments] = useState([]);
  
  // Connection state
  const [connectionQuality, setConnectionQuality] = useState('good');
  
  // Existing stream check
  const [existingStream, setExistingStream] = useState(null);
  const [showExistingStreamModal, setShowExistingStreamModal] = useState(false);

  // Initialize
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
      checkExistingStream();
      loadPersistentCredentials();
    } else {
      router.push('/auth/login');
      return;
    }
    
    enumerateDevices();
    
    return () => {
      stopCamera();
      destroyHls();
    };
  }, []);

  // Start camera when mode is camera
  useEffect(() => {
    if (streamMode === STREAM_MODES.CAMERA && !isLive) {
      const timer = setTimeout(() => startCamera(), 500);
      return () => clearTimeout(timer);
    } else if (streamMode === STREAM_MODES.SOFTWARE) {
      stopCamera();
    }
  }, [streamMode, selectedCamera, selectedMic]);

  // Stream duration timer
  useEffect(() => {
    let interval;
    if (isLive) {
      interval = setInterval(() => {
        setStreamDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isLive]);

  // Poll for OBS connection when credentials exist
  useEffect(() => {
    let interval;
    if (streamMode === STREAM_MODES.SOFTWARE && streamCredentials && !isLive) {
      interval = setInterval(checkOBSConnection, 3000);
    }
    return () => clearInterval(interval);
  }, [streamMode, streamCredentials, isLive]);

  // Poll for stats when live
  useEffect(() => {
    let interval;
    if (isLive && streamId) {
      interval = setInterval(fetchStreamStats, 5000);
    }
    return () => clearInterval(interval);
  }, [isLive, streamId]);

  const destroyHls = () => {
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }
  };

  const loadPersistentCredentials = async () => {
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
      const response = await api.get('/api/live/stream-key', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data?.credentials) {
        setStreamCredentials(response.data.credentials);
        setKeyType(KEY_TYPES.PERSISTENT);
      }
    } catch (error) {
      console.log('No persistent credentials found');
    }
  };

  const enumerateDevices = async () => {
    try {
      const deviceList = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = deviceList.filter(d => d.kind === 'videoinput');
      const audioDevices = deviceList.filter(d => d.kind === 'audioinput');
      
      setDevices({ video: videoDevices, audio: audioDevices });
      
      if (videoDevices.length > 0 && !selectedCamera) {
        setSelectedCamera(videoDevices[0].deviceId);
      }
      if (audioDevices.length > 0 && !selectedMic) {
        setSelectedMic(audioDevices[0].deviceId);
      }
    } catch (error) {
      console.error('Device enumeration failed:', error);
    }
  };

  const checkExistingStream = async () => {
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
      const response = await api.get('/api/live/my-stream', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data?.hasActiveStream && response.data?.stream) {
        setExistingStream(response.data.stream);
        setShowExistingStreamModal(true);
      }
    } catch (error) {
      console.log('No existing stream found');
    }
  };

  // ==========================================
  // THUMBNAIL HANDLING
  // ==========================================
  
  const handleThumbnailSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be less than 5MB');
      return;
    }
    
    setThumbnail(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setThumbnailPreview(e.target.result);
    };
    reader.readAsDataURL(file);
    
    toast.success('Thumbnail selected!');
  };

  const uploadThumbnail = async () => {
    if (!thumbnail) return null;
    
    setUploadingThumbnail(true);
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
      const formData = new FormData();
      formData.append('file', thumbnail);
      formData.append('type', 'stream-thumbnail');
      
      const response = await api.post('/api/upload', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      
      return response.data?.url || response.data?.fileUrl || null;
    } catch (error) {
      console.error('Thumbnail upload failed:', error);
      toast.error('Failed to upload thumbnail');
      return null;
    } finally {
      setUploadingThumbnail(false);
    }
  };

  const removeThumbnail = () => {
    setThumbnail(null);
    setThumbnailPreview(null);
    if (thumbnailInputRef.current) {
      thumbnailInputRef.current.value = '';
    }
  };

  // Generate stream credentials for OBS
  const generateStreamCredentials = async (type = KEY_TYPES.ONE_TIME) => {
    setGeneratingCredentials(true);
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
      
      const response = await api.post('/api/live/generate-key', {
        keyType: type,
        title: title || 'My Stream'
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data?.success) {
        const creds = {
          streamKey: response.data.streamKey,
          rtmpUrl: response.data.rtmpUrl || 'rtmps://global-live.mux.com:443/app',
          playbackId: response.data.playbackId,
          muxStreamId: response.data.muxStreamId,
          streamId: response.data.streamId
        };
        
        setStreamCredentials(creds);
        setKeyType(type);
        setStreamId(response.data.streamId);
        
        toast.success('Stream credentials generated! Copy them to your streaming software.');
      }
    } catch (error) {
      console.error('Generate credentials error:', error);
      toast.error(error.response?.data?.error || 'Failed to generate stream credentials');
    }
    setGeneratingCredentials(false);
  };

  // Check if OBS is connected and streaming
  const checkOBSConnection = async () => {
    if (!streamCredentials?.muxStreamId) return;
    
    setCheckingConnection(true);
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
      const response = await api.get(`/api/live/check-connection/${streamCredentials.muxStreamId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data?.connected || response.data?.status === 'active') {
        if (!obsConnected) {
          setObsConnected(true);
          toast.success('🎬 OBS connected! Preview is now available.');
          initPreviewPlayer();
        }
      } else {
        setObsConnected(false);
        setObsPreviewReady(false);
      }
    } catch (error) {
      console.log('Connection check failed');
    }
    setCheckingConnection(false);
  };

  // Initialize HLS preview player for OBS stream
  const initPreviewPlayer = () => {
    if (!streamCredentials?.playbackId || !previewVideoRef.current) return;
    
    const hlsUrl = `https://stream.mux.com/${streamCredentials.playbackId}.m3u8`;
    
    const initHls = () => {
      if (typeof window === 'undefined' || !window.Hls) {
        setTimeout(initHls, 500);
        return;
      }
      
      const Hls = window.Hls;
      destroyHls();
      
      if (Hls.isSupported()) {
        const hls = new Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        
        hls.loadSource(hlsUrl);
        hls.attachMedia(previewVideoRef.current);
        
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          console.log('✅ Preview HLS loaded');
          setObsPreviewReady(true);
          previewVideoRef.current?.play().catch(() => {});
        });
        
        hls.on(Hls.Events.ERROR, (event, data) => {
          if (data.fatal) {
            console.log('HLS preview error, retrying...');
            setTimeout(initPreviewPlayer, 2000);
          }
        });
        
        hlsRef.current = hls;
      } else if (previewVideoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
        previewVideoRef.current.src = hlsUrl;
        previewVideoRef.current.addEventListener('loadedmetadata', () => {
          setObsPreviewReady(true);
          previewVideoRef.current?.play().catch(() => {});
        });
      }
    };
    
    initHls();
  };

  const startCamera = async () => {
    try {
      setCameraError('');
      
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error('Camera API not supported in this browser');
      }
      
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => track.stop());
      }
      
      const constraints = {
        video: selectedCamera ? { deviceId: { exact: selectedCamera } } : {
          width: { ideal: 1280, min: 640 },
          height: { ideal: 720, min: 480 },
          facingMode: facingMode
        },
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
      handleCameraError(error);
      return false;
    }
  };

  const handleCameraError = (error) => {
    let errorMsg = 'Unable to access camera';
    
    if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
      errorMsg = 'Camera permission denied. Please allow camera access and refresh.';
    } else if (error.name === 'NotFoundError') {
      errorMsg = 'No camera found. Connect a camera or switch to OBS streaming.';
    } else if (error.name === 'NotReadableError') {
      errorMsg = 'Camera in use by another app. Close other apps using the camera.';
    } else if (error.name === 'OverconstrainedError') {
      navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then(stream => {
          mediaStreamRef.current = stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play().catch(() => {});
          }
          setCameraError('');
        })
        .catch(() => setCameraError('Camera settings not supported.'));
      return;
    }
    
    setCameraError(errorMsg);
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

  const switchCamera = async () => {
    const newMode = facingMode === 'user' ? 'environment' : 'user';
    setFacingMode(newMode);
    
    const videoDevices = devices.video;
    if (videoDevices.length > 1) {
      const currentIndex = videoDevices.findIndex(d => d.deviceId === selectedCamera);
      const nextIndex = (currentIndex + 1) % videoDevices.length;
      setSelectedCamera(videoDevices[nextIndex].deviceId);
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

  const fetchStreamStats = async () => {
    if (!streamId) return;
    try {
      const response = await api.get(`/api/live/${streamId}`);
      if (response.data?.stream) {
        setViewerCount(response.data.stream.viewers || 0);
        setLikeCount(response.data.stream.likes?.length || 0);
        setComments(response.data.stream.comments || []);
      }
    } catch {}
  };

  // ==========================================
  // GO LIVE - With thumbnail & auto feed post
  // ==========================================
  const goLive = async () => {
    if (!title.trim()) {
      toast.error('Please enter a title for your stream');
      return;
    }

    if (streamMode === STREAM_MODES.CAMERA && !mediaStreamRef.current) {
      toast.error('Camera not available. Please allow camera access or use OBS.');
      return;
    }

    if (streamMode === STREAM_MODES.SOFTWARE && !obsConnected) {
      toast.error('Please connect your streaming software first');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
      
      // Upload thumbnail if selected
      let thumbnailUrl = null;
      if (thumbnail) {
        toast.info('Uploading thumbnail...');
        thumbnailUrl = await uploadThumbnail();
      }
      
      if (streamMode === STREAM_MODES.SOFTWARE && streamId) {
        // Activate existing stream (OBS mode)
        const response = await api.post(`/api/live/${streamId}/activate`, {
          title,
          description,
          privacy,
          thumbnail: thumbnailUrl,
          postToFeed: true // Always post to feed
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.data?.success) {
          setIsLive(true);
          setIsPreview(false);
          setStreamDuration(0);
          toast.success('🔴 You are now LIVE! Posted to feed.');
        }
      } else {
        // Start new stream (camera mode)
        const response = await api.post('/api/live/start', {
          title,
          description,
          streamType: 'camera',
          privacy,
          lowLatency: true,
          thumbnail: thumbnailUrl,
          postToFeed: true
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.data?.success || response.data?.stream) {
          const newStreamId = response.data.stream?._id || response.data.streamId;
          setStreamId(newStreamId);
          setIsLive(true);
          setIsPreview(false);
          setStreamDuration(0);
          
          if (response.data?.mux) {
            setMuxDetails(response.data.mux);
          }
          
          toast.success('🔴 You are now LIVE! Posted to feed.');
        }
      }
    } catch (error) {
      console.error('Go live error:', error);
      
      if (error.response?.status === 400 && error.response?.data?.error?.includes('active stream')) {
        toast.info('Cleaning up previous stream...');
        await cleanupExistingStreams();
        return goLive();
      }
      
      toast.error(error.response?.data?.error || 'Failed to go live');
    }
    setLoading(false);
  };

  const cleanupExistingStreams = async () => {
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
      await api.post('/api/live/cleanup', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return true;
    } catch {
      return false;
    }
  };

  const endLiveStream = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
      
      if (streamId) {
        await api.post(`/api/live/${streamId}/end`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await cleanupExistingStreams();
      }
      
      setIsLive(false);
      stopCamera();
      destroyHls();
      toast.success('Stream ended! Your recording will be available soon.');
      router.push('/live');
    } catch (error) {
      console.error('End stream error:', error);
      await cleanupExistingStreams();
      setIsLive(false);
      stopCamera();
      router.push('/live');
    }
    setLoading(false);
  };

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied!`);
  };

  const formatDuration = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const resumeExistingStream = () => {
    if (existingStream) {
      setStreamId(existingStream._id);
      setTitle(existingStream.title || '');
      setDescription(existingStream.description || '');
      setIsLive(true);
      setIsPreview(false);
      setShowExistingStreamModal(false);
      
      if (existingStream.muxStreamKey) {
        setStreamCredentials({
          streamKey: existingStream.muxStreamKey,
          rtmpUrl: existingStream.muxRtmpUrl || 'rtmps://global-live.mux.com:443/app',
          playbackId: existingStream.muxPlaybackId,
          muxStreamId: existingStream.muxStreamId
        });
        setStreamMode(STREAM_MODES.SOFTWARE);
        setObsConnected(true);
      }
      
      toast.success('Resumed your live stream!');
    }
  };

  const endExistingAndStartNew = async () => {
    setShowExistingStreamModal(false);
    setLoading(true);
    await cleanupExistingStreams();
    setExistingStream(null);
    setStreamCredentials(null);
    setLoading(false);
    toast.success('Previous stream ended. You can start a new one.');
  };

  const resetStreamCredentials = async () => {
    setStreamCredentials(null);
    setObsConnected(false);
    setObsPreviewReady(false);
    setStreamId(null);
    destroyHls();
  };

  const selectedPrivacy = PRIVACY_OPTIONS.find(p => p.value === privacy);
  
  const canGoLive = title.trim() && (
    (streamMode === STREAM_MODES.CAMERA && mediaStreamRef.current) ||
    (streamMode === STREAM_MODES.SOFTWARE && obsConnected)
  );

  return (
    <>
      <Head>
        <title>{isLive ? '🔴 LIVE' : 'Go Live'} | CYBEV</title>
      </Head>
      
      <Script 
        src="https://cdn.jsdelivr.net/npm/hls.js@latest" 
        strategy="beforeInteractive"
      />

      <div className="min-h-screen bg-gray-900">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-gray-900/95 backdrop-blur border-b border-gray-800">
          <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => isLive ? null : router.back()} 
                className={`p-2 rounded-full ${isLive ? 'text-gray-600' : 'text-white hover:bg-gray-800'}`}
                disabled={isLive}
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <div className="flex items-center gap-2">
                <Radio className={`w-5 h-5 ${isLive ? 'text-red-500 animate-pulse' : 'text-white'}`} />
                <span className="text-white font-bold text-lg">
                  {isLive ? 'Live Now' : 'Go Live'}
                </span>
              </div>
            </div>
            
            {isLive && (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-white">
                  <Clock className="w-4 h-4" />
                  <span className="font-mono">{formatDuration(streamDuration)}</span>
                </div>
                <div className="flex items-center gap-2 text-white">
                  <Eye className="w-4 h-4" />
                  <span>{viewerCount}</span>
                </div>
                <div className="flex items-center gap-2 text-pink-500">
                  <Heart className="w-4 h-4" />
                  <span>{likeCount}</span>
                </div>
              </div>
            )}
            
            <div className="flex items-center gap-2">
              {isLive ? (
                <button
                  onClick={endLiveStream}
                  disabled={loading}
                  className="px-5 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 flex items-center gap-2 transition"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <X className="w-4 h-4" />}
                  End Stream
                </button>
              ) : (
                <button
                  onClick={goLive}
                  disabled={loading || !canGoLive}
                  className="px-5 py-2 bg-gradient-to-r from-red-600 to-pink-600 text-white font-semibold rounded-lg hover:from-red-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Radio className="w-4 h-4" />}
                  Go Live
                </button>
              )}
            </div>
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-4 py-6">
          {/* Mode Selector */}
          {!isLive && (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-5 h-5 text-purple-400" />
                <h2 className="text-white font-semibold">Choose how to stream</h2>
              </div>
              <div className="grid grid-cols-2 gap-4 max-w-2xl">
                <button
                  onClick={() => { setStreamMode(STREAM_MODES.CAMERA); resetStreamCredentials(); }}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    streamMode === STREAM_MODES.CAMERA
                      ? 'border-purple-500 bg-purple-500/10'
                      : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`p-2 rounded-lg ${streamMode === STREAM_MODES.CAMERA ? 'bg-purple-500' : 'bg-gray-700'}`}>
                      <Camera className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-left">
                      <h3 className="text-white font-semibold">Use Camera</h3>
                      <p className="text-gray-400 text-sm">Stream directly from your device</p>
                    </div>
                  </div>
                  {streamMode === STREAM_MODES.CAMERA && (
                    <div className="flex items-center gap-1 text-purple-400 text-xs mt-2">
                      <CheckCircle className="w-3 h-3" />
                      <span>Selected</span>
                    </div>
                  )}
                </button>

                <button
                  onClick={() => { setStreamMode(STREAM_MODES.SOFTWARE); stopCamera(); }}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    streamMode === STREAM_MODES.SOFTWARE
                      ? 'border-purple-500 bg-purple-500/10'
                      : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`p-2 rounded-lg ${streamMode === STREAM_MODES.SOFTWARE ? 'bg-purple-500' : 'bg-gray-700'}`}>
                      <Monitor className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-left">
                      <h3 className="text-white font-semibold">Use Software</h3>
                      <p className="text-gray-400 text-sm">OBS, Streamlabs, vMix, etc.</p>
                    </div>
                  </div>
                  {streamMode === STREAM_MODES.SOFTWARE && (
                    <div className="flex items-center gap-1 text-purple-400 text-xs mt-2">
                      <CheckCircle className="w-3 h-3" />
                      <span>Selected</span>
                    </div>
                  )}
                </button>
              </div>
            </div>
          )}

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main Preview Area */}
            <div className="lg:col-span-2 space-y-4">
              {/* Video Preview */}
              <div className="relative bg-black rounded-xl overflow-hidden aspect-video">
                {isLive && (
                  <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
                    <div className="px-3 py-1 bg-red-600 text-white text-sm font-bold rounded-lg flex items-center gap-2">
                      <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                      LIVE
                    </div>
                    <div className="px-3 py-1 bg-black/60 backdrop-blur text-white text-sm rounded-lg flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      {viewerCount}
                    </div>
                  </div>
                )}

                {!isLive && (
                  <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
                    <span className="px-3 py-1 bg-gray-800/80 backdrop-blur text-white text-sm rounded-lg">
                      {streamMode === STREAM_MODES.SOFTWARE && obsConnected ? 'Preview' : 'Setup'}
                    </span>
                    {streamMode === STREAM_MODES.SOFTWARE && obsConnected && (
                      <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-lg flex items-center gap-1">
                        <Wifi className="w-3 h-3" />
                        OBS Connected
                      </span>
                    )}
                  </div>
                )}

                {/* Camera Mode */}
                {streamMode === STREAM_MODES.CAMERA && (
                  <>
                    <video
                      ref={videoRef}
                      autoPlay
                      muted
                      playsInline
                      className={`w-full h-full object-cover ${!videoEnabled ? 'hidden' : ''}`}
                    />
                    
                    {cameraError && (
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                        <div className="text-center p-6 max-w-md">
                          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
                          <p className="text-white font-semibold mb-2">Camera Unavailable</p>
                          <p className="text-gray-400 text-sm mb-4">{cameraError}</p>
                          <div className="flex gap-2 justify-center">
                            <button onClick={startCamera} className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm flex items-center gap-2">
                              <RefreshCw className="w-4 h-4" />
                              Try Again
                            </button>
                            <button onClick={() => setStreamMode(STREAM_MODES.SOFTWARE)} className="px-4 py-2 bg-gray-700 text-white rounded-lg text-sm flex items-center gap-2">
                              <Monitor className="w-4 h-4" />
                              Use OBS
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {!videoEnabled && !cameraError && (
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                        <div className="text-center">
                          <VideoOff className="w-16 h-16 text-gray-500 mx-auto mb-2" />
                          <p className="text-gray-400">Camera Off</p>
                        </div>
                      </div>
                    )}

                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3 z-10">
                      <button onClick={toggleVideo} className={`p-3 rounded-full transition ${videoEnabled ? 'bg-gray-700/80 text-white' : 'bg-red-600 text-white'}`}>
                        {videoEnabled ? <Video className="w-6 h-6" /> : <VideoOff className="w-6 h-6" />}
                      </button>
                      <button onClick={toggleAudio} className={`p-3 rounded-full transition ${audioEnabled ? 'bg-gray-700/80 text-white' : 'bg-red-600 text-white'}`}>
                        {audioEnabled ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
                      </button>
                      {devices.video.length > 1 && (
                        <button onClick={switchCamera} className="p-3 bg-gray-700/80 text-white rounded-full">
                          <SwitchCamera className="w-6 h-6" />
                        </button>
                      )}
                      <button onClick={() => setShowDeviceSettings(!showDeviceSettings)} className={`p-3 rounded-full transition ${showDeviceSettings ? 'bg-purple-600' : 'bg-gray-700/80'} text-white`}>
                        <Settings className="w-6 h-6" />
                      </button>
                    </div>
                  </>
                )}

                {/* Software Mode */}
                {streamMode === STREAM_MODES.SOFTWARE && (
                  <>
                    {obsConnected && obsPreviewReady && (
                      <video ref={previewVideoRef} autoPlay muted playsInline className="w-full h-full object-contain bg-black" />
                    )}
                    
                    {obsConnected && !obsPreviewReady && (
                      <video ref={previewVideoRef} autoPlay muted playsInline className="hidden" />
                    )}

                    {(!streamCredentials || !obsConnected) && (
                      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
                        {!streamCredentials ? (
                          <div className="text-center p-6">
                            <div className="w-20 h-20 bg-purple-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                              <Key className="w-10 h-10 text-purple-400" />
                            </div>
                            <h3 className="text-white font-semibold text-lg mb-2">Generate Stream Key</h3>
                            <p className="text-gray-400 text-sm max-w-xs mb-4">
                              Get your unique stream credentials to use with OBS, Streamlabs, or other software
                            </p>
                            <button
                              onClick={() => generateStreamCredentials(keyType)}
                              disabled={generatingCredentials}
                              className="px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 flex items-center gap-2 mx-auto"
                            >
                              {generatingCredentials ? <Loader2 className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5" />}
                              Generate Credentials
                            </button>
                          </div>
                        ) : (
                          <div className="text-center p-6">
                            <Loader2 className="w-12 h-12 text-purple-500 animate-spin mx-auto mb-4" />
                            <h3 className="text-white font-semibold text-lg mb-2">Waiting for OBS...</h3>
                            <p className="text-gray-400 text-sm">Start streaming in your software to see preview</p>
                            {checkingConnection && <p className="text-purple-400 text-xs mt-2">Checking connection...</p>}
                          </div>
                        )}
                      </div>
                    )}

                    {obsConnected && !obsPreviewReady && (
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
                        <div className="text-center">
                          <Loader2 className="w-10 h-10 text-purple-500 animate-spin mx-auto mb-3" />
                          <p className="text-white">Loading preview...</p>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Device Settings Panel */}
              {showDeviceSettings && streamMode === STREAM_MODES.CAMERA && (
                <div className="bg-gray-800 rounded-xl p-4 space-y-4">
                  <h3 className="text-white font-semibold flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    Device Settings
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-gray-400 text-sm mb-2 block">Camera</label>
                      <select value={selectedCamera} onChange={(e) => setSelectedCamera(e.target.value)} className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg">
                        {devices.video.map(device => (
                          <option key={device.deviceId} value={device.deviceId}>
                            {device.label || `Camera ${devices.video.indexOf(device) + 1}`}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-gray-400 text-sm mb-2 block">Microphone</label>
                      <select value={selectedMic} onChange={(e) => setSelectedMic(e.target.value)} className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg">
                        {devices.audio.map(device => (
                          <option key={device.deviceId} value={device.deviceId}>
                            {device.label || `Microphone ${devices.audio.indexOf(device) + 1}`}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Stream Credentials Panel */}
              {streamMode === STREAM_MODES.SOFTWARE && streamCredentials && (
                <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 rounded-xl p-5 border border-purple-500/30">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-white font-semibold flex items-center gap-2">
                      <Server className="w-5 h-5 text-purple-400" />
                      Stream Credentials
                    </h3>
                    <div className="flex items-center gap-2">
                      {obsConnected ? (
                        <span className="flex items-center gap-1 text-green-400 text-sm">
                          <CheckCircle className="w-4 h-4" />
                          Connected
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-yellow-400 text-sm">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Waiting...
                        </span>
                      )}
                      <button onClick={resetStreamCredentials} className="p-1 text-gray-400 hover:text-white" title="Reset credentials">
                        <RotateCcw className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-black/30 rounded-lg p-3">
                      <label className="text-gray-300 text-xs mb-1 block flex items-center gap-1">
                        <Server className="w-3 h-3" />
                        Server / RTMP URL
                      </label>
                      <div className="flex gap-2">
                        <input type="text" value={streamCredentials.rtmpUrl} readOnly className="flex-1 px-3 py-2 bg-gray-800 text-white rounded-lg text-sm font-mono" />
                        <button onClick={() => copyToClipboard(streamCredentials.rtmpUrl, 'Server URL')} className="px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="bg-black/30 rounded-lg p-3">
                      <label className="text-gray-300 text-xs mb-1 block flex items-center gap-1">
                        <Key className="w-3 h-3" />
                        Stream Key (keep secret!)
                      </label>
                      <div className="flex gap-2">
                        <input type={showStreamKey ? 'text' : 'password'} value={streamCredentials.streamKey} readOnly className="flex-1 px-3 py-2 bg-gray-800 text-white rounded-lg text-sm font-mono" />
                        <button onClick={() => setShowStreamKey(!showStreamKey)} className="px-3 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600">
                          {showStreamKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                        <button onClick={() => copyToClipboard(streamCredentials.streamKey, 'Stream Key')} className="px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="bg-blue-900/30 border border-blue-700/50 rounded-lg p-3">
                      <p className="text-blue-300 text-sm">
                        <strong>📺 How to connect:</strong><br />
                        1. Open OBS/Streamlabs → Settings → Stream<br />
                        2. Service: <strong>Custom</strong> → Paste Server URL<br />
                        3. Paste Stream Key → Apply → <strong>Start Streaming</strong><br />
                        4. Wait for preview, then click <strong>Go Live</strong>
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              {/* Stream Info */}
              <div className="bg-gray-800 rounded-xl p-4">
                <h3 className="text-white font-semibold mb-4">Stream Details</h3>
                
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
                      disabled={isLive}
                    />
                    <p className="text-gray-500 text-xs mt-1">{title.length}/100</p>
                  </div>
                  
                  <div>
                    <label className="text-gray-400 text-sm mb-1 block">Description</label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Tell viewers what to expect..."
                      rows={3}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
                      disabled={isLive}
                    />
                  </div>

                  {/* ==========================================
                      THUMBNAIL UPLOAD SECTION
                      ========================================== */}
                  {!isLive && (
                    <div>
                      <label className="text-gray-400 text-sm mb-2 block flex items-center gap-2">
                        <Image className="w-4 h-4" />
                        Thumbnail (optional)
                      </label>
                      
                      {thumbnailPreview ? (
                        <div className="relative">
                          <img 
                            src={thumbnailPreview} 
                            alt="Thumbnail preview" 
                            className="w-full h-32 object-cover rounded-lg"
                          />
                          <button
                            onClick={removeThumbnail}
                            className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-full hover:bg-red-700 transition"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/60 backdrop-blur rounded text-white text-xs">
                            Custom thumbnail
                          </div>
                        </div>
                      ) : (
                        <div 
                          onClick={() => thumbnailInputRef.current?.click()}
                          className="w-full h-32 border-2 border-dashed border-gray-600 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-purple-500 hover:bg-purple-500/5 transition"
                        >
                          <Upload className="w-8 h-8 text-gray-500 mb-2" />
                          <p className="text-gray-400 text-sm">Click to upload</p>
                          <p className="text-gray-500 text-xs">or auto-generate from stream</p>
                        </div>
                      )}
                      
                      <input
                        ref={thumbnailInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleThumbnailSelect}
                        className="hidden"
                      />
                      
                      {!thumbnailPreview && (
                        <p className="text-gray-500 text-xs mt-2">
                          💡 If no thumbnail is uploaded, one will be auto-generated from your stream
                        </p>
                      )}
                    </div>
                  )}

                  {/* Privacy */}
                  <div>
                    <label className="text-gray-400 text-sm mb-1 block">Privacy</label>
                    <div className="relative">
                      <button
                        onClick={() => !isLive && setShowPrivacyDropdown(!showPrivacyDropdown)}
                        className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg flex items-center justify-between"
                        disabled={isLive}
                      >
                        <div className="flex items-center gap-2">
                          {selectedPrivacy && <selectedPrivacy.icon className="w-4 h-4" />}
                          <span>{selectedPrivacy?.label}</span>
                        </div>
                        <ChevronDown className={`w-4 h-4 transition ${showPrivacyDropdown ? 'rotate-180' : ''}`} />
                      </button>
                      
                      {showPrivacyDropdown && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-gray-700 rounded-lg overflow-hidden z-10 shadow-xl">
                          {PRIVACY_OPTIONS.map(option => (
                            <button
                              key={option.value}
                              onClick={() => { setPrivacy(option.value); setShowPrivacyDropdown(false); }}
                              className={`w-full px-3 py-2 flex items-center gap-3 hover:bg-gray-600 ${privacy === option.value ? 'bg-purple-600/30' : ''}`}
                            >
                              <option.icon className="w-4 h-4 text-gray-400" />
                              <div className="text-left">
                                <p className="text-white text-sm">{option.label}</p>
                                <p className="text-gray-400 text-xs">{option.desc}</p>
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Go Live Status - Software Mode */}
              {!isLive && streamMode === STREAM_MODES.SOFTWARE && (
                <div className="bg-gray-800 rounded-xl p-4">
                  <h3 className="text-white font-semibold mb-3">Ready to Go Live?</h3>
                  <div className="space-y-2">
                    <div className={`flex items-center gap-2 text-sm ${title.trim() ? 'text-green-400' : 'text-gray-400'}`}>
                      {title.trim() ? <CheckCircle className="w-4 h-4" /> : <div className="w-4 h-4 border border-gray-500 rounded-full" />}
                      Title entered
                    </div>
                    <div className={`flex items-center gap-2 text-sm ${streamCredentials ? 'text-green-400' : 'text-gray-400'}`}>
                      {streamCredentials ? <CheckCircle className="w-4 h-4" /> : <div className="w-4 h-4 border border-gray-500 rounded-full" />}
                      Credentials generated
                    </div>
                    <div className={`flex items-center gap-2 text-sm ${obsConnected ? 'text-green-400' : 'text-gray-400'}`}>
                      {obsConnected ? <CheckCircle className="w-4 h-4" /> : <div className="w-4 h-4 border border-gray-500 rounded-full" />}
                      OBS connected
                    </div>
                  </div>
                  
                  {/* Feed Post Notice */}
                  <div className="mt-4 pt-3 border-t border-gray-700">
                    <p className="text-gray-400 text-xs flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      Stream will be posted to your feed automatically
                    </p>
                  </div>
                </div>
              )}

              {/* Go Live Status - Camera Mode */}
              {!isLive && streamMode === STREAM_MODES.CAMERA && (
                <div className="bg-gray-800 rounded-xl p-4">
                  <h3 className="text-white font-semibold mb-3">Ready to Go Live?</h3>
                  <div className="space-y-2">
                    <div className={`flex items-center gap-2 text-sm ${title.trim() ? 'text-green-400' : 'text-gray-400'}`}>
                      {title.trim() ? <CheckCircle className="w-4 h-4" /> : <div className="w-4 h-4 border border-gray-500 rounded-full" />}
                      Title entered
                    </div>
                    <div className={`flex items-center gap-2 text-sm ${!cameraError && mediaStreamRef.current ? 'text-green-400' : 'text-gray-400'}`}>
                      {!cameraError && mediaStreamRef.current ? <CheckCircle className="w-4 h-4" /> : <div className="w-4 h-4 border border-gray-500 rounded-full" />}
                      Camera ready
                    </div>
                  </div>
                  
                  {/* Feed Post Notice */}
                  <div className="mt-4 pt-3 border-t border-gray-700">
                    <p className="text-gray-400 text-xs flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      Stream will be posted to your feed automatically
                    </p>
                  </div>
                </div>
              )}

              {/* Live Chat Preview */}
              {isLive && (
                <div className="bg-gray-800 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-white font-semibold flex items-center gap-2">
                      <MessageCircle className="w-5 h-5" />
                      Live Chat
                    </h3>
                    <Link href={`/live/${streamId}`} target="_blank">
                      <span className="text-purple-400 text-sm hover:underline">View Full</span>
                    </Link>
                  </div>
                  
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {comments.length === 0 ? (
                      <p className="text-gray-500 text-sm text-center py-4">No comments yet</p>
                    ) : (
                      comments.slice(-5).map((comment, i) => (
                        <div key={i} className="flex gap-2 text-sm">
                          <span className="text-purple-400 font-medium">{comment.user?.name || 'User'}:</span>
                          <span className="text-gray-300">{comment.content}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* Tips */}
              <div className="bg-gray-800 rounded-xl p-4">
                <h3 className="text-white font-semibold mb-3">Quick Tips</h3>
                <ul className="text-gray-400 text-sm space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400">•</span>
                    Add a thumbnail to attract more viewers
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400">•</span>
                    Good lighting improves video quality
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400">•</span>
                    Test your audio before going live
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400">•</span>
                    Engage with viewers in chat
                  </li>
                </ul>
              </div>

              {/* Streamer Info */}
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
        
        {/* Existing Stream Modal */}
        {showExistingStreamModal && existingStream && (
          <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
            <div className="bg-gray-800 rounded-2xl max-w-md w-full p-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Radio className="w-8 h-8 text-red-500 animate-pulse" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Active Stream Found</h3>
                <p className="text-gray-400">
                  You have an active stream: <span className="text-white font-medium">"{existingStream.title}"</span>
                </p>
              </div>
              
              <div className="space-y-3">
                <button onClick={resumeExistingStream} className="w-full py-3 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 flex items-center justify-center gap-2">
                  <Play className="w-5 h-5" />
                  Resume Stream
                </button>
                <button onClick={endExistingAndStartNew} disabled={loading} className="w-full py-3 bg-gray-700 text-white font-semibold rounded-xl hover:bg-gray-600 flex items-center justify-center gap-2">
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <RotateCcw className="w-5 h-5" />}
                  End & Start New
                </button>
                <button onClick={() => setShowExistingStreamModal(false)} className="w-full py-3 text-gray-400 hover:text-white">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
