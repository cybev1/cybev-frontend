/**
 * ============================================
 * FILE: leaderboard.jsx
 * PATH: cybev-frontend-main/src/pages/church/foundation/leaderboard.jsx
 * VERSION: 1.0.0 - Public Leaderboard
 * UPDATED: 2026-01-24
 * ============================================
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { Trophy, Medal, Star, ArrowLeft, Crown, Award, Users } from 'lucide-react';

export default function LeaderboardPage() {
  const router = useRouter();
  const API_URL = process.env.NEXT_PUBLIC_API_URL || '';
  
  const [leaderboard, setLeaderboard] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState('all');

  useEffect(() => { fetchLeaderboard(); }, []);

  const fetchLeaderboard = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
      
      const [leaderRes, statsRes] = await Promise.all([
        fetch(`${API_URL}/api/church/foundation/leaderboard`, { headers }),
        fetch(`${API_URL}/api/church/foundation/stats`)
      ]);
      
      const [leaderData, statsData] = await Promise.all([leaderRes.json(), statsRes.json()]);
      
      if (leaderData.ok) setLeaderboard(leaderData.leaderboard || []);
      if (statsData.ok) setStats(statsData.stats);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank) => {
    if (rank === 1) return <Crown className="w-6 h-6 text-yellow-500" />;
    if (rank === 2) return <Medal className="w-6 h-6 text-gray-400" />;
    if (rank === 3) return <Medal className="w-6 h-6 text-orange-400" />;
    return <span className="text-lg font-bold text-gray-400">{rank}</span>;
  };

  const getRankBg = (rank) => {
    if (rank === 1) return 'bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 border-yellow-200 dark:border-yellow-800';
    if (rank === 2) return 'bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-800/50 dark:to-slate-800/50 border-gray-200 dark:border-gray-700';
    if (rank === 3) return 'bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 border-orange-200 dark:border-orange-800';
    return 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <>
      <Head><title>Leaderboard | Foundation School</title></Head>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Header */}
        <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
          <div className="px-4 pt-12 pb-6" style={{ paddingTop: 'calc(env(safe-area-inset-top) + 1rem)' }}>
            <button onClick={() => router.push('/church/foundation')} className="flex items-center gap-2 text-white/80 hover:text-white mb-4">
              <ArrowLeft className="w-5 h-5" /><span>Back</span>
            </button>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center"><Trophy className="w-6 h-6" /></div>
              <div><h1 className="text-2xl font-bold">Leaderboard</h1><p className="text-white/80 text-sm">Top Foundation School Students</p></div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="px-4 -mt-4">
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-3 text-center shadow-sm">
              <Users className="w-5 h-5 mx-auto text-purple-600 mb-1" />
              <p className="text-lg font-bold text-gray-900 dark:text-white">{stats?.totalStudents || 0}</p>
              <p className="text-xs text-gray-500">Students</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-3 text-center shadow-sm">
              <Award className="w-5 h-5 mx-auto text-green-600 mb-1" />
              <p className="text-lg font-bold text-gray-900 dark:text-white">{stats?.graduatedStudents || 0}</p>
              <p className="text-xs text-gray-500">Graduated</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-3 text-center shadow-sm">
              <Trophy className="w-5 h-5 mx-auto text-yellow-600 mb-1" />
              <p className="text-lg font-bold text-gray-900 dark:text-white">{stats?.avgQuizScore || 0}%</p>
              <p className="text-xs text-gray-500">Avg Score</p>
            </div>
          </div>
        </div>

        {/* Top 3 Podium */}
        {leaderboard.length >= 3 && (
          <div className="px-4 mt-6">
            <div className="flex items-end justify-center gap-4">
              {/* 2nd Place */}
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-2 border-4 border-gray-300">
                  <span className="text-xl font-bold text-gray-600">{leaderboard[1]?.student?.name?.[0]}</span>
                </div>
                <p className="text-sm font-medium text-gray-900 dark:text-white text-center truncate w-20">{leaderboard[1]?.student?.name?.split(' ')[0]}</p>
                <p className="text-lg font-bold text-gray-600">{leaderboard[1]?.avgScore}%</p>
                <div className="w-16 h-16 bg-gray-300 dark:bg-gray-600 rounded-t-lg mt-2 flex items-center justify-center">
                  <Medal className="w-8 h-8 text-white" />
                </div>
              </div>
              
              {/* 1st Place */}
              <div className="flex flex-col items-center -mt-6">
                <Crown className="w-8 h-8 text-yellow-500 mb-1" />
                <div className="w-20 h-20 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center mb-2 border-4 border-yellow-400">
                  <span className="text-2xl font-bold text-yellow-600">{leaderboard[0]?.student?.name?.[0]}</span>
                </div>
                <p className="text-sm font-medium text-gray-900 dark:text-white text-center truncate w-24">{leaderboard[0]?.student?.name?.split(' ')[0]}</p>
                <p className="text-xl font-bold text-yellow-600">{leaderboard[0]?.avgScore}%</p>
                <div className="w-20 h-24 bg-yellow-400 rounded-t-lg mt-2 flex items-center justify-center">
                  <Trophy className="w-10 h-10 text-white" />
                </div>
              </div>
              
              {/* 3rd Place */}
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mb-2 border-4 border-orange-300">
                  <span className="text-xl font-bold text-orange-600">{leaderboard[2]?.student?.name?.[0]}</span>
                </div>
                <p className="text-sm font-medium text-gray-900 dark:text-white text-center truncate w-20">{leaderboard[2]?.student?.name?.split(' ')[0]}</p>
                <p className="text-lg font-bold text-orange-600">{leaderboard[2]?.avgScore}%</p>
                <div className="w-16 h-12 bg-orange-300 dark:bg-orange-700 rounded-t-lg mt-2 flex items-center justify-center">
                  <Medal className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Full List */}
        <div className="px-4 py-6">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">All Rankings</h3>
          <div className="space-y-3">
            {leaderboard.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-xl p-8 text-center">
                <Trophy className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                <p className="text-gray-500">No students have taken quizzes yet</p>
              </div>
            ) : leaderboard.map((entry, index) => (
              <div key={entry._id} className={`rounded-xl p-4 border ${getRankBg(index + 1)}`}>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 flex items-center justify-center">
                    {getRankIcon(index + 1)}
                  </div>
                  
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                    <span className="text-lg font-bold text-purple-600">{entry.student?.name?.[0] || '?'}</span>
                  </div>
                  
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 dark:text-white">{entry.student?.name || 'Unknown'}</p>
                    <p className="text-sm text-gray-500">{entry.completedModules || 0} classes completed</p>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-2xl font-bold text-purple-600">{entry.avgScore}%</p>
                    <p className="text-xs text-gray-500">{entry.quizCount} quizzes</p>
                  </div>
                  
                  {index < 3 && (
                    <Star className={`w-5 h-5 ${index === 0 ? 'text-yellow-500' : index === 1 ? 'text-gray-400' : 'text-orange-400'}`} fill="currentColor" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
