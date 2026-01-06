'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export interface ResponsiveTableColumn<T> {
  key: string
  header: string
  cell: (item: T) => React.ReactNode
  mobileLabel?: string
  mobilePriority?: 'high' | 'medium' | 'low'
}

interface ResponsiveTableProps<T> {
  data: T[]
  columns: ResponsiveTableColumn<T>[]
  emptyMessage?: string
  emptyAction?: React.ReactNode
  getRowKey: (item: T) => string
  className?: string
}

export function ResponsiveTable<T>({
  data,
  columns,
  emptyMessage = 'No items found',
  emptyAction,
  getRowKey,
  className,
}: ResponsiveTableProps<T>) {
  if (data.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground mb-4">{emptyMessage}</p>
        {emptyAction}
      </div>
    )
  }

  // Sort columns by mobile priority (high priority first)
  const sortedColumns = [...columns].sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 }
    const aPriority = a.mobilePriority || 'medium'
    const bPriority = b.mobilePriority || 'medium'
    return priorityOrder[aPriority] - priorityOrder[bPriority]
  })

  // Get high and medium priority columns for mobile
  const mobileColumns = sortedColumns.filter(
    (col) => col.mobilePriority !== 'low'
  )

  return (
    <>
      {/* Mobile Card View */}
      <div className="block md:hidden space-y-4">
        {data.map((item) => (
          <Card key={getRowKey(item)}>
            <CardContent className="pt-6">
              <div className="space-y-3">
                {mobileColumns.map((column) => (
                  <div key={column.key} className="flex flex-col gap-1">
                    <span className="text-xs font-medium text-muted-foreground">
                      {column.mobileLabel || column.header}
                    </span>
                    <div className="text-sm break-words">
                      {column.cell(item)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block">
        <Table className={className}>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.key}>{column.header}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item) => (
              <TableRow key={getRowKey(item)}>
                {columns.map((column) => (
                  <TableCell key={column.key} className="align-middle">
                    {column.cell(item)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  )
}

