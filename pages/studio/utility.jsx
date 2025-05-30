
import React, { useState, useEffect } from 'react';
import StudioLayout from '../../components/layout/StudioLayout';
import axios from 'axios';
import Head from 'next/head';

const SeoHead = () => (
  <Head>
    <title>CYBEV.IO – Utility Services</title>
    <meta name="description" content="Use CYBEV.IO to pay bills, buy airtime, or shop online with your CYBEV tokens." />
  </Head>
);

export default function UtilityServices() {
  const [form, setForm] = useState({ serviceType: 'airtime', phone: '', amount: '' });
  const [processing, setProcessing] = useState(false);
  const [confirmation, setConfirmation] = useState(null);
  const [transactions, setTransactions] = useState([]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setProcessing(true);
    const token = localStorage.getItem('token');

    try {
      const res = await axios.post('/api/utility', form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setConfirmation(res.data);
      fetchTransactions();
    } catch (err) {
      alert('Transaction failed.');
    } finally {
      setProcessing(false);
    }
  };

  const fetchTransactions = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('/api/utility/my', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTransactions(res.data || []);
    } catch (err) {
      console.error('Error fetching utility history:', err);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  return (
    <StudioLayout>
      <SeoHead />
      <h2 className="text-2xl font-bold mb-4">💼 CYBEV Utility Services</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <select name="serviceType" onChange={handleChange} value={form.serviceType} className="input">
          <option value="airtime">Buy Airtime</option>
          <option value="bills">Pay Bills</option>
          <option value="shop">Shop Online</option>
        </select>
        <input type="text" name="phone" placeholder="Phone Number / Account" onChange={handleChange} value={form.phone} required className="input" />
        <input type="number" name="amount" placeholder="Amount in CYBEV Tokens" onChange={handleChange} value={form.amount} required className="input" />
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

      {transactions.length > 0 && (
        <div className="mt-10">
          <h3 className="text-xl font-bold mb-2">🧾 Transaction History</h3>
          <table className="table-auto w-full text-left border">
            <thead>
              <tr>
                <th className="px-4 py-2">Service</th>
                <th className="px-4 py-2">Phone/Account</th>
                <th className="px-4 py-2">Amount</th>
                <th className="px-4 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map(tx => (
                <tr key={tx._id}>
                  <td className="px-4 py-2">{tx.serviceType}</td>
                  <td className="px-4 py-2">{tx.phone}</td>
                  <td className="px-4 py-2">{tx.amount}</td>
                  <td className="px-4 py-2 capitalize">{tx.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </StudioLayout>
  );
}
