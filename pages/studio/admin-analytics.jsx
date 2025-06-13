import { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { motion } from 'framer-motion'
import * as XLSX from 'xlsx'

function Header() {
  return (
    <header className="p-4 bg-white dark:bg-gray-900 shadow">
      <div className="container mx-auto flex items-center justify-between">
        <a href="/studio" className="text-xl font-bold text-gray-800 dark:text-gray-100">
          CYBEV Studio
        </a>
      </div>
    </header>
  )
}

export default function AdminAnalytics() {
  const [data, setData] = useState(null)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  const fetchData = () => {
    let url = '/api/analytics/posts-summary'
    const params = []
    if (startDate) params.push(`start=${startDate}`)
    if (endDate) params.push(`end=${endDate}`)
    if (params.length) url += `?${params.join('&')}`
    fetch(url)
      .then(res => res.json())
      .then(json => setData(json))
      .catch(console.error)
  }

  useEffect(() => {
    fetchData()
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

  // CSV Export
  const exportCsv = () => {
    const headers = ['date', 'views', 'shares', 'earnings', 'boosts', 'mints']
    const rows = timeseries.map(row => headers.map(h => row[h]).join(','))
    const csvContent = [headers.join(','), ...rows].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const urlCsv = URL.createObjectURL(blob)
    const linkCsv = document.createElement('a')
    linkCsv.setAttribute('href', urlCsv)
    linkCsv.setAttribute('download', 'admin_analytics.csv')
    document.body.appendChild(linkCsv)
    linkCsv.click()
    document.body.removeChild(linkCsv)
  }

  // Excel Export
  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(timeseries)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Analytics')
    XLSX.writeFile(wb, 'admin_analytics.xlsx')
  }

  return (
    <>
      <Header />
      <main className="p-6 bg-gray-50 min-h-screen space-y-8">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
          <h1 className="text-2xl font-semibold mb-4">Admin Analytics Overview</h1>

          {/* Date range filters */}
          <div className="flex items-center space-x-4 mb-6">
            <div>
              <label className="block text-gray-700 dark:text-gray-300 text-sm">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="mt-1 p-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-gray-700 dark:text-gray-300 text-sm">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="mt-1 p-2 border rounded-lg"
              />
            </div>
            <button
              onClick={fetchData}
              className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg shadow"
            >
              Apply Filter
            </button>
            <button
              onClick={exportCsv}
              className="mt-6 px-4 py-2 bg-green-600 text-white rounded-lg shadow"
            >
              Export CSV
            </button>
            <button
              onClick={exportExcel}
              className="mt-6 px-4 py-2 bg-indigo-600 text-white rounded-lg shadow"
            >
              Export Excel
            </button>
          </div>

          {/* Summary cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-6">
            {[
              { title: 'Total Views', value: totalViews },
              { title: 'Total Shares', value: totalShares },
              { title: 'Total Earnings', value: `$${totalEarnings.toFixed(2)}` },
              { title: 'Total Boosts', value: totalBoosts },
              { title: 'Total Mints', value: totalMints },
            ].map((card) => (
              <div key={card.title} className="rounded-2xl shadow-2xl p-4 bg-white dark:bg-gray-800 cursor-pointer">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{card.title}</h3>
                <p className="mt-1 text-2xl font-semibold text-gray-900 dark:text-gray-100">{card.value}</p>
              </div>
            ))}
          </div>

          {/* Metrics Over Time */}
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
