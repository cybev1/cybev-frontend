import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import Navbar from '@/components/Navbar'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { motion } from 'framer-motion'

export default function PostAnalytics() {
  const { query } = useRouter()
  const { postId } = query
  const [data, setData] = useState(null)

  useEffect(() => {
    if (!postId) return
    fetch(`/api/analytics/post/${postId}`)
      .then(res => res.json())
      .then(json => setData(json))
      .catch(console.error)
  }, [postId])

  if (!data) return <div className="p-6">Loading analytics…</div>

  // Prepare time-series for chart
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
      <Navbar />
      <main className="p-6 bg-gray-50 min-h-screen">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }} className="space-y-8">
          <h1 className="text-2xl font-semibold">Analytics for Post {postId}</h1>

          {/* Summary cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="rounded-2xl shadow-2xl p-4">
              <CardHeader title="Total Views" />
              <CardContent>{data.views}</CardContent>
            </Card>
            <Card className="rounded-2xl shadow-2xl p-4">
              <CardHeader title="Total Shares" />
              <CardContent>{data.shares}</CardContent>
            </Card>
            <Card className="rounded-2xl shadow-2xl p-4">
              <CardHeader title="Total Earnings" />
              <CardContent>${data.earnings.toFixed(2)}</CardContent>
            </Card>
            <Card className="rounded-2xl shadow-2xl p-4">
              <CardHeader title="Total Boosts" />
              <CardContent>{data.boosts}</CardContent>
            </Card>
          </div>

          {/* Engagement over time chart */}
          <Card className="rounded-2xl shadow-2xl p-4">
            <CardHeader title="Engagement Over Time" />
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={timeseries}>
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="views" />
                  <Line type="monotone" dataKey="shares" />
                  <Line type="monotone" dataKey="earnings" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </>
  )
}
