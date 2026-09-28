import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { LayoutDashboard, CalendarDays, Users, Stethoscope, Settings, Layers, LogOut, UserCog, ClipboardList, Newspaper, ArrowRight, FileHeart } from 'lucide-react'
import { Logo } from '../components/Logo'
import { useSession } from '../auth/AuthProvider'
import type { Permission } from '../permissions/keys'
// القائمة تُبنى من الصلاحيات وليس من اسم الدور
const NAV: { to: string; label: string; icon: typeof Users; perm?: Permission }[] = [
  { to: '/app', label: 'الرئيسية', icon: LayoutDashboard },
  { to: '/app/appointments', label: 'الحجوزات', icon: CalendarDays, perm: 'appointments.view' },
  { to: '/app/medical', label: 'الملفات الطبية', icon: FileHeart, perm: 'medical.view' },
  { to: '/app/patients', label: 'المرضى', icon: Users, perm: 'patients.view' },
  { to: '/app/users', label: 'المستخدمون', icon: UserCog, perm: 'users.manage' },
  { to: '/app/doctors', label: 'الأطباء', icon: Stethoscope, perm: 'doctors.manage' },
  { to: '/app/nursing', label: 'قسم التمريض', icon: ClipboardList, perm: 'patients.update' },
  { to: '/app/specialties', label: 'التخصصات', icon: Layers, perm: 'specialties.manage' },
  { to: '/app/articles', label: 'المجلة الطبية', icon: Newspaper, perm: 'articles.manage' },
  { to: '/app/settings', label: 'الإعدادات', icon: Settings, perm: 'settings.manage' }]
export default function DashboardLayout() {
  const { permissions, logout } = useSession()
  const isDemo = useLocation().pathname.startsWith('/demo')
  const items = NAV.filter(n => isDemo || !n.perm || permissions.includes(n.perm)).map(item => ({ ...item, to: isDemo ? item.to.replace('/app', '/demo') : item.to }))
  return (<div className="min-h-screen md:flex">
    <aside className="hidden md:flex w-64 flex-col gap-1 bg-white border-e border-brand-100 p-4">
      <div className="mb-6 px-2"><Logo /></div>
      {items.map(({ to, label, icon: I }) => <NavLink key={to} to={to} end={to === '/app'}
        className={({ isActive }) => `flex items-center gap-3 rounded-xl px-3 py-2.5 font-medium ${isActive ? 'bg-brand-50 text-brand-700' : 'text-slate-600 hover:bg-slate-50'}`}><I size={18} />{label}</NavLink>)}
      <NavLink to={isDemo ? '/demo' : '/app'} className="mt-auto flex items-center gap-3 px-3 py-2.5 text-slate-500"><ArrowRight size={18} />العودة للرئيسية</NavLink>
      <button onClick={logout} className="flex items-center gap-3 px-3 py-2.5 text-slate-500"><LogOut size={18} />خروج</button>
    </aside>
    <main className="flex-1 p-4 md:p-8 pb-24 md:pb-8"><Outlet /></main>
    <nav className="md:hidden fixed bottom-0 inset-x-0 bg-white border-t border-brand-100 flex justify-around py-2" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
      {items.slice(0, 5).map(({ to, label, icon: I }) => <NavLink key={to} to={to} end={to === '/app'}
        className={({ isActive }) => `flex flex-col items-center text-xs gap-1 ${isActive ? 'text-brand-700' : 'text-slate-500'}`}><I size={20} />{label}</NavLink>)}
    </nav></div>)
}
