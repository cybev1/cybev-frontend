/**
 * Meeting Room - Video Conference
 * CYBEV Studio v2.0
 * GitHub: https://github.com/cybev1/cybev-frontend/pages/meet/[roomId].jsx
 * 
 * Uses Jitsi Meet via CDN (FREE, no API key needed)
 */

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Script from 'next/script';

export default function MeetingRoom() {
  const router = useRouter();
  const { roomId } = router.query;
  const jitsiContainerRef = useRef(null);
  const jitsiApiRef = useRef(null);
  
  const [isLoading, setIsLoading] = useState(true);
  const [meeting, setMeeting] = useState(null);
  const [error, setError] = useState(null);
  const [jitsiLoaded, setJitsiLoaded] = useState(false);
  const [copied, setCopied] = useState(false);

  // Fetch meeting details
  useEffect(() => {
    if (!roomId) return;

    const fetchMeeting = async () => {
      try {
        const res = await fetch(`/api/meet/${roomId}`);
        if (res.ok) {
          const data = await res.json();
          setMeeting(data.meeting);
        }
      } catch (err) {
        console.error('Failed to fetch meeting:', err);
      }
    };

    fetchMeeting();
  }, [roomId]);

  // Initialize Jitsi when ready
  useEffect(() => {
    if (!jitsiLoaded || !roomId || !jitsiContainerRef.current) return;
    if (jitsiApiRef.current) return; // Already initialized

    initializeJitsi();
  }, [jitsiLoaded, roomId]);

  const initializeJitsi = () => {
    try {
      const domain = 'meet.jit.si';
      const options = {
        roomName: `cybev-${roomId}`,
        parentNode: jitsiContainerRef.current,
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
            'fodeviceselection', 'hangup', 'chat', 'raisehand',
            'videoquality', 'filmstrip', 'participants-pane', 'tileview'
          ],
          SHOW_JITSI_WATERMARK: false,
          SHOW_WATERMARK_FOR_GUESTS: false,
          SHOW_BRAND_WATERMARK: false,
          BRAND_WATERMARK_LINK: '',
          SHOW_POWERED_BY: false,
          SHOW_PROMOTIONAL_CLOSE_PAGE: false,
          MOBILE_APP_PROMO: false,
        },
      };

      jitsiApiRef.current = new window.JitsiMeetExternalAPI(domain, options);

      jitsiApiRef.current.addListener('videoConferenceJoined', () => {
        setIsLoading(false);
        // Record join
        fetch(`/api/meet/join/${roomId}`, { method: 'POST' }).catch(() => {});
      });

      jitsiApiRef.current.addListener('videoConferenceLeft', () => {
        router.push('/meet');
      });

      jitsiApiRef.current.addListener('readyToClose', () => {
        router.push('/meet');
      });

      setIsLoading(false);
    } catch (err) {
      console.error('Failed to initialize Jitsi:', err);
      setError('Failed to load video conference. Please refresh the page.');
      setIsLoading(false);
    }
  };

  const copyLink = () => {
    const url = `${window.location.origin}/meet/${roomId}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const leaveMeeting = () => {
    if (jitsiApiRef.current) {
      jitsiApiRef.current.executeCommand('hangup');
    }
    router.push('/meet');
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (jitsiApiRef.current) {
        jitsiApiRef.current.dispose();
      }
    };
  }, []);

  return (
    <>
      <Head>
        <title>{meeting?.title || 'Meeting'} - CYBEV Meet</title>
      </Head>

      {/* Load Jitsi External API */}
      <Script
        src="https://meet.jit.si/external_api.js"
        onLoad={() => setJitsiLoaded(true)}
        onError={() => setError('Failed to load video conference. Please check your connection.')}
      />

      <div style={styles.container}>
        {/* Top Bar */}
        <div style={styles.topBar}>
          <div style={styles.meetingInfo}>
            <h1 style={styles.meetingTitle}>{meeting?.title || 'Meeting'}</h1>
            <span style={styles.roomCode}>{roomId}</span>
          </div>
          
          <div style={styles.topActions}>
            <button onClick={copyLink} style={styles.copyButton}>
              {copied ? '✓ Copied!' : 'Copy Link'}
            </button>
            <button onClick={leaveMeeting} style={styles.leaveButton}>
              Leave
            </button>
          </div>
        </div>

        {/* Video Container */}
        <div style={styles.videoContainer}>
          {isLoading && !error && (
            <div style={styles.loadingOverlay}>
              <div style={styles.spinner}></div>
              <p style={styles.loadingText}>Connecting to meeting...</p>
            </div>
          )}

          {error && (
            <div style={styles.errorContainer}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="15" y1="9" x2="9" y2="15"></line>
                <line x1="9" y1="9" x2="15" y2="15"></line>
              </svg>
              <p style={styles.errorText}>{error}</p>
              <button onClick={() => window.location.reload()} style={styles.retryButton}>
                Try Again
              </button>
            </div>
          )}

          <div ref={jitsiContainerRef} style={styles.jitsiContainer} />
        </div>
      </div>

      <style jsx global>{`
        body {
          margin: 0;
          padding: 0;
          overflow: hidden;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
}

const styles = {
  container: {
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    background: '#0F172A',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  topBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 24px',
    background: '#1E293B',
    borderBottom: '1px solid #334155',
  },
  meetingInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  meetingTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#FFFFFF',
    margin: 0,
  },
  roomCode: {
    padding: '4px 12px',
    background: '#334155',
    color: '#94A3B8',
    borderRadius: '6px',
    fontSize: '13px',
    fontFamily: 'monospace',
  },
  topActions: {
    display: 'flex',
    gap: '12px',
  },
  copyButton: {
    padding: '8px 16px',
    background: '#334155',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'background 0.2s',
  },
  leaveButton: {
    padding: '8px 20px',
    background: '#EF4444',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  videoContainer: {
    flex: 1,
    position: 'relative',
    background: '#0F172A',
  },
  jitsiContainer: {
    width: '100%',
    height: '100%',
  },
  loadingOverlay: {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#0F172A',
    zIndex: 10,
  },
  spinner: {
    width: '48px',
    height: '48px',
    border: '4px solid #334155',
    borderTopColor: '#8B5CF6',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  loadingText: {
    marginTop: '16px',
    color: '#94A3B8',
    fontSize: '16px',
  },
  errorContainer: {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#0F172A',
    zIndex: 10,
  },
  errorText: {
    marginTop: '16px',
    color: '#F87171',
    fontSize: '16px',
    textAlign: 'center',
    maxWidth: '400px',
  },
  retryButton: {
    marginTop: '16px',
    padding: '12px 24px',
    background: '#8B5CF6',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '8px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
  },
};
