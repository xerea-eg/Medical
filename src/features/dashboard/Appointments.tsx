import { CalendarDays, ChevronDown, Filter, Plus, Search } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useSession } from '../../auth/AuthProvider'
import { getAppointments as getLocalAppointments, type LocalAppointment } from './localClinic'
import { listAppointments } from '../../services/clinicStore'

export default function Appointments() {
  const { orgId, local } = useSession(); const [appointments, setAppointments] = useState<LocalAppointment[]>(() => local ? getLocalAppointments() : []); const [loading, setLoading] = useState(!local)
  useEffect(() => { if (local || !orgId) return; listAppointments(orgId).then(setAppointments).catch(() => setAppointments([])).finally(() => setLoading(false)) }, [local, orgId])
  return <div className="space-y-6">
    <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-sm font-semibold text-brand-700">إدارة الحجوزات</p><h1 className="mt-1 text-3xl font-bold">المواعيد</h1><p className="mt-2 text-slate-500">تابع جدول الأطباء وحالة كل زيارة من مكان واحد.</p></div><button className="btn-primary"><Plus size={18} /> حجز موعد</button></header>
    <div className="card flex flex-col gap-3 p-3 md:flex-row"><label className="relative flex-1"><Search className="absolute end-3 top-3 text-slate-400" size={18} /><input className="input py-2.5 pe-10" placeholder="ابحث باسم المريض أو الطبيب" /></label><button className="btn-ghost justify-between px-4 py-2.5"><CalendarDays size={17} /> اليوم، ٢٨ سبتمبر <ChevronDown size={16} /></button><button className="btn-ghost px-4 py-2.5"><Filter size={17} /> تصفية</button></div>
    <section className="card overflow-hidden p-0"><div className="overflow-x-auto"><table className="w-full min-w-[720px] text-start"><thead className="bg-slate-50 text-xs text-slate-500"><tr><th className="px-5 py-3 font-medium">الوقت</th><th className="px-5 py-3 font-medium">المريض</th><th className="px-5 py-3 font-medium">الطبيب</th><th className="px-5 py-3 font-medium">التخصص</th><th className="px-5 py-3 font-medium">الحالة</th><th className="px-5 py-3 font-medium">إجراء</th></tr></thead><tbody className="divide-y divide-slate-100">{loading ? <tr><td colSpan={6} className="p-8 text-center text-slate-500">جارٍ تحميل الحجوزات...</td></tr> : appointments.map(item => <tr className="hover:bg-slate-50" key={item.id}><td className="px-5 py-4 font-bold text-slate-700">{item.time}</td><td className="px-5 py-4"><p className="font-semibold">{item.patient}</p><p className="mt-1 text-xs text-slate-500">{item.phone}</p></td><td className="px-5 py-4 text-sm">{item.doctor}</td><td className="px-5 py-4 text-sm text-slate-500">{item.specialty}</td><td className="px-5 py-4"><span className="rounded-full bg-sky-100 px-2.5 py-1 text-xs font-semibold text-sky-700">{item.status}</span></td><td className="px-5 py-4"><Link to={`../medical/${item.patientId}`} className="text-sm font-semibold text-brand-700 hover:underline">فتح الملف الطبي</Link></td></tr>)}</tbody></table></div></section>
  </div>
}
