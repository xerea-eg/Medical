// نسخة من DEFAULT_ROLES في الواجهة (تُوحَّد لاحقًا في حزمة مشتركة)
const s = (x: string) => x.split(' ')
export const ALL = s('patients.view patients.create patients.update patients.delete appointments.view appointments.create appointments.update appointments.cancel medical.view medical.viewSensitive diagnosis.create prescription.create attachments.view attachments.upload attachments.delete billing.view payments.create reports.view users.manage roles.manage doctors.manage specialties.manage articles.manage settings.manage audit.view')
export const DEFAULT_ROLES: Record<string, { label: string; permissions: string[] }> = {
  centerAdmin: { label: 'مدير المركز', permissions: ALL },
  doctor: { label: 'طبيب', permissions: s('patients.view patients.update appointments.view medical.view medical.viewSensitive diagnosis.create prescription.create attachments.view attachments.upload') },
  secretary: { label: 'سكرتارية', permissions: s('patients.view patients.create patients.update appointments.view appointments.create appointments.update appointments.cancel attachments.upload') },
  receptionist: { label: 'استقبال', permissions: s('patients.view patients.create appointments.view appointments.create') },
  accountant: { label: 'محاسب', permissions: s('billing.view payments.create reports.view appointments.view') },
  nurse: { label: 'تمريض', permissions: s('patients.view appointments.view medical.view attachments.view') },
  lab: { label: 'معمل/أشعة', permissions: s('patients.view attachments.view attachments.upload') },
}
