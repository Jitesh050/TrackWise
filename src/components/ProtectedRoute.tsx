
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireRole?: 'admin' | 'user';
}

const ProtectedRoute = ({ children, requireRole }: ProtectedRouteProps) => {
  return <>{children}</>;
};

export default ProtectedRoute;
