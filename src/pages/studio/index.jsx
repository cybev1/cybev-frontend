/**
 * Creator Studio - Main Dashboard
 * CYBEV Studio v2.0
 * 
 * Facebook-style clean white design with CYBEV purple accents
 * All features visible: Websites, Blog Posts, Forms, Vlogs, Analytics,
 * + NEW: Meet, Social Tools, Campaigns
 */

import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Studio() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('websites');
  const [websites, setWebsites] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [forms, setForms] = useState([]);
  const [vlogs, setVlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch websites, blogs, forms, vlogs
      const [sitesRes, blogsRes, formsRes, vlogsRes] = await Promise.all([
        fetch('/api/sites/my').catch(() => ({ json: () => ({ sites: [] }) })),
        fetch('/api/blogs/my').catch(() => ({ json: () => ({ blogs: [] }) })),
        fetch('/api/forms').catch(() => ({ json: () => ({ forms: [] }) })),
        fetch('/api/vlogs/my').catch(() => ({ json: () => ({ vlogs: [] }) })),
      ]);
      
      const sitesData = await sitesRes.json();
      const blogsData = await blogsRes.json();
      const formsData = await formsRes.json();
      const vlogsData = await vlogsRes.json();
      
      setWebsites(sitesData.sites || []);
      setBlogs(blogsData.blogs || []);
      setForms(formsData.forms || []);
      setVlogs(vlogsData.vlogs || []);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Feature cards - including NEW features
  const features = [
    { id: 'website', label: 'Create Website', desc: 'Build a stunning website with AI', href: '/studio/website/new', icon: '🌐', badge: 'Popular', color: '#8B5CF6' },
    { id: 'church', label: 'Church Management', desc: 'Manage your church & ministry', href: '/church', icon: '⛪', badge: 'New', color: '#10B981' },
    { id: 'ai-write', label: 'Write with AI', desc: 'Generate blog posts instantly', href: '/studio/ai-writer', icon: '✨', color: '#F59E0B' },
    { id: 'vlog', label: 'Create Vlog', desc: 'Upload and share video content', href: '/studio/vlog/new', icon: '🎬', color: '#EF4444' },
    { id: 'forms', label: 'Forms Builder', desc: 'Create surveys & collect responses', href: '/studio/forms/new', icon: '📝', badge: 'New', color: '#3B82F6' },
    { id: 'nft', label: 'Mint NFT', desc: 'Turn your content into NFTs', href: '/studio/nft/mint', icon: '💎', color: '#EC4899' },
    // NEW FEATURES
    { id: 'meet', label: 'Meet', desc: 'Video calls & conferences', href: '/meet', icon: '📹', badge: 'New', color: '#8B5CF6' },
    { id: 'social', label: 'Social Tools', desc: 'Automate your social media', href: '/studio/social', icon: '🚀', badge: 'New', color: '#10B981' },
    { id: 'campaigns', label: 'Campaigns', desc: 'Email & SMS marketing', href: '/studio/campaigns', icon: '📧', badge: 'New', color: '#F59E0B' },
  ];

  // Tabs
  const tabs = [
    { id: 'websites', label: 'Websites', count: websites.length },
    { id: 'blogs', label: 'Blog Posts', count: blogs.length },
    { id: 'forms', label: 'Forms', count: forms.length },
    { id: 'vlogs', label: 'Vlogs', count: vlogs.length },
    { id: 'analytics', label: 'Analytics', count: null },
  ];

  return (
    <>
      <Head>
        <title>Creator Studio - CYBEV</title>
      </Head>

      <div style={styles.page}>
        <div style={styles.container}>
          {/* Header */}
          <div style={styles.header}>
            <h1 style={styles.title}>Creator Studio</h1>
            <p style={styles.subtitle}>Build websites, write content, and manage your creations</p>
          </div>

          {/* Feature Cards */}
          <div style={styles.featuresGrid}>
            {features.map((feature) => (
              <Link key={feature.id} href={feature.href} style={styles.featureCard}>
                <div style={styles.featureTop}>
                  <div style={{...styles.featureIcon, backgroundColor: `${feature.color}15`}}>
                    <span style={styles.featureEmoji}>{feature.icon}</span>
                  </div>
                  {feature.badge && (
                    <span style={{
                      ...styles.badge,
                      backgroundColor: feature.badge === 'New' ? '#DCFCE7' : '#FEF3C7',
                      color: feature.badge === 'New' ? '#166534' : '#92400E',
                    }}>
                      {feature.badge}
                    </span>
                  )}
                </div>
                <h3 style={styles.featureLabel}>{feature.label}</h3>
                <p style={styles.featureDesc}>{feature.desc}</p>
              </Link>
            ))}
          </div>

          {/* Tabs */}
          <div style={styles.tabsContainer}>
            <div style={styles.tabs}>
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    ...styles.tab,
                    ...(activeTab === tab.id ? styles.activeTab : {}),
                  }}
                >
                  {tab.label}
                  {tab.count !== null && (
                    <span style={{
                      ...styles.tabCount,
                      backgroundColor: activeTab === tab.id ? '#8B5CF6' : '#E5E7EB',
                      color: activeTab === tab.id ? '#FFFFFF' : '#6B7280',
                    }}>
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div style={styles.content}>
            {/* Websites Tab */}
            {activeTab === 'websites' && (
              <div>
                <div style={styles.contentHeader}>
                  <h2 style={styles.contentTitle}>Your Websites</h2>
                  <Link href="/studio/website/new" style={styles.newButton}>
                    + New Website
                  </Link>
                </div>
                
                {loading ? (
                  <div style={styles.loading}>Loading...</div>
                ) : websites.length === 0 ? (
                  <div style={styles.emptyState}>
                    <span style={styles.emptyIcon}>🌐</span>
                    <h3 style={styles.emptyTitle}>No websites yet</h3>
                    <p style={styles.emptyDesc}>Create your first website with AI</p>
                    <Link href="/studio/website/new" style={styles.emptyButton}>
                      Create Website
                    </Link>
                  </div>
                ) : (
                  <div style={styles.cardsGrid}>
                    {websites.map((site) => (
                      <div key={site._id} style={styles.card}>
                        <div style={styles.cardPreview}>
                          <span style={styles.cardIcon}>🌐</span>
                        </div>
                        <div style={styles.cardBody}>
                          <h3 style={styles.cardTitle}>{site.name || 'Untitled'}</h3>
                          <p style={styles.cardMeta}>{site.domain || 'No domain'}</p>
                          <div style={styles.cardActions}>
                            <Link href={`/studio/website/${site._id}/edit`} style={styles.cardButton}>
                              Edit
                            </Link>
                            <Link href={`/site/${site.slug || site._id}`} style={styles.cardButtonPrimary}>
                              View
                            </Link>
                          </div>
                        </div>
                        <span style={{
                          ...styles.statusBadge,
                          backgroundColor: site.published ? '#DCFCE7' : '#FEF3C7',
                          color: site.published ? '#166534' : '#92400E',
                        }}>
                          {site.published ? 'published' : 'draft'}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Blog Posts Tab */}
            {activeTab === 'blogs' && (
              <div>
                <div style={styles.contentHeader}>
                  <h2 style={styles.contentTitle}>Your Blog Posts</h2>
                  <Link href="/studio/ai-writer" style={styles.newButton}>
                    + New Post
                  </Link>
                </div>
                
                {loading ? (
                  <div style={styles.loading}>Loading...</div>
                ) : blogs.length === 0 ? (
                  <div style={styles.emptyState}>
                    <span style={styles.emptyIcon}>📝</span>
                    <h3 style={styles.emptyTitle}>No blog posts yet</h3>
                    <p style={styles.emptyDesc}>Write your first post with AI</p>
                    <Link href="/studio/ai-writer" style={styles.emptyButton}>
                      Write with AI
                    </Link>
                  </div>
                ) : (
                  <div style={styles.listContainer}>
                    {blogs.map((blog) => (
                      <div key={blog._id} style={styles.listItem}>
                        <div style={styles.listInfo}>
                          <h3 style={styles.listTitle}>{blog.title || 'Untitled'}</h3>
                          <p style={styles.listMeta}>
                            {new Date(blog.createdAt).toLocaleDateString()} • {blog.views || 0} views
                          </p>
                        </div>
                        <div style={styles.listActions}>
                          <Link href={`/blog/${blog.slug || blog._id}`} style={styles.listButton}>
                            View
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Forms Tab */}
            {activeTab === 'forms' && (
              <div>
                <div style={styles.contentHeader}>
                  <h2 style={styles.contentTitle}>Your Forms</h2>
                  <Link href="/studio/forms/new" style={styles.newButton}>
                    + New Form
                  </Link>
                </div>
                
                {loading ? (
                  <div style={styles.loading}>Loading...</div>
                ) : forms.length === 0 ? (
                  <div style={styles.emptyState}>
                    <span style={styles.emptyIcon}>📋</span>
                    <h3 style={styles.emptyTitle}>No forms yet</h3>
                    <p style={styles.emptyDesc}>Create surveys and collect responses</p>
                    <Link href="/studio/forms/new" style={styles.emptyButton}>
                      Create Form
                    </Link>
                  </div>
                ) : (
                  <div style={styles.listContainer}>
                    {forms.map((form) => (
                      <div key={form._id} style={styles.listItem}>
                        <div style={styles.listInfo}>
                          <h3 style={styles.listTitle}>{form.title || 'Untitled Form'}</h3>
                          <p style={styles.listMeta}>
                            {form.responses?.length || 0} responses
                          </p>
                        </div>
                        <div style={styles.listActions}>
                          <Link href={`/studio/forms/${form._id}`} style={styles.listButton}>
                            Edit
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Vlogs Tab */}
            {activeTab === 'vlogs' && (
              <div>
                <div style={styles.contentHeader}>
                  <h2 style={styles.contentTitle}>Your Vlogs</h2>
                  <Link href="/studio/vlog/new" style={styles.newButton}>
                    + New Vlog
                  </Link>
                </div>
                
                {loading ? (
                  <div style={styles.loading}>Loading...</div>
                ) : vlogs.length === 0 ? (
                  <div style={styles.emptyState}>
                    <span style={styles.emptyIcon}>🎬</span>
                    <h3 style={styles.emptyTitle}>No vlogs yet</h3>
                    <p style={styles.emptyDesc}>Upload and share video content</p>
                    <Link href="/studio/vlog/new" style={styles.emptyButton}>
                      Create Vlog
                    </Link>
                  </div>
                ) : (
                  <div style={styles.cardsGrid}>
                    {vlogs.map((vlog) => (
                      <div key={vlog._id} style={styles.card}>
                        <div style={styles.cardPreview}>
                          {vlog.thumbnail ? (
                            <img src={vlog.thumbnail} alt="" style={styles.cardImage} />
                          ) : (
                            <span style={styles.cardIcon}>🎬</span>
                          )}
                        </div>
                        <div style={styles.cardBody}>
                          <h3 style={styles.cardTitle}>{vlog.title || 'Untitled'}</h3>
                          <p style={styles.cardMeta}>{vlog.views || 0} views</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Analytics Tab */}
            {activeTab === 'analytics' && (
              <div>
                <div style={styles.contentHeader}>
                  <h2 style={styles.contentTitle}>Analytics</h2>
                </div>
                
                <div style={styles.analyticsGrid}>
                  <div style={styles.analyticsCard}>
                    <span style={styles.analyticsValue}>{websites.length}</span>
                    <span style={styles.analyticsLabel}>Websites</span>
                  </div>
                  <div style={styles.analyticsCard}>
                    <span style={styles.analyticsValue}>{blogs.length}</span>
                    <span style={styles.analyticsLabel}>Blog Posts</span>
                  </div>
                  <div style={styles.analyticsCard}>
                    <span style={styles.analyticsValue}>{forms.length}</span>
                    <span style={styles.analyticsLabel}>Forms</span>
                  </div>
                  <div style={styles.analyticsCard}>
                    <span style={styles.analyticsValue}>{vlogs.length}</span>
                    <span style={styles.analyticsLabel}>Vlogs</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

// Facebook-style clean white design with CYBEV purple accents
const styles = {
  page: {
    minHeight: '100vh',
    backgroundColor: '#F0F2F5', // Facebook gray background
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
  title: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#1C1E21', // Facebook dark text
    margin: '0 0 8px 0',
  },
  subtitle: {
    fontSize: '15px',
    color: '#65676B', // Facebook secondary text
    margin: 0,
  },
  
  // Feature Cards
  featuresGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
    gap: '12px',
    marginBottom: '24px',
  },
  featureCard: {
    display: 'flex',
    flexDirection: 'column',
    padding: '16px',
    backgroundColor: '#FFFFFF',
    borderRadius: '8px',
    boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
    textDecoration: 'none',
    transition: 'box-shadow 0.2s, transform 0.2s',
    position: 'relative',
    cursor: 'pointer',
  },
  featureTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '12px',
  },
  featureIcon: {
    width: '48px',
    height: '48px',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureEmoji: {
    fontSize: '24px',
  },
  badge: {
    padding: '3px 8px',
    borderRadius: '4px',
    fontSize: '11px',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  featureLabel: {
    fontSize: '15px',
    fontWeight: '600',
    color: '#1C1E21',
    margin: '0 0 4px 0',
  },
  featureDesc: {
    fontSize: '13px',
    color: '#65676B',
    margin: 0,
    lineHeight: '1.4',
  },

  // Tabs
  tabsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: '8px 8px 0 0',
    boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
    marginBottom: '-1px',
  },
  tabs: {
    display: 'flex',
    gap: '0',
    padding: '0 16px',
    borderBottom: '1px solid #E4E6EB',
    overflowX: 'auto',
  },
  tab: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '16px 16px',
    background: 'none',
    border: 'none',
    borderBottom: '3px solid transparent',
    fontSize: '15px',
    fontWeight: '500',
    color: '#65676B',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    transition: 'color 0.2s',
    marginBottom: '-1px',
  },
  activeTab: {
    color: '#8B5CF6',
    borderBottomColor: '#8B5CF6',
  },
  tabCount: {
    padding: '2px 8px',
    borderRadius: '10px',
    fontSize: '13px',
    fontWeight: '600',
  },

  // Content
  content: {
    backgroundColor: '#FFFFFF',
    borderRadius: '0 0 8px 8px',
    boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
    padding: '20px',
    minHeight: '400px',
  },
  contentHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  contentTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#1C1E21',
    margin: 0,
  },
  newButton: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '10px 20px',
    backgroundColor: '#8B5CF6',
    color: '#FFFFFF',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '600',
    textDecoration: 'none',
    transition: 'background-color 0.2s',
  },
  loading: {
    textAlign: 'center',
    padding: '40px',
    color: '#65676B',
  },

  // Empty State
  emptyState: {
    textAlign: 'center',
    padding: '60px 20px',
    backgroundColor: '#F7F8FA',
    borderRadius: '8px',
    border: '1px dashed #CED0D4',
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
    display: 'inline-block',
    padding: '10px 24px',
    backgroundColor: '#8B5CF6',
    color: '#FFFFFF',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '600',
    textDecoration: 'none',
  },

  // Cards Grid
  cardsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '16px',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: '8px',
    border: '1px solid #E4E6EB',
    overflow: 'hidden',
    position: 'relative',
  },
  cardPreview: {
    height: '140px',
    backgroundColor: '#F0F2F5',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  cardIcon: {
    fontSize: '48px',
    opacity: 0.4,
  },
  cardImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  cardBody: {
    padding: '16px',
  },
  cardTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#1C1E21',
    margin: '0 0 4px 0',
  },
  cardMeta: {
    fontSize: '13px',
    color: '#65676B',
    margin: '0 0 12px 0',
  },
  cardActions: {
    display: 'flex',
    gap: '8px',
  },
  cardButton: {
    flex: 1,
    padding: '8px 16px',
    backgroundColor: '#E4E6EB',
    color: '#1C1E21',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '600',
    textDecoration: 'none',
    textAlign: 'center',
  },
  cardButtonPrimary: {
    flex: 1,
    padding: '8px 16px',
    backgroundColor: '#8B5CF6',
    color: '#FFFFFF',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '600',
    textDecoration: 'none',
    textAlign: 'center',
  },
  statusBadge: {
    position: 'absolute',
    top: '12px',
    right: '12px',
    padding: '4px 10px',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: '600',
  },

  // List
  listContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  listItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px',
    backgroundColor: '#F7F8FA',
    borderRadius: '8px',
    border: '1px solid #E4E6EB',
  },
  listInfo: {
    flex: 1,
  },
  listTitle: {
    fontSize: '15px',
    fontWeight: '600',
    color: '#1C1E21',
    margin: '0 0 4px 0',
  },
  listMeta: {
    fontSize: '13px',
    color: '#65676B',
    margin: 0,
  },
  listActions: {
    display: 'flex',
    gap: '8px',
  },
  listButton: {
    padding: '8px 16px',
    backgroundColor: '#E4E6EB',
    color: '#1C1E21',
    borderRadius: '6px',
    fontSize: '13px',
    fontWeight: '600',
    textDecoration: 'none',
  },

  // Analytics
  analyticsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px',
  },
  analyticsCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '32px 24px',
    backgroundColor: '#F7F8FA',
    borderRadius: '8px',
    border: '1px solid #E4E6EB',
  },
  analyticsValue: {
    fontSize: '36px',
    fontWeight: '700',
    color: '#8B5CF6',
  },
  analyticsLabel: {
    fontSize: '14px',
    color: '#65676B',
    marginTop: '8px',
  },
};
