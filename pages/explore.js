import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function Explore() {
  const [posts, setPosts] = useState([])

  useEffect(() => {
    fetch('https://cybev.io/api/posts')
      .then(res => res.json())
      .then(data => setPosts(data))
      .catch(err => console.error(err))
  }, [])

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-blue-900 mb-6">Explore Creators</h1>
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map(post => (
            <div key={post._id} className="bg-white p-4 rounded shadow hover:shadow-md">
              <h2 className="text-xl font-semibold text-blue-800">{post.title}</h2>
              <p className="text-sm text-gray-500">Category: {post.category}</p>
              <p className="mt-2 text-gray-700">{post.content.slice(0, 100)}...</p>
              <div className="flex justify-between items-center text-sm text-gray-600 mt-3">
                <span>👀 {post.views || 0}</span>
                <span>❤️ {post.likes || 0}</span>
                <span>💬 {post.comments || 0}</span>
              </div>
              <Link href={`/blog/${post._id}`} className="block mt-3 text-blue-600 font-medium">
                Read More →
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
