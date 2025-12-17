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
  Bot,
  Calendar,
  ClipboardCheck,
  CreditCard,
  DollarSign,
  ListChecks,
  Users,
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

const quickActions = [
    { title: "Ver Servicios", href: "/servicios", icon: ListChecks, description: "Explora todos los trámites." },
    { title: "Agendar Cita", href: "/citas", icon: Calendar, description: "Reserva tu próxima cita." },
    { title: "Generador IA", href: "/generador-formularios", icon: Bot, description: "Rellena formas con IA." },
    { title: "Mi Progreso", href: "/seguimiento", icon: ClipboardCheck, description: "Revisa tus solicitudes." },
]

const recentApplications = [
    { id: "#3210", service: "Renovación de Pasaporte", status: "Aprobado", date: "Hace 2 días" },
    { id: "#3209", service: "Licencia de Conducir", status: "En Proceso", date: "Hace 1 semana" },
    { id: "#3208", service: "Registro de Negocio", status: "Requiere Acción", date: "Hace 2 semanas" },
    { id: "#3207", service: "Permiso de Construcción", status: "Rechazado", date: "Hace 1 mes" },
]

function getStatusBadgeVariant(status: string): "default" | "secondary" | "destructive" | "outline" {
    switch (status) {
        case "Aprobado":
            return "default";
        case "En Proceso":
            return "secondary";
        case "Requiere Acción":
            return "destructive";
        case "Rechazado":
            return "outline";
        default:
            return "secondary";
    }
}


export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex-1 space-y-4">
        <h1 className="text-3xl font-headline font-bold tracking-tight">¡Hola, bienvenido de nuevo!</h1>
        <p className="text-muted-foreground">Aquí tienes un resumen de tu actividad reciente y accesos rápidos.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Trámites Completados</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">+2 este mes</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Trámites Activos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">+1 esta semana</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Citas Programadas</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
            <p className="text-xs text-muted-foreground">Próxima en 5 días</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Notificaciones</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Nuevas desde la última visita</p>
          </CardContent>
        </Card>
      </div>

       <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Solicitudes Recientes</CardTitle>
            <CardDescription>
              Un vistazo a tus últimos 4 trámites.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Trámite</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Fecha</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentApplications.map((app) => (
                    <TableRow key={app.id}>
                        <TableCell>
                            <div className="font-medium">{app.service}</div>
                            <div className="text-sm text-muted-foreground md:inline">
                                {app.id}
                            </div>
                        </TableCell>
                        <TableCell>
                            <Badge variant={getStatusBadgeVariant(app.status)}>{app.status}</Badge>
                        </TableCell>
                         <TableCell className="text-right">{app.date}</TableCell>
                    </TableRow>
                ))}
              </TableBody>
            </Table>
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
