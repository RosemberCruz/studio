'use client';
import { AppLogo } from '@/components/AppLogo';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
        <div className="w-full max-w-md">
          <div className="mb-8 flex justify-center">
            <div className="flex items-center gap-2">
              <AppLogo />
              <h1 className="text-2xl font-semibold font-headline">TramitesFacil</h1>
            </div>
          </div>
          {children}
        </div>
      </div>
  );
}
