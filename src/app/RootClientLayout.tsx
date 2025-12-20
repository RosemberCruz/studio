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
    // If the user is authenticated and not already on a dashboard page, redirect them.
    if (!isUserLoading && user && !pathname.startsWith('/dashboard') && !pathname.startsWith('/admin') && !pathname.startsWith('/servicios') && !pathname.startsWith('/recargar-saldo') && !pathname.startsWith('/seguimiento')) {
        router.replace('/dashboard');
    }
    // If the user is not authenticated and trying to access a protected page, redirect to login.
    // This is a fallback, as AuthGuard should handle it, but good for safety.
    if (!isUserLoading && !user && pathname.startsWith('/dashboard')) {
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

  // If user is logged in, show the app layout for any route inside (app)
  if (user) {
      return <AppLayout>{children}</AppLayout>;
  }

  // If user is not logged in, show the children (which should be the auth pages)
  return <>{children}</>;
}
