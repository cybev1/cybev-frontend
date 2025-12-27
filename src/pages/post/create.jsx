import React, { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link';
import AppLayout from '../../components/Layout/AppLayout';
import { postAPI } from '../../lib/api';

export default function CreatePost() {
  const router = useRouter();
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!content.trim() && !imageUrl.trim() && !videoUrl.trim()) {
      setError('Write something or attach media.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        content: content.trim(),
        images: imageUrl.trim() ? [imageUrl.trim()] : [],
        video: videoUrl.trim() || '',
        type: videoUrl.trim() ? 'video' : imageUrl.trim() ? 'image' : 'text'
      };

      await postAPI.createPost(payload);
      router.push('/feed');
    } catch (e2) {
      setError(e2?.response?.data?.error || 'Failed to create post. Make sure you are logged in.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AppLayout>
      <Head>
        <title>Create Post • CYBEV</title>
      </Head>

      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Create Social Post</h1>
          <Link href="/feed" className="text-sm opacity-80 hover:opacity-100">Back to Feed</Link>
        </div>

        <p className="mt-2 text-sm opacity-80">
          This posts to your CYBEV social feed. For blog posts, use <Link className="underline" href="/blog/create">Create Blog Post</Link>.
        </p>

        {error ? (
          <div className="mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-sm">{error}</div>
        ) : null}

        <form onSubmit={handleSubmit} className="mt-6 space-y-3">
          <div>
            <label className="block text-sm mb-1">Text</label>
            <textarea
              className="w-full px-3 py-3 rounded-xl bg-black/20 border border-white/10 min-h-[140px]"
              placeholder="Share a testimony, insight, update, or announcement…"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Image URL (optional)</label>
            <input
              className="w-full px-3 py-2 rounded-xl bg-black/20 border border-white/10"
              placeholder="https://..."
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Video URL (optional)</label>
            <input
              className="w-full px-3 py-2 rounded-xl bg-black/20 border border-white/10"
              placeholder="https://..."
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
            />
          </div>

          <button
            disabled={submitting}
            className="w-full px-4 py-3 rounded-xl bg-white text-black font-medium hover:opacity-90 disabled:opacity-60"
          >
            {submitting ? 'Posting…' : 'Post'}
          </button>
        </form>
      </div>
    </AppLayout>
  );
}
