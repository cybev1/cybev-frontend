import { useState } from 'react';

export default function CreatePost() {
  const [form, setForm] = useState({ title: '', content: '' });
  const [response, setResponse] = useState(null);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('https://cybev.io/api/posts/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token')
      },
      body: JSON.stringify(form)
    });
    const data = await res.json();
    setResponse(data);
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: 'auto' }}>
      <h2>Create New Post</h2>
      <form onSubmit={handleSubmit}>
        <input name="title" placeholder="Post Title" onChange={handleChange} required /><br /><br />
        <textarea name="content" placeholder="Post content..." onChange={handleChange} rows="6" /><br /><br />
        <button type="submit">Submit</button>
      </form>
      {response && <pre>{JSON.stringify(response, null, 2)}</pre>}
    </div>
  );
}