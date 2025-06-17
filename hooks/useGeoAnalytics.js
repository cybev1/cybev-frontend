
import { useEffect, useState } from 'react';

export const useGeoAnalytics = (startDate, endDate) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!startDate || !endDate) return;

    const fetchGeoAnalytics = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/analytics/geo?start=${startDate}&end=${endDate}`);
        const result = await res.json();
        setData(result.data || []);
      } catch (error) {
        console.error("Failed to fetch geo analytics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGeoAnalytics();
  }, [startDate, endDate]);

  return { data, loading };
};
