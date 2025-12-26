import axios from 'axios';

const getUserProfile = async () => {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('No authentication token found');
    }

    // Phase 0 stabilization: use env-based API base URL with a local fallback
    // Example: NEXT_PUBLIC_API_URL=http://localhost:5000
    const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

    const response = await axios.get(`${API_BASE}/api/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

export default getUserProfile;