const admin = require('firebase-admin')
const serviceAccount = require('./serviceAccountKey.json')

admin.initializeApp({ credential: admin.credential.cert(serviceAccount) })

const permissions = [
  'patients.view', 'patients.create', 'patients.update', 'patients.delete',
  'appointments.view', 'appointments.create', 'appointments.update', 'appointments.cancel',
  'medical.view', 'medical.viewSensitive', 'diagnosis.create', 'prescription.create',
  'attachments.view', 'attachments.upload', 'attachments.delete',
  'billing.view', 'payments.create', 'reports.view',
  'users.manage', 'roles.manage', 'doctors.manage', 'specialties.manage',
  'articles.manage', 'settings.manage', 'audit.view',
]

const email = 'xereaeg@gmail.com'
const orgId = 'demo'
const rolePermissions = {
  centerAdmin: permissions,
  doctor: ['patients.view', 'patients.update', 'appointments.view', 'medical.view', 'medical.viewSensitive', 'diagnosis.create', 'prescription.create', 'attachments.view', 'attachments.upload'],
  secretary: ['patients.view', 'patients.create', 'patients.update', 'appointments.view', 'appointments.create', 'appointments.update', 'appointments.cancel', 'attachments.upload'],
  receptionist: ['patients.view', 'patients.create', 'appointments.view', 'appointments.create'],
  accountant: ['billing.view', 'payments.create', 'reports.view', 'appointments.view'],
  nurse: ['patients.view', 'appointments.view', 'medical.view', 'attachments.view'],
  lab: ['patients.view', 'attachments.view', 'attachments.upload'],
}

async function main() {
  const user = await admin.auth().getUserByEmail(email)
  await admin.auth().setCustomUserClaims(user.uid, { orgId, role: 'centerAdmin', perms: permissions })

  const db = admin.firestore()
  const orgRef = db.doc(`organizations/${orgId}`)
  await orgRef.set({ name: 'مركز XERIA الطبي', plan: 'basic' }, { merge: true })
  const labels = { centerAdmin: 'مدير المركز', doctor: 'طبيب', secretary: 'سكرتارية', receptionist: 'استقبال', accountant: 'محاسب', nurse: 'تمريض', lab: 'معمل/أشعة' }
  await Promise.all(Object.entries(rolePermissions).map(([id, rolePerms]) => orgRef.collection('roles').doc(id).set({ label: labels[id], permissions: rolePerms }, { merge: true })))
  await orgRef.collection('members').doc(user.uid).set({
    email, displayName: user.displayName || 'مدير المركز', role: 'centerAdmin', active: true, permissions,
  }, { merge: true })

  console.log(`Admin permissions added to ${email}`)
  console.log('Sign out and sign in again to refresh the token.')
}

main().catch(error => {
  console.error(error.message)
  process.exitCode = 1
})