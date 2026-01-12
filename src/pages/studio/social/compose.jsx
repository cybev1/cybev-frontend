// ============================================
// FILE: src/pages/studio/social/compose.jsx
// PURPOSE: Create/Schedule Social Media Posts
// Multi-platform posting with AI assistance
// ============================================

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import {
  ArrowLeft, Send, Calendar, Clock, Image as ImageIcon, Video,
  Link as LinkIcon, Smile, Hash, AtSign, MapPin, X, Plus,
  Facebook, Instagram, Twitter, Linkedin, Youtube, Check,
  Sparkles, RefreshCw, Eye, ChevronDown, AlertCircle
} from 'lucide-react';
import AppLayout from '@/components/Layout/AppLayout';

const PLATFORMS = [
  { id: 'facebook', name: 'Facebook', icon: Facebook, color: '#1877F2', maxLength: 63206 },
  { id: 'instagram', name: 'Instagram', icon: Instagram, color: '#E4405F', maxLength: 2200 },
  { id: 'twitter', name: 'X', icon: Twitter, color: '#000000', maxLength: 280 },
  { id: 'linkedin', name: 'LinkedIn', icon: Linkedin, color: '#0A66C2', maxLength: 3000 },
  { id: 'youtube', name: 'YouTube', icon: Youtube, color: '#FF0000', maxLength: 5000 }
];

