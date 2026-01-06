import { getApprovalsByQuote } from '@/lib/actions/approvals'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

interface ApprovalHistoryProps {
  quoteId: string
}

export async function ApprovalHistory({ quoteId }: ApprovalHistoryProps) {
  const { data: approvals, error } = await getApprovalsByQuote(quoteId)

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-sm text-destructive">Error loading approval history: {error.message}</p>
        </CardContent>
      </Card>
    )
  }

  if (!approvals || approvals.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Approval History</CardTitle>
          <CardDescription>No approval records found</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'approved':
        return 'default'
      case 'rejected':
        return 'destructive'
      default:
        return 'outline'
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Approval History</CardTitle>
        <CardDescription>
          {approvals.length} approval record(s)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {approvals.map((approval, index) => (
          <div key={approval.id}>
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge variant={getStatusBadgeVariant(approval.status)}>
                    {approval.status}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    by {typeof approval.approver === 'object' && approval.approver
                      ? approval.approver.full_name || approval.approver.email
                      : 'Unknown'}
                  </span>
                </div>
                {approval.comments && (
                  <p className="text-sm mt-2">{approval.comments}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  {approval.created_at
                    ? new Date(approval.created_at).toLocaleString()
                    : 'Unknown date'}
                </p>
              </div>
            </div>
            {index < approvals.length - 1 && <Separator className="mt-4" />}
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

