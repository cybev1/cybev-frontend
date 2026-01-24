/**
 * ============================================
 * FILE: index.jsx
 * PATH: cybev-frontend-main/src/pages/church/foundation/index.jsx
 * VERSION: 2.1.0 - Added Quick Actions
 * UPDATED: 2026-01-24
 * ============================================
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { 
  BookOpen, 
  GraduationCap, 
  Trophy, 
  ChevronRight, 
  Play, 
  CheckCircle, 
  Lock, 
  Clock, 
  Users,
  Star,
  Flame,
  Droplets,
  Book,
  MessageCircle,
  Scroll,
  Heart,
  Sparkles,
  ArrowRight,
  Award
} from 'lucide-react';

// Icon mapping for dynamic icons
const iconMap = {
  Sparkles, Flame, Droplets, Book, MessageCircle, Scroll, Heart,
  BookOpen, GraduationCap, Trophy, Star
};

export default function FoundationSchoolPage() {
  const router = useRouter();
  const [modules, setModules] = useState([]);
  const [progress, setProgress] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolled, setEnrolled] = useState(false);
  const [enrolling, setEnrolling] = useState(false);
  
  const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch modules
      const modulesRes = await fetch(`${API_URL}/api/church/foundation/modules`);
      const modulesData = await modulesRes.json();
      if (modulesData.ok) {
        setModules(modulesData.modules || []);
      }

      // Fetch progress (if logged in)
      const token = localStorage.getItem('token');
      if (token) {
        const progressRes = await fetch(`${API_URL}/api/church/foundation/progress`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const progressData = await progressRes.json();
        if (progressData.ok) {
          setProgress(progressData.progress);
          setEnrolled(progressData.enrolled);
        }
      }

      // Fetch stats
      const statsRes = await fetch(`${API_URL}/api/church/foundation/stats`);
      const statsData = await statsRes.json();
      if (statsData.ok) {
        setStats(statsData.stats);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login?redirect=/church/foundation');
      return;
    }

    setEnrolling(true);
    try {
      const res = await fetch(`${API_URL}/api/church/foundation/enroll`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({})
      });
      const data = await res.json();
      if (data.ok) {
        setEnrolled(true);
        fetchData();
      }
    } catch (error) {
      console.error('Enrollment error:', error);
    } finally {
      setEnrolling(false);
    }
  };

  const getIcon = (iconName) => {
    const IconComponent = iconMap[iconName] || BookOpen;
    return IconComponent;
  };

  const isModuleUnlocked = (moduleNumber) => {
    if (!enrolled) return moduleNumber === 1;
    if (!progress) return moduleNumber === 1;
    return moduleNumber <= (progress.currentModule || 1);
  };

  const isModuleCompleted = (moduleNumber) => {
    if (!progress) return false;
    return progress.completedModules?.includes(moduleNumber);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading Foundation School...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Foundation School | CYBEV</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      </Head>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
        {/* Header - Mobile Optimized */}
        <div className="bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 text-white">
          <div className="px-4 pt-12 pb-8" style={{ paddingTop: 'calc(env(safe-area-inset-top) + 3rem)' }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
                <GraduationCap className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Foundation School</h1>
                <p className="text-purple-200 text-sm">March 2025 Edition</p>
              </div>
            </div>
            
            <p className="text-purple-100 text-sm mb-6">
              Build a solid foundation in Christ through 7 comprehensive classes
            </p>

            {/* Stats Cards - Horizontal Scroll */}
            <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
              <div className="bg-white/10 backdrop-blur rounded-xl p-3 min-w-[100px] text-center flex-shrink-0">
                <p className="text-2xl font-bold">{modules.length}</p>
                <p className="text-xs text-purple-200">Classes</p>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-xl p-3 min-w-[100px] text-center flex-shrink-0">
                <p className="text-2xl font-bold">{modules.reduce((a, m) => a + (m.totalLessons || m.lessons?.length || 0), 0)}</p>
                <p className="text-xs text-purple-200">Lessons</p>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-xl p-3 min-w-[100px] text-center flex-shrink-0">
                <p className="text-2xl font-bold">{stats?.activeStudents || 0}</p>
                <p className="text-xs text-purple-200">Students</p>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-xl p-3 min-w-[100px] text-center flex-shrink-0">
                <p className="text-2xl font-bold">{stats?.graduatedStudents || 0}</p>
                <p className="text-xs text-purple-200">Graduates</p>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Section (if enrolled) */}
        {enrolled && progress && (
          <div className="px-4 -mt-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 mb-6">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-yellow-500" />
                  <span className="font-semibold text-gray-900 dark:text-white">Your Progress</span>
                </div>
                <span className="text-sm text-purple-600 dark:text-purple-400 font-medium">
                  {progress.progressPercent || 0}%
                </span>
              </div>
              
              {/* Progress Bar */}
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-3">
                <div 
                  className="bg-gradient-to-r from-purple-500 to-indigo-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${progress.progressPercent || 0}%` }}
                />
              </div>
              
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                <span>{progress.completedModules?.length || 0} of {progress.totalModules} classes completed</span>
                <span>Avg Score: {progress.avgScore || 0}%</span>
              </div>
              
              {/* Quick Actions */}
              <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                <button
                  onClick={() => router.push('/church/foundation/certificate')}
                  className="flex-1 flex items-center justify-center gap-2 py-2 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-lg text-sm font-medium hover:bg-green-100 dark:hover:bg-green-900/30"
                >
                  <GraduationCap className="w-4 h-4" />
                  Certificate
                </button>
                <button
                  onClick={() => router.push('/church/foundation/leaderboard')}
                  className="flex-1 flex items-center justify-center gap-2 py-2 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400 rounded-lg text-sm font-medium hover:bg-yellow-100 dark:hover:bg-yellow-900/30"
                >
                  <Trophy className="w-4 h-4" />
                  Leaderboard
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Admin Quick Access */}
        {enrolled && (
          <div className="px-4 mb-4">
            <button
              onClick={() => router.push('/church/foundation/admin')}
              className="w-full flex items-center justify-between py-3 px-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-900/30 transition"
            >
              <span className="flex items-center gap-2 font-medium">
                <Users className="w-5 h-5" />
                Admin Dashboard
              </span>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Enrollment CTA (if not enrolled) */}
        {!enrolled && (
          <div className="px-4 -mt-4 mb-6">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
                  <Star className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Ready to Begin?</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Enroll now and track your progress</p>
                </div>
              </div>
              
              <button
                onClick={handleEnroll}
                disabled={enrolling}
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition disabled:opacity-50"
              >
                {enrolling ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Enrolling...
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5" />
                    Enroll in Foundation School
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Module List */}
        <div className="px-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-purple-600" />
            Curriculum
          </h2>
          
          <div className="space-y-3">
            {modules.map((module) => {
              const unlocked = isModuleUnlocked(module.moduleNumber);
              const completed = isModuleCompleted(module.moduleNumber);
              const IconComponent = getIcon(module.icon);
              
              return (
                <button
                  key={module._id || module.moduleNumber}
                  onClick={() => unlocked && router.push(`/church/foundation/module/${module.moduleNumber}`)}
                  disabled={!unlocked}
                  className={`w-full text-left bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm transition-all ${
                    unlocked 
                      ? 'hover:shadow-md active:scale-[0.99]' 
                      : 'opacity-60'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    {/* Module Icon */}
                    <div 
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                        completed 
                          ? 'bg-green-100 dark:bg-green-900/30' 
                          : unlocked
                            ? 'bg-purple-100 dark:bg-purple-900/30'
                            : 'bg-gray-100 dark:bg-gray-700'
                      }`}
                      style={{ backgroundColor: unlocked && !completed ? `${module.color}20` : undefined }}
                    >
                      {completed ? (
                        <CheckCircle className="w-7 h-7 text-green-600 dark:text-green-400" />
                      ) : unlocked ? (
                        <IconComponent 
                          className="w-7 h-7" 
                          style={{ color: module.color || '#8B5CF6' }} 
                        />
                      ) : (
                        <Lock className="w-6 h-6 text-gray-400" />
                      )}
                    </div>
                    
                    {/* Module Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
                          Class {module.moduleNumber}
                        </span>
                        {completed && (
                          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
                            Completed
                          </span>
                        )}
                      </div>
                      
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1 truncate">
                        {module.title}
                      </h3>
                      
                      <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-2">
                        {module.subtitle || module.description}
                      </p>
                      
                      <div className="flex items-center gap-3 text-xs text-gray-400">
                        <span className="flex items-center gap-1">
                          <BookOpen className="w-3.5 h-3.5" />
                          {module.totalLessons || module.lessons?.length || 0} lessons
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {module.duration || '2 hours'}
                        </span>
                      </div>
                    </div>
                    
                    {/* Arrow */}
                    {unlocked && (
                      <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0 mt-4" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Certificate Section (if completed) */}
        {progress?.status === 'completed' && (
          <div className="px-4 mt-6">
            <div className="bg-gradient-to-br from-yellow-400 via-yellow-500 to-orange-500 rounded-2xl p-6 text-white">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
                  <Trophy className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Congratulations!</h3>
                  <p className="text-yellow-100 text-sm">You've completed Foundation School</p>
                </div>
              </div>
              
              <button
                onClick={() => router.push('/church/foundation/certificate')}
                className="w-full bg-white text-yellow-600 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-yellow-50 transition"
              >
                <GraduationCap className="w-5 h-5" />
                View Your Certificate
              </button>
            </div>
          </div>
        )}

        {/* Bottom padding for mobile nav */}
        <div className="h-20" />
      </div>

      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </>
  );
}
