/**
 * ============================================
 * FILE: index.jsx
 * PATH: cybev-frontend-main/src/pages/church/foundation/admin/index.jsx
 * VERSION: 2.0.0 - Comprehensive Admin Dashboard
 * UPDATED: 2026-01-24
 * ============================================
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import {
  Users, GraduationCap, Award, Calendar, Plus, ChevronRight, Search,
  Download, Trophy, ArrowLeft, Star
} from 'lucide-react';

export default function FoundationAdminPage() {
  const router = useRouter();
  const { orgId } = router.query;
  const API_URL = process.env.NEXT_PUBLIC_API_URL || '';
  
  const [activeTab, setActiveTab] = useState('students');
  const [students, setStudents] = useState([]);
  const [batches, setBatches] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showCreateBatch, setShowCreateBatch] = useState(false);
  const [batchForm, setBatchForm] = useState({ name: '', batchNumber: '', startDate: '', graduationDate: '' });
  const [creating, setCreating] = useState(false);

  useEffect(() => { fetchData(); }, [orgId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const headers = { 'Authorization': `Bearer ${token}` };
      const qs = orgId ? `?organizationId=${orgId}` : '';
      
      const [studentsRes, batchesRes, statsRes] = await Promise.all([
        fetch(`${API_URL}/api/church/foundation/admin/students${qs}`, { headers }),
        fetch(`${API_URL}/api/church/foundation/batches${orgId ? `?churchId=${orgId}` : ''}`),
        fetch(`${API_URL}/api/church/foundation/stats${qs}`)
      ]);
      
      const [studentsData, batchesData, statsData] = await Promise.all([
        studentsRes.json(), batchesRes.json(), statsRes.json()
      ]);
      
      if (studentsData.ok) setStudents(studentsData.enrollments || []);
      if (batchesData.ok) setBatches(batchesData.batches || []);
      if (statsData.ok) setStats(statsData.stats);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const createBatch = async () => {
    const token = localStorage.getItem('token');
    if (!token) return router.push('/auth/login');
    try {
      setCreating(true);
      const res = await fetch(`${API_URL}/api/church/foundation/admin/create-batch`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ organizationId: orgId, ...batchForm, batchNumber: parseInt(batchForm.batchNumber) || 1 })
      });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error);
      setShowCreateBatch(false);
      setBatchForm({ name: '', batchNumber: '', startDate: '', graduationDate: '' });
      fetchData();
    } catch (err) { alert(err.message); }
    finally { setCreating(false); }
  };

  const issueCertificate = async (enrollmentId) => {
    if (!confirm('Issue graduation certificate to this student?')) return;
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_URL}/api/church/foundation/admin/issue-certificate/${enrollmentId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ issueDate: new Date().toISOString() })
      });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error);
      alert('Certificate issued!');
      fetchData();
    } catch (err) { alert(err.message); }
  };

  const filteredStudents = students.filter(s => {
    const matchesSearch = !searchQuery || s.student?.name?.toLowerCase().includes(searchQuery.toLowerCase()) || s.student?.email?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || s.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    const colors = { graduated: 'bg-green-100 text-green-700', completed: 'bg-blue-100 text-blue-700', active: 'bg-purple-100 text-purple-700', enrolled: 'bg-yellow-100 text-yellow-700' };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  const getProgress = (e) => Math.round(((e.progress?.completedModules?.length || 0) / (e.progress?.totalModules || 7)) * 100);

  if (loading) return <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center"><div className="animate-spin w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full" /></div>;

  return (
    <>
      <Head><title>Foundation School Admin | CYBEV</title></Head>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
          <div className="px-4 pt-12 pb-6" style={{ paddingTop: 'calc(env(safe-area-inset-top) + 1rem)' }}>
            <button onClick={() => router.push('/church/foundation')} className="flex items-center gap-2 text-white/80 hover:text-white mb-4">
              <ArrowLeft className="w-5 h-5" /><span>Back</span>
            </button>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center"><GraduationCap className="w-6 h-6" /></div>
              <div><h1 className="text-2xl font-bold">Admin Dashboard</h1><p className="text-white/80 text-sm">Manage Foundation School</p></div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="px-4 -mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Active', value: stats?.activeStudents || 0, icon: Users, color: 'text-purple-600' },
            { label: 'Graduated', value: stats?.graduatedStudents || 0, icon: GraduationCap, color: 'text-green-600' },
            { label: 'Avg Score', value: `${stats?.avgQuizScore || 0}%`, icon: Trophy, color: 'text-blue-600' },
            { label: 'Batches', value: batches.length, icon: Calendar, color: 'text-orange-600' }
          ].map(s => (
            <div key={s.label} className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
              <div className={`flex items-center gap-2 ${s.color} mb-2`}><s.icon className="w-5 h-5" /><span className="text-sm font-medium">{s.label}</span></div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{s.value}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="px-4 mt-6 flex gap-2 border-b border-gray-200 dark:border-gray-700">
          {[{ id: 'students', label: 'Students', icon: Users }, { id: 'batches', label: 'Batches', icon: Calendar }, { id: 'leaderboard', label: 'Leaderboard', icon: Trophy }].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 px-4 py-3 border-b-2 ${activeTab === tab.id ? 'border-purple-600 text-purple-600' : 'border-transparent text-gray-500'}`}>
              <tab.icon className="w-4 h-4" /><span className="font-medium">{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="px-4 py-4">
          {/* Students Tab */}
          {activeTab === 'students' && (
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="flex-1 relative">
                  <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="text" placeholder="Search students..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-800" />
                </div>
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-800">
                  <option value="all">All</option><option value="active">Active</option><option value="completed">Completed</option><option value="graduated">Graduated</option>
                </select>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm divide-y divide-gray-100 dark:divide-gray-700">
                {filteredStudents.length === 0 ? (
                  <div className="p-8 text-center text-gray-500"><Users className="w-12 h-12 mx-auto mb-3 opacity-50" /><p>No students found</p></div>
                ) : filteredStudents.map(e => (
                  <div key={e._id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center"><span className="text-purple-600 font-semibold">{e.student?.name?.[0] || '?'}</span></div>
                        <div><p className="font-medium text-gray-900 dark:text-white">{e.student?.name || 'Unknown'}</p><p className="text-sm text-gray-500">{e.student?.email}</p></div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(e.status)}`}>{e.status}</span>
                        {e.status === 'completed' && !e.certificateIssuedAt && (
                          <button onClick={() => issueCertificate(e._id)} className="px-3 py-1 bg-green-500 text-white rounded-lg text-sm flex items-center gap-1"><Award className="w-4 h-4" />Issue Cert</button>
                        )}
                        {e.certificateIssuedAt && (
                          <button onClick={() => window.open(`${API_URL}/api/church/foundation/certificates/${e._id}/image?token=${localStorage.getItem('token')}`, '_blank')} className="px-3 py-1 bg-blue-500 text-white rounded-lg text-sm flex items-center gap-1"><Download className="w-4 h-4" />Cert</button>
                        )}
                      </div>
                    </div>
                    <div className="mt-3">
                      <div className="flex justify-between text-sm mb-1"><span className="text-gray-500">Progress</span><span className="font-medium">{getProgress(e)}%</span></div>
                      <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full"><div className="h-full bg-purple-500 rounded-full" style={{ width: `${getProgress(e)}%` }} /></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Batches Tab */}
          {activeTab === 'batches' && (
            <div className="space-y-4">
              <button onClick={() => setShowCreateBatch(true)} className="w-full flex items-center justify-center gap-2 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700"><Plus className="w-5 h-5" /><span className="font-medium">Create New Batch</span></button>
              {batches.length === 0 ? (
                <div className="bg-white dark:bg-gray-800 rounded-xl p-8 text-center text-gray-500"><Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" /><p>No batches yet</p></div>
              ) : batches.map(b => (
                <div key={b._id} onClick={() => router.push(`/church/foundation/admin/batch/${b._id}`)} className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm cursor-pointer hover:shadow-md">
                  <div className="flex items-center justify-between">
                    <div><h3 className="font-semibold text-gray-900 dark:text-white">{b.name || `Batch ${b.batchNumber}`}</h3><p className="text-sm text-gray-500">#{b.batchNumber}</p></div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Leaderboard Tab */}
          {activeTab === 'leaderboard' && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm">
              <div className="p-4 border-b border-gray-100 dark:border-gray-700"><h3 className="font-semibold flex items-center gap-2"><Trophy className="w-5 h-5 text-yellow-500" />Top Students</h3></div>
              <div className="divide-y divide-gray-100 dark:divide-gray-700">
                {students.filter(e => e.progress?.quizScores?.length > 0).map(e => ({ ...e, avgScore: Math.round(e.progress.quizScores.reduce((a, b) => a + (b.score || 0), 0) / e.progress.quizScores.length) })).sort((a, b) => b.avgScore - a.avgScore).slice(0, 10).map((e, i) => (
                  <div key={e._id} className="p-4 flex items-center gap-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${i === 0 ? 'bg-yellow-100 text-yellow-600' : i === 1 ? 'bg-gray-100 text-gray-600' : i === 2 ? 'bg-orange-100 text-orange-600' : 'bg-gray-50 text-gray-500'}`}>{i + 1}</div>
                    <div className="flex-1"><p className="font-medium text-gray-900 dark:text-white">{e.student?.name}</p><p className="text-sm text-gray-500">{e.progress?.completedModules?.length || 0} classes</p></div>
                    <div className="text-right"><p className="text-lg font-bold text-purple-600">{e.avgScore}%</p></div>
                    {i < 3 && <Star className={`w-5 h-5 ${i === 0 ? 'text-yellow-500' : i === 1 ? 'text-gray-400' : 'text-orange-400'}`} fill="currentColor" />}
                  </div>
                ))}
                {students.filter(e => e.progress?.quizScores?.length > 0).length === 0 && <div className="p-8 text-center text-gray-500"><Trophy className="w-12 h-12 mx-auto mb-3 opacity-50" /><p>No scores yet</p></div>}
              </div>
            </div>
          )}
        </div>

        {/* Create Batch Modal */}
        {showCreateBatch && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full p-6">
              <h3 className="text-xl font-bold mb-4">Create New Batch</h3>
              <div className="space-y-4">
                <div><label className="block text-sm font-medium mb-1">Batch Name</label><input type="text" value={batchForm.name} onChange={(e) => setBatchForm({ ...batchForm, name: e.target.value })} className="w-full px-4 py-2 rounded-lg border dark:bg-gray-900 dark:border-gray-700" placeholder="March 2025 Session" /></div>
                <div><label className="block text-sm font-medium mb-1">Batch Number</label><input type="number" value={batchForm.batchNumber} onChange={(e) => setBatchForm({ ...batchForm, batchNumber: e.target.value })} className="w-full px-4 py-2 rounded-lg border dark:bg-gray-900 dark:border-gray-700" /></div>
                <div><label className="block text-sm font-medium mb-1">Start Date</label><input type="date" value={batchForm.startDate} onChange={(e) => setBatchForm({ ...batchForm, startDate: e.target.value })} className="w-full px-4 py-2 rounded-lg border dark:bg-gray-900 dark:border-gray-700" /></div>
                <div><label className="block text-sm font-medium mb-1">Graduation Date</label><input type="date" value={batchForm.graduationDate} onChange={(e) => setBatchForm({ ...batchForm, graduationDate: e.target.value })} className="w-full px-4 py-2 rounded-lg border dark:bg-gray-900 dark:border-gray-700" /></div>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setShowCreateBatch(false)} className="flex-1 py-2 border rounded-lg">Cancel</button>
                <button onClick={createBatch} disabled={creating} className="flex-1 py-2 bg-purple-600 text-white rounded-lg disabled:opacity-50">{creating ? 'Creating...' : 'Create'}</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
