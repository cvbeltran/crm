import { redirect } from 'next/navigation'
import { getSession, getUserRole } from '@/lib/auth'
import { MainNav } from '@/components/navigation/main-nav'
import { getDashboardMetrics } from '@/lib/actions/dashboard'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default async function Home() {
  const session = await getSession()
  
  if (!session) {
    redirect('/login')
  }

  const role = await getUserRole()
  const metrics = await getDashboardMetrics()

  return (
    <main className="flex min-h-screen flex-col">
      <MainNav />
      <div className="container mx-auto flex-1 p-4">
        <div className="py-8">
          <h2 className="text-3xl font-bold mb-6">Dashboard</h2>

          <div className="grid gap-6 md:grid-cols-3 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Opportunities</CardTitle>
                <CardDescription>Total: {metrics.opportunities.total}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Lead</span>
                    <Badge variant="outline">{metrics.opportunities.lead}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Qualified</span>
                    <Badge variant="outline">{metrics.opportunities.qualified}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Proposal</span>
                    <Badge variant="secondary">{metrics.opportunities.proposal}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Closed Won</span>
                    <Badge variant="default">{metrics.opportunities.closed_won}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Closed Lost</span>
                    <Badge variant="destructive">{metrics.opportunities.closed_lost}</Badge>
                  </div>
                </div>
                <Button asChild className="w-full mt-4" variant="outline">
                  <Link href="/opportunities">View All</Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quotes</CardTitle>
                <CardDescription>Total: {metrics.quotes.total}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Draft</span>
                    <Badge variant="outline">{metrics.quotes.draft}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Pending Approval</span>
                    <Badge variant="secondary">{metrics.quotes.pending_approval}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Approved</span>
                    <Badge variant="default">{metrics.quotes.approved}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Rejected</span>
                    <Badge variant="destructive">{metrics.quotes.rejected}</Badge>
                  </div>
                </div>
                <Button asChild className="w-full mt-4" variant="outline">
                  <Link href="/quotes">View All</Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Handovers</CardTitle>
                <CardDescription>Total: {metrics.handovers.total}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Pending</span>
                    <Badge variant="outline">{metrics.handovers.pending}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Accepted</span>
                    <Badge variant="default">{metrics.handovers.accepted}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Flagged</span>
                    <Badge variant="destructive">{metrics.handovers.flagged}</Badge>
                  </div>
                </div>
                <Button asChild className="w-full mt-4" variant="outline">
                  <Link href="/handovers">View All</Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest updates across the system</CardDescription>
            </CardHeader>
            <CardContent>
              {metrics.recentActivity.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">No recent activity</p>
              ) : (
                <div className="space-y-2">
                  {metrics.recentActivity.map((activity) => (
                    <div key={`${activity.type}-${activity.id}`} className="flex items-center justify-between py-2 border-b last:border-0">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {activity.type}
                        </Badge>
                        <Link
                          href={`/${activity.type === 'opportunity' ? 'opportunities' : 'quotes'}/${activity.id}`}
                          className="text-sm hover:underline"
                        >
                          {activity.name}
                        </Link>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {activity.state}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {activity.created_at
                            ? new Date(activity.created_at).toLocaleDateString()
                            : '-'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
