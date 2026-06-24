import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/features/auth/AuthContext';
import { FullScreenLoader } from '@/components/ui/Spinner';

// Guards routes by authentication + role, mirroring the original PrivateRoute.
export function ProtectedRoute({ allowedRoles = [], children }) {
  const { isAuthenticated, isLoading, role, user } = useAuth();
  const location = useLocation();

  if (isLoading) return <FullScreenLoader />;

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Block deactivated accounts when the flag is present on the user record.
  if (user && Object.prototype.hasOwnProperty.call(user, 'isActive') && !user.isActive) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}
