/**
 * Meet Dashboard - Video Conferencing
 * CYBEV Studio v2.0
 * 
 * Facebook-style clean white design
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
        <title>Meet - CYBEV</title>
      </Head>

      <div style={styles.page}>
        <div style={styles.container}>
          {/* Header */}
          <div style={styles.header}>
            <div>
              <Link href="/studio" style={styles.backLink}>← Back to Studio</Link>
              <h1 style={styles.title}>Meet</h1>
              <p style={styles.subtitle}>Start or join video meetings instantly</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div style={styles.actionsGrid}>
            {/* Start Instant Meeting */}
            <div style={styles.actionCard}>
              <div style={styles.actionIcon}>📹</div>
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
              <div style={styles.actionIcon}>🚪</div>
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
                <button type="submit" style={styles.joinButton}>
                  Join
                </button>
              </form>
            </div>

            {/* Schedule Meeting */}
            <div style={styles.actionCard}>
              <div style={styles.actionIcon}>📅</div>
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
                    <Link href={`/meet/${meeting.roomId}`} style={styles.meetingJoinButton}>
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
              <span style={styles.emptyIcon}>📹</span>
              <h3 style={styles.emptyTitle}>No meetings yet</h3>
              <p style={styles.emptyDesc}>Start your first meeting or schedule one for later</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// Facebook-style clean white design
const styles = {
  page: {
    minHeight: '100vh',
    backgroundColor: '#F0F2F5',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '24px 16px',
  },
  header: {
    marginBottom: '24px',
  },
  backLink: {
    display: 'inline-block',
    color: '#8B5CF6',
    textDecoration: 'none',
    fontSize: '14px',
    marginBottom: '8px',
  },
  title: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#1C1E21',
    margin: '0 0 8px 0',
  },
  subtitle: {
    fontSize: '15px',
    color: '#65676B',
    margin: 0,
  },
  
  // Actions
  actionsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '16px',
    marginBottom: '32px',
  },
  actionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: '8px',
    padding: '24px',
    boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
  },
  actionIcon: {
    fontSize: '32px',
    marginBottom: '16px',
  },
  actionTitle: {
    fontSize: '17px',
    fontWeight: '600',
    color: '#1C1E21',
    margin: '0 0 8px 0',
  },
  actionDesc: {
    fontSize: '14px',
    color: '#65676B',
    margin: '0 0 16px 0',
  },
  primaryButton: {
    width: '100%',
    padding: '12px 20px',
    backgroundColor: '#8B5CF6',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '6px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  joinForm: {
    display: 'flex',
    gap: '8px',
  },
  input: {
    flex: 1,
    padding: '12px 16px',
    border: '1px solid #CED0D4',
    borderRadius: '6px',
    fontSize: '14px',
    color: '#1C1E21',
    backgroundColor: '#FFFFFF',
  },
  joinButton: {
    padding: '12px 20px',
    backgroundColor: '#E4E6EB',
    color: '#1C1E21',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  outlineButton: {
    display: 'block',
    width: '100%',
    padding: '12px 20px',
    backgroundColor: '#FFFFFF',
    color: '#8B5CF6',
    border: '2px solid #8B5CF6',
    borderRadius: '6px',
    fontSize: '15px',
    fontWeight: '600',
    textAlign: 'center',
    textDecoration: 'none',
    boxSizing: 'border-box',
  },

  // Sections
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: '8px',
    padding: '20px',
    marginBottom: '16px',
    boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
  },
  sectionTitle: {
    fontSize: '17px',
    fontWeight: '600',
    color: '#1C1E21',
    margin: '0 0 16px 0',
  },
  meetingsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  meetingCard: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px',
    backgroundColor: '#F7F8FA',
    borderRadius: '8px',
    border: '1px solid #E4E6EB',
  },
  meetingInfo: {
    flex: 1,
  },
  meetingTitle: {
    fontSize: '15px',
    fontWeight: '600',
    color: '#1C1E21',
    margin: '0 0 4px 0',
  },
  meetingTime: {
    fontSize: '13px',
    color: '#65676B',
    margin: 0,
  },
  meetingJoinButton: {
    padding: '8px 20px',
    backgroundColor: '#8B5CF6',
    color: '#FFFFFF',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '600',
    textDecoration: 'none',
  },
  endedBadge: {
    padding: '6px 12px',
    backgroundColor: '#E4E6EB',
    color: '#65676B',
    borderRadius: '4px',
    fontSize: '13px',
    fontWeight: '500',
  },

  // Empty State
  emptyState: {
    textAlign: 'center',
    padding: '60px 24px',
    backgroundColor: '#FFFFFF',
    borderRadius: '8px',
    boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
  },
  emptyIcon: {
    fontSize: '48px',
    display: 'block',
    marginBottom: '16px',
    opacity: 0.5,
  },
  emptyTitle: {
    fontSize: '17px',
    fontWeight: '600',
    color: '#1C1E21',
    margin: '0 0 8px 0',
  },
  emptyDesc: {
    fontSize: '14px',
    color: '#65676B',
    margin: 0,
  },
};
