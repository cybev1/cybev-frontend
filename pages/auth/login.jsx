
import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/solid';

const API_BASE = 'https://api.cybev.io/api/auth';

export default function Login() {
  const router = useRouter();
  const [form, setForm] = useState({ identifier: '', password: '' }); // Accepts email or username
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_BASE}/login`, form);
      if (res.data.token) {
        localStorage.setItem('cybev_user_token', res.data.token);
        localStorage.setItem('cybev_username', res.data.username || 'Creator');
        router.push('/studio/dashboard');
      }
    } catch (err) {
      setError(err?.response?.data?.message || 'Login failed');
    }
  };

  return (
    <>
      <Head>
        <title>Login – CYBEV</title>
      </Head>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex justify-center items-center px-4">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg w-full max-w-md">
          <h2 className="text-2xl font-bold text-center text-blue-700 dark:text-white mb-6">Login to CYBEV</h2>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <input type="text" name="identifier" placeholder="Email or Username" value={form.identifier} onChange={handleChange} required className="input" />
            <div className="relative">
              <input type={showPassword ? "text" : "password"} name="password" placeholder="Password" value={form.password} onChange={handleChange} required className="input pr-10" />
              <span onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 cursor-pointer">
                {showPassword ? <EyeSlashIcon className="h-5 w-5 text-gray-500" /> : <EyeIcon className="h-5 w-5 text-gray-500" />}
              </span>
            </div>
            <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">Login</button>
          </form>
          <p className="text-sm text-center text-gray-600 dark:text-gray-300 mt-4">
            Don’t have an account? <Link href="/auth/register" className="text-blue-600 hover:underline">Register</Link>
          </p>
        </div>
      </div>
    </>
  );
}
