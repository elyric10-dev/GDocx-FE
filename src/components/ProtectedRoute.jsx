import { Navigate, useLocation } from 'react-router-dom'
import AppShell from './AppShell'
import { useAuth } from '../context/AuthContext'

function LoadingScreen() {
  return (
    <AppShell>
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-9 w-9 animate-spin rounded-full border-4 border-[#4285f4] border-t-transparent" />
      </div>
    </AppShell>
  )
}

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return <LoadingScreen />
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return <AppShell>{children}</AppShell>
}
