import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import AuthGuard from '../api/accessControl';

interface AuthReturn {
  userId: number | null;
  isAuthenticated: boolean;
  logout: () => void;
}

export const useAuth = (): AuthReturn => {
  const navigate = useNavigate();
  const [cookies, setCookie, removeCookie] = useCookies(['id']);

  useEffect(() => {
    const checkAuth = async () => {
      if (!cookies.id || !(await AuthGuard(cookies.id))) {
        navigate('/');
      }
    };
    checkAuth();
  }, [cookies.id, navigate]);

  const logout = () => {
    removeCookie('id');
    navigate('/');
  };

  return {
    userId: cookies.id || null,
    isAuthenticated: !!cookies.id,
    logout
  };
}