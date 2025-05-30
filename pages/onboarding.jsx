import React, { useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

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


export default function Onboarding() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [features, setFeatures] = useState({
    hasBlog: true, hasTimeline: true, hasNFT: true, hasUtilityAccess: true
  });
  const [interests, setInterests] = useState([]);
  const [bio, setBio] = useState('');
  const [profileImage, setProfileImage] = useState('');

  const toggleFeature = (feature) => {
    setFeatures(prev => { ...prev, [feature]: !prev[feature] });
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/auth/onboarding', { features, interests, bio, profileImage }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      router.push('/studio/dashboard');
    } catch (err) {
      alert('Onboarding failed');
    }
  };

  return (
    <>
      <SeoHead />
      <div style={ padding: 20 }>
        <h3>Onboarding Steps</h3>
        ...
      </div>
    </>
  );
}