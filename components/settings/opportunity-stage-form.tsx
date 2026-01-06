'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { updateOpportunityStage } from '@/lib/actions/settings/opportunity-stages'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { toast } from 'sonner'
import Link from 'next/link'

interface OpportunityStage {
  id: string
  stage: string
  display_name: string
  description: string | null
  order_index: number
  is_active: boolean
}

interface OpportunityStageFormProps {
  stage: OpportunityStage
}

export function OpportunityStageForm({ stage }: OpportunityStageFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    display_name: stage.display_name,
    description: stage.description || '',
    order_index: stage.order_index,
    is_active: stage.is_active,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { data, error: updateError } = await updateOpportunityStage(stage.id, formData)
      if (updateError) {
        setError(updateError.message || 'Failed to update opportunity stage')
        toast.error('Failed to update opportunity stage')
        setLoading(false)
        return
      }
      toast.success('Opportunity stage updated successfully!')
      router.push('/settings/opportunity-stages')
      router.refresh()
    } catch (err) {
      setError('An unexpected error occurred')
      toast.error('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="max-w-2xl">
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="stage">Stage (Read-only)</Label>
            <Input
              id="stage"
              value={stage.stage}
              disabled
              className="bg-muted"
            />
            <p className="text-xs text-muted-foreground">
              The stage enum value cannot be changed
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="display_name">Display Name *</Label>
            <Input
              id="display_name"
              value={formData.display_name}
              onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
              required
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

          <div className="space-y-2">
            <Label htmlFor="order_index">Order Index *</Label>
            <Input
              id="order_index"
              type="number"
              value={formData.order_index}
              onChange={(e) => setFormData({ ...formData, order_index: parseInt(e.target.value) || 0 })}
              required
              disabled={loading}
              min="0"
            />
            <p className="text-xs text-muted-foreground">
              Lower numbers appear first
            </p>
          </div>

          {error && (
            <div className="text-sm text-destructive">{error}</div>
          )}

          <div className="flex gap-4">
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Update'} Opportunity Stage
            </Button>
            <Button type="button" variant="ghost" asChild>
              <Link href="/settings/opportunity-stages">Cancel</Link>
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

