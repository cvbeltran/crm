'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { SearchFilter } from '@/components/filters/search-filter'
import { Pagination } from '@/components/ui/pagination'
import { ResponsiveTable, ResponsiveTableColumn } from '@/components/ui/responsive-table'
import { Truncate } from '@/components/ui/truncate'

interface Account {
  id: string
  name: string
  industry: string | null
  website: string | null
  phone: string | null
  created_at: string | null
}

interface AccountsListClientProps {
  accounts: Account[]
  error: { message: string } | null
}

export function AccountsListClient({ accounts, error }: AccountsListClientProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const filteredAccounts = useMemo(() => {
    if (!searchQuery.trim()) return accounts || []

    const query = searchQuery.toLowerCase()
    return (accounts || []).filter((account) => {
      return (
        account.name.toLowerCase().includes(query) ||
        (account.industry && account.industry.toLowerCase().includes(query)) ||
        (account.website && account.website.toLowerCase().includes(query)) ||
        (account.phone && account.phone.includes(query))
      )
    })
  }, [accounts, searchQuery])

  const paginatedAccounts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    const end = start + itemsPerPage
    return filteredAccounts.slice(start, end)
  }, [filteredAccounts, currentPage])

  const totalPages = Math.ceil(filteredAccounts.length / itemsPerPage)

  // Reset to page 1 when search changes
  useMemo(() => {
    if (searchQuery) {
      setCurrentPage(1)
    }
  }, [searchQuery])

  const columns: ResponsiveTableColumn<Account>[] = [
    {
      key: 'name',
      header: 'Name',
      mobileLabel: 'Account Name',
      mobilePriority: 'high',
      cell: (account) => (
        <span className="font-medium">{account.name}</span>
      ),
    },
    {
      key: 'industry',
      header: 'Industry',
      mobilePriority: 'medium',
      cell: (account) => account.industry || '-',
    },
    {
      key: 'website',
      header: 'Website',
      mobilePriority: 'low',
      cell: (account) =>
        account.website ? (
          <a
            href={account.website}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            <Truncate maxLength={30}>{account.website}</Truncate>
          </a>
        ) : (
          '-'
        ),
    },
    {
      key: 'phone',
      header: 'Phone',
      mobilePriority: 'medium',
      cell: (account) => account.phone || '-',
    },
    {
      key: 'created',
      header: 'Created',
      mobilePriority: 'low',
      cell: (account) =>
        account.created_at
          ? new Date(account.created_at).toLocaleDateString()
          : '-',
    },
    {
      key: 'actions',
      header: 'Actions',
      mobilePriority: 'high',
      cell: (account) => (
        <Button variant="ghost" size="sm" className="md:size-sm min-h-[44px] md:min-h-0 w-full md:w-auto" asChild>
          <Link href={`/accounts/${account.id}`}>View</Link>
        </Button>
      ),
    },
  ]

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>All Accounts</CardTitle>
            <CardDescription>
              {filteredAccounts.length} of {accounts?.length || 0} account(s) found
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
            placeholder="Search by name, industry, website, or phone..."
          />
        </div>

        {error ? (
          <p className="text-destructive text-center py-8">
            Error loading accounts: {error.message}
          </p>
        ) : filteredAccounts.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">
              {searchQuery ? 'No accounts match your search.' : 'No accounts found. Create your first account to get started.'}
            </p>
            {!searchQuery && (
              <Button asChild>
                <Link href="/accounts/new">Create Account</Link>
              </Button>
            )}
          </div>
        ) : (
          <>
            <ResponsiveTable
              data={paginatedAccounts}
              columns={columns}
              getRowKey={(account) => account.id}
              emptyMessage={searchQuery ? 'No accounts match your search.' : 'No accounts found'}
              emptyAction={
                !searchQuery ? (
                  <Button asChild>
                    <Link href="/accounts/new">Create Account</Link>
                  </Button>
                ) : undefined
              }
            />
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              itemsPerPage={itemsPerPage}
              totalItems={filteredAccounts.length}
            />
          </>
        )}
      </CardContent>
    </Card>
  )
}

