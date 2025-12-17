
'use client';

import * as React from 'react';
import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import AppLayout from '@/app/(app)/layout';

// Temp function to simulate admin check. Replace with real logic.
function useIsAdmin() {
    // In a real app, you would get this from the user's custom claims.
    // For now, we'll let everyone be an admin for demonstration.
    return true; 
}


export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isUserLoading } = useUser();
  const isAdmin = useIsAdmin();
  const router = useRouter();

  React.useEffect(() => {
    if (!isUserLoading) {
      if (!user) {
        // If not logged in, redirect to login
        router.replace('/login');
      } else if (!isAdmin) {
        // If logged in but not an admin, redirect to access denied
        router.replace('/access-denied');
      }
    }
  }, [user, isUserLoading, isAdmin, router]);

  if (isUserLoading || !user || !isAdmin) {
    // Show a loading screen while we verify auth and admin status
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  // If user is an admin, render the admin layout which includes the main app layout
  return <AppLayout>{children}</AppLayout>;
}
