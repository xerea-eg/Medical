import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useSession } from '../../auth/AuthProvider'
import { doctors, specialties, Doctor } from '../../services/crud'
import { DAY_LABELS, generateSlots } from '../../utils/slots'
const blank: Doctor = { name: '', title: '', specialtyId: '', bio: '', active: true, showPublic: true, showFee: false, fee: 0, schedule: { days: [6], from: '17:00', to: '22:00', slotMinutes: 15 } }
export default function Doctors() {
  const { orgId } = useSession(); const qc = useQueryClient(); const [f, setF] = useState<Doctor>(blank); const [editId, setEditId] = useState<string>()
  const list = useQuery({ queryKey: ['doctors', orgId], queryFn: () => doctors.list(orgId!) })
  const specs = useQuery({ queryKey: ['specialties', orgId], queryFn: () => specialties.list(orgId!, undefined, 100) })
  const save = useMutation({
    mutationFn: async () => { if (editId) await doctors.save(orgId!, editId, f); else await doctors.add(orgId!, f) },
    onSuccess: () => { setF(blank); setEditId(undefined); qc.invalidateQueries({ queryKey: ['doctors', orgId] }) } })
  const set = <K extends keyof Doctor>(k: K, v: Doctor[K]) => setF(p => ({ ...p, [k]: v }))
  const setS = (p: Partial<Doctor['schedule']>) => set('schedule', { ...f.schedule, ...p })
  const perDay = generateSlots(f.schedule, '2026-01-03').length || generateSlots({ ...f.schedule, days: [0,1,2,3,4,5,6] }, '2026-01-03').length
  return (<div><h1 className="text-2xl font-bold mb-4">الأطباء</h1>
    <div className="grid lg:grid-cols-2 gap-6">
      <form onSubmit={e => { e.preventDefault(); save.mutate() }} className="card space-y-3">
        <h2 className="font-semibold">{editId ? 'تعديل طبيب' : 'إضافة طبيب'}</h2>
        <input className="input" placeholder="الاسم" required value={f.name} onChange={e => set('name', e.target.value)} />
        <input className="input" placeholder="الدرجة العلمية" value={f.title} onChange={e => set('title', e.target.value)} />
        <select className="input" required value={f.specialtyId} onChange={e => set('specialtyId', e.target.value)}>
          <option value="">اختر التخصص</option>{specs.data?.rows.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}</select>
        <textarea className="input" rows={2} placeholder="نبذة مختصرة" value={f.bio} onChange={e => set('bio', e.target.value)} />
        <div><p className="text-sm mb-2 text-slate-600">أيام العمل</p><div className="flex flex-wrap gap-2">
          {DAY_LABELS.map((d, i) => { const on = f.schedule.days.includes(i)
            return <button type="button" key={d} onClick={() => setS({ days: on ? f.schedule.days.filter(x => x !== i) : [...f.schedule.days, i] })}
              className={`rounded-xl px-3 py-1.5 text-sm border ${on ? 'bg-brand-700 text-white border-brand-700' : 'bg-white text-slate-600 border-slate-200'}`}>{d}</button> })}</div></div>
        <div className="grid grid-cols-3 gap-2">
          <label className="text-sm">من<input type="time" className="input mt-1" value={f.schedule.from} onChange={e => setS({ from: e.target.value })} /></label>
          <label className="text-sm">إلى<input type="time" className="input mt-1" value={f.schedule.to} onChange={e => setS({ to: e.target.value })} /></label>
          <label className="text-sm">مدة الكشف (د)<input type="number" min={5} step={5} className="input mt-1" value={f.schedule.slotMinutes} onChange={e => setS({ slotMinutes: +e.target.value })} /></label></div>
        <p className="text-sm text-brand-700">سيتم إنشاء {perDay} موعدًا في اليوم تلقائيًا.</p>
        <label className="flex gap-2 text-sm"><input type="checkbox" checked={f.showPublic} onChange={e => set('showPublic', e.target.checked)} />إظهار الطبيب في الموقع العام</label>
        <label className="flex gap-2 text-sm"><input type="checkbox" checked={f.showFee} onChange={e => set('showFee', e.target.checked)} />إظهار سعر الكشف</label>
        {f.showFee && <input type="number" className="input" placeholder="سعر الكشف" value={f.fee} onChange={e => set('fee', +e.target.value)} />}
        <button className="btn-primary w-full">{editId ? 'حفظ التعديلات' : 'إضافة الطبيب'}</button></form>
      <div className="space-y-2">{list.data?.rows.map(d => <button key={d.id} onClick={() => { setF({ ...blank, ...d }); setEditId(d.id) }} className="card !p-4 w-full text-start hover:bg-brand-50">
        <p className="font-semibold">{d.name}</p><p className="text-sm text-slate-500">{d.title} — {specs.data?.rows.find(s => s.id === d.specialtyId)?.name}</p></button>)}
        {list.data?.rows.length === 0 && <p className="text-slate-500">لا يوجد أطباء بعد. أضف أول طبيب من النموذج.</p>}</div>
    </div></div>)
}
