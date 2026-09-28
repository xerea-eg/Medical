import { Component, ReactNode } from 'react'
// يمنع الشاشة البيضاء: يعرض رسالة بدل انهيار الصفحة بصمت
export class ErrorBoundary extends Component<{ children: ReactNode }, { err?: Error }> {
  state: { err?: Error } = {}
  static getDerivedStateFromError(err: Error) { return { err } }
  render() {
    if (!this.state.err) return this.props.children
    return (<div className="min-h-screen grid place-items-center p-6"><div className="card max-w-md space-y-3 text-center">
      <h1 className="text-xl font-bold">حدث خطأ غير متوقع</h1><p className="text-sm text-slate-500" dir="ltr">{this.state.err.message}</p>
      <button className="btn-primary" onClick={() => location.reload()}>إعادة تحميل الصفحة</button></div></div>)
  }
}
