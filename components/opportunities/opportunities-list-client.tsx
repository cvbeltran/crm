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

interface Opportunity {
  id: string
  name: string
  state: string
  deal_value: number | string
  expected_close_date: string | null
  account: { id: string; name: string } | null
}

interface OpportunitiesListClientProps {
  opportunities: Opportunity[]
  error: { message: string } | null
}

const getStateBadgeVariant = (state: string) => {
  switch (state) {
    case 'closed_won':
      return 'default'
    case 'closed_lost':
      return 'destructive'
    case 'proposal':
      return 'secondary'
    case 'qualified':
      return 'outline'
    default:
      return 'outline'
  }
}

export function OpportunitiesListClient({ opportunities, error }: OpportunitiesListClientProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const filteredOpportunities = useMemo(() => {
    if (!searchQuery.trim()) return opportunities || []

    const query = searchQuery.toLowerCase()
    return (opportunities || []).filter((opp) => {
      return (
        opp.name.toLowerCase().includes(query) ||
        (opp.account && opp.account.name.toLowerCase().includes(query)) ||
        opp.state.toLowerCase().includes(query)
      )
    })
  }, [opportunities, searchQuery])

  const paginatedOpportunities = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    const end = start + itemsPerPage
    return filteredOpportunities.slice(start, end)
  }, [filteredOpportunities, currentPage])

  const totalPages = Math.ceil(filteredOpportunities.length / itemsPerPage)

  useMemo(() => {
    if (searchQuery) {
      setCurrentPage(1)
    }
  }, [searchQuery])

  const columns: ResponsiveTableColumn<Opportunity>[] = [
    {
      key: 'name',
      header: 'Name',
      mobileLabel: 'Opportunity Name',
      mobilePriority: 'high',
      cell: (opp) => <span className="font-medium">{opp.name}</span>,
    },
    {
      key: 'account',
      header: 'Account',
      mobilePriority: 'high',
      cell: (opp) =>
        opp.account ? (
          <Link href={`/accounts/${opp.account.id}`} className="text-primary hover:underline">
            <Truncate maxLength={25}>{opp.account.name}</Truncate>
          </Link>
        ) : (
          '-'
        ),
    },
    {
      key: 'state',
      header: 'State',
      mobilePriority: 'high',
      cell: (opp) => (
        <Badge variant={getStateBadgeVariant(opp.state)}>{opp.state}</Badge>
      ),
    },
    {
      key: 'deal_value',
      header: 'Deal Value',
      mobilePriority: 'high',
      cell: (opp) => `$${Number(opp.deal_value).toLocaleString()}`,
    },
    {
      key: 'expected_close',
      header: 'Expected Close',
      mobilePriority: 'medium',
      cell: (opp) =>
        opp.expected_close_date
          ? new Date(opp.expected_close_date).toLocaleDateString()
          : '-',
    },
    {
      key: 'actions',
      header: 'Actions',
      mobilePriority: 'high',
      cell: (opp) => (
        <Button variant="ghost" size="sm" className="md:size-sm min-h-[44px] md:min-h-0 w-full md:w-auto" asChild>
          <Link href={`/opportunities/${opp.id}`}>View</Link>
        </Button>
      ),
    },
  ]

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>All Opportunities</CardTitle>
            <CardDescription>
              {filteredOpportunities.length} of {opportunities?.length || 0} opportunity(ies) found
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
            placeholder="Search by name, account, or state..."
          />
        </div>

        {error ? (
          <p className="text-destructive text-center py-8">
            Error loading opportunities: {error.message}
          </p>
        ) : filteredOpportunities.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">
              {searchQuery ? 'No opportunities match your search.' : 'No opportunities found. Create your first opportunity to get started.'}
            </p>
            {!searchQuery && (
              <Button asChild>
                <Link href="/opportunities/new">Create Opportunity</Link>
              </Button>
            )}
          </div>
        ) : (
          <>
            <ResponsiveTable
              data={paginatedOpportunities}
              columns={columns}
              getRowKey={(opp) => opp.id}
              emptyMessage={searchQuery ? 'No opportunities match your search.' : 'No opportunities found'}
              emptyAction={
                !searchQuery ? (
                  <Button asChild>
                    <Link href="/opportunities/new">Create Opportunity</Link>
                  </Button>
                ) : undefined
              }
            />
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              itemsPerPage={itemsPerPage}
              totalItems={filteredOpportunities.length}
            />
          </>
        )}
      </CardContent>
    </Card>
  )
}

