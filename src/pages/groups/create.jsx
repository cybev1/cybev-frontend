// ============================================
// FILE: src/pages/groups/create.jsx
// Create New Group Page
// ============================================

import { useState, useRef } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import AppLayout from '@/components/Layout/AppLayout';
import {
  ArrowLeft,
  Users,
  Globe,
  Lock,
  Eye,
  Image,
  Plus,
  X,
  Loader2,
  Info,
  Camera
} from 'lucide-react';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.cybev.io';

const CATEGORIES = [
  { id: 'general', name: 'General', icon: '💬' },
  { id: 'technology', name: 'Technology', icon: '💻' },
  { id: 'business', name: 'Business', icon: '💼' },
  { id: 'entertainment', name: 'Entertainment', icon: '🎬' },
  { id: 'sports', name: 'Sports', icon: '⚽' },
  { id: 'gaming', name: 'Gaming', icon: '🎮' },
  { id: 'music', name: 'Music', icon: '🎵' },
  { id: 'art', name: 'Art & Design', icon: '🎨' },
  { id: 'education', name: 'Education', icon: '📚' },
  { id: 'health', name: 'Health & Fitness', icon: '💪' },
  { id: 'lifestyle', name: 'Lifestyle', icon: '🌟' },
  { id: 'news', name: 'News', icon: '📰' },
  { id: 'science', name: 'Science', icon: '🔬' },
  { id: 'travel', name: 'Travel', icon: '✈️' },
  { id: 'food', name: 'Food & Cooking', icon: '🍳' },
  { id: 'fashion', name: 'Fashion', icon: '👗' },
  { id: 'religion', name: 'Faith & Spirituality', icon: '🙏' },
  { id: 'parenting', name: 'Parenting', icon: '👨‍👩‍👧' },
  { id: 'pets', name: 'Pets', icon: '🐾' },
  { id: 'photography', name: 'Photography', icon: '📷' },
  { id: 'other', name: 'Other', icon: '📌' }
];

const PRIVACY_OPTIONS = [
  {
    id: 'public',
    name: 'Public',
    icon: Globe,
    description: 'Anyone can see who is in the group and what they post.'
  },
  {
    id: 'private',
    name: 'Private',
    icon: Lock,
    description: 'Only members can see who is in the group and what they post. Users must request to join.'
  },
  {
    id: 'secret',
    name: 'Secret',
    icon: Eye,
    description: 'Only members can find this group and see posts. Invite only.'
  }
];

