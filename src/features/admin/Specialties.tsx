import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Trash2 } from 'lucide-react'
import { useSession } from '../../auth/AuthProvider'
import { specialties } from '../../services/crud'
export default function Specialties() {
  const { orgId } = useSession(); const qc = useQueryClient(); const [name, setName] = useState('')
  const q = useQuery({ queryKey: ['specialties', orgId], queryFn: () => specialties.list(orgId!, undefined, 100) })
  const refresh = () => qc.invalidateQueries({ queryKey: ['specialties', orgId] })
  const add = useMutation({ mutationFn: () => specialties.add(orgId!, { name: name.trim() }), onSuccess: () => { setName(''); refresh() } })
  const del = useMutation({ mutationFn: (id: string) => specialties.remove(orgId!, id), onSuccess: refresh })
  return (<div className="max-w-xl"><h1 className="text-2xl font-bold mb-4">التخصصات</h1>
    <form onSubmit={e => { e.preventDefault(); if (name.trim()) add.mutate() }} className="flex gap-2 mb-4">
      <input className="input" placeholder="اسم التخصص، مثل: باطنة" value={name} onChange={e => setName(e.target.value)} />
      <button className="btn-primary shrink-0">إضافة تخصص</button></form>
    <div className="space-y-2">{q.data?.rows.map(r => <div key={r.id} className="card !p-3 flex justify-between items-center">{r.name}
      <button aria-label="حذف" onClick={() => confirm('حذف هذا التخصص؟') && del.mutate(r.id)} className="text-slate-400 hover:text-red-600"><Trash2 size={18} /></button></div>)}
      {q.data?.rows.length === 0 && <p className="text-slate-500">لا توجد تخصصات بعد. أضف أول تخصص من الأعلى.</p>}</div></div>)
}
