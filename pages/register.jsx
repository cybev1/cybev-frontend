
import { useState } from 'react';
import { useRouter } from 'next/router';

export default function Register() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('https://api.cybev.io/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        router.push('/login');
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (err) {
      setError('Network error');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white dark:bg-gray-900 rounded shadow">
      <h1 className="text-xl mb-4">Register</h1>
      {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
      <form onSubmit={handleRegister} className="space-y-4">
        <input type="text" placeholder="Name" className="w-full p-2 border rounded" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        <input type="email" placeholder="Email" className="w-full p-2 border rounded" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        <input type="password" placeholder="Password" className="w-full p-2 border rounded" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">Register</button>
      </form>
      <p className="mt-4 text-sm text-center">Already have an account? <a href="/login" className="text-blue-500">Login</a></p>
    </div>
  );
}
