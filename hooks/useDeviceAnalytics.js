
import { useEffect, useState } from 'react';

export const useDeviceAnalytics = (startDate, endDate) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!startDate || !endDate) return;

    const fetchDeviceAnalytics = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/analytics/devices?start=${startDate}&end=${endDate}`);
        const result = await res.json();
        setData(result.data || []);
      } catch (error) {
        console.error("Failed to fetch device analytics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDeviceAnalytics();
  }, [startDate, endDate]);

  return { data, loading };
};
