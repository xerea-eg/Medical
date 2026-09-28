import { firestoreStore } from './firestoreStore'
import { storageStore } from './storageStore'
export const attachmentStore = import.meta.env.VITE_ATTACHMENT_BACKEND === 'storage' ? storageStore : firestoreStore
export type { AttachmentMeta } from './types'
