import { Link } from 'react-router-dom'
import { Phone, MapPin, Clock } from 'lucide-react'
import { org } from './demoData'
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
        <div className="relative aspect-[4/3] overflow-hidden rounded-xl2 border border-white/20 bg-white/10 grid place-items-center">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,.22),transparent_38%),radial-gradient(circle_at_80%_80%,rgba(249,115,22,.28),transparent_42%)]" />
          <div className="relative text-center text-white">
            <img src={`${import.meta.env.BASE_URL}logo.png`} onError={event => { event.currentTarget.src = `${import.meta.env.BASE_URL}icon.svg` }} width="140" height="140" alt="شعار XERIA Medical" className="mx-auto rounded-full object-contain drop-shadow-lg" />
            <p className="mt-4 text-2xl font-bold">XERIA <span className="font-normal text-white/80">Medical</span></p>
            <p className="mt-2 text-sm text-white/70">رعاية تثق بها</p>
          </div>
        </div>
      </div></section>
    <section className="mx-auto max-w-6xl px-4 -mt-8 grid gap-4 md:grid-cols-3">
      {[[Phone, org.phone], [MapPin, org.address], [Clock, org.hours]].map(([I, t], i) => { const Icon = I as typeof Phone
        return <div key={i} className="card flex items-center gap-3"><Icon className="text-brand-700" /><span dir="auto">{t as string}</span></div> })}
    </section></>)
}
