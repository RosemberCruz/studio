'use client';

import { servicesData } from '@/lib/data';
import { notFound } from 'next/navigation';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Bot, FileCheck2, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { updateDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { useToast } from '@/hooks/use-toast';

export default function ServiceDetailPage({ params }: { params: { slug: string } }) {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();

  const userDocRef = useMemoFirebase(() => {
    if (!user) return null;
    return doc(firestore, 'users', user.uid);
  }, [user, firestore]);
  
  const { data: userData } = useDoc(userDocRef);

  const service = servicesData
    .flatMap((category) => category.services)
    .find((s) => s.slug === params.slug);

  if (!service) {
    notFound();
  }

  const handleRequestService = () => {
    if (!userData || !user) {
        toast({ title: "Error", description: "Debes iniciar sesión para solicitar un trámite.", variant: "destructive"});
        return;
    }

    if (userData.balance < service.cost) {
        toast({ title: "Saldo Insuficiente", description: `No tienes suficiente saldo para solicitar este trámite. Necesitas $${service.cost}.`, variant: "destructive"});
        return;
    }

    const newBalance = userData.balance - service.cost;
    const userRef = doc(firestore, 'users', user.uid);
    updateDocumentNonBlocking(userRef, { balance: newBalance });

    toast({ title: "¡Trámite Solicitado!", description: `Se han descontado $${service.cost} de tu saldo. Pronto un administrador revisará tu solicitud.`});
    // Here you would typically create a new document in a 'requests' collection
    // to track the user's service request.
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex justify-between items-start">
        <div>
            <h1 className="text-4xl font-bold font-headline">{service.name}</h1>
            <p className="text-lg text-muted-foreground mt-2">{service.description}</p>
        </div>
        <Card className="p-4">
            <div className="text-lg font-bold text-primary">${service.cost} MXN</div>
        </Card>
      </div>


      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
            <Card>
                <CardHeader>
                <CardTitle>Comprar Trámite</CardTitle>
                <CardDescription>
                    Al hacer clic en el botón, se descontará el costo del trámite de tu saldo y un administrador se encargará de tu solicitud.
                </CardDescription>
                </CardHeader>
                <CardContent>
                <Button size="lg" className="w-full" onClick={handleRequestService}>
                    <ShoppingCart className="mr-2"/>
                    Solicitar Trámite
                </Button>
                </CardContent>
            </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileCheck2 className="h-6 w-6 text-primary" />
                Guía Paso a Paso
              </CardTitle>
            </CardHeader>
            <CardContent>
                <Accordion type="single" collapsible defaultValue="item-0">
                  {service.steps.map((step, index) => (
                    <AccordionItem value={`item-${index}`} key={step.id}>
                      <AccordionTrigger className="text-lg font-semibold">{step.title}</AccordionTrigger>
                      <AccordionContent className="text-base text-muted-foreground">
                        {step.content}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-1 space-y-6">
            <Card className="sticky top-24">
                <CardHeader>
                <CardTitle>Documentos Requeridos</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                {service.documents.map((doc) => (
                    <div key={doc.id} className="flex items-start space-x-3">
                        <Checkbox id={doc.id} className="mt-1" />
                        <div className="grid gap-1.5 leading-none">
                            <Label htmlFor={doc.id} className="font-semibold cursor-pointer">
                                {doc.name}
                            </Label>
                            <p className="text-sm text-muted-foreground">{doc.description}</p>
                        </div>
                    </div>
                ))}
                </CardContent>
            </Card>
             <Card className="bg-secondary border-dashed">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-primary">
                        <Bot className="h-6 w-6" />
                        ¿Necesitas Ayuda?
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground mb-4">Usa nuestra herramienta de IA para rellenar tu formulario.</p>
                    <Button asChild className="w-full">
                        <Link href="/generador-formularios">
                            Ir al Generador de Formas
                        </Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
