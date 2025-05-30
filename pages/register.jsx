
import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

export default function Register() {
  const [form, setForm] = useState({ name: '', username: '', email: '', password: '', referralCode: '' });
  const router = useRouter();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/auth/register', form);
      localStorage.setItem('token', res.data.token);
      router.push('/onboarding');
    } catch (err) {
      alert('Registration failed');
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Create CYBEV Account</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="Full Name" onChange={handleChange} required /><br />
        <input type="text" name="username" placeholder="Username" onChange={handleChange} required /><br />
        <input type="email" name="email" placeholder="Email" onChange={handleChange} required /><br />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} required /><br />
        <input type="text" name="referralCode" placeholder="Referral Code (optional)" onChange={handleChange} /><br />
        <button type="submit">Register</button>
      </form>
    </div>
  );
}
