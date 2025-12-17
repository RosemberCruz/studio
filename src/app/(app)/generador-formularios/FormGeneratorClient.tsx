'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { generatePartiallyCompletedForm, GeneratePartiallyCompletedFormInput } from '@/ai/flows/generate-partially-completed-forms';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Loader2, Wand2, Sparkles, Clipboard } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type FormState = {
  completedFormSection?: string;
  error?: string;
};

async function generateAction(prevState: FormState, formData: FormData): Promise<FormState> {
  const input: GeneratePartiallyCompletedFormInput = {
    formName: formData.get('formName') as string,
    userInput: formData.get('userInput') as string,
    officialInstructions: formData.get('officialInstructions') as string,
  };

  try {
    const result = await generatePartiallyCompletedForm(input);
    return { completedFormSection: result.completedFormSection };
  } catch (e: any) {
    return { error: e.message || 'Ocurrió un error al generar el formulario.' };
  }
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? (
        <Loader2 className="animate-spin mr-2" />
      ) : (
        <Wand2 className="mr-2" />
      )}
      Generar Contenido
    </Button>
  );
}

export function FormGeneratorClient() {
  const initialState: FormState = {};
  const [state, formAction] = useFormState(generateAction, initialState);
  const { toast } = useToast();

  const copyToClipboard = () => {
    if(state.completedFormSection) {
        navigator.clipboard.writeText(state.completedFormSection);
        toast({
            title: "Copiado",
            description: "El contenido generado ha sido copiado al portapapeles."
        });
    }
  }

  // This is a workaround to get the pending state outside the form
  const [isPending, startTransition] = React.useTransition();
  const formRef = React.useRef<HTMLFormElement>(null);

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <Card>
        <form 
          ref={formRef}
          action={(formData) => {
            startTransition(() => {
              formAction(formData)
            })
          }}
        >
          <CardHeader>
            <CardTitle>1. Ingresa tu Información</CardTitle>
            <CardDescription>
              Proporciona los detalles necesarios para que la IA pueda trabajar.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="formName">Nombre del Formulario</Label>
              <Input id="formName" name="formName" placeholder="Ej: Formulario I-130, Petición de Familiar Extranjero" required disabled={isPending} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="userInput">Tu Información (en lenguaje natural)</Label>
              <Textarea
                id="userInput"
                name="userInput"
                placeholder="Ej: Mi nombre es Juan Pérez, nací el 15 de marzo de 1985 en Lima, Perú. Mi esposa es María García, ciudadana estadounidense..."
                className="min-h-[150px]"
                required
                disabled={isPending}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="officialInstructions">Instrucciones Oficiales (Opcional)</Label>
              <Textarea
                id="officialInstructions"
                name="officialInstructions"
                placeholder="Copia y pega aquí las instrucciones relevantes de la web oficial del trámite."
                className="min-h-[100px]"
                disabled={isPending}
              />
            </div>
          </CardContent>
          <CardFooter>
            <SubmitButton />
          </CardFooter>
        </form>
      </Card>
      <Card className="flex flex-col">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="text-primary" />
            2. Resultado Generado
          </CardTitle>
          <CardDescription>
            Este es el contenido generado por la IA. Cópialo y pégalo en tu formulario.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1 bg-secondary/50 rounded-md m-6 mt-0 p-4 relative">
          {isPending && (
            <div className="absolute inset-0 bg-background/80 flex flex-col items-center justify-center gap-4 rounded-md z-10">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                <p className="text-muted-foreground">Generando, por favor espera...</p>
            </div>
          )}
          {state.error && <p className="text-destructive">{state.error}</p>}
          {state.completedFormSection ? (
            <pre className="whitespace-pre-wrap font-sans text-sm">{state.completedFormSection}</pre>
          ) : (
             <div className="flex items-center justify-center h-full text-center text-muted-foreground">
                <p>El resultado de la IA aparecerá aquí.</p>
            </div>
          )}
        </CardContent>
        <CardFooter className="justify-end">
            <Button variant="outline" onClick={copyToClipboard} disabled={!state.completedFormSection || isPending}>
                <Clipboard className="mr-2" />
                Copiar
            </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
