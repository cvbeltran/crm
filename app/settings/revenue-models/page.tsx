import { redirect } from 'next/navigation'
import { Suspense } from 'react'
import { getSession, hasRole } from '@/lib/auth'
import { ROLES } from '@/lib/constants'
import { getRevenueModels } from '@/lib/actions/settings/revenue-models'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { DataTable, DataTableColumn } from '@/components/settings/data-table'
import { Badge } from '@/components/ui/badge'
import { TableSkeleton } from '@/components/loading/table-skeleton'
import { deactivateRevenueModel, activateRevenueModel } from '@/lib/actions/settings/revenue-models'
import { RevenueModelsClient } from '@/components/settings/revenue-models-client'

async function RevenueModelsList() {
  const { data: revenueModels, error } = await getRevenueModels()

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-destructive">Error loading revenue models: {error.message}</p>
        </CardContent>
      </Card>
    )
  }

  return <RevenueModelsClient revenueModels={revenueModels || []} />
}

export default async function RevenueModelsPage() {
  const session = await getSession()
  
  if (!session) {
    redirect('/login')
  }

  const isExecutive = await hasRole(ROLES.EXECUTIVE)
  
  if (!isExecutive) {
    redirect('/')
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-semibold mb-2">Revenue Models</h3>
          <p className="text-sm text-muted-foreground">
            Manage revenue model configurations
          </p>
        </div>
        <Button asChild>
          <Link href="/settings/revenue-models/new">New Revenue Model</Link>
        </Button>
      </div>

      <Suspense
        fallback={
          <Card>
            <CardHeader>
              <CardTitle>Revenue Models</CardTitle>
              <CardDescription>Loading...</CardDescription>
            </CardHeader>
            <CardContent>
              <TableSkeleton rows={5} columns={4} />
            </CardContent>
          </Card>
        }
      >
        <RevenueModelsList />
      </Suspense>
    </div>
  )
}

