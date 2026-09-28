// كل الصلاحيات بصيغة resource.action — المصدر الوحيد للمفاتيح
export const PERMISSIONS = [
 'patients.view','patients.create','patients.update','patients.delete',
 'appointments.view','appointments.create','appointments.update','appointments.cancel',
 'medical.view','medical.viewSensitive','diagnosis.create','prescription.create',
 'attachments.view','attachments.upload','attachments.delete',
 'billing.view','payments.create','reports.view',
 'users.manage','roles.manage','doctors.manage','specialties.manage','articles.manage','settings.manage','audit.view'] as const
export type Permission = typeof PERMISSIONS[number]
export type RoleTemplate = { id: string; label: string; permissions: Permission[] }
const P = (...p: Permission[]) => p
// قوالب افتراضية فقط؛ تُخزَّن في roles/{id} وتُعدَّل من الإدارة
export const DEFAULT_ROLES: RoleTemplate[] = [
 { id:'centerAdmin', label:'مدير المركز', permissions:[...PERMISSIONS] },
 { id:'doctor', label:'طبيب', permissions:P('patients.view','patients.update','appointments.view','medical.view','medical.viewSensitive','diagnosis.create','prescription.create','attachments.view','attachments.upload') },
 { id:'secretary', label:'سكرتارية', permissions:P('patients.view','patients.create','patients.update','appointments.view','appointments.create','appointments.update','appointments.cancel','attachments.upload') },
 { id:'receptionist', label:'استقبال', permissions:P('patients.view','patients.create','appointments.view','appointments.create') },
 { id:'accountant', label:'محاسب', permissions:P('billing.view','payments.create','reports.view','appointments.view') },
 { id:'nurse', label:'تمريض', permissions:P('patients.view','appointments.view','medical.view','attachments.view') },
 { id:'lab', label:'معمل/أشعة', permissions:P('patients.view','attachments.view','attachments.upload') },
]
