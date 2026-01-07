import { Suspense } from 'react'
import { getOpportunityStages } from '@/lib/actions/settings/opportunity-stages'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { TableSkeleton } from '@/components/loading/table-skeleton'
import { OpportunityStagesClient } from '@/components/settings/opportunity-stages-client'

async function OpportunityStagesList() {
  const { data: stages, error } = await getOpportunityStages()

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-destructive">Error loading opportunity stages: {error.message}</p>
        </CardContent>
      </Card>
    )
  }

  return <OpportunityStagesClient stages={stages || []} />
}

export default async function OpportunityStagesPage() {
  return (
    <div>
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Opportunity Stages</h3>
        <p className="text-sm text-muted-foreground">
          Configure opportunity stage display and ordering (limited editing - stage values cannot be changed)
        </p>
      </div>

      <Suspense
        fallback={
          <Card>
            <CardHeader>
              <CardTitle>Opportunity Stages</CardTitle>
              <CardDescription>Loading...</CardDescription>
            </CardHeader>
            <CardContent>
              <TableSkeleton rows={5} columns={5} />
            </CardContent>
          </Card>
        }
      >
        <OpportunityStagesList />
      </Suspense>
    </div>
  )
}

