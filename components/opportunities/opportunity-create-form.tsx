'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createOpportunity } from '@/lib/actions/opportunities'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'
import type { Account } from '@/lib/types/database'

interface OpportunityCreateFormProps {
  accounts: Account[]
  defaultAccountId?: string
}

export function OpportunityCreateForm({ accounts, defaultAccountId }: OpportunityCreateFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    account_id: defaultAccountId || '',
    name: '',
    description: '',
    deal_value: 0,
    expected_close_date: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (!formData.account_id) {
      setError('Please select an account')
      setLoading(false)
      return
    }

    const { data, error: createError } = await createOpportunity({
      account_id: formData.account_id,
      name: formData.name,
      description: formData.description || null,
      deal_value: formData.deal_value,
      expected_close_date: formData.expected_close_date || null,
      state: 'lead',
    })

    if (createError) {
      setError(createError.message || 'Failed to create opportunity')
      setLoading(false)
      return
    }

    router.push(`/opportunities/${data?.id}`)
    router.refresh()
  }

  return (
    <Card className="max-w-2xl">
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="account_id">Account *</Label>
            <Select
              value={formData.account_id}
              onValueChange={(value) => setFormData({ ...formData, account_id: value })}
              disabled={loading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select an account" />
              </SelectTrigger>
              <SelectContent>
                {accounts.map((account) => (
                  <SelectItem key={account.id} value={account.id}>
                    {account.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

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
              value={formData.deal_value || ''}
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

          <div className="flex gap-4">
            <Button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Opportunity'}
            </Button>
            <Button type="button" variant="ghost" asChild>
              <Link href="/opportunities">Cancel</Link>
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

