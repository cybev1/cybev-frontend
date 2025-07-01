import { useEffect, useState } from 'react';

export default function ProfilePage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [referral, setReferral] = useState('');

  useEffect(() => {
    setName(localStorage.getItem('cybev_username') || '');
    setEmail(localStorage.getItem('cybev_email') || '');
    setReferral(localStorage.getItem('cybev_referral') || '');
  }, []);

  const handleSave = () => {
    alert('Profile saved (mock). Future implementation will use real API.');
  };

  return (
    <div className="min-h-screen px-6 py-8 bg-gray-50 dark:bg-black text-gray-900 dark:text-white">
      <h1 className="text-3xl font-bold mb-4">👤 My Profile</h1>
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md max-w-xl">
        <label className="block mb-4">
          <span className="block text-sm font-medium">Full Name</span>
          <input value={name} onChange={(e) => setName(e.target.value)} className="mt-1 w-full p-2 rounded bg-gray-100 dark:bg-gray-700" />
        </label>
        <label className="block mb-4">
          <span className="block text-sm font-medium">Email</span>
          <input value={email} readOnly className="mt-1 w-full p-2 rounded bg-gray-100 dark:bg-gray-700" />
        </label>
        <label className="block mb-4">
          <span className="block text-sm font-medium">Referral</span>
          <input value={referral} onChange={(e) => setReferral(e.target.value)} className="mt-1 w-full p-2 rounded bg-gray-100 dark:bg-gray-700" />
        </label>
        <button onClick={handleSave} className="mt-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">Save Changes</button>
      </div>
    </div>
  );
}
