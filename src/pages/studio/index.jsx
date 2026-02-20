// ============================================
// FILE: src/pages/studio/index.jsx
// CYBEV Creator Studio - Content & Church Management
// VERSION: 3.0 - Added Church Organization Create Buttons
// FIXES:
//   - Quick create buttons for Church, Fellowship, Cell, Bible Study
//   - Better organization of creation options
//   - All content creation tools easily accessible
// ============================================

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import {
  FileText, Image, Video, Radio, Globe, Wand2, 
  Layout, Calendar, BookOpen, Users, Settings,
  ChevronRight, Plus, Sparkles, Camera, Mic,
  Church, Home, BookOpenCheck, Users2, PlusCircle,
  BarChart2, FileImage, Youtube, Instagram, Palette
} from 'lucide-react';
import AppLayout from '@/components/Layout/AppLayout';

export default function StudioPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch {}
    }
  }, []);

  return (
    <AppLayout>
      <Head>
        <title>Creator Studio | CYBEV</title>
      </Head>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-purple-600" />
            Creator Studio
          </h1>
          <p className="text-gray-500 mt-2">Create content, manage your ministry, and grow your audience</p>
        </div>

        {/* ============================================ */}
        {/* CONTENT CREATION SECTION */}
        {/* ============================================ */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-purple-600" />
            Content Creation
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Write Blog */}
            <Link href="/studio/blog/new" className="group">
              <div className="bg-white rounded-xl border border-gray-200 p-6 hover:border-purple-300 hover:shadow-lg transition">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-purple-200 transition">
                  <FileText className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Write Blog</h3>
                <p className="text-sm text-gray-500">Create a blog post</p>
              </div>
            </Link>

            {/* AI Blog Generator */}
            <Link href="/studio/ai-blog" className="group">
              <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl p-6 text-white hover:from-purple-600 hover:to-pink-600 transition shadow-lg">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4">
                  <Wand2 className="w-6 h-6" />
                </div>
                <h3 className="font-semibold mb-1">AI Blog Writer</h3>
                <p className="text-sm text-white/80">Generate with AI</p>
              </div>
            </Link>

            {/* Upload Video */}
            <Link href="/studio/video/upload" className="group">
              <div className="bg-white rounded-xl border border-gray-200 p-6 hover:border-purple-300 hover:shadow-lg transition">
                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-red-200 transition">
                  <Video className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Upload Video</h3>
                <p className="text-sm text-gray-500">Share videos</p>
              </div>
            </Link>

            {/* Go Live */}
            <Link href="/live/go-live" className="group">
              <div className="bg-white rounded-xl border border-gray-200 p-6 hover:border-red-300 hover:shadow-lg transition">
                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-red-200 transition">
                  <Radio className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Go Live</h3>
                <p className="text-sm text-gray-500">Start streaming</p>
              </div>
            </Link>

            {/* Create Vlog */}
            <Link href="/vlog/create" className="group">
              <div className="bg-white rounded-xl border border-gray-200 p-6 hover:border-purple-300 hover:shadow-lg transition">
                <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-pink-200 transition">
                  <Camera className="w-6 h-6 text-pink-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Create Vlog</h3>
                <p className="text-sm text-gray-500">Short video story</p>
              </div>
            </Link>

            {/* AI Website Builder */}
            <Link href="/studio/sites/new" className="group">
              <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl p-6 text-white hover:from-blue-600 hover:to-cyan-600 transition shadow-lg">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4">
                  <Globe className="w-6 h-6" />
                </div>
                <h3 className="font-semibold mb-1">AI Website</h3>
                <p className="text-sm text-white/80">Build with AI</p>
              </div>
            </Link>

            {/* Photo Gallery */}
            <Link href="/studio/gallery" className="group">
              <div className="bg-white rounded-xl border border-gray-200 p-6 hover:border-purple-300 hover:shadow-lg transition">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-green-200 transition">
                  <Image className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Photo Gallery</h3>
                <p className="text-sm text-gray-500">Upload images</p>
              </div>
            </Link>

            {/* Schedule Post */}
            <Link href="/studio/schedule" className="group">
              <div className="bg-white rounded-xl border border-gray-200 p-6 hover:border-purple-300 hover:shadow-lg transition">
                <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-amber-200 transition">
                  <Calendar className="w-6 h-6 text-amber-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Schedule Post</h3>
                <p className="text-sm text-gray-500">Plan content</p>
              </div>
            </Link>
          </div>
        </section>

        {/* ============================================ */}
        {/* CHURCH MANAGEMENT SECTION */}
        {/* ============================================ */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Church className="w-5 h-5 text-purple-600" />
            Church Management
          </h2>
          
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-4">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-purple-600" />
              Quick Create Organization
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* Create Church */}
              <Link href="/church/org/create?type=church">
                <div className="flex flex-col items-center gap-3 p-4 bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl hover:from-purple-600 hover:to-purple-700 transition cursor-pointer shadow-md hover:shadow-lg">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <Church className="w-6 h-6" />
                  </div>
                  <div className="text-center">
                    <p className="font-semibold">Create Church</p>
                    <p className="text-xs text-white/80">Local congregation</p>
                  </div>
                </div>
              </Link>

              {/* Create Fellowship */}
              <Link href="/church/org/create?type=fellowship">
                <div className="flex flex-col items-center gap-3 p-4 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition cursor-pointer shadow-md hover:shadow-lg">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6" />
                  </div>
                  <div className="text-center">
                    <p className="font-semibold">Create Fellowship</p>
                    <p className="text-xs text-white/80">Small group</p>
                  </div>
                </div>
              </Link>

              {/* Create Cell */}
              <Link href="/church/org/create?type=cell">
                <div className="flex flex-col items-center gap-3 p-4 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition cursor-pointer shadow-md hover:shadow-lg">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <Home className="w-6 h-6" />
                  </div>
                  <div className="text-center">
                    <p className="font-semibold">Create Cell</p>
                    <p className="text-xs text-white/80">Home cell group</p>
                  </div>
                </div>
              </Link>

              {/* Create Bible Study */}
              <Link href="/church/org/create?type=biblestudy">
                <div className="flex flex-col items-center gap-3 p-4 bg-gradient-to-br from-amber-500 to-amber-600 text-white rounded-xl hover:from-amber-600 hover:to-amber-700 transition cursor-pointer shadow-md hover:shadow-lg">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <BookOpenCheck className="w-6 h-6" />
                  </div>
                  <div className="text-center">
                    <p className="font-semibold">Bible Study</p>
                    <p className="text-xs text-white/80">Study group</p>
                  </div>
                </div>
              </Link>
            </div>
          </div>

          {/* Church Quick Links */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link href="/church" className="group">
              <div className="bg-white rounded-xl border border-gray-200 p-4 hover:border-purple-300 hover:shadow-md transition flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <BarChart2 className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Dashboard</p>
                  <p className="text-xs text-gray-500">View stats</p>
                </div>
              </div>
            </Link>

            <Link href="/church/souls/add" className="group">
              <div className="bg-white rounded-xl border border-gray-200 p-4 hover:border-purple-300 hover:shadow-md transition flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <Plus className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Add Soul</p>
                  <p className="text-xs text-gray-500">New convert</p>
                </div>
              </div>
            </Link>

            <Link href="/church/foundation" className="group">
              <div className="bg-white rounded-xl border border-gray-200 p-4 hover:border-purple-300 hover:shadow-md transition flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Foundation</p>
                  <p className="text-xs text-gray-500">School</p>
                </div>
              </div>
            </Link>

            <Link href="/church/attendance" className="group">
              <div className="bg-white rounded-xl border border-gray-200 p-4 hover:border-purple-300 hover:shadow-md transition flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Attendance</p>
                  <p className="text-xs text-gray-500">Track</p>
                </div>
              </div>
            </Link>
          </div>
        </section>

        {/* ============================================ */}
        {/* MY CONTENT SECTION */}
        {/* ============================================ */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Layout className="w-5 h-5 text-purple-600" />
            Manage Content
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link href="/studio/blogs" className="group">
              <div className="bg-white rounded-xl border border-gray-200 p-4 hover:border-purple-300 hover:shadow-md transition flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">My Blogs</p>
                  <p className="text-xs text-gray-500">Manage posts</p>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400 ml-auto" />
              </div>
            </Link>

            <Link href="/studio/videos" className="group">
              <div className="bg-white rounded-xl border border-gray-200 p-4 hover:border-purple-300 hover:shadow-md transition flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <Video className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">My Videos</p>
                  <p className="text-xs text-gray-500">Manage videos</p>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400 ml-auto" />
              </div>
            </Link>

            <Link href="/studio/sites" className="group">
              <div className="bg-white rounded-xl border border-gray-200 p-4 hover:border-purple-300 hover:shadow-md transition flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Globe className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">My Websites</p>
                  <p className="text-xs text-gray-500">Manage sites</p>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400 ml-auto" />
              </div>
            </Link>

            <Link href="/studio/analytics" className="group">
              <div className="bg-white rounded-xl border border-gray-200 p-4 hover:border-purple-300 hover:shadow-md transition flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <BarChart2 className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Analytics</p>
                  <p className="text-xs text-gray-500">View stats</p>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400 ml-auto" />
              </div>
            </Link>
          </div>
        </section>

        {/* ============================================ */}
        {/* TOOLS & SETTINGS */}
        {/* ============================================ */}
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Settings className="w-5 h-5 text-purple-600" />
            Tools & Settings
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link href="/studio/thumbnails" className="group">
              <div className="bg-white rounded-xl border border-gray-200 p-4 hover:border-purple-300 hover:shadow-md transition">
                <FileImage className="w-8 h-8 text-pink-500 mb-2" />
                <p className="font-medium text-gray-900">AI Thumbnails</p>
                <p className="text-xs text-gray-500">Generate images</p>
              </div>
            </Link>

            <Link href="/studio/hashtags" className="group">
              <div className="bg-white rounded-xl border border-gray-200 p-4 hover:border-purple-300 hover:shadow-md transition">
                <Sparkles className="w-8 h-8 text-purple-500 mb-2" />
                <p className="font-medium text-gray-900">Hashtag Generator</p>
                <p className="text-xs text-gray-500">Viral hashtags</p>
              </div>
            </Link>

            <Link href="/settings/creator" className="group">
              <div className="bg-white rounded-xl border border-gray-200 p-4 hover:border-purple-300 hover:shadow-md transition">
                <Settings className="w-8 h-8 text-gray-500 mb-2" />
                <p className="font-medium text-gray-900">Creator Settings</p>
                <p className="text-xs text-gray-500">Preferences</p>
              </div>
            </Link>

            <Link href="/studio/monetization" className="group">
              <div className="bg-white rounded-xl border border-gray-200 p-4 hover:border-purple-300 hover:shadow-md transition">
                <Palette className="w-8 h-8 text-green-500 mb-2" />
                <p className="font-medium text-gray-900">Monetization</p>
                <p className="text-xs text-gray-500">Earn tokens</p>
              </div>
            </Link>
          </div>
        </section>
      </div>
    </AppLayout>
  );
}
