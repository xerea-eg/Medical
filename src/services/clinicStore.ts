import { collection, doc, getDoc, getDocs, orderBy, query, setDoc } from 'firebase/firestore'
import { db } from '../firebase/config'
import type { LocalAppointment, MedicalRecord } from '../features/dashboard/localClinic'

const appointments = (orgId: string) => collection(db, 'organizations', orgId, 'appointments')
const visit = (orgId: string, patientId: string) => doc(db, 'organizations', orgId, 'visits', patientId)
const prescription = (orgId: string, patientId: string) => doc(db, 'organizations', orgId, 'prescriptions', patientId)

export async function listAppointments(orgId: string): Promise<LocalAppointment[]> {
  const snapshot = await getDocs(query(appointments(orgId), orderBy('time')))
  return snapshot.docs.map(item => ({ id: item.id, ...(item.data() as Omit<LocalAppointment, 'id'>) }))
}

export async function saveAppointment(orgId: string, item: LocalAppointment) {
  await setDoc(doc(appointments(orgId), item.id), item, { merge: true })
}

export async function getMedicalRecordRemote(orgId: string, patientId: string): Promise<MedicalRecord> {
  const [visitSnapshot, prescriptionSnapshot] = await Promise.all([getDoc(visit(orgId, patientId)), getDoc(prescription(orgId, patientId))])
  const medical = visitSnapshot.data() ?? {}
  const prescriptionData = prescriptionSnapshot.data() ?? {}
  return { diagnosis: medical.diagnosis ?? '', treatment: prescriptionData.treatment ?? '', imaging: medical.imaging ?? '', analyses: medical.analyses ?? '', notes: medical.notes ?? '', attachmentName: medical.attachmentName, attachmentData: medical.attachmentData, updatedAt: medical.updatedAt ?? '' }
}

export async function saveMedicalRecordRemote(orgId: string, patientId: string, record: MedicalRecord) {
  const { treatment, ...medical } = record
  await Promise.all([
    setDoc(visit(orgId, patientId), { ...medical, patientId, updatedAt: new Date().toISOString() }, { merge: true }),
    setDoc(prescription(orgId, patientId), { patientId, treatment, updatedAt: new Date().toISOString() }, { merge: true }),
  ])
}
