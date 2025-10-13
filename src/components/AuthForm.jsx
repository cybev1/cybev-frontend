import { useState } from 'react';
export default function AuthForm({ mode }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  return (
    <form className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-md max-w-md mx-auto mt-10">
      <h2 className="text-2xl font-bold text-center mb-4 text-blue-700 dark:text-white">
        {mode === 'register' ? 'Create Account' : 'Login to CYBEV'}
      </h2>
      <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email"
        className="w-full p-2 border rounded mb-3" />
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password"
        className="w-full p-2 border rounded mb-3" />
      <button type="submit"
        className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
        {mode === 'register' ? 'Register' : 'Login'}
      </button>
    </form>
  );
}