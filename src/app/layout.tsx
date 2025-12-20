'use client';

import type { Metadata } from 'next';
import { Toaster } from '@/components/ui/toaster';
import './globals.css';
import { cn } from '@/lib/utils';
import { FirebaseClientProvider } from '@/firebase/client-provider';
import { useUser } from '@/firebase/provider';
import { Loader2 } from 'lucide-react';
import AppLayout from './(app)/layout';

function RootApp({ children }: { children: React.ReactNode }) {
  const { user, isUserLoading } = useUser();

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


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet" />
        <title>TramitesFacil</title>
        <meta name="description" content="Tu asistente para trámites y servicios." />
      </head>
      <body className={cn('font-body antialiased')}>
        <FirebaseClientProvider>
          <RootApp>
            {children}
          </RootApp>
        </FirebaseClientProvider>
        <Toaster />
      </body>
    </html>
  );
}
