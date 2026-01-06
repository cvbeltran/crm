'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { transitionOpportunityState } from '@/lib/actions/opportunities'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { OPPORTUNITY_TRANSITIONS } from '@/lib/types/workflows'
import type { OpportunityState } from '@/lib/types/database'

interface OpportunityStateTransitionProps {
  opportunity: { id: string; state: OpportunityState }
}

export function OpportunityStateTransition({ opportunity }: OpportunityStateTransitionProps) {
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [confirmDialog, setConfirmDialog] = useState<{ open: boolean; action: OpportunityState | null }>({ open: false, action: null })

  const validTransitions = OPPORTUNITY_TRANSITIONS[opportunity.state] || []

  const handleTransition = async (newState: OpportunityState) => {
    setLoading(newState)
    setError(null)

    const result = await transitionOpportunityState(opportunity.id, newState)

    if (!result.success) {
      setError(result.error || 'Failed to update state')
      toast.error('Failed to update opportunity state', {
        description: result.error || 'An error occurred',
      })
      setLoading(null)
      return
    }

    toast.success(`Opportunity moved to ${newState.replace('_', ' ')}`)
    setConfirmDialog({ open: false, action: null })
    router.refresh()
    setLoading(null)
  }

  const handleConfirmTransition = (newState: OpportunityState) => {
    if (newState === 'closed_lost') {
      setConfirmDialog({ open: true, action: newState })
    } else {
      handleTransition(newState)
    }
  }

  if (validTransitions.length === 0) {
    return (
      <div className="text-sm text-muted-foreground">
        This opportunity is in a final state and cannot be transitioned.
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="text-sm text-muted-foreground">
        Current state: <strong>{opportunity.state}</strong>
      </div>
      <div className="flex flex-wrap gap-2">
        {validTransitions.map((newState) => (
          <Button
            key={newState}
            variant={newState === 'closed_lost' ? 'destructive' : 'default'}
            onClick={() => handleConfirmTransition(newState)}
            disabled={loading !== null}
          >
            {loading === newState ? 'Updating...' : `Move to ${newState.replace('_', ' ')}`}
          </Button>
        ))}
      </div>
      {error && (
        <div className="text-sm text-destructive">{error}</div>
      )}
      <ConfirmDialog
        open={confirmDialog.open}
        onOpenChange={(open) => setConfirmDialog({ open, action: confirmDialog.action })}
        onConfirm={() => confirmDialog.action && handleTransition(confirmDialog.action)}
        title="Mark Opportunity as Closed Lost"
        description="Are you sure you want to mark this opportunity as closed lost? This action cannot be undone."
        confirmText="Mark as Closed Lost"
        cancelText="Cancel"
        variant="destructive"
      />
    </div>
  )
}