export default function CreateGroupPage() {
  const router = useRouter();
  const coverInputRef = useRef(null);
  const avatarInputRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    description: '',
    privacy: 'public',
    category: 'general',
    tags: [],
    rules: [],
    coverImage: '',
    avatar: ''
  });
  const [tagInput, setTagInput] = useState('');
  const [ruleInput, setRuleInput] = useState({ title: '', description: '' });
  const [coverPreview, setCoverPreview] = useState('');
  const [avatarPreview, setAvatarPreview] = useState('');

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const addTag = () => {
    const tag = tagInput.trim().toLowerCase();
    if (tag && !form.tags.includes(tag) && form.tags.length < 10) {
      setForm(prev => ({ ...prev, tags: [...prev.tags, tag] }));
      setTagInput('');
    }
  };

  const removeTag = (tag) => {
    setForm(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }));
  };

  const addRule = () => {
    if (ruleInput.title.trim() && form.rules.length < 10) {
      setForm(prev => ({
        ...prev,
        rules: [...prev.rules, { ...ruleInput }]
      }));
      setRuleInput({ title: '', description: '' });
    }
  };

  const removeRule = (index) => {
    setForm(prev => ({
      ...prev,
      rules: prev.rules.filter((_, i) => i !== index)
    }));
  };

  const handleImageUpload = async (file, type) => {
    // For now, just create preview
    // TODO: Upload to Cloudinary
    const reader = new FileReader();
    reader.onload = (e) => {
      if (type === 'cover') {
        setCoverPreview(e.target.result);
        handleChange('coverImage', e.target.result);
      } else {
        setAvatarPreview(e.target.result);
        handleChange('avatar', e.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim()) {
      alert('Please enter a group name');
      return;
    }

    if (form.name.trim().length < 3) {
      alert('Group name must be at least 3 characters');
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
      const res = await axios.post(`${API_URL}/api/groups`, form, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.ok) {
        router.push(`/groups/${res.data.group.slug || res.data.group._id}`);
      }
    } catch (err) {
      console.error('Create group error:', err);
      alert(err.response?.data?.error || 'Failed to create group');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <Head>
        <title>Create Group - CYBEV</title>
      </Head>

      <div className="max-w-3xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-white/10 rounded-lg text-gray-900"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Create a Group</h1>
            <p className="text-gray-500">Build a community around your interests</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Cover Image */}
          <div className="bg-white/5 rounded-2xl border border-gray-200 overflow-hidden">
            <div
              onClick={() => coverInputRef.current?.click()}
              className="h-40 bg-gradient-to-r from-purple-600/50 to-pink-600/50 relative cursor-pointer hover:opacity-90 transition-opacity"
            >
              {coverPreview ? (
                <img src={coverPreview} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <Camera className="w-10 h-10 text-white/50 mx-auto mb-2" />
                    <p className="text-white/70 text-sm">Add cover photo</p>
                  </div>
                </div>
              )}
              {coverPreview && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setCoverPreview('');
                    handleChange('coverImage', '');
                  }}
                  className="absolute top-2 right-2 p-2 bg-gray-900/50 rounded-full text-gray-900 hover:bg-gray-900/70"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <input
              ref={coverInputRef}
              type="file"
              accept="image/*"
              onChange={(e) => e.target.files[0] && handleImageUpload(e.target.files[0], 'cover')}
              className="hidden"
            />

            {/* Avatar & Name */}
            <div className="p-6">
              <div className="flex items-start gap-4 -mt-16 mb-4">
                <div
                  onClick={() => avatarInputRef.current?.click()}
                  className="w-24 h-24 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 border-4 border-gray-900 flex items-center justify-center overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                >
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <Users className="w-10 h-10 text-white/70" />
                  )}
                </div>
                <input
                  ref={avatarInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => e.target.files[0] && handleImageUpload(e.target.files[0], 'avatar')}
                  className="hidden"
                />
              </div>

              <div>
                <label className="block text-gray-900 font-medium mb-2">Group Name *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  placeholder="Enter group name..."
                  maxLength={100}
                  className="w-full px-4 py-3 bg-white/5 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:border-purple-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white/5 rounded-2xl border border-gray-200 p-6">
            <label className="block text-gray-900 font-medium mb-2">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="What is this group about?"
              rows={4}
              maxLength={5000}
              className="w-full px-4 py-3 bg-white/5 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:border-purple-500 focus:outline-none resize-none"
            />
          </div>

          {/* Privacy */}
          <div className="bg-white/5 rounded-2xl border border-gray-200 p-6">
            <label className="block text-gray-900 font-medium mb-4">Privacy</label>
            <div className="space-y-3">
              {PRIVACY_OPTIONS.map(option => (
                <label
                  key={option.id}
                  className={`flex items-start gap-4 p-4 rounded-xl cursor-pointer transition-colors ${
                    form.privacy === option.id
                      ? 'bg-purple-600/20 border border-purple-500'
                      : 'bg-white/5 border border-transparent hover:bg-white/10'
                  }`}
                >
                  <input
                    type="radio"
                    name="privacy"
                    value={option.id}
                    checked={form.privacy === option.id}
                    onChange={() => handleChange('privacy', option.id)}
                    className="hidden"
                  />
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    form.privacy === option.id ? 'bg-purple-600' : 'bg-white/10'
                  }`}>
                    <option.icon className="w-5 h-5 text-gray-900" />
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-900 font-medium">{option.name}</p>
                    <p className="text-gray-500 text-sm">{option.description}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Category */}
          <div className="bg-white/5 rounded-2xl border border-gray-200 p-6">
            <label className="block text-gray-900 font-medium mb-4">Category</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => handleChange('category', cat.id)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-xl transition-colors ${
                    form.category === cat.id
                      ? 'bg-purple-600 text-white'
                      : 'bg-white/5 text-gray-500 hover:bg-white/10'
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span className="text-sm">{cat.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div className="bg-white/5 rounded-2xl border border-gray-200 p-6">
            <label className="block text-gray-900 font-medium mb-2">Tags</label>
            <p className="text-gray-500 text-sm mb-4">Add up to 10 tags to help people discover your group</p>
            
            {form.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {form.tags.map(tag => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-purple-500/20 text-purple-600 rounded-full text-sm flex items-center gap-2"
                  >
                    #{tag}
                    <button type="button" onClick={() => removeTag(tag)}>
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}

            <div className="flex gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                placeholder="Add a tag..."
                maxLength={30}
                className="flex-1 px-4 py-2 bg-white/5 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:border-purple-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={addTag}
                className="px-4 py-2 bg-purple-600 text-gray-900 rounded-lg hover:bg-purple-700"
              >
                Add
              </button>
            </div>
          </div>

          {/* Rules */}
          <div className="bg-white/5 rounded-2xl border border-gray-200 p-6">
            <label className="block text-gray-900 font-medium mb-2">Group Rules</label>
            <p className="text-gray-500 text-sm mb-4">Set rules to help members know what's expected</p>

            {form.rules.length > 0 && (
              <div className="space-y-2 mb-4">
                {form.rules.map((rule, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 bg-white/5 rounded-lg">
                    <span className="text-purple-600 font-bold">{i + 1}.</span>
                    <div className="flex-1">
                      <p className="text-gray-900">{rule.title}</p>
                      {rule.description && (
                        <p className="text-gray-500 text-sm">{rule.description}</p>
                      )}
                    </div>
                    <button type="button" onClick={() => removeRule(i)} className="text-red-400 hover:text-red-300">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="space-y-2">
              <input
                type="text"
                value={ruleInput.title}
                onChange={(e) => setRuleInput(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Rule title (e.g., Be respectful)"
                maxLength={100}
                className="w-full px-4 py-2 bg-white/5 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:border-purple-500 focus:outline-none"
              />
              <input
                type="text"
                value={ruleInput.description}
                onChange={(e) => setRuleInput(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Rule description (optional)"
                maxLength={500}
                className="w-full px-4 py-2 bg-white/5 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:border-purple-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={addRule}
                disabled={!ruleInput.title.trim()}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 text-gray-900 rounded-lg hover:bg-white/20 disabled:opacity-50"
              >
                <Plus className="w-4 h-4" />
                Add Rule
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading || !form.name.trim()}
            className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-gray-900 rounded-xl font-bold text-lg hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Creating Group...
              </>
            ) : (
              <>
                <Users className="w-5 h-5" />
                Create Group
              </>
            )}
          </button>
        </form>
      </div>
    </AppLayout>
  );
}
