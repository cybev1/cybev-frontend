// ============================================
// FILE: src/pages/onboarding.jsx
// CYBEV Onboarding - Clean White Design v7.0
// ============================================

import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import api from '@/lib/api';
import { toast } from 'react-toastify';
import { ArrowRight, ArrowLeft, Camera, Check, Loader2, Sparkles, Globe, PenTool, Video, Users, Heart } from 'lucide-react';

const INTERESTS = [
  { id: 'blogging', label: 'Blogging', icon: PenTool, color: '#3b82f6' },
  { id: 'video', label: 'Video Creation', icon: Video, color: '#ef4444' },
  { id: 'church', label: 'Church & Ministry', icon: Heart, color: '#f59e0b' },
  { id: 'business', label: 'Business', icon: Globe, color: '#10b981' },
  { id: 'community', label: 'Community Building', icon: Users, color: '#8b5cf6' },
  { id: 'tech', label: 'Technology', icon: Sparkles, color: '#ec4899' },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({ username: '', bio: '', interests: [], profilePicture: null });

  const handleComplete = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await api.put('/api/users/update-profile', { ...data, hasCompletedOnboarding: true }, { headers: { Authorization: `Bearer ${token}` } });
      toast.success('Welcome to CYBEV!');
      router.push('/feed');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save');
    } finally {
      setLoading(false);
    }
  };

  const toggleInterest = (id) => {
    setData({ ...data, interests: data.interests.includes(id) ? data.interests.filter(i => i !== id) : [...data.interests, id] });
  };

  return (
    <>
      <Head><title>Welcome | CYBEV</title></Head>
      <div className="min-h-screen bg-gray-100 flex flex-col">
        {/* Progress Bar */}
        <div className="h-1 bg-gray-200">
          <div className="h-full bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-300" style={{ width: `${(step / 3) * 100}%` }} />
        </div>

        <div className="flex-1 flex items-center justify-center p-4">
          <div className="w-full max-w-md">
            {/* Step 1: Username & Bio */}
            {step === 1 && (
              <div className="bg-white rounded-2xl shadow-xl p-8 animate-fade-in">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="w-8 h-8 text-white" />
                  </div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome to CYBEV!</h1>
                  <p className="text-gray-500">Let's set up your profile</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Choose a username</label>
                    <input type="text" value={data.username} onChange={e => setData({ ...data, username: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '') })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
                      placeholder="yourname" maxLength={20} />
                    <p className="text-xs text-gray-500 mt-1">cybev.io/{data.username || 'yourname'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tell us about yourself</label>
                    <textarea value={data.bio} onChange={e => setData({ ...data, bio: e.target.value })} rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 resize-none"
                      placeholder="A short bio..." maxLength={160} />
                  </div>
                </div>

                <button onClick={() => setStep(2)} disabled={!data.username}
                  className="w-full mt-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg">
                  Continue <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            )}

            {/* Step 2: Interests */}
            {step === 2 && (
              <div className="bg-white rounded-2xl shadow-xl p-8 animate-fade-in">
                <div className="text-center mb-8">
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">What interests you?</h1>
                  <p className="text-gray-500">Select at least one to personalize your feed</p>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-6">
                  {INTERESTS.map(interest => (
                    <button key={interest.id} onClick={() => toggleInterest(interest.id)}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        data.interests.includes(interest.id) ? 'border-purple-600 bg-purple-50' : 'border-gray-200 hover:border-gray-300'
                      }`}>
                      <interest.icon className="w-6 h-6 mx-auto mb-2" style={{ color: interest.color }} />
                      <p className="text-sm font-medium text-gray-900">{interest.label}</p>
                      {data.interests.includes(interest.id) && (
                        <div className="absolute top-2 right-2 w-5 h-5 bg-purple-600 rounded-full flex items-center justify-center">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>

                <div className="flex gap-3">
                  <button onClick={() => setStep(1)} className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 flex items-center justify-center gap-2">
                    <ArrowLeft className="w-5 h-5" /> Back
                  </button>
                  <button onClick={() => setStep(3)} disabled={data.interests.length === 0}
                    className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg">
                    Continue <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Profile Photo */}
            {step === 3 && (
              <div className="bg-white rounded-2xl shadow-xl p-8 animate-fade-in">
                <div className="text-center mb-8">
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">Add a profile photo</h1>
                  <p className="text-gray-500">Help others recognize you</p>
                </div>

                <div className="flex justify-center mb-8">
                  <div className="relative">
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-4xl font-bold overflow-hidden">
                      {data.profilePicture ? (
                        <img src={data.profilePicture} alt="" className="w-full h-full object-cover" />
                      ) : (
                        data.username?.[0]?.toUpperCase() || '?'
                      )}
                    </div>
                    <label className="absolute bottom-0 right-0 p-3 bg-purple-600 rounded-full cursor-pointer hover:bg-purple-700 transition-colors shadow-lg">
                      <Camera className="w-5 h-5 text-white" />
                      <input type="file" accept="image/*" className="hidden" onChange={e => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = () => setData({ ...data, profilePicture: reader.result });
                          reader.readAsDataURL(file);
                        }
                      }} />
                    </label>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button onClick={() => setStep(2)} className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 flex items-center justify-center gap-2">
                    <ArrowLeft className="w-5 h-5" /> Back
                  </button>
                  <button onClick={handleComplete} disabled={loading}
                    className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg">
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Get Started <Sparkles className="w-5 h-5" /></>}
                  </button>
                </div>

                <button onClick={handleComplete} className="w-full mt-4 text-gray-500 text-sm hover:underline">
                  Skip for now
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
