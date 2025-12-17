import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { progressData } from '@/lib/data';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, CircleDot, Clock, XCircle } from 'lucide-react';

function getStatusInfo(status: (typeof progressData)[0]['status']) {
  switch (status) {
    case 'Completado':
      return { icon: CheckCircle, color: 'text-green-500', badgeVariant: 'default' as const };
    case 'En Proceso':
      return { icon: Clock, color: 'text-blue-500', badgeVariant: 'secondary' as const };
    case 'Iniciado':
      return { icon: CircleDot, color: 'text-yellow-500', badgeVariant: 'outline' as const };
    case 'Rechazado':
      return { icon: XCircle, color: 'text-red-500', badgeVariant: 'destructive' as const };
    default:
      return { icon: Clock, color: 'text-muted-foreground', badgeVariant: 'secondary' as const };
  }
}

export default function ProgressTrackerPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Seguimiento de Trámites</h1>
        <p className="text-muted-foreground mt-2">
          Revisa el estado actual de todas tus solicitudes en un solo lugar.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {progressData.map((item) => {
          const statusInfo = getStatusInfo(item.status);
          const progressValue = (item.currentStep / item.totalSteps) * 100;
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
              <CardContent className="flex-grow">
                <div className="flex items-center gap-3">
                  <statusInfo.icon className={`h-5 w-5 ${statusInfo.color}`} />
                  <p className="text-sm font-medium">
                    Paso {item.currentStep} de {item.totalSteps}
                  </p>
                </div>
                <Progress value={progressValue} className="w-full mt-2" />
                <div className="text-xs text-muted-foreground mt-2 flex justify-between">
                    <span>Enviado: {item.submittedDate}</span>
                    <span>Última act: {item.lastUpdate}</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
