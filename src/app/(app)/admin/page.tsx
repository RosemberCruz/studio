'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ShieldCheck, Banknote, ListChecks, Users } from 'lucide-react';
import Link from 'next/link';

const adminActions = [
    {
        title: "Gestionar Usuarios",
        href: "/admin/users",
        icon: Users,
        description: "Ver la lista de usuarios y gestionar sus perfiles y trámites."
    },
    {
        title: "Gestionar Depósitos",
        href: "/admin/deposits",
        icon: Banknote,
        description: "Aprobar o rechazar solicitudes de recarga de saldo."
    },
    {
        title: "Ver Solicitudes de Trámites",
        href: "/seguimiento",
        icon: ListChecks,
        description: "Revisar y gestionar todas las solicitudes de servicios."
    }
]

export default function AdminDashboardPage() {

    return (
        <div className="space-y-8">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                    <ShieldCheck className="h-8 w-8 text-primary" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold font-headline">Panel de Administrador</h1>
                    <p className="text-muted-foreground mt-2">
                        Gestiona usuarios, depósitos, servicios y configuraciones de la aplicación.
                    </p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Acciones Principales</CardTitle>
                    <CardDescription>
                        Accede a las principales herramientas de gestión.
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-4">
                    {adminActions.map((action) => (
                        <Link href={action.href} key={action.href} className="group block p-4 rounded-lg border hover:bg-secondary transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="bg-secondary p-3 rounded-lg">
                                    <action.icon className="h-6 w-6 text-primary" />
                                </div>
                                <div>
                                    <p className="font-semibold text-lg">{action.title}</p>
                                    <p className="text-sm text-muted-foreground">{action.description}</p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </CardContent>
            </Card>

        </div>
    );
}
