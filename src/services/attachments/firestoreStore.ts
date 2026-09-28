import { collection, doc, getDoc, getDocs, limit, orderBy, query, writeBatch } from 'firebase/firestore'
import { db } from '../../firebase/config'
import { prepareFile, toDataUrl } from '../../utils/image'
import type { AttachmentStore, AttachmentMeta } from './types'
const MAX_BYTES = 700_000 // حد مستند Firestore 1MB والـ base64 يزيد الحجم ~33%
const meta = (o: string, p: string) => collection(db, 'organizations', o, 'patients', p, 'attachments')
const data = (o: string, p: string) => collection(db, 'organizations', o, 'patients', p, 'attachmentData') // منفصلة كي لا تثقل القوائم
export const firestoreStore: AttachmentStore = {
  async list(o, p) {
    const s = await getDocs(query(meta(o, p), orderBy('createdAt', 'desc'), limit(50)))
    return s.docs.map(d => ({ id: d.id, ...(d.data() as AttachmentMeta) }))
  },
  async upload(o, p, { file, docType, notes, uploadedBy, uploadedByName }) {
    const blob = await prepareFile(file, MAX_BYTES), url = await toDataUrl(blob)
    if (url.length > 940_000) throw new Error('الملف كبير بعد المعالجة. جرّب صورة أصغر.')
    const ref = doc(meta(o, p)), b = writeBatch(db) // كتابة ذرّية: البيانات الوصفية + المحتوى معًا
    b.set(ref, { name: file.name, docType, notes, mime: blob.type, size: blob.size, uploadedBy, uploadedByName, createdAt: Date.now(), backend: 'firestore' } satisfies AttachmentMeta)
    b.set(doc(data(o, p), ref.id), { data: url })
    await b.commit()
  },
  async open(o, p, a) {
    const s = await getDoc(doc(data(o, p), a.id))
    if (!s.exists()) throw new Error('محتوى الملف غير موجود.')
    return URL.createObjectURL(await (await fetch(s.data().data as string)).blob())
  },
  async remove(o, p, a) { const b = writeBatch(db); b.delete(doc(meta(o, p), a.id)); b.delete(doc(data(o, p), a.id)); await b.commit() },
}
