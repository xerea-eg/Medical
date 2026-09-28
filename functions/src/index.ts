import { onCall, HttpsError, CallableRequest } from 'firebase-functions/v2/https'
import { onDocumentWritten, onDocumentCreated } from 'firebase-functions/v2/firestore'
import { initializeApp } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'
import { getFirestore, FieldValue } from 'firebase-admin/firestore'
import { DEFAULT_ROLES } from './roles'
initializeApp()
const db = getFirestore(), auth = getAuth()
const org = (o: string) => db.doc(`organizations/${o}`)

function need(req: CallableRequest, perm: string) {
  const t = req.auth?.token
  if (!t?.orgId || !((t.perms as string[]) ?? []).includes(perm)) throw new HttpsError('permission-denied', 'غير مسموح')
  return t.orgId as string
}
// Audit Log يُكتب من الخادم فقط فلا يمكن تزويره
const audit = (o: string, userId: string, action: string, targetType: string, targetId: string) =>
  org(o).collection('auditLogs').add({ userId, action, targetType, targetId, timestamp: FieldValue.serverTimestamp() })

async function rolePerms(o: string, roleId: string) {
  const r = await org(o).collection('roles').doc(roleId).get()
  if (!r.exists) throw new HttpsError('not-found', 'الدور غير موجود')
  return r.data()!.permissions as string[]
}
// ملاحظة: حد Custom Claims هو 1000 بايت؛ إن كبرت الصلاحيات نُخزن perms في members ونقرأها بـ get() في القواعد.
const setClaims = (uid: string, orgId: string, role: string, perms: string[]) => auth.setCustomUserClaims(uid, { orgId, role, perms })

// إنشاء مؤسسة جديدة (Super Admin فقط: claim superAdmin=true يُضبط يدويًا بسكربت)
export const createOrganization = onCall(async (req) => {
  if (req.auth?.token.superAdmin !== true) throw new HttpsError('permission-denied', 'Super Admin فقط')
  const { orgId, name, adminEmail, adminPassword } = req.data
  if (!/^[a-z0-9-]{3,30}$/.test(orgId)) throw new HttpsError('invalid-argument', 'معرّف المؤسسة غير صالح')
  if ((await org(orgId).get()).exists) throw new HttpsError('already-exists', 'المعرّف مستخدم')
  const batch = db.batch()
  batch.set(org(orgId), { name, plan: 'basic', modules: { billing: false }, createdAt: FieldValue.serverTimestamp() })
  for (const [id, r] of Object.entries(DEFAULT_ROLES)) batch.set(org(orgId).collection('roles').doc(id), r)
  batch.set(org(orgId).collection('branches').doc('main'), { name: 'الفرع الرئيسي' })
  await batch.commit()
  const u = await auth.createUser({ email: adminEmail, password: adminPassword, displayName: 'مدير المركز' })
  await setClaims(u.uid, orgId, 'centerAdmin', DEFAULT_ROLES.centerAdmin.permissions)
  await org(orgId).collection('members').doc(u.uid).set({ role: 'centerAdmin', active: true, permissions: DEFAULT_ROLES.centerAdmin.permissions, displayName: 'مدير المركز', email: adminEmail })
  return { orgId, uid: u.uid }
})

export const createMember = onCall(async (req) => {
  const o = need(req, 'users.manage')
  const { email, password, displayName, roleId, phone, doctorId } = req.data
  const perms = await rolePerms(o, roleId)
  const u = await auth.createUser({ email, password, displayName })
  await setClaims(u.uid, o, roleId, perms)
  await org(o).collection('members').doc(u.uid).set({ role: roleId, active: true, permissions: perms, displayName, email, phone: phone ?? '', doctorId: doctorId ?? null, createdAt: FieldValue.serverTimestamp() })
  await audit(o, req.auth!.uid, 'member.create', 'member', u.uid)
  return { uid: u.uid }
})

export const updateMember = onCall(async (req) => {
  const o = need(req, 'users.manage')
  const { uid, roleId, active } = req.data
  const ref = org(o).collection('members').doc(uid)
  if (!(await ref.get()).exists) throw new HttpsError('not-found', 'المستخدم غير موجود')
  if (roleId) { const perms = await rolePerms(o, roleId); await setClaims(uid, o, roleId, perms); await ref.update({ role: roleId, permissions: perms }) }
  if (typeof active === 'boolean') { await auth.updateUser(uid, { disabled: !active }); await ref.update({ active }) }
  await auth.revokeRefreshTokens(uid) // يُجبر تحديث الصلاحيات فورًا
  await audit(o, req.auth!.uid, 'member.update', 'member', uid)
  return { ok: true }
})

// نسخة عامة مختصرة للموقع: قراءة واحدة بدل عشرات (تقليل التكلفة)
export const syncPublicDoctor = onDocumentWritten('organizations/{o}/doctors/{id}', async (e) => {
  const { o, id } = e.params, ref = db.doc(`publicOrgs/${o}/doctors/${id}`), d = e.data?.after.data()
  if (!d || !d.active || !d.showPublic) return void (await ref.delete())
  const { name, title, specialtyId, bio, photoUrl, schedule, showFee, fee } = d
  await ref.set({ name, title, specialtyId, bio: bio ?? '', photoUrl: photoUrl ?? '', schedule, fee: showFee ? fee ?? null : null })
})

// Audit لرفع المرفقات (حذف المرفقات يحتاج Callable — مرحلة لاحقة)
export const auditAttachment = onDocumentCreated('organizations/{o}/patients/{p}/attachments/{a}', (e) =>
  audit(e.params.o, e.data?.data().uploadedBy ?? 'unknown', 'attachment.upload', 'attachment', e.params.a))
