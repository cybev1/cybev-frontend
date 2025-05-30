import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

import Head from 'next/head';

const SeoHead = () => (
  <Head>
    <title>CYBEV.IO – AI-Powered Web3 Blog & Social Platform</title>
    <meta name="description" content="Create, blog, mint NFTs, run ads, manage communities, and earn crypto – all in one AI-powered Web3 platform." />
    <meta property="og:title" content="CYBEV.IO – Create, Earn, Mint, Grow" />
    <meta property="og:description" content="Your all-in-one Creator Studio powered by AI + Web3. Blog, share, mint NFTs, and earn on CYBEV.IO." />
    <meta property="og:image" content="https://app.cybev.io/og-banner.png" />
    <meta property="og:url" content="https://app.cybev.io" />
    <meta name="twitter:card" content="summary_large_image" />
    <link rel="icon" href="/favicon.ico" />
  </Head>
);


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
    <>
      <SeoHead />
      <div style={ padding: 20 }>
        <h2>Create CYBEV Account</h2>
        <form onSubmit={handleSubmit}>
          <input type="text" name="name" onChange={handleChange} required />
          <button type="submit">Register</button>
        </form>
      </div>
    </>
  );
}