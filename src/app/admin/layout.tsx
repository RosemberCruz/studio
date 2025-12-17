
'use client';

import * as React from 'react';
import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import AppLayout from '../(app)/layout';

function useIsAdmin() {
    const { user } = useUser();
    const ADMIN_EMAIL = 'rosembercruzbetancourt@gmail.com';
    return user?.email === ADMIN_EMAIL;
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isUserLoading } = useUser();
  const isAdmin = useIsAdmin();
  const router = useRouter();

  React.useEffect(() => {
    if (!isUserLoading) {
      if (!user) {
        router.replace('/login');
      } else if (!isAdmin) {
        router.replace('/access-denied');
      }
    }
  }, [user, isUserLoading, isAdmin, router]);

  if (isUserLoading || !user || !isAdmin) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  // Use the main AppLayout to provide the sidebar and header
  return <AppLayout>{children}</AppLayout>;
}
