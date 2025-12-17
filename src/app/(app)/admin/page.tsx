'use client';

import { useCollection, useMemoFirebase } from '@/firebase';
import { collection, query } from 'firebase/firestore';
import { useFirestore } from '@/firebase/provider';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Loader2, ShieldCheck } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useRouter } from 'next/navigation';

export default function AdminDashboardPage() {
    const firestore = useFirestore();
    const router = useRouter();

    const usersQuery = useMemoFirebase(() => {
        if (!firestore) return null;
        return query(collection(firestore, 'users'));
    }, [firestore]);

    const { data: users, isLoading } = useCollection(usersQuery);

    const handleUserClick = (userId: string) => {
        // Corrected path to be relative
        router.push(`admin/users/${userId}`);
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                    <ShieldCheck className="h-8 w-8 text-primary" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold font-headline">Panel de Administrador</h1>
                    <p className="text-muted-foreground mt-2">
                        Gestiona usuarios, servicios y configuraciones de la aplicación.
                    </p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Usuarios Registrados</CardTitle>
                    <CardDescription>
                        Esta es la lista de todos los usuarios en la plataforma. Haz clic en un usuario para ver sus detalles.
                    </CardDescription>
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
                                    <TableHead className="text-right">Saldo</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {users?.map((user) => (
                                    <TableRow key={user.id} onClick={() => handleUserClick(user.id)} className="cursor-pointer">
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-9 w-9">
                                                     <AvatarImage src={`https://picsum.photos/seed/${user.id}/100/100`} alt="Avatar" />
                                                    <AvatarFallback>{user.firstName?.charAt(0)}{user.lastName?.charAt(0)}</AvatarFallback>
                                                </Avatar>
                                                <div className="font-medium">{user.firstName} {user.lastName}</div>
                                            </div>
                                        </TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell className="text-right">
                                            <Badge variant="secondary">${user.balance.toFixed(2)}</Badge>
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
