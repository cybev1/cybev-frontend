// ============================================
// FILE: pages/church/foundation/index.jsx
// Foundation School - Modules & Progress
// VERSION: 1.0.0
// ============================================

import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  BookOpen, GraduationCap, ChevronRight, Play, CheckCircle,
  Lock, Clock, Award, Target, Loader2, ArrowLeft,
  BookMarked, FileText, Video, HelpCircle, Star
} from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.cybev.io';

function ModuleCard({ module, progress, isUnlocked, onClick }) {
  const isCompleted = progress?.passed;
  const isInProgress = progress && !progress.passed;
  
  return (
    <div 
      onClick={isUnlocked ? onClick : undefined}
      className={`bg-white dark:bg-white rounded-2xl p-6 border transition-all ${
        isUnlocked 
          ? 'border-gray-100 dark:border-gray-200 hover:shadow-lg hover:border-purple-200 dark:hover:border-purple-800 cursor-pointer' 
          : 'border-gray-100 dark:border-gray-200 opacity-60 cursor-not-allowed'
      }`}
    >
      <div className="flex items-start gap-4">
        <div className={`w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 ${
          isCompleted 
            ? 'bg-green-100 dark:bg-green-900/30' 
            : isInProgress
              ? 'bg-yellow-100 dark:bg-yellow-900/30'
              : isUnlocked
                ? 'bg-purple-100 dark:bg-purple-900/30'
                : 'bg-gray-100 dark:bg-gray-700'
        }`}>
          {isCompleted ? (
            <CheckCircle className="w-7 h-7 text-green-500" />
          ) : isUnlocked ? (
            <span className="text-2xl font-bold text-purple-600 dark:text-purple-600">
              {module.moduleNumber}
            </span>
          ) : (
            <Lock className="w-6 h-6 text-gray-500" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-gray-900 dark:text-gray-900">
              Module {module.moduleNumber}: {module.title}
            </h3>
            {isCompleted && (
              <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-full">
                Completed
              </span>
            )}
            {isInProgress && (
              <span className="text-xs px-2 py-0.5 bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 rounded-full">
                In Progress
              </span>
            )}
          </div>
          
          <p className="text-sm text-gray-500 dark:text-gray-500 mb-3 line-clamp-2">
            {module.description}
          </p>

          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <FileText className="w-4 h-4" />
              {module.content?.lessons?.length || 3} Lessons
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {module.duration || 7} days
            </span>
            <span className="flex items-center gap-1">
              <HelpCircle className="w-4 h-4" />
              Quiz
            </span>
          </div>

          {progress?.quizScore > 0 && (
            <div className="mt-3 flex items-center gap-2">
              <div className="flex-1 h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full ${progress.passed ? 'bg-green-500' : 'bg-yellow-500'}`}
                  style={{ width: `${progress.quizScore}%` }}
                />
              </div>
              <span className={`text-sm font-medium ${progress.passed ? 'text-green-500' : 'text-yellow-500'}`}>
                {progress.quizScore}%
              </span>
            </div>
          )}
        </div>

        {isUnlocked && (
          <ChevronRight className="w-5 h-5 text-gray-600 flex-shrink-0" />
        )}
      </div>
    </div>
  );
}

function ProgressOverview({ enrollment, totalModules }) {
  const completedModules = enrollment?.moduleProgress?.filter(p => p.passed).length || 0;
  const progressPercent = totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0;

  return (
    <div className="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-2xl p-6 text-gray-900">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-lg">Your Progress</h3>
          <p className="text-purple-200 text-sm">
            {enrollment?.status === 'completed' 
              ? 'All modules completed!' 
              : enrollment?.status === 'graduated'
                ? 'Congratulations, Graduate!'
                : `${completedModules} of ${totalModules} modules completed`
            }
          </p>
        </div>
        <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
          {enrollment?.status === 'graduated' ? (
            <Award className="w-8 h-8" />
          ) : (
            <span className="text-2xl font-bold">{progressPercent}%</span>
          )}
        </div>
      </div>

      <div className="h-3 bg-white/20 rounded-full overflow-hidden mb-4">
        <div 
          className="h-full bg-white rounded-full transition-all duration-500"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <div className="grid grid-cols-3 gap-4 text-center">
        <div>
          <p className="text-2xl font-bold">{completedModules}</p>
          <p className="text-purple-200 text-xs">Completed</p>
        </div>
        <div>
          <p className="text-2xl font-bold">{totalModules - completedModules}</p>
          <p className="text-purple-200 text-xs">Remaining</p>
        </div>
        <div>
          <p className="text-2xl font-bold">{enrollment?.currentModule || 1}</p>
          <p className="text-purple-200 text-xs">Current</p>
        </div>
      </div>

      {enrollment?.status === 'completed' && (
        <button className="w-full mt-4 py-3 bg-white text-purple-700 rounded-xl font-semibold hover:bg-purple-50 flex items-center justify-center gap-2">
          <GraduationCap className="w-5 h-5" />
          Request Graduation
        </button>
      )}
    </div>
  );
}

export default function FoundationSchool() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [modules, setModules] = useState([]);
  const [enrollment, setEnrollment] = useState(null);
  const [enrolling, setEnrolling] = useState(false);
  const [myOrgs, setMyOrgs] = useState([]);

  const getAuth = () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    return { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } };
  };

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

      // Fetch enrollment progress
      const progressRes = await fetch(`${API_URL}/api/church/foundation/progress`, getAuth());
      const progressData = await progressRes.json();
      if (progressData.ok) {
        setEnrollment(progressData.enrollment);
      }

      // Fetch orgs for enrollment
      const orgsRes = await fetch(`${API_URL}/api/church/org/my`, getAuth());
      const orgsData = await orgsRes.json();
      if (orgsData.ok) {
        setMyOrgs(orgsData.orgs?.filter(o => o.type === 'church' || o.type === 'zone') || []);
      }
    } catch (err) {
      console.error('Fetch data error:', err);
    }
    setLoading(false);
  };

  const handleEnroll = async () => {
    if (myOrgs.length === 0) {
      alert('You need to be part of a church to enroll');
      return;
    }

    setEnrolling(true);
    try {
      const res = await fetch(`${API_URL}/api/church/foundation/enroll`, {
        method: 'POST',
        ...getAuth(),
        body: JSON.stringify({ churchId: myOrgs[0]._id })
      });
      const data = await res.json();
      if (data.ok) {
        setEnrollment(data.enrollment);
      } else {
        alert(data.error || 'Failed to enroll');
      }
    } catch (err) {
      console.error('Enroll error:', err);
    }
    setEnrolling(false);
  };

  const getModuleProgress = (moduleNumber) => {
    return enrollment?.moduleProgress?.find(p => p.moduleNumber === moduleNumber);
  };

  const isModuleUnlocked = (moduleNumber) => {
    if (!enrollment) return moduleNumber === 1;
    const currentModule = enrollment.currentModule || 1;
    return moduleNumber <= currentModule;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-50">
      <Head>
        <title>Foundation School - CYBEV Church</title>
      </Head>

      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-gray-900">
        <div className="max-w-5xl mx-auto px-4 py-8">
          <Link href="/church" className="inline-flex items-center gap-2 text-purple-200 hover:text-gray-900 mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Church Dashboard
          </Link>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <BookOpen className="w-8 h-8" />
            Foundation School
          </h1>
          <p className="text-purple-100 mt-1">
            A discipleship program for new believers
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Not Enrolled State */}
            {!enrollment && (
              <div className="bg-white dark:bg-white rounded-2xl p-8 text-center mb-8 border border-gray-100 dark:border-gray-200">
                <div className="w-20 h-20 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                  <GraduationCap className="w-10 h-10 text-purple-600 dark:text-purple-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-900 mb-2">
                  Welcome to Foundation School
                </h2>
                <p className="text-gray-500 mb-6 max-w-md mx-auto">
                  This 6-module course will help you build a strong foundation in your Christian faith.
                  Each module includes lessons, scriptures, and a quiz.
                </p>
                <button
                  onClick={handleEnroll}
                  disabled={enrolling}
                  className="px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-gray-900 rounded-xl font-semibold hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 flex items-center gap-2 mx-auto"
                >
                  {enrolling ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Enrolling...
                    </>
                  ) : (
                    <>
                      <Play className="w-5 h-5" />
                      Enroll Now - It's Free!
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Modules List */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-900 mb-4">
                Course Modules
              </h2>
              
              {modules.map((module) => (
                <ModuleCard
                  key={module._id}
                  module={module}
                  progress={getModuleProgress(module.moduleNumber)}
                  isUnlocked={isModuleUnlocked(module.moduleNumber)}
                  onClick={() => router.push(`/church/foundation/module/${module.moduleNumber}`)}
                />
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Progress Card (if enrolled) */}
            {enrollment && (
              <ProgressOverview enrollment={enrollment} totalModules={modules.length} />
            )}

            {/* What You'll Learn */}
            <div className="bg-white dark:bg-white rounded-2xl p-6 border border-gray-100 dark:border-gray-200">
              <h3 className="font-semibold text-gray-900 dark:text-gray-900 mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-purple-500" />
                What You'll Learn
              </h3>
              <ul className="space-y-3">
                {[
                  'Understanding salvation & new birth',
                  'The power of God\'s Word',
                  'How to pray effectively',
                  'The Holy Spirit in your life',
                  'The importance of church fellowship',
                  'Living the Christian life daily'
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-500">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Certificate Info */}
            <div className="bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 rounded-2xl p-6 border border-amber-200 dark:border-amber-800">
              <div className="flex items-center gap-3 mb-3">
                <Award className="w-8 h-8 text-amber-500" />
                <h3 className="font-semibold text-gray-900 dark:text-gray-900">
                  Earn a Certificate
                </h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-500">
                Complete all 6 modules and pass the quizzes to receive your official Foundation School certificate!
              </p>
            </div>

            {/* Memory Verse Preview */}
            {modules[0] && (
              <div className="bg-white dark:bg-white rounded-2xl p-6 border border-gray-100 dark:border-gray-200">
                <h3 className="font-semibold text-gray-900 dark:text-gray-900 mb-3 flex items-center gap-2">
                  <BookMarked className="w-5 h-5 text-purple-500" />
                  Featured Memory Verse
                </h3>
                <blockquote className="text-sm text-gray-600 dark:text-gray-500 italic border-l-4 border-purple-500 pl-4">
                  "{modules[0].content?.memoryVerse || 'Therefore if any man be in Christ, he is a new creature: old things are passed away; behold, all things are become new. - 2 Corinthians 5:17'}"
                </blockquote>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
