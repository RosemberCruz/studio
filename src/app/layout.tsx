'use client';

import { Toaster } from '@/components/ui/toaster';
import './globals.css';
import { cn } from '@/lib/utils';
import { FirebaseClientProvider } from '@/firebase/client-provider';
import { useUser } from '@/firebase';
import { useRouter, usePathname } from 'next/navigation';
import AppLayout from '@/app/(app)/layout';
import { Loader2 } from 'lucide-react';
import React, { useEffect } from 'react';

function RootClientLayout({ children }: { children: React.ReactNode }) {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isUserLoading) {
      return; // Do nothing while loading
    }
    // If user is logged in and on the login page, redirect to dashboard
    if (user && pathname === '/') {
      router.push('/dashboard');
    } 
    // If user is not logged in and not on the login page, redirect to login
    else if (!user && pathname !== '/') {
      router.push('/');
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
    // If user is logged in, show the main app layout
    return <AppLayout>{children}</AppLayout>;
  }

  // If user is not logged in, show the public pages (login)
  return <>{children}</>;
}


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <title>TramitesFacil</title>
        <meta name="description" content="Tu asistente para trámites y servicios." />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet" />
      </head>
      <body className={cn('font-body antialiased')}>
        <FirebaseClientProvider>
          <RootClientLayout>{children}</RootClientLayout>
        </FirebaseClientProvider>
        <Toaster />
      </body>
    </html>
  );
}
