
'use client';

import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader2, Star, Gift } from 'lucide-react';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';

export default function AdminUsersPage() {
    const firestore = useFirestore();
    const router = useRouter();

    const usersQuery = useMemoFirebase(() => {
        if (!firestore) return null;
        return query(collection(firestore, 'users'), orderBy('creationDate', 'desc'));
    }, [firestore]);

    const { data: users, isLoading } = useCollection(usersQuery);

    const handleUserClick = (userId: string) => {
        router.push(`/admin/users/${userId}`);
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold font-headline">Gestión de Usuarios</h1>
                <p className="text-muted-foreground mt-2">
                    Visualiza y administra a todos los usuarios registrados en la plataforma.
                </p>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Todos los Usuarios</CardTitle>
                    <CardDescription>Haz clic en un usuario para ver sus detalles y su historial de trámites.</CardDescription>
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
                                    <TableHead>Usuario</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Créditos</TableHead>
                                    <TableHead>Créditos Promo</TableHead>
                                    <TableHead className="text-right">Saldo</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {users?.map((user) => (
                                <TableRow key={user.id} onClick={() => handleUserClick(user.id)} className="cursor-pointer">
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar>
                                                <AvatarImage src={`https://picsum.photos/seed/${user.id}/40/40`} />
                                                <AvatarFallback>{user.firstName?.charAt(0)}{user.lastName?.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <span className="font-medium">{user.firstName} {user.lastName}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1">
                                            <Star className="h-4 w-4 text-yellow-500" />
                                            <span className="font-mono">{user.credits || 0}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1">
                                            <Gift className="h-4 w-4 text-pink-500" />
                                            <span className="font-mono">{user.promotionalCredits || 0}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right font-mono">${(user.balance || 0).toFixed(2)}</TableCell>
                                </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}

    