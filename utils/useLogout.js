import { useRouter } from 'next/router';

export default function useLogout() {
  const router = useRouter();

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  return logout;
}