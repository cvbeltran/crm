import { redirect } from 'next/navigation'
import { getSession, hasAnyRole } from '@/lib/auth'
import { MainNav } from '@/components/navigation/main-nav'
import { ROLES } from '@/lib/constants'
import { getOpportunities } from '@/lib/actions/opportunities'
import { getQuotes } from '@/lib/actions/quotes'
import { HandoverCreateForm } from '@/components/handovers/handover-create-form'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default async function NewHandoverPage({
  searchParams,
}: {
  searchParams: { opportunityId?: string }
}) {
  const session = await getSession()
  
  if (!session) {
    redirect('/login')
  }

  const canCreate = await hasAnyRole([ROLES.SALES, ROLES.EXECUTIVE])
  
  if (!canCreate) {
    return (
      <main className="flex min-h-screen flex-col">
        <MainNav />
        <div className="container mx-auto flex-1 p-4">
          <div className="py-8">
            <p className="text-destructive">You don't have permission to create handovers.</p>
          </div>
        </div>
      </main>
    )
  }

  const { data: allOpportunities } = await getOpportunities()
  const { data: quotes } = await getQuotes()

  // Filter to only show closed_won opportunities
  const closedWonOpportunities = (allOpportunities || []).filter(
    (opp) => opp.state === 'closed_won'
  )

  return (
    <main className="flex min-h-screen flex-col">
      <MainNav />
      <div className="container mx-auto flex-1 p-4">
        <div className="py-8">
          <h2 className="text-3xl font-bold mb-4">New Handover</h2>
          {closedWonOpportunities.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <p className="text-muted-foreground mb-4">
                  No closed won opportunities found. Handovers can only be created for opportunities in 'closed_won' state.
                </p>
                <Button asChild>
                  <Link href="/opportunities">View Opportunities</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <HandoverCreateForm 
              opportunities={closedWonOpportunities}
              quotes={quotes || []}
              defaultOpportunityId={searchParams.opportunityId} 
            />
          )}
        </div>
      </div>
    </main>
  )
}

