'use client';

import * as React from 'react';
import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
  ShieldCheck,
  Home,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ClientAppHeader } from '@/components/ClientAppHeader';
import { AppLogo } from '@/components/AppLogo';
import { useAuth } from '@/firebase';
import { signOut } from 'firebase/auth';

function useIsAdmin() {
    const { user } = useUser();
    // This should be replaced with a more secure method like custom claims
    const ADMIN_EMAIL = 'rosembercruzbetancourt@gmail.com';
    return user?.email === ADMIN_EMAIL;
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

function UserProfile() {
  const { user } = useUser();
  if (!user) return null;
  return (
    <SidebarMenuItem>
        <div className="flex items-center gap-3 p-2">
        <Avatar className="h-10 w-10">
            <AvatarImage src={user.photoURL || `https://picsum.photos/seed/${user.uid}/100/100`} alt="Usuario" />
            <AvatarFallback>{user.email?.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col overflow-hidden">
            <span className="font-semibold truncate">{user.displayName || 'Administrador'}</span>
            <span className="text-xs text-muted-foreground truncate">{user.email}</span>
        </div>
        </div>
    </SidebarMenuItem>
  )
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isUserLoading } = useUser();
  const isAdmin = useIsAdmin();
  const router = useRouter();
  const pathname = usePathname();
  const isActive = (path: string) => pathname.startsWith(path);

  React.useEffect(() => {
    if (!isUserLoading) {
      if (!user) {
        router.replace('/login');
      } else if (!isAdmin) {
        router.replace('/access-denied');
      }
    }
  }, [user, isUserLoading, isAdmin, router]);

  if (isUserLoading || !user || !isAdmin) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  // This layout is now self-contained and does NOT use AppLayout
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
                  <Home />
                  Volver al App
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname === '/admin'}>
                <Link href="/admin">
                  <ShieldCheck />
                  Admin Dashboard
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
             {/* You can add more admin-specific links here */}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <UserProfile />
            <LogoutButton />
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <ClientAppHeader />
        <main className="p-4 lg:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
