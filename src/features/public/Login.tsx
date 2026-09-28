import { useState, FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../../firebase/config'
import { Logo } from '../../components/Logo'
export default function Login() {
  const [email, setEmail] = useState(''); const [pw, setPw] = useState(''); const [err, setErr] = useState(''); const nav = useNavigate()
  async function submit(e: FormEvent) { e.preventDefault(); setErr('')
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
  return (<div className="min-h-screen grid place-items-center p-4"><form onSubmit={submit} className="card w-full max-w-sm space-y-4">
    <div className="text-center"><Logo /></div>
    <input className="input" type="email" placeholder="البريد الإلكتروني" value={email} onChange={e => setEmail(e.target.value)} required />
    <input className="input" type="password" placeholder="كلمة المرور" value={pw} onChange={e => setPw(e.target.value)} required />
    {err && <p role="alert" className="text-sm text-red-600">{err}</p>}
    <button className="btn-primary w-full">تسجيل الدخول</button></form></div>)
}
