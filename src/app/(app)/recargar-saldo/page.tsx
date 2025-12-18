'use client';

import { useState, useTransition } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Landmark, Loader2, Clipboard, AlertCircle, Banknote, Send } from 'lucide-react';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { addDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { collection, doc, query, where, getDocs } from 'firebase/firestore';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

const bankDetails = {
    accountHolder: 'ROSEMBER CRUZ BETANCOURT',
    bankName: 'BBVA BANCOMER',
    clabe: '4152314027398869'
};

const depositRequestSchema = z.object({
  trackingKey: z.string().min(1, "La clave de rastreo es obligatoria."),
  amount: z.coerce.number().positive("El monto debe ser un número positivo."),
});

type DepositRequestFormValues = z.infer<typeof depositRequestSchema>;

export default function AddBalancePage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

   const userDocRef = useMemoFirebase(() => {
    if (!user) return null;
    return doc(firestore, 'users', user.uid);
  }, [user, firestore]);

  const { data: userData } = useDoc(userDocRef);

  const form = useForm<DepositRequestFormValues>({
    resolver: zodResolver(depositRequestSchema),
    defaultValues: {
      trackingKey: '',
      amount: 0,
    },
  });

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copiado al portapapeles",
      description: `El campo "${field}" ha sido copiado.`
    });
  }

  const onSubmit: SubmitHandler<DepositRequestFormValues> = (data) => {
    startTransition(async () => {
      if (!user || !firestore || !userData) {
        toast({ title: "Error", description: "Debes iniciar sesión para solicitar una recarga.", variant: "destructive" });
        return;
      }
      
      const requestsColRef = collection(firestore, 'depositRequests');

      // Check if tracking key already exists
      const q = query(requestsColRef, where("trackingKey", "==", data.trackingKey));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        toast({
          title: "Clave de Rastreo Duplicada",
          description: "Esta clave de rastreo ya ha sido utilizada o está expirada. Por favor, verifica tus datos.",
          variant: "destructive"
        });
        return;
      }

      const newRequest = {
        ...data,
        userId: user.uid,
        userName: userData.firstName + ' ' + userData.lastName,
        userEmail: userData.email,
        status: 'pendiente',
        requestDate: new Date().toISOString(),
      };
      
      addDocumentNonBlocking(requestsColRef, newRequest)
        .then(() => {
          toast({ title: "Solicitud Enviada", description: "Tu solicitud de recarga ha sido enviada. Un administrador la revisará pronto." });
          form.reset();
        })
        .catch(() => {
          toast({ title: "Error", description: "No se pudo enviar la solicitud.", variant: "destructive" });
        });
    });
  }

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold font-headline">Recargar Saldo</h1>
        <p className="text-muted-foreground mt-2">
          Añade fondos a tu cuenta reportando tu transferencia bancaria.
        </p>
      </div>

       <Card className="border-primary/50">
        <CardHeader>
          <CardTitle>Paso 1: Realiza tu Transferencia</CardTitle>
          <CardDescription>Usa tu app bancaria para enviar fondos a la siguiente cuenta. Después, reporta tu depósito en el Paso 2.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-secondary/50 rounded-md">
                <div>
                    <Label className="text-xs text-muted-foreground">Titular de la cuenta</Label>
                    <p className="font-semibold text-base">{bankDetails.accountHolder}</p>
                </div>
            </div>
            <div className="flex justify-between items-center p-3 bg-secondary/50 rounded-md">
                <div>
                    <Label className="text-xs text-muted-foreground">Banco</Label>
                    <p className="font-semibold text-base">{bankDetails.bankName}</p>
                </div>
            </div>
             <div className="flex justify-between items-center p-3 bg-secondary/50 rounded-md">
                <div>
                    <Label className="text-xs text-muted-foreground">CLABE Interbancaria</Label>
                    <p className="font-semibold font-mono text-base">{bankDetails.clabe}</p>
                </div>
                <Button variant="ghost" size="icon" onClick={() => copyToClipboard(bankDetails.clabe, 'CLABE Interbancaria')}>
                    <Clipboard className="h-5 w-5" />
                </Button>
            </div>
        </CardContent>
       </Card>

      <Card>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader>
              <CardTitle>Paso 2: Reporta tu Depósito</CardTitle>
              <CardDescription>
                Ingresa la clave de rastreo y el monto de tu transferencia para que un administrador la verifique y apruebe.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="trackingKey"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Clave de Rastreo</FormLabel>
                      <FormControl>
                        <Input placeholder="Clave de tu comprobante" {...field} disabled={isPending} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Monto (MXN)</FormLabel>
                       <div className="relative">
                        <Banknote className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <FormControl>
                          <Input type="number" placeholder="Ej. 500.00" {...field} disabled={isPending} className="pl-8" />
                        </FormControl>
                       </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              <Alert variant="default" className="bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800">
                <AlertCircle className="h-4 w-4 text-blue-500" />
                <AlertTitle className="text-blue-700 dark:text-blue-300">Aviso Importante</AlertTitle>
                <AlertDescription className="text-blue-600 dark:text-blue-400">
                  Tu saldo se acreditará únicamente después de que un administrador verifique y apruebe tu solicitud.
                </AlertDescription>
              </Alert>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isPending || !user}>
              {isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Send className="mr-2 h-4 w-4" />
              )}
              Enviar Solicitud de Recarga
            </Button>
          </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
