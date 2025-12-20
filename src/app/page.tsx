
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AppLogo } from '@/components/AppLogo';
import { FileText, Car, HeartPulse, CheckCircle } from 'lucide-react';
import Image from 'next/image';

const features = [
  {
    icon: FileText,
    title: 'Trámites Fiscales',
    description: 'Obtén tu constancia de situación fiscal, RFC, y más, de forma rápida y segura.',
  },
  {
    icon: Car,
    title: 'Vehículos y Transporte',
    description: 'Gestiona pólizas de seguro, permisos para circular y otros documentos para tu vehículo.',
  },
  {
    icon: HeartPulse,
    title: 'Salud y Educación',
    description: 'Solicita certificados de estudios, recetas médicas digitales y justificantes de incapacidad.',
  },
];

const steps = [
  {
    icon: CheckCircle,
    title: 'Elige tu Trámite',
    description: 'Explora nuestro catálogo de servicios y selecciona el que necesitas.',
  },
  {
    icon: CheckCircle,
    title: 'Completa los Datos',
    description: 'Llena un formulario simple con la información necesaria para tu trámite.',
  },
  {
    icon: CheckCircle,
    title: 'Recibe tu Documento',
    description: 'Un administrador procesará tu solicitud y recibirás tu documento listo para descargar.',
  },
];

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="px-4 lg:px-6 h-16 flex items-center border-b">
        <Link href="/" className="flex items-center justify-center gap-2">
          <AppLogo />
          <span className="text-xl font-semibold font-headline">TramitesFacil</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link href="/login" className="text-sm font-medium hover:underline underline-offset-4">
            Iniciar Sesión
          </Link>
          <Button asChild>
            <Link href="/login?tab=signup">Crear Cuenta</Link>
          </Button>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-secondary/50">
          <div className="container px-4 md:px-6 text-center">
            <div className="max-w-3xl mx-auto space-y-4">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl font-headline">
                Tus Trámites, Más Fáciles que Nunca
              </h1>
              <p className="text-muted-foreground md:text-xl">
                Deja la burocracia en nuestras manos. En TramitesFacil, gestionamos tus documentos importantes de forma rápida, segura y sin complicaciones.
              </p>
              <div className="flex flex-col gap-2 min-[400px]:flex-row justify-center">
                <Button asChild size="lg">
                  <Link href="/login?tab=signup">
                    Empezar Ahora
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
                <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm">Nuestros Servicios</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Todo lo que necesitas en un solo lugar</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    Desde documentos fiscales hasta trámites vehiculares, tenemos una amplia gama de servicios para ti.
                </p>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:grid-cols-3">
              {features.map((feature) => (
                <div key={feature.title} className="flex flex-col items-center text-center gap-2">
                  <div className="p-4 bg-primary/10 rounded-full">
                    <feature.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="how-it-works" className="w-full py-12 md:py-24 lg:py-32 bg-secondary/50">
          <div className="container px-4 md:px-6">
             <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
                <div className="inline-block rounded-lg bg-background px-3 py-1 text-sm">¿Cómo Funciona?</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Proceso Simple en 3 Pasos</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    Obtener tus documentos nunca ha sido tan fácil. Sigue estos pasos y nosotros nos encargamos del resto.
                </p>
            </div>
            <div className="mx-auto grid gap-6 md:grid-cols-3">
              {steps.map((step) => (
                 <div key={step.title} className="flex flex-col p-6 bg-background rounded-lg shadow-md items-center text-center">
                    <step.icon className="h-10 w-10 text-primary mb-4" />
                    <h3 className="mb-2 text-xl font-bold">{step.title}</h3>
                    <p className="text-muted-foreground">{step.description}</p>
                 </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">&copy; {new Date().getFullYear()} TramitesFacil. Todos los derechos reservados.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link href="#" className="text-xs hover:underline underline-offset-4">
            Términos de Servicio
          </Link>
          <Link href="#" className="text-xs hover:underline underline-offset-4">
            Política de Privacidad
          </Link>
        </nav>
      </footer>
    </div>
  );
}
