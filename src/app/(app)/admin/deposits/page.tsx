
'use client';

import { useState, useTransition } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query } from 'firebase/firestore';
import { addDocumentNonBlocking, deleteDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Badge } from '@/components/ui/badge';
import { Loader2, PlusCircle, Trash2, Banknote } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

const depositSchema = z.object({
  trackingKey: z.string().min(1, "La clave de rastreo es obligatoria."),
  amount: z.coerce.number().positive("El monto debe ser un número positivo."),
});

type DepositFormValues = z.infer<typeof depositSchema>;

function getStatusBadgeVariant(status: string): "default" | "secondary" | "destructive" | "outline" {
    switch (status) {
        case "disponible": return "default";
        case "reclamado": return "secondary";
        default: return "outline";
    }
}

export default function ManageDepositsPage() {
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const form = useForm<DepositFormValues>({
    resolver: zodResolver(depositSchema),
    defaultValues: {
      trackingKey: '',
      amount: 0,
    },
  });

  const depositsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'deposits'));
  }, [firestore]);

  const { data: deposits, isLoading } = useCollection(depositsQuery);

  const onSubmit: SubmitHandler<DepositFormValues> = (data) => {
    startTransition(() => {
      if (!firestore) return;
      const depositsColRef = collection(firestore, 'deposits');
      const newDeposit = {
        ...data,
        status: 'disponible',
        createdAt: new Date().toISOString(),
      };
      
      addDocumentNonBlocking(depositsColRef, newDeposit)
        .then(() => {
          toast({ title: "Depósito Registrado", description: "El depósito ha sido añadido al sistema." });
          form.reset();
        })
        .catch(() => {
          toast({ title: "Error", description: "No se pudo registrar el depósito.", variant: "destructive" });
        });
    });
  };

  const handleDelete = (docId: string) => {
    if (!firestore) return;
    const docRef = collection(firestore, 'deposits').doc(docId);
    deleteDocumentNonBlocking(docRef);
    toast({ title: "Depósito Eliminado", description: "El registro del depósito ha sido eliminado." });
  }

  return (
    <div className="grid md:grid-cols-3 gap-8">
      <div className="md:col-span-1">
        <Card>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardHeader>
                <CardTitle>Registrar Nuevo Depósito</CardTitle>
                <CardDescription>Añade los detalles de una transferencia bancaria recibida para que un usuario pueda reclamarla.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="trackingKey"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Clave de Rastreo</FormLabel>
                      <FormControl>
                        <Input placeholder="Ej. 12345ABCDEFG" {...field} disabled={isPending} />
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
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full" disabled={isPending}>
                  {isPending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <PlusCircle className="mr-2 h-4 w-4" />
                  )}
                  Añadir Depósito
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>
      </div>
      <div className="md:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Depósitos Registrados</CardTitle>
            <CardDescription>Lista de todas las transferencias registradas en el sistema.</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center h-40">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Clave de Rastreo</TableHead>
                    <TableHead>Monto</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Fecha Reg.</TableHead>
                    <TableHead>Reclamado por</TableHead>
                    <TableHead className="text-right">Acción</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {deposits?.map((deposit) => (
                    <TableRow key={deposit.id}>
                      <TableCell className="font-mono text-xs">{deposit.trackingKey}</TableCell>
                      <TableCell>${deposit.amount.toFixed(2)}</TableCell>
                      <TableCell><Badge variant={getStatusBadgeVariant(deposit.status)}>{deposit.status}</Badge></TableCell>
                       <TableCell>{format(new Date(deposit.createdAt), 'dd/MM/yy')}</TableCell>
                      <TableCell className="font-mono text-xs">{deposit.claimedBy || '---'}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(deposit.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
