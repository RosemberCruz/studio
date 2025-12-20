import { Toaster } from '@/components/ui/toaster';
import './globals.css';
import { cn } from '@/lib/utils';
import { FirebaseClientProvider } from '@/firebase/client-provider';
import RootClientLayout from './RootClientLayout'; // Importamos el nuevo componente

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
          {/* El RootClientLayout ahora se encarga de toda la lógica de cliente */}
          <RootClientLayout>{children}</RootClientLayout>
        </FirebaseClientProvider>
        <Toaster />
      </body>
    </html>
  );
}
