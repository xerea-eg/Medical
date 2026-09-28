# XERIA Medical — Phase 0
```
npm install && cp .env.example .env
npm run emulators   # terminal 1
npm run dev         # terminal 2
```
- الصلاحيات في claims: `orgId`, `role`, `perms` (تُضبط من Cloud Function في المرحلة القادمة).
- قواعد Firestore/Storage في `firebase/`. اختبرها بالـ Emulator قبل أي بيانات حقيقية.

## Phase 1
- `functions/`: `createOrganization`, `createMember`, `updateMember` (تضبط claims وتكتب Audit Log)، و`syncPublicDoctor` لنسخة الموقع العام.
- أول Super Admin: أنشئ مستخدمًا في الـ Emulator واضبط له claim `superAdmin=true` عبر Admin SDK، ثم استدعِ `createOrganization`.
- إدارة التخصصات والأطباء وجداولهم، و`utils/slots.ts` لتوليد المواعيد.

## الربط بمشروع Firebase الحقيقي (xeria-eg)
1. Console ← Authentication ← فعّل Email/Password. Firestore ← أنشئ قاعدة بيانات (Production mode). Storage ← فعّله.
2. `firebase login` ثم `firebase deploy --only firestore:rules,storage,hosting` (بعد `npm run build`).
3. `.env` للتطوير (Emulators مفعّلة)، و`.env.production` للنشر (Emulators مغلقة).

## أول تشغيل
`cp .env.example .env` ثم `npm install`. لا ترفع `.env` على Git.

## المرفقات
الافتراضي `VITE_ATTACHMENT_BACKEND=firestore` (صور WebP مضغوطة + PDF حتى ~700KB داخل Firestore، بدون Blaze).
بعد تفعيل Blaze غيّرها إلى `storage` وانشر `storage.rules`.
