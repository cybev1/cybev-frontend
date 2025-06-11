
import React, { useState, useEffect } from 'react';
import { Bot, BarChart2 } from 'lucide-react';

export default function AISummaryReport() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulated AI-generated summary
    setTimeout(() => {
      setSummary({
        totalPosts: 124,
        topUser: 'prince',
        highestEarningPost: 'How AI Will Change the World',
        mintPeak: 'June 6, 2025',
        insight: "User @prince leads in all metrics — earnings, boosts, and mints — accounting for over 32% of total platform engagement. Peak mint activity occurred post-token announcement on June 6. Web3-related articles generate 3x more engagement compared to others."
      });
      setLoading(false);
    }, 1500);
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4 flex items-center gap-2">
        <Bot size={28} /> AI Summary Report
      </h1>
      {loading ? (
        <p className="text-gray-500">🤖 Analyzing platform data...</p>
      ) : (
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 space-y-4">
          <p className="text-sm text-gray-400">📅 Generated on {new Date().toLocaleDateString()}</p>
          <p><strong>Total Posts:</strong> {summary.totalPosts}</p>
          <p><strong>Top Performing User:</strong> @{summary.topUser}</p>
          <p><strong>Top Earning Post:</strong> {summary.highestEarningPost}</p>
          <p><strong>Peak Minting Day:</strong> {summary.mintPeak}</p>
          <p className="text-gray-700 mt-4 border-t pt-4">{summary.insight}</p>
        </div>
      )}
    </div>
  );
}
