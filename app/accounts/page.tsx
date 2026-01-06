import { redirect } from 'next/navigation'
import { Suspense } from 'react'
import { getSession } from '@/lib/auth'
import { MainNav } from '@/components/navigation/main-nav'
import { getAccounts } from '@/lib/actions/accounts'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { TableSkeleton } from '@/components/loading/table-skeleton'
import { AccountsListClient } from '@/components/accounts/accounts-list-client'

async function AccountsList() {
  const { data: accounts, error } = await getAccounts()

  return <AccountsListClient accounts={accounts || []} error={error} />
}

export default async function AccountsPage() {
  const session = await getSession()
  
  if (!session) {
    redirect('/login')
  }

  return (
    <main className="flex min-h-screen flex-col">
      <MainNav />
      <div className="container mx-auto flex-1 p-4">
        <div className="py-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold mb-2">Accounts</h2>
              <p className="text-muted-foreground">
                Manage customer accounts
              </p>
            </div>
            <Button asChild>
              <Link href="/accounts/new">New Account</Link>
            </Button>
          </div>

          <Suspense fallback={
            <Card>
              <CardHeader>
                <CardTitle>All Accounts</CardTitle>
                <CardDescription>Loading...</CardDescription>
              </CardHeader>
              <CardContent>
                <TableSkeleton rows={5} columns={6} />
              </CardContent>
            </Card>
          }>
            <AccountsList />
          </Suspense>
        </div>
      </div>
    </main>
  )
}

