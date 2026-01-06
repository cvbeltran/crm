'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { DataTable, DataTableColumn } from '@/components/settings/data-table'
import { Badge } from '@/components/ui/badge'
import { deactivateOpportunityStage, activateOpportunityStage } from '@/lib/actions/settings/opportunity-stages'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

interface OpportunityStage {
  id: string
  stage: string
  display_name: string
  description: string | null
  order_index: number
  is_active: boolean
  created_at: string
  updated_at: string
}

interface OpportunityStagesClientProps {
  stages: OpportunityStage[]
}

export function OpportunityStagesClient({ stages }: OpportunityStagesClientProps) {
  const router = useRouter()

  const columns: DataTableColumn<OpportunityStage>[] = [
    {
      key: 'order',
      header: 'Order',
      cell: (row) => (
        <div className="font-medium">{row.order_index}</div>
      ),
    },
    {
      key: 'stage',
      header: 'Stage',
      cell: (row) => (
        <div className="font-mono text-sm">{row.stage}</div>
      ),
    },
    {
      key: 'display_name',
      header: 'Display Name',
      cell: (row) => (
        <div className="font-medium">{row.display_name}</div>
      ),
    },
    {
      key: 'description',
      header: 'Description',
      cell: (row) => (
        <div className="text-sm text-muted-foreground max-w-md truncate">
          {row.description || '-'}
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      cell: (row) => (
        <Badge variant={row.is_active ? 'default' : 'secondary'}>
          {row.is_active ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
  ]

  const handleToggleActive = async (id: string, isActive: boolean) => {
    if (isActive) {
      const result = await activateOpportunityStage(id)
      if (result.error) {
        toast.error(result.error.message || 'Failed to activate opportunity stage')
        return
      }
    } else {
      const result = await deactivateOpportunityStage(id)
      if (result.error) {
        toast.error(result.error.message || 'Failed to deactivate opportunity stage')
        return
      }
    }
    router.refresh()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Opportunity Stages</CardTitle>
        <CardDescription>
          {stages.length} opportunity stage(s) configured
        </CardDescription>
      </CardHeader>
      <CardContent>
        <DataTable
          data={stages}
          columns={columns}
          getRowId={(row) => row.id}
          editHref={(row) => `/settings/opportunity-stages/${row.id}`}
          onToggleActive={handleToggleActive}
          emptyMessage="No opportunity stages found."
        />
      </CardContent>
    </Card>
  )
}

