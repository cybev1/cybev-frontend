import { useEffect } from 'react';
import { useRouter } from 'next/router';

const withAuth = (WrappedComponent) => {
  const AuthComponent = (props) => {
    const router = useRouter();

    useEffect(() => {
      // Check if user is authenticated
      const token = localStorage.getItem('token');
      
      if (!token) {
        // Redirect to login if no token
        router.push('/auth/login');
      }
    }, [router]);

    return <WrappedComponent {...props} />;
  };

  return AuthComponent;
};

export default withAuth;