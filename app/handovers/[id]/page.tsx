import { redirect } from 'next/navigation'
import { getSession, getUserRole } from '@/lib/auth'
import { MainNav } from '@/components/navigation/main-nav'
import { Breadcrumbs } from '@/components/navigation/breadcrumbs'
import { getHandover } from '@/lib/actions/handovers'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { HandoverEditForm } from '@/components/handovers/handover-edit-form'
import { HandoverStateTransition } from '@/components/handovers/handover-state-transition'
import { Separator } from '@/components/ui/separator'

export default async function HandoverDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const session = await getSession()
  
  if (!session) {
    redirect('/login')
  }

  const role = await getUserRole()
  const { data: handover, error } = await getHandover(params.id)

  if (error || !handover) {
    return (
      <main className="flex min-h-screen flex-col">
        <MainNav />
        <div className="container mx-auto flex-1 p-4">
          <Card className="border-destructive">
            <CardContent className="pt-6">
              <p className="text-destructive">
                {error?.message || 'Handover not found'}
              </p>
              <Button asChild className="mt-4">
                <Link href="/handovers">Back to Handovers</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    )
  }

  const getStateBadgeVariant = (state: string) => {
    switch (state) {
      case 'accepted':
        return 'default'
      case 'flagged':
        return 'destructive'
      default:
        return 'outline'
    }
  }

  const isOperations = role === 'operations'
  const canEdit = role === 'sales' || role === 'executive'

  return (
    <main className="flex min-h-screen flex-col">
      <MainNav />
      <div className="container mx-auto flex-1 p-4">
        <div className="py-8">
          <Breadcrumbs items={[
            { label: 'Dashboard', href: '/' },
            { label: 'Handovers', href: '/handovers' },
            { label: typeof handover.opportunity === 'object' && handover.opportunity ? handover.opportunity.name : 'Handover' },
          ]} />
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold mb-2">Handover</h2>
                <div className="flex items-center gap-2">
                  <Badge variant={getStateBadgeVariant(handover.state)}>
                    {handover.state}
                  </Badge>
                  <span className="text-muted-foreground">
                    ${Number(handover.deal_value).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {canEdit && (
              <Card>
                <CardHeader>
                  <CardTitle>Handover Information</CardTitle>
                  <CardDescription>View and edit handover details</CardDescription>
                </CardHeader>
                <CardContent>
                  <HandoverEditForm handover={handover} isOperations={isOperations} />
                </CardContent>
              </Card>
            )}

            {isOperations && handover.state === 'pending' && (
              <Card>
                <CardHeader>
                  <CardTitle>Accept or Flag</CardTitle>
                  <CardDescription>Accept or flag this handover</CardDescription>
                </CardHeader>
                <CardContent>
                  <HandoverStateTransition handover={handover} />
                </CardContent>
              </Card>
            )}
          </div>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Handover Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Opportunity</p>
                  {typeof handover.opportunity === 'object' && handover.opportunity ? (
                    <Link
                      href={`/opportunities/${handover.opportunity.id}`}
                      className="text-primary hover:underline"
                    >
                      {handover.opportunity.name}
                    </Link>
                  ) : (
                    <p>-</p>
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Quote</p>
                  {typeof handover.quote === 'object' && handover.quote ? (
                    <Link
                      href={`/quotes/${handover.quote.id}`}
                      className="text-primary hover:underline"
                    >
                      {handover.quote.quote_number}
                    </Link>
                  ) : (
                    <p>-</p>
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Deal Value</p>
                  <p>${Number(handover.deal_value).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Expected Start</p>
                  <p>
                    {handover.expected_start_date
                      ? new Date(handover.expected_start_date).toLocaleDateString()
                      : '-'}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Expected End</p>
                  <p>
                    {handover.expected_end_date
                      ? new Date(handover.expected_end_date).toLocaleDateString()
                      : '-'}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Accepted By</p>
                  {typeof handover.accepted_by_user === 'object' && handover.accepted_by_user ? (
                    <p>{handover.accepted_by_user.full_name || handover.accepted_by_user.email}</p>
                  ) : (
                    <p>-</p>
                  )}
                </div>
              </div>
              {handover.scope && (
                <>
                  <Separator />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">Scope</p>
                    <p className="text-sm whitespace-pre-wrap">{handover.scope}</p>
                  </div>
                </>
              )}
              {handover.flagged_reason && (
                <>
                  <Separator />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">Flagged Reason</p>
                    <p className="text-sm text-destructive">{handover.flagged_reason}</p>
                  </div>
                </>
              )}
              <Separator />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Created</p>
                <p>
                  {handover.created_at
                    ? new Date(handover.created_at).toLocaleString()
                    : '-'}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}

