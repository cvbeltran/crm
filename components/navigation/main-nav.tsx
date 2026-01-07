import Link from 'next/link'
import { MobileNav } from '@/components/navigation/mobile-nav'

export async function MainNav() {
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
            <Link href="/users" className="text-sm font-medium hover:underline">
              Users
            </Link>
            <Link href="/settings" className="text-sm font-medium hover:underline">
              Settings
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-2 md:gap-4">
          <MobileNav />
        </div>
      </div>
    </header>
  )
}

