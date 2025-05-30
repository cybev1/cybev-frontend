
import React, { useState } from 'react';
import StudioLayout from '../../components/layout/StudioLayout';

export default function UtilityServices() {
  const [form, setForm] = useState({ serviceType: 'airtime', phone: '', amount: '' });
  const [processing, setProcessing] = useState(false);
  const [confirmation, setConfirmation] = useState(null);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = e => {
    e.preventDefault();
    setProcessing(true);
    setTimeout(() => {
      setConfirmation({
        serviceType: form.serviceType,
        phone: form.phone,
        amount: form.amount
      });
      setProcessing(false);
    }, 1500);
  };

  return (
    <StudioLayout>
      <h2 className="text-2xl font-bold mb-4">💼 CYBEV Utility Services</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <select name="serviceType" onChange={handleChange} value={form.serviceType} className="input">
          <option value="airtime">Buy Airtime</option>
          <option value="bills">Pay Bills</option>
          <option value="shop">Shop Online</option>
        </select>
        <input type="text" name="phone" placeholder="Phone Number / Account" onChange={handleChange} required className="input" />
        <input type="number" name="amount" placeholder="Amount in CYBEV Tokens" onChange={handleChange} required className="input" />
        <button type="submit" disabled={processing} className="btn-primary">
          {processing ? 'Processing...' : 'Proceed'}
        </button>
      </form>
      {confirmation && (
        <div className="mt-6">
          <h3>✅ Transaction Submitted</h3>
          <p><strong>Service:</strong> {confirmation.serviceType}</p>
          <p><strong>Target:</strong> {confirmation.phone}</p>
          <p><strong>Amount:</strong> {confirmation.amount} CYBEV</p>
        </div>
      )}
    </StudioLayout>
  );
}
