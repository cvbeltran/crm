import { redirect } from 'next/navigation'
import { getSession, hasRole } from '@/lib/auth'
import { ROLES } from '@/lib/constants'
import { ApprovalThresholdForm } from '@/components/settings/approval-threshold-form'

export default async function NewApprovalThresholdPage() {
  const session = await getSession()
  
  if (!session) {
    redirect('/login')
  }

  const isExecutive = await hasRole(ROLES.EXECUTIVE)
  
  if (!isExecutive) {
    redirect('/')
  }

  return (
    <div>
      <h3 className="text-xl font-semibold mb-6">New Approval Threshold</h3>
      <ApprovalThresholdForm />
    </div>
  )
}

