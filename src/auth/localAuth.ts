import type { Permission } from '../permissions/keys'

export type LocalRole = 'centerAdmin' | 'doctor'
export type LocalUser = { uid: string; email: string; displayName: string; role: LocalRole; orgId: string; permissions: Permission[]; password: string; mustChangePassword: boolean }

const USERS_KEY = 'xeria_demo_users'
const SESSION_KEY = 'xeria_demo_session'
const ALL_PERMISSIONS: Permission[] = ['patients.view', 'patients.create', 'patients.update', 'patients.delete', 'appointments.view', 'appointments.create', 'appointments.update', 'appointments.cancel', 'medical.view', 'medical.viewSensitive', 'diagnosis.create', 'prescription.create', 'attachments.view', 'attachments.upload', 'attachments.delete', 'billing.view', 'payments.create', 'reports.view', 'users.manage', 'roles.manage', 'doctors.manage', 'specialties.manage', 'articles.manage', 'settings.manage', 'audit.view']
const DOCTOR_PERMISSIONS: Permission[] = ['patients.view', 'patients.update', 'appointments.view', 'medical.view', 'medical.viewSensitive', 'diagnosis.create', 'prescription.create', 'attachments.view', 'attachments.upload']
const defaults: LocalUser[] = [
  { uid: 'local-admin', email: 'xereaeg@gmail.com', displayName: 'مدير المركز', role: 'centerAdmin', orgId: 'demo', permissions: ALL_PERMISSIONS, password: '112233', mustChangePassword: true },
  { uid: 'local-doctor', email: 'doctor@xeria-eg.com', displayName: 'د. أحمد محمد', role: 'doctor', orgId: 'demo', permissions: DOCTOR_PERMISSIONS, password: '112233', mustChangePassword: true },
]

function readUsers(): LocalUser[] {
  const saved = localStorage.getItem(USERS_KEY)
  if (!saved) { localStorage.setItem(USERS_KEY, JSON.stringify(defaults)); return defaults }
  return JSON.parse(saved) as LocalUser[]
}
function writeUsers(users: LocalUser[]) { localStorage.setItem(USERS_KEY, JSON.stringify(users)) }
export function localSession(): LocalUser | null { const uid = localStorage.getItem(SESSION_KEY); return uid ? readUsers().find(user => user.uid === uid) ?? null : null }
export function localLogin(email: string, password: string): LocalUser { const user = readUsers().find(item => item.email.toLowerCase() === email.trim().toLowerCase() && item.password === password); if (!user) throw new Error('بيانات الحساب التجريبي غير صحيحة.'); localStorage.setItem(SESSION_KEY, user.uid); return user }
export function localChangePassword(uid: string, password: string) { const users = readUsers().map(user => user.uid === uid ? { ...user, password, mustChangePassword: false } : user); writeUsers(users); window.dispatchEvent(new Event('local-session-changed')) }
export function localLogout() { localStorage.removeItem(SESSION_KEY); window.dispatchEvent(new Event('local-session-changed')) }
export function localUsers() { return readUsers() }
export function localCreateUser(displayName: string, email: string, role: LocalRole): LocalUser {
  const users = readUsers()
  if (users.some(user => user.email.toLowerCase() === email.trim().toLowerCase())) throw new Error('هذا البريد مستخدم بالفعل.')
  const user: LocalUser = { uid: `local-${Date.now()}`, email: email.trim(), displayName: displayName.trim(), role, orgId: 'demo', permissions: role === 'centerAdmin' ? ALL_PERMISSIONS : DOCTOR_PERMISSIONS, password: '112233', mustChangePassword: true }
  writeUsers([...users, user]); return user
}
export function localDeleteUser(uid: string) { writeUsers(readUsers().filter(user => user.uid !== uid)) }
