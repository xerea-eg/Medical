import { collection, doc, getDocs, limit, orderBy, query, writeBatch } from 'firebase/firestore'
import { deleteObject, getBlob, ref, uploadBytes } from 'firebase/storage'
import { db, storage } from '../../firebase/config'
import { prepareFile } from '../../utils/image'
import type { AttachmentStore, AttachmentMeta } from './types'
// يُفعَّل بعد ترقية Blaze: VITE_ATTACHMENT_BACKEND=storage
const meta = (o: string, p: string) => collection(db, 'organizations', o, 'patients', p, 'attachments')
const path = (o: string, p: string, id: string) => `organizations/${o}/patients/${p}/attachments/${id}`
export const storageStore: AttachmentStore = {
  async list(o, p) { const s = await getDocs(query(meta(o, p), orderBy('createdAt', 'desc'), limit(50))); return s.docs.map(d => ({ id: d.id, ...(d.data() as AttachmentMeta) })) },
  async upload(o, p, { file, docType, notes, uploadedBy, uploadedByName }) {
    const blob = await prepareFile(file, 9_500_000), r = doc(meta(o, p))
    await uploadBytes(ref(storage, path(o, p, r.id)), blob, { contentType: blob.type })
    const b = writeBatch(db)
    b.set(r, { name: file.name, docType, notes, mime: blob.type, size: blob.size, uploadedBy, uploadedByName, createdAt: Date.now(), backend: 'storage' } satisfies AttachmentMeta)
    await b.commit()
  },
  async open(o, p, a) { return URL.createObjectURL(await getBlob(ref(storage, path(o, p, a.id)))) },
  async remove(o, p, a) { await deleteObject(ref(storage, path(o, p, a.id))); const b = writeBatch(db); b.delete(doc(meta(o, p), a.id)); await b.commit() },
}
