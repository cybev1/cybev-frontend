
import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';

const SeoHead = () => (
  <Head>
    <title>CYBEV.IO – Register</title>
    <meta name="description" content="Sign up for a free CYBEV.IO account and start blogging, minting, earning, and managing your community on Web3." />
    <link rel="icon" href="/favicon.ico" />
  </Head>
);

export default function Register() {
  const [form, setForm] = useState({ name: '', username: '', email: '', password: '', referralCode: '' });
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/auth/register', form);
      localStorage.setItem('token', res.data.token);
      router.push('/onboarding');
    } catch (err) {
      setError('Registration failed. Please try again.');
    }
  };

  return (
    <>
      <SeoHead />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-purple-100 dark:from-gray-900 dark:to-black p-4">
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-8 rounded shadow-md w-full max-w-md space-y-4">
          <h2 className="text-2xl font-bold text-blue-700 dark:text-white text-center">Create a CYBEV Account</h2>
          <input name="name" placeholder="Full Name" value={form.name} onChange={handleChange} required className="input" />
          <input name="username" placeholder="Username" value={form.username} onChange={handleChange} required className="input" />
          <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} required className="input" />
          <input type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} required className="input" />
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
