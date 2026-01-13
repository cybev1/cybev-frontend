// ============================================
// FILE: src/pages/meet/[roomId].jsx
// Meeting Room - Jitsi Video Conference
// VERSION: 1.4.0 - Fixed loading overlay issue
// ============================================

import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Copy, Check, Users, PhoneOff } from 'lucide-react';

export default function MeetingRoom() {
  const router = useRouter();
  const { roomId } = router.query;
  const jitsiContainer = useRef(null);
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
    
    // Set up MutationObserver to add permissions to iframe
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.tagName === 'IFRAME') {
            node.setAttribute('allow', 'camera; microphone; fullscreen; display-capture; autoplay; clipboard-write; encrypted-media');
            console.log('✅ Permissions added to Jitsi iframe');
          }
        });
      });
    });
    
    observer.observe(jitsiContainer.current, { childList: true, subtree: true });
    
    try {
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
          enableNoAudioDetection: false,
          enableNoisyMicDetection: false,
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
          DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
        },
        userInfo: {
          displayName: user.username || user.name || 'Guest',
          email: user.email || '',
        }
      });

      // Backup iframe permission setting
      setTimeout(() => {
        const iframe = jitsiContainer.current?.querySelector('iframe');
        if (iframe) {
          iframe.setAttribute('allow', 'camera; microphone; fullscreen; display-capture; autoplay; clipboard-write; encrypted-media');
        }
        observer.disconnect();
      }, 500);

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
    } catch (err) {
      console.error('Failed to initialize Jitsi:', err);
    }
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

      <div className="h-screen bg-gray-900 flex flex-col">
        {/* Header */}
        <div className="bg-gray-800 border-b border-gray-700 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-white font-semibold">CYBEV Meet</span>
            <span className="text-gray-400 text-sm">Room: {roomId}</span>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <Users className="w-4 h-4" />
              <span>{participants}</span>
            </div>
            
            <button
              onClick={copyLink}
              className="flex items-center gap-2 px-3 py-1.5 bg-gray-700 text-white rounded-lg text-sm hover:bg-gray-600"
            >
              {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied!' : 'Copy Link'}
            </button>
            
            <button
              onClick={leaveMeeting}
              className="flex items-center gap-2 px-3 py-1.5 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700"
            >
              <PhoneOff className="w-4 h-4" />
              Leave
            </button>
          </div>
        </div>

        {/* Jitsi Container - NO loading overlay, let Jitsi handle it */}
        <div ref={jitsiContainer} className="flex-1 w-full" />
      </div>
    </>
  );
}
