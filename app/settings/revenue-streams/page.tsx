import { Suspense } from 'react'
import { getRevenueStreams } from '@/lib/actions/settings/revenue-streams'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { TableSkeleton } from '@/components/loading/table-skeleton'
import { RevenueStreamsClient } from '@/components/settings/revenue-streams-client'

async function RevenueStreamsList() {
  const { data: revenueStreams, error } = await getRevenueStreams()

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-destructive">Error loading revenue streams: {error.message}</p>
        </CardContent>
      </Card>
    )
  }

  return <RevenueStreamsClient revenueStreams={revenueStreams || []} />
}

export default async function RevenueStreamsPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-semibold mb-2">Revenue Streams</h3>
          <p className="text-sm text-muted-foreground">
            Configure revenue streams and their associations
          </p>
        </div>
        <Button asChild>
          <Link href="/settings/revenue-streams/new">New Revenue Stream</Link>
        </Button>
      </div>

      <Suspense
        fallback={
          <Card>
            <CardHeader>
              <CardTitle>Revenue Streams</CardTitle>
              <CardDescription>Loading...</CardDescription>
            </CardHeader>
            <CardContent>
              <TableSkeleton rows={5} columns={5} />
            </CardContent>
          </Card>
        }
      >
        <RevenueStreamsList />
      </Suspense>
    </div>
  )
}

