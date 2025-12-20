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
    // If the user data is still loading, don't do anything.
    if (isUserLoading) {
      return;
    }

    const isAuthPage = pathname === '/';

    // If the user is logged in...
    if (user) {
      // ...and they are on an authentication page, redirect them to the dashboard.
      if (isAuthPage) {
        router.replace('/dashboard');
      }
    } 
    // If the user is NOT logged in...
    else {
      // ...and they are on a protected page, redirect them to the login page.
      if (!isAuthPage) {
        router.replace('/');
      }
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
