import { redirect } from 'next/navigation'
import { getSession, hasRole } from '@/lib/auth'
import { ROLES } from '@/lib/constants'
import { getOpportunityStage } from '@/lib/actions/settings/opportunity-stages'
import { OpportunityStageForm } from '@/components/settings/opportunity-stage-form'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default async function OpportunityStageDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const session = await getSession()
  
  if (!session) {
    redirect('/login')
  }

  const isExecutive = await hasRole(ROLES.EXECUTIVE)
  
  if (!isExecutive) {
    redirect('/')
  }

  const { data: stage, error } = await getOpportunityStage(params.id)

  if (error || !stage) {
    return (
      <Card className="border-destructive">
        <CardContent className="pt-6">
          <p className="text-destructive mb-4">
            {error?.message || 'Opportunity stage not found'}
          </p>
          <Button asChild>
            <Link href="/settings/opportunity-stages">Back to Opportunity Stages</Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div>
      <h3 className="text-xl font-semibold mb-6">Edit Opportunity Stage</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Note: The stage enum value cannot be changed. You can only update the display name, description, order, and status.
      </p>
      <OpportunityStageForm stage={stage} />
    </div>
  )
}

