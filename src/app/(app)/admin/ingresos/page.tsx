'use client';

import { useMemo } from 'react';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, where, orderBy } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2, DollarSign, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';
import { servicesData } from '@/lib/data';

export default function IncomePage() {
  const firestore = useFirestore();

  const completedRequestsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(
      collection(firestore, 'serviceRequests'),
      where('status', '==', 'Completado'),
      orderBy('requestDate', 'desc')
    );
  }, [firestore]);

  const { data: completedRequests, isLoading } = useCollection(completedRequestsQuery);

  const incomeData = useMemo(() => {
    if (!completedRequests) {
      return { totalIncome: 0, totalCompleted: 0 };
    }

    const allServices = servicesData.flatMap(category => category.services);
    const serviceCosts = new Map(allServices.map(service => [service.id, service.cost]));

    const totalIncome = completedRequests.reduce((acc, request) => {
      const cost = serviceCosts.get(request.serviceId) || 0;
      return acc + cost;
    }, 0);

    return {
      totalIncome,
      totalCompleted: completedRequests.length,
    };
  }, [completedRequests]);


  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-headline">Ingresos por Trámites</h1>
        <p className="text-muted-foreground mt-2">
          Un resumen de las ganancias generadas por los servicios completados.
        </p>
      </div>

       <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ingresos Totales</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : (
              <div className="text-2xl font-bold">${incomeData.totalIncome.toFixed(2)}</div>
            )}
            <p className="text-xs text-muted-foreground">Ganancias de todos los tiempos</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Trámites Completados</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
             {isLoading ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : (
                <div className="text-2xl font-bold">{incomeData.totalCompleted}</div>
            )}
            <p className="text-xs text-muted-foreground">Total de solicitudes finalizadas</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Desglose de Ingresos</CardTitle>
          <CardDescription>Lista de los trámites completados que han generado ingresos.</CardDescription>
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
                  <TableHead>Servicio</TableHead>
                  <TableHead>Usuario ID</TableHead>
                  <TableHead>Fecha de Finalización</TableHead>
                  <TableHead className="text-right">Costo</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {completedRequests?.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell>
                        <div className='font-medium'>{request.serviceName}</div>
                        <div className='text-xs text-muted-foreground'>{request.id}</div>
                    </TableCell>
                     <TableCell className="font-mono text-xs">{request.userId}</TableCell>
                    <TableCell>{format(new Date(request.requestDate), 'dd/MM/yy HH:mm')}</TableCell>
                    <TableCell className="text-right font-medium">
                        ${(servicesData.flatMap(c => c.services).find(s => s.id === request.serviceId)?.cost || 0).toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
                 {(!completedRequests || completedRequests.length === 0) && (
                    <TableRow>
                        <TableCell colSpan={4} className="h-24 text-center">
                            Aún no hay trámites completados para mostrar.
                        </TableCell>
                    </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
