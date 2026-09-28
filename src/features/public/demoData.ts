import type { Schedule } from '../../utils/slots'
// بيانات تجريبية للموقع العام. لاحقًا تُستبدل بقراءة publicOrgs/{orgId} من Firestore بنفس الأشكال.
export const DEMO = true
export const org = { name: 'مركز XERIA الطبي', tagline: 'رعايتك الصحية تبدأ من هنا', phone: '0100 000 0000', whatsapp: '201000000000', address: 'القاهرة، مصر', hours: 'يوميًا 9 ص – 10 م',
  about: 'مركز طبي متعدد التخصصات يجمع نخبة من الأطباء تحت سقف واحد، بحجز سهل وملف طبي إلكتروني آمن لكل مريض.' }
export type Specialty = { id: string; name: string; hue: number; desc: string }
export type DemoDoctor = { id: string; name: string; title: string; specialtyId: string; bio: string; fee: number; showFee: boolean; schedule: Schedule }
export type Article = { id: string; title: string; summary: string; body: string[]; author: string; date: string; specialtyId: string }
export const specialties: Specialty[] = [
  { id: 'internal', name: 'الباطنة', hue: 262, desc: 'تشخيص ومتابعة الأمراض المزمنة والحالات العامة.' },
  { id: 'pediatrics', name: 'الأطفال', hue: 320, desc: 'رعاية صحية متكاملة للرضع والأطفال والمراهقين.' },
  { id: 'cardiology', name: 'القلب', hue: 350, desc: 'فحوصات القلب وضغط الدم وتخطيط القلب.' },
  { id: 'orthopedics', name: 'العظام', hue: 24, desc: 'إصابات العظام والمفاصل والعمود الفقري.' },
  { id: 'dermatology', name: 'الجلدية', hue: 285, desc: 'علاج أمراض الجلد والشعر والحساسية.' }]
const S = (days: number[], from: string, to: string, slotMinutes = 15): Schedule => ({ days, from, to, slotMinutes })
export const doctors: DemoDoctor[] = [
  { id: 'd1', name: 'د. أحمد محمد', title: 'أستاذ الباطنة، كلية الطب', specialtyId: 'internal', bio: 'خبرة أكثر من 15 عامًا في الأمراض الباطنية والسكر والضغط.', fee: 300, showFee: true, schedule: S([6, 1, 3], '17:00', '22:00') },
  { id: 'd2', name: 'د. منى حسن', title: 'استشاري طب الأطفال', specialtyId: 'pediatrics', bio: 'متخصصة في نمو الأطفال والتطعيمات وحديثي الولادة.', fee: 250, showFee: true, schedule: S([0, 2, 4], '16:00', '21:00', 20) },
  { id: 'd3', name: 'د. خالد إبراهيم', title: 'استشاري أمراض القلب', specialtyId: 'cardiology', bio: 'قسطرة وتشخيص أمراض القلب والشرايين وإيكو القلب.', fee: 400, showFee: false, schedule: S([6, 2], '18:00', '22:00', 30) },
  { id: 'd4', name: 'د. سارة عبد الله', title: 'أخصائية الأمراض الجلدية', specialtyId: 'dermatology', bio: 'علاج حب الشباب والحساسية وتساقط الشعر.', fee: 280, showFee: true, schedule: S([1, 3, 5], '15:00', '20:00') },
  { id: 'd5', name: 'د. محمود سمير', title: 'استشاري جراحة العظام', specialtyId: 'orthopedics', bio: 'إصابات الملاعب وتبديل المفاصل وآلام الظهر.', fee: 350, showFee: true, schedule: S([0, 4], '17:00', '21:00', 20) },
  { id: 'd6', name: 'د. هالة فؤاد', title: 'أخصائية باطنة وسكر', specialtyId: 'internal', bio: 'متابعة مرضى السكر والغدة الدرقية.', fee: 250, showFee: true, schedule: S([0, 2, 4], '10:00', '14:00') }]
export const articles: Article[] = [
  { id: 'a1', title: '5 عادات يومية لضغط دم صحي', summary: 'تغييرات بسيطة في نمط حياتك تحمي قلبك.', author: 'د. خالد إبراهيم', date: '2026-09-10', specialtyId: 'cardiology',
    body: ['ارتفاع ضغط الدم لا يعطي أعراضًا واضحة في أغلب الأحيان، لذلك الفحص الدوري مهم.', 'قلل الملح، وامش 30 دقيقة يوميًا، ونم من 7 إلى 8 ساعات، وابتعد عن التدخين.', 'إذا كانت قراءاتك مرتفعة باستمرار، احجز موعدًا لتقييم حالتك.'] },
  { id: 'a2', title: 'جدول تطعيمات الطفل في السنة الأولى', summary: 'دليل مبسط للأمهات لمواعيد التطعيمات المهمة.', author: 'د. منى حسن', date: '2026-09-02', specialtyId: 'pediatrics',
    body: ['التطعيمات في موعدها تحمي طفلك من أمراض خطيرة.', 'احتفظ بكارت التطعيم واعرضه على الطبيب في كل زيارة.', 'لا تؤجل التطعيم بسبب نزلة برد بسيطة إلا بنصيحة الطبيب.'] },
  { id: 'a3', title: 'كيف تحمي بشرتك من شمس الصيف', summary: 'اختيار الواقي المناسب وطريقة استخدامه.', author: 'د. سارة عبد الله', date: '2026-08-20', specialtyId: 'dermatology',
    body: ['استخدم واقي شمس بعامل حماية 30 أو أعلى يوميًا.', 'أعد وضعه كل ساعتين عند التعرض المباشر للشمس.', 'راجع الطبيب عند ظهور أي بقعة جديدة أو متغيرة.'] },
  { id: 'a4', title: 'أوضاع الجلوس الصحيحة لتجنب آلام الظهر', summary: 'نصائح لمن يعملون ساعات طويلة على المكتب.', author: 'د. محمود سمير', date: '2026-08-05', specialtyId: 'orthopedics',
    body: ['اجعل قدميك مستويتين على الأرض وظهرك مسنودًا.', 'قم وتحرك كل 45 دقيقة لتخفيف الضغط على العمود الفقري.', 'استمرار الألم أكثر من أسبوعين يستدعي الفحص.'] }]
export const spec = (id: string) => specialties.find(s => s.id === id)
export const doctor = (id: string) => doctors.find(d => d.id === id)
