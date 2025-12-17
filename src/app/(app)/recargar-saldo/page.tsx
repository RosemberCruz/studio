
'use client';

import { useState, useTransition } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Landmark, Loader2, Clipboard, AlertCircle, Banknote } from 'lucide-react';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { updateDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { useEffect } from 'react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';


const bankDetails = {
    accountHolder: 'ROSEMBER CRUZ BETANCOURT',
    bankName: 'BBVA BANCOMER',
    clabe: '4152314027398869'
};

export default function AddBalancePage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [amount, setAmount] = useState('');
  const [trackingKey, setTrackingKey] = useState('');
  const [sourceBank, setSourceBank] = useState('');
  const [email, setEmail] = useState('');


  const userDocRef = useMemoFirebase(() => {
    if (!user) return null;
    return doc(firestore, 'users', user.uid);
  }, [user, firestore]);

  const { data: userData } = useDoc(userDocRef);

   useEffect(() => {
    if (user?.email) {
      setEmail(user.email);
    }
  }, [user]);

    const copyToClipboard = (text: string, field: string) => {
        navigator.clipboard.writeText(text);
        toast({
            title: "Copiado al portapapeles",
            description: `El campo "${field}" ha sido copiado.`
        });
    }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    startTransition(() => {
        if (!user || !userData) {
             toast({
                title: "Error",
                description: "Debes iniciar sesión para reportar una recarga.",
                variant: "destructive"
            });
            return;
        }

        if (!amount || !trackingKey || !sourceBank) {
            toast({
                title: "Campos Incompletos",
                description: "Por favor, completa todos los campos para reportar tu transferencia.",
                variant: "destructive"
            });
            return;
        }

        // SIMULATED: We are not calling a real bank API. We check if the tracking key is "valid".
        if (trackingKey.trim() === '') {
            toast({
                title: "Transferencia no encontrada",
                description: "La clave de rastreo no es válida. Por favor, verifica tus datos.",
                variant: "destructive"
            });
            return;
        }

        const rechargeAmount = parseFloat(amount);
        if (isNaN(rechargeAmount) || rechargeAmount <= 0) {
             toast({
                title: "Monto Inválido",
                description: "Por favor, ingresa un monto válido y positivo.",
                variant: "destructive"
            });
            return;
        }

        const newBalance = userData.balance + rechargeAmount;
        
        if (userDocRef) {
            updateDocumentNonBlocking(userDocRef, { balance: newBalance });
        }

        toast({
            title: "¡Reporte Recibido!",
            description: `Se han añadido $${rechargeAmount.toFixed(2)} a tu saldo. Tu nuevo saldo es: $${newBalance.toFixed(2)}.`
        });

        // Reset form
        setAmount('');
        setTrackingKey('');
        setSourceBank('');
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
            <CardDescription>Usa tu app bancaria para enviar fondos a la siguiente cuenta. Guarda la clave de rastreo.</CardDescription>
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
        <form onSubmit={handleSubmit}>
            <CardHeader>
            <CardTitle>Paso 2: Reporta tu Transferencia</CardTitle>
            <CardDescription>
                Una vez hecha la transferencia, ingresa los detalles aquí para que el saldo se acredite a tu cuenta.
            </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="sourceBank">Banco de Origen</Label>
                    <div className="relative">
                        <Landmark className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input id="sourceBank" type="text" placeholder="Ej: BBVA, Santander, Banorte" value={sourceBank} onChange={e => setSourceBank(e.target.value)} required disabled={isPending} className="pl-9"/>
                    </div>
                </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="amount">Monto Enviado (MXN)</Label>
                        <div className="relative">
                            <Banknote className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input id="amount" type="number" placeholder="Ej: 500.00" value={amount} onChange={e => setAmount(e.target.value)} required disabled={isPending} className="pl-9"/>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="trackingKey">Clave de Rastreo</Label>
                        <Input id="trackingKey" type="text" placeholder="Clave de tu comprobante" value={trackingKey} onChange={e => setTrackingKey(e.target.value)} required disabled={isPending} />
                    </div>
                </div>
                 <Alert variant="default" className="bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800">
                    <AlertCircle className="h-4 w-4 text-blue-500" />
                    <AlertTitle className="text-blue-700 dark:text-blue-300">Aviso Importante</AlertTitle>
                    <AlertDescription className="text-blue-600 dark:text-blue-400">
                        Esta es una simulación. No se procesan pagos reales. Ingresa cualquier clave de rastreo para probar.
                    </AlertDescription>
                </Alert>
            </CardContent>
            <CardFooter>
            <Button type="submit" className="w-full" disabled={isPending || !user}>
                {isPending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                    <Landmark className="mr-2 h-4 w-4" />
                )}
                Acreditar Saldo
            </Button>
            </CardFooter>
        </form>
      </Card>
    </div>
  );
}
