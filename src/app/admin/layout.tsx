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
} from '@/components/ui/sidebar';
import { Users, Banknote, ListChecks, LayoutDashboard, Loader2 } from 'lucide-react';
import { ClientAppHeader } from '@/components/ClientAppHeader';
import { AppLogo } from '@/components/AppLogo';
import { useUser } from '@/firebase';
import { useIsAdmin } from '@/hooks/useIsAdmin';

const adminNavItems = [
  { href: '/admin/users', icon: Users, label: 'Usuarios' },
  { href: '/admin/deposits', icon: Banknote, label: 'Depósitos' },
  { href: '/admin/requests', icon: ListChecks, label: 'Trámites' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isUserLoading } = useUser();
  const isAdmin = useIsAdmin();
  const isActive = (path: string) => pathname.startsWith(path);

  React.useEffect(() => {
    if (!isUserLoading) {
      if (!user) {
        router.replace('/');
      } else if (!isAdmin) {
        router.replace('/access-denied');
      }
    }
  }, [user, isUserLoading, isAdmin, router]);

  if (isUserLoading || !user || !isAdmin) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <Link href="/admin" className="flex items-center gap-2 p-2">
            <AppLogo />
            <h1 className="text-xl font-semibold font-headline">Admin Panel</h1>
          </Link>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={isActive('/dashboard')}>
                <Link href="/dashboard">
                  <LayoutDashboard />
                  Dashboard
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            {adminNavItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton asChild isActive={isActive(item.href)}>
                  <Link href={item.href}>
                    <item.icon />
                    {item.label}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <ClientAppHeader />
        <main className="p-4 lg:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
