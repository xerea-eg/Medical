import { ReactNode } from 'react'
export const Avatar = ({ name, size = 56, hue = 270 }: { name: string; size?: number; hue?: number }) => (
  <span className="grid place-items-center rounded-full font-bold text-white shrink-0" style={{ width: size, height: size, background: `linear-gradient(135deg,hsl(${hue} 70% 45%),hsl(${hue + 50} 80% 55%))`, fontSize: size / 2.6 }}>{name.replace('د. ', '').charAt(0)}</span>)
export const Cover = ({ hue, className = '' }: { hue: number; className?: string }) => (
  <div className={`rounded-xl2 ${className}`} style={{ background: `linear-gradient(135deg,hsl(${hue} 65% 40%),hsl(${hue + 45} 80% 60%))` }} />)
export const Page = ({ title, sub, children }: { title: string; sub?: string; children: ReactNode }) => (
  <div className="mx-auto max-w-6xl px-4 py-10"><h1 className="text-3xl font-bold">{title}</h1>{sub && <p className="mt-2 text-slate-500 max-w-xl">{sub}</p>}<div className="mt-8">{children}</div></div>)
export const fmtTime = (t: string) => new Date(`2000-01-01T${t}`).toLocaleTimeString('ar-EG', { hour: 'numeric', minute: '2-digit' })
