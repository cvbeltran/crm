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

interface Quote {
  id: string
  quote_number: string
  state: string
  deal_value: number | string
  cost: number | string | null
  margin_percentage: number | null
  valid_until: string | null
  opportunity: { id: string; name: string } | null
}

interface QuotesListClientProps {
  quotes: Quote[]
  error: { message: string } | null
  role: string
  canCreate: boolean
}

const getStateBadgeVariant = (state: string) => {
  switch (state) {
    case 'approved':
      return 'default'
    case 'rejected':
      return 'destructive'
    case 'pending_approval':
      return 'secondary'
    default:
      return 'outline'
  }
}

export function QuotesListClient({ quotes, error, role, canCreate }: QuotesListClientProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  const isOperations = role === 'operations'

  const filteredQuotes = useMemo(() => {
    if (!searchQuery.trim()) return quotes || []

    const query = searchQuery.toLowerCase()
    return (quotes || []).filter((quote) => {
      return (
        quote.quote_number.toLowerCase().includes(query) ||
        (quote.opportunity && quote.opportunity.name.toLowerCase().includes(query)) ||
        quote.state.toLowerCase().includes(query)
      )
    })
  }, [quotes, searchQuery])

  const paginatedQuotes = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    const end = start + itemsPerPage
    return filteredQuotes.slice(start, end)
  }, [filteredQuotes, currentPage])

  const totalPages = Math.ceil(filteredQuotes.length / itemsPerPage)

  useMemo(() => {
    if (searchQuery) {
      setCurrentPage(1)
    }
  }, [searchQuery])

  const columns: ResponsiveTableColumn<Quote>[] = [
    {
      key: 'quote_number',
      header: 'Quote Number',
      mobileLabel: 'Quote #',
      mobilePriority: 'high',
      cell: (quote) => <span className="font-medium">{quote.quote_number}</span>,
    },
    {
      key: 'opportunity',
      header: 'Opportunity',
      mobilePriority: 'high',
      cell: (quote) =>
        quote.opportunity ? (
          <Link href={`/opportunities/${quote.opportunity.id}`} className="text-primary hover:underline">
            <Truncate maxLength={25}>{quote.opportunity.name}</Truncate>
          </Link>
        ) : (
          '-'
        ),
    },
    {
      key: 'state',
      header: 'State',
      mobilePriority: 'high',
      cell: (quote) => (
        <Badge variant={getStateBadgeVariant(quote.state)}>{quote.state}</Badge>
      ),
    },
    {
      key: 'deal_value',
      header: 'Deal Value',
      mobilePriority: 'high',
      cell: (quote) => `$${Number(quote.deal_value).toLocaleString()}`,
    },
    ...(isOperations
      ? []
      : [
          {
            key: 'cost',
            header: 'Cost',
            mobilePriority: 'low',
            cell: (quote) =>
              quote.cost ? `$${Number(quote.cost).toLocaleString()}` : '-',
          } as ResponsiveTableColumn<Quote>,
          {
            key: 'margin',
            header: 'Margin',
            mobilePriority: 'low',
            cell: (quote) =>
              quote.margin_percentage !== null
                ? `${Number(quote.margin_percentage).toFixed(1)}%`
                : '-',
          } as ResponsiveTableColumn<Quote>,
        ]),
    {
      key: 'valid_until',
      header: 'Valid Until',
      mobilePriority: 'medium',
      cell: (quote) =>
        quote.valid_until ? new Date(quote.valid_until).toLocaleDateString() : '-',
    },
    {
      key: 'actions',
      header: 'Actions',
      mobilePriority: 'high',
      cell: (quote) => (
        <Button variant="ghost" size="sm" className="md:size-sm min-h-[44px] md:min-h-0 w-full md:w-auto" asChild>
          <Link href={`/quotes/${quote.id}`}>View</Link>
        </Button>
      ),
    },
  ]

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>All Quotes</CardTitle>
            <CardDescription>
              {filteredQuotes.length} of {quotes?.length || 0} quote(s) found
              {searchQuery && ` (filtered)`}
              {isOperations && ' (limited visibility)'}
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
            placeholder="Search by quote number, opportunity, or state..."
          />
        </div>

        {error ? (
          <p className="text-destructive text-center py-8">
            Error loading quotes: {error.message}
          </p>
        ) : filteredQuotes.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">
              {searchQuery ? 'No quotes match your search.' : 'No quotes found. Create your first quote to get started.'}
            </p>
            {!searchQuery && canCreate && (
              <Button asChild>
                <Link href="/quotes/new">Create Quote</Link>
              </Button>
            )}
          </div>
        ) : (
          <>
            <ResponsiveTable
              data={paginatedQuotes}
              columns={columns}
              getRowKey={(quote) => quote.id}
              emptyMessage={searchQuery ? 'No quotes match your search.' : 'No quotes found'}
              emptyAction={
                !searchQuery && canCreate ? (
                  <Button asChild>
                    <Link href="/quotes/new">Create Quote</Link>
                  </Button>
                ) : undefined
              }
            />
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              itemsPerPage={itemsPerPage}
              totalItems={filteredQuotes.length}
            />
          </>
        )}
      </CardContent>
    </Card>
  )
}

