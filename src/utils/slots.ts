export type Schedule = { days: number[]; from: string; to: string; slotMinutes: number } // days: 0=الأحد … 6=السبت
export const DAY_LABELS = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت']
const toMin = (t: string) => { const [h, m] = t.split(':').map(Number); return h * 60 + m }
const fmt = (m: number) => `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`
// توليد المواعيد المتاحة ليوم معيّن؛ تُحسب في العميل بلا قراءات Firestore
export function generateSlots(s: Schedule, dateISO: string): string[] {
  if (!s.days.includes(new Date(dateISO + 'T00:00:00').getDay()) || s.slotMinutes < 5) return []
  const out: string[] = []
  for (let t = toMin(s.from); t + s.slotMinutes <= toMin(s.to); t += s.slotMinutes) out.push(fmt(t))
  return out
}
// الـ ID الحتمي هو ما يمنع الحجز المزدوج (نفس المستند لا يُنشأ مرتين)
export const appointmentId = (doctorId: string, dateISO: string, slot: string) => `${doctorId}_${dateISO}_${slot.replace(':', '')}`
