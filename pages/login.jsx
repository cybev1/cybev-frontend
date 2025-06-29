import { useState } from 'react';
import Link from 'next/link';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    alert(data.message);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white text-black">
      <form onSubmit={handleSubmit} className="p-6 bg-gray-100 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Login</h2>
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required className="mb-3 p-2 w-full rounded border" />
        <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required className="mb-3 p-2 w-full rounded border" />
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">Login</button>
        <p className="mt-4 text-center">Don't have an account? <Link href="/register" className="text-blue-500">Register</Link></p>
      </form>
    </div>
  );
}