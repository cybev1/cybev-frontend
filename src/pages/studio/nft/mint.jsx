/**
 * Mint NFT - Turn Content into NFTs
 * /studio/nft/mint
 */

import { useState, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function MintNFT() {
  const router = useRouter();
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    royalty: '10',
    collection: 'default',
    category: 'art',
  });

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const categories = [
    { id: 'art', label: 'Art', icon: '🎨' },
    { id: 'music', label: 'Music', icon: '🎵' },
    { id: 'video', label: 'Video', icon: '🎬' },
    { id: 'photography', label: 'Photography', icon: '📷' },
    { id: 'collectible', label: 'Collectible', icon: '💎' },
    { id: 'domain', label: 'Domain', icon: '🌐' },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.size > 100 * 1024 * 1024) { // 100MB
        alert('File too large. Maximum size is 100MB');
        return;
      }
      setFile(selectedFile);
      
      if (selectedFile.type.startsWith('image/')) {
        setPreview(URL.createObjectURL(selectedFile));
      } else {
        setPreview(null);
      }
    }
  };

  const mintNFT = async () => {
    if (!file) {
      alert('Please select a file');
      return;
    }
    if (!formData.name) {
      alert('Please enter a name');
      return;
    }

    setLoading(true);
    try {
      // Upload file first
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);

      const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        body: uploadFormData,
      });
      const uploadData = await uploadRes.json();
      const fileUrl = uploadData.url || uploadData.secure_url || '';

      // Mint NFT
      const res = await fetch('/api/nft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          fileUrl: fileUrl,
          price: formData.price ? parseFloat(formData.price) : 0,
          royalty: parseInt(formData.royalty),
          category: formData.category,
          collection: formData.collection,
        })
      });

      const data = await res.json();
      if (data.ok || data.nft) {
        alert('NFT created successfully!');
        router.push('/studio');
      } else {
        alert(data.error || 'Failed to mint NFT');
      }
    } catch (error) {
      console.error('Minting failed:', error);
      alert('Minting failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Mint NFT - CYBEV Studio</title>
      </Head>

      <div style={styles.page}>
        <div style={styles.container}>
          {/* Header */}
          <div style={styles.header}>
            <Link href="/studio" style={styles.backLink}>← Back to Studio</Link>
            <h1 style={styles.title}>💎 Mint NFT</h1>
            <p style={styles.subtitle}>Turn your content into blockchain NFTs</p>
          </div>

          <div style={styles.content}>
            {/* File Upload */}
            <div style={styles.uploadSection}>
              <h2 style={styles.sectionTitle}>Upload Content</h2>
              
              {!file ? (
                <div 
                  style={styles.dropzone}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <span style={styles.dropzoneIcon}>🖼️</span>
                  <h3 style={styles.dropzoneTitle}>Upload File</h3>
                  <p style={styles.dropzoneDesc}>Click to select or drag and drop</p>
                  <p style={styles.dropzoneHint}>Images, Audio, Video, 3D • Max 100MB</p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*,video/*,audio/*,.glb,.gltf"
                    onChange={handleFileSelect}
                    style={{ display: 'none' }}
                  />
                </div>
              ) : (
                <div style={styles.filePreview}>
                  {preview ? (
                    <img src={preview} alt="Preview" style={styles.previewImage} />
                  ) : (
                    <div style={styles.fileInfo}>
                      <span style={styles.fileIcon}>📄</span>
                      <span style={styles.fileName}>{file.name}</span>
                      <span style={styles.fileSize}>
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </span>
                    </div>
                  )}
                  <button 
                    onClick={() => {
                      setFile(null);
                      setPreview(null);
                    }}
                    style={styles.changeButton}
                  >
                    Change File
                  </button>
                </div>
              )}
            </div>

            {/* NFT Details */}
            <div style={styles.detailsSection}>
              <h2 style={styles.sectionTitle}>NFT Details</h2>

              <div style={styles.formGroup}>
                <label style={styles.label}>Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="NFT Name"
                  style={styles.input}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe your NFT..."
                  style={styles.textarea}
                  rows={4}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Category</label>
                <div style={styles.categoryGrid}>
                  {categories.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setFormData({...formData, category: cat.id})}
                      style={{
                        ...styles.categoryButton,
                        borderColor: formData.category === cat.id ? '#8B5CF6' : '#E4E6EB',
                        backgroundColor: formData.category === cat.id ? '#F5F3FF' : '#FFFFFF',
                      }}
                    >
                      <span style={styles.categoryIcon}>{cat.icon}</span>
                      <span style={styles.categoryLabel}>{cat.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div style={styles.row}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Price (CYBEV tokens)</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    style={styles.input}
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Royalty %</label>
                  <select
                    name="royalty"
                    value={formData.royalty}
                    onChange={handleChange}
                    style={styles.select}
                  >
                    <option value="0">0%</option>
                    <option value="5">5%</option>
                    <option value="10">10%</option>
                    <option value="15">15%</option>
                    <option value="20">20%</option>
                  </select>
                </div>
              </div>

              {/* Info Box */}
              <div style={styles.infoBox}>
                <h4 style={styles.infoTitle}>ℹ️ About NFT Minting</h4>
                <ul style={styles.infoList}>
                  <li>Your NFT will be minted on CYBEV blockchain</li>
                  <li>Royalty is the percentage you earn from secondary sales</li>
                  <li>Once minted, the NFT cannot be deleted</li>
                  <li>Set price to 0 to make it non-sellable</li>
                </ul>
              </div>

              <div style={styles.actions}>
                <Link href="/studio" style={styles.cancelButton}>
                  Cancel
                </Link>
                <button 
                  onClick={mintNFT}
                  disabled={!file || !formData.name || loading}
                  style={{
                    ...styles.mintButton,
                    opacity: file && formData.name && !loading ? 1 : 0.5,
                  }}
                >
                  {loading ? 'Minting...' : '💎 Mint NFT'}
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
  content: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  uploadSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: '8px',
    padding: '24px',
    boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#1C1E21',
    margin: '0 0 20px 0',
  },
  dropzone: {
    border: '2px dashed #CED0D4',
    borderRadius: '8px',
    padding: '60px 24px',
    textAlign: 'center',
    cursor: 'pointer',
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
  filePreview: {
    textAlign: 'center',
  },
  previewImage: {
    maxWidth: '100%',
    maxHeight: '300px',
    borderRadius: '8px',
    marginBottom: '16px',
  },
  fileInfo: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '40px',
    backgroundColor: '#F7F8FA',
    borderRadius: '8px',
    marginBottom: '16px',
  },
  fileIcon: {
    fontSize: '40px',
    marginBottom: '12px',
  },
  fileName: {
    fontSize: '15px',
    fontWeight: '600',
    color: '#1C1E21',
    marginBottom: '4px',
  },
  fileSize: {
    fontSize: '13px',
    color: '#65676B',
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
  detailsSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: '8px',
    padding: '24px',
    boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
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
  categoryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
    gap: '10px',
  },
  categoryButton: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '14px 10px',
    border: '2px solid #E4E6EB',
    borderRadius: '8px',
    cursor: 'pointer',
    backgroundColor: '#FFFFFF',
  },
  categoryIcon: {
    fontSize: '24px',
    marginBottom: '6px',
  },
  categoryLabel: {
    fontSize: '12px',
    fontWeight: '600',
    color: '#1C1E21',
  },
  row: {
    display: 'flex',
    gap: '16px',
  },
  infoBox: {
    backgroundColor: '#F5F3FF',
    borderRadius: '8px',
    padding: '16px',
    marginBottom: '24px',
    border: '1px solid #DDD6FE',
  },
  infoTitle: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#1C1E21',
    margin: '0 0 12px 0',
  },
  infoList: {
    margin: 0,
    paddingLeft: '20px',
    fontSize: '13px',
    color: '#65676B',
    lineHeight: '1.8',
  },
  actions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
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
  mintButton: {
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
