
'use client';

import { useState, useTransition } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Landmark, Loader2, Clipboard } from 'lucide-react';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { updateDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { useEffect } from 'react';

const banks = [
    "BBVA Bancomer",
    "Citibanamex",
    "Santander",
    "Banorte",
    "HSBC",
    "Scotiabank",
    "Inbursa",
    "Banco Azteca",
    "BanCoppel",
    "Otro"
];

const bankDetails = {
    accountHolder: 'ROSEMBER CRUZ BETANCOURT',
    bankName: 'BBVA BANCOMER',
    accountNumber: '4152 3140 2739 8869'
};

export default function AddBalancePage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [email, setEmail] = useState('');
  const [amount, setAmount] = useState('');
  const [trackingKey, setTrackingKey] = useState('');
  const [bank, setBank] = useState('');

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
            title: "Copiado",
            description: `El ${field} ha sido copiado al portapapeles.`
        });
    }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    startTransition(() => {
        if (!user || !userData) {
             toast({
                title: "Error",
                description: "Debes iniciar sesión para recargar saldo.",
                variant: "destructive"
            });
            return;
        }

        if (!email || !amount || !trackingKey || !bank) {
            toast({
                title: "Campos Incompletos",
                description: "Por favor, completa todos los campos del formulario.",
                variant: "destructive"
            });
            return;
        }

        const rechargeAmount = parseFloat(amount);
        if (isNaN(rechargeAmount) || rechargeAmount <= 0) {
             toast({
                title: "Monto Inválido",
                description: "Por favor, ingresa un monto válido.",
                variant: "destructive"
            });
            return;
        }

        const newBalance = userData.balance + rechargeAmount;
        
        // Non-blocking update. The UI will update reactively from useDoc
        if (userDocRef) {
            updateDocumentNonBlocking(userDocRef, { balance: newBalance });
        }

        toast({
            title: "¡Recarga Exitosa!",
            description: `Se han añadido $${rechargeAmount.toFixed(2)} a tu saldo. Nuevo saldo: $${newBalance.toFixed(2)}.`
        });

        // Reset form
        setAmount('');
        setTrackingKey('');
        setBank('');
    });
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Recargar Saldo</h1>
        <p className="text-muted-foreground mt-2">
          Reporta aquí tu depósito o transferencia para añadir saldo a tu cuenta.
        </p>
      </div>

       <Card className="max-w-2xl mx-auto border-primary/50">
        <CardHeader>
            <CardTitle>Datos para la Transferencia</CardTitle>
            <CardDescription>Realiza tu depósito a la siguiente cuenta y luego repórtalo en el formulario de abajo.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-secondary/50 rounded-md">
                <div>
                    <Label className="text-xs">Titular de la cuenta</Label>
                    <p className="font-semibold">{bankDetails.accountHolder}</p>
                </div>
            </div>
            <div className="flex justify-between items-center p-3 bg-secondary/50 rounded-md">
                <div>
                    <Label className="text-xs">Banco</Label>
                    <p className="font-semibold">{bankDetails.bankName}</p>
                </div>
            </div>
             <div className="flex justify-between items-center p-3 bg-secondary/50 rounded-md">
                <div>
                    <Label className="text-xs">Número de Cuenta / CLABE</Label>
                    <p className="font-semibold">{bankDetails.accountNumber}</p>
                </div>
                <Button variant="ghost" size="icon" onClick={() => copyToClipboard(bankDetails.accountNumber, 'número de cuenta')}>
                    <Clipboard className="h-4 w-4" />
                </Button>
            </div>
        </CardContent>
       </Card>

      <Card className="max-w-2xl mx-auto">
        <form onSubmit={handleSubmit}>
            <CardHeader>
            <CardTitle>Reportar Depósito</CardTitle>
            <CardDescription>
                Llena el formulario con los datos de tu transferencia. La recarga se aplicará automáticamente a tu saldo.
            </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="email">Correo Electrónico Registrado</Label>
                    <Input id="email" type="email" placeholder="tu@email.com" value={email} onChange={e => setEmail(e.target.value)} required disabled={isPending || !!user?.email} />
                </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="amount">Monto Enviado (MXN)</Label>
                        <Input id="amount" type="number" placeholder="Ej: 500.00" value={amount} onChange={e => setAmount(e.target.value)} required disabled={isPending}/>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="trackingKey">Clave de Rastreo</Label>
                        <Input id="trackingKey" type="text" placeholder="Clave de 18 dígitos" value={trackingKey} onChange={e => setTrackingKey(e.target.value)} required disabled={isPending} />
                    </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="bank">Banco de Origen</Label>
                    <Select value={bank} onValueChange={setBank} required disabled={isPending}>
                        <SelectTrigger id="bank">
                            <SelectValue placeholder="Selecciona un banco" />
                        </SelectTrigger>
                        <SelectContent>
                            {banks.map(b => (
                                <SelectItem key={b} value={b}>{b}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </CardContent>
            <CardFooter>
            <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                    <Landmark className="mr-2 h-4 w-4" />
                )}
                Reportar Transferencia
            </Button>
            </CardFooter>
        </form>
      </Card>
    </div>
  );
}
