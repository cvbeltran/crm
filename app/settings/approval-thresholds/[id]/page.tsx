import { redirect } from 'next/navigation'
import { getSession, hasRole } from '@/lib/auth'
import { ROLES } from '@/lib/constants'
import { getApprovalThreshold } from '@/lib/actions/settings/approval-thresholds'
import { ApprovalThresholdForm } from '@/components/settings/approval-threshold-form'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default async function ApprovalThresholdDetailPage({
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

  const { data: threshold, error } = await getApprovalThreshold(params.id)

  if (error || !threshold) {
    return (
      <Card className="border-destructive">
        <CardContent className="pt-6">
          <p className="text-destructive mb-4">
            {error?.message || 'Approval threshold not found'}
          </p>
          <Button asChild>
            <Link href="/settings/approval-thresholds">Back to Approval Thresholds</Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div>
      <h3 className="text-xl font-semibold mb-6">Edit Approval Threshold</h3>
      <ApprovalThresholdForm threshold={threshold} />
    </div>
  )
}

