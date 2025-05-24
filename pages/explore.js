import Link from 'next/link'
import { EyeIcon, HeartIcon, RocketLaunchIcon } from '@heroicons/react/24/solid'

const dummyPosts = [
  {
    _id: '1',
    title: 'The Rise of Digital Creators',
    category: 'Innovation',
    content: 'Explore how creators are leveraging platforms like CYBEV to reach global audiences and monetize content.',
    views: 1450,
    likes: 320,
    comments: 45,
    image: 'https://picsum.photos/seed/creator1/400/200'
  },
  {
    _id: '2',
    title: 'Tokenizing Your Blog Posts',
    category: 'Blockchain',
    content: 'A step-by-step guide to minting blog posts as NFTs and staking for rewards.',
    views: 960,
    likes: 210,
    comments: 18,
    image: 'https://picsum.photos/seed/creator2/400/200'
  },
  {
    _id: '3',
    title: 'AI in Content Creation',
    category: 'AI Tools',
    content: 'Discover how CYBEV AI helps automate blogging, SEO, and audience engagement.',
    views: 1875,
    likes: 476,
    comments: 63,
    image: 'https://picsum.photos/seed/creator3/400/200'
  }
]

export default function Explore() {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-blue-900 mb-6">Explore Creators</h1>
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {dummyPosts.map(post => (
            <div key={post._id} className="bg-white rounded shadow overflow-hidden hover:shadow-lg">
              <img src={post.image} alt={post.title} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h2 className="text-xl font-semibold text-blue-800">{post.title}</h2>
                <p className="text-sm text-gray-500">Category: {post.category}</p>
                <p className="mt-2 text-gray-700">{post.content.slice(0, 100)}...</p>
                <div className="flex justify-between items-center text-sm text-gray-600 mt-3">
                  <span className="flex items-center gap-1"><EyeIcon className="h-4 w-4 text-gray-500" /> {post.views}</span>
                  <span className="flex items-center gap-1"><HeartIcon className="h-4 w-4 text-red-500" /> {post.likes}</span>
                  <span>💬 {post.comments}</span>
                </div>
                <div className="mt-3 flex gap-3">
                  <button className="flex items-center gap-2 bg-pink-600 text-white px-3 py-1 rounded hover:bg-pink-700 text-sm">
                    <HeartIcon className="h-4 w-4" /> Like
                  </button>
                  <button className="flex items-center gap-2 bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 text-sm">
                    <RocketLaunchIcon className="h-4 w-4" /> Boost
                  </button>
                </div>
                <Link href={`/blog/${post._id}`} className="block mt-3 text-blue-600 font-medium">
                  Read More →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}