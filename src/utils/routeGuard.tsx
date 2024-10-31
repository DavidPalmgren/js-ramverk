import { Navigate, Outlet } from 'react-router-dom'

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('Bearer')
  if (!token) {
    return <Navigate to="/login" />;
  }

  return children;
}

export default ProtectedRoute