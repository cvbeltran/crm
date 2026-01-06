import { redirect } from 'next/navigation'
import { getSession, getUserRole } from '@/lib/auth'
import { MainNav } from '@/components/navigation/main-nav'
import { Breadcrumbs } from '@/components/navigation/breadcrumbs'
import { getQuote } from '@/lib/actions/quotes'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { QuoteEditForm } from '@/components/quotes/quote-edit-form'
import { QuoteStateTransition } from '@/components/quotes/quote-state-transition'
import { ApprovalHistory } from '@/components/quotes/approval-history'
import { Separator } from '@/components/ui/separator'

export default async function QuoteDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const session = await getSession()
  
  if (!session) {
    redirect('/login')
  }

  const role = await getUserRole()
  const { data: quote, error } = await getQuote(params.id)

  if (error || !quote) {
    return (
      <main className="flex min-h-screen flex-col">
        <MainNav />
        <div className="container mx-auto flex-1 p-4">
          <Card className="border-destructive">
            <CardContent className="pt-6">
              <p className="text-destructive">
                {error?.message || 'Quote not found'}
              </p>
              <Button asChild className="mt-4">
                <Link href="/quotes">Back to Quotes</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    )
  }

  const getStateBadgeVariant = (state: string) => {
    switch (state) {
      case 'approved':
        return 'default'
      case 'rejected':
        return 'destructive'
      case 'pending_approval':
        return 'secondary'
      default:
        return 'outline'
    }
  }

  const isOperations = role === 'operations'
  const canEdit = role === 'sales' || role === 'executive'
  const canApprove = role === 'finance' || role === 'executive'

  return (
    <main className="flex min-h-screen flex-col">
      <MainNav />
      <div className="container mx-auto flex-1 p-4">
        <div className="py-8">
          <Breadcrumbs items={[
            { label: 'Dashboard', href: '/' },
            { label: 'Quotes', href: '/quotes' },
            { label: quote.quote_number },
          ]} />
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold mb-2">{quote.quote_number}</h2>
                <div className="flex items-center gap-2">
                  <Badge variant={getStateBadgeVariant(quote.state)}>
                    {quote.state}
                  </Badge>
                  <span className="text-muted-foreground">
                    ${Number(quote.deal_value).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {canEdit && (
              <Card>
                <CardHeader>
                  <CardTitle>Quote Information</CardTitle>
                  <CardDescription>View and edit quote details</CardDescription>
                </CardHeader>
                <CardContent>
                  <QuoteEditForm quote={quote} isOperations={isOperations} />
                </CardContent>
              </Card>
            )}

            {(canApprove || quote.state === 'pending_approval') && (
              <Card>
                <CardHeader>
                  <CardTitle>Approval</CardTitle>
                  <CardDescription>
                    {canApprove ? 'Approve or reject this quote' : 'Quote is pending approval'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <QuoteStateTransition quote={quote} canApprove={canApprove} />
                </CardContent>
              </Card>
            )}
          </div>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Quote Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Opportunity</p>
                  {typeof quote.opportunity === 'object' && quote.opportunity ? (
                    <Link
                      href={`/opportunities/${quote.opportunity.id}`}
                      className="text-primary hover:underline"
                    >
                      {quote.opportunity.name}
                    </Link>
                  ) : (
                    <p>-</p>
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Deal Value</p>
                  <p>${Number(quote.deal_value).toLocaleString()}</p>
                </div>
                {!isOperations && (
                  <>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Cost</p>
                      <p>{quote.cost ? `$${Number(quote.cost).toLocaleString()}` : '-'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Margin</p>
                      <p>
                        {quote.margin_percentage !== null
                          ? `${Number(quote.margin_percentage).toFixed(1)}%`
                          : '-'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Discount</p>
                      <p>
                        {quote.discount_percentage !== null
                          ? `${Number(quote.discount_percentage).toFixed(1)}%`
                          : '-'}
                      </p>
                    </div>
                  </>
                )}
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Valid Until</p>
                  <p>
                    {quote.valid_until
                      ? new Date(quote.valid_until).toLocaleDateString()
                      : '-'}
                  </p>
                </div>
              </div>
              {quote.scope && (
                <>
                  <Separator />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">Scope</p>
                    <p className="text-sm whitespace-pre-wrap">{quote.scope}</p>
                  </div>
                </>
              )}
              <Separator />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Created</p>
                <p>
                  {quote.created_at
                    ? new Date(quote.created_at).toLocaleString()
                    : '-'}
                </p>
              </div>
            </CardContent>
          </Card>

          {!isOperations && (
            <div className="mt-6">
              <ApprovalHistory quoteId={quote.id} />
            </div>
          )}
        </div>
      </div>
    </main>
  )
}

