import { Link, NavLink, Outlet } from 'react-router-dom'
import { Logo } from '../components/Logo'
const links = [['/', 'الرئيسية'], ['/specialties', 'التخصصات'], ['/doctors', 'الأطباء'], ['/magazine', 'المجلة الطبية'], ['/about', 'من نحن'], ['/contact', 'تواصل معنا']]
export default function PublicLayout() {
  return (<div className="min-h-screen flex flex-col">
    <header className="sticky top-0 z-10 bg-white/90 backdrop-blur border-b border-brand-100">
      <div className="mx-auto max-w-6xl flex items-center justify-between gap-4 px-4 py-3">
        <Link to="/"><Logo /></Link>
        <nav className="hidden md:flex gap-6 text-sm font-medium">
          {links.map(([to, t]) => <NavLink key={to} to={to} className={({ isActive }) => isActive ? 'text-brand-700' : 'text-slate-600 hover:text-brand-700'}>{t}</NavLink>)}</nav>
        <div className="flex gap-2"><Link to="/login" className="btn-ghost !py-2 hidden sm:inline-flex">تسجيل الدخول</Link>
          <Link to="/book" className="btn-primary !py-2">احجز موعد</Link></div>
      </div></header>
    <main className="flex-1"><Outlet /></main>
    <footer className="border-t border-brand-100 py-6 text-center text-sm text-slate-500">مدعوم بواسطة XERIA Medical</footer>
  </div>)
}
