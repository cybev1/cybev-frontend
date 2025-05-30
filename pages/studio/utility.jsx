
import React, { useState } from 'react';

export default function UtilityServices() {
  const [form, setForm] = useState({
    serviceType: 'airtime', phone: '', amount: ''
  });
  const [processing, setProcessing] = useState(false);
  const [confirmation, setConfirmation] = useState(null);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

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
    <div style={{ padding: 20 }}>
      <h2>💼 CYBEV Utility Services</h2>
      <form onSubmit={handleSubmit}>
        <label>Service Type:</label><br />
        <select name="serviceType" onChange={handleChange} value={form.serviceType}>
          <option value="airtime">Buy Airtime</option>
          <option value="bills">Pay Bills</option>
          <option value="shop">Shop Online</option>
        </select><br /><br />
        <input type="text" name="phone" placeholder="Phone Number / Account" onChange={handleChange} required /><br />
        <input type="number" name="amount" placeholder="Amount in CYBEV Tokens" onChange={handleChange} required /><br />
        <button type="submit" disabled={processing}>
          {processing ? 'Processing...' : 'Proceed'}
        </button>
      </form>

      {confirmation && (
        <div style={{ marginTop: 20 }}>
          <h3>✅ Transaction Submitted</h3>
          <p><strong>Service:</strong> {confirmation.serviceType}</p>
          <p><strong>Target:</strong> {confirmation.phone}</p>
          <p><strong>Amount:</strong> {confirmation.amount} CYBEV</p>
        </div>
      )}
    </div>
  );
}
