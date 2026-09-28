import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Avatar, Page, fmtTime } from '../../components/ui'
import { doctors, doctor, spec, specialties, DEMO } from './demoData'
import { generateSlots } from '../../utils/slots'
const iso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
const booked = (s: string) => [...s].reduce((a, c) => a + c.charCodeAt(0), 0) % 4 === 0 // تجريبي: بعض المواعيد محجوزة
const STEPS = ['التخصص', 'الطبيب', 'اليوم', 'الوقت', 'بياناتك']
export default function Book() {
  const pre = doctor(useSearchParams()[0].get('doctor') ?? '')
  const [specId, setSpec] = useState(pre?.specialtyId ?? ''); const [docId, setDoc] = useState(pre?.id ?? '')
  const [date, setDate] = useState(''); const [slot, setSlot] = useState('')
  const [name, setName] = useState(''); const [phone, setPhone] = useState(''); const [done, setDone] = useState('')
  const d = doctor(docId); const step = !specId ? 0 : !docId ? 1 : !date ? 2 : !slot ? 3 : 4
  const dates = useMemo(() => d ? Array.from({ length: 21 }, (_, i) => { const x = new Date(); x.setDate(x.getDate() + i + 1); return iso(x) }).filter(x => generateSlots(d.schedule, x).length) .slice(0, 8) : [], [d])
  const slots = d && date ? generateSlots(d.schedule, date).filter(t => !booked(docId + date + t)) : []
  const back = () => { if (step === 4) setSlot(''); else if (step === 3) setDate(''); else if (step === 2) setDoc(''); else if (step === 1) setSpec('') }
  const valid = name.trim().length > 2 && phone.replace(/\D/g, '').length >= 10
  if (done) return (<Page title="تم تسجيل طلب الحجز"><div className="card max-w-lg space-y-2"><p>رقم الحجز: <b dir="ltr">{done}</b></p><p>{d?.name} — {new Date(date).toLocaleDateString('ar-EG', { weekday: 'long', day: 'numeric', month: 'long' })} — {fmtTime(slot)}</p>
    {DEMO && <p className="text-sm text-sun">هذا عرض تجريبي؛ لم يُحفظ الحجز فعليًا.</p>}<Link to="/" className="btn-primary mt-3">العودة للرئيسية</Link></div></Page>)
  const opt = 'rounded-xl border border-brand-100 bg-white px-4 py-3 text-start hover:border-brand-500'
  return (<Page title="احجز موعدك"><div className="max-w-2xl">
    <ol className="flex gap-1 mb-6 text-xs">{STEPS.map((s, i) => <li key={s} className={`flex-1 rounded-full py-1.5 text-center ${i <= step ? 'bg-brand-700 text-white' : 'bg-brand-50 text-slate-500'}`}>{s}</li>)}</ol>
    {step === 0 && <div className="grid sm:grid-cols-2 gap-3">{specialties.map(s => <button key={s.id} className={opt} onClick={() => setSpec(s.id)}>{s.name}</button>)}</div>}
    {step === 1 && <div className="grid gap-3">{doctors.filter(x => x.specialtyId === specId).map(x => <button key={x.id} className={`${opt} flex items-center gap-3`} onClick={() => setDoc(x.id)}><Avatar name={x.name} size={40} hue={spec(specId)!.hue} /><span><b>{x.name}</b><br /><span className="text-sm text-slate-500">{x.title}</span></span></button>)}</div>}
    {step === 2 && <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">{dates.map(x => <button key={x} className={opt} onClick={() => setDate(x)}>{new Date(x).toLocaleDateString('ar-EG', { weekday: 'long', day: 'numeric', month: 'short' })}</button>)}</div>}
    {step === 3 && (slots.length ? <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">{slots.map(t => <button key={t} className={`${opt} text-center`} onClick={() => setSlot(t)}>{fmtTime(t)}</button>)}</div> : <p className="text-slate-500">لا توجد مواعيد متاحة في هذا اليوم. اختر يومًا آخر.</p>)}
    {step === 4 && <form className="card space-y-3" onSubmit={e => { e.preventDefault(); if (valid) setDone('XR-' + Math.floor(10000 + Math.random() * 90000)) }}>
      <p className="text-sm text-slate-600">{d?.name} — {fmtTime(slot)}</p>
      <input className="input" placeholder="الاسم بالكامل" value={name} onChange={e => setName(e.target.value)} />
      <input className="input" inputMode="tel" dir="auto" placeholder="رقم الهاتف" value={phone} onChange={e => setPhone(e.target.value)} />
      <button className="btn-primary w-full" disabled={!valid}>تأكيد الحجز</button></form>}
    {step > 0 && <button onClick={back} className="mt-5 text-sm text-brand-700">رجوع</button>}</div></Page>)
}
