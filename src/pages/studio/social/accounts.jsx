/**
 * Social Accounts Management
 * /studio/social/accounts
 */

import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function SocialAccounts() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [adding, setAdding] = useState(false);
  const [formData, setFormData] = useState({
    platform: 'facebook',
    email: '',
    password: '',
  });

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const res = await fetch('/api/social-tools/accounts');
      const data = await res.json();
      setAccounts(data.accounts || []);
    } catch (error) {
      console.error('Failed to fetch accounts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    setAdding(true);
    try {
      const res = await fetch('/api/social-tools/accounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.ok) {
        setAccounts([...accounts, data.account]);
        setShowAdd(false);
        setFormData({ platform: 'facebook', email: '', password: '' });
      } else {
        alert(data.error || 'Failed to add account');
      }
    } catch (error) {
      alert('Failed to add account');
    } finally {
      setAdding(false);
    }
  };

  const deleteAccount = async (id) => {
    if (!confirm('Delete this account?')) return;
    try {
      await fetch(`/api/social-tools/accounts/${id}`, { method: 'DELETE' });
      setAccounts(accounts.filter(a => a._id !== id));
    } catch (error) {
      alert('Failed to delete');
    }
  };

  return (
    <>
      <Head>
        <title>Social Accounts - CYBEV Studio</title>
      </Head>

      <div style={styles.page}>
        <div style={styles.container}>
          {/* Header */}
          <div style={styles.header}>
            <div>
              <Link href="/studio/social" style={styles.backLink}>← Back to Social Tools</Link>
              <h1 style={styles.title}>Social Accounts</h1>
              <p style={styles.subtitle}>Manage your connected social media accounts</p>
            </div>
            <button onClick={() => setShowAdd(true)} style={styles.addButton}>
              + Add Account
            </button>
          </div>

          {/* Accounts List */}
          <div style={styles.section}>
            {loading ? (
              <div style={styles.loading}>Loading accounts...</div>
            ) : accounts.length === 0 ? (
              <div style={styles.emptyState}>
                <span style={styles.emptyIcon}>🔗</span>
                <h3 style={styles.emptyTitle}>No accounts connected</h3>
                <p style={styles.emptyDesc}>Add your first social media account to start automating</p>
                <button onClick={() => setShowAdd(true)} style={styles.emptyButton}>
                  Add Account
                </button>
              </div>
            ) : (
              <div style={styles.accountsList}>
                {accounts.map(account => (
                  <div key={account._id} style={styles.accountCard}>
                    <div style={styles.accountIcon}>
                      {account.platform === 'facebook' ? '📘' : 
                       account.platform === 'instagram' ? '📸' : 
                       account.platform === 'twitter' ? '🐦' : '🌐'}
                    </div>
                    <div style={styles.accountInfo}>
                      <h3 style={styles.accountEmail}>{account.email}</h3>
                      <p style={styles.accountPlatform}>{account.platform}</p>
                    </div>
                    <span style={{
                      ...styles.statusBadge,
                      backgroundColor: account.status === 'active' ? '#DCFCE7' : '#FEE2E2',
                      color: account.status === 'active' ? '#166534' : '#991B1B',
                    }}>
                      {account.status || 'active'}
                    </span>
                    <button 
                      onClick={() => deleteAccount(account._id)}
                      style={styles.deleteButton}
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Add Account Modal */}
          {showAdd && (
            <div style={styles.modalOverlay} onClick={() => setShowAdd(false)}>
              <div style={styles.modal} onClick={e => e.stopPropagation()}>
                <div style={styles.modalHeader}>
                  <h2 style={styles.modalTitle}>Add Social Account</h2>
                  <button onClick={() => setShowAdd(false)} style={styles.closeButton}>×</button>
                </div>
                <form onSubmit={handleAdd} style={styles.modalContent}>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Platform</label>
                    <select
                      value={formData.platform}
                      onChange={(e) => setFormData({...formData, platform: e.target.value})}
                      style={styles.select}
                    >
                      <option value="facebook">Facebook</option>
                      <option value="instagram">Instagram</option>
                      <option value="twitter">Twitter/X</option>
                    </select>
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Email / Username</label>
                    <input
                      type="text"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      placeholder="your@email.com"
                      style={styles.input}
                      required
                    />
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Password</label>
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      placeholder="••••••••"
                      style={styles.input}
                      required
                    />
                  </div>
                  <p style={styles.securityNote}>
                    🔒 Your credentials are encrypted with AES-256 encryption
                  </p>
                  <div style={styles.modalActions}>
                    <button type="button" onClick={() => setShowAdd(false)} style={styles.cancelButton}>
                      Cancel
                    </button>
                    <button type="submit" disabled={adding} style={styles.submitButton}>
                      {adding ? 'Adding...' : 'Add Account'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    backgroundColor: '#F0F2F5',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },
  container: {
    maxWidth: '900px',
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
  addButton: {
    padding: '12px 24px',
    backgroundColor: '#8B5CF6',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '6px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: '8px',
    padding: '20px',
    boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
  },
  loading: {
    textAlign: 'center',
    padding: '40px',
    color: '#65676B',
  },
  emptyState: {
    textAlign: 'center',
    padding: '60px 20px',
  },
  emptyIcon: {
    fontSize: '48px',
    display: 'block',
    marginBottom: '16px',
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
    margin: '0 0 20px 0',
  },
  emptyButton: {
    padding: '10px 24px',
    backgroundColor: '#8B5CF6',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  accountsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  accountCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '16px',
    backgroundColor: '#F7F8FA',
    borderRadius: '8px',
    border: '1px solid #E4E6EB',
  },
  accountIcon: {
    fontSize: '28px',
  },
  accountInfo: {
    flex: 1,
  },
  accountEmail: {
    fontSize: '15px',
    fontWeight: '600',
    color: '#1C1E21',
    margin: '0 0 4px 0',
  },
  accountPlatform: {
    fontSize: '13px',
    color: '#65676B',
    margin: 0,
    textTransform: 'capitalize',
  },
  statusBadge: {
    padding: '6px 12px',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  deleteButton: {
    padding: '8px 16px',
    backgroundColor: '#FEE2E2',
    color: '#DC2626',
    border: 'none',
    borderRadius: '6px',
    fontSize: '13px',
    fontWeight: '500',
    cursor: 'pointer',
  },
  modalOverlay: {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px',
    zIndex: 1000,
  },
  modal: {
    backgroundColor: '#FFFFFF',
    borderRadius: '8px',
    width: '100%',
    maxWidth: '450px',
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px',
    borderBottom: '1px solid #E4E6EB',
  },
  modalTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#1C1E21',
    margin: 0,
  },
  closeButton: {
    background: 'none',
    border: 'none',
    fontSize: '24px',
    color: '#65676B',
    cursor: 'pointer',
  },
  modalContent: {
    padding: '20px',
  },
  formGroup: {
    marginBottom: '16px',
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
    fontSize: '14px',
    color: '#1C1E21',
    backgroundColor: '#FFFFFF',
    boxSizing: 'border-box',
  },
  select: {
    width: '100%',
    padding: '12px 16px',
    border: '1px solid #CED0D4',
    borderRadius: '6px',
    fontSize: '14px',
    color: '#1C1E21',
    backgroundColor: '#FFFFFF',
    boxSizing: 'border-box',
  },
  securityNote: {
    fontSize: '13px',
    color: '#65676B',
    margin: '0 0 20px 0',
    padding: '12px',
    backgroundColor: '#F7F8FA',
    borderRadius: '6px',
  },
  modalActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
  },
  cancelButton: {
    padding: '10px 20px',
    backgroundColor: '#E4E6EB',
    color: '#1C1E21',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  submitButton: {
    padding: '10px 24px',
    backgroundColor: '#8B5CF6',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
  },
};
