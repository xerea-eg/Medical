import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from '../auth/AuthProvider'
import { RequireAuth } from '../auth/guards'
import PublicLayout from './PublicLayout'
import DashboardLayout from './DashboardLayout'
import Home from '../features/public/Home'
import Login from '../features/public/Login'
import { RequirePerm } from '../auth/RequirePerm'
import Specialties from '../features/admin/Specialties'
import Doctors from '../features/admin/Doctors'
import Attachments from '../features/patients/Attachments'
import DashboardHome from '../features/dashboard/Home'
const qc = new QueryClient({ defaultOptions: { queries: { staleTime: 5 * 60_000, refetchOnWindowFocus: false } } }) // تقليل قراءات Firestore
export default function App() {
  return (<QueryClientProvider client={qc}><AuthProvider><BrowserRouter basename={import.meta.env.BASE_URL}><Routes>
    <Route element={<PublicLayout />}><Route index element={<Home />} /></Route>
    <Route path="/login" element={<Login />} />
    <Route path="/app" element={<RequireAuth />}><Route element={<DashboardLayout />}><Route index element={<DashboardHome />} />
      <Route element={<RequirePerm perm="specialties.manage" />}><Route path="specialties" element={<Specialties />} /></Route>
      <Route element={<RequirePerm perm="attachments.view" />}><Route path="patients/:patientId/attachments" element={<Attachments />} /></Route>
      <Route element={<RequirePerm perm="doctors.manage" />}><Route path="doctors" element={<Doctors />} /></Route></Route></Route>
  </Routes></BrowserRouter></AuthProvider></QueryClientProvider>)
}
