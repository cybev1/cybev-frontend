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

export default function AdminAnalytics() {
  const [data, setData] = useState(null)

  useEffect(() => {
    fetch('/api/analytics/posts-summary')
      .then(res => res.json())
      .then(json => setData(json))
      .catch(console.error)
  }, [])

  if (!data) return <div className="p-6">Loading analytics…</div>

  const { totalViews, totalShares, totalEarnings, totalBoosts, totalMints, history } = data
  const timeseries = history.map(item => ({
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
          <h1 className="text-2xl font-semibold">Admin Analytics Overview</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {[
              { title: 'Total Views', value: totalViews },
              { title: 'Total Shares', value: totalShares },
              { title: 'Total Earnings', value: `$${totalEarnings.toFixed(2)}` },
              { title: 'Total Boosts', value: totalBoosts },
              { title: 'Total Mints', value: totalMints },
            ].map((card) => (
              <div key={card.title} className="rounded-2xl shadow-2xl p-4 bg-white dark:bg-gray-800">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{card.title}</h3>
                <p className="mt-1 text-2xl font-semibold text-gray-900 dark:text-gray-100">{card.value}</p>
              </div>
            ))}
          </div>
          <div className="rounded-2xl shadow-2xl p-4 bg-white dark:bg-gray-800">
            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200 mb-4">Metrics Over Time</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={timeseries}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="views" />
                <Line type="monotone" dataKey="shares" />
                <Line type="monotone" dataKey="earnings" />
                <Line type="monotone" dataKey="boosts" />
                <Line type="monotone" dataKey="mints" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </main>
    </>
  )
}
