'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'
import { LogoutButton } from '@/components/auth/logout-button'
import { Separator } from '@/components/ui/separator'

interface MobileNavProps {
  profile: {
    full_name?: string | null
    email?: string | null
    role?: string | null
  } | null
}

export function MobileNav({ profile }: MobileNavProps) {
  const [open, setOpen] = useState(false)

  const navItems = [
    { href: '/', label: 'Dashboard' },
    { href: '/accounts', label: 'Accounts' },
    { href: '/opportunities', label: 'Opportunities' },
    { href: '/quotes', label: 'Quotes' },
    { href: '/handovers', label: 'Handovers' },
    ...(profile?.role === 'executive' ? [
      { href: '/users', label: 'Users' },
      { href: '/settings', label: 'Settings' },
    ] : []),
  ]

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild className="md:hidden">
        <Button variant="ghost" size="icon" aria-label="Toggle menu">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[400px]">
        <SheetHeader>
          <SheetTitle>CRM v0</SheetTitle>
        </SheetHeader>
        <div className="mt-8 flex flex-col gap-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="text-base font-medium hover:underline py-2"
            >
              {item.label}
            </Link>
          ))}
          <Separator className="my-4" />
          <div className="flex flex-col gap-4">
            <Link
              href="/profile"
              onClick={() => setOpen(false)}
              className="text-base font-medium hover:underline py-2"
            >
              {profile?.full_name || profile?.email || 'Profile'}
            </Link>
            {profile?.role && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Role:</span>
                <Badge variant="outline">{profile.role}</Badge>
              </div>
            )}
            <div className="pt-2">
              <LogoutButton />
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

