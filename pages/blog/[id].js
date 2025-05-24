import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

export default function BlogDetail() {
  const { query } = useRouter()
  const [post, setPost] = useState(null)
  const [comment, setComment] = useState('')
  const [comments, setComments] = useState([
    { user: 'Prince D', text: 'This is a powerful post!', date: '2025-05-22' },
    { user: 'Jane A.', text: 'Loved every part of this write-up. 🚀', date: '2025-05-23' }
  ])

  useEffect(() => {
    if (query.id) {
      fetch(`https://cybev.io/api/posts/${query.id}`)
        .then(res => res.json())
        .then(data => setPost(data))
        .catch(err => console.error(err))
    }
  }, [query.id])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!comment) return
    const newComment = { user: 'You', text: comment, date: new Date().toISOString().slice(0, 10) }
    setComments([...comments, newComment])
    setComment('')
  }

  if (!post) return <p className="p-6 text-center">Loading post...</p>

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-bold text-blue-900 mb-2">{post.title}</h1>
        <p className="text-sm text-gray-500 mb-4">Category: {post.category}</p>
        <p className="text-gray-800 whitespace-pre-line mb-6">{post.content}</p>

        <h2 className="text-lg font-semibold text-gray-700 mb-3">Comments</h2>
        <ul className="mb-4 space-y-2">
          {comments.map((c, i) => (
            <li key={i} className="bg-gray-50 p-3 rounded border">
              <p className="text-sm text-blue-800 font-semibold">{c.user}</p>
              <p className="text-gray-700">{c.text}</p>
              <p className="text-xs text-gray-400">{c.date}</p>
            </li>
          ))}
        </ul>

        <form onSubmit={handleSubmit} className="mt-4">
          <textarea
            className="w-full border rounded p-2"
            rows="3"
            placeholder="Write a comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <button
            type="submit"
            className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Post Comment
          </button>
        </form>
      </div>
    </div>
  )
}