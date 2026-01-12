// ============================================
// FILE: src/pages/s/[subdomain].jsx
// Site Viewer - Renders user sites
// URL: cybev.io/s/subdomain
// VERSION: 1.0
// ============================================

import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import {
  Mail, Phone, MapPin, Twitter, Facebook, Instagram, Linkedin,
  ChevronRight, Play, ExternalLink, Check, Star, Zap, Shield,
  Heart, Users, BarChart, Clock, Calendar, ArrowRight, Menu, X
} from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.cybev.io';

// Icon mapping
const iconMap = {
  zap: Zap, shield: Shield, heart: Heart, users: Users, 'bar-chart': BarChart,
  'trending-up': BarChart, briefcase: Zap, truck: Zap, 'refresh-cw': Zap,
  lock: Shield, cloud: Zap, cpu: Zap, code: Zap, palette: Heart,
  megaphone: Zap, headphones: Heart, 'message-circle': Users, calendar: Calendar
};

// Block Renderers
function HeroBlock({ content, theme }) {
  return (
    <div 
      className="relative min-h-[70vh] flex items-center justify-center text-gray-900"
      style={{
        backgroundImage: content.backgroundImage 
          ? `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${content.backgroundImage})`
          : `linear-gradient(135deg, ${theme?.colors?.primary || '#7c3aed'}, ${theme?.colors?.secondary || '#ec4899'})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className={`max-w-4xl mx-auto px-6 text-${content.align || 'center'}`}>
        <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">{content.title}</h1>
        <p className="text-xl md:text-2xl opacity-90 mb-8 max-w-2xl mx-auto">{content.subtitle}</p>
        {content.buttonText && (
          <a href={content.buttonLink || '#'} className="inline-block px-8 py-4 bg-white text-gray-900 rounded-full font-semibold text-lg hover:bg-gray-100 transition shadow-lg">
            {content.buttonText}
            <ChevronRight className="inline ml-2 w-5 h-5" />
          </a>
        )}
      </div>
    </div>
  );
}

function FeaturesBlock({ content, theme }) {
  return (
    <div className="py-20 px-6 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        {content.title && (
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{content.title}</h2>
            {content.subtitle && <p className="text-xl text-gray-600">{content.subtitle}</p>}
          </div>
        )}
        <div className="grid md:grid-cols-3 gap-8">
          {content.items?.map((item, idx) => {
            const IconComponent = iconMap[item.icon] || Zap;
            return (
              <div key={idx} className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-lg transition text-center">
                <div 
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
                  style={{ backgroundColor: `${theme?.colors?.primary || '#7c3aed'}15` }}
                >
                  <IconComponent className="w-8 h-8" style={{ color: theme?.colors?.primary || '#7c3aed' }} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function TestimonialsBlock({ content, theme }) {
  return (
    <div className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        {content.title && (
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-16">{content.title}</h2>
        )}
        <div className="grid md:grid-cols-3 gap-8">
          {content.items?.map((item, idx) => (
            <div key={idx} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex gap-1 mb-4">
                {[1,2,3,4,5].map(i => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-700 text-lg mb-6 italic">"{item.quote}"</p>
              <div className="flex items-center gap-4">
                {item.avatar ? (
                  <img src={item.avatar} alt={item.name} className="w-12 h-12 rounded-full object-cover" />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="text-xl font-bold text-gray-500">{item.name?.[0]}</span>
                  </div>
                )}
                <div>
                  <p className="font-semibold text-gray-900">{item.name}</p>
                  <p className="text-sm text-gray-500">{item.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function CtaBlock({ content, theme }) {
  return (
    <div 
      className="py-20 px-6 text-gray-900"
      style={{ background: `linear-gradient(135deg, ${theme?.colors?.primary || '#7c3aed'}, ${theme?.colors?.secondary || '#ec4899'})` }}
    >
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">{content.title}</h2>
        <p className="text-xl opacity-90 mb-8">{content.description}</p>
        <a href={content.buttonLink || '#'} className="inline-block px-8 py-4 bg-white text-gray-900 rounded-full font-semibold text-lg hover:bg-gray-100 transition">
          {content.buttonText}
        </a>
      </div>
    </div>
  );
}

function ContactBlock({ content, theme }) {
  return (
    <div id="contact" className="py-20 px-6 bg-gray-50 text-gray-900">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">{content.title || 'Get in Touch'}</h2>
        <div className="grid md:grid-cols-3 gap-8 text-center">
          {content.email && (
            <div className="flex flex-col items-center">
              <div className="w-14 h-14 bg-white/10 rounded-full flex items-center justify-center mb-4">
                <Mail className="w-6 h-6" />
              </div>
              <p className="text-lg">{content.email}</p>
            </div>
          )}
          {content.phone && (
            <div className="flex flex-col items-center">
              <div className="w-14 h-14 bg-white/10 rounded-full flex items-center justify-center mb-4">
                <Phone className="w-6 h-6" />
              </div>
              <p className="text-lg">{content.phone}</p>
            </div>
          )}
          {content.address && (
            <div className="flex flex-col items-center">
              <div className="w-14 h-14 bg-white/10 rounded-full flex items-center justify-center mb-4">
                <MapPin className="w-6 h-6" />
              </div>
              <p className="text-lg">{content.address}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function FooterBlock({ content, theme }) {
  return (
    <footer className="py-12 px-6 bg-gray-50 text-gray-900 border-t border-gray-200">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-lg font-bold">{content.logo || content.copyright?.split('.')[0]}</div>
          <div className="flex gap-6">
            {content.links?.map((link, idx) => (
              <a key={idx} href={link.url} className="text-gray-500 hover:text-gray-900 transition">
                {link.label}
              </a>
            ))}
          </div>
          <div className="flex gap-4">
            {content.social?.twitter && <a href={content.social.twitter} className="text-gray-500 hover:text-gray-900"><Twitter className="w-5 h-5" /></a>}
            {content.social?.facebook && <a href={content.social.facebook} className="text-gray-500 hover:text-gray-900"><Facebook className="w-5 h-5" /></a>}
            {content.social?.instagram && <a href={content.social.instagram} className="text-gray-500 hover:text-gray-900"><Instagram className="w-5 h-5" /></a>}
            {content.social?.linkedin && <a href={content.social.linkedin} className="text-gray-500 hover:text-gray-900"><Linkedin className="w-5 h-5" /></a>}
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-200 text-center text-gray-500">
          <p>{content.copyright}</p>
          <p className="mt-2 text-sm">Powered by <a href="https://cybev.io" className="text-purple-600 hover:underline">CYBEV</a></p>
        </div>
      </div>
    </footer>
  );
}

function StatsBlock({ content, theme }) {
  return (
    <div 
      className="py-16 px-6 text-gray-900"
      style={{ background: `linear-gradient(135deg, ${theme?.colors?.primary || '#7c3aed'}, ${theme?.colors?.secondary || '#ec4899'})` }}
    >
      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        {content.items?.map((item, idx) => (
          <div key={idx}>
            <div className="text-4xl md:text-5xl font-bold mb-2">{item.value}</div>
            <div className="text-lg opacity-80">{item.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function GalleryBlock({ content, theme }) {
  return (
    <div className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        {content.title && (
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12">{content.title}</h2>
        )}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {content.images?.map((img, idx) => (
            <div key={idx} className="aspect-square rounded-xl overflow-hidden group cursor-pointer">
              <img 
                src={img.src || img} 
                alt={img.alt || `Gallery ${idx + 1}`} 
                className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PricingBlock({ content, theme }) {
  return (
    <div className="py-20 px-6 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{content.title}</h2>
          {content.subtitle && <p className="text-xl text-gray-600">{content.subtitle}</p>}
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {content.plans?.map((plan, idx) => (
            <div 
              key={idx} 
              className={`bg-white rounded-2xl p-8 ${plan.featured ? 'ring-2 shadow-xl scale-105' : 'shadow-sm'}`}
              style={plan.featured ? { ringColor: theme?.colors?.primary || '#7c3aed' } : {}}
            >
              {plan.featured && (
                <span 
                  className="inline-block px-3 py-1 text-xs font-semibold text-gray-900 rounded-full mb-4"
                  style={{ backgroundColor: theme?.colors?.primary || '#7c3aed' }}
                >
                  Most Popular
                </span>
              )}
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold">{plan.price}</span>
                <span className="text-gray-500">{plan.period}</span>
              </div>
              <ul className="space-y-3 mb-8">
                {plan.features?.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-green-500" />
                    <span className="text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>
              <button 
                className={`w-full py-3 rounded-lg font-semibold transition ${
                  plan.featured 
                    ? 'text-gray-900 hover:opacity-90' 
                    : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                }`}
                style={plan.featured ? { backgroundColor: theme?.colors?.primary || '#7c3aed' } : {}}
              >
                {plan.buttonText}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function NewsletterBlock({ content, theme }) {
  return (
    <div className="py-16 px-6 bg-gray-100">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">{content.title}</h2>
        <p className="text-gray-600 mb-6">{content.description}</p>
        <div className="flex gap-2 max-w-md mx-auto">
          <input 
            type="email" 
            placeholder={content.placeholder || 'Enter your email'}
            className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
          <button 
            className="px-6 py-3 text-gray-900 rounded-lg font-semibold hover:opacity-90 transition"
            style={{ backgroundColor: theme?.colors?.primary || '#7c3aed' }}
          >
            {content.buttonText || 'Subscribe'}
          </button>
        </div>
      </div>
    </div>
  );
}

function AboutBlock({ content, theme }) {
  return (
    <div className="py-20 px-6">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        {content.image && (
          <div className="rounded-2xl overflow-hidden">
            <img src={content.image} alt="About" className="w-full h-auto" />
          </div>
        )}
        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">{content.title}</h2>
          <p className="text-lg text-gray-600 leading-relaxed">{content.text}</p>
        </div>
      </div>
    </div>
  );
}

function ServicesBlock({ content, theme }) {
  return (
    <div className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-16">{content.title}</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {content.items?.map((item, idx) => {
            const IconComponent = iconMap[item.icon] || Zap;
            return (
              <div key={idx} className="p-6 rounded-xl bg-white shadow-sm hover:shadow-lg transition border border-gray-100">
                <IconComponent className="w-10 h-10 mb-4" style={{ color: theme?.colors?.primary || '#7c3aed' }} />
                <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function BlogPostsBlock({ content, theme }) {
  return (
    <div className="py-20 px-6 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12">{content.title}</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {content.posts?.map((post, idx) => (
            <div key={idx} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition">
              {post.image && (
                <img src={post.image} alt={post.title} className="w-full h-48 object-cover" />
              )}
              <div className="p-6">
                <p className="text-sm text-gray-500 mb-2">{post.date}</p>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{post.title}</h3>
                <p className="text-gray-600">{post.excerpt}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Main block renderer
function BlockRenderer({ block, theme }) {
  const { type, content } = block;
  
  switch (type) {
    case 'hero': return <HeroBlock content={content} theme={theme} />;
    case 'features': return <FeaturesBlock content={content} theme={theme} />;
    case 'testimonials': return <TestimonialsBlock content={content} theme={theme} />;
    case 'cta': return <CtaBlock content={content} theme={theme} />;
    case 'contact': return <ContactBlock content={content} theme={theme} />;
    case 'footer': return <FooterBlock content={content} theme={theme} />;
    case 'stats': return <StatsBlock content={content} theme={theme} />;
    case 'gallery': return <GalleryBlock content={content} theme={theme} />;
    case 'pricing': return <PricingBlock content={content} theme={theme} />;
    case 'newsletter': return <NewsletterBlock content={content} theme={theme} />;
    case 'about': return <AboutBlock content={content} theme={theme} />;
    case 'services': return <ServicesBlock content={content} theme={theme} />;
    case 'blog-posts': return <BlogPostsBlock content={content} theme={theme} />;
    default:
      console.log('Unknown block type:', type);
      return null;
  }
}

export default function SiteViewer() {
  const router = useRouter();
  const { subdomain } = router.query;
  
  const [site, setSite] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mobileMenu, setMobileMenu] = useState(false);

  useEffect(() => {
    if (subdomain) {
      fetchSite();
    }
  }, [subdomain]);

  const fetchSite = async () => {
    try {
      // Try public endpoint first
      let res = await fetch(`${API_URL}/api/sites/subdomain/${subdomain}`);
      let data = await res.json();
      
      // If not published, try authenticated endpoint
      if (!data.ok || !data.site) {
        const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
        if (token) {
          res = await fetch(`${API_URL}/api/sites/${subdomain}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          data = await res.json();
        }
      }
      
      if (data.ok && data.site) {
        setSite(data.site);
      } else {
        setError('Site not found');
      }
    } catch (err) {
      setError('Failed to load site');
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading site...</p>
        </div>
      </div>
    );
  }

  if (error || !site) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Site Not Found</h1>
          <p className="text-gray-600 mb-8">The site you're looking for doesn't exist or isn't published yet.</p>
          <a href="/" className="px-6 py-3 bg-purple-600 text-gray-900 rounded-lg font-semibold hover:bg-purple-700">
            Go Home
          </a>
        </div>
      </div>
    );
  }

  const theme = {
    colors: {
      primary: site.theme?.colors?.primary || '#7c3aed',
      secondary: site.theme?.colors?.secondary || '#ec4899'
    }
  };

  return (
    <>
      <Head>
        <title>{site.ogTitle || site.name}</title>
        <meta name="description" content={site.ogDescription || site.description} />
        {site.favicon && <link rel="icon" href={site.favicon} />}
        <meta property="og:title" content={site.ogTitle || site.name} />
        <meta property="og:description" content={site.ogDescription || site.description} />
        {site.ogImage && <meta property="og:image" content={site.ogImage} />}
      </Head>

      {/* Simple Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <a href="#" className="text-xl font-bold text-gray-900">{site.name}</a>
          <div className="hidden md:flex items-center gap-6">
            <a href="#" className="text-gray-600 hover:text-gray-900">Home</a>
            <a href="#contact" className="text-gray-600 hover:text-gray-900">Contact</a>
          </div>
          <button className="md:hidden" onClick={() => setMobileMenu(!mobileMenu)}>
            {mobileMenu ? <X /> : <Menu />}
          </button>
        </div>
        {mobileMenu && (
          <div className="md:hidden px-6 pb-4 space-y-2">
            <a href="#" className="block py-2 text-gray-600">Home</a>
            <a href="#contact" className="block py-2 text-gray-600">Contact</a>
          </div>
        )}
      </nav>

      {/* Page Content */}
      <main className="pt-16">
        {site.blocks?.map((block, idx) => (
          <BlockRenderer key={block.id || idx} block={block} theme={theme} />
        ))}
      </main>
    </>
  );
}
