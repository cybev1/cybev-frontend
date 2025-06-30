
import { useState } from 'react';
import Link from 'next/link';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setMessage('Check your email to verify your account.');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900 px-4">
      <div className="w-full max-w-md space-y-6 bg-[#F0F8FF] p-8 rounded-xl shadow-md">
        <h1 className="text-2xl font-bold text-center text-blue-800">Create Your CYBEV.IO Account</h1>
        <form onSubmit={handleRegister} className="space-y-4">
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email"
            className="w-full p-3 rounded-md border border-gray-300 focus:outline-none" required />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password"
            className="w-full p-3 rounded-md border border-gray-300 focus:outline-none" required />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          {message && <p className="text-green-600 text-sm">{message}</p>}
          <button type="submit" className="w-full bg-blue-800 text-white py-3 rounded-md hover:bg-blue-900 transition">
            Register
          </button>
        </form>
        <p className="text-center text-sm">Already have an account? <Link href="/login" className="text-blue-600">Login</Link></p>
      </div>
    </div>
  );
}
