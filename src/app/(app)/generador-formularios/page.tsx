import { FormGeneratorClient } from './FormGeneratorClient';
import { Bot } from 'lucide-react';

export default function FormGeneratorPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-primary/10 rounded-lg">
            <Bot className="h-8 w-8 text-primary" />
        </div>
        <div>
            <h1 className="text-3xl font-bold font-headline">Generador de Formas con IA</h1>
            <p className="text-muted-foreground mt-2">
            Describe tu información y deja que nuestra IA te ayude a completar las secciones del formulario.
            </p>
        </div>
      </div>
      <FormGeneratorClient />
    </div>
  );
}
