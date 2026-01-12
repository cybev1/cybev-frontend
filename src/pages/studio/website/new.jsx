/**
 * Create Website - AI Website Builder
 * /studio/website/new
 */

import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function CreateWebsite() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    type: 'business',
    description: '',
    primaryColor: '#8B5CF6',
    template: 'modern',
  });

  const websiteTypes = [
    { id: 'business', label: 'Business', icon: '💼', desc: 'Company or service website' },
    { id: 'portfolio', label: 'Portfolio', icon: '🎨', desc: 'Showcase your work' },
    { id: 'blog', label: 'Blog', icon: '📝', desc: 'Articles and content' },
    { id: 'church', label: 'Church', icon: '⛪', desc: 'Ministry website' },
    { id: 'ecommerce', label: 'E-commerce', icon: '🛒', desc: 'Online store' },
    { id: 'landing', label: 'Landing Page', icon: '🚀', desc: 'Single page site' },
  ];

  const templates = [
    { id: 'modern', label: 'Modern', preview: '🎯' },
    { id: 'minimal', label: 'Minimal', preview: '✨' },
    { id: 'bold', label: 'Bold', preview: '💪' },
    { id: 'elegant', label: 'Elegant', preview: '👑' },
  ];

  const colors = [
    '#8B5CF6', '#3B82F6', '#10B981', '#F59E0B', 
    '#EF4444', '#EC4899', '#6366F1', '#14B8A6'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const generateWithAI = async () => {
    if (!formData.description) {
      alert('Please describe your website first');
      return;
    }
    
    setGenerating(true);
    try {
      const res = await fetch('/api/ai-generate/generate-site', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: formData.description,
          type: formData.type,
        })
      });
      const data = await res.json();
      if (data.content) {
        setFormData(prev => ({
          ...prev,
          name: data.content.name || prev.name,
          description: data.content.description || prev.description,
        }));
      }
    } catch (error) {
      console.error('AI generation failed:', error);
    } finally {
      setGenerating(false);
    }
  };

  const createWebsite = async () => {
    if (!formData.name) {
      alert('Please enter a website name');
      return;
    }
    
    setLoading(true);
    try {
      const res = await fetch('/api/sites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          type: formData.type,
          description: formData.description,
          settings: {
            primaryColor: formData.primaryColor,
            template: formData.template,
          }
        })
      });
      const data = await res.json();
      if (data.ok || data.site) {
        router.push(`/studio/website/${data.site._id || data.site.id}/edit`);
      } else {
        alert(data.error || 'Failed to create website');
      }
    } catch (error) {
      alert('Failed to create website');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Create Website - CYBEV Studio</title>
      </Head>

      <div style={styles.page}>
        <div style={styles.container}>
          {/* Header */}
          <div style={styles.header}>
            <Link href="/studio" style={styles.backLink}>← Back to Studio</Link>
            <h1 style={styles.title}>Create Website</h1>
            <p style={styles.subtitle}>Build a stunning website with AI assistance</p>
          </div>

          {/* Progress */}
          <div style={styles.progress}>
            {[1, 2, 3].map(s => (
              <div key={s} style={{
                ...styles.progressStep,
                backgroundColor: step >= s ? '#8B5CF6' : '#E4E6EB',
                color: step >= s ? '#FFFFFF' : '#65676B',
              }}>
                {s}
              </div>
            ))}
          </div>

          {/* Step 1: Type */}
          {step === 1 && (
            <div style={styles.stepCard}>
              <h2 style={styles.stepTitle}>What type of website?</h2>
              <div style={styles.typeGrid}>
                {websiteTypes.map(type => (
                  <button
                    key={type.id}
                    onClick={() => setFormData({...formData, type: type.id})}
                    style={{
                      ...styles.typeCard,
                      borderColor: formData.type === type.id ? '#8B5CF6' : '#E4E6EB',
                      backgroundColor: formData.type === type.id ? '#F5F3FF' : '#FFFFFF',
                    }}
                  >
                    <span style={styles.typeIcon}>{type.icon}</span>
                    <span style={styles.typeLabel}>{type.label}</span>
                    <span style={styles.typeDesc}>{type.desc}</span>
                  </button>
                ))}
              </div>
              <div style={styles.stepActions}>
                <div></div>
                <button onClick={() => setStep(2)} style={styles.nextButton}>
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Details */}
          {step === 2 && (
            <div style={styles.stepCard}>
              <h2 style={styles.stepTitle}>Tell us about your website</h2>
              
              <div style={styles.formGroup}>
                <label style={styles.label}>Website Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g., My Business Website"
                  style={styles.input}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>
                  Describe your website
                  <button 
                    onClick={generateWithAI}
                    disabled={generating}
                    style={styles.aiButton}
                  >
                    {generating ? '✨ Generating...' : '✨ Generate with AI'}
                  </button>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe what your website is about, what services you offer, or what you want visitors to know..."
                  style={styles.textarea}
                  rows={5}
                />
              </div>

              <div style={styles.stepActions}>
                <button onClick={() => setStep(1)} style={styles.backButton}>
                  Back
                </button>
                <button 
                  onClick={() => setStep(3)} 
                  disabled={!formData.name}
                  style={{
                    ...styles.nextButton,
                    opacity: formData.name ? 1 : 0.5,
                  }}
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Style */}
          {step === 3 && (
            <div style={styles.stepCard}>
              <h2 style={styles.stepTitle}>Choose your style</h2>
              
              <div style={styles.formGroup}>
                <label style={styles.label}>Template</label>
                <div style={styles.templateGrid}>
                  {templates.map(t => (
                    <button
                      key={t.id}
                      onClick={() => setFormData({...formData, template: t.id})}
                      style={{
                        ...styles.templateCard,
                        borderColor: formData.template === t.id ? '#8B5CF6' : '#E4E6EB',
                        backgroundColor: formData.template === t.id ? '#F5F3FF' : '#FFFFFF',
                      }}
                    >
                      <span style={styles.templatePreview}>{t.preview}</span>
                      <span style={styles.templateLabel}>{t.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Primary Color</label>
                <div style={styles.colorGrid}>
                  {colors.map(color => (
                    <button
                      key={color}
                      onClick={() => setFormData({...formData, primaryColor: color})}
                      style={{
                        ...styles.colorButton,
                        backgroundColor: color,
                        border: formData.primaryColor === color ? '3px solid #1C1E21' : '3px solid transparent',
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Summary */}
              <div style={styles.summaryBox}>
                <h4 style={styles.summaryTitle}>Summary</h4>
                <div style={styles.summaryRow}>
                  <span>Type:</span>
                  <span>{websiteTypes.find(t => t.id === formData.type)?.label}</span>
                </div>
                <div style={styles.summaryRow}>
                  <span>Name:</span>
                  <span>{formData.name}</span>
                </div>
                <div style={styles.summaryRow}>
                  <span>Template:</span>
                  <span>{templates.find(t => t.id === formData.template)?.label}</span>
                </div>
              </div>

              <div style={styles.stepActions}>
                <button onClick={() => setStep(2)} style={styles.backButton}>
                  Back
                </button>
                <button 
                  onClick={createWebsite}
                  disabled={loading}
                  style={styles.createButton}
                >
                  {loading ? 'Creating...' : 'Create Website'}
                </button>
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
    maxWidth: '800px',
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
  progress: {
    display: 'flex',
    justifyContent: 'center',
    gap: '12px',
    marginBottom: '24px',
  },
  progressStep: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
    fontWeight: '600',
  },
  stepCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: '8px',
    padding: '24px',
    boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
  },
  stepTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#1C1E21',
    margin: '0 0 24px 0',
  },
  typeGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
    gap: '12px',
    marginBottom: '24px',
  },
  typeCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px 16px',
    border: '2px solid #E4E6EB',
    borderRadius: '8px',
    cursor: 'pointer',
    backgroundColor: '#FFFFFF',
    textAlign: 'center',
  },
  typeIcon: {
    fontSize: '28px',
    marginBottom: '8px',
  },
  typeLabel: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#1C1E21',
    marginBottom: '4px',
  },
  typeDesc: {
    fontSize: '12px',
    color: '#65676B',
  },
  formGroup: {
    marginBottom: '20px',
  },
  label: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    resize: 'vertical',
    fontFamily: 'inherit',
    boxSizing: 'border-box',
  },
  aiButton: {
    padding: '6px 12px',
    backgroundColor: '#F5F3FF',
    color: '#8B5CF6',
    border: '1px solid #8B5CF6',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  templateGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '12px',
  },
  templateCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '16px',
    border: '2px solid #E4E6EB',
    borderRadius: '8px',
    cursor: 'pointer',
    backgroundColor: '#FFFFFF',
  },
  templatePreview: {
    fontSize: '32px',
    marginBottom: '8px',
  },
  templateLabel: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#1C1E21',
  },
  colorGrid: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap',
  },
  colorButton: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    cursor: 'pointer',
  },
  summaryBox: {
    backgroundColor: '#F7F8FA',
    borderRadius: '8px',
    padding: '16px',
    marginBottom: '24px',
    border: '1px solid #E4E6EB',
  },
  summaryTitle: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#1C1E21',
    margin: '0 0 12px 0',
  },
  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '8px 0',
    borderBottom: '1px solid #E4E6EB',
    fontSize: '14px',
    color: '#1C1E21',
  },
  stepActions: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: '12px 24px',
    backgroundColor: '#E4E6EB',
    color: '#1C1E21',
    border: 'none',
    borderRadius: '6px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  nextButton: {
    padding: '12px 32px',
    backgroundColor: '#8B5CF6',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '6px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  createButton: {
    padding: '12px 32px',
    backgroundColor: '#10B981',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '6px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
  },
};
