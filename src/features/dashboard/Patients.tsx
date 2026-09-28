import { Download, MoreHorizontal, Plus, Search, UserRound } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useState } from 'react'

const patients = [
  { initials: 'سأ', name: 'سلمى أحمد', id: 'PT-1024', phone: '010 1234 5678', age: '8 سنوات', lastVisit: 'اليوم، 09:30', type: 'متابعة' },
  { initials: 'مع', name: 'محمد عبد الله', id: 'PT-1023', phone: '011 9876 5432', age: '42 سنة', lastVisit: 'اليوم، 10:15', type: 'كشف جديد' },
  { initials: 'نع', name: 'نورهان علي', id: 'PT-1022', phone: '012 3456 7890', age: '35 سنة', lastVisit: 'اليوم، 11:00', type: 'متابعة' },
  { initials: 'عم', name: 'عمر محمود', id: 'PT-1021', phone: '010 7788 9900', age: '29 سنة', lastVisit: 'أمس، 16:20', type: 'كشف جديد' },
  { initials: 'لح', name: 'ليلى حسن', id: 'PT-1020', phone: '011 2233 4455', age: '51 سنة', lastVisit: '25 سبتمبر', type: 'متابعة' },
]

export default function Patients() {
  const [search, setSearch] = useState('')
  const [department, setDepartment] = useState('الكل')
  const [status, setStatus] = useState('الكل')
  const filtered = patients.filter(item => `${item.name} ${item.id} ${item.phone}`.includes(search) && (department === 'الكل' || item.type === department) && (status === 'الكل' || (status === 'نشط' && item.lastVisit.includes('اليوم')) || (status === 'متابعة' && item.type === 'متابعة')))
  return <div className="space-y-6">
    <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-sm font-semibold text-brand-700">سجل المركز</p><h1 className="mt-1 text-3xl font-bold">المرضى</h1><p className="mt-2 text-slate-500">ملفات المرضى، الزيارات السابقة، وبيانات التواصل.</p></div><div className="flex gap-2"><button className="btn-ghost"><Download size={18} /> تصدير</button><button className="btn-primary"><Plus size={18} /> إضافة مريض</button></div></header>
    <div className="card flex flex-col gap-3 p-3 lg:flex-row"><label className="relative flex-1"><Search className="absolute end-3 top-3 text-slate-400" size={18} /><input value={search} onChange={e => setSearch(e.target.value)} className="input py-2.5 pe-10" placeholder="ابحث بالاسم أو رقم الملف أو الهاتف" /></label><select value={department} onChange={e => setDepartment(e.target.value)} className="input py-2.5 lg:w-40"><option>الكل</option><option>متابعة</option><option>كشف جديد</option></select><select value={status} onChange={e => setStatus(e.target.value)} className="input py-2.5 lg:w-32"><option>الكل</option><option>نشط</option><option>متابعة</option></select><div className="flex items-center gap-2 px-2 text-sm text-slate-500"><UserRound size={17} /> {filtered.length} نتائج</div></div>
    <section className="card overflow-hidden p-0"><div className="overflow-x-auto"><table className="w-full min-w-[720px] text-start"><thead className="bg-slate-50 text-xs text-slate-500"><tr><th className="px-5 py-3 font-medium">المريض</th><th className="px-5 py-3 font-medium">رقم الملف</th><th className="px-5 py-3 font-medium">الهاتف</th><th className="px-5 py-3 font-medium">العمر</th><th className="px-5 py-3 font-medium">آخر زيارة</th><th className="px-5 py-3 font-medium"></th></tr></thead><tbody className="divide-y divide-slate-100">{filtered.map(item => <tr className="hover:bg-slate-50" key={item.id}><td className="px-5 py-4"><div className="flex items-center gap-3"><span className="grid h-9 w-9 place-items-center rounded-full bg-brand-50 text-xs font-bold text-brand-700">{item.initials}</span><div><Link to={`../patients/${item.id}`} className="font-semibold hover:text-brand-700">{item.name}</Link><p className="mt-1 text-xs text-slate-500">{item.type}</p></div></div></td><td className="px-5 py-4 text-sm font-medium text-slate-600">{item.id}</td><td className="px-5 py-4 text-sm text-slate-500">{item.phone}</td><td className="px-5 py-4 text-sm text-slate-500">{item.age}</td><td className="px-5 py-4 text-sm text-slate-500">{item.lastVisit}</td><td className="px-5 py-4 text-end"><button aria-label={`خيارات ${item.name}`} className="text-slate-400 hover:text-slate-700"><MoreHorizontal size={18} /></button></td></tr>)}</tbody></table></div></section>
  </div>
}
