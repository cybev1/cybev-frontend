
import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/solid';

const API_BASE = 'https://api.cybev.io';

const SeoHead = () => (
  <Head>
    <title>CYBEV.IO – Login</title>
    <meta name="description" content="Login to your CYBEV.IO account to access your dashboard and creator tools." />
    <link rel="icon" href="/favicon.ico" />
  </Head>
);

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_BASE}/api/login`, form);
      localStorage.setItem('token', res.data.token);
      router.push('/studio/dashboard');
    } catch (err) {
      setError('Login failed. Please check your credentials.');
    }
  };

  return (
    <>
      <SeoHead />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-purple-100 dark:from-gray-900 dark:to-black p-4">
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-8 rounded shadow-md w-full max-w-md space-y-4">
          <h2 className="text-2xl font-bold text-blue-700 dark:text-white text-center">Login to CYBEV</h2>
          <input name="email" placeholder="Email" value={form.email} onChange={handleChange} required className="input" />
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
              className="input pr-10"
            />
            <div className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-600 dark:text-gray-300" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
            </div>
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button type="submit" className="btn-primary w-full">Login</button>
          <p className="text-sm text-center text-gray-500 dark:text-gray-300">
            Don't have an account? <Link href="/register" className="text-blue-600 hover:underline">Register</Link>
          </p>
        </form>
      </div>
    </>
  );
}
