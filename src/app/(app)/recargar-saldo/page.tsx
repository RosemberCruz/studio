'use client';

import { useState, useTransition } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Landmark, Loader2, Clipboard, AlertCircle, Banknote, Search } from 'lucide-react';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc, collection, query, where, getDocs, writeBatch } from 'firebase/firestore';
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
  const [trackingKey, setTrackingKey] = useState('');

  const userDocRef = useMemoFirebase(() => {
    if (!user) return null;
    return doc(firestore, 'users', user.uid);
  }, [user, firestore]);

  const { data: userData } = useDoc(userDocRef);

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copiado al portapapeles",
      description: `El campo "${field}" ha sido copiado.`
    });
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!trackingKey.trim()) {
      toast({
        title: "Clave Requerida",
        description: "Por favor, ingresa la clave de rastreo de tu transferencia.",
        variant: "destructive"
      });
      return;
    }

    startTransition(async () => {
      if (!user || !userData || !firestore) {
        toast({
          title: "Error de autenticación",
          description: "Debes iniciar sesión para reclamar una recarga.",
          variant: "destructive"
        });
        return;
      }

      const depositsRef = collection(firestore, 'deposits');
      const q = query(
        depositsRef, 
        where('trackingKey', '==', trackingKey.trim()), 
        where('status', '==', 'disponible')
      );

      try {
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          toast({
            title: "Transferencia no encontrada",
            description: "No se encontró ninguna transferencia disponible con esa clave de rastreo. Verifica los datos o contacta a soporte.",
            variant: "destructive"
          });
          return;
        }

        const batch = writeBatch(firestore);
        const depositDoc = querySnapshot.docs[0];
        const depositData = depositDoc.data();
        const depositAmount = depositData.amount;
        
        // 1. Update the deposit status to 'reclamado'
        const depositRef = doc(firestore, 'deposits', depositDoc.id);
        batch.update(depositRef, { 
            status: 'reclamado',
            claimedBy: user.uid,
            claimedAt: new Date().toISOString(),
        });
        
        // 2. Update the user's balance
        const newBalance = userData.balance + depositAmount;
        if (userDocRef) {
            batch.update(userDocRef, { balance: newBalance });
        }
        
        // 3. Commit the batch
        await batch.commit();

        toast({
          title: "¡Saldo Acreditado!",
          description: `Se han añadido $${depositAmount.toFixed(2)} a tu cuenta. Tu nuevo saldo es: $${newBalance.toFixed(2)}.`
        });
        
        setTrackingKey('');

      } catch (error) {
        console.error("Error al reclamar depósito: ", error);
        toast({
          title: "Error en el Proceso",
          description: "Ocurrió un error al intentar acreditar tu saldo. Por favor, intenta de nuevo.",
          variant: "destructive"
        });
      }
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
          <CardDescription>Usa tu app bancaria para enviar fondos a la siguiente cuenta. Un administrador registrará el depósito y podrás reclamarlo aquí.</CardDescription>
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
            <CardTitle>Paso 2: Reclama tu Depósito</CardTitle>
            <CardDescription>
              Una vez que un administrador haya registrado tu transferencia, ingresa aquí la clave de rastreo para acreditar el saldo a tu cuenta.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
              <div className="space-y-2">
                  <Label htmlFor="trackingKey">Clave de Rastreo</Label>
                   <div className="relative">
                       <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                       <Input 
                          id="trackingKey" 
                          type="text" 
                          placeholder="Ingresa la clave de tu comprobante" 
                          value={trackingKey} 
                          onChange={e => setTrackingKey(e.target.value)} 
                          required 
                          disabled={isPending} 
                          className="pl-9"
                      />
                   </div>
              </div>
              <Alert variant="default" className="bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800">
                <AlertCircle className="h-4 w-4 text-blue-500" />
                <AlertTitle className="text-blue-700 dark:text-blue-300">Aviso Importante</AlertTitle>
                <AlertDescription className="text-blue-600 dark:text-blue-400">
                  Tu saldo se actualizará únicamente si la clave de rastreo es válida y está registrada por un administrador.
                </AlertDescription>
              </Alert>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isPending || !user}>
              {isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Banknote className="mr-2 h-4 w-4" />
              )}
              Reclamar y Acreditar Saldo
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
