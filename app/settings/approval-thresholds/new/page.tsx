import { ApprovalThresholdForm } from '@/components/settings/approval-threshold-form'

export default async function NewApprovalThresholdPage() {
  return (
    <div>
      <h3 className="text-xl font-semibold mb-6">New Approval Threshold</h3>
      <ApprovalThresholdForm />
    </div>
  )
}

