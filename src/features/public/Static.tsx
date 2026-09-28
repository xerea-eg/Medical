import { Link } from 'react-router-dom'
import { Phone, MessageCircle, MapPin, Clock } from 'lucide-react'
import { Page } from '../../components/ui'
import { org, specialties } from './demoData'
export function Specialties() {
  return (<Page title="التخصصات" sub="أقسام طبية متعددة في مكان واحد."><div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
    {specialties.map(s => <Link key={s.id} to={`/doctors?spec=${s.id}`} className="card hover:border-brand-500">
      <span className="block h-1.5 w-12 rounded-full mb-4" style={{ background: `hsl(${s.hue} 70% 50%)` }} /><h2 className="font-bold text-lg">{s.name}</h2><p className="text-sm text-slate-500 mt-1">{s.desc}</p></Link>)}</div></Page>)
}
export const About = () => <Page title="من نحن"><p className="max-w-2xl text-lg leading-8 text-slate-700">{org.about}</p><Link to="/doctors" className="btn-primary mt-6">تعرّف على أطبائنا</Link></Page>
export function Contact() {
  const rows = [[Phone, 'الهاتف', org.phone], [MapPin, 'العنوان', org.address], [Clock, 'مواعيد العمل', org.hours]] as const
  return (<Page title="تواصل معنا"><div className="grid gap-4 md:grid-cols-2 max-w-3xl">
    {rows.map(([I, l, v]) => <div key={l} className="card flex gap-3 items-center"><I className="text-brand-700" /><div><p className="text-xs text-slate-500">{l}</p><p dir="auto">{v}</p></div></div>)}
    <a href={`https://wa.me/${org.whatsapp}`} className="btn-primary md:col-span-2"><MessageCircle size={18} />تواصل عبر واتساب</a></div></Page>)
}
export const NotFound = () => <Page title="الصفحة غير موجودة" sub="الرابط غير صحيح أو تم نقل الصفحة."><Link to="/" className="btn-primary">العودة للرئيسية</Link></Page>
