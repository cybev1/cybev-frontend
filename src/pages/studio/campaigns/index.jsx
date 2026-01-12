/**
 * Campaigns - Email/SMS/WhatsApp Marketing
 * CYBEV Studio v2.0
 * GitHub: https://github.com/cybev1/cybev-frontend/pages/studio/campaigns/index.jsx
 */

import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function Campaigns() {
  const [campaigns, setCampaigns] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [createStep, setCreateStep] = useState(1);
  const [creating, setCreating] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    type: 'email',
    subject: '',
    content: '',
    audienceType: 'all',
  });

  useEffect(() => {
    fetchCampaigns();
    fetchStats();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const res = await fetch('/api/campaigns');
      const data = await res.json();
      setCampaigns(data.campaigns || []);
    } catch (error) {
      console.error('Failed to fetch campaigns:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/campaigns/stats');
      const data = await res.json();
      setStats(data.summary || {});
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const createCampaign = async () => {
    setCreating(true);
    try {
      const res = await fetch('/api/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      setCampaigns([data.campaign, ...campaigns]);
      setShowCreate(false);
      setCreateStep(1);
      setFormData({ name: '', type: 'email', subject: '', content: '', audienceType: 'all' });
    } catch (error) {
      alert('Failed to create campaign');
    } finally {
      setCreating(false);
    }
  };

  const deleteCampaign = async (id) => {
    if (!confirm('Delete this campaign?')) return;
    try {
      await fetch(`/api/campaigns/${id}`, { method: 'DELETE' });
      setCampaigns(campaigns.filter(c => c._id !== id));
    } catch (error) {
      alert('Failed to delete');
    }
  };

  const campaignTypes = [
    { id: 'email', label: 'Email', icon: '📧', color: '#8B5CF6' },
    { id: 'sms', label: 'SMS', icon: '💬', color: '#10B981' },
    { id: 'whatsapp', label: 'WhatsApp', icon: '📱', color: '#25D366' },
    { id: 'push', label: 'Push', icon: '🔔', color: '#F59E0B' },
  ];

  const getStatusStyle = (status) => {
    const styles = {
      draft: { bg: '#F1F5F9', color: '#64748B' },
      scheduled: { bg: '#DBEAFE', color: '#1E40AF' },
      sending: { bg: '#FEF3C7', color: '#92400E' },
      sent: { bg: '#D1FAE5', color: '#065F46' },
      paused: { bg: '#FEE2E2', color: '#991B1B' },
    };
    return styles[status] || styles.draft;
  };

  return (
    <>
      <Head>
        <title>Campaigns - CYBEV Studio</title>
      </Head>

      <div style={styles.container}>
        {/* Header */}
        <div style={styles.header}>
          <div>
            <Link href="/studio" style={styles.backLink}>← Back to Studio</Link>
            <h1 style={styles.title}>Campaigns</h1>
            <p style={styles.subtitle}>Create and manage marketing campaigns</p>
          </div>
          <button onClick={() => setShowCreate(true)} style={styles.createButton}>
            + New Campaign
          </button>
        </div>

        {/* Stats */}
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <div style={styles.statIcon}>📊</div>
            <div>
              <span style={styles.statValue}>{stats.totalCampaigns || 0}</span>
              <span style={styles.statLabel}>Total Campaigns</span>
            </div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statIcon}>📤</div>
            <div>
              <span style={styles.statValue}>{stats.totalSent || 0}</span>
              <span style={styles.statLabel}>Messages Sent</span>
            </div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statIcon}>👁️</div>
            <div>
              <span style={styles.statValue}>{stats.totalOpened || 0}</span>
              <span style={styles.statLabel}>Opens</span>
            </div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statIcon}>🖱️</div>
            <div>
              <span style={styles.statValue}>{stats.totalClicked || 0}</span>
              <span style={styles.statLabel}>Clicks</span>
            </div>
          </div>
        </div>

        {/* Campaigns List */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Your Campaigns</h2>
          
          {loading ? (
            <div style={styles.loading}>Loading campaigns...</div>
          ) : campaigns.length === 0 ? (
            <div style={styles.emptyState}>
              <span style={styles.emptyIcon}>📨</span>
              <h3 style={styles.emptyTitle}>No campaigns yet</h3>
              <p style={styles.emptyDesc}>Create your first campaign to start reaching your audience</p>
              <button onClick={() => setShowCreate(true)} style={styles.emptyButton}>
                Create Campaign
              </button>
            </div>
          ) : (
            <div style={styles.campaignsList}>
              {campaigns.map(campaign => {
                const statusStyle = getStatusStyle(campaign.status);
                const typeInfo = campaignTypes.find(t => t.id === campaign.type) || campaignTypes[0];
                
                return (
                  <div key={campaign._id} style={styles.campaignCard}>
                    <div style={styles.campaignHeader}>
                      <div style={{...styles.typeIcon, background: `${typeInfo.color}15`}}>
                        <span>{typeInfo.icon}</span>
                      </div>
                      <div style={styles.campaignInfo}>
                        <h3 style={styles.campaignName}>{campaign.name}</h3>
                        <p style={styles.campaignMeta}>
                          {typeInfo.label} • Created {new Date(campaign.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <span style={{
                        ...styles.statusBadge,
                        background: statusStyle.bg,
                        color: statusStyle.color,
                      }}>
                        {campaign.status}
                      </span>
                    </div>
                    
                    {campaign.subject && (
                      <p style={styles.campaignSubject}>Subject: {campaign.subject}</p>
                    )}
                    
                    <div style={styles.campaignStats}>
                      <span style={styles.campaignStat}>
                        <strong>{campaign.stats?.sent || 0}</strong> sent
                      </span>
                      <span style={styles.campaignStat}>
                        <strong>{campaign.stats?.opened || 0}</strong> opened
                      </span>
                      <span style={styles.campaignStat}>
                        <strong>{campaign.stats?.clicked || 0}</strong> clicked
                      </span>
                    </div>
                    
                    <div style={styles.campaignActions}>
                      <button style={styles.actionButton}>Edit</button>
                      <button style={styles.actionButton}>Duplicate</button>
                      {campaign.status === 'draft' && (
                        <button style={styles.sendButton}>Send</button>
                      )}
                      <button 
                        onClick={() => deleteCampaign(campaign._id)} 
                        style={styles.deleteButton}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Create Campaign Modal */}
        {showCreate && (
          <div style={styles.modalOverlay} onClick={() => setShowCreate(false)}>
            <div style={styles.modal} onClick={e => e.stopPropagation()}>
              <div style={styles.modalHeader}>
                <h2 style={styles.modalTitle}>Create Campaign</h2>
                <button onClick={() => setShowCreate(false)} style={styles.closeButton}>×</button>
              </div>

              {/* Step 1: Type */}
              {createStep === 1 && (
                <div style={styles.modalContent}>
                  <p style={styles.stepLabel}>Step 1 of 3: Choose campaign type</p>
                  <div style={styles.typeGrid}>
                    {campaignTypes.map(type => (
                      <button
                        key={type.id}
                        onClick={() => setFormData({...formData, type: type.id})}
                        style={{
                          ...styles.typeCard,
                          borderColor: formData.type === type.id ? type.color : '#E2E8F0',
                          background: formData.type === type.id ? `${type.color}08` : '#FFFFFF',
                        }}
                      >
                        <span style={styles.typeCardIcon}>{type.icon}</span>
                        <span style={styles.typeCardLabel}>{type.label}</span>
                      </button>
                    ))}
                  </div>
                  <div style={styles.modalActions}>
                    <button onClick={() => setShowCreate(false)} style={styles.cancelButton}>
                      Cancel
                    </button>
                    <button onClick={() => setCreateStep(2)} style={styles.nextButton}>
                      Continue
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Details */}
              {createStep === 2 && (
                <div style={styles.modalContent}>
                  <p style={styles.stepLabel}>Step 2 of 3: Campaign details</p>
                  
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Campaign Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g., Summer Sale Announcement"
                      style={styles.input}
                    />
                  </div>

                  {formData.type === 'email' && (
                    <div style={styles.formGroup}>
                      <label style={styles.label}>Subject Line</label>
                      <input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        placeholder="e.g., Don't miss our summer deals!"
                        style={styles.input}
                      />
                    </div>
                  )}

                  <div style={styles.formGroup}>
                    <label style={styles.label}>Message Content</label>
                    <textarea
                      name="content"
                      value={formData.content}
                      onChange={handleChange}
                      placeholder="Write your message here..."
                      style={styles.textarea}
                      rows={5}
                    />
                  </div>

                  <div style={styles.modalActions}>
                    <button onClick={() => setCreateStep(1)} style={styles.cancelButton}>
                      Back
                    </button>
                    <button 
                      onClick={() => setCreateStep(3)} 
                      disabled={!formData.name || !formData.content}
                      style={{
                        ...styles.nextButton,
                        opacity: formData.name && formData.content ? 1 : 0.5
                      }}
                    >
                      Continue
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Audience */}
              {createStep === 3 && (
                <div style={styles.modalContent}>
                  <p style={styles.stepLabel}>Step 3 of 3: Select audience</p>
                  
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Send to</label>
                    <select
                      name="audienceType"
                      value={formData.audienceType}
                      onChange={handleChange}
                      style={styles.select}
                    >
                      <option value="all">All Contacts</option>
                      <option value="list">Specific List</option>
                      <option value="segment">Custom Segment</option>
                    </select>
                  </div>

                  <div style={styles.summaryBox}>
                    <h4 style={styles.summaryTitle}>Campaign Summary</h4>
                    <div style={styles.summaryRow}>
                      <span style={styles.summaryLabel}>Type:</span>
                      <span style={styles.summaryValue}>
                        {campaignTypes.find(t => t.id === formData.type)?.label}
                      </span>
                    </div>
                    <div style={styles.summaryRow}>
                      <span style={styles.summaryLabel}>Name:</span>
                      <span style={styles.summaryValue}>{formData.name}</span>
                    </div>
                    <div style={styles.summaryRow}>
                      <span style={styles.summaryLabel}>Audience:</span>
                      <span style={styles.summaryValue}>{formData.audienceType}</span>
                    </div>
                  </div>

                  <div style={styles.modalActions}>
                    <button onClick={() => setCreateStep(2)} style={styles.cancelButton}>
                      Back
                    </button>
                    <button 
                      onClick={createCampaign} 
                      disabled={creating}
                      style={styles.createCampaignButton}
                    >
                      {creating ? 'Creating...' : 'Create Campaign'}
                    </button>
                  </div>
                </div>
              )}
            </div>
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
  createButton: {
    padding: '14px 28px',
    background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '12px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '16px',
    marginBottom: '40px',
  },
  statCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    background: '#FFFFFF',
    padding: '24px',
    borderRadius: '16px',
    border: '1px solid #E2E8F0',
  },
  statIcon: {
    fontSize: '28px',
    width: '56px',
    height: '56px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#F8FAFC',
    borderRadius: '12px',
  },
  statValue: {
    display: 'block',
    fontSize: '28px',
    fontWeight: '700',
    color: '#1E293B',
  },
  statLabel: {
    display: 'block',
    fontSize: '14px',
    color: '#64748B',
    marginTop: '2px',
  },
  section: {},
  sectionTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#1E293B',
    margin: '0 0 20px 0',
  },
  loading: {
    padding: '48px',
    textAlign: 'center',
    color: '#64748B',
  },
  emptyState: {
    textAlign: 'center',
    padding: '64px 24px',
    background: '#F8FAFC',
    borderRadius: '20px',
    border: '2px dashed #E2E8F0',
  },
  emptyIcon: {
    fontSize: '48px',
    display: 'block',
    marginBottom: '16px',
  },
  emptyTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#1E293B',
    margin: '0 0 8px 0',
  },
  emptyDesc: {
    fontSize: '14px',
    color: '#64748B',
    margin: '0 0 24px 0',
  },
  emptyButton: {
    padding: '12px 24px',
    background: '#8B5CF6',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '10px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  campaignsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  campaignCard: {
    background: '#FFFFFF',
    borderRadius: '16px',
    padding: '24px',
    border: '1px solid #E2E8F0',
  },
  campaignHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    marginBottom: '16px',
  },
  typeIcon: {
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '24px',
  },
  campaignInfo: {
    flex: 1,
  },
  campaignName: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#1E293B',
    margin: '0 0 4px 0',
  },
  campaignMeta: {
    fontSize: '14px',
    color: '#64748B',
    margin: 0,
  },
  statusBadge: {
    padding: '6px 14px',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  campaignSubject: {
    fontSize: '14px',
    color: '#475569',
    margin: '0 0 16px 0',
    paddingLeft: '64px',
  },
  campaignStats: {
    display: 'flex',
    gap: '24px',
    paddingLeft: '64px',
    marginBottom: '16px',
  },
  campaignStat: {
    fontSize: '14px',
    color: '#64748B',
  },
  campaignActions: {
    display: 'flex',
    gap: '8px',
    paddingLeft: '64px',
  },
  actionButton: {
    padding: '8px 16px',
    background: '#F1F5F9',
    color: '#475569',
    border: 'none',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '500',
    cursor: 'pointer',
  },
  sendButton: {
    padding: '8px 16px',
    background: '#10B981',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  deleteButton: {
    padding: '8px 16px',
    background: '#FEE2E2',
    color: '#DC2626',
    border: 'none',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '500',
    cursor: 'pointer',
  },
  modalOverlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(15, 23, 42, 0.6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px',
    zIndex: 1000,
  },
  modal: {
    background: '#FFFFFF',
    borderRadius: '20px',
    width: '100%',
    maxWidth: '540px',
    maxHeight: '90vh',
    overflow: 'auto',
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '24px 28px',
    borderBottom: '1px solid #E2E8F0',
  },
  modalTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#1E293B',
    margin: 0,
  },
  closeButton: {
    background: 'none',
    border: 'none',
    fontSize: '28px',
    color: '#94A3B8',
    cursor: 'pointer',
    lineHeight: 1,
  },
  modalContent: {
    padding: '28px',
  },
  stepLabel: {
    fontSize: '14px',
    color: '#8B5CF6',
    fontWeight: '600',
    marginBottom: '24px',
  },
  typeGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '12px',
    marginBottom: '24px',
  },
  typeCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
    padding: '24px',
    border: '2px solid #E2E8F0',
    borderRadius: '14px',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  typeCardIcon: {
    fontSize: '32px',
  },
  typeCardLabel: {
    fontSize: '15px',
    fontWeight: '600',
    color: '#1E293B',
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
  select: {
    width: '100%',
    padding: '14px 16px',
    border: '2px solid #E2E8F0',
    borderRadius: '12px',
    fontSize: '15px',
    color: '#1E293B',
    background: '#FFFFFF',
    boxSizing: 'border-box',
  },
  summaryBox: {
    background: '#F8FAFC',
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '24px',
  },
  summaryTitle: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#1E293B',
    margin: '0 0 12px 0',
  },
  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '8px 0',
    borderBottom: '1px solid #E2E8F0',
  },
  summaryLabel: {
    fontSize: '14px',
    color: '#64748B',
  },
  summaryValue: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#1E293B',
  },
  modalActions: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingTop: '8px',
  },
  cancelButton: {
    padding: '12px 24px',
    background: '#F1F5F9',
    color: '#64748B',
    border: 'none',
    borderRadius: '10px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  nextButton: {
    padding: '12px 28px',
    background: '#8B5CF6',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '10px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  createCampaignButton: {
    padding: '12px 28px',
    background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '10px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
  },
};
