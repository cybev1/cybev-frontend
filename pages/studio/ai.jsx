import StudioLayout from '../../components/layout/StudioLayout';


import React, { useState } from 'react';
import axios from 'axios';

export default function AITools() {
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setResult('');
    try {
      const response = await new Promise(resolve => {
        setTimeout(() => {
          resolve({ data: { result: `Generated content for: "${prompt}"` } });
        }, 1500);
      });
      setResult(response.data.result);
    } catch {
      setResult('AI generation failed.');
    }
    setLoading(false);
  };

  return (
    <StudioLayout>
      <h2 className="text-2xl font-bold mb-4">🧠 CYBEV AI Content Generator</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea value={prompt} onChange={e => setPrompt(e.target.value)} required className="input" placeholder="Enter your prompt here..." rows="4" />
        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? 'Generating...' : 'Generate Content'}
        </button>
      </form>
      {result && <div className="mt-4"><h3>AI Output</h3><p>{result}</p></div>}
    </StudioLayout>
  );
}
