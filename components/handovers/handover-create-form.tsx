'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createHandover } from '@/lib/actions/handovers'
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
  deal_value: number
  state: string
}

interface Quote {
  id: string
  quote_number: string
  opportunity_id: string
  deal_value: number
}

interface HandoverCreateFormProps {
  opportunities: Opportunity[]
  quotes: Quote[]
  defaultOpportunityId?: string
}

export function HandoverCreateForm({ 
  opportunities, 
  quotes, 
  defaultOpportunityId 
}: HandoverCreateFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedOpportunity, setSelectedOpportunity] = useState(defaultOpportunityId || '')
  const [formData, setFormData] = useState({
    opportunity_id: defaultOpportunityId || '',
    quote_id: '',
    deal_value: 0,
    scope: '',
    expected_start_date: '',
    expected_end_date: '',
  })

  // Filter quotes based on selected opportunity
  const filteredQuotes = selectedOpportunity
    ? quotes.filter(q => q.opportunity_id === selectedOpportunity)
    : []

  // Update deal value when opportunity or quote is selected
  const handleOpportunityChange = (opportunityId: string) => {
    setSelectedOpportunity(opportunityId)
    const opp = opportunities.find(o => o.id === opportunityId)
    setFormData({
      ...formData,
      opportunity_id: opportunityId,
      deal_value: opp ? Number(opp.deal_value) : 0,
      quote_id: '', // Reset quote when opportunity changes
    })
  }

  const handleQuoteChange = (quoteId: string) => {
    const quote = quotes.find(q => q.id === quoteId)
    setFormData({
      ...formData,
      quote_id: quoteId,
      deal_value: quote ? Number(quote.deal_value) : formData.deal_value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (!formData.opportunity_id) {
      setError('Please select an opportunity')
      setLoading(false)
      return
    }

    const { data, error: createError } = await createHandover({
      opportunity_id: formData.opportunity_id,
      quote_id: formData.quote_id || null,
      deal_value: formData.deal_value,
      scope: formData.scope || null,
      expected_start_date: formData.expected_start_date || null,
      expected_end_date: formData.expected_end_date || null,
      state: 'pending',
    })

    if (createError) {
      setError(createError.message || 'Failed to create handover')
      setLoading(false)
      return
    }

    router.push(`/handovers/${data?.id}`)
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
              onValueChange={handleOpportunityChange}
              disabled={loading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select an opportunity" />
              </SelectTrigger>
              <SelectContent>
                {opportunities.map((opp) => (
                  <SelectItem key={opp.id} value={opp.id}>
                    {opp.name} (${Number(opp.deal_value).toLocaleString()}) - {opp.state}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedOpportunity && filteredQuotes.length > 0 && (
            <div className="space-y-2">
              <Label htmlFor="quote_id">Quote (Optional)</Label>
              <Select
                value={formData.quote_id}
                onValueChange={handleQuoteChange}
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a quote (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">None</SelectItem>
                  {filteredQuotes.map((quote) => (
                    <SelectItem key={quote.id} value={quote.id}>
                      {quote.quote_number} (${Number(quote.deal_value).toLocaleString()})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

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

          <div className="flex gap-4">
            <Button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Handover'}
            </Button>
            <Button type="button" variant="ghost" asChild>
              <Link href="/handovers">Cancel</Link>
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

