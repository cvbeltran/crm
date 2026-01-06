import { redirect } from 'next/navigation'
import { Suspense } from 'react'
import { getSession, getUserRole } from '@/lib/auth'
import { MainNav } from '@/components/navigation/main-nav'
import { getQuotes } from '@/lib/actions/quotes'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { TableSkeleton } from '@/components/loading/table-skeleton'
import { QuotesListClient } from '@/components/quotes/quotes-list-client'

async function QuotesList() {
  const role = await getUserRole()
  const { data: quotes, error } = await getQuotes()
  const canCreate = role === 'sales' || role === 'executive'

  return <QuotesListClient quotes={quotes || []} error={error} role={role} canCreate={canCreate} />
}

export default async function QuotesPage() {
  const session = await getSession()
  
  if (!session) {
    redirect('/login')
  }

  const role = await getUserRole()
  const canCreate = role === 'sales' || role === 'executive'

  return (
    <main className="flex min-h-screen flex-col">
      <MainNav />
      <div className="container mx-auto flex-1 p-4">
        <div className="py-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold mb-2">Quotes</h2>
              <p className="text-muted-foreground">
                Manage quotes and approvals
                {role === 'operations' && ' (limited visibility)'}
              </p>
            </div>
            {canCreate && (
              <Button asChild>
                <Link href="/quotes/new">New Quote</Link>
              </Button>
            )}
          </div>

          <Suspense fallback={
            <Card>
              <CardHeader>
                <CardTitle>All Quotes</CardTitle>
                <CardDescription>Loading...</CardDescription>
              </CardHeader>
              <CardContent>
                <TableSkeleton rows={5} columns={role !== 'operations' ? 8 : 6} />
              </CardContent>
            </Card>
          }>
            <QuotesList />
          </Suspense>
        </div>
      </div>
    </main>
  )
}

