
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ShieldAlert } from 'lucide-react';
import { AppLogo } from '@/components/AppLogo';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function AccessDeniedPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4 text-center">
       <div className="mb-8 flex justify-center">
            <div className="flex items-center gap-2">
              <AppLogo />
              <h1 className="text-2xl font-semibold font-headline">TramitesFacil</h1>
            </div>
        </div>
      <Card className="max-w-md p-8">
        <CardHeader className="p-0">
          <div className="flex justify-center mb-6">
            <ShieldAlert className="h-24 w-24 text-destructive" />
          </div>
          <CardTitle className="text-3xl font-bold font-headline text-center">Acceso Denegado</CardTitle>
          <CardDescription className="text-center mt-2">
            No tienes los permisos necesarios para acceder a esta página.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0 mt-6">
          <p className="text-muted-foreground">
            Esta sección es exclusiva para administradores. Si crees que esto es un error, por favor contacta al soporte técnico.
          </p>
        </CardContent>
        <CardFooter className="p-0 mt-8">
          <Button asChild className="w-full">
            <Link href="/dashboard">Volver al Dashboard</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
