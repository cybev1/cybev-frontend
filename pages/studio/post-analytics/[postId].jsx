import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { motion } from 'framer-motion'

function Header() {
  return (
    <header className="p-4 bg-white dark:bg-gray-900 shadow">
      <div className="container mx-auto">
        <a href="/studio" className="text-xl font-bold text-gray-800 dark:text-gray-100">
          CYBEV Studio
        </a>
      </div>
    </header>
  )
}

export default function PostAnalytics() {
  const router = useRouter()
  const { postId } = router.query
  const [data, setData] = useState(null)
  const [posts, setPosts] = useState([])

  // Fetch analytics data for current post
  useEffect(() => {
    if (!postId) return
    fetch(`/api/analytics/post/${postId}`)
      .then(res => res.json())
      .then(json => setData(json))
      .catch(console.error)
  }, [postId])

  // Fetch list of user's posts for dropdown navigation
  useEffect(() => {
    fetch('/api/posts/my-posts')
      .then(res => res.json())
      .then(json => setPosts(json))
      .catch(console.error)
  }, [])

  if (!data) return <div className="p-6">Loading analytics…</div>

  const timeseries = data.history.map(item => ({
    date: item.date,
    views: item.views,
    shares: item.shares,
    earnings: item.earnings,
    boosts: item.boosts,
    mints: item.mints,
  }))

  return (
    <>
      <Header />
      <main className="p-6 bg-gray-50 min-h-screen">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }} className="space-y-8">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-semibold">Analytics for Post</h1>
            <select
              value={postId}
              onChange={(e) => router.push(`/studio/post-analytics/${e.target.value}`)}
              className="border rounded-lg p-2"
            >
              {posts.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title || `Post ${p.id}`}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'Total Views', value: data.views },
              { title: 'Total Shares', value: data.shares },
              { title: 'Total Earnings', value: `$${data.earnings.toFixed(2)}` },
              { title: 'Total Boosts', value: data.boosts },
            ].map((card) => (
              <div key={card.title} className="rounded-2xl shadow-2xl p-4 bg-white dark:bg-gray-800">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{card.title}</h3>
                <p className="mt-1 text-2xl font-semibold text-gray-900 dark:text-gray-100">{card.value}</p>
              </div>
            ))}
          </div>

          {[
            { title: 'Engagement Over Time', keys: ['views', 'shares', 'earnings'] },
            { title: 'Boosts Over Time', keys: ['boosts'] },
            { title: 'Mints Over Time', keys: ['mints'] },
          ].map(({ title, keys }) => (
            <div key={title} className="rounded-2xl shadow-2xl p-4 bg-white dark:bg-gray-800">
              <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200">{title}</h3>
              <div className="mt-2">
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={timeseries}>
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    {keys.map((key) => (
                      <Line key={key} type="monotone" dataKey={key} />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          ))}
        </motion.div>
      </main>
    </>
  )
}
