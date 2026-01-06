'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createICPCategory, updateICPCategory } from '@/lib/actions/settings/icp-categories'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { toast } from 'sonner'
import Link from 'next/link'

interface ICPCategory {
  id: string
  code?: string
  name: string
  description: string | null
  is_active: boolean
}

interface ICPCategoryFormProps {
  icpCategory?: ICPCategory
}

export function ICPCategoryForm({ icpCategory }: ICPCategoryFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    code: (icpCategory as any)?.code || '',
    name: icpCategory?.name || '',
    description: icpCategory?.description || '',
    is_active: icpCategory?.is_active ?? true,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      if (icpCategory) {
        const { data, error: updateError } = await updateICPCategory(icpCategory.id, formData)
        if (updateError) {
          setError(updateError.message || 'Failed to update ICP category')
          toast.error('Failed to update ICP category')
          setLoading(false)
          return
        }
        toast.success('ICP category updated successfully!')
      } else {
        const { data, error: createError } = await createICPCategory(formData)
        if (createError) {
          setError(createError.message || 'Failed to create ICP category')
          toast.error('Failed to create ICP category')
          setLoading(false)
          return
        }
        toast.success('ICP category created successfully!')
      }

      router.push('/settings/icp-categories')
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
            <Label htmlFor="code">Code *</Label>
            <Input
              id="code"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              required
              disabled={loading}
              placeholder="e.g., enterprise, smb"
            />
          </div>

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
              {loading ? 'Saving...' : icpCategory ? 'Update' : 'Create'} ICP Category
            </Button>
            <Button type="button" variant="ghost" asChild>
              <Link href="/settings/icp-categories">Cancel</Link>
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

