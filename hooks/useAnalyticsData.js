
import { useEffect, useState } from 'react';

export const useAnalyticsData = (startDate, endDate) => {
  const [data, setData] = useState([]);
  const [totals, setTotals] = useState({ users: 0, posts: 0, views: 0, earnings: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!startDate || !endDate) return;

    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/analytics/admin/analytics?start=${startDate}&end=${endDate}`);
        const result = await res.json();
        setData(result.data || []);
        setTotals(result.totals || {});
      } catch (error) {
        console.error("Failed to fetch analytics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [startDate, endDate]);

  return { data, totals, loading };
};
