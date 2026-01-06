'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { SearchFilter } from '@/components/filters/search-filter'
import { Pagination } from '@/components/ui/pagination'
import { ResponsiveTable, ResponsiveTableColumn } from '@/components/ui/responsive-table'
import { Truncate } from '@/components/ui/truncate'

interface Handover {
  id: string
  state: string
  deal_value: number | string
  expected_start_date: string | null
  expected_end_date: string | null
  opportunity: { id: string; name: string } | null
  accepted_by_user: { full_name: string | null; email: string | null } | null
}

interface HandoversListClientProps {
  handovers: Handover[]
  error: { message: string } | null
}

const getStateBadgeVariant = (state: string) => {
  switch (state) {
    case 'accepted':
      return 'default'
    case 'flagged':
      return 'destructive'
    default:
      return 'outline'
  }
}

export function HandoversListClient({ handovers, error }: HandoversListClientProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const filteredHandovers = useMemo(() => {
    if (!searchQuery.trim()) return handovers || []

    const query = searchQuery.toLowerCase()
    return (handovers || []).filter((handover) => {
      return (
        (handover.opportunity && handover.opportunity.name.toLowerCase().includes(query)) ||
        handover.state.toLowerCase().includes(query) ||
        (handover.accepted_by_user &&
          (handover.accepted_by_user.full_name?.toLowerCase().includes(query) ||
            handover.accepted_by_user.email?.toLowerCase().includes(query)))
      )
    })
  }, [handovers, searchQuery])

  const paginatedHandovers = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    const end = start + itemsPerPage
    return filteredHandovers.slice(start, end)
  }, [filteredHandovers, currentPage])

  const totalPages = Math.ceil(filteredHandovers.length / itemsPerPage)

  useMemo(() => {
    if (searchQuery) {
      setCurrentPage(1)
    }
  }, [searchQuery])

  const columns: ResponsiveTableColumn<Handover>[] = [
    {
      key: 'opportunity',
      header: 'Opportunity',
      mobileLabel: 'Opportunity Name',
      mobilePriority: 'high',
      cell: (handover) =>
        handover.opportunity ? (
          <Link href={`/opportunities/${handover.opportunity.id}`} className="text-primary hover:underline">
            <Truncate maxLength={25}>{handover.opportunity.name}</Truncate>
          </Link>
        ) : (
          '-'
        ),
    },
    {
      key: 'state',
      header: 'State',
      mobilePriority: 'high',
      cell: (handover) => (
        <Badge variant={getStateBadgeVariant(handover.state)}>{handover.state}</Badge>
      ),
    },
    {
      key: 'deal_value',
      header: 'Deal Value',
      mobilePriority: 'high',
      cell: (handover) => `$${Number(handover.deal_value).toLocaleString()}`,
    },
    {
      key: 'expected_start',
      header: 'Expected Start',
      mobilePriority: 'medium',
      cell: (handover) =>
        handover.expected_start_date
          ? new Date(handover.expected_start_date).toLocaleDateString()
          : '-',
    },
    {
      key: 'expected_end',
      header: 'Expected End',
      mobilePriority: 'medium',
      cell: (handover) =>
        handover.expected_end_date
          ? new Date(handover.expected_end_date).toLocaleDateString()
          : '-',
    },
    {
      key: 'accepted_by',
      header: 'Accepted By',
      mobilePriority: 'low',
      cell: (handover) =>
        handover.accepted_by_user
          ? handover.accepted_by_user.full_name || handover.accepted_by_user.email
          : '-',
    },
    {
      key: 'actions',
      header: 'Actions',
      mobilePriority: 'high',
      cell: (handover) => (
        <Button variant="ghost" size="sm" className="md:size-sm min-h-[44px] md:min-h-0 w-full md:w-auto" asChild>
          <Link href={`/handovers/${handover.id}`}>View</Link>
        </Button>
      ),
    },
  ]

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>All Handovers</CardTitle>
            <CardDescription>
              {filteredHandovers.length} of {handovers?.length || 0} handover(s) found
              {searchQuery && ` (filtered)`}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <SearchFilter
            value={searchQuery}
            onChange={(value) => {
              setSearchQuery(value)
              setCurrentPage(1)
            }}
            placeholder="Search by opportunity, state, or accepted by..."
          />
        </div>

        {error ? (
          <p className="text-destructive text-center py-8">
            Error loading handovers: {error.message}
          </p>
        ) : filteredHandovers.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">
              {searchQuery ? 'No handovers match your search.' : 'No handovers found.'}
            </p>
          </div>
        ) : (
          <>
            <ResponsiveTable
              data={paginatedHandovers}
              columns={columns}
              getRowKey={(handover) => handover.id}
              emptyMessage={searchQuery ? 'No handovers match your search.' : 'No handovers found'}
            />
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              itemsPerPage={itemsPerPage}
              totalItems={filteredHandovers.length}
            />
          </>
        )}
      </CardContent>
    </Card>
  )
}

