import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';

const AdminRouteGuard = ({ children }) => {
  const { user } = useAuth();

  if (!user || user.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default AdminRouteGuard;
