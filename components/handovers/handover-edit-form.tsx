'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { updateHandover } from '@/lib/actions/handovers'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

interface HandoverEditFormProps {
  handover: {
    id: string
    deal_value: number
    scope?: string | null
    expected_start_date?: string | null
    expected_end_date?: string | null
  }
  isOperations: boolean
}

export function HandoverEditForm({ handover, isOperations }: HandoverEditFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    deal_value: Number(handover.deal_value),
    scope: handover.scope || '',
    expected_start_date: handover.expected_start_date || '',
    expected_end_date: handover.expected_end_date || '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { data, error: updateError } = await updateHandover(handover.id, {
      ...formData,
      scope: formData.scope || null,
      expected_start_date: formData.expected_start_date || null,
      expected_end_date: formData.expected_end_date || null,
    })

    if (updateError) {
      setError(updateError.message || 'Failed to update handover')
      setLoading(false)
      return
    }

    router.refresh()
    setLoading(false)
  }

  if (isOperations) {
    return (
      <div className="text-sm text-muted-foreground">
        Operations can only accept or flag handovers, not edit details.
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="deal_value">Deal Value ($) *</Label>
        <Input
          id="deal_value"
          type="number"
          step="0.01"
          min="0"
          value={formData.deal_value}
          onChange={(e) => setFormData({ ...formData, deal_value: parseFloat(e.target.value) || 0 })}
          required
          disabled={loading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="expected_start_date">Expected Start Date</Label>
        <Input
          id="expected_start_date"
          type="date"
          value={formData.expected_start_date}
          onChange={(e) => setFormData({ ...formData, expected_start_date: e.target.value })}
          disabled={loading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="expected_end_date">Expected End Date</Label>
        <Input
          id="expected_end_date"
          type="date"
          value={formData.expected_end_date}
          onChange={(e) => setFormData({ ...formData, expected_end_date: e.target.value })}
          disabled={loading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="scope">Scope</Label>
        <Textarea
          id="scope"
          value={formData.scope}
          onChange={(e) => setFormData({ ...formData, scope: e.target.value })}
          disabled={loading}
          rows={4}
        />
      </div>

      {error && (
        <div className="text-sm text-destructive">{error}</div>
      )}

      <Button type="submit" disabled={loading}>
        {loading ? 'Saving...' : 'Save Changes'}
      </Button>
    </form>
  )
}

