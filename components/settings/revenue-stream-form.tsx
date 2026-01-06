'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createRevenueStream, updateRevenueStream } from '@/lib/actions/settings/revenue-streams'
import { getRevenueModels } from '@/lib/actions/settings/revenue-models'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'
import { toast } from 'sonner'
import Link from 'next/link'

interface RevenueStream {
  id: string
  code?: string
  name: string
  revenue_model_id: string | null
  ticket_size?: 'low' | 'mid' | 'high'
  is_active: boolean
}

interface RevenueStreamFormProps {
  revenueStream?: RevenueStream
}

export function RevenueStreamForm({ revenueStream }: RevenueStreamFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [revenueModels, setRevenueModels] = useState<Array<{ id: string; name: string }>>([])
  const [formData, setFormData] = useState({
    code: (revenueStream as any)?.code || '',
    name: revenueStream?.name || '',
    revenue_model_id: revenueStream?.revenue_model_id || '',
    ticket_size: (revenueStream as any)?.ticket_size || 'mid' as 'low' | 'mid' | 'high',
    is_active: revenueStream?.is_active ?? true,
  })

  useEffect(() => {
    // Fetch revenue models for dropdown
    const fetchModels = async () => {
      const { data } = await getRevenueModels()
      if (data) {
        setRevenueModels(data.filter(m => m.is_active))
      }
    }
    fetchModels()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const submitData = {
        code: formData.code || formData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
        name: formData.name,
        revenue_model_id: formData.revenue_model_id || null,
        ticket_size: formData.ticket_size,
        is_active: formData.is_active,
      }

      if (revenueStream) {
        const { data, error: updateError } = await updateRevenueStream(revenueStream.id, submitData)
        if (updateError) {
          setError(updateError.message || 'Failed to update revenue stream')
          toast.error('Failed to update revenue stream')
          setLoading(false)
          return
        }
        toast.success('Revenue stream updated successfully!')
      } else {
        const { data, error: createError } = await createRevenueStream(submitData)
        if (createError) {
          setError(createError.message || 'Failed to create revenue stream')
          toast.error('Failed to create revenue stream')
          setLoading(false)
          return
        }
        toast.success('Revenue stream created successfully!')
      }

      router.push('/settings/revenue-streams')
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
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="revenue_model_id">Revenue Model</Label>
            <Select
              value={formData.revenue_model_id}
              onValueChange={(value) => setFormData({ ...formData, revenue_model_id: value })}
              disabled={loading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a revenue model (optional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">None</SelectItem>
                {revenueModels.map((model) => (
                  <SelectItem key={model.id} value={model.id}>
                    {model.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="code">Code *</Label>
            <Input
              id="code"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              required
              disabled={loading}
              placeholder="e.g., saas-monthly, consulting"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="ticket_size">Ticket Size *</Label>
            <Select
              value={formData.ticket_size}
              onValueChange={(value: 'low' | 'mid' | 'high') => setFormData({ ...formData, ticket_size: value })}
              disabled={loading}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="mid">Mid</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {error && (
            <div className="text-sm text-destructive">{error}</div>
          )}

          <div className="flex gap-4">
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : revenueStream ? 'Update' : 'Create'} Revenue Stream
            </Button>
            <Button type="button" variant="ghost" asChild>
              <Link href="/settings/revenue-streams">Cancel</Link>
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

