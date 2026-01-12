// ============================================
// FILE: src/pages/meet/[roomId].jsx
// Meeting Room - Jitsi Video Conference
// VERSION: 1.0.0 - NEW FEATURE
// ============================================

import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Loader2, Copy, Check, Users, PhoneOff } from 'lucide-react';

export default function MeetingRoom() {
  const router = useRouter();
  const { roomId } = router.query;
  const jitsiContainer = useRef(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [participants, setParticipants] = useState(1);
  const [jitsiApi, setJitsiApi] = useState(null);

  useEffect(() => {
    if (!roomId) return;

    // Load Jitsi script
    const script = document.createElement('script');
    script.src = 'https://meet.jit.si/external_api.js';
    script.async = true;
    script.onload = initJitsi;
    document.body.appendChild(script);

    return () => {
      if (jitsiApi) {
        jitsiApi.dispose();
      }
    };
  }, [roomId]);

  const initJitsi = () => {
    if (!window.JitsiMeetExternalAPI || !jitsiContainer.current) return;

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    const api = new window.JitsiMeetExternalAPI('meet.jit.si', {
      roomName: `cybev-${roomId}`,
      parentNode: jitsiContainer.current,
      width: '100%',
      height: '100%',
      configOverwrite: {
        startWithAudioMuted: true,
        startWithVideoMuted: false,
        prejoinPageEnabled: false,
        disableDeepLinking: true,
      },
      interfaceConfigOverwrite: {
        TOOLBAR_BUTTONS: [
          'microphone', 'camera', 'desktop', 'fullscreen',
          'fodeviceselection', 'hangup', 'chat', 'recording',
          'settings', 'raisehand', 'videoquality', 'filmstrip',
          'participants-pane', 'tileview'
        ],
        SHOW_JITSI_WATERMARK: false,
        SHOW_WATERMARK_FOR_GUESTS: false,
        DEFAULT_BACKGROUND: '#1a1a2e',
        TOOLBAR_ALWAYS_VISIBLE: true,
      },
      userInfo: {
        displayName: user.username || user.name || 'Guest',
        email: user.email || '',
      }
    });

    api.addEventListener('videoConferenceJoined', () => {
      setLoading(false);
    });

    api.addEventListener('participantJoined', () => {
      setParticipants(p => p + 1);
    });

    api.addEventListener('participantLeft', () => {
      setParticipants(p => Math.max(1, p - 1));
    });

    api.addEventListener('readyToClose', () => {
      router.push('/meet');
    });

    setJitsiApi(api);
  };

  const copyLink = () => {
    navigator.clipboard.writeText(`https://cybev.io/meet/${roomId}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const leaveMeeting = () => {
    if (jitsiApi) {
      jitsiApi.executeCommand('hangup');
    }
    router.push('/meet');
  };

  return (
    <>
      <Head>
        <title>Meeting - CYBEV</title>
      </Head>

      <div className="h-screen bg-gray-50 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-gray-900 font-semibold">CYBEV Meet</span>
            <span className="text-gray-500 text-sm">Room: {roomId}</span>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-gray-500 text-sm">
              <Users className="w-4 h-4" />
              <span>{participants}</span>
            </div>
            
            <button
              onClick={copyLink}
              className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 text-gray-900 rounded-lg text-sm hover:bg-gray-600"
            >
              {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied!' : 'Copy Link'}
            </button>
            
            <button
              onClick={leaveMeeting}
              className="flex items-center gap-2 px-3 py-1.5 bg-red-600 text-gray-900 rounded-lg text-sm hover:bg-red-700"
            >
              <PhoneOff className="w-4 h-4" />
              Leave
            </button>
          </div>
        </div>

        {/* Jitsi Container */}
        <div className="flex-1 relative">
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-50 z-10">
              <div className="text-center">
                <Loader2 className="w-12 h-12 text-purple-500 animate-spin mx-auto mb-4" />
                <p className="text-gray-900 text-lg">Joining meeting...</p>
                <p className="text-gray-500 text-sm mt-2">Please allow camera and microphone access</p>
              </div>
            </div>
          )}
          <div ref={jitsiContainer} className="w-full h-full" />
        </div>
      </div>
    </>
  );
}
