'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ShieldCheck, Banknote, ListChecks, UploadCloud, Github, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const adminActions = [
    {
        title: "Gestionar Depósitos",
        href: "/admin/deposits",
        icon: Banknote,
        description: "Aprobar o rechazar solicitudes de recarga de saldo."
    },
    {
        title: "Ver Solicitudes de Trámites",
        href: "/seguimiento", // Admins can see all, this page will need logic to show all if admin
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
                        Gestiona depósitos, servicios y configuraciones de la aplicación.
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

            <Card className="bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-blue-950/50 dark:via-background dark:to-green-950/50">
                 <CardHeader>
                    <div className='flex items-center gap-3'>
                        <UploadCloud className="h-6 w-6 text-primary" />
                        <CardTitle>¡Publica tu Aplicación!</CardTitle>
                    </div>
                    <CardDescription>
                        Tu aplicación está lista. Sigue estos pasos para ponerla en línea gratis con Vercel.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-start gap-4">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">1</div>
                        <div>
                            <h4 className="font-semibold">Conecta a GitHub</h4>
                            <p className="text-sm text-muted-foreground">Sube el código de tu proyecto a un repositorio en <a href="https://github.com/new" target="_blank" rel="noopener noreferrer" className="underline font-medium">GitHub</a>. Esto es necesario para que Vercel pueda acceder a él.</p>
                        </div>
                    </div>
                     <div className="flex items-start gap-4">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">2</div>
                        <div>
                            <h4 className="font-semibold">Regístrate en Vercel</h4>
                            <p className="text-sm text-muted-foreground">Crea una cuenta gratuita en <a href="https://vercel.com/signup" target="_blank" rel="noopener noreferrer" className="underline font-medium">Vercel</a> usando tu cuenta de GitHub.</p>
                        </div>
                    </div>
                     <div className="flex items-start gap-4">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">3</div>
                        <div>
                            <h4 className="font-semibold">Importa y Despliega</h4>
                            <p className="text-sm text-muted-foreground">En tu panel de Vercel, haz clic en "Add New... &gt; Project", importa tu repositorio de GitHub y haz clic en "Deploy". ¡Eso es todo!</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

        </div>
    );
}
