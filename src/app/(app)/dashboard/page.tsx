'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Activity,
  ArrowUpRight,
  ClipboardCheck,
  DollarSign,
  ListChecks,
  Users,
  Loader2
} from 'lucide-react';
import Link from 'next/link';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useCollection, useFirestore, useUser, useMemoFirebase } from '@/firebase';
import { collection, query, where, orderBy, limit } from 'firebase/firestore';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

const quickActions = [
    { title: "Ver Servicios", href: "/servicios", icon: ListChecks, description: "Explora todos los trámites." },
    { title: "Mis Órdenes", href: "/seguimiento", icon: ClipboardCheck, description: "Revisa tus solicitudes." },
]

function getStatusBadgeVariant(status: string): "default" | "secondary" | "destructive" | "outline" {
    switch (status) {
        case "Completado": return "default";
        case "En Proceso": return "secondary";
        case "Solicitado": return "outline";
        case "Rechazado": return "destructive";
        default: return "secondary";
    }
}


export default function DashboardPage() {
    const { user } = useUser();
    const firestore = useFirestore();

    const requestsQuery = useMemoFirebase(() => {
        if (!firestore || !user) return null;
        return query(
            collection(firestore, 'serviceRequests'),
            where('userId', '==', user.uid),
            orderBy('requestDate', 'desc')
        );
    }, [firestore, user]);
    
    const recentRequestsQuery = useMemoFirebase(() => {
        if (!firestore || !user) return null;
        return query(
            collection(firestore, 'serviceRequests'),
            where('userId', '==', user.uid),
            orderBy('requestDate', 'desc'),
            limit(4)
        );
    }, [firestore, user]);

    const { data: allRequests, isLoading: isLoadingAll } = useCollection(requestsQuery);
    const { data: recentRequests, isLoading: isLoadingRecent } = useCollection(recentRequestsQuery);

    const stats = useMemo(() => {
        if (!allRequests) {
            return { completed: 0, active: 0 };
        }
        const completed = allRequests.filter(r => r.status === 'Completado').length;
        const active = allRequests.filter(r => r.status === 'En Proceso' || r.status === 'Solicitado').length;
        return { completed, active };
    }, [allRequests]);


  return (
    <div className="flex flex-col gap-6">
      <div className="flex-1 space-y-4">
        <h1 className="text-3xl font-headline font-bold tracking-tight">¡Hola, bienvenido de nuevo!</h1>
        <p className="text-muted-foreground">Aquí tienes un resumen de tu actividad reciente y accesos rápidos.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Trámites Completados</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoadingAll ? <Loader2 className="h-6 w-6 animate-spin" /> : <div className="text-2xl font-bold">{stats.completed}</div>}
            <p className="text-xs text-muted-foreground">En total</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Trámites Activos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoadingAll ? <Loader2 className="h-6 w-6 animate-spin" /> : <div className="text-2xl font-bold">{stats.active}</div>}
            <p className="text-xs text-muted-foreground">Actualmente en proceso</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Notificaciones</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Nuevas desde la última visita</p>
          </CardContent>
        </Card>
      </div>

       <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Órdenes Recientes</CardTitle>
            <CardDescription>
              Un vistazo a tus últimos trámites solicitados.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingRecent ? (
                 <div className="flex justify-center items-center h-40">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                 </div>
            ) : (
                <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead>Trámite</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Fecha</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {recentRequests && recentRequests.length > 0 ? (
                        recentRequests.map((req) => (
                            <TableRow key={req.id}>
                                <TableCell>
                                    <div className="font-medium">{req.serviceName}</div>
                                    <div className="text-sm text-muted-foreground md:inline">
                                        {req.id}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant={getStatusBadgeVariant(req.status)}>{req.status}</Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    {formatDistanceToNow(new Date(req.requestDate), { addSuffix: true, locale: es })}
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={3} className="h-24 text-center">
                                No has solicitado ningún trámite todavía.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
                </Table>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
            <CardHeader>
                <CardTitle>Acciones Rápidas</CardTitle>
                <CardDescription>Accede a las funciones principales.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
                {quickActions.map((action) => (
                     <Link href={action.href} key={action.href} className="group flex items-center gap-4 p-2 rounded-lg hover:bg-secondary transition-colors">
                        <div className="bg-secondary p-3 rounded-lg group-hover:bg-background transition-colors">
                            <action.icon className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>
                        <div>
                            <p className="font-semibold">{action.title}</p>
                            <p className="text-sm text-muted-foreground">{action.description}</p>
                        </div>
                        <ArrowUpRight className="h-5 w-5 ml-auto text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                ))}
            </CardContent>
        </Card>
      </div>

    </div>
  );
}
