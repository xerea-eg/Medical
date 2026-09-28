import { createContext, useContext, useEffect, useRef, useState, ReactNode } from 'react'
import { onAuthStateChanged, signOut, User } from 'firebase/auth'
import { auth } from '../firebase/config'
import type { Permission } from '../permissions/keys'
type Session = { user: User | null; orgId: string | null; role: string | null; permissions: Permission[]; loading: boolean; logout: () => Promise<void> }
const Ctx = createContext<Session>(null as unknown as Session)
export const useSession = () => useContext(Ctx)
const IDLE_MS = 15 * 60 * 1000 // Session timeout للأجهزة المشتركة
export function AuthProvider({ children }: { children: ReactNode }) {
  const [s, setS] = useState<Omit<Session, 'logout'>>({ user: null, orgId: null, role: null, permissions: [], loading: true })
  const timer = useRef<number>()
  useEffect(() => onAuthStateChanged(auth, async (user) => {
    if (!user) return setS({ user: null, orgId: null, role: null, permissions: [], loading: false })
    const t = await user.getIdTokenResult() // Custom Claims تُضبط من Cloud Function فقط
    setS({ user, orgId: (t.claims.orgId as string) ?? null, role: (t.claims.role as string) ?? null,
      permissions: (t.claims.perms as Permission[]) ?? [], loading: false })
  }), [])
  useEffect(() => {
    if (!s.user) return
    const reset = () => { window.clearTimeout(timer.current); timer.current = window.setTimeout(() => signOut(auth), IDLE_MS) }
    const ev = ['click','keydown','touchstart']; ev.forEach(e => window.addEventListener(e, reset)); reset()
    return () => { ev.forEach(e => window.removeEventListener(e, reset)); window.clearTimeout(timer.current) }
  }, [s.user])
  return <Ctx.Provider value={{ ...s, logout: () => signOut(auth) }}>{children}</Ctx.Provider>
}
