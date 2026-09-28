import { ReactNode } from 'react'
import { useSession } from '../auth/AuthProvider'
import type { Permission } from './keys'
export const useCan = () => { const { permissions } = useSession(); return (p: Permission) => permissions.includes(p) }
// واجهة فقط؛ الحماية الحقيقية في Security Rules
export const Can = ({ perm, children }: { perm: Permission; children: ReactNode }) => useCan()(perm) ? <>{children}</> : null
