import { useState, useEffect } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { LikeIcon, CommentIcon, ShareIcon, RocketIcon, TipIcon } from 'lucide-react'

export default function Feed() {
  const [feed, setFeed] = useState([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  const fetchFeed = () => {
    fetch(`/api/posts/feed?page=${page}&limit=10`)
      .then(res => res.json())
      .then(data => {
        if (data.length < 10) setHasMore(false)
        setFeed(prev => [...prev, ...data])
        setPage(prev => prev + 1)
      })
      .catch(console.error)
  }

  useEffect(() => {
    fetchFeed()
  }, [])

  return (
    <main className="max-w-2xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Social Feed</h1>
      <InfiniteScroll
        dataLength={feed.length}
        next={fetchFeed}
        hasMore={hasMore}
        loader={<h4 className="text-center">Loading...</h4>}
      >
        {feed.map(post => (
          <div
            key={post.id}
            className="mb-6 p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-xl transform hover:-translate-y-2 transition-all"
          >
            <div className="flex items-center mb-4">
              <img
                src={post.authorAvatar || '/default-avatar.png'}
                alt="avatar"
                className="w-10 h-10 rounded-full mr-3"
              />
              <div>
                <div className="font-semibold text-gray-900 dark:text-gray-100">{post.authorName}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {new Date(post.createdAt).toLocaleString()}
                </div>
              </div>
            </div>
            <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-50">{post.title}</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">{post.content}</p>
            {post.imageUrl && (
              <img src={post.imageUrl} alt="" className="w-full rounded-lg mb-4" />
            )}
            <div className="flex justify-between text-gray-600 dark:text-gray-400 text-sm mb-4">
              <button className="flex items-center space-x-1">
                <LikeIcon size={16} /> <span>{post.likes}</span>
              </button>
              <button className="flex items-center space-x-1">
                <CommentIcon size={16} /> <span>{post.commentsCount}</span>
              </button>
              <button className="flex items-center space-x-1">
                <ShareIcon size={16} /> <span>{post.shares}</span>
              </button>
              <button className="flex items-center space-x-1">
                <RocketIcon size={16} /> <span>Boost</span>
              </button>
              <button className="flex items-center space-x-1">
                <TipIcon size={16} /> <span>Tip</span>
              </button>
            </div>
            <div className="mt-2 text-gray-500 dark:text-gray-400 text-sm">
              Earnings: {post.earnings} CYBV
            </div>
          </div>
        ))}
      </InfiniteScroll>
    </main>
  )
}
