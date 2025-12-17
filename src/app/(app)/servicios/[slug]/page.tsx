
'use client';

import { useState } from 'react';
import { servicesData } from '@/lib/data';
import { notFound, useRouter, useParams } from 'next/navigation';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Bot, FileCheck2, ShoppingCart, Clock, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc, collection } from 'firebase/firestore';
import { updateDocumentNonBlocking, addDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { useToast } from '@/hooks/use-toast';

export default function ServiceDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { user } = useUser();
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<{[key: string]: string}>({});

  const userDocRef = useMemoFirebase(() => {
    if (!user) return null;
    return doc(firestore, 'users', user.uid);
  }, [user, firestore]);
  
  const { data: userData } = useDoc(userDocRef);

  const service = servicesData
    .flatMap((category) => category.services)
    .find((s) => s.slug === slug);

  if (!service) {
    notFound();
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }

  const handleRequestService = () => {
    if (!userData || !user || !firestore) {
        toast({ title: "Error", description: "Debes iniciar sesión para solicitar un trámite.", variant: "destructive"});
        return;
    }

    // Validate that all required fields are filled
    const missingDocs = service.documents.filter(doc => !formData[doc.id] || formData[doc.id].trim() === '');
    if (missingDocs.length > 0) {
        toast({ title: "Campos Requeridos", description: `Por favor, completa los siguientes campos: ${missingDocs.map(d => d.name).join(', ')}`, variant: "destructive" });
        return;
    }

    if (userData.balance < service.cost) {
        toast({ title: "Saldo Insuficiente", description: `No tienes suficiente saldo para solicitar este trámite. Necesitas $${service.cost.toFixed(2)}.`, variant: "destructive"});
        return;
    }

    setIsSubmitting(true);

    // 1. Deduct balance (non-blocking)
    const newBalance = userData.balance - service.cost;
    if(userDocRef) {
      updateDocumentNonBlocking(userDocRef, { balance: newBalance });
    }

    // 2. Create service request document (non-blocking)
    const requestsColRef = collection(firestore, 'serviceRequests');
    const newRequest = {
        userId: user.uid,
        serviceId: service.id,
        serviceName: service.name,
        status: 'Solicitado',
        requestDate: new Date().toISOString(),
        fileUrl: null,
        formData: formData,
    };
    addDocumentNonBlocking(requestsColRef, newRequest).then(() => {
      toast({ title: "¡Trámite Solicitado!", description: `Se han descontado $${service.cost.toFixed(2)} de tu saldo. Pronto un administrador revisará tu solicitud.`});
      setIsSubmitting(false);
      router.push('/seguimiento');
    }).catch(() => {
      // Revert balance if request creation fails (simplified approach)
      if (userDocRef) {
        updateDocumentNonBlocking(userDocRef, { balance: userData.balance });
      }
      toast({ title: "Error", description: "No se pudo crear la solicitud. Inténtalo de nuevo.", variant: "destructive"});
      setIsSubmitting(false);
    })
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex justify-between items-start">
        <div>
            <h1 className="text-4xl font-bold font-headline">{service.name}</h1>
            <p className="text-lg text-muted-foreground mt-2">{service.description}</p>
        </div>
        <Card className="p-4 text-center">
            <div className="text-lg font-bold text-primary">${service.cost.toFixed(2)} MXN</div>
            {service.deliveryTime && (
                <div className="flex items-center justify-center gap-1.5 text-sm text-muted-foreground mt-1">
                    <Clock className="h-4 w-4" />
                    <span>{service.deliveryTime}</span>
                </div>
            )}
        </Card>
      </div>


      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
            <Card>
                <CardHeader>
                  <CardTitle>Realizar Trámite</CardTitle>
                  <CardDescription>
                      Completa los siguientes campos con la información requerida para tu trámite.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {service.documents.map((doc) => (
                    <div key={doc.id} className="space-y-2">
                        <Label htmlFor={doc.id} className="font-semibold">
                            {doc.name}
                        </Label>
                         <Input 
                            id={doc.id} 
                            name={doc.id}
                            placeholder={doc.description}
                            onChange={handleInputChange}
                            required 
                            disabled={!user || isSubmitting}
                        />
                    </div>
                  ))}
                </CardContent>
                <CardFooter>
                  <Button size="lg" className="w-full" onClick={handleRequestService} disabled={!user || isSubmitting}>
                      {isSubmitting ? (
                          <Loader2 className="mr-2 animate-spin"/>
                      ) : (
                          <ShoppingCart className="mr-2"/>
                      )}
                      {isSubmitting ? 'Enviando Solicitud...' : 'Solicitar Trámite'}
                  </Button>
                </CardFooter>
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
            <Card className="sticky top-24 bg-secondary border-dashed">
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

    