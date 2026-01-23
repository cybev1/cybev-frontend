/**
 * Foundation School Teacher/Principal Portal
 * Minimal admin dashboard for managing batches and issuing certificates.
 */

import { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Plus, GraduationCap, Users, Calendar } from 'lucide-react';

export default function FoundationAdminPage() {
  const router = useRouter();
  const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ batchNumber: '', name: '', startDate: '', endDate: '', graduationDate: '' });

  const orgId = router.query.orgId;

  useEffect(() => {
    fetchBatches();
  }, [orgId]);

  const fetchBatches = async () => {
    try {
      setLoading(true);
      const qs = orgId ? `?churchId=${encodeURIComponent(orgId)}` : '';
      const r = await fetch(`${API_URL}/api/church/foundation/batches${qs}`);
      const d = await r.json();
      if (d.ok) setBatches(d.batches || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const createBatch = async () => {
    const token = localStorage.getItem('token');
    if (!token) return router.push('/login?redirect=/church/foundation/admin');
    if (!orgId) {
      alert('Open this page from a church organization (pass ?orgId=CHURCH_ID)');
      return;
    }
    try {
      setCreating(true);
      const r = await fetch(`${API_URL}/api/church/foundation/admin/create-batch`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          organizationId: orgId,
          batchNumber: Number(form.batchNumber || 1),
          name: form.name,
          startDate: form.startDate,
          endDate: form.endDate,
          graduationDate: form.graduationDate
        })
      });
      const d = await r.json();
      if (!d.ok) throw new Error(d.error || 'Failed');
      setForm({ batchNumber: '', name: '', startDate: '', endDate: '', graduationDate: '' });
      await fetchBatches();
      alert('Batch created');
    } catch (e) {
      alert(e.message);
    } finally {
      setCreating(false);
    }
  };

  return (
    <>
      <Head>
        <title>Foundation School Admin | CYBEV</title>
      </Head>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-16">
        <div className="bg-gradient-to-br from-indigo-700 to-purple-700 text-white px-4 pt-12 pb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center">
              <GraduationCap className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Foundation School Admin</h1>
              <p className="text-white/80 text-sm">Batches • Enrollments • Certificates</p>
            </div>
          </div>
        </div>

        <div className="px-4 mt-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-4 mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Plus className="w-5 h-5 text-indigo-600" />
              <h2 className="font-semibold">Create Batch</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input className="border rounded-lg p-2 bg-transparent" placeholder="Batch number (e.g., 1)" value={form.batchNumber} onChange={(e) => setForm({ ...form, batchNumber: e.target.value })} />
              <input className="border rounded-lg p-2 bg-transparent" placeholder="Name (optional)" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              <input className="border rounded-lg p-2 bg-transparent" type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} />
              <input className="border rounded-lg p-2 bg-transparent" type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} />
              <input className="border rounded-lg p-2 bg-transparent" type="date" value={form.graduationDate} onChange={(e) => setForm({ ...form, graduationDate: e.target.value })} />
            </div>
            <button disabled={creating} onClick={createBatch} className="mt-3 w-full md:w-auto px-4 py-2 rounded-lg bg-indigo-600 text-white font-medium disabled:opacity-60">
              {creating ? 'Creating...' : 'Create Batch'}
            </button>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold">Batches</h2>
              <button onClick={fetchBatches} className="text-sm text-indigo-600">Refresh</button>
            </div>
            {loading ? (
              <p className="text-sm text-gray-500">Loading...</p>
            ) : batches.length === 0 ? (
              <p className="text-sm text-gray-500">No batches yet.</p>
            ) : (
              <div className="space-y-3">
                {batches.map((b) => (
                  <div key={b._id} className="border rounded-xl p-3 flex items-center justify-between">
                    <div>
                      <div className="font-medium">{b.name || `Batch ${b.batchNumber}`}</div>
                      <div className="text-xs text-gray-500 flex items-center gap-2 mt-1">
                        <Calendar className="w-4 h-4" />
                        <span>{b.startDate ? new Date(b.startDate).toLocaleDateString() : '—'} → {b.graduationDate ? new Date(b.graduationDate).toLocaleDateString() : '—'}</span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1 flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        <span>Status: {b.status}</span>
                      </div>
                    </div>
                    <button onClick={() => router.push(`/church/foundation/admin/batch/${b._id}`)} className="px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-sm">
                      Open
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
