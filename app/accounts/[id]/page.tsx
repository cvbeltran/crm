import { MainNav } from '@/components/navigation/main-nav'
import { Breadcrumbs } from '@/components/navigation/breadcrumbs'
import { getAccount, updateAccount } from '@/lib/actions/accounts'
import { getOpportunities } from '@/lib/actions/opportunities'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AccountEditForm } from '@/components/accounts/account-edit-form'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export default async function AccountDetailPage({
  params,
}: {
  params: { id: string }
}) {

  const { data: account, error } = await getAccount(params.id)
  const { data: opportunities } = await getOpportunities(params.id)

  if (error || !account) {
    return (
      <main className="flex min-h-screen flex-col">
        <MainNav />
        <div className="container mx-auto flex-1 p-4">
          <Card className="border-destructive">
            <CardContent className="pt-6">
              <p className="text-destructive">
                {error?.message || 'Account not found'}
              </p>
              <Button asChild className="mt-4">
                <Link href="/accounts">Back to Accounts</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    )
  }

  return (
    <main className="flex min-h-screen flex-col">
      <MainNav />
      <div className="container mx-auto flex-1 p-4">
        <div className="py-8">
          <Breadcrumbs items={[
            { label: 'Dashboard', href: '/' },
            { label: 'Accounts', href: '/accounts' },
            { label: account.name },
          ]} />
          <div className="mb-6">
            <h2 className="text-3xl font-bold mb-2">{account.name}</h2>
            <p className="text-muted-foreground">Account Details</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
                <CardDescription>View and edit account details</CardDescription>
              </CardHeader>
              <CardContent>
                <AccountEditForm account={account} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Industry</p>
                  <p>{account.industry || '-'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Website</p>
                  {account.website ? (
                    <a
                      href={account.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      {account.website}
                    </a>
                  ) : (
                    <p>-</p>
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Phone</p>
                  <p>{account.phone || '-'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Address</p>
                  <p>{account.address || '-'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Created</p>
                  <p>
                    {account.created_at
                      ? new Date(account.created_at).toLocaleString()
                      : '-'}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Opportunities</CardTitle>
              <CardDescription>
                {opportunities?.length || 0} opportunity(ies) for this account
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!opportunities || opportunities.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">No opportunities found</p>
                  <Button asChild>
                    <Link href={`/opportunities/new?accountId=${account.id}`}>
                      Create Opportunity
                    </Link>
                  </Button>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>State</TableHead>
                      <TableHead>Deal Value</TableHead>
                      <TableHead>Expected Close</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {opportunities.map((opp) => (
                      <TableRow key={opp.id}>
                        <TableCell className="font-medium">{opp.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{opp.state}</Badge>
                        </TableCell>
                        <TableCell>
                          ${Number(opp.deal_value).toLocaleString()}
                        </TableCell>
                        <TableCell>
                          {opp.expected_close_date
                            ? new Date(opp.expected_close_date).toLocaleDateString()
                            : '-'}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/opportunities/${opp.id}`}>View</Link>
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
    </main>
  )
}

