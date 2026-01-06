import { redirect } from 'next/navigation'
import { getSession, hasRole } from '@/lib/auth'
import { MainNav } from '@/components/navigation/main-nav'
import { ROLES } from '@/lib/constants'
import Link from 'next/link'
import { Settings, DollarSign, TrendingUp, Users, GitBranch, Shield } from 'lucide-react'
import { cn } from '@/lib/utils'

export default async function SettingsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSession()
  
  if (!session) {
    redirect('/login')
  }

  const isExecutive = await hasRole(ROLES.EXECUTIVE)
  
  if (!isExecutive) {
    return (
      <main className="flex min-h-screen flex-col">
        <MainNav />
        <div className="container mx-auto flex-1 p-4">
          <div className="py-8">
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
              <p className="text-muted-foreground">
                Settings are only accessible to Executive role users.
              </p>
            </div>
          </div>
        </div>
      </main>
    )
  }

  const settingsLinks = [
    {
      href: '/settings/revenue-models',
      label: 'Revenue Models',
      icon: DollarSign,
    },
    {
      href: '/settings/revenue-streams',
      label: 'Revenue Streams',
      icon: TrendingUp,
    },
    {
      href: '/settings/icp-categories',
      label: 'ICP Categories',
      icon: Users,
    },
    {
      href: '/settings/opportunity-stages',
      label: 'Opportunity Stages',
      icon: GitBranch,
    },
    {
      href: '/settings/approval-thresholds',
      label: 'Approval Thresholds',
      icon: Shield,
    },
  ]

  return (
    <main className="flex min-h-screen flex-col">
      <MainNav />
      <div className="container mx-auto flex-1 p-4">
        <div className="py-8">
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <Settings className="h-6 w-6" />
              <h2 className="text-3xl font-bold">Settings</h2>
            </div>
            <p className="text-muted-foreground">
              Manage system-wide configuration (Executive only)
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-4">
            <div className="md:col-span-1">
              <nav className="space-y-1">
                {settingsLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                      'hover:bg-accent hover:text-accent-foreground'
                    )}
                  >
                    <link.icon className="h-4 w-4" />
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>
            <div className="md:col-span-3">
              {children}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

