import { addDoc, collection, deleteDoc, doc, getDocs, limit, orderBy, query, setDoc, startAfter, QueryDocumentSnapshot } from 'firebase/firestore'
import { db } from '../firebase/config'
export type Row<T> = T & { id: string }
// طبقة وصول موحّدة: Query محددة + Pagination، بدون listeners
export function crud<T extends object>(name: string, orderField = 'name') {
  const col = (o: string) => collection(db, 'organizations', o, name)
  return {
    async list(o: string, after?: QueryDocumentSnapshot, size = 25) {
      const snap = await getDocs(query(col(o), orderBy(orderField), ...(after ? [startAfter(after)] : []), limit(size)))
      return { rows: snap.docs.map(d => ({ id: d.id, ...(d.data() as T) })) as Row<T>[], last: snap.docs[snap.docs.length - 1] }
    },
    add: (o: string, v: T) => addDoc(col(o), v),
    save: (o: string, id: string, v: T) => setDoc(doc(db, 'organizations', o, name, id), v, { merge: true }),
    remove: (o: string, id: string) => deleteDoc(doc(db, 'organizations', o, name, id)),
  }
}
export type Specialty = { name: string }
export type Doctor = { name: string; title: string; specialtyId: string; bio: string; active: boolean; showPublic: boolean; showFee: boolean; fee: number; schedule: import('../utils/slots').Schedule }
export const specialties = crud<Specialty>('specialties')
export const doctors = crud<Doctor>('doctors')
