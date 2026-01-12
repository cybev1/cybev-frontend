/**
 * Schedule Meeting Page
 * CYBEV Studio v2.0
 * GitHub: https://github.com/cybev1/cybev-frontend/pages/meet/schedule.jsx
 */

import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';

export default function ScheduleMeeting() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [createdMeeting, setCreatedMeeting] = useState(null);
  const [copied, setCopied] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    duration: 60,
    invitees: '',
    waitingRoom: false,
    muteOnEntry: true,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const nextStep = () => setStep(s => Math.min(s + 1, 4));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const scheduleMeeting = async () => {
    setLoading(true);
    try {
      const scheduledAt = new Date(`${formData.date}T${formData.time}`);
      const invitees = formData.invitees
        .split(/[,\n]/)
        .map(e => e.trim())
        .filter(e => e);

      const res = await fetch('/api/meet/schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          scheduledAt: scheduledAt.toISOString(),
          duration: formData.duration,
          invitees,
          settings: {
            waitingRoom: formData.waitingRoom,
            muteOnEntry: formData.muteOnEntry,
          }
        })
      });

      const data = await res.json();
      setCreatedMeeting(data);
      setStep(5); // Success step
    } catch (error) {
      console.error('Failed to schedule meeting:', error);
      alert('Failed to schedule meeting. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const copyLink = () => {
    const url = `${window.location.origin}/meet/${createdMeeting.roomId}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Get minimum date (today)
  const today = new Date().toISOString().split('T')[0];

  return (
    <>
      <Head>
        <title>Schedule Meeting - CYBEV Meet</title>
      </Head>

      <div style={styles.container}>
        <div style={styles.card}>
          {/* Header */}
          <div style={styles.header}>
            <Link href="/meet" style={styles.backLink}>
              ← Back to Meet
            </Link>
            <h1 style={styles.title}>Schedule a Meeting</h1>
            <p style={styles.subtitle}>Plan your meeting for the perfect time</p>
          </div>

          {/* Progress Steps */}
          {step < 5 && (
            <div style={styles.progress}>
              {['Details', 'Date & Time', 'Participants', 'Settings'].map((label, i) => (
                <div key={i} style={styles.progressStep}>
                  <div style={{
                    ...styles.progressDot,
                    background: step > i ? '#8B5CF6' : step === i + 1 ? '#8B5CF6' : '#E2E8F0',
                    color: step >= i + 1 ? '#FFFFFF' : '#64748B',
                  }}>
                    {step > i + 1 ? '✓' : i + 1}
                  </div>
                  <span style={{
                    ...styles.progressLabel,
                    color: step >= i + 1 ? '#1E293B' : '#94A3B8',
                  }}>{label}</span>
                </div>
              ))}
            </div>
          )}

          {/* Step 1: Details */}
          {step === 1 && (
            <div style={styles.stepContent}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Meeting Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g., Team Standup, Client Call"
                  style={styles.input}
                  required
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Description (optional)</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="What's this meeting about?"
                  style={styles.textarea}
                  rows={3}
                />
              </div>
              <div style={styles.actions}>
                <div></div>
                <button
                  onClick={nextStep}
                  disabled={!formData.title}
                  style={{...styles.primaryButton, opacity: formData.title ? 1 : 0.5}}
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Date & Time */}
          {step === 2 && (
            <div style={styles.stepContent}>
              <div style={styles.row}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Date *</label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    min={today}
                    style={styles.input}
                    required
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Time *</label>
                  <input
                    type="time"
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    style={styles.input}
                    required
                  />
                </div>
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Duration</label>
                <select
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  style={styles.select}
                >
                  <option value={15}>15 minutes</option>
                  <option value={30}>30 minutes</option>
                  <option value={45}>45 minutes</option>
                  <option value={60}>1 hour</option>
                  <option value={90}>1.5 hours</option>
                  <option value={120}>2 hours</option>
                </select>
              </div>
              <div style={styles.actions}>
                <button onClick={prevStep} style={styles.secondaryButton}>
                  Back
                </button>
                <button
                  onClick={nextStep}
                  disabled={!formData.date || !formData.time}
                  style={{...styles.primaryButton, opacity: formData.date && formData.time ? 1 : 0.5}}
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Participants */}
          {step === 3 && (
            <div style={styles.stepContent}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Invite Participants (optional)</label>
                <p style={styles.hint}>Enter email addresses, separated by commas or new lines</p>
                <textarea
                  name="invitees"
                  value={formData.invitees}
                  onChange={handleChange}
                  placeholder="john@example.com, jane@example.com"
                  style={styles.textarea}
                  rows={4}
                />
              </div>
              <div style={styles.actions}>
                <button onClick={prevStep} style={styles.secondaryButton}>
                  Back
                </button>
                <button onClick={nextStep} style={styles.primaryButton}>
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Settings */}
          {step === 4 && (
            <div style={styles.stepContent}>
              <div style={styles.settingsGroup}>
                <label style={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    name="waitingRoom"
                    checked={formData.waitingRoom}
                    onChange={handleChange}
                    style={styles.checkbox}
                  />
                  <div>
                    <span style={styles.checkboxTitle}>Enable waiting room</span>
                    <p style={styles.checkboxDesc}>Participants wait for host approval to join</p>
                  </div>
                </label>
                <label style={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    name="muteOnEntry"
                    checked={formData.muteOnEntry}
                    onChange={handleChange}
                    style={styles.checkbox}
                  />
                  <div>
                    <span style={styles.checkboxTitle}>Mute participants on entry</span>
                    <p style={styles.checkboxDesc}>Participants join with microphone muted</p>
                  </div>
                </label>
              </div>
              <div style={styles.actions}>
                <button onClick={prevStep} style={styles.secondaryButton}>
                  Back
                </button>
                <button
                  onClick={scheduleMeeting}
                  disabled={loading}
                  style={styles.primaryButton}
                >
                  {loading ? 'Scheduling...' : 'Schedule Meeting'}
                </button>
              </div>
            </div>
          )}

          {/* Step 5: Success */}
          {step === 5 && createdMeeting && (
            <div style={styles.successContent}>
              <div style={styles.successIcon}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              </div>
              <h2 style={styles.successTitle}>Meeting Scheduled!</h2>
              <p style={styles.successDesc}>
                Your meeting "{formData.title}" is scheduled for{' '}
                {new Date(`${formData.date}T${formData.time}`).toLocaleString()}
              </p>
              
              <div style={styles.linkBox}>
                <input
                  type="text"
                  readOnly
                  value={`${typeof window !== 'undefined' ? window.location.origin : ''}/meet/${createdMeeting.roomId}`}
                  style={styles.linkInput}
                />
                <button onClick={copyLink} style={styles.copyButton}>
                  {copied ? '✓ Copied' : 'Copy'}
                </button>
              </div>

              <div style={styles.successActions}>
                <Link href="/meet" style={styles.secondaryButton}>
                  Back to Meet
                </Link>
                <Link href={`/meet/${createdMeeting.roomId}`} style={styles.primaryButton}>
                  Join Meeting
                </Link>
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
    minHeight: '100vh',
    background: '#F8FAFC',
    padding: '40px 24px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  card: {
    maxWidth: '600px',
    margin: '0 auto',
    background: '#FFFFFF',
    borderRadius: '20px',
    boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
    overflow: 'hidden',
  },
  header: {
    padding: '32px 32px 24px',
    borderBottom: '1px solid #F1F5F9',
  },
  backLink: {
    display: 'inline-block',
    color: '#64748B',
    textDecoration: 'none',
    fontSize: '14px',
    marginBottom: '16px',
  },
  title: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#1E293B',
    margin: '0 0 8px 0',
  },
  subtitle: {
    fontSize: '16px',
    color: '#64748B',
    margin: 0,
  },
  progress: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '24px 32px',
    borderBottom: '1px solid #F1F5F9',
  },
  progressStep: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
  },
  progressDot: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
    fontWeight: '600',
  },
  progressLabel: {
    fontSize: '12px',
    fontWeight: '500',
  },
  stepContent: {
    padding: '32px',
  },
  formGroup: {
    marginBottom: '24px',
  },
  label: {
    display: 'block',
    fontSize: '14px',
    fontWeight: '600',
    color: '#374151',
    marginBottom: '8px',
  },
  hint: {
    fontSize: '13px',
    color: '#64748B',
    margin: '0 0 8px 0',
  },
  input: {
    width: '100%',
    padding: '14px 16px',
    border: '2px solid #E2E8F0',
    borderRadius: '12px',
    fontSize: '15px',
    color: '#1E293B',
    outline: 'none',
    transition: 'border-color 0.2s',
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
    outline: 'none',
    background: '#FFFFFF',
    boxSizing: 'border-box',
  },
  row: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
  },
  settingsGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    marginBottom: '24px',
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    padding: '16px',
    background: '#F8FAFC',
    borderRadius: '12px',
    cursor: 'pointer',
  },
  checkbox: {
    width: '20px',
    height: '20px',
    marginTop: '2px',
    accentColor: '#8B5CF6',
  },
  checkboxTitle: {
    display: 'block',
    fontSize: '15px',
    fontWeight: '600',
    color: '#1E293B',
  },
  checkboxDesc: {
    fontSize: '13px',
    color: '#64748B',
    margin: '4px 0 0 0',
  },
  actions: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingTop: '8px',
  },
  primaryButton: {
    padding: '14px 28px',
    background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '12px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    textDecoration: 'none',
    display: 'inline-block',
    textAlign: 'center',
  },
  secondaryButton: {
    padding: '14px 28px',
    background: '#FFFFFF',
    color: '#64748B',
    border: '2px solid #E2E8F0',
    borderRadius: '12px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    textDecoration: 'none',
    display: 'inline-block',
    textAlign: 'center',
  },
  successContent: {
    padding: '48px 32px',
    textAlign: 'center',
  },
  successIcon: {
    marginBottom: '24px',
  },
  successTitle: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#1E293B',
    margin: '0 0 12px 0',
  },
  successDesc: {
    fontSize: '16px',
    color: '#64748B',
    margin: '0 0 32px 0',
  },
  linkBox: {
    display: 'flex',
    gap: '12px',
    marginBottom: '32px',
  },
  linkInput: {
    flex: 1,
    padding: '14px 16px',
    border: '2px solid #E2E8F0',
    borderRadius: '12px',
    fontSize: '14px',
    color: '#64748B',
    background: '#F8FAFC',
  },
  copyButton: {
    padding: '14px 24px',
    background: '#10B981',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '12px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  },
  successActions: {
    display: 'flex',
    gap: '16px',
    justifyContent: 'center',
  },
};
