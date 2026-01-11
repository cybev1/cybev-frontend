// ============================================
// FILE: [roomId].jsx
// PATH: cybev-frontend/src/pages/meet/[roomId].jsx
// PURPOSE: Video Meeting Room - Jitsi (free) / Daily.co
// VERSION: 1.0.0
// GITHUB: https://github.com/cybev1/cybev-frontend
// NOTE: Uses Jitsi via script tag - NO npm package needed
// ============================================

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Script from 'next/script';
import { Mic, MicOff, Video, VideoOff, PhoneOff, Users, MessageSquare, Monitor, Hand, Maximize, X, Copy } from 'lucide-react';

export default function MeetingRoom() {
  const router = useRouter();
  const { roomId } = router.query;
  const jitsiRef = useRef(null);
  const apiRef = useRef(null);
  
  const [meeting, setMeeting] = useState(null);
  const [provider, setProvider] = useState('jitsi');
  const [providerConfig, setProviderConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [jitsiReady, setJitsiReady] = useState(false);
  const [userName, setUserName] = useState('');
  const [audioOn, setAudioOn] = useState(true);
  const [videoOn, setVideoOn] = useState(true);
  const [participants, setParticipants] = useState(1);

  const API = process.env.NEXT_PUBLIC_API_URL || '';

  useEffect(() => { if (roomId) joinMeeting(); }, [roomId]);

  useEffect(() => {
    if (jitsiReady && meeting && provider === 'jitsi' && !apiRef.current) initJitsi();
  }, [jitsiReady, meeting, provider]);

  const joinMeeting = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      
      let name = 'Guest';
      if (token) {
        try {
          const userRes = await fetch(`${API}/api/users/me`, { headers });
          const userData = await userRes.json();
          if (userData.ok) name = userData.user?.name || 'Guest';
        } catch {}
      }
      setUserName(name);

      const res = await fetch(`${API}/api/meet/join/${roomId}`, {
        method: 'POST',
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({ name })
      });
      const data = await res.json();

      if (data.ok) {
        setMeeting(data.meeting);
        setProvider(data.provider || 'jitsi');
        setProviderConfig(data.providerConfig);
        setUserName(data.userName || name);
      } else {
        setError(data.error || 'Meeting not found');
      }
    } catch (err) {
      setError('Failed to load meeting');
    } finally {
      setLoading(false);
    }
  };

  const initJitsi = () => {
    if (!jitsiRef.current || !window.JitsiMeetExternalAPI) return;
    
    const domain = providerConfig?.domain || 'meet.jit.si';
    apiRef.current = new window.JitsiMeetExternalAPI(domain, {
      roomName: roomId,
      parentNode: jitsiRef.current,
      userInfo: { displayName: userName },
      configOverwrite: {
        startWithAudioMuted: !audioOn,
        startWithVideoMuted: !videoOn,
        prejoinPageEnabled: false,
        disableDeepLinking: true
      },
      interfaceConfigOverwrite: {
        TOOLBAR_BUTTONS: ['microphone', 'camera', 'desktop', 'chat', 'raisehand', 'participants-pane', 'tileview', 'fullscreen'],
        SHOW_JITSI_WATERMARK: false,
        SHOW_WATERMARK_FOR_GUESTS: false,
        MOBILE_APP_PROMO: false
      }
    });

    apiRef.current.on('videoConferenceJoined', () => setLoading(false));
    apiRef.current.on('videoConferenceLeft', () => handleLeave());
    apiRef.current.on('participantJoined', () => setParticipants(p => p + 1));
    apiRef.current.on('participantLeft', () => setParticipants(p => Math.max(1, p - 1)));
    apiRef.current.on('audioMuteStatusChanged', ({ muted }) => setAudioOn(!muted));
    apiRef.current.on('videoMuteStatusChanged', ({ muted }) => setVideoOn(!muted));
  };

  const toggleAudio = () => apiRef.current?.executeCommand('toggleAudio');
  const toggleVideo = () => apiRef.current?.executeCommand('toggleVideo');
  const toggleChat = () => apiRef.current?.executeCommand('toggleChat');
  const toggleParticipants = () => apiRef.current?.executeCommand('toggleParticipantsPane');
  const shareScreen = () => apiRef.current?.executeCommand('toggleShareScreen');
  const raiseHand = () => apiRef.current?.executeCommand('toggleRaiseHand');
  const toggleFullscreen = () => document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen();

  const handleLeave = async () => {
    apiRef.current?.dispose();
    const token = localStorage.getItem('token');
    try {
      await fetch(`${API}/api/meet/${roomId}/leave`, {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
    } catch {}
    router.push('/meet');
  };

  const copyLink = () => { navigator.clipboard.writeText(window.location.href); alert('Link copied!'); };

  if (loading) return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full mx-auto mb-4" />
        <p className="text-white">Joining meeting...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <X className="w-8 h-8 text-red-500" />
        </div>
        <h1 className="text-xl font-bold text-white mb-2">Unable to Join</h1>
        <p className="text-gray-400 mb-6">{error}</p>
        <button onClick={() => router.push('/meet')} className="px-6 py-3 bg-purple-600 text-white rounded-xl">Back to Meetings</button>
      </div>
    </div>
  );

  return (
    <>
      <Head><title>{meeting?.title || 'Meeting'} | CYBEV Meet</title></Head>
      <Script src="https://meet.jit.si/external_api.js" onLoad={() => setJitsiReady(true)} onError={() => setError('Failed to load video')} />
      
      <div className="min-h-screen bg-gray-900 flex flex-col">
        <div className="bg-gray-800/50 backdrop-blur px-4 py-2 flex items-center justify-between z-10">
          <h1 className="text-white font-medium truncate max-w-[200px]">{meeting?.title}</h1>
          <div className="flex items-center gap-2">
            <span className="text-gray-400 text-sm flex items-center gap-1"><Users className="w-4 h-4" />{participants}</span>
            <button onClick={copyLink} className="p-2 text-gray-400 hover:text-white rounded-lg" title="Copy link"><Copy className="w-4 h-4" /></button>
          </div>
        </div>

        <div ref={jitsiRef} className="flex-1" style={{ minHeight: 'calc(100vh - 140px)' }} />

        <div className="bg-gray-800/90 backdrop-blur px-4 py-3 flex items-center justify-center gap-2 sm:gap-4">
          <button onClick={toggleAudio} className={`p-3 sm:p-4 rounded-full ${audioOn ? 'bg-gray-700 text-white' : 'bg-red-500 text-white'}`}>
            {audioOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
          </button>
          <button onClick={toggleVideo} className={`p-3 sm:p-4 rounded-full ${videoOn ? 'bg-gray-700 text-white' : 'bg-red-500 text-white'}`}>
            {videoOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
          </button>
          <button onClick={shareScreen} className="hidden sm:block p-3 sm:p-4 rounded-full bg-gray-700 text-white"><Monitor className="w-5 h-5" /></button>
          <button onClick={toggleChat} className="p-3 sm:p-4 rounded-full bg-gray-700 text-white"><MessageSquare className="w-5 h-5" /></button>
          <button onClick={toggleParticipants} className="p-3 sm:p-4 rounded-full bg-gray-700 text-white relative">
            <Users className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-purple-600 rounded-full text-xs flex items-center justify-center">{participants}</span>
          </button>
          <button onClick={raiseHand} className="hidden sm:block p-3 sm:p-4 rounded-full bg-gray-700 text-white"><Hand className="w-5 h-5" /></button>
          <button onClick={toggleFullscreen} className="hidden sm:block p-3 sm:p-4 rounded-full bg-gray-700 text-white"><Maximize className="w-5 h-5" /></button>
          <button onClick={handleLeave} className="p-3 sm:p-4 rounded-full bg-red-500 text-white"><PhoneOff className="w-5 h-5" /></button>
        </div>
      </div>
    </>
  );
}
