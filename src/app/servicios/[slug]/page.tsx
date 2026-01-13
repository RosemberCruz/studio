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
import { sub, subDays } from 'date-fns';

type PaymentMethod = 'balance' | 'credits' | 'promotionalCredits';

// IDs de los servicios que se pueden pagar con créditos promocionales
const PROMOTIONAL_CREDIT_SERVICES = ['rfc-clon', 'antecedentes-no-penales'];

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

  const isPromotionalService = PROMOTIONAL_CREDIT_SERVICES.includes(service.id);
  const hasCreditCost = typeof service.creditCost === 'number' && service.creditCost > 0;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }

  const checkForCreditReward = async () => {
    if (!firestore || !user || !userDocRef || !userData) return;
  
    const twentyFourHoursAgo = sub({ days: 1 }, );
    const requestsRef = collection(firestore, 'serviceRequests');
    const q = query(
      requestsRef, 
      where('userId', '==', user.uid), 
      where('requestDate', '>=', twentyFourHoursAgo.toISOString())
    );
  
    const querySnapshot = await getDocs(q);
    const dailyRequestCount = querySnapshot.size;
  
    if (dailyRequestCount > 0 && dailyRequestCount % 20 === 0) {
      const currentPromoCredits = userData.promotionalCredits || 0;
      const newPromoCredits = currentPromoCredits + 5;
      
      try {
        await updateDoc(userDocRef, { 
            promotionalCredits: newPromoCredits,
            promoCreditsGrantDate: new Date().toISOString() // Set grant date
        });
        toast({
          title: "¡Felicidades! Has ganado 5 Créditos Promocionales.",
          description: `Puedes usarlos en trámites seleccionados. Tu nuevo saldo es ${newPromoCredits}. Válidos por 7 días.`,
          duration: 7000,
          className: "bg-green-100 border-green-300 dark:bg-green-900 dark:border-green-700",
          action: <div className="p-2 rounded-full bg-green-200 dark:bg-green-800"><Gift className="h-5 w-5 text-green-600 dark:text-green-300" /></div>
        });
      } catch (e) {
        console.error("Failed to grant promotional credit reward:", e);
      }
    }
  };
  

  const handleRequestService = async () => {
    if (!userData || !user || !firestore || !userDocRef) {
        toast({ title: "Error", description: "Debes iniciar sesión para solicitar un trámite.", variant: "destructive"});
        return;
    }

    const missingDocs = service.documents.filter(doc => !formData[doc.id] || formData[doc.id].trim() === '');
    if (missingDocs.length > 0) {
        toast({ title: "Campos Requeridos", description: `Por favor, completa los siguientes campos: ${missingDocs.map(d => d.name).join(', ')}`, variant: "destructive" });
        return;
    }

    let updatePayload = {};
    let successMessage = "";
    
    // Validate if credit payment is attempted for a service without a credit cost
    if ((paymentMethod === 'credits' || paymentMethod === 'promotionalCredits') && !hasCreditCost) {
        toast({ title: "Método de Pago no Válido", description: "Este servicio solo puede ser pagado con saldo.", variant: "destructive"});
        return;
    }

    if (paymentMethod === 'balance') {
      if (userData.balance < service.cost) {
        toast({ title: "Saldo Insuficiente", description: `No tienes suficiente saldo. Necesitas $${service.cost.toFixed(2)}.`, variant: "destructive"});
        return;
      }
      updatePayload = { balance: userData.balance - service.cost };
      successMessage = `Se han descontado $${service.cost.toFixed(2)} de tu saldo.`;

    } else if (paymentMethod === 'credits') {
      const currentCredits = userData.credits || 0;
      if (currentCredits < service.creditCost) {
        toast({ title: "Créditos Generales Insuficientes", description: `Necesitas ${service.creditCost} créditos generales.`, variant: "destructive"});
        return;
      }
      updatePayload = { credits: currentCredits - service.creditCost };
      successMessage = `Se han descontado ${service.creditCost} créditos generales.`;
    
    } else { // paymentMethod === 'promotionalCredits'
        const currentPromoCredits = userData.promotionalCredits || 0;
        const grantDate = userData.promoCreditsGrantDate ? new Date(userData.promoCreditsGrantDate) : null;
        const sevenDaysAgo = subDays(new Date(), 7);

        if (grantDate && grantDate < sevenDaysAgo) {
            toast({ title: "Créditos Promocionales Vencidos", description: "Tus créditos promocionales han expirado y no pueden ser utilizados.", variant: "destructive"});
            return;
        }

        if (currentPromoCredits < service.creditCost) {
            toast({ title: "Créditos Promocionales Insuficientes", description: `Necesitas ${service.creditCost} créditos promocionales.`, variant: "destructive"});
            return;
        }
        updatePayload = { promotionalCredits: currentPromoCredits - service.creditCost };
        successMessage = `Se han descontado ${service.creditCost} créditos promocionales.`;
    }

    setIsSubmitting(true);

    try {
        await updateDoc(userDocRef, updatePayload);

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
        
        await checkForCreditReward();
        
        router.push('/seguimiento');

    } catch (error) {
        let revertPayload = {};
         if (paymentMethod === 'balance') revertPayload = { balance: userData.balance };
         else if (paymentMethod === 'credits') revertPayload = { credits: userData.credits || 0 };
         else revertPayload = { promotionalCredits: userData.promotionalCredits || 0 };

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
                {hasCreditCost && (
                  <>
                    <div className="border-l h-8 border-border"></div>
                    <div className="flex items-center gap-2">
                        <div className="text-lg font-bold text-yellow-500">{service.creditCost}</div>
                        <Star className="h-5 w-5 text-yellow-500" />
                    </div>
                  </>
                )}
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
                        value={paymentMethod}
                        onValueChange={(value: any) => setPaymentMethod(value)}
                        className="grid grid-cols-1 md:grid-cols-3 gap-4"
                        disabled={!user || isSubmitting}
                    >
                      <Label htmlFor="pay-balance" className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer">
                        <RadioGroupItem value="balance" id="pay-balance" className="sr-only" />
                        <Wallet className="mb-3 h-6 w-6" />
                        Pagar con Saldo
                      </Label>
                      
                      <Label htmlFor="pay-credits" className={`flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 ${hasCreditCost ? 'hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer' : 'cursor-not-allowed opacity-50'}`}>
                        <RadioGroupItem value="credits" id="pay-credits" className="sr-only" disabled={!hasCreditCost}/>
                        <Star className="mb-3 h-6 w-6" />
                        Créditos Generales
                      </Label>
                      
                      <Label htmlFor="pay-promotional-credits" className={`flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 ${isPromotionalService && hasCreditCost ? 'hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer' : 'cursor-not-allowed opacity-50'}`}>
                        <RadioGroupItem value="promotionalCredits" id="pay-promotional-credits" className="sr-only" disabled={!isPromotionalService || !hasCreditCost} />
                        <Gift className="mb-3 h-6 w-6" />
                        Créditos Promo
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
