
import React, { useState } from 'react';

export default function CommunityManagement() {
  const [members, setMembers] = useState([]);
  const [form, setForm] = useState({ name: '', email: '', group: '', joined: '' });

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddMember = e => {
    e.preventDefault();
    setMembers([...members, { ...form }]);
    setForm({ name: '', email: '', group: '', joined: '' });
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>👥 CYBEV Community Management</h2>
      <form onSubmit={handleAddMember}>
        <input name="name" value={form.name} onChange={handleChange} placeholder="Full Name" required /><br />
        <input name="email" value={form.email} onChange={handleChange} placeholder="Email" required /><br />
        <input name="group" value={form.group} onChange={handleChange} placeholder="Group" required /><br />
        <input name="joined" type="date" value={form.joined} onChange={handleChange} required /><br />
        <button type="submit">Add Member</button>
      </form>

      {members.length > 0 && (
        <div style={{ marginTop: 30 }}>
          <h3>📋 Member List</h3>
          <table border="1" cellPadding="10">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Group</th>
                <th>Date Joined</th>
              </tr>
            </thead>
            <tbody>
              {members.map((m, i) => (
                <tr key={i}>
                  <td>{m.name}</td>
                  <td>{m.email}</td>
                  <td>{m.group}</td>
                  <td>{m.joined}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
