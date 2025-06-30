
import { useState } from 'react';
import { useRouter } from 'next/router';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('https://api.cybev.io/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('token', data.token);
        router.push('/studio/dashboard');
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('Network error');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white dark:bg-gray-900 rounded shadow">
      <h1 className="text-xl mb-4">Login</h1>
      {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
      <form onSubmit={handleLogin} className="space-y-4">
        <input type="email" placeholder="Email" className="w-full p-2 border rounded" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" className="w-full p-2 border rounded" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">Login</button>
      </form>
      <p className="mt-4 text-sm text-center">Don't have an account? <a href="/register" className="text-blue-500">Register</a></p>
    </div>
  );
}
