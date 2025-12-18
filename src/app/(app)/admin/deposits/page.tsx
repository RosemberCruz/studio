'use client';

import { useTransition } from 'react';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, writeBatch, doc, getDoc } from 'firebase/firestore';
import { updateDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, CheckCircle, XCircle, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

function getStatusBadgeVariant(status: string): "default" | "secondary" | "destructive" | "outline" {
    switch (status) {
        case "aprobado": return "default";
        case "pendiente": return "secondary";
        case "rechazado": return "destructive";
        default: return "outline";
    }
}

export default function ManageDepositRequestsPage() {
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const requestsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    // Potentially sort by date in a real app: orderBy('requestDate', 'desc')
    return query(collection(firestore, 'depositRequests'));
  }, [firestore]);

  const { data: requests, isLoading } = useCollection(requestsQuery);

  const handleApprove = (request: any) => {
    startTransition(async () => {
      if (!firestore) return;
      
      const batch = writeBatch(firestore);
      
      // 1. Update the request status
      const requestRef = doc(firestore, 'depositRequests', request.id);
      batch.update(requestRef, { status: 'aprobado' });

      // 2. Update the user's balance
      const userRef = doc(firestore, 'users', request.userId);
      
      try {
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
            const currentBalance = userDoc.data().balance || 0;
            const newBalance = currentBalance + request.amount;
            batch.update(userRef, { balance: newBalance });
            
            await batch.commit();
            toast({ title: "Solicitud Aprobada", description: `El saldo de ${request.userName} ha sido actualizado.` });
        } else {
          toast({ title: "Error", description: "No se encontró al usuario para actualizar el saldo.", variant: "destructive" });
        }
      } catch(e: any) {
         toast({ title: "Error", description: `No se pudo completar la operación: ${e.message}`, variant: "destructive" });
      }

    });
  };

  const handleReject = (requestId: string) => {
    if (!firestore) return;
    const requestRef = doc(firestore, 'depositRequests', requestId);
    updateDocumentNonBlocking(requestRef, { status: 'rechazado' });
    toast({ title: "Solicitud Rechazada", variant: "destructive" });
  }

  return (
    <div className="space-y-6">
       <div>
        <h1 className="text-3xl font-bold font-headline">Gestionar Solicitudes de Depósito</h1>
        <p className="text-muted-foreground mt-2">
            Revisa y aprueba las solicitudes de recarga de saldo de los usuarios.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Solicitudes de Depósito</CardTitle>
          <CardDescription>Lista de todas las solicitudes de recarga enviadas por los usuarios.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading || isPending ? (
            <div className="flex justify-center items-center h-40">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Usuario</TableHead>
                  <TableHead>Clave de Rastreo</TableHead>
                  <TableHead>Monto</TableHead>
                  <TableHead>Fecha Solicitud</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests?.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell>
                        <div className='font-medium'>{request.userName}</div>
                        <div className='text-xs text-muted-foreground'>{request.userEmail}</div>
                    </TableCell>
                    <TableCell className="font-mono text-xs">{request.trackingKey}</TableCell>
                    <TableCell>${request.amount.toFixed(2)}</TableCell>
                    <TableCell>{format(new Date(request.requestDate), 'dd/MM/yy HH:mm')}</TableCell>
                    <TableCell><Badge variant={getStatusBadgeVariant(request.status)}>{request.status}</Badge></TableCell>
                    <TableCell className="text-right space-x-2">
                      {request.status === 'pendiente' && (
                        <>
                          <Button variant="outline" size="sm" onClick={() => handleReject(request.id)} disabled={isPending}>
                            <XCircle className="mr-1 h-4 w-4" /> Rechazar
                          </Button>
                           <Button variant="default" size="sm" onClick={() => handleApprove(request)} disabled={isPending}>
                            {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle className="mr-1 h-4 w-4" />}
                             Aprobar
                          </Button>
                        </>
                      )}
                      {request.status !== 'pendiente' && (
                        <span className='text-sm text-muted-foreground'>---</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
