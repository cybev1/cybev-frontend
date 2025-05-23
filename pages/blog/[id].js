import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

export default function BlogDetail() {
  const { query } = useRouter()
  const [post, setPost] = useState(null)

  useEffect(() => {
    if (query.id) {
      fetch(`https://cybev.io/api/posts/${query.id}`)
        .then(res => res.json())
        .then(data => setPost(data))
        .catch(err => console.error(err))
    }
  }, [query.id])

  if (!post) return <p className="p-6 text-center">Loading post...</p>

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-bold text-blue-900 mb-2">{post.title}</h1>
        <p className="text-sm text-gray-500">Category: {post.category}</p>
        <p className="mt-4 text-gray-700 whitespace-pre-line">{post.content}</p>
      </div>
    </div>
  )
}
