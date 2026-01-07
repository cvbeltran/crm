import { getRevenueStream } from '@/lib/actions/settings/revenue-streams'
import { RevenueStreamForm } from '@/components/settings/revenue-stream-form'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default async function RevenueStreamDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const { data: revenueStream, error } = await getRevenueStream(params.id)

  if (error || !revenueStream) {
    return (
      <Card className="border-destructive">
        <CardContent className="pt-6">
          <p className="text-destructive mb-4">
            {error?.message || 'Revenue stream not found'}
          </p>
          <Button asChild>
            <Link href="/settings/revenue-streams">Back to Revenue Streams</Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div>
      <h3 className="text-xl font-semibold mb-6">Edit Revenue Stream</h3>
      <RevenueStreamForm revenueStream={revenueStream} />
    </div>
  )
}

