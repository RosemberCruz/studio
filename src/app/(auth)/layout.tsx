'use client';
import { AppLogo } from '@/components/AppLogo';
import { Info } from 'lucide-react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
        <div className="w-full max-w-md">
          <div className="mb-6 flex justify-center">
            <div className="flex items-center gap-2">
              <AppLogo />
              <h1 className="text-2xl font-semibold font-headline">TramitesFacil</h1>
            </div>
          </div>
          <div className="w-full bg-accent text-accent-foreground text-center p-2 text-sm font-semibold flex items-center justify-center gap-2 rounded-t-lg">
            <Info className="h-4 w-4" />
            La creación de esta cuenta es gratuita, ¡no te dejes engañar!
          </div>
          {children}
        </div>
      </div>
  );
}
