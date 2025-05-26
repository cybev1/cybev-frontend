import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Register() {
  const router = useRouter();
  const [form, setForm] = useState({ username: '', email: '', password: '', ref: '' });
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // ⏬ Capture referral from URL ?ref=username
  useEffect(() => {
    if (router.query.ref) {
      setForm((prev) => ({ ...prev, ref: router.query.ref }));
    }
  }, [router.query.ref]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      const data = await res.json();

      if (res.ok && data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        router.push('/dashboard/setup-blog');
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (err) {
      setError('Server error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-full max-w-sm space-y-4">
        <h2 className="text-xl font-bold text-blue-900">Create an Account</h2>
        <input name="username" placeholder="Username" onChange={handleChange} required className="w-full border rounded px-3 py-2" />
        <input name="email" type="email" placeholder="Email" onChange={handleChange} required className="w-full border rounded px-3 py-2" />
        <input name="password" type="password" placeholder="Password" onChange={handleChange} required className="w-full border rounded px-3 py-2" />
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button type="submit" disabled={submitting} className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          {submitting ? 'Creating...' : 'Get Started'}
        </button>
        <p className="text-sm text-gray-500 text-center">
          Already have an account? <a href="/login" className="text-blue-600 hover:underline">Log in</a>
        </p>
      </form>
    </div>
  );
}
