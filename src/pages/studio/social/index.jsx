/**
 * Social Tools - Facebook Automation
 * CYBEV Studio v2.0
 * 
 * Facebook-style clean white design with CYBEV purple accents
 */

import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function SocialTools() {
  const [activeTab, setActiveTab] = useState('scraping');
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [audience, setAudience] = useState([]);
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
  });

  // Message form state
  const [messageForm, setMessageForm] = useState({
    profileUrl: '',
    message: '',
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

      <div style={styles.page}>
        <div style={styles.container}>
          {/* Header */}
          <div style={styles.header}>
            <div style={styles.headerLeft}>
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
              <Link href="/studio/social/accounts" style={styles.manageLink}>
                Manage Accounts
              </Link>
            </div>
          </div>

          {/* Stats Cards */}
          <div style={styles.statsGrid}>
            <div style={styles.statCard}>
              <span style={styles.statIcon}>👥</span>
              <div style={styles.statInfo}>
                <span style={styles.statValue}>{stats.friendsSent || 0}</span>
                <span style={styles.statLabel}>Friend Requests</span>
              </div>
            </div>
            <div style={styles.statCard}>
              <span style={styles.statIcon}>💬</span>
              <div style={styles.statInfo}>
                <span style={styles.statValue}>{stats.messagesSent || 0}</span>
                <span style={styles.statLabel}>Messages Sent</span>
              </div>
            </div>
            <div style={styles.statCard}>
              <span style={styles.statIcon}>❤️</span>
              <div style={styles.statInfo}>
                <span style={styles.statValue}>{stats.postsLiked || 0}</span>
                <span style={styles.statLabel}>Posts Liked</span>
              </div>
            </div>
            <div style={styles.statCard}>
              <span style={styles.statIcon}>📊</span>
              <div style={styles.statInfo}>
                <span style={styles.statValue}>{audience.length}</span>
                <span style={styles.statLabel}>Total Audience</span>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div style={styles.tabsCard}>
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
              <div style={styles.contentCard}>
                <h2 style={styles.cardTitle}>Scrape Data</h2>
                <p style={styles.cardDesc}>Find and collect profiles from Facebook</p>
                
                <form onSubmit={handleScrape} style={styles.form}>
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
            )}

            {/* Auto Engagement Tab */}
            {activeTab === 'engagement' && (
              <div style={styles.contentCard}>
                <h2 style={styles.cardTitle}>Auto Engagement</h2>
                <p style={styles.cardDesc}>Automatically like, comment, and follow</p>
                
                <form onSubmit={handleEngage} style={styles.form}>
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
            )}

            {/* Messaging Tab */}
            {activeTab === 'messaging' && (
              <div style={styles.contentCard}>
                <h2 style={styles.cardTitle}>Send Message</h2>
                <p style={styles.cardDesc}>Send direct messages to profiles</p>
                
                <form onSubmit={handleMessage} style={styles.form}>
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
            )}

            {/* Groups Tab */}
            {activeTab === 'groups' && (
              <div style={styles.contentCard}>
                <h2 style={styles.cardTitle}>Group Actions</h2>
                <p style={styles.cardDesc}>Join groups and post content</p>
                
                <div style={styles.comingSoon}>
                  <span style={styles.comingSoonIcon}>🚧</span>
                  <h3 style={styles.comingSoonTitle}>Coming Soon</h3>
                  <p style={styles.comingSoonDesc}>Group automation features are being developed</p>
                </div>
              </div>
            )}

            {/* Audience Data Tab */}
            {activeTab === 'audience' && (
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
            )}

            {/* Analytics Tab */}
            {activeTab === 'analytics' && (
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
                        backgroundColor: job.status === 'completed' ? '#DCFCE7' : 
                                        job.status === 'failed' ? '#FEE2E2' :
                                        job.status === 'processing' ? '#DBEAFE' : '#F3F4F6',
                        color: job.status === 'completed' ? '#166534' :
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
            )}
          </div>
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
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '24px',
    flexWrap: 'wrap',
    gap: '16px',
  },
  headerLeft: {},
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
  accountSelector: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    flexWrap: 'wrap',
  },
  selectorLabel: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#65676B',
  },
  select: {
    padding: '10px 16px',
    border: '1px solid #CED0D4',
    borderRadius: '6px',
    fontSize: '14px',
    color: '#1C1E21',
    backgroundColor: '#FFFFFF',
    minWidth: '200px',
  },
  manageLink: {
    color: '#8B5CF6',
    fontSize: '14px',
    textDecoration: 'none',
  },
  
  // Stats
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '12px',
    marginBottom: '24px',
  },
  statCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    backgroundColor: '#FFFFFF',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
  },
  statIcon: {
    fontSize: '28px',
    width: '48px',
    height: '48px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F0F2F5',
    borderRadius: '50%',
  },
  statInfo: {
    display: 'flex',
    flexDirection: 'column',
  },
  statValue: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#1C1E21',
  },
  statLabel: {
    fontSize: '13px',
    color: '#65676B',
  },

  // Tabs
  tabsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: '8px 8px 0 0',
    boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
    marginBottom: '-1px',
    overflowX: 'auto',
  },
  tabs: {
    display: 'flex',
    gap: '0',
    padding: '0 8px',
    borderBottom: '1px solid #E4E6EB',
  },
  tab: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '16px 16px',
    background: 'none',
    border: 'none',
    borderBottom: '3px solid transparent',
    fontSize: '14px',
    fontWeight: '500',
    color: '#65676B',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    marginBottom: '-1px',
  },
  activeTab: {
    color: '#8B5CF6',
    borderBottomColor: '#8B5CF6',
  },
  tabIcon: {
    fontSize: '16px',
  },

  // Content
  content: {
    backgroundColor: '#FFFFFF',
    borderRadius: '0 0 8px 8px',
    boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
    minHeight: '400px',
  },
  contentCard: {
    padding: '24px',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '20px',
  },
  cardTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#1C1E21',
    margin: '0 0 8px 0',
  },
  cardDesc: {
    fontSize: '14px',
    color: '#65676B',
    margin: 0,
  },

  // Forms
  form: {
    maxWidth: '500px',
  },
  formGroup: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    fontSize: '14px',
    fontWeight: '600',
    color: '#1C1E21',
    marginBottom: '8px',
  },
  input: {
    width: '100%',
    padding: '12px 16px',
    border: '1px solid #CED0D4',
    borderRadius: '6px',
    fontSize: '15px',
    color: '#1C1E21',
    backgroundColor: '#FFFFFF',
    outline: 'none',
    boxSizing: 'border-box',
  },
  formSelect: {
    width: '100%',
    padding: '12px 16px',
    border: '1px solid #CED0D4',
    borderRadius: '6px',
    fontSize: '15px',
    color: '#1C1E21',
    backgroundColor: '#FFFFFF',
    boxSizing: 'border-box',
  },
  textarea: {
    width: '100%',
    padding: '12px 16px',
    border: '1px solid #CED0D4',
    borderRadius: '6px',
    fontSize: '15px',
    color: '#1C1E21',
    backgroundColor: '#FFFFFF',
    outline: 'none',
    resize: 'vertical',
    fontFamily: 'inherit',
    boxSizing: 'border-box',
  },
  primaryButton: {
    padding: '12px 24px',
    backgroundColor: '#8B5CF6',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '6px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  exportButton: {
    padding: '10px 20px',
    backgroundColor: '#E4E6EB',
    color: '#1C1E21',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
  },

  // Table
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
    color: '#65676B',
    borderBottom: '1px solid #E4E6EB',
    backgroundColor: '#F7F8FA',
  },
  tr: {
    borderBottom: '1px solid #F0F2F5',
  },
  td: {
    padding: '14px 16px',
    fontSize: '14px',
    color: '#1C1E21',
  },
  profileName: {
    fontWeight: '500',
    color: '#1C1E21',
  },
  sourceBadge: {
    display: 'inline-block',
    padding: '4px 10px',
    backgroundColor: '#F0F2F5',
    color: '#65676B',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: '500',
  },
  viewLink: {
    color: '#8B5CF6',
    textDecoration: 'none',
    fontWeight: '500',
  },
  emptyTable: {
    padding: '40px 24px',
    textAlign: 'center',
    color: '#65676B',
  },

  // Coming Soon
  comingSoon: {
    textAlign: 'center',
    padding: '60px 24px',
  },
  comingSoonIcon: {
    fontSize: '48px',
    display: 'block',
    marginBottom: '16px',
  },
  comingSoonTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#1C1E21',
    margin: '0 0 8px 0',
  },
  comingSoonDesc: {
    fontSize: '14px',
    color: '#65676B',
    margin: 0,
  },

  // Analytics
  analyticsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px',
    marginBottom: '32px',
  },
  analyticCard: {
    backgroundColor: '#F7F8FA',
    padding: '24px',
    borderRadius: '8px',
    border: '1px solid #E4E6EB',
  },
  analyticLabel: {
    fontSize: '14px',
    color: '#65676B',
    margin: '0 0 8px 0',
    fontWeight: '500',
  },
  analyticValue: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#1C1E21',
  },
  subTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#1C1E21',
    margin: '0 0 16px 0',
  },
  jobsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  jobItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '14px 16px',
    backgroundColor: '#F7F8FA',
    borderRadius: '8px',
    border: '1px solid #E4E6EB',
  },
  jobInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  jobType: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#1C1E21',
  },
  jobDate: {
    fontSize: '12px',
    color: '#65676B',
  },
  jobStatus: {
    padding: '4px 12px',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  noJobs: {
    textAlign: 'center',
    color: '#65676B',
    padding: '24px',
    margin: 0,
  },
};
