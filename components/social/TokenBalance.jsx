import React from 'react';
import useSWR from 'swr';
import axios from 'axios';
import { DollarSign } from 'lucide-react';

const fetcher = url => axios.get(url).then(res => res.data);

export default function TokenBalance() {
  const { data, error } = useSWR('/api/user/balance', fetcher);

  if (error) return null;
  if (!data) return null;

  return (
    <div className="flex items-center space-x-1 p-2">
      <DollarSign className="w-5 h-5 text-yellow-500" />
      <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
        {data.balance} CYBV
      </span>
    </div>
  );
}
