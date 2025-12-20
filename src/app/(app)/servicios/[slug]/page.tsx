
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
import { FileCheck2, ShoppingCart, Clock, Loader2, Star, Wallet, Gift } from 'lucide-react';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc, collection, updateDoc, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { addDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { useToast } from '@/hooks/use-toast';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { subHours } from 'date-fns';

type PaymentMethod = 'balance' | 'credits';

export default function ServiceDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { user } = useUser();
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<{[key: string]: string}>({});
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('balance');

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

  const checkForCreditReward = async () => {
    if (!firestore || !user || !userDocRef || !userData) return;
  
    // 1. Get requests from the last 24 hours
    const twentyFourHoursAgo = subHours(new Date(), 24);
    const requestsRef = collection(firestore, 'serviceRequests');
    const q = query(
      requestsRef, 
      where('userId', '==', user.uid), 
      where('requestDate', '>=', twentyFourHoursAgo.toISOString())
    );
  
    const querySnapshot = await getDocs(q);
    const dailyRequestCount = querySnapshot.size; // This already includes the one we just made
  
    // 2. Check if it's a multiple of 20
    if (dailyRequestCount > 0 && dailyRequestCount % 20 === 0) {
      // 3. Grant credits
      const currentCredits = userData.credits || 0;
      const newCredits = currentCredits + 5;
      
      try {
        await updateDoc(userDocRef, { credits: newCredits });
        toast({
          title: "¡Felicidades! Has ganado 5 créditos.",
          description: `Gracias por tu lealtad. Tu nuevo saldo de créditos es ${newCredits}.`,
          duration: 7000,
          className: "bg-green-100 border-green-300 dark:bg-green-900 dark:border-green-700",
          action: <div className="p-2 rounded-full bg-green-200 dark:bg-green-800"><Gift className="h-5 w-5 text-green-600 dark:text-green-300" /></div>
        });
      } catch (e) {
        // Fail silently on reward, main transaction is already done
        console.error("Failed to grant credit reward:", e);
      }
    }
  };
  

  const handleRequestService = async () => {
    if (!userData || !user || !firestore || !userDocRef) {
        toast({ title: "Error", description: "Debes iniciar sesión para solicitar un trámite.", variant: "destructive"});
        return;
    }

    // Validate that all required fields are filled
    const missingDocs = service.documents.filter(doc => !formData[doc.id] || formData[doc.id].trim() === '');
    if (missingDocs.length > 0) {
        toast({ title: "Campos Requeridos", description: `Por favor, completa los siguientes campos: ${missingDocs.map(d => d.name).join(', ')}`, variant: "destructive" });
        return;
    }

    let updatePayload = {};
    let successMessage = "";
    
    // Validate funds and prepare update
    if (paymentMethod === 'balance') {
      if (userData.balance < service.cost) {
        toast({ title: "Saldo Insuficiente", description: `No tienes suficiente saldo. Necesitas $${service.cost.toFixed(2)}.`, variant: "destructive"});
        return;
      }
      updatePayload = { balance: userData.balance - service.cost };
      successMessage = `Se han descontado $${service.cost.toFixed(2)} de tu saldo.`;

    } else { // paymentMethod === 'credits'
      const currentCredits = userData.credits || 0;
      if (currentCredits < service.creditCost) {
        toast({ title: "Créditos Insuficientes", description: `No tienes suficientes créditos. Necesitas ${service.creditCost}.`, variant: "destructive"});
        return;
      }
      updatePayload = { credits: currentCredits - service.creditCost };
      successMessage = `Se han descontado ${service.creditCost} créditos de tu cuenta.`;
    }

    setIsSubmitting(true);

    try {
        // 1. Deduct funds (blocking for safety)
        await updateDoc(userDocRef, updatePayload);

        // 2. Create service request document (non-blocking)
        const requestsColRef = collection(firestore, 'serviceRequests');
        const newRequest = {
            userId: user.uid,
            userName: userData.firstName + ' ' + userData.lastName,
            userEmail: userData.email,
            serviceId: service.id,
            serviceName: service.name,
            status: 'Solicitado',
            requestDate: new Date().toISOString(),
            fileUrl: null,
            formData: formData,
            adminNotes: null
        };

        await addDocumentNonBlocking(requestsColRef, newRequest);
        
        toast({ title: "¡Trámite Solicitado!", description: `${successMessage} Pronto un administrador revisará tu solicitud.`});
        
        // 3. Check for reward (async, non-blocking)
        await checkForCreditReward();
        
        router.push('/seguimiento');

    } catch (error) {
        // This simple revert might not be perfect in all race conditions, but it's a good first step.
        let revertPayload = {};
        if (paymentMethod === 'balance') {
            revertPayload = { balance: userData.balance };
        } else {
            revertPayload = { credits: userData.credits || 0 };
        }
        await updateDoc(userDocRef, revertPayload);

        toast({ title: "Error", description: "No se pudo completar la solicitud. Tu saldo no ha sido modificado. Inténtalo de nuevo.", variant: "destructive"});
    } finally {
        setIsSubmitting(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="grid md:grid-cols-2 gap-8 items-start">
        <div>
            <h1 className="text-4xl font-bold font-headline">{service.name}</h1>
            <p className="text-lg text-muted-foreground mt-2">{service.description}</p>
        </div>
        <Card className="p-4">
            <CardTitle className="mb-2 text-lg">Costo del Trámite</CardTitle>
            <div className="flex justify-around items-center text-center p-2 bg-secondary/50 rounded-lg">
                <div>
                    <div className="text-lg font-bold text-primary">${service.cost.toFixed(2)}</div>
                    <div className="text-sm text-muted-foreground">MXN</div>
                </div>
                <div className="border-l h-8 border-border"></div>
                <div className="flex items-center gap-2">
                    <div className="text-lg font-bold text-yellow-500">{service.creditCost}</div>
                    <Star className="h-5 w-5 text-yellow-500" />
                </div>
            </div>
            {service.deliveryTime && (
                <div className="flex items-center justify-center gap-1.5 text-sm text-muted-foreground mt-3">
                    <Clock className="h-4 w-4" />
                    <span>Entrega estimada: {service.deliveryTime}</span>
                </div>
            )}
        </Card>
      </div>


      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-3 space-y-6">
            <Card>
                <CardHeader>
                  <CardTitle>Realizar Trámite</CardTitle>
                  <CardDescription>
                      Completa los campos y elige tu método de pago para iniciar el trámite.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
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
                  </div>

                  <div className="space-y-3">
                    <Label className="font-semibold">Método de Pago</Label>
                    <RadioGroup 
                        defaultValue="balance" 
                        onValueChange={(value: PaymentMethod) => setPaymentMethod(value)}
                        className="grid grid-cols-2 gap-4"
                        disabled={!user || isSubmitting}
                    >
                      <Label htmlFor="pay-balance" className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer">
                        <RadioGroupItem value="balance" id="pay-balance" className="sr-only" />
                        <Wallet className="mb-3 h-6 w-6" />
                        Pagar con Saldo
                      </Label>
                      <Label htmlFor="pay-credits" className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer">
                        <RadioGroupItem value="credits" id="pay-credits" className="sr-only" />
                        <Star className="mb-3 h-6 w-6" />
                        Pagar con Créditos
                      </Label>
                    </RadioGroup>
                  </div>

                </CardContent>
                <CardFooter>
                  <Button size="lg" className="w-full" onClick={handleRequestService} disabled={!user || isSubmitting}>
                      {isSubmitting ? (
                          <Loader2 className="mr-2 animate-spin"/>
                      ) : (
                          <ShoppingCart className="mr-2"/>
                      )}
                      {isSubmitting ? 'Procesando Pago...' : 'Confirmar y Pagar'}
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
      </div>
    </div>
  );
}

