import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'
import Loading from '@/components/ui/Loading'

const ProtectedAdminRoute = ({ children }) => {
  const { user, isAuthenticated } = useSelector((state) => state.user)
  
  // Show loading while authentication is being determined
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading />
      </div>
    )
  }
  
  // Redirect to home if not authenticated or not admin
  if (!isAuthenticated || !user || user.role_c !== 'admin') {
    return <Navigate to="/" replace />
  }
  
  return children
}

export default ProtectedAdminRoute