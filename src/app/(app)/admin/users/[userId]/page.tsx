'use client';

import { useDoc, useMemoFirebase, useFirestore, useCollection } from '@/firebase';
import { doc, collection, query, where } from 'firebase/firestore';
import { notFound, useParams, useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Mail, Phone, Calendar, DollarSign, ListChecks } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

function getStatusBadgeVariant(status: string): "default" | "secondary" | "destructive" | "outline" {
    switch (status) {
        case "Completado": return "default";
        case "En Proceso": return "secondary";
        case "Solicitado": return "secondary";
        case "Rechazado": return "destructive";
        default: return "outline";
    }
}

export default function UserDetailPage() {
    const params = useParams();
    const userId = params.userId as string;
    const firestore = useFirestore();
    const router = useRouter();

    const userDocRef = useMemoFirebase(() => {
        if (!firestore || !userId) return null;
        return doc(firestore, 'users', userId);
    }, [firestore, userId]);

    const requestsQuery = useMemoFirebase(() => {
        if (!firestore || !userId) return null;
        return query(collection(firestore, 'serviceRequests'), where('userId', '==', userId));
    }, [firestore, userId]);

    const { data: user, isLoading: isUserLoading } = useDoc(userDocRef);
    const { data: serviceRequests, isLoading: areRequestsLoading } = useCollection(requestsQuery);

    if (isUserLoading) {
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

    const handleRequestClick = (requestId: string) => {
        router.push(`/admin/requests/${requestId}`);
    }

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
                        <CardDescription>Haz clic en un trámite para gestionarlo.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {areRequestsLoading ? (
                             <div className="flex justify-center items-center h-40">
                                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            </div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Servicio</TableHead>
                                        <TableHead>Estado</TableHead>
                                        <TableHead className="text-right">Fecha</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                {serviceRequests && serviceRequests.length > 0 ? (
                                   serviceRequests.map((request) => (
                                       <TableRow key={request.id} onClick={() => handleRequestClick(request.id)} className="cursor-pointer">
                                           <TableCell>
                                               <div className="font-medium">{request.serviceName}</div>
                                                <div className="text-sm text-muted-foreground md:inline">
                                                    ID: {request.id}
                                                </div>
                                           </TableCell>
                                           <TableCell>
                                                <Badge variant={getStatusBadgeVariant(request.status)}>{request.status}</Badge>
                                           </TableCell>
                                            <TableCell className="text-right">{format(new Date(request.requestDate), "dd/MM/yyyy")}</TableCell>
                                       </TableRow>
                                   ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={3} className="text-center">
                                            Este usuario no ha solicitado trámites.
                                        </TableCell>
                                    </TableRow>
                                )}
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
