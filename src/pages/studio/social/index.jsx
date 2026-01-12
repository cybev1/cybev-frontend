/**
 * Social Tools - Facebook Engagement Studio
 * CYBEV Studio v2.0
 * GitHub: https://github.com/cybev1/cybev-frontend/pages/studio/social/index.jsx
 * 
 * Features:
 * - Data Scraping (search, followers, friends, group members)
 * - Auto Engagement (like, comment, follow, friend request)
 * - Messaging (individual and bulk)
 * - Groups (join, post)
 * - Audience Data (view, filter, export)
 * - Analytics
 */

import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function SocialTools() {
  const [activeTab, setActiveTab] = useState('scraping');
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [audience, setAudience] = useState([]);
  const [automations, setAutomations] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [stats, setStats] = useState({ friendsSent: 0, messagesSent: 0, postsLiked: 0, totalAudience: 0 });
  const [loading, setLoading] = useState(false);

  // Scraping form state
  const [scrapeForm, setScrapeForm] = useState({
    type: 'search',
    query: '',
    profileUrl: '',
    maxResults: 50,
  });

  // Engagement form state
  const [engageForm, setEngageForm] = useState({
    type: 'auto_like',
    targetUrl: '',
    comment: '',
    message: '',
  });

  // Message form state
  const [messageForm, setMessageForm] = useState({
    profileUrl: '',
    message: '',
    selectedAudience: [],
  });

  useEffect(() => {
    fetchAccounts();
    fetchStats();
  }, []);

  useEffect(() => {
    if (selectedAccount) {
      fetchAudience();
      fetchJobs();
    }
  }, [selectedAccount]);

  const fetchAccounts = async () => {
    try {
      const res = await fetch('/api/social-tools/accounts');
      const data = await res.json();
      setAccounts(data.accounts || []);
      if (data.accounts?.length > 0) {
        setSelectedAccount(data.accounts[0]._id);
      }
    } catch (error) {
      console.error('Failed to fetch accounts:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/social-tools/analytics');
      const data = await res.json();
      setStats(data.stats || {});
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const fetchAudience = async () => {
    try {
      const res = await fetch(`/api/social-tools/audience?limit=100`);
      const data = await res.json();
      setAudience(data.audience || []);
    } catch (error) {
      console.error('Failed to fetch audience:', error);
    }
  };

  const fetchJobs = async () => {
    try {
      const res = await fetch(`/api/social-tools/jobs?limit=20`);
      const data = await res.json();
      setJobs(data.jobs || []);
    } catch (error) {
      console.error('Failed to fetch jobs:', error);
    }
  };

  const handleScrape = async (e) => {
    e.preventDefault();
    if (!selectedAccount) return alert('Please select an account first');
    
    setLoading(true);
    try {
      const endpoint = scrapeForm.type === 'search' 
        ? '/api/social-tools/scrape/search'
        : `/api/social-tools/scrape/${scrapeForm.type}`;
      
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accountId: selectedAccount,
          query: scrapeForm.query,
          profileUrl: scrapeForm.profileUrl,
          maxResults: scrapeForm.maxResults,
        })
      });
      
      const data = await res.json();
      alert(`Job created! ID: ${data.jobId}`);
      fetchJobs();
    } catch (error) {
      alert('Failed to create scrape job');
    } finally {
      setLoading(false);
    }
  };

  const handleEngage = async (e) => {
    e.preventDefault();
    if (!selectedAccount) return alert('Please select an account first');
    
    setLoading(true);
    try {
      const endpoints = {
        auto_like: '/api/social-tools/engage/like',
        auto_comment: '/api/social-tools/engage/comment',
        auto_follow: '/api/social-tools/engage/follow',
        friend_request: '/api/social-tools/engage/friend-request',
      };
      
      const res = await fetch(endpoints[engageForm.type], {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accountId: selectedAccount,
          postUrl: engageForm.targetUrl,
          profileUrl: engageForm.targetUrl,
          comment: engageForm.comment,
        })
      });
      
      const data = await res.json();
      alert(`Job created! ID: ${data.jobId}`);
      fetchJobs();
    } catch (error) {
      alert('Failed to create engagement job');
    } finally {
      setLoading(false);
    }
  };

  const handleMessage = async (e) => {
    e.preventDefault();
    if (!selectedAccount) return alert('Please select an account first');
    
    setLoading(true);
    try {
      const res = await fetch('/api/social-tools/message/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accountId: selectedAccount,
          profileUrl: messageForm.profileUrl,
          message: messageForm.message,
        })
      });
      
      const data = await res.json();
      alert(`Message job created! ID: ${data.jobId}`);
      fetchJobs();
    } catch (error) {
      alert('Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  const exportAudienceCSV = async () => {
    try {
      const res = await fetch('/api/social-tools/audience/export');
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'audience.csv';
      a.click();
    } catch (error) {
      alert('Failed to export');
    }
  };

  const tabs = [
    { id: 'scraping', label: 'Data Scraping', icon: '🔍' },
    { id: 'engagement', label: 'Auto Engagement', icon: '❤️' },
    { id: 'messaging', label: 'Messaging', icon: '💬' },
    { id: 'groups', label: 'Groups', icon: '👥' },
    { id: 'audience', label: 'Audience Data', icon: '📊' },
    { id: 'analytics', label: 'Analytics', icon: '📈' },
  ];

  return (
    <>
      <Head>
        <title>Social Tools - CYBEV Studio</title>
      </Head>

      <div style={styles.container}>
        {/* Header */}
        <div style={styles.header}>
          <div>
            <Link href="/studio" style={styles.backLink}>← Back to Studio</Link>
            <h1 style={styles.title}>Social Tools</h1>
            <p style={styles.subtitle}>Automate your Facebook engagement</p>
          </div>
          
          {/* Account Selector */}
          <div style={styles.accountSelector}>
            <label style={styles.selectorLabel}>Active Account:</label>
            <select
              value={selectedAccount || ''}
              onChange={(e) => setSelectedAccount(e.target.value)}
              style={styles.select}
            >
              <option value="">Select account...</option>
              {accounts.map(acc => (
                <option key={acc._id} value={acc._id}>{acc.email}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Stats Cards */}
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <span style={styles.statValue}>{stats.friendsSent || 0}</span>
            <span style={styles.statLabel}>Friend Requests</span>
          </div>
          <div style={styles.statCard}>
            <span style={styles.statValue}>{stats.messagesSent || 0}</span>
            <span style={styles.statLabel}>Messages Sent</span>
          </div>
          <div style={styles.statCard}>
            <span style={styles.statValue}>{stats.postsLiked || 0}</span>
            <span style={styles.statLabel}>Posts Liked</span>
          </div>
          <div style={styles.statCard}>
            <span style={styles.statValue}>{audience.length}</span>
            <span style={styles.statLabel}>Total Audience</span>
          </div>
        </div>

        {/* Tabs */}
        <div style={styles.tabsContainer}>
          <div style={styles.tabs}>
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  ...styles.tab,
                  ...(activeTab === tab.id ? styles.activeTab : {})
                }}
              >
                <span style={styles.tabIcon}>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div style={styles.content}>
          {/* Data Scraping Tab */}
          {activeTab === 'scraping' && (
            <div style={styles.tabContent}>
              <div style={styles.contentCard}>
                <h2 style={styles.cardTitle}>Scrape Data</h2>
                <p style={styles.cardDesc}>Find and collect profiles from Facebook</p>
                
                <form onSubmit={handleScrape}>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Scrape Type</label>
                    <select
                      value={scrapeForm.type}
                      onChange={(e) => setScrapeForm({...scrapeForm, type: e.target.value})}
                      style={styles.formSelect}
                    >
                      <option value="search">Search People</option>
                      <option value="followers">Scrape Followers</option>
                      <option value="friends">Scrape Friends</option>
                      <option value="suggestions">Friend Suggestions</option>
                      <option value="group_members">Group Members</option>
                    </select>
                  </div>

                  {scrapeForm.type === 'search' && (
                    <div style={styles.formGroup}>
                      <label style={styles.label}>Search Query</label>
                      <input
                        type="text"
                        value={scrapeForm.query}
                        onChange={(e) => setScrapeForm({...scrapeForm, query: e.target.value})}
                        placeholder="e.g., Photographers in New York"
                        style={styles.input}
                      />
                    </div>
                  )}

                  {['followers', 'friends', 'group_members'].includes(scrapeForm.type) && (
                    <div style={styles.formGroup}>
                      <label style={styles.label}>Profile/Group URL</label>
                      <input
                        type="url"
                        value={scrapeForm.profileUrl}
                        onChange={(e) => setScrapeForm({...scrapeForm, profileUrl: e.target.value})}
                        placeholder="https://facebook.com/..."
                        style={styles.input}
                      />
                    </div>
                  )}

                  <div style={styles.formGroup}>
                    <label style={styles.label}>Max Results</label>
                    <input
                      type="number"
                      value={scrapeForm.maxResults}
                      onChange={(e) => setScrapeForm({...scrapeForm, maxResults: parseInt(e.target.value)})}
                      min="10"
                      max="500"
                      style={styles.input}
                    />
                  </div>

                  <button type="submit" disabled={loading} style={styles.primaryButton}>
                    {loading ? 'Starting...' : 'Start Scraping'}
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* Auto Engagement Tab */}
          {activeTab === 'engagement' && (
            <div style={styles.tabContent}>
              <div style={styles.contentCard}>
                <h2 style={styles.cardTitle}>Auto Engagement</h2>
                <p style={styles.cardDesc}>Automatically like, comment, and follow</p>
                
                <form onSubmit={handleEngage}>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Action Type</label>
                    <select
                      value={engageForm.type}
                      onChange={(e) => setEngageForm({...engageForm, type: e.target.value})}
                      style={styles.formSelect}
                    >
                      <option value="auto_like">Like Post</option>
                      <option value="auto_comment">Comment on Post</option>
                      <option value="auto_follow">Follow Profile</option>
                      <option value="friend_request">Send Friend Request</option>
                    </select>
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.label}>
                      {engageForm.type === 'auto_like' || engageForm.type === 'auto_comment' 
                        ? 'Post URL' : 'Profile URL'}
                    </label>
                    <input
                      type="url"
                      value={engageForm.targetUrl}
                      onChange={(e) => setEngageForm({...engageForm, targetUrl: e.target.value})}
                      placeholder="https://facebook.com/..."
                      style={styles.input}
                    />
                  </div>

                  {engageForm.type === 'auto_comment' && (
                    <div style={styles.formGroup}>
                      <label style={styles.label}>Comment</label>
                      <textarea
                        value={engageForm.comment}
                        onChange={(e) => setEngageForm({...engageForm, comment: e.target.value})}
                        placeholder="Great post! 🙌"
                        style={styles.textarea}
                        rows={3}
                      />
                    </div>
                  )}

                  <button type="submit" disabled={loading} style={styles.primaryButton}>
                    {loading ? 'Processing...' : 'Execute Action'}
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* Messaging Tab */}
          {activeTab === 'messaging' && (
            <div style={styles.tabContent}>
              <div style={styles.contentCard}>
                <h2 style={styles.cardTitle}>Send Message</h2>
                <p style={styles.cardDesc}>Send direct messages to profiles</p>
                
                <form onSubmit={handleMessage}>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Profile URL</label>
                    <input
                      type="url"
                      value={messageForm.profileUrl}
                      onChange={(e) => setMessageForm({...messageForm, profileUrl: e.target.value})}
                      placeholder="https://facebook.com/username"
                      style={styles.input}
                    />
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.label}>Message</label>
                    <textarea
                      value={messageForm.message}
                      onChange={(e) => setMessageForm({...messageForm, message: e.target.value})}
                      placeholder="Hi! I'd love to connect..."
                      style={styles.textarea}
                      rows={4}
                    />
                  </div>

                  <button type="submit" disabled={loading} style={styles.primaryButton}>
                    {loading ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* Groups Tab */}
          {activeTab === 'groups' && (
            <div style={styles.tabContent}>
              <div style={styles.contentCard}>
                <h2 style={styles.cardTitle}>Group Actions</h2>
                <p style={styles.cardDesc}>Join groups and post content</p>
                
                <div style={styles.comingSoon}>
                  <span style={styles.comingSoonIcon}>🚧</span>
                  <h3 style={styles.comingSoonTitle}>Coming Soon</h3>
                  <p style={styles.comingSoonDesc}>
                    Group automation features are being developed
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Audience Data Tab */}
          {activeTab === 'audience' && (
            <div style={styles.tabContent}>
              <div style={styles.contentCard}>
                <div style={styles.cardHeader}>
                  <div>
                    <h2 style={styles.cardTitle}>Audience Data</h2>
                    <p style={styles.cardDesc}>{audience.length} profiles collected</p>
                  </div>
                  <button onClick={exportAudienceCSV} style={styles.exportButton}>
                    Export CSV
                  </button>
                </div>
                
                <div style={styles.tableContainer}>
                  <table style={styles.table}>
                    <thead>
                      <tr>
                        <th style={styles.th}>Name</th>
                        <th style={styles.th}>Location</th>
                        <th style={styles.th}>Source</th>
                        <th style={styles.th}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {audience.slice(0, 20).map((person, i) => (
                        <tr key={i} style={styles.tr}>
                          <td style={styles.td}>
                            <span style={styles.profileName}>{person.name || 'Unknown'}</span>
                          </td>
                          <td style={styles.td}>{person.location || '-'}</td>
                          <td style={styles.td}>
                            <span style={styles.sourceBadge}>{person.source || 'manual'}</span>
                          </td>
                          <td style={styles.td}>
                            <a href={person.profileUrl} target="_blank" rel="noopener noreferrer" style={styles.viewLink}>
                              View
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {audience.length === 0 && (
                    <div style={styles.emptyTable}>
                      No audience data yet. Start scraping to collect profiles.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <div style={styles.tabContent}>
              <div style={styles.contentCard}>
                <h2 style={styles.cardTitle}>Analytics</h2>
                <p style={styles.cardDesc}>Track your engagement performance</p>
                
                <div style={styles.analyticsGrid}>
                  <div style={styles.analyticCard}>
                    <h4 style={styles.analyticLabel}>Total Actions</h4>
                    <span style={styles.analyticValue}>
                      {(stats.postsLiked || 0) + (stats.commentsPosted || 0) + (stats.friendsSent || 0)}
                    </span>
                  </div>
                  <div style={styles.analyticCard}>
                    <h4 style={styles.analyticLabel}>Profiles Scraped</h4>
                    <span style={styles.analyticValue}>{stats.profilesScraped || 0}</span>
                  </div>
                </div>

                <h3 style={styles.subTitle}>Recent Jobs</h3>
                <div style={styles.jobsList}>
                  {jobs.slice(0, 10).map((job, i) => (
                    <div key={i} style={styles.jobItem}>
                      <div style={styles.jobInfo}>
                        <span style={styles.jobType}>{job.type}</span>
                        <span style={styles.jobDate}>
                          {new Date(job.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <span style={{
                        ...styles.jobStatus,
                        background: job.status === 'completed' ? '#D1FAE5' : 
                                   job.status === 'failed' ? '#FEE2E2' :
                                   job.status === 'processing' ? '#DBEAFE' : '#F3F4F6',
                        color: job.status === 'completed' ? '#065F46' :
                               job.status === 'failed' ? '#991B1B' :
                               job.status === 'processing' ? '#1E40AF' : '#374151',
                      }}>
                        {job.status}
                      </span>
                    </div>
                  ))}
                  {jobs.length === 0 && (
                    <p style={styles.noJobs}>No jobs yet</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
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
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '32px',
    flexWrap: 'wrap',
    gap: '20px',
  },
  backLink: {
    display: 'inline-block',
    color: '#64748B',
    textDecoration: 'none',
    fontSize: '14px',
    marginBottom: '8px',
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
  accountSelector: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  selectorLabel: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#64748B',
  },
  select: {
    padding: '10px 16px',
    border: '2px solid #E2E8F0',
    borderRadius: '10px',
    fontSize: '14px',
    color: '#1E293B',
    background: '#FFFFFF',
    minWidth: '200px',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px',
    marginBottom: '32px',
  },
  statCard: {
    background: '#FFFFFF',
    padding: '24px',
    borderRadius: '16px',
    border: '1px solid #E2E8F0',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  statValue: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#8B5CF6',
  },
  statLabel: {
    fontSize: '14px',
    color: '#64748B',
  },
  tabsContainer: {
    marginBottom: '24px',
    overflowX: 'auto',
  },
  tabs: {
    display: 'flex',
    gap: '8px',
    background: '#F1F5F9',
    padding: '6px',
    borderRadius: '14px',
    minWidth: 'fit-content',
  },
  tab: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 20px',
    background: 'transparent',
    border: 'none',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: '500',
    color: '#64748B',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    transition: 'all 0.2s',
  },
  activeTab: {
    background: '#FFFFFF',
    color: '#1E293B',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
  },
  tabIcon: {
    fontSize: '16px',
  },
  content: {
    minHeight: '400px',
  },
  tabContent: {},
  contentCard: {
    background: '#FFFFFF',
    borderRadius: '20px',
    padding: '32px',
    border: '1px solid #E2E8F0',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '24px',
  },
  cardTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#1E293B',
    margin: '0 0 8px 0',
  },
  cardDesc: {
    fontSize: '14px',
    color: '#64748B',
    margin: 0,
  },
  formGroup: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    fontSize: '14px',
    fontWeight: '600',
    color: '#374151',
    marginBottom: '8px',
  },
  input: {
    width: '100%',
    padding: '14px 16px',
    border: '2px solid #E2E8F0',
    borderRadius: '12px',
    fontSize: '15px',
    color: '#1E293B',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s',
  },
  formSelect: {
    width: '100%',
    padding: '14px 16px',
    border: '2px solid #E2E8F0',
    borderRadius: '12px',
    fontSize: '15px',
    color: '#1E293B',
    outline: 'none',
    background: '#FFFFFF',
    boxSizing: 'border-box',
  },
  textarea: {
    width: '100%',
    padding: '14px 16px',
    border: '2px solid #E2E8F0',
    borderRadius: '12px',
    fontSize: '15px',
    color: '#1E293B',
    outline: 'none',
    resize: 'vertical',
    fontFamily: 'inherit',
    boxSizing: 'border-box',
  },
  primaryButton: {
    padding: '14px 32px',
    background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '12px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  exportButton: {
    padding: '10px 20px',
    background: '#10B981',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  tableContainer: {
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    textAlign: 'left',
    padding: '12px 16px',
    fontSize: '13px',
    fontWeight: '600',
    color: '#64748B',
    borderBottom: '2px solid #E2E8F0',
    background: '#F8FAFC',
  },
  tr: {
    borderBottom: '1px solid #F1F5F9',
  },
  td: {
    padding: '14px 16px',
    fontSize: '14px',
    color: '#374151',
  },
  profileName: {
    fontWeight: '500',
    color: '#1E293B',
  },
  sourceBadge: {
    display: 'inline-block',
    padding: '4px 10px',
    background: '#F1F5F9',
    color: '#64748B',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: '500',
  },
  viewLink: {
    color: '#8B5CF6',
    textDecoration: 'none',
    fontWeight: '500',
  },
  emptyTable: {
    padding: '48px 24px',
    textAlign: 'center',
    color: '#94A3B8',
  },
  comingSoon: {
    textAlign: 'center',
    padding: '48px 24px',
  },
  comingSoonIcon: {
    fontSize: '48px',
    display: 'block',
    marginBottom: '16px',
  },
  comingSoonTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#1E293B',
    margin: '0 0 8px 0',
  },
  comingSoonDesc: {
    fontSize: '14px',
    color: '#64748B',
    margin: 0,
  },
  analyticsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px',
    marginBottom: '32px',
  },
  analyticCard: {
    background: '#F8FAFC',
    padding: '24px',
    borderRadius: '12px',
  },
  analyticLabel: {
    fontSize: '14px',
    color: '#64748B',
    margin: '0 0 8px 0',
    fontWeight: '500',
  },
  analyticValue: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#1E293B',
  },
  subTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#1E293B',
    margin: '0 0 16px 0',
  },
  jobsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  jobItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '14px 16px',
    background: '#F8FAFC',
    borderRadius: '10px',
  },
  jobInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  jobType: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#1E293B',
  },
  jobDate: {
    fontSize: '12px',
    color: '#94A3B8',
  },
  jobStatus: {
    padding: '4px 12px',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  noJobs: {
    textAlign: 'center',
    color: '#94A3B8',
    padding: '24px',
    margin: 0,
  },
};
