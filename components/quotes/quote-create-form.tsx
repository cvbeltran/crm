'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createQuote, checkQuoteNumberExists } from '@/lib/actions/quotes'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'

interface Opportunity {
  id: string
  name: string
  state: string
}

interface QuoteCreateFormProps {
  opportunities: Opportunity[]
  defaultOpportunityId?: string
}

export function QuoteCreateForm({ opportunities, defaultOpportunityId }: QuoteCreateFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [quoteNumberError, setQuoteNumberError] = useState<string | null>(null)
  const [checkingQuoteNumber, setCheckingQuoteNumber] = useState(false)
  const [formData, setFormData] = useState({
    opportunity_id: defaultOpportunityId || '',
    quote_number: `Q-${Date.now()}`,
    deal_value: 0,
    cost: null as number | null,
    margin_percentage: null as number | null,
    discount_percentage: null as number | null,
    scope: '',
    valid_until: '',
  })

  const handleQuoteNumberBlur = async () => {
    if (!formData.quote_number.trim()) {
      setQuoteNumberError(null)
      return
    }

    setCheckingQuoteNumber(true)
    setQuoteNumberError(null)

    const { exists, error: checkError } = await checkQuoteNumberExists(formData.quote_number)

    setCheckingQuoteNumber(false)

    if (checkError) {
      setQuoteNumberError('Error checking quote number')
      return
    }

    if (exists) {
      setQuoteNumberError(`Quote number "${formData.quote_number}" already exists`)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setQuoteNumberError(null)

    if (!formData.opportunity_id) {
      setError('Please select an opportunity')
      setLoading(false)
      return
    }

    if (!formData.quote_number.trim()) {
      setError('Quote number is required')
      setLoading(false)
      return
    }

    // Check quote number uniqueness before submit
    const { exists, error: checkError } = await checkQuoteNumberExists(formData.quote_number)
    if (checkError) {
      setError('Error checking quote number uniqueness')
      setLoading(false)
      return
    }
    if (exists) {
      setError(`Quote number "${formData.quote_number}" already exists`)
      setLoading(false)
      return
    }

    const { data, error: createError } = await createQuote({
      opportunity_id: formData.opportunity_id,
      quote_number: formData.quote_number,
      deal_value: formData.deal_value,
      cost: formData.cost,
      margin_percentage: formData.margin_percentage,
      discount_percentage: formData.discount_percentage,
      scope: formData.scope || null,
      valid_until: formData.valid_until || null,
      state: 'draft',
    })

    if (createError) {
      setError(createError.message || 'Failed to create quote')
      setLoading(false)
      return
    }

    router.push(`/quotes/${data?.id}`)
    router.refresh()
  }

  return (
    <Card className="max-w-2xl">
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="opportunity_id">Opportunity *</Label>
            <Select
              value={formData.opportunity_id}
              onValueChange={(value) => setFormData({ ...formData, opportunity_id: value })}
              disabled={loading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select an opportunity" />
              </SelectTrigger>
              <SelectContent>
                {opportunities.map((opp) => (
                  <SelectItem key={opp.id} value={opp.id}>
                    {opp.name} ({opp.state})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="quote_number">Quote Number *</Label>
            <Input
              id="quote_number"
              value={formData.quote_number}
              onChange={(e) => {
                setFormData({ ...formData, quote_number: e.target.value })
                setQuoteNumberError(null)
              }}
              onBlur={handleQuoteNumberBlur}
              required
              disabled={loading || checkingQuoteNumber}
            />
            {checkingQuoteNumber && (
              <p className="text-xs text-muted-foreground">Checking availability...</p>
            )}
            {quoteNumberError && (
              <p className="text-sm text-destructive">{quoteNumberError}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="deal_value">Deal Value ($) *</Label>
            <Input
              id="deal_value"
              type="number"
              step="0.01"
              min="0"
              value={formData.deal_value || ''}
              onChange={(e) => setFormData({ ...formData, deal_value: parseFloat(e.target.value) || 0 })}
              required
              disabled={loading}
            />
          </div>

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

          <div className="flex gap-4">
            <Button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Quote'}
            </Button>
            <Button type="button" variant="ghost" asChild>
              <Link href="/quotes">Cancel</Link>
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

