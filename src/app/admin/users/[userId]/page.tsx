
'use client';

import { useDoc, useMemoFirebase, useFirestore } from '@/firebase';
import { doc } from 'firebase/firestore';
import { notFound, useParams } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, User, Mail, Phone, Calendar, DollarSign, ListChecks } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

// Datos de ejemplo para el historial
const recentOrders = [
    { id: "#3210", service: "Reimpresión de Constancia RFC", status: "Completado", date: "2024-05-20" },
    { id: "#3209", service: "Póliza de Seguro Vehicular", status: "En Proceso", date: "2024-05-15" },
];

function getStatusBadgeVariant(status: string): "default" | "secondary" | "destructive" | "outline" {
    switch (status) {
        case "Completado": return "default";
        case "En Proceso": return "secondary";
        default: return "outline";
    }
}

export default function UserDetailPage() {
    const params = useParams();
    const userId = params.userId as string;
    const firestore = useFirestore();

    const userDocRef = useMemoFirebase(() => {
        if (!firestore || !userId) return null;
        return doc(firestore, 'users', userId);
    }, [firestore, userId]);

    const { data: user, isLoading } = useDoc(userDocRef);

    if (isLoading) {
        return (
            <div className="flex h-full items-center justify-center">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
        );
    }

    if (!user) {
        notFound();
    }
    
    const creationDate = user.creationDate ? new Date(user.creationDate) : new Date();

    return (
        <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-1">
                <Card>
                    <CardHeader className="items-center text-center">
                        <Avatar className="h-24 w-24 mb-4">
                            <AvatarImage src={`https://picsum.photos/seed/${user.id}/200/200`} alt="Avatar" />
                            <AvatarFallback>{user.firstName?.charAt(0)}{user.lastName?.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <CardTitle className="text-2xl">{user.firstName} {user.lastName}</CardTitle>
                        <CardDescription>ID de Usuario: {user.id}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-3">
                            <Mail className="h-5 w-5 text-muted-foreground" />
                            <span className="text-sm">{user.email}</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Phone className="h-5 w-5 text-muted-foreground" />
                            <span className="text-sm">{user.phoneNumber || 'No especificado'}</span>
                        </div>
                         <div className="flex items-center gap-3">
                            <Calendar className="h-5 w-5 text-muted-foreground" />
                            <span className="text-sm">
                                Miembro desde {format(creationDate, "d 'de' MMMM 'de' yyyy", { locale: es })}
                            </span>
                        </div>
                        <div className="flex items-center gap-3 pt-2">
                            <DollarSign className="h-5 w-5 text-muted-foreground" />
                            <span className="text-sm">Saldo Actual:</span>
                            <Badge variant="secondary" className="text-base">${user.balance.toFixed(2)}</Badge>
                        </div>
                    </CardContent>
                </Card>
            </div>
            <div className="lg:col-span-2">
                <Card>
                    <CardHeader>
                         <div className="flex items-center gap-3">
                            <ListChecks className="h-6 w-6 text-primary" />
                            <CardTitle>Historial de Trámites</CardTitle>
                        </div>
                        <CardDescription>Trámites solicitados por este usuario.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Servicio</TableHead>
                                    <TableHead>Estado</TableHead>
                                    <TableHead className="text-right">Fecha</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                               {recentOrders.map((order) => (
                                   <TableRow key={order.id}>
                                       <TableCell>
                                           <div className="font-medium">{order.service}</div>
                                            <div className="text-sm text-muted-foreground md:inline">
                                                {order.id}
                                            </div>
                                       </TableCell>
                                       <TableCell>
                                            <Badge variant={getStatusBadgeVariant(order.status)}>{order.status}</Badge>
                                       </TableCell>
                                        <TableCell className="text-right">{format(new Date(order.date), "dd/MM/yyyy")}</TableCell>
                                   </TableRow>
                               ))}
                            </Body>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
