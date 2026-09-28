export const Logo = ({ size = 36 }: { size?: number }) => (
  <span className="inline-flex items-center gap-2 font-bold text-brand-900">
    <img src={`${import.meta.env.BASE_URL}logo.png`} width={size} height={size} alt="شعار المركز الطبي" className="object-contain" /> <span>XERIA <span className="font-medium text-brand-700">Medical</span></span>
  </span>)
