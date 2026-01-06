'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createApprovalThreshold, updateApprovalThreshold } from '@/lib/actions/settings/approval-thresholds'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import Link from 'next/link'

interface ApprovalThreshold {
  id: string
  approval_role: 'finance' | 'executive'
  min_deal_value: number
  max_deal_value: number | null
}

interface ApprovalThresholdFormProps {
  threshold?: ApprovalThreshold
}

export function ApprovalThresholdForm({ threshold }: ApprovalThresholdFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    approval_role: (threshold?.approval_role || 'finance') as 'finance' | 'executive',
    min_deal_value: threshold?.min_deal_value || 0,
    max_deal_value: threshold?.max_deal_value || undefined,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const submitData = {
        approval_role: formData.approval_role,
        min_deal_value: formData.min_deal_value,
        max_deal_value: formData.max_deal_value || null,
      }

      if (threshold) {
        const { data, error: updateError } = await updateApprovalThreshold(threshold.id, submitData)
        if (updateError) {
          setError(updateError.message || 'Failed to update approval threshold')
          toast.error('Failed to update approval threshold')
          setLoading(false)
          return
        }
        toast.success('Approval threshold updated successfully!')
      } else {
        const { data, error: createError } = await createApprovalThreshold(submitData)
        if (createError) {
          setError(createError.message || 'Failed to create approval threshold')
          toast.error('Failed to create approval threshold')
          setLoading(false)
          return
        }
        toast.success('Approval threshold created successfully!')
      }

      router.push('/settings/approval-thresholds')
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
            <Label htmlFor="approval_role">Approval Role *</Label>
            <Select
              value={formData.approval_role}
              onValueChange={(value: 'finance' | 'executive') => setFormData({ ...formData, approval_role: value })}
              disabled={loading}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="finance">Finance</SelectItem>
                <SelectItem value="executive">Executive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="min_deal_value">Min Deal Value ($) *</Label>
            <Input
              id="min_deal_value"
              type="number"
              step="0.01"
              min="0"
              value={formData.min_deal_value || ''}
              onChange={(e) => setFormData({ ...formData, min_deal_value: parseFloat(e.target.value) || 0 })}
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="max_deal_value">Max Deal Value ($)</Label>
            <Input
              id="max_deal_value"
              type="number"
              step="0.01"
              min="0"
              value={formData.max_deal_value || ''}
              onChange={(e) => setFormData({ ...formData, max_deal_value: e.target.value ? parseFloat(e.target.value) : undefined })}
              disabled={loading}
              placeholder="Leave empty for no limit"
            />
            <p className="text-xs text-muted-foreground">
              Leave empty to set no maximum limit
            </p>
          </div>

          {error && (
            <div className="text-sm text-destructive">{error}</div>
          )}

          <div className="flex gap-4">
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : threshold ? 'Update' : 'Create'} Approval Threshold
            </Button>
            <Button type="button" variant="ghost" asChild>
              <Link href="/settings/approval-thresholds">Cancel</Link>
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

