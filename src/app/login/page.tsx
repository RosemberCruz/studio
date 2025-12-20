
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useAuth, useFirestore } from '@/firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { updateProfile, User } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { AppLogo } from '@/components/AppLogo';
import { Info } from 'lucide-react';

function AuthForm() {
  const auth = useAuth();
  const firestore = useFirestore();
  const { toast } = useToast();
  const router = useRouter();

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [resetEmail, setResetEmail] = useState('');
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);


  const [signupFirstName, setSignupFirstName] = useState('');
  const [signupLastName, setSignupLastName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupPassword, setSignupPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth) {
        toast({ title: "Error", description: "El servicio de autenticación no está listo.", variant: "destructive" });
        return;
    }
    try {
      await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
      router.push('/dashboard'); 
    } catch (error: any) {
      console.error("Login Error: ", error);
      toast({
        variant: "destructive",
        title: "Error al Iniciar Sesión",
        description: "Credenciales incorrectas. Por favor, verifica tu email y contraseña."
      });
    }
  };

  const createFirestoreUserDocument = async (user: User) => {
    if (!firestore) return;
    const userRef = doc(firestore, 'users', user.uid);
    const userData = {
      id: user.uid,
      email: signupEmail,
      firstName: signupFirstName,
      lastName: signupLastName,
      phoneNumber: signupPhone,
      creationDate: new Date().toISOString(),
      balance: 0,
      credits: 0,
      promotionalCredits: 0,
      promoCreditsGrantDate: null,
    };
    await setDoc(userRef, userData);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
     if (!auth) {
        toast({ title: "Error", description: "El servicio de autenticación no está listo.", variant: "destructive" });
        return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, signupEmail, signupPassword);
      const user = userCredential.user;

      if (user) {
        await updateProfile(user, {
          displayName: `${signupFirstName} ${signupLastName}`,
        });

        await createFirestoreUserDocument(user);
        
        router.push('/dashboard');
      }
    } catch (error: any) {
      console.error("Sign-up Error: ", error);
      if (error.code === 'auth/email-already-in-use') {
        toast({
            variant: "destructive",
            title: "Correo ya registrado",
            description: "Este correo electrónico ya está en uso. Intenta iniciar sesión."
        });
      } else {
        toast({
            variant: "destructive",
            title: "Error al Crear Cuenta",
            description: error.message || "No se pudo completar el registro."
        });
      }
    }
  };

  const handlePasswordReset = async () => {
     if (!auth) {
        toast({ title: "Error", description: "El servicio de autenticación no está listo.", variant: "destructive" });
        return;
    }
    if (!resetEmail) {
        toast({
            variant: "destructive",
            title: "Correo requerido",
            description: "Por favor, ingresa tu correo electrónico."
        });
        return;
    }
    try {
        await sendPasswordResetEmail(auth, resetEmail);
        toast({
            title: "Correo Enviado",
            description: "Se ha enviado un enlace para restablecer tu contraseña a tu correo electrónico."
        });
        setIsResetDialogOpen(false);
        setResetEmail('');
    } catch (error: any) {
        console.error("Password Reset Error: ", error);
        toast({
            variant: "destructive",
            title: "Error al Enviar Correo",
            description: "No se pudo enviar el correo de restablecimiento. Verifica que el correo sea correcto."
        });
    }
  }

  return (
      <Dialog open={isResetDialogOpen} onOpenChange={setIsResetDialogOpen}>
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Iniciar Sesión</TabsTrigger>
            <TabsTrigger value="signup">Crear Cuenta</TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <Card>
              <CardHeader>
                <CardTitle>Iniciar Sesión</CardTitle>
                <CardDescription>
                  Ingresa a tu cuenta para continuar.
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleLogin}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="tu@email.com"
                      required
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="login-password">Contraseña</Label>
                        <DialogTrigger asChild>
                            <Button variant="link" type="button" className="p-0 h-auto text-xs">
                                ¿Olvidaste tu contraseña?
                            </Button>
                        </DialogTrigger>
                    </div>
                    <Input
                      id="login-password"
                      type="password"
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full">
                    Iniciar Sesión
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
          <TabsContent value="signup">
            <Card>
              <CardHeader>
                <CardTitle>Crear una Cuenta</CardTitle>
                <CardDescription>
                  Completa el formulario para registrarte.
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleSignUp}>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="first-name">Nombres</Label>
                      <Input
                        id="first-name"
                        required
                        value={signupFirstName}
                        onChange={(e) => setSignupFirstName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="last-name">Apellidos</Label>
                      <Input
                        id="last-name"
                        required
                        value={signupLastName}
                        onChange={(e) => setSignupLastName(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="tu@email.com"
                      required
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone-number">Número de Teléfono</Label>
                    <Input
                      id="phone-number"
                      type="tel"
                      value={signupPhone}
                      onChange={(e) => setSignupPhone(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Contraseña</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      required
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full">
                    Crear Cuenta
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
        </Tabs>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Restablecer Contraseña</DialogTitle>
            <DialogDescription>
              Ingresa tu correo electrónico y te enviaremos un enlace para que puedas restablecer tu contraseña.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="reset-email">Correo Electrónico</Label>
            <Input
              id="reset-email"
              type="email"
              placeholder="tu@email.com"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsResetDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handlePasswordReset}>Enviar Correo</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
  );
}


export default function LoginPage() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
            <div className="w-full max-w-md">
                <div className="mb-6 flex justify-center">
                    <Link href="/" className="flex items-center gap-2">
                        <AppLogo />
                        <h1 className="text-2xl font-semibold font-headline">TramitesFacil</h1>
                    </Link>
                </div>
                <div className="w-full bg-accent text-accent-foreground text-center p-2 text-sm font-semibold flex items-center justify-center gap-2 rounded-t-lg">
                    <Info className="h-4 w-4" />
                    La creación de esta cuenta es gratuita, ¡no te dejes engañar!
                </div>
                <AuthForm />
            </div>
        </div>
    )
}
