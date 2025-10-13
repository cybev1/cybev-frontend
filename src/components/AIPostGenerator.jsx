import { useState } from 'react';

export default function AIPostGenerator({ onGenerate }) {
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    // Simulate generation
    setTimeout(() => {
      const generated = 'AI-generated post content about Web3 and creator economy.';
      onGenerate(generated);
      setLoading(false);
    }, 1200);
  };

  return (
    <button
      onClick={handleGenerate}
      className="mt-3 px-4 py-2 text-white bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg"
    >
      {loading ? 'Generating…' : '✨ Generate with AI'}
    </button>
  );
}