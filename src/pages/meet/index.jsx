/**
 * Meet Dashboard - Video Conferencing
 * CYBEV Studio v2.0
 * GitHub: https://github.com/cybev1/cybev-frontend/pages/meet/index.jsx
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';

export default function MeetDashboard() {
  const router = useRouter();
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [joinCode, setJoinCode] = useState('');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchMeetings();
  }, []);

  const fetchMeetings = async () => {
    try {
      const res = await fetch('/api/meet/my');
      const data = await res.json();
      setMeetings(data.meetings || []);
    } catch (error) {
      console.error('Failed to fetch meetings:', error);
    } finally {
      setLoading(false);
    }
  };

  const createInstantMeeting = async () => {
    setCreating(true);
    try {
      const res = await fetch('/api/meet/instant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'Instant Meeting' })
      });
      const data = await res.json();
      router.push(`/meet/${data.roomId}`);
    } catch (error) {
      console.error('Failed to create meeting:', error);
      alert('Failed to create meeting. Please try again.');
    } finally {
      setCreating(false);
    }
  };

  const joinMeeting = (e) => {
    e.preventDefault();
    if (joinCode.trim()) {
      router.push(`/meet/${joinCode.trim()}`);
    }
  };

  const upcomingMeetings = meetings.filter(m => m.status === 'pending' && m.type === 'scheduled');
  const recentMeetings = meetings.filter(m => m.status === 'ended').slice(0, 5);

  return (
    <>
      <Head>
        <title>Meet - CYBEV Studio</title>
      </Head>

      <div style={styles.container}>
        {/* Header */}
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>Meet</h1>
            <p style={styles.subtitle}>Start or join video meetings instantly</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div style={styles.actionsGrid}>
          {/* Start Instant Meeting */}
          <div style={styles.actionCard}>
            <div style={styles.actionIcon}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#8B5CF6" strokeWidth="2">
                <polygon points="23 7 16 12 23 17 23 7"></polygon>
                <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
              </svg>
            </div>
            <h3 style={styles.actionTitle}>New Meeting</h3>
            <p style={styles.actionDesc}>Start an instant video meeting</p>
            <button
              onClick={createInstantMeeting}
              disabled={creating}
              style={styles.primaryButton}
            >
              {creating ? 'Creating...' : 'Start Now'}
            </button>
          </div>

          {/* Join Meeting */}
          <div style={styles.actionCard}>
            <div style={styles.actionIcon}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
                <polyline points="10 17 15 12 10 7"></polyline>
                <line x1="15" y1="12" x2="3" y2="12"></line>
              </svg>
            </div>
            <h3 style={styles.actionTitle}>Join Meeting</h3>
            <p style={styles.actionDesc}>Enter a meeting code to join</p>
            <form onSubmit={joinMeeting} style={styles.joinForm}>
              <input
                type="text"
                placeholder="Enter meeting code"
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value)}
                style={styles.input}
              />
              <button type="submit" style={styles.secondaryButton}>
                Join
              </button>
            </form>
          </div>

          {/* Schedule Meeting */}
          <div style={styles.actionCard}>
            <div style={styles.actionIcon}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
            </div>
            <h3 style={styles.actionTitle}>Schedule</h3>
            <p style={styles.actionDesc}>Plan a meeting for later</p>
            <Link href="/meet/schedule" style={styles.outlineButton}>
              Schedule Meeting
            </Link>
          </div>
        </div>

        {/* Upcoming Meetings */}
        {upcomingMeetings.length > 0 && (
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Upcoming Meetings</h2>
            <div style={styles.meetingsList}>
              {upcomingMeetings.map((meeting) => (
                <div key={meeting._id} style={styles.meetingCard}>
                  <div style={styles.meetingInfo}>
                    <h4 style={styles.meetingTitle}>{meeting.title}</h4>
                    <p style={styles.meetingTime}>
                      {new Date(meeting.scheduledAt).toLocaleString()}
                    </p>
                  </div>
                  <Link href={`/meet/${meeting.roomId}`} style={styles.joinButton}>
                    Join
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Meetings */}
        {recentMeetings.length > 0 && (
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Recent Meetings</h2>
            <div style={styles.meetingsList}>
              {recentMeetings.map((meeting) => (
                <div key={meeting._id} style={styles.meetingCard}>
                  <div style={styles.meetingInfo}>
                    <h4 style={styles.meetingTitle}>{meeting.title}</h4>
                    <p style={styles.meetingTime}>
                      {new Date(meeting.endedAt || meeting.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span style={styles.endedBadge}>Ended</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && meetings.length === 0 && (
          <div style={styles.emptyState}>
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#CBD5E1" strokeWidth="1.5">
              <polygon points="23 7 16 12 23 17 23 7"></polygon>
              <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
            </svg>
            <h3 style={styles.emptyTitle}>No meetings yet</h3>
            <p style={styles.emptyDesc}>Start your first meeting or schedule one for later</p>
          </div>
        )}
      </div>
    </>
  );
}

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '32px 24px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  header: {
    marginBottom: '32px',
  },
  title: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#1E293B',
    margin: '0 0 8px 0',
  },
  subtitle: {
    fontSize: '16px',
    color: '#64748B',
    margin: 0,
  },
  actionsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '24px',
    marginBottom: '48px',
  },
  actionCard: {
    background: '#FFFFFF',
    borderRadius: '16px',
    padding: '28px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.04)',
    border: '1px solid #F1F5F9',
  },
  actionIcon: {
    width: '56px',
    height: '56px',
    borderRadius: '12px',
    background: '#F8FAFC',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '16px',
  },
  actionTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#1E293B',
    margin: '0 0 8px 0',
  },
  actionDesc: {
    fontSize: '14px',
    color: '#64748B',
    margin: '0 0 20px 0',
  },
  primaryButton: {
    width: '100%',
    padding: '12px 20px',
    background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '10px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'transform 0.2s, box-shadow 0.2s',
  },
  secondaryButton: {
    padding: '12px 24px',
    background: '#10B981',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '10px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    flexShrink: 0,
  },
  outlineButton: {
    display: 'block',
    width: '100%',
    padding: '12px 20px',
    background: '#FFFFFF',
    color: '#F59E0B',
    border: '2px solid #F59E0B',
    borderRadius: '10px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    textAlign: 'center',
    textDecoration: 'none',
  },
  joinForm: {
    display: 'flex',
    gap: '12px',
  },
  input: {
    flex: 1,
    padding: '12px 16px',
    border: '2px solid #E2E8F0',
    borderRadius: '10px',
    fontSize: '15px',
    outline: 'none',
    transition: 'border-color 0.2s',
    color: '#1E293B',
  },
  section: {
    marginBottom: '32px',
  },
  sectionTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#1E293B',
    margin: '0 0 16px 0',
  },
  meetingsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  meetingCard: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    background: '#FFFFFF',
    padding: '16px 20px',
    borderRadius: '12px',
    border: '1px solid #E2E8F0',
  },
  meetingInfo: {
    flex: 1,
  },
  meetingTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#1E293B',
    margin: '0 0 4px 0',
  },
  meetingTime: {
    fontSize: '14px',
    color: '#64748B',
    margin: 0,
  },
  joinButton: {
    padding: '8px 20px',
    background: '#8B5CF6',
    color: '#FFFFFF',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    textDecoration: 'none',
  },
  endedBadge: {
    padding: '6px 12px',
    background: '#F1F5F9',
    color: '#64748B',
    borderRadius: '6px',
    fontSize: '13px',
    fontWeight: '500',
  },
  emptyState: {
    textAlign: 'center',
    padding: '64px 24px',
    background: '#F8FAFC',
    borderRadius: '16px',
    border: '2px dashed #E2E8F0',
  },
  emptyTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#475569',
    margin: '16px 0 8px 0',
  },
  emptyDesc: {
    fontSize: '14px',
    color: '#94A3B8',
    margin: 0,
  },
};
