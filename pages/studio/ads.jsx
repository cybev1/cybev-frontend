import StudioLayout from '../../components/layout/StudioLayout';


import React, { useState } from 'react';

export default function AdsManager() {
  const [form, setForm] = useState({ title: '', description: '', mediaUrl: '', budget: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = e => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 1500);
  };

  return (
    <StudioLayout>
      <h2 className="text-2xl font-bold mb-4">📢 CYBEV Ads Manager</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" name="title" placeholder="Ad Title" onChange={handleChange} required className="input" />
        <textarea name="description" placeholder="Ad Description" onChange={handleChange} required className="input" />
        <input type="text" name="mediaUrl" placeholder="Media URL" onChange={handleChange} required className="input" />
        <input type="number" name="budget" placeholder="Budget in CYBEV Tokens" onChange={handleChange} required className="input" />
        <button type="submit" disabled={submitting} className="btn-primary">
          {submitting ? 'Submitting...' : 'Create Ad'}
        </button>
      </form>
      {submitted && (
        <div className="mt-6">
          <h3>✅ Ad Submitted Successfully!</h3>
          <p><strong>Title:</strong> {form.title}</p>
          <p><strong>Budget:</strong> {form.budget} CYBEV</p>
        </div>
      )}
    </StudioLayout>
  );
}
