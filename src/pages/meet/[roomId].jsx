// ============================================
// FILE: src/pages/meet/[roomId].jsx
// PURPOSE: Video Meeting Room - Mobile Optimized
// Uses Daily.co for video infrastructure
// ============================================

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import DailyIframe from '@daily-co/daily-js';
import {
  Video, VideoOff, Mic, MicOff, Phone, Monitor, Users,
  MessageSquare, Hand, Settings, MoreVertical, Copy,
  Share2, Grid, Maximize2, Minimize2, PhoneOff, Volume2,
  VolumeX, Camera, FlipHorizontal, X, Send, Smile
} from 'lucide-react';

export default function MeetingRoom() {
  const router = useRouter();
  const { roomId } = router.query;
  
  const [callFrame, setCallFrame] = useState(null);
  const [joined, setJoined] = useState(false);
  const [participants, setParticipants] = useState([]);
  const [localParticipant, setLocalParticipant] = useState(null);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showParticipants, setShowParticipants] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [meetingInfo, setMeetingInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [handRaised, setHandRaised] = useState(false);
  const [showControls, setShowControls] = useState(true);
  
  const containerRef = useRef(null);
  const controlsTimeoutRef = useRef(null);
  const API = process.env.NEXT_PUBLIC_API_URL || '';

  // Fetch meeting info and join
  useEffect(() => {
    if (roomId) {
      joinMeeting();
    }
    return () => {
      if (callFrame) {
        callFrame.destroy();
      }
    };
  }, [roomId]);

  // Auto-hide controls on mobile
  useEffect(() => {
    const handleTouch = () => {
      setShowControls(true);
      clearTimeout(controlsTimeoutRef.current);
      controlsTimeoutRef.current = setTimeout(() => {
        if (joined) setShowControls(false);
      }, 5000);
    };

    if (joined) {
      document.addEventListener('touchstart', handleTouch);
      handleTouch();
    }

    return () => {
      document.removeEventListener('touchstart', handleTouch);
      clearTimeout(controlsTimeoutRef.current);
    };
  }, [joined]);

  const joinMeeting = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      // Get meeting room URL from backend
      const res = await fetch(`${API}/api/meet/join/${roomId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` })
        }
      });
      
      const data = await res.json();
      
      if (!data.ok) {
        setError(data.error || 'Failed to join meeting');
        setLoading(false);
        return;
      }

      setMeetingInfo(data.meeting);

      // Create Daily.co call frame
      const frame = DailyIframe.createFrame(containerRef.current, {
        iframeStyle: {
          width: '100%',
          height: '100%',
          border: 'none',
          borderRadius: '0'
        },
        showLeaveButton: false,
        showFullscreenButton: false,
        showLocalVideo: true,
        showParticipantsBar: false
      });

      // Set up event handlers
      frame.on('joined-meeting', handleJoined);
      frame.on('left-meeting', handleLeft);
      frame.on('participant-joined', handleParticipantJoined);
      frame.on('participant-left', handleParticipantLeft);
      frame.on('participant-updated', handleParticipantUpdated);
      frame.on('error', handleError);
      frame.on('app-message', handleAppMessage);

      setCallFrame(frame);

      // Join the meeting
      await frame.join({
        url: data.roomUrl,
        token: data.token, // If using meeting tokens
        userName: data.userName || 'Guest'
      });

    } catch (err) {
      console.error('Error joining meeting:', err);
      setError('Failed to connect to meeting');
    } finally {
      setLoading(false);
    }
  };

  // Event Handlers
  const handleJoined = useCallback((event) => {
    setJoined(true);
    setLocalParticipant(event.participants.local);
    updateParticipants(event.participants);
  }, []);

  const handleLeft = useCallback(() => {
    router.push('/meet');
  }, [router]);

  const handleParticipantJoined = useCallback((event) => {
    setParticipants(prev => [...prev, event.participant]);
  }, []);

  const handleParticipantLeft = useCallback((event) => {
    setParticipants(prev => prev.filter(p => p.session_id !== event.participant.session_id));
  }, []);

  const handleParticipantUpdated = useCallback((event) => {
    if (event.participant.local) {
      setLocalParticipant(event.participant);
    }
    setParticipants(prev => prev.map(p => 
      p.session_id === event.participant.session_id ? event.participant : p
    ));
  }, []);

  const handleError = useCallback((event) => {
    console.error('Daily error:', event);
    setError(event.errorMsg || 'Meeting error');
  }, []);

  const handleAppMessage = useCallback((event) => {
    if (event.data.type === 'chat') {
      setMessages(prev => [...prev, {
        id: Date.now(),
        sender: event.data.sender,
        text: event.data.text,
        timestamp: new Date()
      }]);
    }
  }, []);

  const updateParticipants = (participantsObj) => {
    const participantsList = Object.values(participantsObj).filter(p => !p.local);
    setParticipants(participantsList);
  };

  // Control Functions
  const toggleAudio = () => {
    if (callFrame) {
      const newState = !isAudioEnabled;
      callFrame.setLocalAudio(newState);
      setIsAudioEnabled(newState);
    }
  };

  const toggleVideo = () => {
    if (callFrame) {
      const newState = !isVideoEnabled;
      callFrame.setLocalVideo(newState);
      setIsVideoEnabled(newState);
    }
  };

  const toggleScreenShare = async () => {
    if (callFrame) {
      if (isScreenSharing) {
        await callFrame.stopScreenShare();
      } else {
        await callFrame.startScreenShare();
      }
      setIsScreenSharing(!isScreenSharing);
    }
  };

  const toggleHandRaise = () => {
    if (callFrame) {
      callFrame.sendAppMessage({ 
        type: 'hand-raise', 
        raised: !handRaised,
        sender: localParticipant?.user_name 
      }, '*');
      setHandRaised(!handRaised);
    }
  };

  const sendMessage = () => {
    if (callFrame && newMessage.trim()) {
      callFrame.sendAppMessage({
        type: 'chat',
        text: newMessage,
        sender: localParticipant?.user_name || 'Me'
      }, '*');
      
      setMessages(prev => [...prev, {
        id: Date.now(),
        sender: 'Me',
        text: newMessage,
        timestamp: new Date(),
        isLocal: true
      }]);
      
      setNewMessage('');
    }
  };

  const leaveMeeting = () => {
    if (callFrame) {
      callFrame.leave();
    }
    router.push('/meet');
  };

  const copyMeetingLink = () => {
    const link = `${window.location.origin}/meet/${roomId}`;
    navigator.clipboard.writeText(link);
    alert('Meeting link copied!');
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Loading State
  if (loading) {
    return (
      <div className="fixed inset-0 bg-gray-900 flex flex-col items-center justify-center">
        <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-white text-lg">Joining meeting...</p>
        <p className="text-gray-400 text-sm mt-2">Setting up your video</p>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="fixed inset-0 bg-gray-900 flex flex-col items-center justify-center p-6">
        <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mb-4">
          <PhoneOff className="w-10 h-10 text-red-500" />
        </div>
        <h2 className="text-white text-xl font-semibold mb-2">Unable to Join</h2>
        <p className="text-gray-400 text-center mb-6">{error}</p>
        <button
          onClick={() => router.push('/meet')}
          className="px-6 py-3 bg-purple-600 text-white rounded-lg font-medium"
        >
          Back to Meetings
        </button>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{meetingInfo?.title || 'Meeting'} | CYBEV Meet</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
      </Head>

      <div className="fixed inset-0 bg-gray-900 flex flex-col">
        {/* Meeting Info Bar */}
        <div className={`absolute top-0 left-0 right-0 z-20 bg-gradient-to-b from-black/70 to-transparent p-4 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-white font-semibold truncate max-w-[200px]">
                {meetingInfo?.title || 'Meeting'}
              </h1>
              <p className="text-gray-300 text-xs flex items-center gap-2">
                <span className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  {participants.length + 1}
                </span>
                <span className="w-1 h-1 bg-gray-400 rounded-full" />
                <span>{roomId}</span>
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={copyMeetingLink}
                className="p-2 bg-white/10 rounded-lg text-white hover:bg-white/20"
              >
                <Copy className="w-5 h-5" />
              </button>
              <button
                onClick={toggleFullscreen}
                className="p-2 bg-white/10 rounded-lg text-white hover:bg-white/20"
              >
                {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Video Container */}
        <div ref={containerRef} className="flex-1 relative" onClick={() => setShowControls(true)} />

        {/* Chat Sidebar */}
        {showChat && (
          <div className="absolute right-0 top-0 bottom-0 w-80 bg-gray-800 border-l border-gray-700 flex flex-col z-30">
            <div className="p-4 border-b border-gray-700 flex items-center justify-between">
              <h3 className="font-semibold text-white">Chat</h3>
              <button onClick={() => setShowChat(false)} className="p-1 hover:bg-gray-700 rounded">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map(msg => (
                <div key={msg.id} className={`${msg.isLocal ? 'text-right' : ''}`}>
                  <p className="text-xs text-gray-400 mb-1">{msg.sender}</p>
                  <div className={`inline-block px-3 py-2 rounded-lg max-w-[80%] ${
                    msg.isLocal ? 'bg-purple-600 text-white' : 'bg-gray-700 text-white'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>
            <div className="p-3 border-t border-gray-700">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Type a message..."
                  className="flex-1 px-3 py-2 bg-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <button
                  onClick={sendMessage}
                  className="p-2 bg-purple-600 rounded-lg text-white"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Participants Sidebar */}
        {showParticipants && (
          <div className="absolute right-0 top-0 bottom-0 w-80 bg-gray-800 border-l border-gray-700 flex flex-col z-30">
            <div className="p-4 border-b border-gray-700 flex items-center justify-between">
              <h3 className="font-semibold text-white">Participants ({participants.length + 1})</h3>
              <button onClick={() => setShowParticipants(false)} className="p-1 hover:bg-gray-700 rounded">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {/* Local participant */}
              <div className="flex items-center gap-3 p-2 rounded-lg bg-purple-600/20">
                <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-medium">
                    {localParticipant?.user_name?.[0] || 'Y'}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="text-white font-medium">{localParticipant?.user_name || 'You'} (You)</p>
                </div>
                <div className="flex gap-1">
                  {!isAudioEnabled && <MicOff className="w-4 h-4 text-red-400" />}
                  {!isVideoEnabled && <VideoOff className="w-4 h-4 text-red-400" />}
                </div>
              </div>
              
              {/* Other participants */}
              {participants.map(p => (
                <div key={p.session_id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-700">
                  <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-medium">
                      {p.user_name?.[0] || '?'}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="text-white">{p.user_name || 'Guest'}</p>
                  </div>
                  <div className="flex gap-1">
                    {!p.audio && <MicOff className="w-4 h-4 text-red-400" />}
                    {!p.video && <VideoOff className="w-4 h-4 text-red-400" />}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bottom Controls */}
        <div className={`absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-black/70 to-transparent p-4 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
          <div className="flex items-center justify-center gap-3 max-w-lg mx-auto">
            {/* Audio Toggle */}
            <button
              onClick={toggleAudio}
              className={`p-4 rounded-full transition ${
                isAudioEnabled 
                  ? 'bg-gray-700 text-white hover:bg-gray-600' 
                  : 'bg-red-500 text-white'
              }`}
            >
              {isAudioEnabled ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
            </button>

            {/* Video Toggle */}
            <button
              onClick={toggleVideo}
              className={`p-4 rounded-full transition ${
                isVideoEnabled 
                  ? 'bg-gray-700 text-white hover:bg-gray-600' 
                  : 'bg-red-500 text-white'
              }`}
            >
              {isVideoEnabled ? <Video className="w-6 h-6" /> : <VideoOff className="w-6 h-6" />}
            </button>

            {/* Screen Share (Desktop only) */}
            <button
              onClick={toggleScreenShare}
              className={`p-4 rounded-full transition hidden md:flex ${
                isScreenSharing 
                  ? 'bg-green-500 text-white' 
                  : 'bg-gray-700 text-white hover:bg-gray-600'
              }`}
            >
              <Monitor className="w-6 h-6" />
            </button>

            {/* Hand Raise */}
            <button
              onClick={toggleHandRaise}
              className={`p-4 rounded-full transition ${
                handRaised 
                  ? 'bg-yellow-500 text-white' 
                  : 'bg-gray-700 text-white hover:bg-gray-600'
              }`}
            >
              <Hand className="w-6 h-6" />
            </button>

            {/* Chat */}
            <button
              onClick={() => { setShowChat(!showChat); setShowParticipants(false); }}
              className={`p-4 rounded-full transition relative ${
                showChat 
                  ? 'bg-purple-500 text-white' 
                  : 'bg-gray-700 text-white hover:bg-gray-600'
              }`}
            >
              <MessageSquare className="w-6 h-6" />
              {messages.length > 0 && !showChat && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs flex items-center justify-center">
                  {messages.length}
                </span>
              )}
            </button>

            {/* Participants */}
            <button
              onClick={() => { setShowParticipants(!showParticipants); setShowChat(false); }}
              className={`p-4 rounded-full transition ${
                showParticipants 
                  ? 'bg-purple-500 text-white' 
                  : 'bg-gray-700 text-white hover:bg-gray-600'
              }`}
            >
              <Users className="w-6 h-6" />
            </button>

            {/* Leave Meeting */}
            <button
              onClick={leaveMeeting}
              className="p-4 rounded-full bg-red-500 text-white hover:bg-red-600 transition"
            >
              <Phone className="w-6 h-6 rotate-[135deg]" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
