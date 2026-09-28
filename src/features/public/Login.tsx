import { useState, FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../../firebase/config'
import { Logo } from '../../components/Logo'
import { localChangePassword, localLogin, localSession } from '../../auth/localAuth'
export default function Login() {
  const [email, setEmail] = useState(''); const [pw, setPw] = useState(''); const [err, setErr] = useState(''); const nav = useNavigate()
  const [localUser, setLocalUser] = useState(localSession()); const [newPw, setNewPw] = useState('')
  async function submit(e: FormEvent) { e.preventDefault(); setErr('')
    if (import.meta.env.VITE_USE_LOCAL_DEMO === 'true') { try { const user = localLogin(email, pw); if (user.mustChangePassword) { setLocalUser(user); return } nav('/demo'); return } catch { /* جرّب Firebase للحسابات الحقيقية */ } }
      try { await signInWithEmailAndPassword(auth, email, pw); nav('/app') } catch (error) {
        const code = (error as { code?: string }).code
        setErr(code === 'auth/operation-not-allowed'
          ? 'تسجيل الدخول بالبريد وكلمة المرور غير مفعّل في Firebase.'
          : code === 'auth/unauthorized-domain'
            ? 'هذا النطاق غير مضاف إلى Authorized domains في Firebase.'
            : code === 'auth/api-key-not-valid.-please-pass-a-valid-api-key.'
              ? 'مفتاح Firebase API غير صحيح أو مقيّد لهذا النطاق.'
              : 'البريد الإلكتروني أو كلمة المرور غير صحيحة.')
        }
      }
  function changePassword(e: FormEvent) { e.preventDefault(); if (newPw.length < 6) { setErr('كلمة المرور الجديدة يجب أن تكون 6 أحرف أو أرقام على الأقل.'); return } localChangePassword(localUser!.uid, newPw); nav('/demo') }
  if (localUser?.mustChangePassword) return <div className="min-h-screen grid place-items-center p-4"><form onSubmit={changePassword} className="card w-full max-w-sm space-y-4"><div className="text-center"><Logo /></div><h1 className="text-xl font-bold">غيّر كلمة المرور</h1><p className="text-sm text-slate-500">هذه أول مرة تدخل فيها. اختر كلمة مرور جديدة بدلًا من 112233.</p><input className="input" type="password" minLength={6} placeholder="كلمة المرور الجديدة" value={newPw} onChange={e => setNewPw(e.target.value)} required />{err && <p role="alert" className="text-sm text-red-600">{err}</p>}<button className="btn-primary w-full">حفظ والدخول</button></form></div>
  return (<div className="min-h-screen grid place-items-center p-4"><form onSubmit={submit} className="card w-full max-w-sm space-y-4">
    <div className="text-center"><Logo /></div>
    <input className="input" type="email" placeholder="البريد الإلكتروني" value={email} onChange={e => setEmail(e.target.value)} required />
    <input className="input" type="password" placeholder="كلمة المرور" value={pw} onChange={e => setPw(e.target.value)} required />
    {err && <p role="alert" className="text-sm text-red-600">{err}</p>}
    <button className="btn-primary w-full">تسجيل الدخول</button></form></div>)
}
