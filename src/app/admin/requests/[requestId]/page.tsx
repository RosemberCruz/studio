
'use client';

import { useState, useEffect, useTransition } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { updateDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Save, FileText, User, Calendar, LinkIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

const statusOptions = ["Solicitado", "En Proceso", "Completado", "Rechazado"];

export default function ManageRequestPage() {
  const params = useParams();
  const requestId = params.requestId as string;
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  // State for form fields
  const [status, setStatus] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  
  const requestDocRef = useMemoFirebase(() => {
    if (!firestore || !requestId) return null;
    return doc(firestore, 'serviceRequests', requestId);
  }, [firestore, requestId]);
  
  const { data: request, isLoading } = useDoc(requestDocRef);

  // Populate form fields when data loads
  useEffect(() => {
    if (request) {
      setStatus(request.status);
      setFileUrl(request.fileUrl || '');
    }
  }, [request]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    startTransition(() => {
      if (!requestDocRef) {
        toast({ title: "Error", description: "No se pudo encontrar la solicitud.", variant: "destructive" });
        return;
      }

      const updatedData = {
        status,
        fileUrl: fileUrl.trim() === '' ? null : fileUrl.trim(),
      };

      updateDocumentNonBlocking(requestDocRef, updatedData);

      toast({
        title: "Solicitud Actualizada",
        description: "Los cambios se han guardado correctamente.",
      });
      
      router.back(); // Go back to the previous page
    });
  }

  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!request) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Card>
          <CardHeader>
            <CardTitle>Solicitud no encontrada</CardTitle>
            <CardDescription>No se pudo encontrar el trámite con el ID proporcionado.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Gestionar Trámite</CardTitle>
            <CardDescription>Actualiza el estado y añade el documento final para la solicitud.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-md">
                <FileText className="h-5 w-5 text-muted-foreground" />
                <span className="font-semibold">{request.serviceName}</span>
            </div>
             <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-md">
                <User className="h-5 w-5 text-muted-foreground" />
                <span className="font-semibold">ID de Usuario: {request.userId}</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-md">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <span className="font-semibold">Solicitado el: {format(new Date(request.requestDate), 'dd/MM/yyyy HH:mm')}</span>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Estado del Trámite</Label>
              <Select value={status} onValueChange={setStatus} required disabled={isPending}>
                <SelectTrigger id="status">
                  <SelectValue placeholder="Selecciona un estado" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map(s => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="fileUrl">URL del Documento PDF Final</Label>
              <div className='relative'>
                 <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                    id="fileUrl" 
                    type="url" 
                    placeholder="https://ejemplo.com/documento.pdf" 
                    value={fileUrl}
                    onChange={e => setFileUrl(e.target.value)}
                    disabled={isPending}
                    className="pl-9"
                />
              </div>
               <p className="text-xs text-muted-foreground">
                Sube el archivo a un servicio de almacenamiento (Google Drive, etc.) y pega aquí el enlace público.
              </p>
            </div>
          </CardContent>
          <CardFooter className="gap-2">
            <Button type="button" variant="outline" onClick={() => router.back()} disabled={isPending}>
              Cancelar
            </Button>
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              Guardar Cambios
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
