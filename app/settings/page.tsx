import { redirect } from 'next/navigation'
import { getSession, hasRole } from '@/lib/auth'
import { ROLES } from '@/lib/constants'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { DollarSign, TrendingUp, Users, GitBranch, Shield } from 'lucide-react'

export default async function SettingsPage() {
  const session = await getSession()
  
  if (!session) {
    redirect('/login')
  }

  const isExecutive = await hasRole(ROLES.EXECUTIVE)
  
  if (!isExecutive) {
    redirect('/')
  }

  const settingsModules = [
    {
      href: '/settings/revenue-models',
      title: 'Revenue Models',
      description: 'Manage revenue model configurations',
      icon: DollarSign,
    },
    {
      href: '/settings/revenue-streams',
      title: 'Revenue Streams',
      description: 'Configure revenue streams and their associations',
      icon: TrendingUp,
    },
    {
      href: '/settings/icp-categories',
      title: 'ICP Categories',
      description: 'Manage Ideal Customer Profile categories',
      icon: Users,
    },
    {
      href: '/settings/opportunity-stages',
      title: 'Opportunity Stages',
      description: 'Configure opportunity stage display and ordering',
      icon: GitBranch,
    },
    {
      href: '/settings/approval-thresholds',
      title: 'Approval Thresholds',
      description: 'Set approval thresholds and requirements',
      icon: Shield,
    },
  ]

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Settings Modules</h3>
      <div className="grid gap-4 md:grid-cols-2">
        {settingsModules.map((module) => (
          <Card key={module.href}>
            <CardHeader>
              <div className="flex items-center gap-2">
                <module.icon className="h-5 w-5" />
                <CardTitle>{module.title}</CardTitle>
              </div>
              <CardDescription>{module.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <Link href={module.href}>Manage</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

