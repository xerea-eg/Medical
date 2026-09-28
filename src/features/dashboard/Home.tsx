import { useSession } from '../../auth/AuthProvider'
export default function DashboardHome() {
  const { user, role } = useSession()
  return (<div><h1 className="text-2xl font-bold">مرحبًا {user?.displayName ?? ''}</h1>
    <p className="mt-1 text-slate-500">الدور: {role}</p>
    <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {['حجوزات اليوم', 'في الانتظار', 'تم الكشف', 'لم يحضر'].map(t => <div key={t} className="card"><p className="text-slate-500 text-sm">{t}</p><p className="text-3xl font-bold mt-2 text-brand-700">0</p></div>)}</div></div>)
}
