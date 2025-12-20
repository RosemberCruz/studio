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
  ClipboardCheck,
  ListChecks,
  Settings,
  Wallet,
  Landmark,
  LogOut,
  ShieldCheck,
  Info,
  Star,
  Gift,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ClientAppHeader } from '@/components/ClientAppHeader';
import { AppLogo } from '@/components/AppLogo';
import { useUser, useFirestore, useDoc, useMemoFirebase, useAuth } from '@/firebase';
import { doc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { WhatsappIcon } from '@/components/WhatsappIcon';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useIsAdmin } from '@/hooks/useIsAdmin';

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
            <div className="grid grid-cols-2 gap-2 p-2 border rounded-lg m-2">
                <div className="flex items-center gap-2">
                    <Wallet className="h-6 w-6 text-primary" />
                    <div>
                        <span className="text-xs text-muted-foreground">Saldo</span>
                        <span className="font-semibold text-base block">
                            {userData ? `$${userData.balance.toFixed(2)}` : '$0.00'}
                        </span>
                    </div>
                </div>
                 <div className="flex items-center gap-2 border-l pl-2">
                    <Star className="h-6 w-6 text-yellow-500" />
                    <div>
                        <span className="text-xs text-muted-foreground">Créditos</span>
                        <span className="font-semibold text-base block">
                            {userData ? userData.credits || 0 : 0}
                        </span>
                    </div>
                </div>
                <div className="col-span-2 flex items-center gap-2 border-t pt-2 mt-2">
                    <Gift className="h-6 w-6 text-pink-500" />
                    <div>
                        <span className="text-xs text-muted-foreground">Créditos Promo</span>
                        <span className="font-semibold text-base block">
                            {userData ? userData.promotionalCredits || 0 : 0}
                        </span>
                    </div>
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
        if (!auth) return;
        await signOut(auth);
        router.push('/');
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
  const isAdmin = useIsAdmin();

  const phoneNumber = "529621934078"; // Replace with your number
  const message = "Hola, he encontrado un error en la aplicación y necesito ayuda.";
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
      <SidebarProvider>
        <Sidebar>
          <SidebarHeader>
            <Link href="/dashboard" className="flex items-center gap-2 p-2">
              <AppLogo />
              <h1 className="text-xl font-semibold font-headline">TramitesFacil</h1>
            </Link>
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
              {isAdmin && (
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={isActive('/admin')}>
                    <Link href="/admin">
                      <ShieldCheck />
                      Admin
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive('/servicios')}>
                  <Link href="/servicios">
                    <ListChecks />
                    Directorio de Servicios
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
          <div className="w-full bg-accent text-accent-foreground text-center p-2 text-sm font-semibold flex items-center justify-center gap-2">
              <Info className="h-4 w-4" />
              La creación de esta cuenta es gratuita, ¡no te dejes engañar!
          </div>
          <ClientAppHeader />
          <main className="p-4 lg:p-6">{children}</main>
          <TooltipProvider>
              <Tooltip>
                  <TooltipTrigger asChild>
                      <a
                          href={whatsappUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-white shadow-lg transition-transform hover:scale-110"
                          >
                          <WhatsappIcon className="h-7 w-7" />
                          <span className="sr-only">Reportar un error por WhatsApp</span>
                      </a>
                  </TooltipTrigger>
                  <TooltipContent side="left">
                      <p>¿Necesitas ayuda? ¡Contáctanos!</p>
                  </TooltipContent>
              </Tooltip>
          </TooltipProvider>
        </SidebarInset>
      </SidebarProvider>
  );
}
