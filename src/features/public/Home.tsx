import { Link } from 'react-router-dom'
import { Phone, MapPin, Clock } from 'lucide-react'
// TODO Phase 2: البيانات من publicOrgs/{slug} بقراءة واحدة
const org = { name: 'مركز XERIA الطبي', phone: '0100 000 0000', address: 'القاهرة، مصر', hours: 'يوميًا 9 ص – 10 م' }
export default function Home() {
  return (<>
    <section className="bg-gradient-to-bl from-brand-900 via-brand-700 to-magenta text-white">
      <div className="mx-auto max-w-6xl px-4 py-16 md:py-28 grid md:grid-cols-2 gap-10 items-center">
        <div><p className="mb-3 text-white/80">{org.name}</p>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">رعايتك الصحية تبدأ من هنا</h1>
          <p className="mt-4 text-lg text-white/85 max-w-md">أطباء متخصصون، حجز في خطوات قليلة، وملفك الطبي محفوظ بأمان.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/book" className="btn bg-sun text-white hover:opacity-90">احجز موعدك الآن</Link>
            <Link to="/login" className="btn border border-white/40 text-white hover:bg-white/10">تسجيل الدخول</Link></div></div>
        <div className="aspect-[4/3] rounded-xl2 bg-white/10 border border-white/20 grid place-items-center text-white/60">صورة Hero</div>
      </div></section>
    <section className="mx-auto max-w-6xl px-4 -mt-8 grid gap-4 md:grid-cols-3">
      {[[Phone, org.phone], [MapPin, org.address], [Clock, org.hours]].map(([I, t], i) => { const Icon = I as typeof Phone
        return <div key={i} className="card flex items-center gap-3"><Icon className="text-brand-700" /><span dir="auto">{t as string}</span></div> })}
    </section></>)
}
