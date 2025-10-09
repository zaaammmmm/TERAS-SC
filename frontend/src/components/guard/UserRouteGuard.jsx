import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';

const UserRouteGuard = ({ children }) => {
  const { user } = useAuth();

  if (!user || user.role !== 'user') {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default UserRouteGuard;
