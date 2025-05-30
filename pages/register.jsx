
import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/solid';

const SeoHead = () => (
  <Head>
    <title>CYBEV.IO – Register</title>
    <meta name="description" content="Sign up for a free CYBEV.IO account and start blogging, minting, earning, and managing your community on Web3." />
    <link rel="icon" href="/favicon.ico" />
  </Head>
);

export default function Register() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: '', username: '', email: '', password: '', referralCode: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState('');
  const [error, setError] = useState(null);

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const checkPasswordStrength = (password) => {
    if (password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password)) {
      return 'strong';
    } else if (password.length >= 6) {
      return 'medium';
    }
    return 'weak';
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setError(null);

    if (name === 'password') {
      setPasswordStrength(checkPasswordStrength(value));
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();

    // Basic client-side validation
    if (form.name.length < 2) return setError('Name must be at least 2 characters.');
    if (!validateEmail(form.email)) return setError('Invalid email format.');
    if (form.username.includes(' ')) return setError('Username must not contain spaces.');
    if (form.password.length < 6) return setError('Password must be at least 6 characters.');

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
            <div className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-500" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
            </div>
          </div>

          {form.password && (
            <div className={`text-sm font-medium ${passwordStrength === 'strong' ? 'text-green-600' : passwordStrength === 'medium' ? 'text-yellow-600' : 'text-red-600'}`}>
              Password strength: {passwordStrength}
            </div>
          )}

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
