import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import withAuth from '../../utils/withAuth';
import getUserProfile from '../../utils/getUserProfile';
import { toast } from 'react-toastify';

function EditProfile() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', referral: '' });

  useEffect(() => {
    getUserProfile().then((user) => {
      setForm({
        name: user.name || '',
        email: user.email || '',
        referral: user.referral || '',
      });
    });
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('cybev_token');
      const res = await fetch('/api/auth/update-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Update failed');
      toast.success('Profile updated successfully!');
      router.push('/studio/profile');
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white dark:bg-zinc-900 rounded-xl shadow text-gray-800 dark:text-white">
      <h1 className="text-2xl font-bold mb-4">Edit Profile</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm mb-1">Full Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded bg-gray-100 dark:bg-zinc-800 text-gray-800 dark:text-white"
            required
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Email (read-only)</label>
          <input
            type="email"
            name="email"
            value={form.email}
            readOnly
            className="w-full px-4 py-2 rounded bg-gray-200 dark:bg-zinc-700 text-gray-500"
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Referral Code</label>
          <input
            type="text"
            name="referral"
            value={form.referral}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded bg-gray-100 dark:bg-zinc-800 text-gray-800 dark:text-white"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}

export default withAuth(EditProfile);
