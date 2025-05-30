
import React, { useState } from 'react';

export default function AdsManager() {
  const [form, setForm] = useState({
    title: '', description: '', mediaUrl: '', budget: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    setSubmitting(true);
    // Simulate ad submission
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 1500);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>📢 CYBEV Ads Manager</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="title" placeholder="Ad Title" onChange={handleChange} required /><br />
        <textarea name="description" placeholder="Ad Description" onChange={handleChange} required /><br />
        <input type="text" name="mediaUrl" placeholder="Media URL (Image or Video)" onChange={handleChange} required /><br />
        <input type="number" name="budget" placeholder="Budget in CYBEV Tokens" onChange={handleChange} required /><br />
        <button type="submit" disabled={submitting}>
          {submitting ? 'Submitting...' : 'Create Ad'}
        </button>
      </form>

      {submitted && (
        <div style={{ marginTop: 20 }}>
          <h3>✅ Ad Submitted Successfully!</h3>
          <p><strong>Title:</strong> {form.title}</p>
          <p><strong>Budget:</strong> {form.budget} CYBEV</p>
        </div>
      )}
    </div>
  );
}
