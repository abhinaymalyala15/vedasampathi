import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';

const Spinner = () => (
  <div className="fixed inset-0 flex items-center justify-center">
    <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin" />
  </div>
);

/** Redirect authenticated users to their role-based home portal */
export function getPortalPath(role) {
  if (role === 'admin') return '/admin';
  if (role === 'pathasala') return '/pathasala/dashboard';
  return '/dashboard';
}

export default function RoleRoute({ roles, unauthenticatedElement = <Navigate to="/login" replace /> }) {
  const { isAuthenticated, isLoadingAuth, authChecked, user } = useAuth();

  if (isLoadingAuth || !authChecked) return <Spinner />;

  if (!isAuthenticated) return unauthenticatedElement;

  if (roles?.length && !roles.includes(user?.role)) {
    return <Navigate to={getPortalPath(user?.role)} replace />;
  }

  return <Outlet />;
}
