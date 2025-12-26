import { useState } from 'react';
import { Share2, Twitter, Facebook, Linkedin, Link as LinkIcon, Check } from 'lucide-react';
import { toast } from 'react-toastify';
import { blogAPI } from '../lib/api';

export default function SocialShare({ 
  url, 
  title, 
  description,
  blogId,
  hashtags = ['CYBEV', 'blogging'],
  compact = false 
}) {
  const [copied, setCopied] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedTitle = encodeURIComponent(title || '');
  const encodedDescription = encodeURIComponent(description || '');
  const encodedHashtags = hashtags.join(',');

  const socialLinks = {
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}&hashtags=${encodedHashtags}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success('Link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);

      // Track share on backend (best-effort)
      if (blogId) {
        blogAPI.share(blogId).catch(() => {});
      }
    } catch (error) {
      toast.error('Failed to copy link');
    }
  };

  const handleShare = async (platform) => {
    // Track share event (for analytics)
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'share', {
        method: platform,
        content_type: 'blog_post',
        item_id: shareUrl
      });
    }

    if (platform === 'copy') {
      copyToClipboard();
    } else {
      window.open(socialLinks[platform], '_blank', 'width=600,height=400');

      // Track share on backend (best-effort)
      if (blogId) {
        blogAPI.share(blogId).catch(() => {});
      }
    }
    
    setShowMenu(false);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: description,
          url: shareUrl
        });
        toast.success('Shared successfully!');

        // Track share on backend (best-effort)
        if (blogId) {
          blogAPI.share(blogId).catch(() => {});
        }
      } catch (error) {
        if (error.name !== 'AbortError') {
          setShowMenu(true);
        }
      }
    } else {
      setShowMenu(true);
    }
  };

  if (compact) {
    return (
      <div className="relative">
        <button
          onClick={handleNativeShare}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-all"
        >
          <Share2 className="w-4 h-4" />
          <span className="font-medium">Share</span>
        </button>

        {showMenu && (
          <>
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setShowMenu(false)}
            />
            <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-50 overflow-hidden">
              <button
                onClick={() => handleShare('twitter')}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
              >
                <Twitter className="w-5 h-5 text-blue-400" />
                <span className="text-gray-700 font-medium">Twitter</span>
              </button>
              
              <button
                onClick={() => handleShare('facebook')}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
              >
                <Facebook className="w-5 h-5 text-blue-600" />
                <span className="text-gray-700 font-medium">Facebook</span>
              </button>
              
              <button
                onClick={() => handleShare('linkedin')}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
              >
                <Linkedin className="w-5 h-5 text-blue-700" />
                <span className="text-gray-700 font-medium">LinkedIn</span>
              </button>
              
              <button
                onClick={() => handleShare('copy')}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left border-t border-gray-100"
              >
                {copied ? (
                  <Check className="w-5 h-5 text-green-600" />
                ) : (
                  <LinkIcon className="w-5 h-5 text-gray-600" />
                )}
                <span className="text-gray-700 font-medium">
                  {copied ? 'Copied!' : 'Copy Link'}
                </span>
              </button>
            </div>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-gray-900">Share this post</h3>
      
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => handleShare('twitter')}
          className="flex items-center gap-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-all border border-blue-200"
        >
          <Twitter className="w-4 h-4" />
          <span className="font-medium">Twitter</span>
        </button>

        <button
          onClick={() => handleShare('facebook')}
          className="flex items-center gap-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-all border border-blue-200"
        >
          <Facebook className="w-4 h-4" />
          <span className="font-medium">Facebook</span>
        </button>

        <button
          onClick={() => handleShare('linkedin')}
          className="flex items-center gap-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-800 rounded-lg transition-all border border-blue-200"
        >
          <Linkedin className="w-4 h-4" />
          <span className="font-medium">LinkedIn</span>
        </button>

        <button
          onClick={copyToClipboard}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-all border border-gray-300"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-green-600" />
              <span className="font-medium text-green-600">Copied!</span>
            </>
          ) : (
            <>
              <LinkIcon className="w-4 h-4" />
              <span className="font-medium">Copy Link</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
