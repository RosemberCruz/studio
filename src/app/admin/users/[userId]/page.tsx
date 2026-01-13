
'use client';

import { useState } from 'react';
import { useDoc, useMemoFirebase, useFirestore, useCollection } from '@/firebase';
import { doc, collection, query, where, deleteDoc, updateDoc } from 'firebase/firestore';
import { notFound, useParams, useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Mail, Phone, Calendar, DollarSign, ListChecks, Trash2, PlusCircle, Star, Gift } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';


function getStatusBadgeVariant(status: string): "default" | "secondary" | "destructive" | "outline" {
    switch (status) {
        case "Completado": return "default";
        case "En Proceso": return "secondary";
        case "Solicitado": return "outline";
        case "Rechazado": return "destructive";
        default: return "secondary";
    }
}

export default function UserDetailPage() {
    const params = useParams();
    const userId = params.userId as string;
    const firestore = useFirestore();
    const router = useRouter();
    const { toast } = useToast();
    const [creditsToAdd, setCreditsToAdd] = useState(0);
    const [isUpdatingCredits, setIsUpdatingCredits] = useState(false);

    const userDocRef = useMemoFirebase(() => {
        if (!firestore || !userId) return null;
        return doc(firestore, 'users', userId);
    }, [firestore, userId]);

    const requestsQuery = useMemoFirebase(() => {
        if (!firestore || !userId) return null;
        return query(collection(firestore, 'serviceRequests'), where('userId', '==', userId));
    }, [firestore, userId]);

    const { data: userProfile, isLoading: isUserLoading } = useDoc(userDocRef);
    const { data: serviceRequests, isLoading: areRequestsLoading } = useCollection(requestsQuery);

    const handleDeleteUser = async () => {
        if (!userDocRef) return;
        try {
            await deleteDoc(userDocRef);
            toast({
                title: "Usuario Eliminado",
                description: "Los datos del usuario han sido eliminados de Firestore.",
            });
            router.push('/admin/users');
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error al Eliminar",
                description: "No se pudieron eliminar los datos del usuario.",
            });
        }
    };
    
    const handleAddCredits = async () => {
        if (!userDocRef || !userProfile || creditsToAdd <= 0) {
            toast({
                title: "Valor inválido",
                description: "Por favor, introduce un número de créditos mayor a cero.",
                variant: "destructive"
            });
            return;
        }
        
        setIsUpdatingCredits(true);
        const currentCredits = userProfile.credits || 0;
        const newCredits = currentCredits + creditsToAdd;
        
        try {
            await updateDoc(userDocRef, { credits: newCredits });
            toast({
                title: "Créditos Añadidos",
                description: `Se han añadido ${creditsToAdd} créditos a ${userProfile.firstName}. Nuevo total: ${newCredits}.`
            });
            setCreditsToAdd(0);
        } catch (error) {
             toast({
                variant: "destructive",
                title: "Error al Actualizar",
                description: "No se pudieron añadir los créditos.",
            });
        } finally {
            setIsUpdatingCredits(false);
        }
    };

    if (isUserLoading) {
        return (
            <div className="flex h-full items-center justify-center">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
        );
    }

    if (!isUserLoading && !userProfile) {
        // This can happen briefly after a user is deleted and the hook re-evaluates.
        // Or if the user ID is invalid.
        return (
             <div className="flex h-full items-center justify-center">
                <Card>
                    <CardHeader>
                        <CardTitle>Usuario no encontrado</CardTitle>
                        <CardDescription>
                            El usuario no existe o ya ha sido eliminado. Redirigiendo...
                        </CardDescription>
                    </CardHeader>
                </Card>
            </div>
        )
    }
    
    if (!userProfile) {
        return null; // Should be covered by the case above, but as a fallback.
    }


    const creationDate = userProfile.creationDate ? new Date(userProfile.creationDate) : new Date();

    const handleRequestClick = (requestId: string) => {
        router.push(`/admin/requests/${requestId}`);
    }

    return (
        <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-1 space-y-8">
                <Card>
                    <CardHeader className="items-center text-center">
                        <Avatar className="h-24 w-24 mb-4">
                            <AvatarImage src={`https://picsum.photos/seed/${userProfile.id}/200/200`} alt="Avatar" />
                            <AvatarFallback>{userProfile.firstName?.charAt(0)}{userProfile.lastName?.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <CardTitle className="text-2xl">{userProfile.firstName} {userProfile.lastName}</CardTitle>
                        <CardDescription>ID de Usuario: {userProfile.id}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-3">
                            <Mail className="h-5 w-5 text-muted-foreground" />
                            <span className="text-sm">{userProfile.email}</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Phone className="h-5 w-5 text-muted-foreground" />
                            <span className="text-sm">{userProfile.phoneNumber || 'No especificado'}</span>
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
                            <Badge variant="secondary" className="text-base">${userProfile.balance.toFixed(2)}</Badge>
                        </div>
                        <div className="flex items-center gap-3">
                            <Star className="h-5 w-5 text-muted-foreground" />
                            <span className="text-sm">Créditos Generales:</span>
                            <Badge variant="secondary" className="text-base">{userProfile.credits || 0}</Badge>
                        </div>
                         <div className="flex items-center gap-3">
                            <Gift className="h-5 w-5 text-muted-foreground" />
                            <span className="text-sm">Créditos Promo:</span>
                            <Badge variant="secondary" className="text-base">{userProfile.promotionalCredits || 0}</Badge>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="destructive" className="w-full">
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Eliminar Usuario
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                <AlertDialogTitle>¿Estás absolutely seguro?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Esta acción no se puede deshacer. Esto eliminará permanentemente los datos del usuario de la base de datos de Firestore, pero no eliminará su cuenta de autenticación.
                                </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction onClick={handleDeleteUser}>Sí, eliminar datos</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </CardFooter>
                </Card>
                
                <Card>
                    <CardHeader>
                        <CardTitle>Administrar Créditos Generales</CardTitle>
                        <CardDescription>Añade créditos a la cuenta de este usuario.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="credits-to-add">Créditos a añadir</Label>
                            <Input
                                id="credits-to-add"
                                type="number"
                                value={creditsToAdd}
                                onChange={(e) => setCreditsToAdd(Number(e.target.value))}
                                placeholder="Ej: 10"
                                min="0"
                            />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button onClick={handleAddCredits} disabled={isUpdatingCredits} className="w-full">
                            {isUpdatingCredits ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <PlusCircle className="mr-2 h-4 w-4" />}
                            Añadir Créditos
                        </Button>
                    </CardFooter>
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
                                       <TableRow key={request.id} onClick={() => handleRequestClick(request.id)} className="cursor-pointer hover:bg-muted/50">
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
                                        <TableCell colSpan={3} className="text-center h-24">
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

    
