import { MainNav } from '@/components/navigation/main-nav'
import { getOpportunities } from '@/lib/actions/opportunities'
import { QuoteCreateForm } from '@/components/quotes/quote-create-form'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default async function NewQuotePage({
  searchParams,
}: {
  searchParams: { opportunityId?: string }
}) {
  return (
      <main className="flex min-h-screen flex-col">
        <MainNav />
        <div className="container mx-auto flex-1 p-4">
          <div className="py-8">
            <p className="text-destructive">You don't have permission to create quotes.</p>
          </div>
        </div>
      </main>
    )
  }

  const { data: allOpportunities } = await getOpportunities()

  // Filter to only show proposal or closed_won opportunities
  const validOpportunities = (allOpportunities || []).filter(
    (opp) => opp.state === 'proposal' || opp.state === 'closed_won'
  )

  return (
    <main className="flex min-h-screen flex-col">
      <MainNav />
      <div className="container mx-auto flex-1 p-4">
        <div className="py-8">
          <h2 className="text-3xl font-bold mb-4">New Quote</h2>
          {validOpportunities.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <p className="text-muted-foreground mb-4">
                  No valid opportunities found. Quotes can only be created for opportunities in 'proposal' or 'closed_won' state.
                </p>
                <Button asChild>
                  <Link href="/opportunities">View Opportunities</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <QuoteCreateForm 
              opportunities={validOpportunities} 
              defaultOpportunityId={searchParams.opportunityId} 
            />
          )}
        </div>
      </div>
    </main>
  )
}

