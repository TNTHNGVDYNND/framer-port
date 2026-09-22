import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import useAuth from '../../hooks/useAuth';

// M-2/#31: auth state comes from the AuthProvider context (cookie-backed —
// bootstrapped from /api/users/profile server-side), never from localStorage.
const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) {
    return null; // brief mount-time gap while the profile bootstrap resolves
  }

  if (!isAuthenticated) {
    // Redirect to home if not authenticated
    return <Navigate to='/' replace />;
  }

  if (requireAdmin && !isAdmin) {
    // Redirect to home if not admin
    return <Navigate to='/' replace />;
  }

  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  requireAdmin: PropTypes.bool,
};

export default ProtectedRoute;
