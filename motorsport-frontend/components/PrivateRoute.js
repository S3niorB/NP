import { useEffect } from 'react';
import { useRouter } from 'next/router';

const PrivateRoute = ({ children }) => {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    }
  }, [router]);

  return children;
};

export default PrivateRoute;
