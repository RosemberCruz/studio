'use client'

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

const availableTimes = [
  '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM',
  '11:00 AM', '11:30 AM', '02:00 PM', '02:30 PM',
  '03:00 PM', '03:30 PM'
];

export default function AppointmentPage() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string | undefined>();
  const { toast } = useToast();

  const handleSchedule = () => {
    if (date && selectedTime) {
      toast({
        title: "¡Cita Agendada!",
        description: `Tu cita ha sido confirmada para el ${format(date, "PPP", { locale: es })} a las ${selectedTime}.`,
        variant: "default",
      });
    } else {
      toast({
        title: "Error",
        description: "Por favor, selecciona una fecha y una hora.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Agendar Cita</h1>
        <p className="text-muted-foreground mt-2">
          Selecciona una fecha y hora para tu visita a nuestras oficinas.
        </p>
      </div>

      <Card className="max-w-4xl mx-auto">
        <div className="grid md:grid-cols-2">
            <CardContent className="p-6">
                <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="rounded-md"
                    locale={es}
                    disabled={(day) => day < new Date() || day.getDay() === 0 || day.getDay() === 6}
                />
            </CardContent>

            <div className="border-l">
                <CardHeader>
                    <CardTitle>Selecciona una Hora</CardTitle>
                    <CardDescription>
                        {date ? format(date, "eeee, d 'de' MMMM", { locale: es }) : 'Selecciona un día'}
                    </CardDescription>
                </CardHeader>
                 <CardContent>
                    {date ? (
                        <RadioGroup 
                            value={selectedTime}
                            onValueChange={setSelectedTime}
                            className="grid grid-cols-2 gap-4"
                        >
                        {availableTimes.map(time => (
                            <div key={time}>
                                <RadioGroupItem value={time} id={time} className="sr-only" />
                                <Label htmlFor={time} className="flex items-center justify-center rounded-md border-2 border-muted bg-popover p-4 font-semibold hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary transition-all cursor-pointer">
                                    {time}
                                </Label>
                            </div>
                        ))}
                        </RadioGroup>
                    ) : (
                        <p className="text-sm text-muted-foreground text-center py-10">Selecciona una fecha para ver los horarios disponibles.</p>
                    )}
                 </CardContent>
                 <CardFooter>
                     <Button 
                        className="w-full" 
                        onClick={handleSchedule}
                        disabled={!date || !selectedTime}
                     >
                        Confirmar Cita
                    </Button>
                 </CardFooter>
            </div>
        </div>
      </Card>
    </div>
  );
}
