
'use client';

import * as React from 'react';
import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

// This is a simulated admin check. In a real app, this would be based on custom claims.
function useIsAdmin() {
    const { user } = useUser();
    // This email is treated as the admin user for demonstration purposes.
    const ADMIN_EMAIL = 'rosembercruzbetancourt@gmail.com';
    return user?.email === ADMIN_EMAIL;
}


export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isUserLoading } = useUser();
  const isAdmin = useIsAdmin();
  const router = useRouter();

  React.useEffect(() => {
    // Wait until the user's auth state is resolved.
    if (!isUserLoading) {
      if (!user) {
        // If not logged in, redirect to the login page.
        router.replace('/login');
      } else if (!isAdmin) {
        // If logged in but not an admin, redirect to an access denied page.
        router.replace('/access-denied');
      }
    }
  }, [user, isUserLoading, isAdmin, router]);

  // While we're checking the user's status, show a loading spinner.
  if (isUserLoading || !user || !isAdmin) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  // If the user is a verified admin, render the children within this layout.
  return <>{children}</>;
}
