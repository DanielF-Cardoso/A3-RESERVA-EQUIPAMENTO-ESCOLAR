'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthContext } from '@/hooks/useAuthContext';

export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, profile, loading } = useAuthContext();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth');
      return;
    }

    // Redirecionar professores e secretaria do dashboard para agendamentos
    if (!loading && profile && pathname === '/dashboard') {
      const role = profile.role?.toLowerCase();
      if (role === 'teacher' || role === 'staff') {
        router.push('/scheduling');
      }
    }
  }, [user, profile, loading, router, pathname]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900 mx-auto mb-4" />
          <p className="text-slate-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
}
