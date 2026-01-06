'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { DataTable, DataTableColumn } from '@/components/settings/data-table'
import { Badge } from '@/components/ui/badge'
import { deactivateRevenueModel, activateRevenueModel } from '@/lib/actions/settings/revenue-models'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

interface RevenueModel {
  id: string
  code?: string
  name: string
  description: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

interface RevenueModelsClientProps {
  revenueModels: RevenueModel[]
}

export function RevenueModelsClient({ revenueModels }: RevenueModelsClientProps) {
  const router = useRouter()

  const columns: DataTableColumn<RevenueModel>[] = [
    {
      key: 'code',
      header: 'Code',
      cell: (row) => (
        <div className="font-mono text-sm">{(row as any).code || '-'}</div>
      ),
    },
    {
      key: 'name',
      header: 'Name',
      cell: (row) => (
        <div className="font-medium">{row.name}</div>
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
    {
      key: 'updated',
      header: 'Last Updated',
      cell: (row) => (
        <div className="text-sm text-muted-foreground">
          {new Date(row.updated_at).toLocaleDateString()}
        </div>
      ),
    },
  ]

  const handleToggleActive = async (id: string, isActive: boolean) => {
    if (isActive) {
      const result = await activateRevenueModel(id)
      if (result.error) {
        toast.error(result.error.message || 'Failed to activate revenue model')
        return
      }
    } else {
      const result = await deactivateRevenueModel(id)
      if (result.error) {
        toast.error(result.error.message || 'Failed to deactivate revenue model')
        return
      }
    }
    router.refresh()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenue Models</CardTitle>
        <CardDescription>
          {revenueModels.length} revenue model(s) configured
        </CardDescription>
      </CardHeader>
      <CardContent>
        <DataTable
          data={revenueModels}
          columns={columns}
          getRowId={(row) => row.id}
          editHref={(row) => `/settings/revenue-models/${row.id}`}
          onToggleActive={handleToggleActive}
          emptyMessage="No revenue models found. Create your first revenue model to get started."
        />
      </CardContent>
    </Card>
  )
}

