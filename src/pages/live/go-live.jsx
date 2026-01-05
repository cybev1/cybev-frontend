// ============================================
// FILE: src/pages/live/go-live.jsx
// Mobile-First Live Streaming - FIXED v2
// IMPROVED: Better binary data handling, debugging
// ============================================

import { useState, useEffect, useRef, useCallback } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Script from 'next/script';
import io from 'socket.io-client';
import { 
  ArrowLeft, Radio, Video, Mic, MicOff, VideoOff, Users, 
  Loader2, Copy, Camera, Monitor, RefreshCw, Eye, Clock,
  Globe, Lock, CheckCircle, AlertCircle, SwitchCamera, 
  Key, Server, EyeOff, Upload, Trash2, StopCircle, Wifi, WifiOff
} from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'react-toastify';

const STREAM_MODES = { CAMERA: 'camera', SOFTWARE: 'software' };

const CONNECTION_STATES = {
  IDLE: 'idle',
  CONNECTING: 'connecting',
  CONNECTED: 'connected',
  STREAMING: 'streaming',
  ERROR: 'error'
};

export default function GoLivePage() {
  const router = useRouter();
  const videoRef = useRef(null);
  const previewVideoRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const socketRef = useRef(null);
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
  
  // Thumbnail
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const thumbnailInputRef = useRef(null);
  
  // OBS Mode
  const [streamCredentials, setStreamCredentials] = useState(null);
  const [showStreamKey, setShowStreamKey] = useState(false);
  const [generatingCredentials, setGeneratingCredentials] = useState(false);
  const [obsConnected, setObsConnected] = useState(false);
  const [obsPreviewReady, setObsPreviewReady] = useState(false);
  const [hlsLoaded, setHlsLoaded] = useState(false);
  
  // WebRTC Camera Mode
  const [connectionState, setConnectionState] = useState(CONNECTION_STATES.IDLE);
  const [rtmpUrl, setRtmpUrl] = useState(null);
  const [bytesSent, setBytesSent] = useState(0);
  const [chunksSent, setChunksSent] = useState(0);
  const [streamStats, setStreamStats] = useState(null);
  const [debugLog, setDebugLog] = useState([]);
  
  // Stats
  const [viewerCount, setViewerCount] = useState(0);
  
  // Debug logger
  const addDebug = useCallback((msg) => {
    console.log(`[GO-LIVE] ${msg}`);
    setDebugLog(prev => [...prev.slice(-20), `${new Date().toLocaleTimeString()}: ${msg}`]);
  }, []);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      router.push('/auth/login');
    }
    enumerateDevices();
    
    return () => {
      stopCamera();
      disconnectWebSocket();
      destroyHls();
    };
  }, []);

  useEffect(() => {
    if (streamMode === STREAM_MODES.CAMERA && !isLive) {
      const timer = setTimeout(() => startCamera(), 500);
      return () => clearTimeout(timer);
    } else if (streamMode === STREAM_MODES.SOFTWARE) {
      stopCamera();
      disconnectWebSocket();
    }
  }, [streamMode, selectedCamera, selectedMic]);

  useEffect(() => {
    let interval;
    if (isLive) {
      interval = setInterval(() => setStreamDuration(prev => prev + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isLive]);

  useEffect(() => {
    let interval;
    if (streamMode === STREAM_MODES.SOFTWARE && streamCredentials && !isLive) {
      checkOBSConnection();
      interval = setInterval(checkOBSConnection, 3000);
    }
    return () => clearInterval(interval);
  }, [streamMode, streamCredentials, isLive, hlsLoaded]);

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

  // Thumbnail handling
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

  // Camera functions
  const startCamera = async () => {
    setCameraError('');
    addDebug('Starting camera...');
    try {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => track.stop());
      }
      
      const constraints = {
        video: selectedCamera 
          ? { deviceId: { exact: selectedCamera }, width: { ideal: 1280 }, height: { ideal: 720 }, frameRate: { ideal: 30 } }
          : { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode, frameRate: { ideal: 30 } },
        audio: selectedMic 
          ? { deviceId: { exact: selectedMic }, echoCancellation: true, noiseSuppression: true } 
          : { echoCancellation: true, noiseSuppression: true }
      };
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      mediaStreamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play().catch(() => {});
      }
      
      addDebug('Camera started successfully');
      enumerateDevices();
      return true;
    } catch (error) {
      addDebug(`Camera error: ${error.message}`);
      let errorMsg = 'Unable to access camera';
      if (error.name === 'NotAllowedError') errorMsg = 'Camera permission denied';
      else if (error.name === 'NotFoundError') errorMsg = 'No camera found';
      else if (error.name === 'NotReadableError') errorMsg = 'Camera in use by another app';
      setCameraError(errorMsg);
      return false;
    }
  };

  const stopCamera = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
    if (videoRef.current) videoRef.current.srcObject = null;
  };

  const switchCamera = async () => {
    const newFacingMode = facingMode === 'user' ? 'environment' : 'user';
    setFacingMode(newFacingMode);
    if (isLive && mediaRecorderRef.current) {
      await startCamera();
      startMediaRecorder();
    }
  };

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

  // WebSocket connection
  const connectWebSocket = (newStreamId, newRtmpUrl) => {
    return new Promise((resolve, reject) => {
      const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.cybev.io';
      const wsUrl = apiUrl.replace('https://', 'wss://').replace('http://', 'ws://');
      
      addDebug(`Connecting to WebSocket: ${wsUrl}/webrtc`);
      setConnectionState(CONNECTION_STATES.CONNECTING);
      
      const socket = io(`${wsUrl}/webrtc`, {
        transports: ['websocket', 'polling'],
        auth: { token },
        reconnection: true,
        reconnectionAttempts: 5,
        timeout: 20000
      });
      
      socket.on('connect', () => {
        addDebug(`WebSocket connected: ${socket.id}`);
        socket.emit('authenticate', { 
          token, 
          streamId: newStreamId,
          rtmpUrl: newRtmpUrl
        });
      });

      socket.on('welcome', (data) => {
        addDebug(`Welcome received: ${JSON.stringify(data)}`);
      });
      
      socket.on('authenticated', (data) => {
        addDebug(`Authenticated: ${JSON.stringify(data)}`);
        socketRef.current = socket;
        setConnectionState(CONNECTION_STATES.CONNECTED);
        resolve(socket);
      });
      
      socket.on('streaming-started', (data) => {
        addDebug(`Streaming started: ${JSON.stringify(data)}`);
        setConnectionState(CONNECTION_STATES.STREAMING);
      });
      
      socket.on('rtmp-connected', (data) => {
        addDebug(`RTMP connected to Mux!`);
        toast.success('Connected to streaming server!');
      });
      
      socket.on('warning', (data) => {
        addDebug(`Warning: ${data.message}`);
      });
      
      socket.on('pong', (data) => {
        setStreamStats(data);
      });
      
      socket.on('error', (error) => {
        addDebug(`Error: ${error.message}`);
        setConnectionState(CONNECTION_STATES.ERROR);
        toast.error(error.message || 'Streaming error');
      });
      
      socket.on('stream-ended', (data) => {
        addDebug(`Stream ended: ${data.reason}`);
        setConnectionState(CONNECTION_STATES.IDLE);
      });
      
      socket.on('connect_error', (error) => {
        addDebug(`Connection error: ${error.message}`);
        setConnectionState(CONNECTION_STATES.ERROR);
      });
      
      socket.on('disconnect', (reason) => {
        addDebug(`Disconnected: ${reason}`);
        if (isLive) {
          setConnectionState(CONNECTION_STATES.ERROR);
        }
      });
      
      // Timeout
      setTimeout(() => {
        if (!socketRef.current) {
          addDebug('Connection timeout');
          reject(new Error('Connection timeout'));
        }
      }, 20000);
    });
  };

  const disconnectWebSocket = () => {
    if (socketRef.current) {
      socketRef.current.emit('stop-streaming');
      socketRef.current.disconnect();
      socketRef.current = null;
    }
    setConnectionState(CONNECTION_STATES.IDLE);
  };

  // MediaRecorder - IMPROVED binary handling
  const startMediaRecorder = () => {
    if (!mediaStreamRef.current || !socketRef.current) {
      addDebug('Cannot start MediaRecorder: missing stream or socket');
      return;
    }

    // Find supported mime type
    const mimeTypes = [
      'video/webm;codecs=vp8,opus',
      'video/webm;codecs=vp9,opus',
      'video/webm',
      'video/mp4'
    ];
    
    let selectedMimeType = '';
    for (const mimeType of mimeTypes) {
      if (MediaRecorder.isTypeSupported(mimeType)) {
        selectedMimeType = mimeType;
        break;
      }
    }

    if (!selectedMimeType) {
      addDebug('No supported mime type found!');
      toast.error('Your browser does not support video recording');
      return;
    }

    const options = {
      mimeType: selectedMimeType,
      videoBitsPerSecond: 2000000,
      audioBitsPerSecond: 128000
    };

    addDebug(`Starting MediaRecorder with: ${selectedMimeType}`);

    const recorder = new MediaRecorder(mediaStreamRef.current, options);
    mediaRecorderRef.current = recorder;

    recorder.ondataavailable = async (event) => {
      if (event.data && event.data.size > 0 && socketRef.current && socketRef.current.connected) {
        try {
          // Convert Blob to Uint8Array for reliable transmission
          const arrayBuffer = await event.data.arrayBuffer();
          const uint8Array = new Uint8Array(arrayBuffer);
          
          // Send as array (Socket.IO handles this better than ArrayBuffer)
          socketRef.current.emit('video-data', uint8Array);
          
          setBytesSent(prev => prev + event.data.size);
          setChunksSent(prev => prev + 1);
          
          // Ping every 10 chunks
          if ((chunksSent + 1) % 10 === 0) {
            socketRef.current.emit('ping');
          }
        } catch (error) {
          addDebug(`Data send error: ${error.message}`);
        }
      }
    };

    recorder.onerror = (error) => {
      addDebug(`MediaRecorder error: ${error}`);
      toast.error('Recording error');
    };

    recorder.onstart = () => {
      addDebug('MediaRecorder started, sending start-streaming event');
      socketRef.current.emit('start-streaming');
    };

    recorder.onstop = () => {
      addDebug('MediaRecorder stopped');
    };

    // Start recording - send data every 1 second
    recorder.start(1000);
    addDebug('MediaRecorder.start(1000) called');
  };

  const stopMediaRecorder = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current = null;
    }
  };

  // OBS Mode functions
  const generateStreamCredentials = async () => {
    setGeneratingCredentials(true);
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
      const response = await api.post('/api/live/generate-key', {
        keyType: 'one-time',
        title: title || 'My Stream'
      }, { headers: { Authorization: `Bearer ${token}` } });

      if (response.data?.success) {
        setStreamCredentials({
          streamKey: response.data.streamKey,
          rtmpUrl: response.data.rtmpUrl || 'rtmps://global-live.mux.com:443/app',
          playbackId: response.data.playbackId,
          muxStreamId: response.data.muxStreamId,
          streamId: response.data.streamId
        });
        setStreamId(response.data.streamId);
        toast.success('Stream credentials generated!');
      }
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to generate credentials');
    }
    setGeneratingCredentials(false);
  };

  const checkOBSConnection = async () => {
    if (!streamCredentials?.muxStreamId || isLive) return;
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
      const response = await api.get(`/api/live/check-connection/${streamCredentials.muxStreamId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const connected = response.data?.connected;
      setObsConnected(connected);
      if (connected && !obsPreviewReady && hlsLoaded) {
        initializeHLSPreview(streamCredentials.playbackId);
      }
    } catch {}
  };

  const initializeHLSPreview = (playbackId) => {
    if (!playbackId || !previewVideoRef.current || !window.Hls) return;
    
    const hlsUrl = `https://stream.mux.com/${playbackId}.m3u8`;
    const Hls = window.Hls;
    
    if (Hls.isSupported()) {
      if (hlsRef.current) hlsRef.current.destroy();
      const hls = new Hls({ enableWorker: true, lowLatencyMode: true });
      hls.loadSource(hlsUrl);
      hls.attachMedia(previewVideoRef.current);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        setObsPreviewReady(true);
        previewVideoRef.current?.play().catch(() => {});
      });
      hlsRef.current = hls;
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

  // GO LIVE - Camera Mode
  const goLiveCamera = async () => {
    if (!title.trim()) {
      toast.error('Please enter a title');
      return;
    }

    if (!mediaStreamRef.current) {
      toast.error('Camera not available');
      return;
    }

    setLoading(true);
    addDebug('Starting Go Live process...');
    
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
      let thumbnailUrl = thumbnail ? await uploadThumbnail() : null;

      // Step 1: Create stream
      addDebug('Creating stream...');
      const response = await api.post('/api/webrtc/start-stream', {
        title,
        description,
        privacy
      }, { headers: { Authorization: `Bearer ${token}` } });

      if (!response.data?.success) {
        throw new Error(response.data?.error || 'Failed to create stream');
      }

      const { streamId: newStreamId, rtmpUrl: newRtmpUrl, playbackUrl } = response.data;
      setStreamId(newStreamId);
      setRtmpUrl(newRtmpUrl);

      addDebug(`Stream created: ${newStreamId}`);
      addDebug(`RTMP URL: ${newRtmpUrl.substring(0, 50)}...`);

      // Step 2: Connect WebSocket
      addDebug('Connecting WebSocket...');
      await connectWebSocket(newStreamId, newRtmpUrl);
      addDebug('WebSocket connected and authenticated');

      // Step 3: Start MediaRecorder
      addDebug('Starting MediaRecorder...');
      startMediaRecorder();

      // Step 4: Update thumbnail
      if (thumbnailUrl) {
        await api.put(`/api/live/${newStreamId}`, { thumbnail: thumbnailUrl }, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }

      setIsLive(true);
      setStreamDuration(0);
      setBytesSent(0);
      setChunksSent(0);
      toast.success('🔴 You are now LIVE!');
      addDebug('GO LIVE SUCCESS!');

    } catch (error) {
      addDebug(`Go live error: ${error.message}`);
      toast.error(error.message || 'Failed to start stream');
      disconnectWebSocket();
      setConnectionState(CONNECTION_STATES.ERROR);
    }
    
    setLoading(false);
  };

  // GO LIVE - OBS Mode
  const goLiveOBS = async () => {
    if (!title.trim()) {
      toast.error('Please enter a title');
      return;
    }

    if (!obsConnected) {
      toast.error('Please connect OBS first');
      return;
    }

    setLoading(true);
    
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
      let thumbnailUrl = thumbnail ? await uploadThumbnail() : null;

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
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to start stream');
    }
    
    setLoading(false);
  };

  const goLive = async () => {
    if (streamMode === STREAM_MODES.CAMERA) {
      await goLiveCamera();
    } else {
      await goLiveOBS();
    }
  };

  // End Stream
  const endStream = async () => {
    setLoading(true);
    addDebug('Ending stream...');
    
    try {
      stopMediaRecorder();
      disconnectWebSocket();
      stopCamera();
      
      if (streamId) {
        const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
        
        if (streamMode === STREAM_MODES.CAMERA) {
          await api.post(`/api/webrtc/stop-stream/${streamId}`, {}, { 
            headers: { Authorization: `Bearer ${token}` } 
          });
        } else {
          await api.post(`/api/live/${streamId}/end`, {}, { 
            headers: { Authorization: `Bearer ${token}` } 
          });
        }
      }
      
      setIsLive(false);
      toast.success('Stream ended! Recording will be available soon.');
      
      setTimeout(() => router.push('/tv'), 2000);
    } catch (error) {
      addDebug(`End stream error: ${error.message}`);
      toast.error('Failed to end stream properly');
    }
    
    setLoading(false);
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

  const formatBytes = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
  };

  // Connection status component
  const ConnectionStatus = () => {
    const states = {
      [CONNECTION_STATES.IDLE]: { color: 'bg-gray-500', text: 'Not connected' },
      [CONNECTION_STATES.CONNECTING]: { color: 'bg-yellow-500', text: 'Connecting...' },
      [CONNECTION_STATES.CONNECTED]: { color: 'bg-blue-500', text: 'Connected' },
      [CONNECTION_STATES.STREAMING]: { color: 'bg-green-500', text: 'Streaming' },
      [CONNECTION_STATES.ERROR]: { color: 'bg-red-500', text: 'Error' }
    };
    
    const state = states[connectionState] || states[CONNECTION_STATES.IDLE];
    
    return (
      <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm ${state.color} text-white`}>
        <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
        <span>{state.text}</span>
      </div>
    );
  };

  return (
    <>
      <Head>
        <title>{isLive ? '🔴 LIVE - ' : ''}Go Live | CYBEV</title>
      </Head>
      
      <Script
        src="https://cdn.jsdelivr.net/npm/hls.js@latest"
        strategy="beforeInteractive"
        onLoad={() => setHlsLoaded(true)}
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
                <div className="text-gray-400">{formatBytes(bytesSent)} sent</div>
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
                    <Camera className="w-5 h-5" />
                    Device Camera
                    <span className="px-1.5 py-0.5 bg-green-500/20 text-green-400 text-xs rounded">Mobile</span>
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
                      style={{ transform: facingMode === 'user' ? 'scaleX(-1)' : 'none' }}
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
                    
                    {/* Live indicator */}
                    {isLive && (
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1.5 bg-red-500 text-white text-sm font-bold rounded-lg flex items-center gap-2">
                          <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                          LIVE
                        </span>
                      </div>
                    )}
                    
                    {/* Connection status */}
                    {isLive && (
                      <div className="absolute top-4 right-4">
                        <ConnectionStatus />
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
                    {obsConnected && obsPreviewReady ? (
                      <video ref={previewVideoRef} autoPlay playsInline muted className="w-full h-full object-contain" />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center p-6">
                          {!streamCredentials ? (
                            <>
                              <Key className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                              <p className="text-white mb-2">Generate Stream Key</p>
                              <p className="text-gray-400 text-sm">Click below to get OBS credentials</p>
                            </>
                          ) : obsConnected ? (
                            <>
                              <Loader2 className="w-12 h-12 text-purple-500 animate-spin mx-auto mb-3" />
                              <p className="text-white mb-2">Loading preview...</p>
                            </>
                          ) : (
                            <>
                              <Server className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                              <p className="text-white mb-2">Waiting for OBS...</p>
                              <p className="text-gray-400 text-sm">Start streaming in OBS</p>
                            </>
                          )}
                        </div>
                      </div>
                    )}
                    <video ref={previewVideoRef} className={obsPreviewReady ? '' : 'hidden'} />
                  </>
                )}
              </div>

              {/* OBS Credentials */}
              {streamMode === STREAM_MODES.SOFTWARE && !isLive && (
                <div className="mt-4 bg-gray-800 rounded-xl p-4">
                  <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                    <Key className="w-5 h-5" />Stream Credentials
                  </h3>
                  
                  {streamCredentials ? (
                    <div className="space-y-3">
                      <div>
                        <label className="text-gray-400 text-sm">Server URL</label>
                        <div className="flex items-center gap-2 mt-1">
                          <input type="text" value={streamCredentials.rtmpUrl} readOnly className="flex-1 px-3 py-2 bg-gray-700 text-white rounded-lg text-sm" />
                          <button onClick={() => copyToClipboard(streamCredentials.rtmpUrl, 'URL')} className="p-2 bg-gray-700 text-white rounded-lg">
                            <Copy className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      
                      <div>
                        <label className="text-gray-400 text-sm">Stream Key</label>
                        <div className="flex items-center gap-2 mt-1">
                          <input type={showStreamKey ? 'text' : 'password'} value={streamCredentials.streamKey} readOnly className="flex-1 px-3 py-2 bg-gray-700 text-white rounded-lg text-sm font-mono" />
                          <button onClick={() => setShowStreamKey(!showStreamKey)} className="p-2 bg-gray-700 text-white rounded-lg">
                            {showStreamKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                          <button onClick={() => copyToClipboard(streamCredentials.streamKey, 'Key')} className="p-2 bg-gray-700 text-white rounded-lg">
                            <Copy className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      
                      <div className={`flex items-center gap-2 p-3 rounded-lg ${obsConnected ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                        {obsConnected ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                        {obsConnected ? 'OBS Connected!' : 'Waiting for OBS...'}
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

              {/* Debug Log */}
              {streamMode === STREAM_MODES.CAMERA && debugLog.length > 0 && (
                <div className="mt-4 bg-gray-800 rounded-xl p-4 max-h-40 overflow-y-auto">
                  <h4 className="text-gray-400 text-xs mb-2">Debug Log</h4>
                  {debugLog.map((log, i) => (
                    <div key={i} className="text-gray-500 text-xs font-mono">{log}</div>
                  ))}
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              <div className="bg-gray-800 rounded-xl p-4">
                <h3 className="text-white font-semibold mb-4">Stream Details</h3>
                
                <div className="mb-4">
                  <label className="text-gray-400 text-sm">Title *</label>
                  <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="What's this stream about?" disabled={isLive} className="w-full mt-1 px-3 py-2 bg-gray-700 text-white rounded-lg disabled:opacity-50" />
                </div>
                
                <div className="mb-4">
                  <label className="text-gray-400 text-sm">Description</label>
                  <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Tell viewers more..." disabled={isLive} rows={3} className="w-full mt-1 px-3 py-2 bg-gray-700 text-white rounded-lg disabled:opacity-50 resize-none" />
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
                <button 
                  onClick={goLive} 
                  disabled={loading || !title.trim() || (streamMode === STREAM_MODES.SOFTWARE && !obsConnected) || (streamMode === STREAM_MODES.CAMERA && !mediaStreamRef.current)} 
                  className="w-full py-4 bg-red-600 text-white rounded-xl font-bold text-lg hover:bg-red-700 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <><Radio className="w-6 h-6" />Go Live</>}
                </button>
              )}

              {/* Checklist */}
              {!isLive && (
                <div className="bg-gray-800 rounded-xl p-4">
                  <h3 className="text-white font-semibold mb-3">Checklist</h3>
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
                  </div>
                </div>
              )}

              {/* Stream Stats */}
              {isLive && streamMode === STREAM_MODES.CAMERA && (
                <div className="bg-gray-800 rounded-xl p-4">
                  <h3 className="text-white font-semibold mb-3">Stream Stats</h3>
                  <div className="space-y-2 text-sm text-gray-300">
                    <div className="flex justify-between">
                      <span>Data sent:</span>
                      <span>{formatBytes(bytesSent)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Chunks:</span>
                      <span>{chunksSent}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Duration:</span>
                      <span>{formatDuration(streamDuration)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Viewers:</span>
                      <span>{viewerCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Status:</span>
                      <span className={connectionState === CONNECTION_STATES.STREAMING ? 'text-green-400' : 'text-yellow-400'}>
                        {connectionState}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
