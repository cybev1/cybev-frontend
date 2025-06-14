import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { DollarSign } from 'lucide-react';

export default function TokenBalance() {
  const [balance, setBalance] = useState(null);

  useEffect(() => {
    axios.get('/api/user/balance')
      .then(res => setBalance(res.data.balance))
      .catch(err => console.error('Error fetching balance:', err));
  }, []);

  if (balance === null) return null;

  return (
    <div className="flex items-center space-x-1 p-2">
      <DollarSign className="w-5 h-5 text-yellow-500" />
      <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
        {balance} CYBV
      </span>
    </div>
  );
}
