import { useState } from 'react'
import { ArrowUpLeft, CalendarCheck2, Clock3, FileText, MoreHorizontal, Phone, Plus, UserRound, UsersRound } from 'lucide-react'
import { useSession } from '../../auth/AuthProvider'

type AppointmentStatus = 'مؤكد' | 'في الانتظار' | 'تم الكشف'
type Appointment = { id: number; time: string; patient: string; doctor: string; specialty: string; status: AppointmentStatus; color: string }

const initialAppointments: Appointment[] = [
  { id: 1, time: '09:30', patient: 'سلمى أحمد', doctor: 'د. منى حسن', specialty: 'طب الأطفال', status: 'مؤكد', color: 'bg-sky-100 text-sky-700' },
  { id: 2, time: '10:15', patient: 'محمد عبد الله', doctor: 'د. أحمد محمد', specialty: 'الباطنة', status: 'في الانتظار', color: 'bg-amber-100 text-amber-700' },
  { id: 3, time: '11:00', patient: 'نورهان علي', doctor: 'د. خالد إبراهيم', specialty: 'أمراض القلب', status: 'تم الكشف', color: 'bg-emerald-100 text-emerald-700' },
  { id: 4, time: '12:30', patient: 'عمر محمود', doctor: 'د. سارة عبد الله', specialty: 'الجلدية', status: 'مؤكد', color: 'bg-sky-100 text-sky-700' },
]

export default function DashboardHome() {
  const { user } = useSession()
  const [appointments, setAppointments] = useState(initialAppointments)
  const completeNext = () => setAppointments(current => current.map((item, index) => index === 1 ? { ...item, status: 'تم الكشف' } : item))
  const stats = [
    { label: 'حجوزات اليوم', value: '24', detail: '+12% عن أمس', icon: CalendarCheck2, tone: 'text-brand-700 bg-brand-50' },
    { label: 'في الانتظار', value: '07', detail: 'متوسط الانتظار 12 د', icon: Clock3, tone: 'text-amber-700 bg-amber-50' },
    { label: 'تم الكشف', value: '13', detail: '54% من حجوزات اليوم', icon: FileText, tone: 'text-emerald-700 bg-emerald-50' },
    { label: 'مرضى جدد', value: '08', detail: 'هذا الأسبوع', icon: UsersRound, tone: 'text-sky-700 bg-sky-50' },
  ]
  return <div className="space-y-6">
    <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div><p className="text-sm font-semibold text-brand-700">الأحد، ٢٨ سبتمبر ٢٠٢٦</p><h1 className="mt-1 text-3xl font-bold tracking-tight">صباح الخير، {user?.displayName?.split(' ')[0] ?? 'فريق المركز'}</h1><p className="mt-2 text-slate-500">هذه نظرة سريعة على أداء المركز اليوم.</p></div>
      <button className="btn-primary"><Plus size={18} /> حجز موعد جديد</button>
    </header>
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map(({ label, value, detail, icon: Icon, tone }) => <div className="card" key={label}><div className="flex items-start justify-between"><span className={`grid h-10 w-10 place-items-center rounded-xl ${tone}`}><Icon size={19} /></span><ArrowUpLeft size={17} className="text-slate-300" /></div><p className="mt-5 text-sm text-slate-500">{label}</p><p className="mt-1 text-3xl font-bold text-slate-900">{value}</p><p className="mt-1 text-xs text-slate-400">{detail}</p></div>)}
    </section>
    <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
      <section className="card overflow-hidden p-0"><div className="flex items-center justify-between border-b border-slate-100 px-5 py-4"><div><h2 className="font-bold">مواعيد اليوم</h2><p className="mt-1 text-sm text-slate-500">الأحد، ٢٨ سبتمبر · ٢٤ موعدًا</p></div><button className="btn-ghost px-3 py-2 text-sm">عرض الكل</button></div><div className="divide-y divide-slate-100">{appointments.map(item => <div className="flex items-center gap-3 px-5 py-4" key={item.id}><span className="w-12 shrink-0 text-sm font-bold text-slate-700">{item.time}</span><span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-slate-100 text-sm font-bold text-slate-600">{item.patient.split(' ').map(part => part[0]).slice(0, 2).join('')}</span><div className="min-w-0 flex-1"><p className="truncate font-semibold">{item.patient}</p><p className="truncate text-xs text-slate-500">{item.doctor} · {item.specialty}</p></div><span className={`hidden rounded-full px-2.5 py-1 text-xs font-semibold sm:inline-flex ${item.color}`}>{item.status}</span><button aria-label="خيارات الموعد" className="text-slate-400 hover:text-slate-700"><MoreHorizontal size={18} /></button></div>)}</div></section>
      <section className="card"><div className="flex items-center justify-between"><div><h2 className="font-bold">إجراءات سريعة</h2><p className="mt-1 text-sm text-slate-500">اختصارات العمل اليومي</p></div><span className="text-xs font-semibold text-emerald-600">مفتوح الآن</span></div><div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-1"><button className="flex items-center gap-3 rounded-xl border border-slate-100 p-3 text-start hover:border-brand-200 hover:bg-brand-50"><span className="grid h-9 w-9 place-items-center rounded-lg bg-brand-50 text-brand-700"><UserRound size={18} /></span><span><b className="block text-sm">إضافة مريض</b><small className="text-xs text-slate-500">إنشاء ملف جديد</small></span></button><button onClick={completeNext} className="flex items-center gap-3 rounded-xl border border-slate-100 p-3 text-start hover:border-brand-200 hover:bg-brand-50"><span className="grid h-9 w-9 place-items-center rounded-lg bg-emerald-50 text-emerald-700"><CalendarCheck2 size={18} /></span><span><b className="block text-sm">إنهاء الزيارة التالية</b><small className="text-xs text-slate-500">تحديث حالة الموعد</small></span></button><button className="flex items-center gap-3 rounded-xl border border-slate-100 p-3 text-start hover:border-brand-200 hover:bg-brand-50"><span className="grid h-9 w-9 place-items-center rounded-lg bg-sky-50 text-sky-700"><Phone size={18} /></span><span><b className="block text-sm">اتصال بالمريض</b><small className="text-xs text-slate-500">الوصول إلى بيانات التواصل</small></span></button></div></section>
    </div>
  </div>
}
