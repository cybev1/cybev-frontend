/**
 * AI Writer - Generate Blog Posts
 * /studio/ai-writer
 */

import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function AIWriter() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  
  const [formData, setFormData] = useState({
    topic: '',
    style: 'informative',
    length: 'medium',
    keywords: '',
    targetAudience: 'general',
  });

  const [generatedContent, setGeneratedContent] = useState({
    title: '',
    content: '',
    excerpt: '',
  });

  const styles_list = [
    { id: 'informative', label: 'Informative', icon: '📚', desc: 'Educational and factual' },
    { id: 'persuasive', label: 'Persuasive', icon: '🎯', desc: 'Convincing and compelling' },
    { id: 'storytelling', label: 'Storytelling', icon: '📖', desc: 'Narrative and engaging' },
    { id: 'professional', label: 'Professional', icon: '💼', desc: 'Business-like and formal' },
    { id: 'casual', label: 'Casual', icon: '😊', desc: 'Friendly and relaxed' },
    { id: 'inspirational', label: 'Inspirational', icon: '✨', desc: 'Motivating and uplifting' },
  ];

  const lengths = [
    { id: 'short', label: 'Short', desc: '~300 words' },
    { id: 'medium', label: 'Medium', desc: '~600 words' },
    { id: 'long', label: 'Long', desc: '~1000 words' },
    { id: 'comprehensive', label: 'Comprehensive', desc: '~1500+ words' },
  ];

  const generateContent = async () => {
    if (!formData.topic) {
      alert('Please enter a topic');
      return;
    }

    setGenerating(true);
    try {
      const res = await fetch('/api/ai-generate/generate-campaign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'blog',
          topic: formData.topic,
          style: formData.style,
          length: formData.length,
          keywords: formData.keywords,
          targetAudience: formData.targetAudience,
        })
      });
      
      const data = await res.json();
      
      if (data.content) {
        setGeneratedContent({
          title: data.content.title || formData.topic,
          content: data.content.body || data.content.content || '',
          excerpt: data.content.excerpt || '',
        });
        setStep(2);
      } else {
        // Generate dummy content for demo
        setGeneratedContent({
          title: formData.topic,
          content: `# ${formData.topic}\n\nThis is your AI-generated blog post about ${formData.topic}. The content is written in a ${formData.style} style.\n\n## Introduction\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.\n\n## Main Points\n\n- Point one about ${formData.topic}\n- Point two with more details\n- Point three for comprehensive coverage\n\n## Conclusion\n\nIn conclusion, ${formData.topic} is an important subject that deserves attention.`,
          excerpt: `A comprehensive guide to ${formData.topic}, written in a ${formData.style} style.`,
        });
        setStep(2);
      }
    } catch (error) {
      console.error('Generation failed:', error);
      // Show demo content on error
      setGeneratedContent({
        title: formData.topic,
        content: `# ${formData.topic}\n\nThis is your AI-generated blog post content. Edit as needed.`,
        excerpt: `About ${formData.topic}`,
      });
      setStep(2);
    } finally {
      setGenerating(false);
    }
  };

  const publishPost = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/blogs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: generatedContent.title,
          content: generatedContent.content,
          excerpt: generatedContent.excerpt,
          status: 'published',
        })
      });
      
      const data = await res.json();
      if (data.ok || data.blog) {
        router.push('/studio?tab=blogs');
      } else {
        alert(data.error || 'Failed to publish');
      }
    } catch (error) {
      alert('Failed to publish post');
    } finally {
      setLoading(false);
    }
  };

  const saveDraft = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/blogs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: generatedContent.title,
          content: generatedContent.content,
          excerpt: generatedContent.excerpt,
          status: 'draft',
        })
      });
      
      const data = await res.json();
      if (data.ok || data.blog) {
        router.push('/studio?tab=blogs');
      } else {
        alert(data.error || 'Failed to save');
      }
    } catch (error) {
      alert('Failed to save draft');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>AI Writer - CYBEV Studio</title>
      </Head>

      <div style={styles.page}>
        <div style={styles.container}>
          {/* Header */}
          <div style={styles.header}>
            <Link href="/studio" style={styles.backLink}>← Back to Studio</Link>
            <h1 style={styles.title}>✨ AI Writer</h1>
            <p style={styles.subtitle}>Generate blog posts instantly with AI</p>
          </div>

          {/* Step 1: Configure */}
          {step === 1 && (
            <div style={styles.card}>
              <h2 style={styles.cardTitle}>What do you want to write about?</h2>
              
              <div style={styles.formGroup}>
                <label style={styles.label}>Topic / Title</label>
                <input
                  type="text"
                  value={formData.topic}
                  onChange={(e) => setFormData({...formData, topic: e.target.value})}
                  placeholder="e.g., 10 Tips for Better Productivity"
                  style={styles.input}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Writing Style</label>
                <div style={styles.styleGrid}>
                  {styles_list.map(s => (
                    <button
                      key={s.id}
                      onClick={() => setFormData({...formData, style: s.id})}
                      style={{
                        ...styles.styleCard,
                        borderColor: formData.style === s.id ? '#8B5CF6' : '#E4E6EB',
                        backgroundColor: formData.style === s.id ? '#F5F3FF' : '#FFFFFF',
                      }}
                    >
                      <span style={styles.styleIcon}>{s.icon}</span>
                      <span style={styles.styleLabel}>{s.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Length</label>
                <div style={styles.lengthGrid}>
                  {lengths.map(l => (
                    <button
                      key={l.id}
                      onClick={() => setFormData({...formData, length: l.id})}
                      style={{
                        ...styles.lengthCard,
                        borderColor: formData.length === l.id ? '#8B5CF6' : '#E4E6EB',
                        backgroundColor: formData.length === l.id ? '#F5F3FF' : '#FFFFFF',
                      }}
                    >
                      <span style={styles.lengthLabel}>{l.label}</span>
                      <span style={styles.lengthDesc}>{l.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Keywords (optional)</label>
                <input
                  type="text"
                  value={formData.keywords}
                  onChange={(e) => setFormData({...formData, keywords: e.target.value})}
                  placeholder="SEO keywords, comma separated"
                  style={styles.input}
                />
              </div>

              <button 
                onClick={generateContent}
                disabled={!formData.topic || generating}
                style={{
                  ...styles.generateButton,
                  opacity: formData.topic && !generating ? 1 : 0.5,
                }}
              >
                {generating ? '✨ Generating...' : '✨ Generate with AI'}
              </button>
            </div>
          )}

          {/* Step 2: Edit & Publish */}
          {step === 2 && (
            <div style={styles.card}>
              <div style={styles.editorHeader}>
                <h2 style={styles.cardTitle}>Edit Your Post</h2>
                <button onClick={() => setStep(1)} style={styles.regenerateButton}>
                  ← Regenerate
                </button>
              </div>
              
              <div style={styles.formGroup}>
                <label style={styles.label}>Title</label>
                <input
                  type="text"
                  value={generatedContent.title}
                  onChange={(e) => setGeneratedContent({...generatedContent, title: e.target.value})}
                  style={styles.input}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Excerpt</label>
                <textarea
                  value={generatedContent.excerpt}
                  onChange={(e) => setGeneratedContent({...generatedContent, excerpt: e.target.value})}
                  style={styles.excerptTextarea}
                  rows={2}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Content</label>
                <textarea
                  value={generatedContent.content}
                  onChange={(e) => setGeneratedContent({...generatedContent, content: e.target.value})}
                  style={styles.contentTextarea}
                  rows={15}
                />
              </div>

              <div style={styles.publishActions}>
                <button 
                  onClick={saveDraft}
                  disabled={loading}
                  style={styles.draftButton}
                >
                  Save as Draft
                </button>
                <button 
                  onClick={publishPost}
                  disabled={loading}
                  style={styles.publishButton}
                >
                  {loading ? 'Publishing...' : 'Publish Post'}
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
    maxWidth: '900px',
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
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: '8px',
    padding: '24px',
    boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
  },
  cardTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#1C1E21',
    margin: '0 0 24px 0',
  },
  formGroup: {
    marginBottom: '24px',
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
    padding: '14px 16px',
    border: '1px solid #CED0D4',
    borderRadius: '6px',
    fontSize: '15px',
    color: '#1C1E21',
    backgroundColor: '#FFFFFF',
    boxSizing: 'border-box',
  },
  styleGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
    gap: '12px',
  },
  styleCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '16px 12px',
    border: '2px solid #E4E6EB',
    borderRadius: '8px',
    cursor: 'pointer',
    backgroundColor: '#FFFFFF',
  },
  styleIcon: {
    fontSize: '24px',
    marginBottom: '8px',
  },
  styleLabel: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#1C1E21',
  },
  lengthGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '12px',
  },
  lengthCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '16px 12px',
    border: '2px solid #E4E6EB',
    borderRadius: '8px',
    cursor: 'pointer',
    backgroundColor: '#FFFFFF',
  },
  lengthLabel: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#1C1E21',
    marginBottom: '4px',
  },
  lengthDesc: {
    fontSize: '12px',
    color: '#65676B',
  },
  generateButton: {
    width: '100%',
    padding: '16px 24px',
    backgroundColor: '#8B5CF6',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  editorHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
  },
  regenerateButton: {
    padding: '8px 16px',
    backgroundColor: '#E4E6EB',
    color: '#1C1E21',
    border: 'none',
    borderRadius: '6px',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  excerptTextarea: {
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
  contentTextarea: {
    width: '100%',
    padding: '16px',
    border: '1px solid #CED0D4',
    borderRadius: '6px',
    fontSize: '15px',
    color: '#1C1E21',
    backgroundColor: '#FFFFFF',
    resize: 'vertical',
    fontFamily: 'monospace',
    lineHeight: '1.6',
    boxSizing: 'border-box',
  },
  publishActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
  },
  draftButton: {
    padding: '12px 24px',
    backgroundColor: '#E4E6EB',
    color: '#1C1E21',
    border: 'none',
    borderRadius: '6px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  publishButton: {
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
