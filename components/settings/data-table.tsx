'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Pencil, Trash2, Power, PowerOff } from 'lucide-react'
import Link from 'next/link'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { toast } from 'sonner'

export interface DataTableColumn<T> {
  key: string
  header: string
  cell: (row: T) => React.ReactNode
  className?: string
}

interface DataTableProps<T> {
  data: T[]
  columns: DataTableColumn<T>[]
  getRowId: (row: T) => string
  editHref?: (row: T) => string
  onDelete?: (id: string) => Promise<void>
  onToggleActive?: (id: string, isActive: boolean) => Promise<void>
  emptyMessage?: string
  emptyAction?: React.ReactNode
}

export function DataTable<T extends { id: string }>({
  data,
  columns,
  getRowId,
  editHref,
  onDelete,
  onToggleActive,
  emptyMessage = 'No items found',
  emptyAction,
}: DataTableProps<T>) {
  const router = useRouter()
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; id: string | null }>({
    open: false,
    id: null,
  })
  const [loading, setLoading] = useState<string | null>(null)

  const handleDelete = async () => {
    if (!deleteDialog.id || !onDelete) return

    setLoading(deleteDialog.id)
    try {
      await onDelete(deleteDialog.id)
      toast.success('Item deleted successfully')
      setDeleteDialog({ open: false, id: null })
      router.refresh()
    } catch (error) {
      toast.error('Failed to delete item')
    } finally {
      setLoading(null)
    }
  }

  const handleToggleActive = async (id: string, isActive: boolean) => {
    if (!onToggleActive) return

    setLoading(id)
    try {
      await onToggleActive(id, isActive)
      toast.success(`Item ${isActive ? 'activated' : 'deactivated'} successfully`)
      router.refresh()
    } catch (error) {
      toast.error(`Failed to ${isActive ? 'activate' : 'deactivate'} item`)
    } finally {
      setLoading(null)
    }
  }

  if (data.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-4">{emptyMessage}</p>
        {emptyAction}
      </div>
    )
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.key} className={column.className}>
                  {column.header}
                </TableHead>
              ))}
              <TableHead className="text-right w-[120px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row) => {
              const id = getRowId(row)
              const isActive = (row as any).is_active !== false && (row as any).is_active !== undefined
              const isLoading = loading === id

              return (
                <TableRow key={id}>
                  {columns.map((column) => (
                    <TableCell key={column.key} className={column.className}>
                      {column.cell(row)}
                    </TableCell>
                  ))}
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      {onToggleActive && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleActive(id, !isActive)}
                          disabled={isLoading}
                          title={isActive ? 'Deactivate' : 'Activate'}
                        >
                          {isActive ? (
                            <PowerOff className="h-4 w-4" />
                          ) : (
                            <Power className="h-4 w-4" />
                          )}
                        </Button>
                      )}
                      {editHref && (
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={editHref(row)}>
                            <Pencil className="h-4 w-4" />
                          </Link>
                        </Button>
                      )}
                      {onDelete && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeleteDialog({ open: true, id })}
                          disabled={isLoading}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>

      {onDelete && (
        <ConfirmDialog
          open={deleteDialog.open}
          onOpenChange={(open) => setDeleteDialog({ open, id: deleteDialog.id })}
          onConfirm={handleDelete}
          title="Delete Item"
          description="Are you sure you want to delete this item? This action cannot be undone."
          confirmText="Delete"
          cancelText="Cancel"
          variant="destructive"
        />
      )}
    </>
  )
}

