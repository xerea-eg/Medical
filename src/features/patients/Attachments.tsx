import { useState, FormEvent } from 'react'
import { useParams } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { FileText, Trash2, Upload } from 'lucide-react'
import { useSession } from '../../auth/AuthProvider'
import { Can } from '../../permissions/usePermission'
import { attachmentStore as store } from '../../services/attachments'
const TYPES = ['تحليل', 'أشعة', 'تقرير', 'روشتة خارجية', 'خطاب طبي', 'أخرى']
// يُدمج لاحقًا داخل ملف المريض (Phase 3)؛ حاليًا له مسار مستقل للتجربة
export default function Attachments({ patientId: pid }: { patientId?: string }) {
  const params = useParams(); const p = pid ?? params.patientId!
  const { orgId: o, user } = useSession(); const qc = useQueryClient()
  const [file, setFile] = useState<File | null>(null); const [docType, setDocType] = useState(TYPES[0]); const [notes, setNotes] = useState(''); const [err, setErr] = useState('')
  const key = ['attachments', o, p]
  const q = useQuery({ queryKey: key, queryFn: () => store.list(o!, p) })
  const up = useMutation({
    mutationFn: () => store.upload(o!, p, { file: file!, docType, notes, uploadedBy: user!.uid, uploadedByName: user!.displayName ?? '' }),
    onSuccess: () => { setFile(null); setNotes(''); setErr(''); qc.invalidateQueries({ queryKey: key }) },
    onError: (e: Error) => setErr(e.message) })
  const del = useMutation({ mutationFn: (a: NonNullable<typeof q.data>[number]) => store.remove(o!, p, a), onSuccess: () => qc.invalidateQueries({ queryKey: key }) })
  async function open(a: NonNullable<typeof q.data>[number]) {
    const w = window.open('', '_blank') // يُفتح قبل الانتظار كي لا يحجبه المتصفح
    try { const url = await store.open(o!, p, a); if (w) w.location.href = url } catch (e) { w?.close(); setErr((e as Error).message) } }
  const submit = (e: FormEvent) => { e.preventDefault(); if (file) up.mutate() }
  return (<div className="max-w-2xl"><h2 className="text-xl font-bold mb-4">المرفقات الطبية</h2>
    <Can perm="attachments.upload"><form onSubmit={submit} className="card space-y-3 mb-6">
      <input type="file" accept="image/jpeg,image/png,image/webp,application/pdf" className="input" onChange={e => setFile(e.target.files?.[0] ?? null)} />
      <select className="input" value={docType} onChange={e => setDocType(e.target.value)}>{TYPES.map(t => <option key={t}>{t}</option>)}</select>
      <input className="input" placeholder="ملاحظات (اختياري)" value={notes} onChange={e => setNotes(e.target.value)} />
      {err && <p role="alert" className="text-sm text-red-600">{err}</p>}
      <button className="btn-primary" disabled={!file || up.isPending}><Upload size={18} />{up.isPending ? 'جارٍ الرفع…' : 'رفع المرفق'}</button></form></Can>
    <div className="space-y-2">{q.data?.map(a => <div key={a.id} className="card !p-3 flex items-center gap-3">
      <FileText className="text-brand-700 shrink-0" />
      <button onClick={() => open(a)} className="flex-1 text-start"><p className="font-medium">{a.docType} — {a.name}</p>
        <p className="text-xs text-slate-500">{new Date(a.createdAt).toLocaleDateString('ar-EG')} · {a.uploadedByName || 'مستخدم'}{a.notes && ` · ${a.notes}`}</p></button>
      <Can perm="attachments.delete"><button aria-label="حذف" onClick={() => confirm('حذف هذا المرفق نهائيًا؟') && del.mutate(a)} className="text-slate-400 hover:text-red-600"><Trash2 size={18} /></button></Can></div>)}
      {q.data?.length === 0 && <p className="text-slate-500">لا توجد مرفقات لهذا المريض بعد.</p>}</div></div>)
}
