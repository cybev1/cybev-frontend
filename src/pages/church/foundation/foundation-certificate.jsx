/**
 * ============================================
 * FILE: certificate.jsx
 * PATH: cybev-frontend-main/src/pages/church/foundation/certificate.jsx
 * VERSION: 1.0.0 - Student Certificate View
 * UPDATED: 2026-01-24
 * ============================================
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { Award, Download, Share2, ArrowLeft, CheckCircle, Lock } from 'lucide-react';

export default function CertificatePage() {
  const router = useRouter();
  const API_URL = process.env.NEXT_PUBLIC_API_URL || '';
  
  const [enrollment, setEnrollment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => { fetchEnrollment(); }, []);

  const fetchEnrollment = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return router.push('/auth/login?redirect=/church/foundation/certificate');
      
      const res = await fetch(`${API_URL}/api/church/foundation/enrollment`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      
      if (data.ok && data.enrollment) {
        setEnrollment(data.enrollment);
      } else {
        setError('No enrollment found');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const downloadCertificate = () => {
    const token = localStorage.getItem('token');
    window.open(`${API_URL}/api/church/foundation/certificates/${enrollment._id}/image?token=${token}`, '_blank');
  };

  const shareCertificate = async () => {
    const token = localStorage.getItem('token');
    const url = `${API_URL}/api/church/foundation/certificates/${enrollment._id}/image?token=${token}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Foundation School Certificate',
          text: 'I completed the Foundation School at CYBEV!',
          url
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      navigator.clipboard.writeText(url);
      alert('Certificate link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  const isGraduated = enrollment?.status === 'graduated' && enrollment?.certificateIssuedAt;
  const isCompleted = enrollment?.status === 'completed';

  return (
    <>
      <Head><title>My Certificate | Foundation School</title></Head>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-teal-600 text-white">
          <div className="px-4 pt-12 pb-20" style={{ paddingTop: 'calc(env(safe-area-inset-top) + 1rem)' }}>
            <button onClick={() => router.push('/church/foundation')} className="flex items-center gap-2 text-white/80 hover:text-white mb-4">
              <ArrowLeft className="w-5 h-5" /><span>Back</span>
            </button>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center"><Award className="w-6 h-6" /></div>
              <div><h1 className="text-2xl font-bold">My Certificate</h1><p className="text-white/80 text-sm">Foundation School Graduation</p></div>
            </div>
          </div>
        </div>

        <div className="px-4 -mt-12">
          {error || !enrollment ? (
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 text-center shadow-lg">
              <Lock className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Not Enrolled</h2>
              <p className="text-gray-500 mb-4">Enroll in Foundation School to earn your certificate.</p>
              <button onClick={() => router.push('/church/foundation')} className="px-6 py-2 bg-purple-600 text-white rounded-lg">Go to Foundation School</button>
            </div>
          ) : isGraduated ? (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
              {/* Certificate Preview */}
              <div className="relative aspect-[3/4] bg-gray-100">
                <img
                  src={`${API_URL}/api/church/foundation/certificates/${enrollment._id}/image?token=${localStorage.getItem('token')}`}
                  alt="Foundation School Certificate"
                  className="w-full h-full object-contain"
                />
              </div>
              
              {/* Actions */}
              <div className="p-4 space-y-3">
                <div className="flex items-center gap-2 text-green-600 mb-2">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-medium">Certificate Issued</span>
                </div>
                
                <p className="text-sm text-gray-500">
                  Certificate #: {enrollment.certificateNumber}<br />
                  Issued: {new Date(enrollment.certificateIssuedAt).toLocaleDateString()}
                </p>
                
                <div className="flex gap-3 pt-2">
                  <button onClick={downloadCertificate} className="flex-1 flex items-center justify-center gap-2 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700">
                    <Download className="w-5 h-5" /><span>Download</span>
                  </button>
                  <button onClick={shareCertificate} className="flex-1 flex items-center justify-center gap-2 py-3 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700">
                    <Share2 className="w-5 h-5" /><span>Share</span>
                  </button>
                </div>
              </div>
            </div>
          ) : isCompleted ? (
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 text-center shadow-lg">
              <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-10 h-10 text-yellow-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Course Completed! 🎉</h2>
              <p className="text-gray-500 mb-4">Congratulations! You've completed all classes. Your certificate will be issued by your church admin soon.</p>
              <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 text-sm text-yellow-700 dark:text-yellow-400">
                Contact your Foundation School teacher or church admin to receive your graduation certificate.
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 text-center shadow-lg">
              <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="w-10 h-10 text-purple-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Complete All Classes</h2>
              <p className="text-gray-500 mb-4">
                You've completed {enrollment.progress?.completedModules?.length || 0} of {enrollment.progress?.totalModules || 7} classes.
                Finish all classes to earn your certificate!
              </p>
              <div className="w-full h-3 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden mb-4">
                <div className="h-full bg-purple-500 rounded-full" style={{ width: `${((enrollment.progress?.completedModules?.length || 0) / (enrollment.progress?.totalModules || 7)) * 100}%` }} />
              </div>
              <button onClick={() => router.push('/church/foundation')} className="px-6 py-2 bg-purple-600 text-white rounded-lg">Continue Learning</button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
