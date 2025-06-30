
import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      router.push('/studio/dashboard');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900 px-4">
      <div className="w-full max-w-md space-y-6 bg-[#DBE9F4] p-8 rounded-xl shadow-md">
        <h1 className="text-2xl font-bold text-center text-blue-800">Welcome to CYBEV.IO</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email"
            className="w-full p-3 rounded-md border border-gray-300 focus:outline-none" required />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password"
            className="w-full p-3 rounded-md border border-gray-300 focus:outline-none" required />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button type="submit" className="w-full bg-blue-800 text-white py-3 rounded-md hover:bg-blue-900 transition">
            Login
          </button>
        </form>
        <p className="text-center text-sm">Don't have an account? <Link href="/register" className="text-blue-600">Register</Link></p>
      </div>
    </div>
  );
}
