'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { transitionHandoverState } from '@/lib/actions/handovers'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { HANDOVER_TRANSITIONS } from '@/lib/types/workflows'
import type { HandoverState } from '@/lib/types/database'

interface HandoverStateTransitionProps {
  handover: { id: string; state: HandoverState }
}

export function HandoverStateTransition({ handover }: HandoverStateTransitionProps) {
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [flaggedReason, setFlaggedReason] = useState('')
  const [showFlagReason, setShowFlagReason] = useState(false)

  const validTransitions = HANDOVER_TRANSITIONS[handover.state] || []

  const handleAccept = async () => {
    setLoading('accepted')
    setError(null)

    const result = await transitionHandoverState(handover.id, 'accepted')

    if (!result.success) {
      setError(result.error || 'Failed to accept handover')
      toast.error('Failed to accept handover', {
        description: result.error || 'An error occurred',
      })
      setLoading(null)
      return
    }

    toast.success('Handover accepted successfully!')
    router.refresh()
    setLoading(null)
  }

  const handleFlag = async () => {
    if (!flaggedReason.trim()) {
      setError('Please provide a reason for flagging')
      return
    }

    setLoading('flagged')
    setError(null)

    const result = await transitionHandoverState(
      handover.id,
      'flagged',
      undefined,
      flaggedReason
    )

    if (!result.success) {
      setError(result.error || 'Failed to flag handover')
      toast.error('Failed to flag handover', {
        description: result.error || 'An error occurred',
      })
      setLoading(null)
      return
    }

    toast.success('Handover flagged successfully')
    router.refresh()
    setLoading(null)
  }

  if (validTransitions.length === 0) {
    return (
      <div className="text-sm text-muted-foreground">
        This handover is in a final state and cannot be transitioned.
      </div>
    )
  }

  if (handover.state !== 'pending') {
    return (
      <div className="text-sm text-muted-foreground">
        Current state: <strong>{handover.state}</strong>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="text-sm text-muted-foreground">
        Current state: <strong>{handover.state}</strong>
      </div>

      {!showFlagReason ? (
        <div className="flex flex-wrap gap-2">
          <Button
            variant="default"
            onClick={handleAccept}
            disabled={loading !== null}
          >
            {loading === 'accepted' ? 'Accepting...' : 'Accept Handover'}
          </Button>
          <Button
            variant="destructive"
            onClick={() => setShowFlagReason(true)}
            disabled={loading !== null}
          >
            Flag Handover
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="flagged_reason">Reason for Flagging *</Label>
            <Textarea
              id="flagged_reason"
              value={flaggedReason}
              onChange={(e) => setFlaggedReason(e.target.value)}
              disabled={loading !== null}
              rows={3}
              placeholder="Explain why this handover is being flagged..."
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant="destructive"
              onClick={handleFlag}
              disabled={loading !== null || !flaggedReason.trim()}
            >
              {loading === 'flagged' ? 'Flagging...' : 'Flag Handover'}
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                setShowFlagReason(false)
                setFlaggedReason('')
                setError(null)
              }}
              disabled={loading !== null}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {error && (
        <div className="text-sm text-destructive">{error}</div>
      )}
    </div>
  )
}

