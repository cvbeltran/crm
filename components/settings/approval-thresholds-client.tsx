'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { DataTable, DataTableColumn } from '@/components/settings/data-table'
import { Badge } from '@/components/ui/badge'
import { deleteApprovalThreshold } from '@/lib/actions/settings/approval-thresholds'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

interface ApprovalThreshold {
  id: string
  approval_role: 'finance' | 'executive'
  min_deal_value: number
  max_deal_value: number | null
  created_at: string
}

interface ApprovalThresholdsClientProps {
  thresholds: ApprovalThreshold[]
}

export function ApprovalThresholdsClient({ thresholds }: ApprovalThresholdsClientProps) {
  const router = useRouter()

  const columns: DataTableColumn<ApprovalThreshold>[] = [
    {
      key: 'approval_role',
      header: 'Approval Role',
      cell: (row) => (
        <Badge variant={row.approval_role === 'executive' ? 'default' : 'secondary'}>
          {row.approval_role}
        </Badge>
      ),
    },
    {
      key: 'min_deal_value',
      header: 'Min Deal Value',
      cell: (row) => (
        <div className="font-medium">
          ${Number(row.min_deal_value).toLocaleString()}
        </div>
      ),
    },
    {
      key: 'max_deal_value',
      header: 'Max Deal Value',
      cell: (row) => (
        <div className="text-sm">
          {row.max_deal_value ? `$${Number(row.max_deal_value).toLocaleString()}` : 'No limit'}
        </div>
      ),
    },
    {
      key: 'created',
      header: 'Created',
      cell: (row) => (
        <div className="text-sm text-muted-foreground">
          {new Date(row.created_at).toLocaleDateString()}
        </div>
      ),
    },
  ]

  const handleDelete = async (id: string) => {
    const result = await deleteApprovalThreshold(id)
    if (result.error) {
      toast.error(result.error.message || 'Failed to delete approval threshold')
      return
    }
    router.refresh()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Approval Thresholds</CardTitle>
        <CardDescription>
          {thresholds.length} approval threshold(s) configured
        </CardDescription>
      </CardHeader>
      <CardContent>
        <DataTable
          data={thresholds}
          columns={columns}
          getRowId={(row) => row.id}
          editHref={(row) => `/settings/approval-thresholds/${row.id}`}
          onDelete={handleDelete}
          emptyMessage="No approval thresholds found. Create your first approval threshold to get started."
        />
      </CardContent>
    </Card>
  )
}

