import { useEffect, useState } from 'react';
import axios from 'axios';

export default function AccountPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [referral, setReferral] = useState('');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await axios.get('/api/user/me');
        const { name, email, referral } = res.data;
        setName(name || '');
        setEmail(email || '');
        setReferral(referral || '');
      } catch (error) {
        setMessage('Failed to load profile data.');
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, []);

  const handleSave = async () => {
    try {
      setMessage('Saving...');
      await axios.put('/api/user/update', { name, referral });
      setMessage('✅ Profile updated successfully!');
    } catch (error) {
      setMessage('❌ Failed to save profile.');
    }
  };

  return (
    <div className="min-h-screen px-6 py-8 bg-gray-50 dark:bg-black text-gray-900 dark:text-white">
      <h1 className="text-3xl font-bold mb-6">Account Settings</h1>
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md max-w-xl">
        {loading ? <p>Loading...</p> : (
          <>
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
            {message && <p className="mt-4 text-sm">{message}</p>}
          </>
        )}
      </div>
    </div>
  );
}