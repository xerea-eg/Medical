import { createContext, useContext, useEffect, useRef, useState, ReactNode } from 'react'
import { onAuthStateChanged, signOut, User } from 'firebase/auth'
import { auth } from '../firebase/config'
import type { Permission } from '../permissions/keys'
import { localLogout, localSession, type LocalUser } from './localAuth'
type SessionUser = User | Pick<LocalUser, 'uid' | 'displayName' | 'email'>
type Session = { user: SessionUser | null; orgId: string | null; role: string | null; permissions: Permission[]; loading: boolean; local: boolean; mustChangePassword: boolean; logout: () => Promise<void> }
const Ctx = createContext<Session>(null as unknown as Session)
export const useSession = () => useContext(Ctx)
const IDLE_MS = 15 * 60 * 1000 // Session timeout للأجهزة المشتركة
export function AuthProvider({ children }: { children: ReactNode }) {
  const [s, setS] = useState<Omit<Session, 'logout'>>({ user: null, orgId: null, role: null, permissions: [], loading: true, local: false, mustChangePassword: false })
  const timer = useRef<number>()
  useEffect(() => {
    const local = import.meta.env.VITE_USE_LOCAL_DEMO === 'true' ? localSession() : null
    if (local) { setS({ user: local, orgId: local.orgId, role: local.role, permissions: local.permissions, loading: false, local: true, mustChangePassword: local.mustChangePassword }); return }
    return onAuthStateChanged(auth, async (user) => {
    if (!user) return setS({ user: null, orgId: null, role: null, permissions: [], loading: false, local: false, mustChangePassword: false })
    const t = await user.getIdTokenResult() // Custom Claims تُضبط من Cloud Function فقط
    setS({ user, orgId: (t.claims.orgId as string) ?? null, role: (t.claims.role as string) ?? null,
      permissions: (t.claims.perms as Permission[]) ?? [], loading: false, local: false, mustChangePassword: false })
    })
  }, [])
  useEffect(() => { if (import.meta.env.VITE_USE_LOCAL_DEMO !== 'true') return; const sync = () => { const local = localSession(); if (local) setS({ user: local, orgId: local.orgId, role: local.role, permissions: local.permissions, loading: false, local: true, mustChangePassword: local.mustChangePassword }); else if (s.local) setS({ user: null, orgId: null, role: null, permissions: [], loading: false, local: false, mustChangePassword: false }) }; window.addEventListener('local-session-changed', sync); return () => window.removeEventListener('local-session-changed', sync) }, [s.local])
  useEffect(() => {
    if (!s.user || s.local) return
    const reset = () => { window.clearTimeout(timer.current); timer.current = window.setTimeout(() => signOut(auth), IDLE_MS) }
    const ev = ['click','keydown','touchstart']; ev.forEach(e => window.addEventListener(e, reset)); reset()
    return () => { ev.forEach(e => window.removeEventListener(e, reset)); window.clearTimeout(timer.current) }
  }, [s.user])
  return <Ctx.Provider value={{ ...s, logout: async () => { if (s.local) localLogout(); else await signOut(auth) } }}>{children}</Ctx.Provider>
}
