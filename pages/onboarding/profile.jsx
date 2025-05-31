
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

export default function OnboardingProfile() {
  const router = useRouter();
  const [form, setForm] = useState({
    fullName: '',
    username: '',
    country: '',
    gender: '',
    bio: '',
    avatar: null,
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setForm((prev) => ({ ...prev, avatar: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    Object.keys(form).forEach((key) => {
      formData.append(key, form[key]);
    });
    try {
      const res = await axios.post('/api/onboarding/profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      router.push('/onboarding/interests');
    } catch (error) {
      console.error(error);
      alert('Failed to save profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-lg mx-auto mt-10 bg-white dark:bg-gray-900 rounded-2xl shadow-md">
      <h1 className="text-2xl font-bold mb-4 text-center">Complete Your Profile</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="fullName"
          placeholder="Full Name"
          value={form.fullName}
          onChange={handleChange}
          className="w-full p-2 rounded border border-gray-300 dark:border-gray-700"
          required
        />
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          className="w-full p-2 rounded border border-gray-300 dark:border-gray-700"
          required
        />
        <select
          name="country"
          value={form.country}
          onChange={handleChange}
          className="w-full p-2 rounded border border-gray-300 dark:border-gray-700"
          required
        >
          <option value="">Select Country</option>
          <option value="Ghana">Ghana</option>
          <option value="Nigeria">Nigeria</option>
          <option value="United States">United States</option>
          <option value="United Kingdom">United Kingdom</option>
        </select>
        <select
          name="gender"
          value={form.gender}
          onChange={handleChange}
          className="w-full p-2 rounded border border-gray-300 dark:border-gray-700"
        >
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
        <textarea
          name="bio"
          placeholder="Tell us about you..."
          value={form.bio}
          onChange={handleChange}
          className="w-full p-2 rounded border border-gray-300 dark:border-gray-700"
        />
        <input type="file" accept="image/*" onChange={handleFileChange} />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Continue'}
        </button>
      </form>
    </div>
  );
}
