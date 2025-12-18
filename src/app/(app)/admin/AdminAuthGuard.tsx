'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/firebase/provider';
import { Loader2 } from 'lucide-react';
import { useIsAdmin } from '@/hooks/useIsAdmin';

export default function AdminAuthGuard({ children }: { children: React.ReactNode }) {
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
      <div className="flex h-full w-full items-center justify-center p-10">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return <>{children}</>;
}
