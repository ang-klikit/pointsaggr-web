import { Navigate, Route, Routes } from 'react-router-dom';
import { Landing } from '@/pages/Landing';
import { Claim } from '@/pages/Claim';
import { History } from '@/pages/History';
import { Profile } from '@/pages/Profile';
import { Register } from '@/pages/Register';
import { NotFound } from '@/pages/NotFound';
import { AppShell } from '@/components/AppShell';

export function AppRouter() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route path="/" element={<Landing />} />
        <Route path="/c/:payload" element={<Claim />} />
        <Route path="/me" element={<Navigate to="/" replace />} />
        <Route path="/me/history" element={<History />} />
        <Route path="/me/profile" element={<Profile />} />
        <Route path="/me/register" element={<Register />} />
        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
