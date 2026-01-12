// ============================================
// FILE: src/pages/live/go-live.jsx
// Facebook Live-Style Streaming - Camera + OBS Support
// VERSION: 4.0 - Quality Selector + Low Latency
// ADDED: Quality presets (1080p/720p/480p) for different bandwidths
// ============================================

import { useState, useEffect, useRef, useCallback } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Script from 'next/script';
import io from 'socket.io-client';
import { 
  ArrowLeft, Radio, Video, Mic, MicOff, VideoOff, Settings, Users, 
  MessageCircle, Share2, X, Loader2, Copy, ExternalLink, Camera,
  Monitor, Smartphone, RefreshCw, ChevronDown, Eye, Clock, Heart,
  Zap, Globe, Lock, CheckCircle, AlertCircle, Wifi, WifiOff,
  RotateCcw, SwitchCamera, Sparkles, Play, Key, Server, EyeOff,
  Image, Upload, Trash2, StopCircle, Gauge
} from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'react-toastify';

const STREAM_MODES = { CAMERA: 'camera', SOFTWARE: 'software' };
const PRIVACY_OPTIONS = [
  { value: 'public', label: 'Public', icon: Globe, desc: 'Anyone can watch' },
  { value: 'followers', label: 'Followers', icon: Users, desc: 'Only followers can watch' },
  { value: 'private', label: 'Private', icon: Lock, desc: 'Only you can watch' }
];
const KEY_TYPES = { PERSISTENT: 'persistent', ONE_TIME: 'one-time' };
const WEBRTC_STATES = { IDLE: 'idle', CONNECTING: 'connecting', STREAMING: 'streaming', ERROR: 'error' };

// Quality presets for different network conditions
const QUALITY_PRESETS = {
  high: { 
    label: 'High (1080p)', 
    desc: 'Best quality - needs 5+ Mbps upload',
    width: 1920, 
    height: 1080, 
    frameRate: 30, 
    videoBitrate: 4500000, 
    audioBitrate: 160000 
  },
  medium: { 
    label: 'Medium (720p)', 
    desc: 'Balanced - needs 3+ Mbps upload',
    width: 1280, 
    height: 720, 
    frameRate: 30, 
    videoBitrate: 2500000, 
    audioBitrate: 128000 
  },
  low: { 
    label: 'Low (480p)', 
    desc: 'For slow connections - needs 1+ Mbps',
    width: 854, 
    height: 480, 
    frameRate: 24, 
    videoBitrate: 1000000, 
    audioBitrate: 96000 
  }
};

