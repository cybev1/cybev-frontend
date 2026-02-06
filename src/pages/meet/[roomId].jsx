// ============================================
// FILE: src/pages/meet/[roomId].jsx
// Meeting Room - Jitsi Video Conference
// VERSION: 1.4.0 - Fixed loading overlay issue
// ============================================

import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Copy, Check, Users, PhoneOff, AlertTriangle } from 'lucide-react';
import { meetAPI } from '@/lib/api';

export default function MeetingRoom() {
  const router = useRouter();
  const { roomId } = router.query;
  const jitsiContainer = useRef(null);
  const [copied, setCopied] = useState(false);
  const [participants, setParticipants] = useState(1);
  const [jitsiApi, setJitsiApi] = useState(null);

  useEffect(() => {
  if (!roomId) return;

  let cancelled = false;
  let heartbeatTimer = null;
  let pollTimer = null;
  let cleanupScript = null;

  const loadScript = (baseUrlOrDomain) => {
    const domain = (baseUrlOrDomain || '').replace(/^https?:\/\//, '').replace(/\/$/, '');
    const script = document.createElement('script');
    script.src = `https://${domain}/external_api.js`;
    script.async = true;
    script.onload = () => initJitsi(domain);
    document.body.appendChild(script);
    cleanupScript = () => {
      try { document.body.removeChild(script); } catch (e) {}
    };
  };

  const startHeartbeat = () => {
    heartbeatTimer = setInterval(async () => {
      try {
        const r = await meetAPI.heartbeat(roomId);
        const data = r?.data || r;
        if (data?.ended) {
          alert(
            data?.reason === 'monthly_limit' ? 'Monthly meeting minutes exhausted. Please upgrade or top up.' :
            data?.reason === 'per_meeting_limit' ? 'Meeting time limit reached.' :
            data?.reason === 'event_boost_exhausted' ? 'Event Boost minutes exhausted. Please top up.' :
            'Meeting ended.'
          );
          if (jitsiApi) jitsiApi.executeCommand('hangup');
          router.push('/meet');
        }
      } catch (e) {}
    }, 30000);
  };

  const joinAndInit = async () => {
    try {
      const resp = await meetAPI.joinRoom(roomId);
      const data = resp?.data || {};
      if (cancelled) return;

      const joinUrl = data.joinUrl || data.url || data.meeting?.joinUrl;
      const token = data.token || data.jwt || data.meeting?.token;
      const role = data.role || data.meeting?.role;

      let baseUrl = data.baseUrl || data.meeting?.baseUrl;
      if (!baseUrl && joinUrl) {
        try { baseUrl = new URL(joinUrl).origin; } catch (e) {}
      }
      if (!baseUrl) baseUrl = 'https://meet.cybev.io';

      window.__CYBEV_MEET = { token, role, baseUrl };

      // Load external api from our server (not public meet.jit.si)
      loadScript(baseUrl);

      if (role === 'host' || role === 'moderator') startHeartbeat();

      // stop polling if any
      if (pollTimer) { clearInterval(pollTimer); pollTimer = null; }
    } catch (e) {
      const status = e?.response?.status;
      if (status === 423) {
        if (!pollTimer) pollTimer = setInterval(joinAndInit, 5000);
        return;
      }
      console.error('Failed to join meeting:', e);
      alert(e?.response?.data?.error || 'Failed to join meeting');
      router.push('/meet');
    }
  };

  joinAndInit();

  return () => {
    cancelled = true;
    if (heartbeatTimer) clearInterval(heartbeatTimer);
    if (pollTimer) clearInterval(pollTimer);
    if (cleanupScript) cleanupScript();
    if (jitsiApi) {
      try { jitsiApi.dispose(); } catch (e) {}
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
      const meetCfg = (typeof window !== 'undefined' && window.__CYBEV_MEET) ? window.__CYBEV_MEET : {};
      const api = new window.JitsiMeetExternalAPI(domain || 'meet.cybev.io', {
        jwt: meetCfg.token || undefined,
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
{/* Waiting banner (host-only start) */}
{typeof window !== 'undefined' && window.__CYBEV_MEET?.role === 'guest' && (
  <div className="bg-yellow-900/30 border-b border-yellow-700 px-4 py-2 text-yellow-200 text-sm flex items-center gap-2">
    <AlertTriangle className="w-4 h-4" />
    If the host hasn't started yet, you'll stay on standby until the meeting begins.
  </div>
)}

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
