import PostEditor from '../../components/PostEditor';
import AutoMintButton from '@/components/mint/AutoMintButton';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function CreateBlogPage() {
  const router = useRouter();
  const [latestForm, setLatestForm] = useState({});

  useEffect(() => {
    localStorage.setItem('wallet', '0x84E98A08aBb7378d81b2DC1b0F591e0fe5172265');
  }, []);

  const handleSubmit = async (data) => {
    setLatestForm(data); // save form for minting

    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value);
    });

    try {
      const res = await fetch('/api/blog/publish', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const result = await res.json();
      if (result.success) {
        alert('Blog published successfully');
        router.push('/studio/blogs');
      } else {
        alert('Failed to publish: ' + result.message);
      }
    } catch (err) {
      alert('Error submitting blog');
    }
  };

  return (
    <div className="min-h-screen bg-white p-6 text-black">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Create a New Blog Post</h1>
        <PostEditor onSubmit={handleSubmit} />
        <div className="mt-8">
          <AutoMintButton getData={() => latestForm} />
        </div>
        <ToastContainer />
      </div>
    </div>
  );
}