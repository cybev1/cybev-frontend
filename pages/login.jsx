import { useState } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/solid';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: '', password: '' });
  const router = useRouter();

  const togglePassword = () => setShowPassword(!showPassword);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Login failed');

      localStorage.setItem('cybev_token', data.token);
      toast.success('Welcome back!');
      router.push('/studio/dashboard');
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <>
      <Head><title>Login to CYBEV</title></Head>
      <main className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-950 text-white px-4">
        <div className="bg-white dark:bg-zinc-900 shadow-xl rounded-2xl p-8 w-full max-w-md">
          <h1 className="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-white">Welcome Back</h1>
          <form onSubmit={handleSubmit} className="space-y-5">
            <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="Email Address"
              className="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-zinc-800 text-gray-800 dark:text-white focus:outline-none" required />
            <div className="relative">
              <input type={showPassword ? 'text' : 'password'} name="password" value={form.password} onChange={handleChange}
                placeholder="Password"
                className="w-full px-4 py-2 pr-10 rounded-lg bg-gray-100 dark:bg-zinc-800 text-gray-800 dark:text-white focus:outline-none"
                required />
              <div onClick={togglePassword}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 dark:text-gray-300 cursor-pointer">
                {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
              </div>
            </div>
            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition shadow">Login</button>
          </form>
          <p className="mt-4 text-sm text-center text-gray-600 dark:text-gray-400">
            Don&apos;t have an account? <Link href="/register" className="text-blue-500 hover:underline">Register</Link>
          </p>
        </div>
      </main>
    </>
  );
}