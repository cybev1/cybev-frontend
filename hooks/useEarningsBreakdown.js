
import { useEffect, useState } from 'react';

export const useEarningsBreakdown = (startDate, endDate) => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!startDate || !endDate) return;

    const fetchBreakdown = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/analytics/earnings-breakdown?start=${startDate}&end=${endDate}`);
        const result = await res.json();
        setData(result || {});
      } catch (error) {
        console.error("Failed to fetch earnings breakdown:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBreakdown();
  }, [startDate, endDate]);

  return { data, loading };
};
