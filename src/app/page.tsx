
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, FileText, ShieldCheck, Rocket } from 'lucide-react';
import { AppLogo } from '@/components/AppLogo';
import { servicesData } from '@/lib/data';

const features = [
  {
    icon: <Rocket className="h-8 w-8 text-primary" />,
    title: 'Rápido y Eficiente',
    description: 'Olvídate de las filas. Gestiona tus trámites desde la comodidad de tu casa y recibe tus documentos en tiempo récord.',
  },
  {
    icon: <ShieldCheck className="h-8 w-8 text-primary" />,
    title: 'Seguro y Confiable',
    description: 'Tu información está protegida. Utilizamos procesos seguros para garantizar la confidencialidad de tus datos en todo momento.',
  },
  {
    icon: <FileText className="h-8 w-8 text-primary" />,
    title: 'Todo en un Mismo Lugar',
    description: 'Desde tu RFC hasta actas de registro civil. Accede a un directorio completo de servicios y gestiónalos fácilmente.',
  },
];

const howItWorks = [
  {
    step: 1,
    title: 'Elige tu Trámite',
    description: 'Explora nuestro directorio de servicios y selecciona el que necesitas.',
  },
  {
    step: 2,
    title: 'Completa los Datos',
    description: 'Llena un formulario simple con la información requerida para tu trámite.',
  },
  {
    step: 3,
    title: 'Recibe tu Documento',
    description: 'Un administrador procesará tu solicitud y recibirás tu documento listo para descargar.',
  },
];

export default function LandingPage() {
  const popularServices = servicesData.flatMap(c => c.services).slice(0, 3);

  return (
    <div className="bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2">
            <AppLogo />
            <span className="text-xl font-bold font-headline">TramitesFacil</span>
          </Link>
          <nav className="flex items-center gap-4">
            <Link href="/login" legacyBehavior passHref>
              <Button variant="outline">Iniciar Sesión</Button>
            </Link>
            <Link href="/login" legacyBehavior passHref>
              <Button>Crear Cuenta</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main>
        <section className="py-20 md:py-32">
          <div className="container mx-auto text-center px-4 md:px-6">
            <h1 className="text-4xl md:text-6xl font-bold font-headline tracking-tight">
              Tus Trámites Gubernamentales, <span className="text-primary">Sin Complicaciones</span>
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-lg text-muted-foreground">
              Gestionamos tus documentos y procedimientos de forma rápida, segura y 100% en línea. Dedica tu tiempo a lo que realmente importa.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Link href="/login" legacyBehavior passHref>
                <Button size="lg">Comenzar Ahora</Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 md:py-24 bg-secondary">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold font-headline">¿Por qué elegir TramitesFacil?</h2>
              <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
                Te ofrecemos la forma más sencilla de navegar la burocracia.
              </p>
            </div>
            <div className="mt-12 grid gap-8 md:grid-cols-3">
              {features.map((feature, index) => (
                <div key={index} className="text-center p-6 rounded-lg">
                  <div className="flex justify-center items-center h-16 w-16 mx-auto bg-primary/10 rounded-full">
                    {feature.icon}
                  </div>
                  <h3 className="mt-6 text-xl font-semibold">{feature.title}</h3>
                  <p className="mt-2 text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-20 md:py-24">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center">
                    <h2 className="text-3xl font-bold font-headline">Así de fácil funciona</h2>
                    <p className="mt-4 text-muted-foreground">En solo tres pasos, tu trámite estará en camino.</p>
                </div>
                <div className="mt-12 grid md:grid-cols-3 gap-8">
                    {howItWorks.map((step) => (
                        <Card key={step.step} className="bg-card">
                            <CardHeader className="flex flex-col items-center text-center">
                                <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary text-primary-foreground font-bold text-xl mb-4">
                                    {step.step}
                                </div>
                                <CardTitle>{step.title}</CardTitle>
                            </CardHeader>
                            <CardContent className="text-center text-muted-foreground">
                                {step.description}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>

        {/* Services Section */}
        <section id="services" className="py-20 md:py-24 bg-secondary">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold font-headline">Trámites Populares</h2>
              <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
                Algunos de los servicios que nuestros usuarios más solicitan.
              </p>
            </div>
            <div className="mt-12 grid gap-8 md:grid-cols-3">
              {popularServices.map((service) => (
                <Card key={service.id} className="flex flex-col">
                  <CardHeader>
                    <CardTitle>{service.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-muted-foreground">{service.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
             <div className="text-center mt-12">
                 <Link href="/login" legacyBehavior passHref>
                    <Button variant="outline">Ver todos los servicios</Button>
                </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-8 border-t">
        <div className="container mx-auto px-4 md:px-6 flex flex-col md:flex-row justify-between items-center text-center md:text-left">
          <div className="flex items-center gap-2">
             <AppLogo />
             <span className="font-semibold">TramitesFacil</span>
          </div>
          <p className="text-sm text-muted-foreground mt-4 md:mt-0">
            &copy; {new Date().getFullYear()} TramitesFacil. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
