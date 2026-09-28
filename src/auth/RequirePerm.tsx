import { Navigate, Outlet } from 'react-router-dom'
import { useSession } from './AuthProvider'
import type { Permission } from '../permissions/keys'
export const RequirePerm = ({ perm }: { perm: Permission }) => useSession().permissions.includes(perm) ? <Outlet /> : <Navigate to="/app" replace />
