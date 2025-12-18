'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AppLogo } from '@/components/AppLogo';
import { Rocket, LogIn } from 'lucide-react';
import Link from 'next/link';

export default function RootPage() {

  return (
     <div className="flex h-screen items-center justify-center bg-background p-4">
        <Card className="w-full max-w-lg text-center">
            <CardHeader>
                <div className="flex flex-col items-center gap-4">
                    <AppLogo />
                    <CardTitle className="text-3xl font-headline">¡Bienvenido a TramitesFacil!</CardTitle>
                </div>
                <CardDescription className="pt-2">
                    Tu aplicación está lista. Sin embargo, parece que estás teniendo problemas para ejecutarla localmente.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                    Para empezar a trabajar, tienes dos opciones:
                </p>
                <div className="grid gap-4 sm:grid-cols-2">
                    <Card className="bg-secondary/50">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2"><LogIn className="text-primary"/>Opción 1</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm">
                                Intenta acceder a la página de inicio de sesión. Si el servidor local funciona, esto te permitirá entrar.
                            </p>
                        </CardContent>
                        <CardFooter>
                            <Button asChild className="w-full">
                                <Link href="/login">Ir a Iniciar Sesión</Link>
                            </Button>
                        </CardFooter>
                    </Card>
                     <Card className="border-primary/50">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2"><Rocket className="text-primary"/>Opción 2 (Recomendado)</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm">
                                Publica tu app gratis en Vercel. Obtendrás una URL pública que siempre funcionará.
                            </p>
                        </CardContent>
                        <CardFooter>
                             <Button asChild className="w-full" variant="default">
                                <a href="https://vercel.com/new/import?repository-url=https://github.com/Firebase-Studio-Apps/tramites-facil-app-2e8bb2" target="_blank" rel="noopener noreferrer">
                                    Desplegar en Vercel
                                </a>
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </CardContent>
             <CardFooter>
                <p className="text-xs text-muted-foreground">
                    La Opción 2 es la solución definitiva a los problemas de "la página no carga".
                </p>
            </CardFooter>
        </Card>
    </div>
  );
}
