
import React, { useState, useEffect } from 'react';
import StudioLayout from '../../components/layout/StudioLayout';
import axios from 'axios';
import Head from 'next/head';

const SeoHead = () => (
  <Head>
    <title>CYBEV.IO – Community Management</title>
    <meta name="description" content="Manage community members on CYBEV.IO. Track groups, emails, and join dates." />
  </Head>
);

export default function CommunityManagement() {
  const [members, setMembers] = useState([]);
  const [form, setForm] = useState({ name: '', email: '', group: '', joined: '' });

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleAddMember = async e => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      await axios.post('/api/cms', form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setForm({ name: '', email: '', group: '', joined: '' });
      fetchMembers();
    } catch (err) {
      alert('Failed to add member');
    }
  };

  const fetchMembers = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('/api/cms/my', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMembers(res.data || []);
    } catch (err) {
      console.error('Error fetching members:', err);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  return (
    <StudioLayout>
      <SeoHead />
      <h2 className="text-2xl font-bold mb-4">👥 CYBEV Community Management</h2>
      <form onSubmit={handleAddMember} className="space-y-4">
        <input name="name" value={form.name} onChange={handleChange} placeholder="Full Name" required className="input" />
        <input name="email" value={form.email} onChange={handleChange} placeholder="Email" required className="input" />
        <input name="group" value={form.group} onChange={handleChange} placeholder="Group" required className="input" />
        <input type="date" name="joined" value={form.joined} onChange={handleChange} required className="input" />
        <button type="submit" className="btn-primary">Add Member</button>
      </form>

      {members.length > 0 && (
        <div className="mt-10">
          <h3 className="text-xl font-bold mb-2">📋 Member List</h3>
          <table className="table-auto w-full text-left border">
            <thead>
              <tr>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Group</th>
                <th className="px-4 py-2">Date Joined</th>
              </tr>
            </thead>
            <tbody>
              {members.map((m, i) => (
                <tr key={i}>
                  <td className="px-4 py-2">{m.name}</td>
                  <td className="px-4 py-2">{m.email}</td>
                  <td className="px-4 py-2">{m.group}</td>
                  <td className="px-4 py-2">{new Date(m.joined).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </StudioLayout>
  );
}
