'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowRight } from 'lucide-react';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query } from 'firebase/firestore'; // Removed orderBy
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

function getStatusBadgeVariant(status: string): "default" | "secondary" | "destructive" | "outline" {
  switch (status) {
    case 'Completado': return 'default';
    case 'En Proceso': return 'secondary';
    case 'Solicitado': return 'outline';
    case 'Rechazado': return 'destructive';
    default: return 'secondary';
  }
}

export default function AdminRequestsPage() {
    const firestore = useFirestore();
    const router = useRouter();

    const allRequestsQuery = useMemoFirebase(() => {
        if (!firestore) return null;
        // Diagnostic change: Removed orderBy('requestDate', 'desc')
        return query(collection(firestore, 'serviceRequests'));
    }, [firestore]);

    const { data: requests, isLoading } = useCollection(allRequestsQuery);

    const handleManageClick = (requestId: string) => {
        router.push(`/admin/requests/${requestId}`);
    }

    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="flex justify-center items-center h-60">
                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                </div>
            );
        }

        return (
            <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead>Servicio</TableHead>
                    <TableHead>Usuario ID</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Acción</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {requests && requests.length > 0 ? (
                       requests.map((req) => (
                        <TableRow key={req.id}>
                            <TableCell>
                                <div className="font-medium">{req.serviceName}</div>
                                <div className="text-sm text-muted-foreground">{req.id}</div>
                            </TableCell>
                            <TableCell>
                                <div className="font-mono text-xs">{req.userId}</div>
                            </TableCell>
                            <TableCell>{format(new Date(req.requestDate), 'dd/MM/yy HH:mm')}</TableCell>
                            <TableCell><Badge variant={getStatusBadgeVariant(req.status)}>{req.status}</Badge></TableCell>
                            <TableCell className="text-right">
                                <Button size="sm" variant="outline" onClick={() => handleManageClick(req.id)}>
                                    Gestionar <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </TableCell>
                        </TableRow>
                       ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={5} className="h-24 text-center">
                                No hay solicitudes de trámites.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
             </Table>
        );
    }
    
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold font-headline">Administrar Trámites</h1>
                <p className="text-muted-foreground mt-2">
                    Revisa y gestiona todas las solicitudes de trámites de los usuarios.
                </p>
            </div>
             <Card>
                <CardHeader>
                    <CardTitle>Todas las Solicitudes de Trámites</CardTitle>
                    <CardDescription>Gestiona las solicitudes de todos los usuarios.</CardDescription>
                </CardHeader>
                <CardContent>
                    {renderContent()}
                </CardContent>
            </Card>
        </div>
    )
}
