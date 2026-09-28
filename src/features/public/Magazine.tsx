import { Link, useParams } from 'react-router-dom'
import { Cover, Page } from '../../components/ui'
import { articles, spec } from './demoData'
const date = (d: string) => new Date(d).toLocaleDateString('ar-EG', { day: 'numeric', month: 'long', year: 'numeric' })
export default function Magazine() {
  return (<Page title="المجلة الطبية" sub="مقالات ونصائح صحية من أطباء المركز."><div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
    {articles.map(a => <Link key={a.id} to={`/magazine/${a.id}`} className="card !p-0 overflow-hidden hover:border-brand-500">
      <Cover hue={spec(a.specialtyId)!.hue} className="h-40 !rounded-none" />
      <div className="p-5"><p className="text-xs text-brand-700 font-medium">{spec(a.specialtyId)!.name}</p><h2 className="font-bold mt-1">{a.title}</h2>
        <p className="text-sm text-slate-500 mt-2">{a.summary}</p><p className="text-xs text-slate-400 mt-3">{a.author} · {date(a.date)}</p></div></Link>)}</div></Page>)
}
export function Article() {
  const a = articles.find(x => x.id === useParams().id); if (!a) return <Page title="المقال غير موجود"><Link to="/magazine" className="btn-ghost">العودة للمجلة</Link></Page>
  return (<div className="mx-auto max-w-3xl px-4 py-10"><Cover hue={spec(a.specialtyId)!.hue} className="h-56 mb-6" />
    <p className="text-sm text-brand-700 font-medium">{spec(a.specialtyId)!.name}</p><h1 className="text-3xl font-bold mt-1">{a.title}</h1>
    <p className="text-sm text-slate-500 mt-2">{a.author} · {date(a.date)}</p>
    <div className="mt-6 space-y-4 text-lg leading-8 text-slate-700">{a.body.map((p, i) => <p key={i}>{p}</p>)}</div>
    <Link to="/magazine" className="btn-ghost mt-8">كل المقالات</Link></div>)
}
