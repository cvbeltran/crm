import { redirect } from 'next/navigation'
import { getSession, hasRole } from '@/lib/auth'
import { ROLES } from '@/lib/constants'
import { getRevenueModel } from '@/lib/actions/settings/revenue-models'
import { RevenueModelForm } from '@/components/settings/revenue-model-form'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default async function RevenueModelDetailPage({
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

  const { data: revenueModel, error } = await getRevenueModel(params.id)

  if (error || !revenueModel) {
    return (
      <Card className="border-destructive">
        <CardContent className="pt-6">
          <p className="text-destructive mb-4">
            {error?.message || 'Revenue model not found'}
          </p>
          <Button asChild>
            <Link href="/settings/revenue-models">Back to Revenue Models</Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div>
      <h3 className="text-xl font-semibold mb-6">Edit Revenue Model</h3>
      <RevenueModelForm revenueModel={revenueModel} />
    </div>
  )
}

