import { MainNav } from '@/components/navigation/main-nav'
import { Breadcrumbs } from '@/components/navigation/breadcrumbs'
import { getOpportunity } from '@/lib/actions/opportunities'
import { getQuotes } from '@/lib/actions/quotes'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { OpportunityEditForm } from '@/components/opportunities/opportunity-edit-form'
import { OpportunityStateTransition } from '@/components/opportunities/opportunity-state-transition'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export default async function OpportunityDetailPage({
  params,
}: {
  params: { id: string }
}) {

  const { data: opportunity, error } = await getOpportunity(params.id)
  const { data: quotes } = await getQuotes(params.id)

  if (error || !opportunity) {
    return (
      <main className="flex min-h-screen flex-col">
        <MainNav />
        <div className="container mx-auto flex-1 p-4">
          <Card className="border-destructive">
            <CardContent className="pt-6">
              <p className="text-destructive">
                {error?.message || 'Opportunity not found'}
              </p>
              <Button asChild className="mt-4">
                <Link href="/opportunities">Back to Opportunities</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    )
  }

  const getStateBadgeVariant = (state: string) => {
    switch (state) {
      case 'closed_won':
        return 'default'
      case 'closed_lost':
        return 'destructive'
      case 'proposal':
        return 'secondary'
      case 'qualified':
        return 'outline'
      default:
        return 'outline'
    }
  }

  return (
    <main className="flex min-h-screen flex-col">
      <MainNav />
      <div className="container mx-auto flex-1 p-4">
        <div className="py-8">
          <Breadcrumbs items={[
            { label: 'Dashboard', href: '/' },
            { label: 'Opportunities', href: '/opportunities' },
            { label: opportunity.name },
          ]} />
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold mb-2">{opportunity.name}</h2>
                <div className="flex items-center gap-2">
                  <Badge variant={getStateBadgeVariant(opportunity.state)}>
                    {opportunity.state}
                  </Badge>
                  <span className="text-muted-foreground">
                    ${Number(opportunity.deal_value).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Opportunity Information</CardTitle>
                <CardDescription>View and edit opportunity details</CardDescription>
              </CardHeader>
              <CardContent>
                <OpportunityEditForm opportunity={opportunity} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>State Management</CardTitle>
                <CardDescription>Move opportunity through the pipeline</CardDescription>
              </CardHeader>
              <CardContent>
                <OpportunityStateTransition opportunity={opportunity} />
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Account</p>
                  {typeof opportunity.account === 'object' && opportunity.account ? (
                    <Link
                      href={`/accounts/${opportunity.account.id}`}
                      className="text-primary hover:underline"
                    >
                      {opportunity.account.name}
                    </Link>
                  ) : (
                    <p>-</p>
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Owner</p>
                  {typeof opportunity.owner === 'object' && opportunity.owner ? (
                    <p>{opportunity.owner.full_name || opportunity.owner.email}</p>
                  ) : (
                    <p>-</p>
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Expected Close Date</p>
                  <p>
                    {opportunity.expected_close_date
                      ? new Date(opportunity.expected_close_date).toLocaleDateString()
                      : '-'}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Description</p>
                  <p className="text-sm">{opportunity.description || '-'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Created</p>
                  <p>
                    {opportunity.created_at
                      ? new Date(opportunity.created_at).toLocaleString()
                      : '-'}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quotes</CardTitle>
                <CardDescription>
                  {quotes?.length || 0} quote(s) for this opportunity
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!quotes || quotes.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">No quotes found</p>
                    <Button asChild>
                      <Link href={`/quotes/new?opportunityId=${opportunity.id}`}>
                        Create Quote
                      </Link>
                    </Button>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Quote Number</TableHead>
                        <TableHead>State</TableHead>
                        <TableHead>Deal Value</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {quotes.map((quote) => (
                        <TableRow key={quote.id}>
                          <TableCell className="font-medium">{quote.quote_number}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{quote.state}</Badge>
                          </TableCell>
                          <TableCell>
                            ${Number(quote.deal_value).toLocaleString()}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm" asChild>
                              <Link href={`/quotes/${quote.id}`}>View</Link>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
}

