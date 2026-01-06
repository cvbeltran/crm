'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { DataTable, DataTableColumn } from '@/components/settings/data-table'
import { Badge } from '@/components/ui/badge'
import { deactivateICPCategory, activateICPCategory } from '@/lib/actions/settings/icp-categories'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

interface ICPCategory {
  id: string
  code?: string
  name: string
  description: string | null
  is_active: boolean
  created_at: string
  updated_at?: string
}

interface ICPCategoriesClientProps {
  icpCategories: ICPCategory[]
}

export function ICPCategoriesClient({ icpCategories }: ICPCategoriesClientProps) {
  const router = useRouter()

  const columns: DataTableColumn<ICPCategory>[] = [
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
      const result = await activateICPCategory(id)
      if (result.error) {
        toast.error(result.error.message || 'Failed to activate ICP category')
        return
      }
    } else {
      const result = await deactivateICPCategory(id)
      if (result.error) {
        toast.error(result.error.message || 'Failed to deactivate ICP category')
        return
      }
    }
    router.refresh()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>ICP Categories</CardTitle>
        <CardDescription>
          {icpCategories.length} ICP category(ies) configured
        </CardDescription>
      </CardHeader>
      <CardContent>
        <DataTable
          data={icpCategories}
          columns={columns}
          getRowId={(row) => row.id}
          editHref={(row) => `/settings/icp-categories/${row.id}`}
          onToggleActive={handleToggleActive}
          emptyMessage="No ICP categories found. Create your first ICP category to get started."
        />
      </CardContent>
    </Card>
  )
}

