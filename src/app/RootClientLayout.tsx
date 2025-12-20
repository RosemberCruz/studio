'use client';

import React, { useEffect } from 'react';
import { useUser } from '@/firebase/provider';
import { usePathname, useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import AppLayout from '@/app/(app)/layout';

export default function RootClientLayout({ children }: { children: React.ReactNode }) {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  // Mientras se verifica el estado de autenticación, muestra una pantalla de carga.
  // Esto previene cualquier renderizado incorrecto o "parpadeo".
  if (isUserLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  // Si el usuario está autenticado...
  if (user) {
    // Si por alguna razón el usuario está en la página de inicio, lo redirigimos al dashboard.
    if (pathname === '/') {
      router.push('/dashboard');
      // Muestra un loader mientras redirige para evitar mostrar la página de login.
      return (
        <div className="flex h-screen w-full items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      );
    }
    // Para cualquier otra ruta protegida, muestra el layout principal de la aplicación.
    // El AppLayout se encargará de renderizar el menú, el encabezado y el contenido (`children`).
    return <AppLayout>{children}</AppLayout>;
  }

  // Si el usuario NO está autenticado...
  if (!user) {
    // Si intenta acceder a una ruta que no sea la de inicio, lo redirigimos a la página de login.
    if (pathname !== '/') {
        router.push('/');
        return (
            <div className="flex h-screen w-full items-center justify-center">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
        );
    }
  }

  // Si no está autenticado y está en la página de inicio, simplemente muestra la página (login).
  return <>{children}</>;
}
