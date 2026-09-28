import type { Row } from '../crud'
export type AttachmentMeta = { name: string; docType: string; notes: string; mime: string; size: number; uploadedBy: string; uploadedByName: string; createdAt: number; backend: 'firestore' | 'storage' }
export type UploadInput = { file: File; docType: string; notes: string; uploadedBy: string; uploadedByName: string }
// أي مخزن ملفات يطبّق هذه الواجهة؛ التبديل بينهم بمتغير بيئة واحد
export interface AttachmentStore {
  list(o: string, p: string): Promise<Row<AttachmentMeta>[]>
  upload(o: string, p: string, i: UploadInput): Promise<void>
  open(o: string, p: string, a: Row<AttachmentMeta>): Promise<string> // يرجع رابطًا مؤقتًا للعرض
  remove(o: string, p: string, a: Row<AttachmentMeta>): Promise<void>
}
