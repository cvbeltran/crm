import { Suspense } from 'react'
import { MainNav } from '@/components/navigation/main-nav'
import { getHandovers } from '@/lib/actions/handovers'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { TableSkeleton } from '@/components/loading/table-skeleton'
import { HandoversListClient } from '@/components/handovers/handovers-list-client'

async function HandoversList() {
  const { data: handovers, error } = await getHandovers()

  return <HandoversListClient handovers={handovers || []} error={error} />
}

export default async function HandoversPage() {
  const canCreate = true

  return (
    <main className="flex min-h-screen flex-col">
      <MainNav />
      <div className="container mx-auto flex-1 p-4">
        <div className="py-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold mb-2">Handovers</h2>
              <p className="text-muted-foreground">
                Sales to Operations handovers
              </p>
            </div>
            {canCreate && (
              <Button asChild>
                <Link href="/handovers/new">New Handover</Link>
              </Button>
            )}
          </div>

          <Suspense fallback={
            <Card>
              <CardHeader>
                <CardTitle>All Handovers</CardTitle>
                <CardDescription>Loading...</CardDescription>
              </CardHeader>
              <CardContent>
                <TableSkeleton rows={5} columns={7} />
              </CardContent>
            </Card>
          }>
            <HandoversList />
          </Suspense>
        </div>
      </div>
    </main>
  )
}

