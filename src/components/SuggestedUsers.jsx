```javascript
import { useState, useEffect } from 'react';
import Link from 'next/link';
import FollowButton from './FollowButton';
import { followAPI } from '@/lib/api';
import { Users } from 'lucide-react';

export default function SuggestedUsers({ limit = 5 }) {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSuggestions();
  }, []);

  const fetchSuggestions = async () => {
    try {
      const { data } = await followAPI.getSuggestions({ limit });
      setSuggestions(data.suggestions);
    } catch (error) {
      console.error('Failed to fetch suggestions:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      
        
          
          Suggested Users
        
        
          {[1, 2, 3].map(i => (
            
              
              
                
                
              
            
          ))}
        
      
    );
  }

  if (suggestions.length === 0) {
    return null;
  }

  return (
    
      
        
        Suggested Users
      
      
        {suggestions.map(user => (
          
            
              
                <img
                  src={user.avatar || '/default-avatar.png'}
                  alt={user.username}
                  className="w-10 h-10 rounded-full"
                />
                
                  {user.username}
                  
                    {user.followerCount || 0} followers
                  
                
              
            
            
          
        ))}
      
    
  );
}
```

---

### Add Suggested Users to Dashboard/Sidebar
