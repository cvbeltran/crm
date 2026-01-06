import { redirect } from 'next/navigation'
import { Suspense } from 'react'
import { getSession } from '@/lib/auth'
import { MainNav } from '@/components/navigation/main-nav'
import { getOpportunities } from '@/lib/actions/opportunities'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { TableSkeleton } from '@/components/loading/table-skeleton'
import { OpportunitiesListClient } from '@/components/opportunities/opportunities-list-client'

async function OpportunitiesList() {
  const { data: opportunities, error } = await getOpportunities()

  return <OpportunitiesListClient opportunities={opportunities || []} error={error} />
}

export default async function OpportunitiesPage() {
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
              <h2 className="text-3xl font-bold mb-2">Opportunities</h2>
              <p className="text-muted-foreground">
                Track sales opportunities through the pipeline
              </p>
            </div>
            <Button asChild>
              <Link href="/opportunities/new">New Opportunity</Link>
            </Button>
          </div>

          <Suspense fallback={
            <Card>
              <CardHeader>
                <CardTitle>All Opportunities</CardTitle>
                <CardDescription>Loading...</CardDescription>
              </CardHeader>
              <CardContent>
                <TableSkeleton rows={5} columns={6} />
              </CardContent>
            </Card>
          }>
            <OpportunitiesList />
          </Suspense>
        </div>
      </div>
    </main>
  )
}