export default function GoLivePage() {
  const router = useRouter();
  const videoRef = useRef(null);
  const previewVideoRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const hlsRef = useRef(null);
  const socketRef = useRef(null);
  const statusIntervalRef = useRef(null);
  
  // Core state
  const [user, setUser] = useState(null);
  const [streamMode, setStreamMode] = useState(STREAM_MODES.CAMERA);
  const [isLive, setIsLive] = useState(false);
  const [isPreview, setIsPreview] = useState(true);
  const [loading, setLoading] = useState(false);
  const [streamId, setStreamId] = useState(null);
  const [streamDuration, setStreamDuration] = useState(0);
  
  // Quality settings - NEW
  const [qualityPreset, setQualityPreset] = useState('medium');
  const [actualResolution, setActualResolution] = useState('');
  
  // Media controls
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [facingMode, setFacingMode] = useState('user');
  const [devices, setDevices] = useState({ video: [], audio: [] });
  const [selectedCamera, setSelectedCamera] = useState('');
  const [selectedMic, setSelectedMic] = useState('');
  const [cameraError, setCameraError] = useState('');
  
  // Stream details
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [privacy, setPrivacy] = useState('public');
  const [thumbnail, setThumbnail] = useState(null);
  const [uploadingThumbnail, setUploadingThumbnail] = useState(false);
  
  // OBS/Software streaming
  const [streamCredentials, setStreamCredentials] = useState(null);
  const [showStreamKey, setShowStreamKey] = useState(false);
  const [generatingCredentials, setGeneratingCredentials] = useState(false);
  const [obsConnected, setObsConnected] = useState(false);
  const [obsPreviewReady, setObsPreviewReady] = useState(false);
  
  // WebRTC state
  const [webrtcState, setWebrtcState] = useState(WEBRTC_STATES.IDLE);
  const [webrtcError, setWebrtcError] = useState('');
  const [webrtcSupported] = useState(typeof MediaRecorder !== 'undefined');
  const [bytesSent, setBytesSent] = useState(0);
  const [playbackUrl, setPlaybackUrl] = useState('');
  
  // Engagement
  const [viewerCount, setViewerCount] = useState(0);
  const [likeCount, setLikeCount] = useState(0);
  
  // Debug
  const [showDebug, setShowDebug] = useState(false);
  const [debugLogs, setDebugLogs] = useState([]);

  const debugLog = (message, data = null) => {
    const timestamp = new Date().toLocaleTimeString();
    console.log(`[GO-LIVE] ${message}`, data || '');
    setDebugLogs(prev => [...prev.slice(-49), `${timestamp}: ${message}`]);
  };

  // Initialize
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user') || 'null');
    const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
    if (!userData || !token) { router.push('/auth/login'); return; }
    setUser(userData);
    enumerateDevices();
    if (streamMode === STREAM_MODES.CAMERA) startCamera();
    return () => { stopCamera(); disconnectWebRTC(); };
  }, []);

  // Camera restart on settings change
  useEffect(() => { 
    if (streamMode === STREAM_MODES.CAMERA && !isLive) startCamera(); 
  }, [facingMode, selectedCamera, selectedMic, qualityPreset]);

  // Duration timer
  useEffect(() => { 
    let interval; 
    if (isLive) interval = setInterval(() => setStreamDuration(prev => prev + 1), 1000); 
    return () => clearInterval(interval); 
  }, [isLive]);

  // Stats polling
  useEffect(() => { 
    if (isLive && streamId) { 
      fetchStreamStats(); 
      statusIntervalRef.current = setInterval(fetchStreamStats, 5000); 
    } 
    return () => clearInterval(statusIntervalRef.current); 
  }, [isLive, streamId]);

  const formatDuration = (seconds) => { 
    const h = Math.floor(seconds / 3600); 
    const m = Math.floor((seconds % 3600) / 60); 
    const s = seconds % 60; 
    return h > 0 ? `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}` : `${m}:${s.toString().padStart(2, '0')}`; 
  };
  
  const formatBytes = (bytes) => { 
    if (bytes < 1024) return bytes + ' B'; 
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'; 
    return (bytes / 1024 / 1024).toFixed(2) + ' MB'; 
  };

  const enumerateDevices = async () => {
    try {
      const deviceList = await navigator.mediaDevices.enumerateDevices();
      setDevices({
        video: deviceList.filter(d => d.kind === 'videoinput'),
        audio: deviceList.filter(d => d.kind === 'audioinput')
      });
    } catch (error) { debugLog('Error enumerating devices:', error.message); }
  };

  // OPTIMIZED: Camera with quality presets
  const startCamera = async () => {
    setCameraError('');
    debugLog('Starting camera...');
    try {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => track.stop());
      }
      
      const quality = QUALITY_PRESETS[qualityPreset];
      debugLog(`Quality preset: ${qualityPreset} (${quality.width}x${quality.height})`);
      
      const constraints = { 
        video: selectedCamera 
          ? { 
              deviceId: { exact: selectedCamera }, 
              width: { ideal: quality.width, min: 640 }, 
              height: { ideal: quality.height, min: 480 }, 
              frameRate: { ideal: quality.frameRate, max: 30 } 
            } 
          : { 
              width: { ideal: quality.width, min: 640 }, 
              height: { ideal: quality.height, min: 480 }, 
              frameRate: { ideal: quality.frameRate, max: 30 },
              facingMode 
            }, 
        audio: selectedMic 
          ? { deviceId: { exact: selectedMic }, echoCancellation: true, noiseSuppression: true } 
          : { echoCancellation: true, noiseSuppression: true }
      };
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      mediaStreamRef.current = stream;
      
      // Get actual resolution
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        const settings = videoTrack.getSettings();
        setActualResolution(`${settings.width}x${settings.height}@${Math.round(settings.frameRate || 30)}fps`);
        debugLog(`Actual resolution: ${settings.width}x${settings.height}`);
      }
      
      if (videoRef.current) { 
        videoRef.current.srcObject = stream; 
        await videoRef.current.play().catch(() => {}); 
      }
      
      enumerateDevices();
      debugLog('Camera started successfully');
      return true;
    } catch (error) { 
      console.error('Camera error:', error); 
      debugLog('Camera error: ' + error.message);
      handleCameraError(error); 
      return false; 
    }
  };

  const handleCameraError = (error) => {
    let errorMsg = 'Unable to access camera';
    if (error.name === 'NotAllowedError') errorMsg = 'Camera permission denied. Please allow access.';
    else if (error.name === 'NotFoundError') errorMsg = 'No camera found on this device.';
    else if (error.name === 'NotReadableError') errorMsg = 'Camera is being used by another app.';
    else if (error.name === 'OverconstrainedError') {
      errorMsg = 'Camera doesn\'t support requested quality. Trying lower...';
      // Auto-fallback to lower quality
      if (qualityPreset === 'high') {
        setQualityPreset('medium');
        debugLog('Falling back to medium quality');
      } else if (qualityPreset === 'medium') {
        setQualityPreset('low');
        debugLog('Falling back to low quality');
      }
    }
    setCameraError(errorMsg);
  };

  const stopCamera = () => { 
    if (mediaStreamRef.current) { 
      mediaStreamRef.current.getTracks().forEach(track => track.stop()); 
      mediaStreamRef.current = null; 
    } 
    if (videoRef.current) videoRef.current.srcObject = null; 
  };

  const switchCamera = () => setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
  
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

  // WebRTC Connection
  const connectWebRTC = async (newStreamId) => {
    debugLog('Connecting WebSocket...');
    return new Promise((resolve, reject) => {
      try {
        const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.cybev.io';
        const wsUrl = apiUrl.replace('https', 'wss').replace('http', 'ws');
        debugLog(`Connecting to WebSocket: ${wsUrl}/webrtc`);
        
        const socket = io(`${wsUrl}/webrtc`, { transports: ['websocket'], auth: { token } });
        
        socket.on('connect', () => { 
          debugLog(`WebSocket connected: ${socket.id}`);
          socket.emit('authenticate', { token, streamId: newStreamId }); 
        });
        
        socket.on('welcome', (data) => debugLog('Welcome received:', JSON.stringify(data)));
        
        socket.on('authenticated', (data) => { 
          debugLog('Authenticated:', JSON.stringify(data));
          socketRef.current = socket; 
          setWebrtcState(WEBRTC_STATES.CONNECTING); 
          resolve(socket); 
        });
        
        socket.on('streaming-started', (data) => { 
          debugLog('Streaming started:', JSON.stringify(data));
          setWebrtcState(WEBRTC_STATES.STREAMING); 
          if (data.playbackUrl) setPlaybackUrl(data.playbackUrl); 
        });
        
        socket.on('rtmp-connected', () => {
          debugLog('RTMP connected to Mux!');
          toast.success('Connected to streaming server!');
        });
        
        socket.on('stream-ended', (data) => {
          debugLog('Stream ended: ' + (data.reason || 'Unknown'));
          if (isLive) setWebrtcState(WEBRTC_STATES.ERROR);
        });
        
        socket.on('error', (error) => { 
          debugLog('WebSocket error: ' + error.message);
          setWebrtcError(error.message); 
          setWebrtcState(WEBRTC_STATES.ERROR); 
          reject(new Error(error.message)); 
        });
        
        socket.on('disconnect', (reason) => {
          debugLog('Disconnected: ' + reason);
        });
        
        setTimeout(() => { 
          if (!socketRef.current) reject(new Error('Connection timeout')); 
        }, 15000);
      } catch (error) { reject(error); }
    });
  };

  // OPTIMIZED: MediaRecorder with quality presets
  const startMediaRecorder = () => {
    if (!mediaStreamRef.current || !socketRef.current) return;
    debugLog('Starting MediaRecorder...');
    
    try {
      // Prefer VP9 for better quality at same bitrate
      const mimeTypes = [
        'video/webm;codecs=vp9,opus',
        'video/webm;codecs=vp8,opus',
        'video/webm'
      ];
      let mimeType = mimeTypes.find(t => MediaRecorder.isTypeSupported(t)) || '';
      if (!mimeType) throw new Error('No supported video format');
      
      debugLog(`Starting MediaRecorder with: ${mimeType}`);
      
      const quality = QUALITY_PRESETS[qualityPreset];
      debugLog(`Video bitrate: ${(quality.videoBitrate / 1000000).toFixed(1)} Mbps`);
      
      const mediaRecorder = new MediaRecorder(mediaStreamRef.current, { 
        mimeType, 
        videoBitsPerSecond: quality.videoBitrate,
        audioBitsPerSecond: quality.audioBitrate
      });
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data?.size > 0 && socketRef.current?.connected) {
          event.data.arrayBuffer().then(buffer => { 
            const uint8Array = new Uint8Array(buffer);
            socketRef.current.emit('video-data', uint8Array); 
            setBytesSent(prev => prev + buffer.byteLength); 
          });
        }
      };
      
      mediaRecorder.onstart = () => debugLog('MediaRecorder.start(500) called');
      mediaRecorder.onstop = () => debugLog('MediaRecorder stopped');
      mediaRecorder.onerror = (e) => debugLog('MediaRecorder error: ' + e.error?.message);
      
      // 500ms chunks for good latency/efficiency balance
      mediaRecorder.start(500);
      mediaRecorderRef.current = mediaRecorder;
      
      debugLog('MediaRecorder started, sending start-streaming event');
      socketRef.current.emit('start-streaming');
      
    } catch (error) { 
      debugLog('MediaRecorder error: ' + error.message);
      setWebrtcError(error.message); 
      setWebrtcState(WEBRTC_STATES.ERROR); 
    }
  };

  const stopWebRTCStreaming = () => { 
    debugLog('Stopping WebRTC streaming...');
    if (mediaRecorderRef.current?.state !== 'inactive') { 
      mediaRecorderRef.current?.stop(); 
      mediaRecorderRef.current = null; 
    } 
    if (socketRef.current) socketRef.current.emit('stop-streaming'); 
  };
  
  const disconnectWebRTC = () => { 
    stopWebRTCStreaming(); 
    if (socketRef.current) { 
      socketRef.current.disconnect(); 
      socketRef.current = null; 
    } 
    setWebrtcState(WEBRTC_STATES.IDLE); 
  };

  const fetchStreamStats = async () => {
    if (!streamId) return;
    try {
      const response = await api.get(`/api/live/${streamId}`);
      if (response.data?.stream) { 
        const v = response.data.stream.viewers;
        setViewerCount(Array.isArray(v) ? v.length : (v || 0)); 
        setLikeCount(response.data.stream.likes?.length || 0); 
      }
    } catch {}
  };

  // Thumbnail upload
  const handleThumbnailUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { toast.error('Please select an image'); return; }
    if (file.size > 5 * 1024 * 1024) { toast.error('Image must be under 5MB'); return; }
    
    setUploadingThumbnail(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await api.post('/api/upload/image', formData, { 
        headers: { 'Content-Type': 'multipart/form-data' } 
      });
      if (response.data?.url) { 
        setThumbnail(response.data.url); 
        toast.success('Thumbnail uploaded!'); 
      }
    } catch (error) { toast.error('Failed to upload thumbnail'); }
    setUploadingThumbnail(false);
  };

  // GO LIVE - Camera Mode
  const startCameraStream = async () => {
    if (!title.trim()) { toast.error('Please enter a stream title'); return; }
    setLoading(true);
    setWebrtcError('');
    debugLog('Starting Go Live process...');
    
    try {
      debugLog('Creating stream...');
      const response = await api.post('/api/webrtc/start-stream', { 
        title, 
        description, 
        privacy, 
        streamType: 'camera',
        thumbnail 
      });
      
      if (!response.data?.success) throw new Error(response.data?.error || 'Failed to create stream');
      
      const newStreamId = response.data.streamId;
      debugLog(`Stream created: ${newStreamId}`);
      debugLog(`RTMP URL: ${response.data.rtmpUrl?.substring(0, 50)}...`);
      
      setStreamId(newStreamId);
      setPlaybackUrl(response.data.playbackUrl);
      
      await connectWebRTC(newStreamId);
      debugLog('WebSocket connected and authenticated');
      
      startMediaRecorder();
      
      setIsLive(true);
      setIsPreview(false);
      setStreamDuration(0);
      setBytesSent(0);
      debugLog('GO LIVE SUCCESS!');
      toast.success('🔴 You are now LIVE!');
      
    } catch (error) {
      debugLog('Go live error: ' + error.message);
      toast.error(error.message || 'Failed to start stream');
      setWebrtcState(WEBRTC_STATES.ERROR);
      setWebrtcError(error.message);
    }
    setLoading(false);
  };

  // OBS Streaming
  const generateStreamCredentials = async () => {
    setGeneratingCredentials(true);
    try {
      const response = await api.post('/api/live/start', { 
        title: title || 'Live Stream', 
        description, 
        streamType: 'mux', 
        privacy 
      });
      if (response.data?.success) {
        setStreamCredentials({
          rtmpUrl: response.data.rtmpUrl || 'rtmps://global-live.mux.com:443/app',
          streamKey: response.data.streamKey
        });
        setStreamId(response.data.streamId);
        toast.success('Stream key generated!');
        pollStreamStatus(response.data.streamId);
      }
    } catch (error) { toast.error('Failed to generate credentials'); }
    setGeneratingCredentials(false);
  };

  const pollStreamStatus = (sid) => {
    statusIntervalRef.current = setInterval(async () => {
      try {
        const response = await api.get(`/api/live/${sid}/status`);
        if (response.data?.isConnected || response.data?.isStreaming) {
          setObsConnected(true);
          setTimeout(() => setObsPreviewReady(true), 2000);
        }
      } catch {}
    }, 3000);
  };

  const goLiveOBS = async () => {
    if (!title.trim()) { toast.error('Please enter a title'); return; }
    if (!obsConnected) { toast.error('Connect OBS first'); return; }
    setLoading(true);
    try {
      const response = await api.post(`/api/live/${streamId}/activate`, { 
        title, description, privacy, thumbnail, postToFeed: true 
      });
      if (response.data?.success) { 
        setIsLive(true); 
        setIsPreview(false); 
        setStreamDuration(0); 
        toast.success('🔴 You are now LIVE!'); 
      }
    } catch (error) { toast.error('Failed to go live'); }
    setLoading(false);
  };

  // End Stream
  const endStream = async () => {
    debugLog('Ending stream...');
    setLoading(true);
    try {
      disconnectWebRTC();
      clearInterval(statusIntervalRef.current);
      if (streamId) await api.post(`/api/webrtc/stop-stream/${streamId}`).catch(() => {});
      toast.info('Stream ended');
      router.push('/tv');
    } catch (error) { toast.error('Error ending stream'); }
    setLoading(false);
    setIsLive(false);
  };

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied!`);
  };

  const getStatusBadge = () => {
    if (webrtcState === WEBRTC_STATES.STREAMING) 
      return <span className="flex items-center gap-1.5 px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full"><span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>Streaming</span>;
    if (webrtcState === WEBRTC_STATES.CONNECTING) 
      return <span className="flex items-center gap-1.5 px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded-full"><Loader2 className="w-3 h-3 animate-spin" />Connecting</span>;
    if (webrtcState === WEBRTC_STATES.ERROR) 
      return <span className="flex items-center gap-1.5 px-2 py-1 bg-red-500/20 text-red-400 text-xs rounded-full"><AlertCircle className="w-3 h-3" />Error</span>;
    return <span className="flex items-center gap-1.5 px-2 py-1 bg-gray-500/20 text-gray-500 text-xs rounded-full"><span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>Not connected</span>;
  };

  return (
    <>
      <Head><title>{isLive ? '🔴 LIVE' : 'Go Live'} | CYBEV</title></Head>
      
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-black text-gray-900">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-white shadow-sm-md border-b border-gray-200">
          <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={() => !isLive && router.back()} disabled={isLive} className="p-2 hover:bg-white rounded-lg disabled:opacity-50">
                <ArrowLeft className="w-5 h-5" />
              </button>
              {isLive && (
                <span className="px-3 py-1 bg-red-600 rounded-full text-sm font-bold flex items-center gap-2">
                  <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>LIVE
                </span>
              )}
              <span className="font-semibold">{isLive ? 'Broadcasting' : 'Go Live'}</span>
            </div>
            
            {isLive && (
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1"><Eye className="w-4 h-4" />{viewerCount}</div>
                <div className="flex items-center gap-1"><Clock className="w-4 h-4" />{formatDuration(streamDuration)}</div>
                {webrtcState === WEBRTC_STATES.STREAMING && (
                  <div className="flex items-center gap-1 text-green-400"><Wifi className="w-4 h-4" />{formatBytes(bytesSent)}</div>
                )}
              </div>
            )}
          </div>
        </header>

        <div className="max-w-6xl mx-auto p-4">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main Video Area */}
            <div className="lg:col-span-2 space-y-4">
              {/* Mode Selector (only before live) */}
              {!isLive && (
                <div className="flex gap-2">
                  <button 
                    onClick={() => setStreamMode(STREAM_MODES.CAMERA)} 
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition ${streamMode === STREAM_MODES.CAMERA ? 'bg-purple-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
                  >
                    <Smartphone className="w-5 h-5" />Device Camera
                    {webrtcSupported && <span className="px-1.5 py-0.5 bg-green-500/20 text-green-400 text-xs rounded">Ready</span>}
                  </button>
                  <button 
                    onClick={() => setStreamMode(STREAM_MODES.SOFTWARE)} 
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition ${streamMode === STREAM_MODES.SOFTWARE ? 'bg-purple-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
                  >
                    <Monitor className="w-5 h-5" />OBS / Software
                  </button>
                </div>
              )}

              {/* Video Preview */}
              <div className="relative bg-gray-900 rounded-2xl overflow-hidden aspect-video shadow-2xl">
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
                      <div className="absolute inset-0 flex items-center justify-center bg-white">
                        <VideoOff className="w-16 h-16 text-gray-500" />
                      </div>
                    )}
                    {cameraError && (
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-50/95">
                        <div className="text-center p-6">
                          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-3" />
                          <p className="text-gray-900 mb-4">{cameraError}</p>
                          <button onClick={startCamera} className="px-4 py-2 bg-purple-600 rounded-lg hover:bg-purple-700">Retry</button>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    {streamCredentials ? (
                      obsConnected ? (
                        <div className="text-center">
                          <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-3" />
                          <p className="text-gray-900">OBS Connected!</p>
                        </div>
                      ) : (
                        <div className="text-center">
                          <Loader2 className="w-12 h-12 text-purple-600 animate-spin mx-auto mb-3" />
                          <p className="text-gray-900">Waiting for OBS...</p>
                        </div>
                      )
                    ) : (
                      <div className="text-center">
                        <Key className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                        <p className="text-gray-500">Generate stream key to start</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Overlays */}
                {isLive && (
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1.5 bg-red-600 rounded-lg text-sm font-bold flex items-center gap-2">
                      <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>LIVE
                    </span>
                  </div>
                )}
                
                {/* Resolution & Status Badge */}
                <div className="absolute top-4 right-4 flex items-center gap-2">
                  {actualResolution && !isLive && (
                    <span className="px-2 py-1 bg-gray-900/60 rounded text-xs">{actualResolution}</span>
                  )}
                  {streamMode === STREAM_MODES.CAMERA && getStatusBadge()}
                </div>

                {/* Camera Controls */}
                {streamMode === STREAM_MODES.CAMERA && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
                    <button onClick={toggleVideo} className={`p-3 rounded-full transition ${videoEnabled ? 'bg-white hover:bg-gray-100' : 'bg-red-600'}`}>
                      {videoEnabled ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
                    </button>
                    <button onClick={toggleAudio} className={`p-3 rounded-full transition ${audioEnabled ? 'bg-white hover:bg-gray-100' : 'bg-red-600'}`}>
                      {audioEnabled ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                    </button>
                    {devices.video.length > 1 && (
                      <button onClick={switchCamera} className="p-3 rounded-full bg-white hover:bg-gray-100">
                        <SwitchCamera className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Debug Panel */}
              <div className="bg-white/50 rounded-xl overflow-hidden">
                <button onClick={() => setShowDebug(!showDebug)} className="w-full p-3 flex items-center justify-between text-sm hover:bg-gray-50/50">
                  <span className="text-gray-500">Debug Log</span>
                  <ChevronDown className={`w-4 h-4 text-gray-500 transition ${showDebug ? 'rotate-180' : ''}`} />
                </button>
                {showDebug && (
                  <div className="p-3 bg-gray-50 max-h-40 overflow-y-auto font-mono text-xs space-y-1">
                    {debugLogs.length > 0 ? debugLogs.map((log, i) => (
                      <div key={i} className="text-gray-500">{log}</div>
                    )) : <div className="text-gray-600">No logs yet...</div>}
                  </div>
                )}
              </div>
            </div>

            {/* Right Sidebar - Settings */}
            <div className="space-y-4">
              {!isLive ? (
                <>
                  {/* Stream Settings */}
                  <div className="bg-white/50 rounded-xl p-4 space-y-4">
                    <h3 className="font-semibold flex items-center gap-2">
                      <Settings className="w-5 h-5 text-purple-600" />Stream Settings
                    </h3>
                    
                    <div>
                      <label className="block text-sm text-gray-500 mb-1">Title *</label>
                      <input 
                        type="text" 
                        value={title} 
                        onChange={(e) => setTitle(e.target.value)} 
                        placeholder="What's your stream about?"
                        className="w-full bg-gray-100 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-purple-500 outline-none"
                        maxLength={100}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm text-gray-500 mb-1">Description</label>
                      <textarea 
                        value={description} 
                        onChange={(e) => setDescription(e.target.value)} 
                        placeholder="Tell viewers what to expect..."
                        rows={2}
                        className="w-full bg-gray-100 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-purple-500 outline-none resize-none"
                      />
                    </div>

                    {/* QUALITY SELECTOR - NEW */}
                    {streamMode === STREAM_MODES.CAMERA && (
                      <div>
                        <label className="block text-sm text-gray-500 mb-2 flex items-center gap-2">
                          <Gauge className="w-4 h-4" />Stream Quality
                        </label>
                        <div className="space-y-2">
                          {Object.entries(QUALITY_PRESETS).map(([key, preset]) => (
                            <button
                              key={key}
                              onClick={() => setQualityPreset(key)}
                              className={`w-full flex items-center justify-between p-3 rounded-lg border transition ${
                                qualityPreset === key 
                                  ? 'border-purple-500 bg-purple-500/10' 
                                  : 'border-gray-200 hover:border-gray-300'
                              }`}
                            >
                              <div className="text-left">
                                <div className="font-medium text-sm">{preset.label}</div>
                                <div className="text-xs text-gray-500">{preset.desc}</div>
                              </div>
                              {qualityPreset === key && <CheckCircle className="w-5 h-5 text-purple-600" />}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Privacy */}
                    <div>
                      <label className="block text-sm text-gray-500 mb-2">Privacy</label>
                      <div className="flex gap-2">
                        {PRIVACY_OPTIONS.map((opt) => (
                          <button
                            key={opt.value}
                            onClick={() => setPrivacy(opt.value)}
                            className={`flex-1 flex flex-col items-center gap-1 p-3 rounded-lg border transition ${
                              privacy === opt.value 
                                ? 'border-purple-500 bg-purple-500/10' 
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <opt.icon className="w-5 h-5" />
                            <span className="text-xs">{opt.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Thumbnail */}
                    <div>
                      <label className="block text-sm text-gray-500 mb-2">Thumbnail</label>
                      {thumbnail ? (
                        <div className="relative">
                          <img src={thumbnail} alt="Thumbnail" className="w-full h-24 object-cover rounded-lg" />
                          <button onClick={() => setThumbnail(null)} className="absolute top-2 right-2 p-1 bg-red-600 rounded-full">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <label className="flex flex-col items-center justify-center h-24 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-500 transition">
                          <input type="file" accept="image/*" onChange={handleThumbnailUpload} className="hidden" disabled={uploadingThumbnail} />
                          {uploadingThumbnail ? (
                            <Loader2 className="w-6 h-6 animate-spin text-gray-500" />
                          ) : (
                            <>
                              <Upload className="w-6 h-6 text-gray-500 mb-1" />
                              <span className="text-xs text-gray-500">Upload thumbnail</span>
                            </>
                          )}
                        </label>
                      )}
                    </div>
                  </div>

                  {/* OBS Credentials (Software mode only) */}
                  {streamMode === STREAM_MODES.SOFTWARE && (
                    <div className="bg-white/50 rounded-xl p-4 space-y-3">
                      <h3 className="font-semibold flex items-center gap-2">
                        <Key className="w-5 h-5 text-purple-600" />Stream Key
                      </h3>
                      {streamCredentials ? (
                        <div className="space-y-3">
                          <div>
                            <label className="text-xs text-gray-500">Server URL</label>
                            <div className="flex gap-2 mt-1">
                              <input type="text" value={streamCredentials.rtmpUrl} readOnly className="flex-1 px-3 py-2 bg-gray-700 rounded-lg text-sm" />
                              <button onClick={() => copyToClipboard(streamCredentials.rtmpUrl, 'URL')} className="p-2 bg-gray-700 rounded-lg hover:bg-gray-600">
                                <Copy className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                          <div>
                            <label className="text-xs text-gray-500">Stream Key</label>
                            <div className="flex gap-2 mt-1">
                              <input type={showStreamKey ? 'text' : 'password'} value={streamCredentials.streamKey} readOnly className="flex-1 px-3 py-2 bg-gray-700 rounded-lg text-sm font-mono" />
                              <button onClick={() => setShowStreamKey(!showStreamKey)} className="p-2 bg-gray-700 rounded-lg hover:bg-gray-600">
                                {showStreamKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                              </button>
                              <button onClick={() => copyToClipboard(streamCredentials.streamKey, 'Key')} className="p-2 bg-gray-700 rounded-lg hover:bg-gray-600">
                                <Copy className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                          <div className={`flex items-center gap-2 p-3 rounded-lg ${obsConnected ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                            {obsConnected ? <><CheckCircle className="w-5 h-5" />OBS Connected!</> : <><Loader2 className="w-5 h-5 animate-spin" />Waiting for OBS...</>}
                          </div>
                        </div>
                      ) : (
                        <button onClick={generateStreamCredentials} disabled={generatingCredentials} className="w-full py-3 bg-purple-600 rounded-lg font-medium disabled:opacity-50 flex items-center justify-center gap-2">
                          {generatingCredentials ? <Loader2 className="w-5 h-5 animate-spin" /> : <Key className="w-5 h-5" />}
                          {generatingCredentials ? 'Generating...' : 'Generate Stream Key'}
                        </button>
                      )}
                    </div>
                  )}

                  {/* GO LIVE Button */}
                  <button 
                    onClick={streamMode === STREAM_MODES.CAMERA ? startCameraStream : goLiveOBS}
                    disabled={loading || !title.trim() || (streamMode === STREAM_MODES.SOFTWARE && !obsConnected)}
                    className="w-full py-4 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 rounded-xl font-bold text-lg flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-lg shadow-red-500/25"
                  >
                    {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Radio className="w-6 h-6" />}
                    {loading ? 'Starting...' : 'Go Live'}
                  </button>
                </>
              ) : (
                <>
                  {/* Live Stats */}
                  <div className="bg-white/50 rounded-xl p-4">
                    <h3 className="font-semibold mb-4">{title}</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="text-center p-3 bg-gray-100 rounded-lg">
                        <Eye className="w-6 h-6 mx-auto mb-1 text-purple-600" />
                        <div className="text-2xl font-bold">{viewerCount}</div>
                        <div className="text-xs text-gray-500">Viewers</div>
                      </div>
                      <div className="text-center p-3 bg-gray-100 rounded-lg">
                        <Heart className="w-6 h-6 mx-auto mb-1 text-red-400" />
                        <div className="text-2xl font-bold">{likeCount}</div>
                        <div className="text-xs text-gray-500">Likes</div>
                      </div>
                      <div className="text-center p-3 bg-gray-100 rounded-lg">
                        <Clock className="w-6 h-6 mx-auto mb-1 text-blue-400" />
                        <div className="text-2xl font-bold">{formatDuration(streamDuration)}</div>
                        <div className="text-xs text-gray-500">Duration</div>
                      </div>
                      <div className="text-center p-3 bg-gray-100 rounded-lg">
                        <Zap className="w-6 h-6 mx-auto mb-1 text-yellow-400" />
                        <div className="text-2xl font-bold">{formatBytes(bytesSent)}</div>
                        <div className="text-xs text-gray-500">Sent</div>
                      </div>
                    </div>
                  </div>

                  {/* Stream Info */}
                  <div className="bg-white/50 rounded-xl p-4 space-y-2 text-sm">
                    <h4 className="font-medium">Stream Info</h4>
                    <div className="flex justify-between text-gray-500">
                      <span>Quality</span>
                      <span>{QUALITY_PRESETS[qualityPreset].label}</span>
                    </div>
                    <div className="flex justify-between text-gray-500">
                      <span>Bitrate</span>
                      <span>{(QUALITY_PRESETS[qualityPreset].videoBitrate / 1000000).toFixed(1)} Mbps</span>
                    </div>
                    <div className="flex justify-between text-gray-500">
                      <span>Status</span>
                      {getStatusBadge()}
                    </div>
                  </div>

                  {/* End Stream Button */}
                  <button 
                    onClick={endStream}
                    disabled={loading}
                    className="w-full py-4 bg-red-600 hover:bg-red-700 rounded-xl font-bold flex items-center justify-center gap-3 disabled:opacity-50 transition"
                  >
                    {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <StopCircle className="w-6 h-6" />}
                    End Stream
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
