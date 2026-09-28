import { Link, useParams, useSearchParams } from 'react-router-dom'
import { Avatar, Page, fmtTime } from '../../components/ui'
import { doctors, doctor, spec, specialties, DemoDoctor } from './demoData'
import { DAY_LABELS } from '../../utils/slots'
const days = (d: DemoDoctor) => d.schedule.days.slice().sort().map(i => DAY_LABELS[i]).join('، ')
export function DoctorCard({ d }: { d: DemoDoctor }) {
  const s = spec(d.specialtyId)!
  return (<div className="card flex flex-col gap-3">
    <div className="flex gap-3 items-center"><Avatar name={d.name} hue={s.hue} /><div><p className="font-bold">{d.name}</p><p className="text-sm text-slate-500">{d.title}</p></div></div>
    <p className="text-sm text-slate-600">{d.bio}</p>
    <p className="text-sm"><span className="text-brand-700 font-medium">{s.name}</span> · {days(d)} · {fmtTime(d.schedule.from)} – {fmtTime(d.schedule.to)}</p>
    {d.showFee && <p className="text-sm">سعر الكشف: <b>{d.fee} ج.م</b></p>}
    <div className="flex gap-2 mt-auto"><Link to={`/doctors/${d.id}`} className="btn-ghost flex-1 !py-2">عرض الملف</Link><Link to={`/book?doctor=${d.id}`} className="btn-primary flex-1 !py-2">احجز موعد</Link></div></div>)
}
export default function Doctors() {
  const [sp, setSp] = useSearchParams(); const f = sp.get('spec') ?? ''
  const list = doctors.filter(d => !f || d.specialtyId === f)
  return (<Page title="أطباؤنا" sub="اختر الطبيب المناسب واحجز موعدك في دقائق.">
    <div className="flex flex-wrap gap-2 mb-6">{[{ id: '', name: 'الكل' }, ...specialties].map(s => <button key={s.id} onClick={() => setSp(s.id ? { spec: s.id } : {})}
      className={`rounded-xl px-4 py-2 text-sm border ${f === s.id ? 'bg-brand-700 text-white border-brand-700' : 'bg-white border-brand-100 text-slate-600'}`}>{s.name}</button>)}</div>
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{list.map(d => <DoctorCard key={d.id} d={d} />)}</div></Page>)
}
export function DoctorProfile() {
  const d = doctor(useParams().id ?? ''); if (!d) return <Page title="الطبيب غير موجود"><Link to="/doctors" className="btn-ghost">العودة للأطباء</Link></Page>
  const s = spec(d.specialtyId)!
  return (<Page title={d.name} sub={d.title}><div className="grid md:grid-cols-3 gap-6">
    <div className="card md:col-span-2 space-y-4"><div className="flex items-center gap-4"><Avatar name={d.name} size={88} hue={s.hue} /><div><p className="text-brand-700 font-semibold">{s.name}</p><p className="text-slate-500">{d.title}</p></div></div>
      <div><h2 className="font-bold mb-1">نبذة</h2><p className="text-slate-600">{d.bio}</p></div></div>
    <div className="card space-y-3"><h2 className="font-bold">مواعيد العمل</h2><p>{days(d)}</p><p>{fmtTime(d.schedule.from)} – {fmtTime(d.schedule.to)}</p>
      {d.showFee && <p>سعر الكشف: <b>{d.fee} ج.م</b></p>}<Link to={`/book?doctor=${d.id}`} className="btn-primary w-full">احجز موعد</Link></div></div></Page>)
}
