import Link from 'next/link'
import { getUserProfile, hasRole } from '@/lib/auth'
import { LogoutButton } from '@/components/auth/logout-button'
import { Badge } from '@/components/ui/badge'
import { MobileNav } from '@/components/navigation/mobile-nav'
import { ROLES } from '@/lib/constants'

export async function MainNav() {
  const profile = await getUserProfile()
  const isExecutive = await hasRole(ROLES.EXECUTIVE)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-4 md:gap-8">
          <Link href="/" className="text-xl md:text-2xl font-bold">
            CRM v0
          </Link>
          <nav className="hidden md:flex items-center gap-4">
            <Link href="/" className="text-sm font-medium hover:underline">
              Dashboard
            </Link>
            <Link href="/accounts" className="text-sm font-medium hover:underline">
              Accounts
            </Link>
            <Link href="/opportunities" className="text-sm font-medium hover:underline">
              Opportunities
            </Link>
            <Link href="/quotes" className="text-sm font-medium hover:underline">
              Quotes
            </Link>
            <Link href="/handovers" className="text-sm font-medium hover:underline">
              Handovers
            </Link>
            {isExecutive && (
              <>
                <Link href="/users" className="text-sm font-medium hover:underline">
                  Users
                </Link>
                <Link href="/settings" className="text-sm font-medium hover:underline">
                  Settings
                </Link>
              </>
            )}
          </nav>
        </div>
        <div className="flex items-center gap-2 md:gap-4">
          <div className="hidden md:flex items-center gap-4">
            <Link href="/profile" className="text-sm font-medium hover:underline truncate max-w-[120px]">
              {profile?.full_name || profile?.email}
            </Link>
            <Badge variant="outline">{profile?.role}</Badge>
            <LogoutButton />
          </div>
          <MobileNav profile={profile} />
        </div>
      </div>
    </header>
  )
}

