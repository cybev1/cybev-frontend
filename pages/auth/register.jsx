
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/solid';

const API_BASE = 'https://api.cybev.io';

export default function Register() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    referralCode: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const ref = localStorage.getItem('cybev_ref');
    if (ref) {
      setForm(prev => ({ ...prev, referralCode: ref }));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_BASE}/auth/register`, form);
      if (res.data.token) {
        localStorage.setItem('cybev_user_token', res.data.token);
        localStorage.setItem('cybev_username', res.data.username || form.username);
        router.push('/studio/dashboard');
      }
    } catch (err) {
      setError(err?.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <>
      <Head>
        <title>Register – CYBEV</title>
      </Head>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex justify-center items-center px-4">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg w-full max-w-md">
          <h2 className="text-2xl font-bold text-center text-blue-700 dark:text-white mb-6">Create Your CYBEV Account</h2>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <input type="text" name="name" placeholder="Full Name" value={form.name} onChange={handleChange} required className="input" />
            <input type="text" name="username" placeholder="Username" value={form.username} onChange={handleChange} required className="input" />
            <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} required className="input" />
            <div className="relative">
              <input type={showPassword ? "text" : "password"} name="password" placeholder="Password" value={form.password} onChange={handleChange} required className="input pr-10" />
              <span onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 cursor-pointer">
                {showPassword ? <EyeSlashIcon className="h-5 w-5 text-gray-500" /> : <EyeIcon className="h-5 w-5 text-gray-500" />}
              </span>
            </div>
            <input type="hidden" name="referralCode" value={form.referralCode} />
            <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">Register</button>
          </form>
          <p className="text-sm text-center text-gray-600 dark:text-gray-300 mt-4">
            Already have an account? <Link href="/login" className="text-blue-600 hover:underline">Login</Link>
          </p>
        </div>
      </div>
    </>
  );
}
