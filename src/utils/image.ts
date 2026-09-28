// ضغط الصور في المتصفح قبل الرفع (WebP بحد أقصى 1600px) لتقليل استهلاك المساحة
export async function compressImage(file: File, maxBytes: number, maxDim = 1600): Promise<Blob> {
  const bmp = await createImageBitmap(file)
  let scale = Math.min(1, maxDim / Math.max(bmp.width, bmp.height))
  const c = document.createElement('canvas'), ctx = c.getContext('2d')!
  for (let round = 0; round < 4; round++, scale *= 0.8) {
    c.width = Math.round(bmp.width * scale); c.height = Math.round(bmp.height * scale)
    ctx.drawImage(bmp, 0, 0, c.width, c.height)
    for (let q = 0.8; q >= 0.4; q -= 0.1) {
      const b = await new Promise<Blob | null>(r => c.toBlob(r, 'image/webp', q))
      if (b && b.size <= maxBytes) return b
    }
  }
  throw new Error('تعذّر تصغير الصورة بما يكفي. جرّب صورة أصغر.')
}
export const toDataUrl = (b: Blob) => new Promise<string>((res, rej) => { const r = new FileReader(); r.onload = () => res(r.result as string); r.onerror = rej; r.readAsDataURL(b) })
// يجهّز الملف: صورة ← تُضغط، PDF ← يُقبل إن كان ضمن الحد، غير ذلك ← يُرفض
export async function prepareFile(file: File, maxBytes: number): Promise<Blob> {
  if (file.type.startsWith('image/')) return compressImage(file, maxBytes)
  if (file.type === 'application/pdf') {
    if (file.size <= maxBytes) return file
    throw new Error(`ملف PDF أكبر من ${Math.round(maxBytes / 1000)}KB. في الوضع الحالي ارفعه كصورة، أو فعّل Blaze لدعم الملفات الكبيرة.`)
  }
  throw new Error('نوع الملف غير مدعوم. المسموح: صور أو PDF.')
}
