import { redirect } from 'next/navigation'
import { Suspense } from 'react'
import { getSession, hasRole } from '@/lib/auth'
import { ROLES } from '@/lib/constants'
import { getICPCategories } from '@/lib/actions/settings/icp-categories'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { TableSkeleton } from '@/components/loading/table-skeleton'
import { ICPCategoriesClient } from '@/components/settings/icp-categories-client'

async function ICPCategoriesList() {
  const { data: icpCategories, error } = await getICPCategories()

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-destructive">Error loading ICP categories: {error.message}</p>
        </CardContent>
      </Card>
    )
  }

  return <ICPCategoriesClient icpCategories={icpCategories || []} />
}

export default async function ICPCategoriesPage() {
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
          <h3 className="text-xl font-semibold mb-2">ICP Categories</h3>
          <p className="text-sm text-muted-foreground">
            Manage Ideal Customer Profile categories
          </p>
        </div>
        <Button asChild>
          <Link href="/settings/icp-categories/new">New ICP Category</Link>
        </Button>
      </div>

      <Suspense
        fallback={
          <Card>
            <CardHeader>
              <CardTitle>ICP Categories</CardTitle>
              <CardDescription>Loading...</CardDescription>
            </CardHeader>
            <CardContent>
              <TableSkeleton rows={5} columns={4} />
            </CardContent>
          </Card>
        }
      >
        <ICPCategoriesList />
      </Suspense>
    </div>
  )
}

