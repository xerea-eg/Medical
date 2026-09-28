import { Navigate, Outlet } from 'react-router-dom'
import { useSession } from './AuthProvider'
export function RequireAuth() {
  const { user, loading } = useSession()
  if (loading) return <div className="p-10 text-center text-slate-500">جارٍ التحميل…</div>
  return user ? <Outlet /> : <Navigate to="/login" replace />
}
