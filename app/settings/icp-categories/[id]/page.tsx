import { redirect } from 'next/navigation'
import { getSession, hasRole } from '@/lib/auth'
import { ROLES } from '@/lib/constants'
import { getICPCategory } from '@/lib/actions/settings/icp-categories'
import { ICPCategoryForm } from '@/components/settings/icp-category-form'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default async function ICPCategoryDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const session = await getSession()
  
  if (!session) {
    redirect('/login')
  }

  const isExecutive = await hasRole(ROLES.EXECUTIVE)
  
  if (!isExecutive) {
    redirect('/')
  }

  const { data: icpCategory, error } = await getICPCategory(params.id)

  if (error || !icpCategory) {
    return (
      <Card className="border-destructive">
        <CardContent className="pt-6">
          <p className="text-destructive mb-4">
            {error?.message || 'ICP category not found'}
          </p>
          <Button asChild>
            <Link href="/settings/icp-categories">Back to ICP Categories</Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div>
      <h3 className="text-xl font-semibold mb-6">Edit ICP Category</h3>
      <ICPCategoryForm icpCategory={icpCategory} />
    </div>
  )
}

