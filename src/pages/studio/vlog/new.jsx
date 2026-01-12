/**
 * Create Vlog - Upload Video Content
 * /studio/vlog/new
 */

import { useState, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function CreateVlog() {
  const router = useRouter();
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'general',
    tags: '',
    visibility: 'public',
  });

  const [videoFile, setVideoFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);

  const categories = [
    { id: 'general', label: 'General' },
    { id: 'education', label: 'Education' },
    { id: 'entertainment', label: 'Entertainment' },
    { id: 'music', label: 'Music' },
    { id: 'gaming', label: 'Gaming' },
    { id: 'lifestyle', label: 'Lifestyle' },
    { id: 'tech', label: 'Technology' },
    { id: 'faith', label: 'Faith & Ministry' },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('video/')) {
        alert('Please select a video file');
        return;
      }
      if (file.size > 500 * 1024 * 1024) { // 500MB
        alert('File too large. Maximum size is 500MB');
        return;
      }
      setVideoFile(file);
      setVideoPreview(URL.createObjectURL(file));
    }
  };

  const uploadVideo = async () => {
    if (!videoFile) {
      alert('Please select a video file');
      return;
    }
    if (!formData.title) {
      alert('Please enter a title');
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      // Upload to cloudinary or your storage
      const videoFormData = new FormData();
      videoFormData.append('file', videoFile);
      videoFormData.append('upload_preset', 'cybev_vlogs');

      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 500);

      const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        body: videoFormData,
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      const uploadData = await uploadRes.json();
      const videoUrl = uploadData.url || uploadData.secure_url || '';

      // Create vlog entry
      const res = await fetch('/api/vlogs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          videoUrl: videoUrl,
          category: formData.category,
          tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
          visibility: formData.visibility,
          thumbnail: thumbnail,
        })
      });

      const data = await res.json();
      if (data.ok || data.vlog) {
        router.push('/studio?tab=vlogs');
      } else {
        throw new Error(data.error || 'Failed to create vlog');
      }
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Create Vlog - CYBEV Studio</title>
      </Head>

      <div style={styles.page}>
        <div style={styles.container}>
          {/* Header */}
          <div style={styles.header}>
            <Link href="/studio" style={styles.backLink}>← Back to Studio</Link>
            <h1 style={styles.title}>🎬 Create Vlog</h1>
            <p style={styles.subtitle}>Upload and share video content</p>
          </div>

          <div style={styles.content}>
            {/* Video Upload */}
            <div style={styles.uploadSection}>
              {!videoFile ? (
                <div 
                  style={styles.dropzone}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <span style={styles.dropzoneIcon}>📹</span>
                  <h3 style={styles.dropzoneTitle}>Upload Video</h3>
                  <p style={styles.dropzoneDesc}>Click to select or drag and drop</p>
                  <p style={styles.dropzoneHint}>MP4, MOV, AVI • Max 500MB</p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="video/*"
                    onChange={handleFileSelect}
                    style={{ display: 'none' }}
                  />
                </div>
              ) : (
                <div style={styles.videoPreview}>
                  <video 
                    src={videoPreview} 
                    controls 
                    style={styles.video}
                  />
                  <button 
                    onClick={() => {
                      setVideoFile(null);
                      setVideoPreview(null);
                    }}
                    style={styles.changeButton}
                  >
                    Change Video
                  </button>
                </div>
              )}

              {uploading && (
                <div style={styles.progressContainer}>
                  <div style={styles.progressBar}>
                    <div 
                      style={{
                        ...styles.progressFill,
                        width: `${uploadProgress}%`
                      }}
                    />
                  </div>
                  <span style={styles.progressText}>{uploadProgress}% Uploading...</span>
                </div>
              )}
            </div>

            {/* Details Form */}
            <div style={styles.detailsSection}>
              <h2 style={styles.sectionTitle}>Video Details</h2>

              <div style={styles.formGroup}>
                <label style={styles.label}>Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter a catchy title"
                  style={styles.input}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Tell viewers what your video is about..."
                  style={styles.textarea}
                  rows={4}
                />
              </div>

              <div style={styles.row}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    style={styles.select}
                  >
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.label}</option>
                    ))}
                  </select>
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Visibility</label>
                  <select
                    name="visibility"
                    value={formData.visibility}
                    onChange={handleChange}
                    style={styles.select}
                  >
                    <option value="public">Public</option>
                    <option value="unlisted">Unlisted</option>
                    <option value="private">Private</option>
                  </select>
                </div>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Tags</label>
                <input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  placeholder="vlog, lifestyle, tutorial (comma separated)"
                  style={styles.input}
                />
              </div>

              <div style={styles.actions}>
                <Link href="/studio" style={styles.cancelButton}>
                  Cancel
                </Link>
                <button 
                  onClick={uploadVideo}
                  disabled={!videoFile || !formData.title || uploading}
                  style={{
                    ...styles.uploadButton,
                    opacity: videoFile && formData.title && !uploading ? 1 : 0.5,
                  }}
                >
                  {uploading ? 'Uploading...' : 'Upload Video'}
                </button>
              </div>
            </div>
          </div>
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
    maxWidth: '1000px',
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
  content: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '24px',
  },
  uploadSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: '8px',
    padding: '24px',
    boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
  },
  dropzone: {
    border: '2px dashed #CED0D4',
    borderRadius: '8px',
    padding: '60px 24px',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'border-color 0.2s',
  },
  dropzoneIcon: {
    fontSize: '48px',
    display: 'block',
    marginBottom: '16px',
  },
  dropzoneTitle: {
    fontSize: '17px',
    fontWeight: '600',
    color: '#1C1E21',
    margin: '0 0 8px 0',
  },
  dropzoneDesc: {
    fontSize: '14px',
    color: '#65676B',
    margin: '0 0 8px 0',
  },
  dropzoneHint: {
    fontSize: '12px',
    color: '#8B5CF6',
    margin: 0,
  },
  videoPreview: {
    textAlign: 'center',
  },
  video: {
    width: '100%',
    maxHeight: '300px',
    borderRadius: '8px',
    backgroundColor: '#000',
    marginBottom: '16px',
  },
  changeButton: {
    padding: '10px 20px',
    backgroundColor: '#E4E6EB',
    color: '#1C1E21',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  progressContainer: {
    marginTop: '20px',
  },
  progressBar: {
    height: '8px',
    backgroundColor: '#E4E6EB',
    borderRadius: '4px',
    overflow: 'hidden',
    marginBottom: '8px',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#8B5CF6',
    transition: 'width 0.3s',
  },
  progressText: {
    fontSize: '13px',
    color: '#65676B',
  },
  detailsSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: '8px',
    padding: '24px',
    boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#1C1E21',
    margin: '0 0 24px 0',
  },
  formGroup: {
    marginBottom: '20px',
    flex: 1,
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
  select: {
    width: '100%',
    padding: '12px 16px',
    border: '1px solid #CED0D4',
    borderRadius: '6px',
    fontSize: '15px',
    color: '#1C1E21',
    backgroundColor: '#FFFFFF',
    boxSizing: 'border-box',
  },
  row: {
    display: 'flex',
    gap: '16px',
  },
  actions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
    marginTop: '24px',
  },
  cancelButton: {
    display: 'inline-block',
    padding: '12px 24px',
    backgroundColor: '#E4E6EB',
    color: '#1C1E21',
    textDecoration: 'none',
    borderRadius: '6px',
    fontSize: '15px',
    fontWeight: '600',
  },
  uploadButton: {
    padding: '12px 32px',
    backgroundColor: '#8B5CF6',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '6px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
  },
};
