'use client';

import React from 'react';
import { useUser } from '@/firebase/provider';
import { Loader2 } from 'lucide-react';
import AppLayout from './(app)/layout';
import { usePathname } from 'next/navigation';

export default function RootClientLayout({ children }: { children: React.ReactNode }) {
  const { user, isUserLoading } = useUser();
  const pathname = usePathname();

  if (isUserLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  // If user is logged in, show the app layout for any route inside (app)
  if (user && pathname.startsWith('/dashboard')) {
      return <AppLayout>{children}</AppLayout>;
  }

  if (user && (pathname === '/' || pathname === '/login')) {
      return <AppLayout>{children}</AppLayout>
  }
  
  if (!user && pathname.startsWith('/dashboard')) {
       // This case should be handled by AuthGuard logic inside AppLayout,
       // but as a fallback, we can show a loader or redirect.
       return (
        <div className="flex h-screen w-full items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      );
  }


  // If user is not logged in, or on a public page, show the children
  return <>{children}</>;
}
