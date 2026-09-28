import { CalendarDays, ChevronDown, Filter, Plus, Search } from 'lucide-react'

const appointments = [
  { time: '09:30', patient: 'سلمى أحمد', phone: '010 1234 5678', doctor: 'د. منى حسن', specialty: 'الأطفال', status: 'مؤكد', tone: 'bg-sky-100 text-sky-700' },
  { time: '10:15', patient: 'محمد عبد الله', phone: '011 9876 5432', doctor: 'د. أحمد محمد', specialty: 'الباطنة', status: 'في الانتظار', tone: 'bg-amber-100 text-amber-700' },
  { time: '11:00', patient: 'نورهان علي', phone: '012 3456 7890', doctor: 'د. خالد إبراهيم', specialty: 'القلب', status: 'تم الكشف', tone: 'bg-emerald-100 text-emerald-700' },
  { time: '12:30', patient: 'عمر محمود', phone: '010 7788 9900', doctor: 'د. سارة عبد الله', specialty: 'الجلدية', status: 'مؤكد', tone: 'bg-sky-100 text-sky-700' },
  { time: '13:15', patient: 'ليلى حسن', phone: '011 2233 4455', doctor: 'د. محمود سمير', specialty: 'العظام', status: 'ملغي', tone: 'bg-rose-100 text-rose-700' },
]

export default function Appointments() {
  return <div className="space-y-6">
    <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-sm font-semibold text-brand-700">إدارة الحجوزات</p><h1 className="mt-1 text-3xl font-bold">المواعيد</h1><p className="mt-2 text-slate-500">تابع جدول الأطباء وحالة كل زيارة من مكان واحد.</p></div><button className="btn-primary"><Plus size={18} /> حجز موعد</button></header>
    <div className="card flex flex-col gap-3 p-3 md:flex-row"><label className="relative flex-1"><Search className="absolute end-3 top-3 text-slate-400" size={18} /><input className="input py-2.5 pe-10" placeholder="ابحث باسم المريض أو الطبيب" /></label><button className="btn-ghost justify-between px-4 py-2.5"><CalendarDays size={17} /> اليوم، ٢٨ سبتمبر <ChevronDown size={16} /></button><button className="btn-ghost px-4 py-2.5"><Filter size={17} /> تصفية</button></div>
    <section className="card overflow-hidden p-0"><div className="overflow-x-auto"><table className="w-full min-w-[720px] text-start"><thead className="bg-slate-50 text-xs text-slate-500"><tr><th className="px-5 py-3 font-medium">الوقت</th><th className="px-5 py-3 font-medium">المريض</th><th className="px-5 py-3 font-medium">الطبيب</th><th className="px-5 py-3 font-medium">التخصص</th><th className="px-5 py-3 font-medium">الحالة</th><th className="px-5 py-3 font-medium">إجراء</th></tr></thead><tbody className="divide-y divide-slate-100">{appointments.map(item => <tr className="hover:bg-slate-50" key={`${item.time}-${item.patient}`}><td className="px-5 py-4 font-bold text-slate-700">{item.time}</td><td className="px-5 py-4"><p className="font-semibold">{item.patient}</p><p className="mt-1 text-xs text-slate-500">{item.phone}</p></td><td className="px-5 py-4 text-sm">{item.doctor}</td><td className="px-5 py-4 text-sm text-slate-500">{item.specialty}</td><td className="px-5 py-4"><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${item.tone}`}>{item.status}</span></td><td className="px-5 py-4"><button className="text-sm font-semibold text-brand-700 hover:underline">فتح الملف</button></td></tr>)}</tbody></table></div></section>
  </div>
}