export default function ComposePost() {
  const router = useRouter();
  const textareaRef = useRef(null);
  
  const [accounts, setAccounts] = useState([]);
  const [selectedAccounts, setSelectedAccounts] = useState([]);
  const [content, setContent] = useState('');
  const [media, setMedia] = useState([]);
  const [link, setLink] = useState('');
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [scheduleType, setScheduleType] = useState('now');
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('09:00');
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const API = process.env.NEXT_PUBLIC_API_URL || '';

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API}/api/social/accounts`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.ok) {
        setAccounts(data.accounts || []);
        // Auto-select first account
        if (data.accounts?.length > 0) {
          setSelectedAccounts([data.accounts[0]._id]);
        }
      }
    } catch (err) {
      console.error('Error fetching accounts:', err);
    }
  };

  const toggleAccount = (accountId) => {
    setSelectedAccounts(prev => 
      prev.includes(accountId)
        ? prev.filter(id => id !== accountId)
        : [...prev, accountId]
    );
  };

  const handleMediaUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    // For now, create object URLs (in production, upload to cloud)
    const newMedia = files.map(file => ({
      url: URL.createObjectURL(file),
      type: file.type.startsWith('video/') ? 'video' : 'image',
      file
    }));

    setMedia(prev => [...prev, ...newMedia].slice(0, 10)); // Max 10 media items
  };

  const removeMedia = (index) => {
    setMedia(prev => prev.filter((_, i) => i !== index));
  };

  const generateWithAI = async () => {
    setGenerating(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API}/api/ai/generate-social`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          platforms: selectedAccounts.map(id => 
            accounts.find(a => a._id === id)?.platform
          ).filter(Boolean),
          context: content || 'engaging social media post'
        })
      });
      
      const data = await res.json();
      if (data.ok && data.generated) {
        setContent(data.generated);
      }
    } catch (err) {
      console.error('AI generation error:', err);
      // Fallback content
      setContent(content + '\n\n✨ [AI-generated content would appear here]');
    } finally {
      setGenerating(false);
    }
  };

  const insertEmoji = (emoji) => {
    const textarea = textareaRef.current;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newContent = content.slice(0, start) + emoji + content.slice(end);
      setContent(newContent);
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + emoji.length, start + emoji.length);
      }, 0);
    }
    setShowEmojiPicker(false);
  };

  const handleSubmit = async () => {
    if (!content.trim() || selectedAccounts.length === 0) {
      alert('Please write content and select at least one account');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      // Upload media first if any
      let mediaUrls = [];
      if (media.length > 0) {
        // TODO: Upload to Cloudinary/S3
        mediaUrls = media.map(m => ({ url: m.url, type: m.type }));
      }

      const endpoint = scheduleType === 'now' 
        ? `${API}/api/social/posts/publish-now`
        : `${API}/api/social/posts/schedule`;

      const body = {
        accounts: selectedAccounts,
        platforms: selectedAccounts.map(id => 
          accounts.find(a => a._id === id)?.platform
        ).filter(Boolean),
        content: {
          text: content,
          media: mediaUrls,
          link: link || undefined
        }
      };

      if (scheduleType === 'scheduled') {
        body.scheduledFor = new Date(`${scheduleDate}T${scheduleTime}`).toISOString();
      }

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });

      const data = await res.json();
      if (data.ok) {
        router.push('/studio/social?posted=true');
      } else {
        alert(data.error || 'Failed to create post');
      }
    } catch (err) {
      console.error('Post error:', err);
      alert('Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  const getCharacterLimit = () => {
    const selectedPlatforms = selectedAccounts.map(id => 
      accounts.find(a => a._id === id)?.platform
    ).filter(Boolean);
    
    if (selectedPlatforms.length === 0) return 5000;
    
    return Math.min(...selectedPlatforms.map(p => 
      PLATFORMS.find(pl => pl.id === p)?.maxLength || 5000
    ));
  };

  const characterLimit = getCharacterLimit();
  const isOverLimit = content.length > characterLimit;

  return (
    <AppLayout>
      <Head>
        <title>Create Post | CYBEV Social</title>
      </Head>

      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-100 dark:hover:bg-white rounded-lg"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-bold text-gray-900 dark:text-gray-900">
              Create Post
            </h1>
          </div>
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 dark:hover:bg-white rounded-lg"
          >
            <Eye className="w-4 h-4" />
            Preview
          </button>
        </div>

        {/* Account Selection */}
        <div className="bg-white dark:bg-white rounded-2xl p-4 border border-gray-200 dark:border-gray-200 mb-4">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-600 mb-3">
            Post to:
          </p>
          {accounts.length === 0 ? (
            <Link
              href="/studio/social/accounts/connect"
              className="flex items-center gap-2 text-purple-600 text-sm"
            >
              <Plus className="w-4 h-4" />
              Connect an account first
            </Link>
          ) : (
            <div className="flex flex-wrap gap-2">
              {accounts.map(account => {
                const platform = PLATFORMS.find(p => p.id === account.platform);
                const isSelected = selectedAccounts.includes(account._id);
                return (
                  <button
                    key={account._id}
                    onClick={() => toggleAccount(account._id)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition ${
                      isSelected
                        ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/20'
                        : 'border-gray-200 dark:border-gray-200 hover:border-purple-300'
                    }`}
                  >
                    {platform && (
                      <platform.icon 
                        className="w-4 h-4" 
                        style={{ color: isSelected ? platform.color : undefined }}
                      />
                    )}
                    <span className="text-sm">{account.accountName}</span>
                    {isSelected && <Check className="w-4 h-4 text-purple-600" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Content Editor */}
        <div className="bg-white dark:bg-white rounded-2xl border border-gray-200 dark:border-gray-200 mb-4">
          <div className="p-4">
            <textarea
              ref={textareaRef}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What's on your mind? Write your post here..."
              rows={6}
              className="w-full bg-transparent border-0 focus:ring-0 resize-none text-gray-900 dark:text-gray-900 placeholder-gray-400"
            />

            {/* Media Preview */}
            {media.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {media.map((item, index) => (
                  <div key={index} className="relative">
                    {item.type === 'video' ? (
                      <video
                        src={item.url}
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                    ) : (
                      <img
                        src={item.url}
                        alt=""
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                    )}
                    <button
                      onClick={() => removeMedia(index)}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-gray-900 rounded-full flex items-center justify-center"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Link Preview */}
            {showLinkInput && (
              <div className="mt-4 flex gap-2">
                <input
                  type="url"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  placeholder="https://..."
                  className="flex-1 px-3 py-2 border border-gray-200 dark:border-gray-200 rounded-lg text-sm bg-white dark:bg-white"
                />
                <button
                  onClick={() => { setShowLinkInput(false); setLink(''); }}
                  className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>

          {/* Toolbar */}
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 dark:border-gray-200">
            <div className="flex items-center gap-1">
              <label className="p-2 hover:bg-gray-100 dark:hover:bg-gray-100 rounded-lg cursor-pointer">
                <ImageIcon className="w-5 h-5 text-gray-500" />
                <input
                  type="file"
                  accept="image/*,video/*"
                  multiple
                  onChange={handleMediaUpload}
                  className="hidden"
                />
              </label>
              <button
                onClick={() => setShowLinkInput(true)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-100 rounded-lg"
              >
                <LinkIcon className="w-5 h-5 text-gray-500" />
              </button>
              <div className="relative">
                <button
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-100 rounded-lg"
                >
                  <Smile className="w-5 h-5 text-gray-500" />
                </button>
                {showEmojiPicker && (
                  <div className="absolute bottom-full left-0 mb-2 bg-white dark:bg-white rounded-lg shadow-lg border border-gray-200 dark:border-gray-200 p-2 grid grid-cols-8 gap-1 z-10">
                    {['😀', '😂', '❤️', '👍', '🔥', '✨', '🎉', '💪', '🙏', '👏', '💯', '⭐', '🚀', '💡', '📢', '🎯'].map(emoji => (
                      <button
                        key={emoji}
                        onClick={() => insertEmoji(emoji)}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-100 rounded text-xl"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <button
                onClick={generateWithAI}
                disabled={generating}
                className="flex items-center gap-1 px-3 py-2 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg text-sm"
              >
                <Sparkles className="w-4 h-4" />
                {generating ? 'Generating...' : 'AI Write'}
              </button>
            </div>
            <div className={`text-sm ${isOverLimit ? 'text-red-500' : 'text-gray-500'}`}>
              {content.length}/{characterLimit}
            </div>
          </div>
        </div>

        {/* Schedule Options */}
        <div className="bg-white dark:bg-white rounded-2xl p-4 border border-gray-200 dark:border-gray-200 mb-6">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-600 mb-3">
            When to post:
          </p>
          <div className="flex gap-3 mb-4">
            <button
              onClick={() => setScheduleType('now')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border transition ${
                scheduleType === 'now'
                  ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/20 text-purple-600'
                  : 'border-gray-200 dark:border-gray-200'
              }`}
            >
              <Send className="w-4 h-4" />
              Post Now
            </button>
            <button
              onClick={() => setScheduleType('scheduled')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border transition ${
                scheduleType === 'scheduled'
                  ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/20 text-purple-600'
                  : 'border-gray-200 dark:border-gray-200'
              }`}
            >
              <Calendar className="w-4 h-4" />
              Schedule
            </button>
          </div>

          {scheduleType === 'scheduled' && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Date</label>
                <input
                  type="date"
                  value={scheduleDate}
                  onChange={(e) => setScheduleDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-200 rounded-lg text-sm bg-white dark:bg-white"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Time</label>
                <input
                  type="time"
                  value={scheduleTime}
                  onChange={(e) => setScheduleTime(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-200 rounded-lg text-sm bg-white dark:bg-white"
                />
              </div>
            </div>
          )}
        </div>

        {/* Warning if over limit */}
        {isOverLimit && (
          <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-xl mb-4 text-sm">
            <AlertCircle className="w-5 h-5" />
            <span>Content exceeds character limit for selected platforms</span>
          </div>
        )}

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={loading || !content.trim() || selectedAccounts.length === 0 || isOverLimit}
          className="w-full py-4 bg-purple-600 text-gray-900 rounded-xl font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <RefreshCw className="w-5 h-5 animate-spin" />
              {scheduleType === 'now' ? 'Posting...' : 'Scheduling...'}
            </>
          ) : (
            <>
              {scheduleType === 'now' ? <Send className="w-5 h-5" /> : <Calendar className="w-5 h-5" />}
              {scheduleType === 'now' ? 'Post Now' : 'Schedule Post'}
            </>
          )}
        </button>
      </div>
    </AppLayout>
  );
}
