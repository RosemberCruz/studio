'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, CircleDot, Clock, Download, Loader2, XCircle, FileWarning } from 'lucide-react';
import { useCollection, useFirestore, useUser, useMemoFirebase } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

function getStatusInfo(status: string) {
  switch (status) {
    case 'Completado':
      return { icon: CheckCircle, color: 'text-green-500', badgeVariant: 'default' as const };
    case 'En Proceso':
      return { icon: Clock, color: 'text-blue-500', badgeVariant: 'secondary' as const };
    case 'Solicitado':
      return { icon: CircleDot, color: 'text-yellow-500', badgeVariant: 'outline' as const };
    case 'Rechazado':
      return { icon: XCircle, color: 'text-red-500', badgeVariant: 'destructive' as const };
    default:
      return { icon: Clock, color: 'text-muted-foreground', badgeVariant: 'secondary' as const };
  }
}

export default function ProgressTrackerPage() {
    const { user } = useUser();
    const firestore = useFirestore();

    const requestsQuery = useMemoFirebase(() => {
        if (!firestore || !user) return null;
        return query(collection(firestore, 'serviceRequests'), where('userId', '==', user.uid));
    }, [firestore, user]);

    const { data: serviceRequests, isLoading } = useCollection(requestsQuery);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Mis Órdenes</h1>
        <p className="text-muted-foreground mt-2">
          Revisa el estado actual de todas tus solicitudes en un solo lugar.
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-60">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      ) : serviceRequests && serviceRequests.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {serviceRequests.map((item) => {
            const statusInfo = getStatusInfo(item.status);
            return (
                <Card key={item.id} className="flex flex-col">
                <CardHeader>
                    <div className="flex justify-between items-start">
                    <div>
                        <CardTitle className="text-lg">{item.serviceName}</CardTitle>
                        <CardDescription>ID: {item.id}</CardDescription>
                    </div>
                    <Badge variant={statusInfo.badgeVariant}>{item.status}</Badge>
                    </div>
                </CardHeader>
                <CardContent className="flex-grow flex flex-col justify-between">
                    <div>
                        <div className="flex items-center gap-3">
                            <statusInfo.icon className={`h-5 w-5 ${statusInfo.color}`} />
                            <p className="text-sm font-medium">
                                {item.status}
                            </p>
                        </div>
                        <div className="text-xs text-muted-foreground mt-2 flex justify-between">
                            <span>Solicitado: {format(new Date(item.requestDate), "dd/MM/yy", { locale: es })}</span>
                        </div>
                    </div>
                    {item.status === 'Completado' && item.fileUrl && (
                        <Button asChild className="w-full mt-4">
                            <a href={item.fileUrl} target="_blank" rel="noopener noreferrer">
                                <Download className="mr-2" />
                                Descargar Documento
                            </a>
                        </Button>
                    )}
                </CardContent>
                </Card>
            );
            })}
        </div>
      ) : (
        <Card className="col-span-full">
            <CardContent className="flex flex-col items-center justify-center h-60 gap-4 text-center p-6">
                <FileWarning className="h-16 w-16 text-muted-foreground/50" />
                <h3 className="text-xl font-semibold">No has solicitado ningún trámite</h3>
                <p className="text-muted-foreground">Cuando solicites un servicio, podrás ver su estado y progreso aquí.</p>
                <Button>Ver Servicios</Button>
            </CardContent>
        </Card>
      )}
    </div>
  );
}
