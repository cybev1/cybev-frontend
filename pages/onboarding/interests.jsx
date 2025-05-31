
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

const INTERESTS = [
  "Christianity", "Tech", "Fashion", "Music", "Health", "Business", "Education",
  "AI", "Blockchain", "Fitness", "Lifestyle", "Finance", "Travel", "Food",
  "Photography", "Gaming", "Parenting", "Motivation", "Spirituality", "Art"
];

export default function OnboardingInterests() {
  const router = useRouter();
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(false);

  const toggleInterest = (interest) => {
    setSelected((prev) =>
      prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('/api/onboarding/interests', { interests: selected });
      const onboardingType = localStorage.getItem('onboardingType');
      if (onboardingType === 'blog') {
        router.push('/blog/setup');
      } else {
        router.push('/studio/dashboard');
      }
    } catch (error) {
      console.error(error);
      alert('Failed to save interests');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-3xl mx-auto mt-10 bg-white dark:bg-gray-900 rounded-2xl shadow-md">
      <h1 className="text-2xl font-bold mb-4 text-center">Select Your Interests</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {INTERESTS.map((interest) => (
            <button
              type="button"
              key={interest}
              onClick={() => toggleInterest(interest)}
              className={`p-2 border rounded text-sm ${
                selected.includes(interest)
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700'
              }`}
            >
              {interest}
            </button>
          ))}
        </div>
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
