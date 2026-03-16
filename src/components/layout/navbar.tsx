'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  FileText,
  PlusCircle,
  Shield,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/lib/auth';
import { cn } from '@/lib/utils';

export function Navbar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (!user) return null;

  const links = [
    { href: '/reports', label: 'Minhas Solicitações', icon: FileText },
    { href: '/reports/new', label: 'Novo Relato', icon: PlusCircle },
    ...(user.role === 'ADMIN'
      ? [{ href: '/admin/reports', label: 'Painel Admin', icon: Shield }]
      : []),
  ];

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
        <Link href="/reports">
          <Image src="/colab-logo.svg" alt="Colab" width={100} height={28} priority />
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <Link key={link.href} href={link.href}>
              <Button
                variant={pathname === link.href ? 'secondary' : 'ghost'}
                size="sm"
                className="cursor-pointer gap-2"
              >
                <link.icon className="h-4 w-4" />
                {link.label}
              </Button>
            </Link>
          ))}
          <Separator orientation="vertical" className="mx-2 h-6" />
          <span className="text-sm text-muted-foreground">{user.name}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={logout}
            className="cursor-pointer gap-2 text-destructive hover:text-destructive"
          >
            <LogOut className="h-4 w-4" />
            Sair
          </Button>
        </nav>

        <Button
          variant="ghost"
          size="icon"
          className="cursor-pointer md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {mobileOpen && (
        <div className="border-t px-4 pb-4 md:hidden">
          <nav className="flex flex-col gap-1 pt-2">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
              >
                <Button
                  variant={pathname === link.href ? 'secondary' : 'ghost'}
                  className={cn('w-full cursor-pointer justify-start gap-2')}
                >
                  <link.icon className="h-4 w-4" />
                  {link.label}
                </Button>
              </Link>
            ))}
            <Separator className="my-2" />
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{user.name}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                className="cursor-pointer gap-2 text-destructive hover:text-destructive"
              >
                <LogOut className="h-4 w-4" />
                Sair
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
