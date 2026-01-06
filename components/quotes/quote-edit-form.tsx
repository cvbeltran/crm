'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { updateQuote } from '@/lib/actions/quotes'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

interface QuoteEditFormProps {
  quote: {
    id: string
    quote_number: string
    deal_value: number
    cost?: number | null
    margin_percentage?: number | null
    discount_percentage?: number | null
    scope?: string | null
    valid_until?: string | null
  }
  isOperations: boolean
}

export function QuoteEditForm({ quote, isOperations }: QuoteEditFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    deal_value: Number(quote.deal_value),
    cost: quote.cost ? Number(quote.cost) : null,
    margin_percentage: quote.margin_percentage ? Number(quote.margin_percentage) : null,
    discount_percentage: quote.discount_percentage ? Number(quote.discount_percentage) : null,
    scope: quote.scope || '',
    valid_until: quote.valid_until || '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { data, error: updateError } = await updateQuote(quote.id, {
      ...formData,
      cost: formData.cost,
      margin_percentage: formData.margin_percentage,
      discount_percentage: formData.discount_percentage,
      scope: formData.scope || null,
      valid_until: formData.valid_until || null,
    })

    if (updateError) {
      setError(updateError.message || 'Failed to update quote')
      setLoading(false)
      return
    }

    router.refresh()
    setLoading(false)
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

      {!isOperations && (
        <>
          <div className="space-y-2">
            <Label htmlFor="cost">Cost ($)</Label>
            <Input
              id="cost"
              type="number"
              step="0.01"
              min="0"
              value={formData.cost || ''}
              onChange={(e) => setFormData({ ...formData, cost: e.target.value ? parseFloat(e.target.value) : null })}
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="margin_percentage">Margin Percentage (%)</Label>
            <Input
              id="margin_percentage"
              type="number"
              step="0.01"
              min="0"
              max="100"
              value={formData.margin_percentage || ''}
              onChange={(e) => setFormData({ ...formData, margin_percentage: e.target.value ? parseFloat(e.target.value) : null })}
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="discount_percentage">Discount Percentage (%)</Label>
            <Input
              id="discount_percentage"
              type="number"
              step="0.01"
              min="0"
              max="100"
              value={formData.discount_percentage || ''}
              onChange={(e) => setFormData({ ...formData, discount_percentage: e.target.value ? parseFloat(e.target.value) : null })}
              disabled={loading}
            />
          </div>
        </>
      )}

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

      <div className="space-y-2">
        <Label htmlFor="valid_until">Valid Until</Label>
        <Input
          id="valid_until"
          type="date"
          value={formData.valid_until}
          onChange={(e) => setFormData({ ...formData, valid_until: e.target.value })}
          disabled={loading}
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

