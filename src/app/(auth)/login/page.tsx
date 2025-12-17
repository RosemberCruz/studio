'use client';

import React, { useState } from 'react';
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
import { useAuth, useFirestore } from '@/firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { updateProfile, User } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';

export default function LoginPage() {
  const auth = useAuth();
  const firestore = useFirestore();
  const { toast } = useToast();

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const [signupFirstName, setSignupFirstName] = useState('');
  const [signupLastName, setSignupLastName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupPassword, setSignupPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
      // onAuthStateChanged will handle the redirect
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
    const userRef = doc(firestore, 'users', user.uid);
    const userData = {
      id: user.uid,
      email: signupEmail,
      firstName: signupFirstName,
      lastName: signupLastName,
      phoneNumber: signupPhone,
      creationDate: new Date().toISOString(),
      balance: 500, // Initial balance for new users
    };
    await setDoc(userRef, userData, { merge: true });
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // 1. Create the user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, signupEmail, signupPassword);
      const user = userCredential.user;

      if (user) {
        // 2. Update the user's profile in Firebase Auth
        await updateProfile(user, {
          displayName: `${signupFirstName} ${signupLastName}`,
        });

        // 3. Create the user document in Firestore
        await createFirestoreUserDocument(user);
        
        // The onAuthStateChanged listener in the provider will handle the redirect.
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


  return (
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
                <Label htmlFor="login-password">Contraseña</Label>
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
  );
}
