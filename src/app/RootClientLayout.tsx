'use client';

import React, { useEffect } from 'react';
import { useUser } from '@/firebase/provider';
import { Loader2 } from 'lucide-react';
import AppLayout from './(app)/layout';
import { usePathname, useRouter } from 'next/navigation';

export default function RootClientLayout({ children }: { children: React.ReactNode }) {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isUserLoading) {
      return;
    }

    const isAuthPage = pathname === '/';

    if (user && isAuthPage) {
      router.replace('/dashboard');
    } else if (!user && !isAuthPage) {
      router.replace('/');
    }
  }, [user, isUserLoading, pathname, router]);

  if (isUserLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (user) {
      return <AppLayout>{children}</AppLayout>;
  }

  return <>{children}</>;
}
