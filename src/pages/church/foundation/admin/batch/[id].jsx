/**
 * Batch view: list enrollments and issue certificates
 */

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { ArrowLeft, Award, RefreshCw } from 'lucide-react';

export default function BatchAdminPage() {
  const router = useRouter();
  const { id } = router.query;
  const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { if (id) fetchEnrollments(); }, [id]);

  const fetchEnrollments = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const r = await fetch(`${API_URL}/api/church/foundation/admin/enrollments?batchId=${encodeURIComponent(id)}&limit=100`, {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });
      const d = await r.json();
      if (d.ok) setEnrollments(d.enrollments || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const issueCert = async (enrollmentId) => {
    const token = localStorage.getItem('token');
    if (!token) return router.push('/login');
    const r = await fetch(`${API_URL}/api/church/foundation/admin/issue-certificate/${enrollmentId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({})
    });
    const d = await r.json();
    if (!d.ok) return alert(d.error || 'Failed');
    alert('Certificate issued. You can open the image from the enrollment row.');
    fetchEnrollments();
  };

  const openCert = (enrollmentId) => {
    const token = localStorage.getItem('token');
    if (!token) return;
    // open in new tab; backend supports ?token= for this route
    window.open(`${API_URL}/api/church/foundation/certificates/${enrollmentId}/image?token=${encodeURIComponent(token)}`, '_blank');
  };

  return (
    <>
      <Head><title>Batch Admin | CYBEV</title></Head>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-16">
        <div className="bg-white dark:bg-gray-800 border-b px-4 pt-10 pb-4 flex items-center justify-between">
          <button onClick={() => router.back()} className="flex items-center gap-2 text-sm">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <button onClick={fetchEnrollments} className="text-sm flex items-center gap-2">
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
        </div>

        <div className="px-4 mt-6">
          <h1 className="text-xl font-bold mb-3">Enrollments</h1>
          {loading ? (
            <p className="text-sm text-gray-500">Loading...</p>
          ) : enrollments.length === 0 ? (
            <p className="text-sm text-gray-500">No enrollments yet.</p>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow overflow-hidden">
              <div className="divide-y">
                {enrollments.map((e) => (
                  <div key={e._id} className="p-3 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="font-medium truncate">{e.student?.name || e.student?.username || 'Student'}</div>
                      <div className="text-xs text-gray-500">Status: {e.status} • Progress: {e.progress?.completedModules?.length || 0}/{e.progress?.totalModules || 0}</div>
                      {e.certificateNumber && (
                        <div className="text-xs text-green-600 mt-1">Cert: {e.certificateNumber}</div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {!e.certificateNumber ? (
                        <button onClick={() => issueCert(e._id)} className="px-3 py-2 rounded-lg bg-indigo-600 text-white text-sm flex items-center gap-2">
                          <Award className="w-4 h-4" /> Issue
                        </button>
                      ) : (
                        <button onClick={() => openCert(e._id)} className="px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-sm">
                          View
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
