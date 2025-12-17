
'use client';

import * as React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Sidebar,
  SidebarProvider,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarFooter,
} from '@/components/ui/sidebar';
import {
  LayoutDashboard,
  Bot,
  ClipboardCheck,
  ListChecks,
  Settings,
  Wallet,
  Landmark,
  LogOut,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AppHeader } from '@/components/AppHeader';
import { AppLogo } from '@/components/AppLogo';
import { useUser, useFirestore, useDoc, useMemoFirebase, useAuth } from '@/firebase';
import { doc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';


function UserProfile() {
  const { user } = useUser();
  const firestore = useFirestore();
  
  const userDocRef = useMemoFirebase(() => {
    if (!user) return null;
    return doc(firestore, 'users', user.uid);
  }, [user, firestore]);
  
  const { data: userData } = useDoc(userDocRef);

  if (!user) {
    return null;
  }

  return (
    <>
        <SidebarMenuItem>
            <div className="flex items-center gap-3 p-2 border rounded-lg m-2">
                <Wallet className="h-6 w-6 text-primary" />
                <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground">Saldo Actual</span>
                    <span className="font-semibold text-lg">
                        {userData ? `$${userData.balance.toFixed(2)}` : '$0.00'}
                    </span>
                </div>
            </div>
        </SidebarMenuItem>
         <SidebarMenuItem>
          <div className="flex items-center gap-3 p-2">
            <Avatar className="h-10 w-10">
              <AvatarImage src={user.photoURL || `https://picsum.photos/seed/${user.uid}/100/100`} alt="Usuario" />
              <AvatarFallback>{user.email?.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col overflow-hidden">
              <span className="font-semibold truncate">{user.displayName || 'Usuario'}</span>
              <span className="text-xs text-muted-foreground truncate">{user.email}</span>
            </div>
          </div>
        </SidebarMenuItem>
    </>
  )
}

function LogoutButton() {
    const auth = useAuth();
    const router = useRouter();

    const handleSignOut = async () => {
        await signOut(auth);
        router.push('/login');
    }
    return (
        <SidebarMenuItem>
            <SidebarMenuButton onClick={handleSignOut}>
                <LogOut />
                Cerrar Sesión
            </SidebarMenuButton>
        </SidebarMenuItem>
    )
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isActive = (path: string) => pathname.startsWith(path);

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2 p-2">
            <AppLogo />
            <h1 className="text-xl font-semibold font-headline">TramitesFacil</h1>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname === '/dashboard'}>
                <Link href="/dashboard">
                  <LayoutDashboard />
                  Dashboard
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={isActive('/servicios')}>
                <Link href="/servicios">
                  <ListChecks />
                  Directorio de Servicios
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname === '/generador-formularios'}>
                <Link href="/generador-formularios">
                  <Bot />
                  Generador de Formas
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname === '/recargar-saldo'}>
                <Link href="/recargar-saldo">
                  <Landmark />
                  Recargar Saldo
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname === '/seguimiento'}>
                <Link href="/seguimiento">
                  <ClipboardCheck />
                  Mis Órdenes
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton>
                <Settings />
                Configuración
              </SidebarMenuButton>
            </SidebarMenuItem>
            <UserProfile />
            <LogoutButton />
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <AppHeader />
        <main className="p-4 lg:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
