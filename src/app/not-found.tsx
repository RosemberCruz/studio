import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { FileQuestion } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-center px-4">
        <FileQuestion className="h-24 w-24 text-primary mb-6" />
        <h1 className="text-6xl font-bold font-headline text-primary">404</h1>
        <h2 className="text-2xl md:text-3xl font-semibold mt-4">Página No Encontrada</h2>
        <p className="mt-4 text-muted-foreground max-w-md">
            Lo sentimos, la página que estás buscando no existe o ha sido movida.
        </p>
        <Button asChild className="mt-8">
            <Link href="/dashboard">Volver al Dashboard</Link>
        </Button>
    </div>
  );
}
