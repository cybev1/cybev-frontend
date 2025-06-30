import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', referral: '' });
  const [error, setError] = useState('');
  const router = useRouter();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await axios.post('/api/auth/register', form);
      router.push('/login');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-800 to-indigo-900">
      <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-2xl w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800 dark:text-white">Create your CYBEV Account</h2>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input name="name" required placeholder="Name"
            className="w-full p-3 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white" onChange={handleChange} />
          <input name="email" type="email" required placeholder="Email"
            className="w-full p-3 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white" onChange={handleChange} />
          <input name="password" type="password" required placeholder="Password"
            className="w-full p-3 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white" onChange={handleChange} />
          <input name="referral" placeholder="Referral (optional)"
            className="w-full p-3 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white" onChange={handleChange} />
          <button type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-md font-semibold">Register</button>
        </form>
        <p className="text-sm text-center text-gray-600 dark:text-gray-300 mt-4">
          Already have an account? <Link href="/login" className="text-indigo-500 hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
}
