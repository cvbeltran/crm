import { Suspense } from 'react'
import { getApprovalThresholds } from '@/lib/actions/settings/approval-thresholds'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { TableSkeleton } from '@/components/loading/table-skeleton'
import { ApprovalThresholdsClient } from '@/components/settings/approval-thresholds-client'

async function ApprovalThresholdsList() {
  const { data: thresholds, error } = await getApprovalThresholds()

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-destructive">Error loading approval thresholds: {error.message}</p>
        </CardContent>
      </Card>
    )
  }

  return <ApprovalThresholdsClient thresholds={thresholds || []} />
}

export default async function ApprovalThresholdsPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-semibold mb-2">Approval Thresholds</h3>
          <p className="text-sm text-muted-foreground">
            Set approval thresholds and requirements
          </p>
        </div>
        <Button asChild>
          <Link href="/settings/approval-thresholds/new">New Approval Threshold</Link>
        </Button>
      </div>

      <Suspense
        fallback={
          <Card>
            <CardHeader>
              <CardTitle>Approval Thresholds</CardTitle>
              <CardDescription>Loading...</CardDescription>
            </CardHeader>
            <CardContent>
              <TableSkeleton rows={5} columns={5} />
            </CardContent>
          </Card>
        }
      >
        <ApprovalThresholdsList />
      </Suspense>
    </div>
  )
}

