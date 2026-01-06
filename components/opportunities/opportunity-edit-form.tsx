'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { updateOpportunity } from '@/lib/actions/opportunities'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import type { Opportunity } from '@/lib/types/database'

interface OpportunityEditFormProps {
  opportunity: Opportunity & {
    account?: { id: string; name: string } | null
  }
}

export function OpportunityEditForm({ opportunity }: OpportunityEditFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: opportunity.name,
    description: opportunity.description || '',
    deal_value: Number(opportunity.deal_value),
    expected_close_date: opportunity.expected_close_date || '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { data, error: updateError } = await updateOpportunity(opportunity.id, {
      ...formData,
      deal_value: formData.deal_value,
      expected_close_date: formData.expected_close_date || null,
    })

    if (updateError) {
      setError(updateError.message || 'Failed to update opportunity')
      setLoading(false)
      return
    }

    router.refresh()
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Opportunity Name *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
          disabled={loading}
        />
      </div>

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
        <Label htmlFor="expected_close_date">Expected Close Date</Label>
        <Input
          id="expected_close_date"
          type="date"
          value={formData.expected_close_date}
          onChange={(e) => setFormData({ ...formData, expected_close_date: e.target.value })}
          disabled={loading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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

