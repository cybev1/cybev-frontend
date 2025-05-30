
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
      // Simulated AI generation logic (replace with actual API call)
      const response = await new Promise(resolve => {
        setTimeout(() => {
          resolve({ data: { result: `Generated content for: "${prompt}"` } });
        }, 1500);
      });
      setResult(response.data.result);
    } catch (error) {
      setResult('AI generation failed.');
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>🧠 CYBEV AI Content Generator</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          placeholder="Enter your prompt here..."
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          rows="4"
          cols="50"
          required
        /><br />
        <button type="submit" disabled={loading}>
          {loading ? 'Generating...' : 'Generate Content'}
        </button>
      </form>

      {result && (
        <div style={{ marginTop: 20 }}>
          <h3>AI Output</h3>
          <p>{result}</p>
        </div>
      )}
    </div>
  );
}
