'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton
} from '@/components/ui/sidebar';
import { Users, Banknote, ListChecks, DollarSign } from 'lucide-react';
import Link from 'next/link';
import AdminAuthGuard from './AdminAuthGuard';

const adminNavItems = [
    { href: '/admin/users', icon: Users, label: 'Usuarios' },
    { href: '/admin/deposits', icon: Banknote, label: 'Depósitos' },
    { href: '/seguimiento', icon: ListChecks, label: 'Trámites' },
    { href: '/admin/ingresos', icon: DollarSign, label: 'Ingresos' },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isActive = (path: string) => pathname.startsWith(path);

  return (
    <AdminAuthGuard>
        <div className="grid md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr] gap-6">
            <div className="hidden md:block">
                 <Sidebar>
                    <SidebarHeader>
                        <h2 className="text-lg font-semibold px-4">Admin Menu</h2>
                    </SidebarHeader>
                    <SidebarContent>
                        <SidebarMenu>
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
            </div>
            <main>
                {children}
            </main>
        </div>
    </AdminAuthGuard>
  );
}
