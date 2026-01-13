// ============================================
// FILE: src/pages/meet/[roomId].jsx
// Meeting Room - Jitsi Video Conference
// VERSION: 1.3.0 - Better permission error handling
// ============================================

import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Loader2, Copy, Check, Users, PhoneOff, AlertCircle, RefreshCw } from 'lucide-react';

export default function MeetingRoom() {
  const router = useRouter();
  const { roomId } = router.query;
  const jitsiContainer = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
    script.onerror = () => setError('Failed to load video conferencing. Please refresh.');
    document.body.appendChild(script);

    // Timeout for loading
    const timeout = setTimeout(() => {
      if (loading) {
        setError('Connection timeout. Camera/microphone may be blocked by browser permissions.');
        setLoading(false);
      }
    }, 15000);

    return () => {
      clearTimeout(timeout);
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
          // Allow joining without media
          startSilent: false,
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

      api.addEventListener('videoConferenceJoined', () => {
        setLoading(false);
        setError(null);
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

      // Handle errors
      api.addEventListener('errorOccurred', (e) => {
        console.error('Jitsi error:', e);
        if (e.error?.name === 'gum.permission_denied') {
          setError('Camera/microphone permission denied. Please allow access in your browser settings.');
        }
      });

      setJitsiApi(api);
    } catch (err) {
      console.error('Failed to initialize Jitsi:', err);
      setError('Failed to start video conference. Please try again.');
      setLoading(false);
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

  const retryConnection = () => {
    setError(null);
    setLoading(true);
    window.location.reload();
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
              className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200"
            >
              {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied!' : 'Copy Link'}
            </button>
            
            <button
              onClick={leaveMeeting}
              className="flex items-center gap-2 px-3 py-1.5 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600"
            >
              <PhoneOff className="w-4 h-4" />
              Leave
            </button>
          </div>
        </div>

        {/* Jitsi Container */}
        <div className="flex-1 relative">
          {loading && !error && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-50 z-10">
              <div className="text-center">
                <Loader2 className="w-12 h-12 text-purple-500 animate-spin mx-auto mb-4" />
                <p className="text-gray-900 text-lg">Joining meeting...</p>
                <p className="text-gray-500 text-sm mt-2">Please allow camera and microphone access</p>
              </div>
            </div>
          )}
          
          {error && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-50 z-10">
              <div className="text-center max-w-md px-4">
                <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <p className="text-gray-900 text-lg font-medium mb-2">Connection Issue</p>
                <p className="text-gray-500 text-sm mb-6">{error}</p>
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={retryConnection}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Try Again
                  </button>
                  <button
                    onClick={leaveMeeting}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                  >
                    Leave
                  </button>
                </div>
                <div className="mt-6 p-4 bg-blue-50 rounded-lg text-left">
                  <p className="text-blue-800 text-sm font-medium mb-2">Troubleshooting:</p>
                  <ul className="text-blue-700 text-xs space-y-1">
                    <li>• Click the camera/lock icon in your browser's address bar</li>
                    <li>• Allow camera and microphone permissions</li>
                    <li>• Make sure no other app is using your camera</li>
                    <li>• Try using Chrome or Edge browser</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
          
          <div ref={jitsiContainer} className="w-full h-full" />
        </div>
      </div>
    </>
  );
}
