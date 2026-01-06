'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { DataTable, DataTableColumn } from '@/components/settings/data-table'
import { Badge } from '@/components/ui/badge'
import { deactivateRevenueStream, activateRevenueStream } from '@/lib/actions/settings/revenue-streams'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

interface RevenueStream {
  id: string
  code?: string
  name: string
  revenue_model_id: string | null
  ticket_size?: 'low' | 'mid' | 'high'
  is_active: boolean
  created_at: string
  updated_at: string
  revenue_model?: { id: string; name: string } | null
}

interface RevenueStreamsClientProps {
  revenueStreams: RevenueStream[]
}

export function RevenueStreamsClient({ revenueStreams }: RevenueStreamsClientProps) {
  const router = useRouter()

  const columns: DataTableColumn<RevenueStream>[] = [
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
      key: 'revenue_model',
      header: 'Revenue Model',
      cell: (row) => (
        <div className="text-sm">
          {row.revenue_model ? row.revenue_model.name : '-'}
        </div>
      ),
    },
    {
      key: 'ticket_size',
      header: 'Ticket Size',
      cell: (row) => (
        <Badge variant="outline">{(row as any).ticket_size || '-'}</Badge>
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
      const result = await activateRevenueStream(id)
      if (result.error) {
        toast.error(result.error.message || 'Failed to activate revenue stream')
        return
      }
    } else {
      const result = await deactivateRevenueStream(id)
      if (result.error) {
        toast.error(result.error.message || 'Failed to deactivate revenue stream')
        return
      }
    }
    router.refresh()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenue Streams</CardTitle>
        <CardDescription>
          {revenueStreams.length} revenue stream(s) configured
        </CardDescription>
      </CardHeader>
      <CardContent>
        <DataTable
          data={revenueStreams}
          columns={columns}
          getRowId={(row) => row.id}
          editHref={(row) => `/settings/revenue-streams/${row.id}`}
          onToggleActive={handleToggleActive}
          emptyMessage="No revenue streams found. Create your first revenue stream to get started."
        />
      </CardContent>
    </Card>
  )
}

