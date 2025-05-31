
import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/solid';

const API_BASE = 'https://api.cybev.io';
const EMAIL_VALIDATION_API = process.env.NEXT_PUBLIC_EMAIL_VALIDATION_API;

export default function Register() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', username: '', email: '', password: '', referralCode: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(null);
  };

  const validateEmailExternally = async (email) => {
    try {
      const { data } = await axios.get(`${EMAIL_VALIDATION_API}&email=${email}`);
      return data.format_valid && data.mx_found && !data.disposable;
    } catch (err) {
      return false;
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.name || !form.username || !form.email || !form.password) {
      return setError('All fields are required.');
    }

    const isValid = await validateEmailExternally(form.email);
    if (!isValid) return setError('Invalid or disposable email address.');

    try {
      const res = await axios.post(`${API_BASE}/api/auth/register`, form);
      localStorage.setItem('token', res.data.token);
      router.push('/onboarding');
    } catch (err) {
      setError('Registration failed. Please try again.');
    }
  };

  return (
    <>
      <Head>
        <title>Register – CYBEV.IO</title>
      </Head>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100 dark:from-gray-900 dark:to-black p-4">
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-8 rounded shadow-md w-full max-w-md space-y-4">
          <h2 className="text-2xl font-bold text-blue-700 dark:text-white text-center">Create a CYBEV Account</h2>
          <input name="name" placeholder="Full Name" value={form.name} onChange={handleChange} required className="input" />
          <input name="username" placeholder="Username" value={form.username} onChange={handleChange} required className="input" />
          <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} required className="input" />
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
          <input name="referralCode" placeholder="Referral Code (optional)" value={form.referralCode} onChange={handleChange} className="input" />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button type="submit" className="btn-primary w-full">Register</button>
          <p className="text-sm text-center text-gray-500 dark:text-gray-300">
            Already have an account? <Link href="/login" className="text-blue-600 hover:underline">Log in</Link>
          </p>
        </form>
      </div>
    </>
  );
}
