export type LocalAppointment = { id: string; time: string; patientId: string; patient: string; phone: string; doctor: string; specialty: string; status: string }
export type MedicalRecord = { diagnosis: string; treatment: string; imaging: string; analyses: string; notes: string; attachmentName?: string; attachmentData?: string; updatedAt: string }
const APPOINTMENTS_KEY = 'xeria_demo_appointments'
const RECORDS_KEY = 'xeria_demo_medical_records'
const seed: LocalAppointment[] = [
  { id: 'a1', time: '09:30', patientId: 'PT-1024', patient: 'سلمى أحمد', phone: '010 1234 5678', doctor: 'د. منى حسن', specialty: 'الأطفال', status: 'مؤكد' },
  { id: 'a2', time: '10:15', patientId: 'PT-1023', patient: 'محمد عبد الله', phone: '011 9876 5432', doctor: 'د. أحمد محمد', specialty: 'الباطنة', status: 'في الانتظار' },
  { id: 'a3', time: '11:00', patientId: 'PT-1022', patient: 'نورهان علي', phone: '012 3456 7890', doctor: 'د. خالد إبراهيم', specialty: 'القلب', status: 'تم الكشف' },
  { id: 'a4', time: '12:30', patientId: 'PT-1021', patient: 'عمر محمود', phone: '010 7788 9900', doctor: 'د. سارة عبد الله', specialty: 'الجلدية', status: 'مؤكد' },
]
export function getAppointments() { const value = localStorage.getItem(APPOINTMENTS_KEY); if (!value) localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(seed)); return value ? JSON.parse(value) as LocalAppointment[] : seed }
export function saveAppointmentStatus(id: string, status: string) { const rows = getAppointments().map(item => item.id === id ? { ...item, status } : item); localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(rows)) }
export function getMedicalRecord(patientId: string): MedicalRecord { const rows = JSON.parse(localStorage.getItem(RECORDS_KEY) || '{}') as Record<string, MedicalRecord>; return rows[patientId] || { diagnosis: '', treatment: '', imaging: '', analyses: '', notes: '', updatedAt: '' } }
export function saveMedicalRecord(patientId: string, record: MedicalRecord) { const rows = JSON.parse(localStorage.getItem(RECORDS_KEY) || '{}') as Record<string, MedicalRecord>; rows[patientId] = { ...record, updatedAt: new Date().toLocaleString('ar-EG') }; localStorage.setItem(RECORDS_KEY, JSON.stringify(rows)) }
