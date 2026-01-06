'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { transitionQuoteState } from '@/lib/actions/quotes'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { QUOTE_TRANSITIONS } from '@/lib/types/workflows'
import type { QuoteState } from '@/lib/types/database'

interface QuoteStateTransitionProps {
  quote: { id: string; state: QuoteState }
  canApprove: boolean
}

export function QuoteStateTransition({ quote, canApprove }: QuoteStateTransitionProps) {
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [comments, setComments] = useState('')
  const [showComments, setShowComments] = useState(false)
  const [confirmDialog, setConfirmDialog] = useState<{ open: boolean; action: QuoteState | null }>({ open: false, action: null })

  const validTransitions = QUOTE_TRANSITIONS[quote.state] || []

  const handleTransition = async (newState: QuoteState) => {
    setLoading(newState)
    setError(null)

    const result = await transitionQuoteState(
      quote.id, 
      newState, 
      (newState === 'approved' || newState === 'rejected') ? comments : undefined
    )

    if (!result.success) {
      setError(result.error || 'Failed to update state')
      toast.error('Failed to update quote state', {
        description: result.error || 'An error occurred',
      })
      setLoading(null)
      return
    }

    toast.success(`Quote ${newState === 'approved' ? 'approved' : newState === 'rejected' ? 'rejected' : 'updated'} successfully!`)
    setComments('')
    setShowComments(false)
    setConfirmDialog({ open: false, action: null })
    router.refresh()
    setLoading(null)
  }

  const handleConfirmTransition = (newState: QuoteState) => {
    if (newState === 'rejected') {
      setConfirmDialog({ open: true, action: newState })
    } else {
      handleTransition(newState)
    }
  }

  if (validTransitions.length === 0) {
    return (
      <div className="text-sm text-muted-foreground">
        This quote is in a final state and cannot be transitioned.
      </div>
    )
  }

  // Only show approval buttons if user can approve and quote is pending approval
  if (quote.state === 'pending_approval' && canApprove) {
    return (
      <div className="space-y-4">
        <div className="text-sm text-muted-foreground">
          Current state: <strong>{quote.state}</strong>
        </div>
        
        {!showComments ? (
          <>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="default"
                onClick={() => {
                  setShowComments(true)
                  setComments('')
                }}
                disabled={loading !== null}
              >
                Approve Quote
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  setShowComments(true)
                  setComments('')
                }}
                disabled={loading !== null}
              >
                Reject Quote
              </Button>
            </div>
            {error && (
              <div className="text-sm text-destructive">{error}</div>
            )}
          </>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="approval_comments">Comments (Optional)</Label>
              <Textarea
                id="approval_comments"
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                disabled={loading !== null}
                rows={3}
                placeholder="Add comments about this approval decision..."
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant="default"
                onClick={() => handleConfirmTransition('approved')}
                disabled={loading !== null}
              >
                {loading === 'approved' ? 'Approving...' : 'Approve Quote'}
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleConfirmTransition('rejected')}
                disabled={loading !== null}
              >
                {loading === 'rejected' ? 'Rejecting...' : 'Reject Quote'}
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  setShowComments(false)
                  setComments('')
                  setError(null)
                }}
                disabled={loading !== null}
              >
                Cancel
              </Button>
            </div>
            {error && (
              <div className="text-sm text-destructive">{error}</div>
            )}
          </div>
        )}
        <ConfirmDialog
          open={confirmDialog.open}
          onOpenChange={(open) => setConfirmDialog({ open, action: confirmDialog.action })}
          onConfirm={() => confirmDialog.action && handleTransition(confirmDialog.action)}
          title="Reject Quote"
          description="Are you sure you want to reject this quote? This action cannot be undone."
          confirmText="Reject Quote"
          cancelText="Cancel"
          variant="destructive"
        />
      </div>
    )
  }

  // Show submit for approval button if draft
  if (quote.state === 'draft') {
    return (
      <div className="space-y-4">
        <div className="text-sm text-muted-foreground">
          Current state: <strong>{quote.state}</strong>
        </div>
        <Button
          onClick={() => handleTransition('pending_approval')}
          disabled={loading !== null}
        >
          {loading === 'pending_approval' ? 'Submitting...' : 'Submit for Approval'}
        </Button>
        {error && (
          <div className="text-sm text-destructive">{error}</div>
        )}
      </div>
    )
  }

  return (
    <div className="text-sm text-muted-foreground">
      Current state: <strong>{quote.state}</strong>
    </div>
  )
}

