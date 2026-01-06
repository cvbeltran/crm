'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { updateProfile } from '@/lib/actions/profile'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import type { UserProfile } from '@/lib/types/database'

interface ProfileFormProps {
  profile: UserProfile
}

export function ProfileForm({ profile }: ProfileFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    full_name: profile.full_name || '',
    email: profile.email,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { data, error: updateError } = await updateProfile({
      full_name: formData.full_name || null,
      email: formData.email,
    })

    if (updateError) {
      setError(updateError.message || 'Failed to update profile')
      toast.error('Failed to update profile', {
        description: updateError.message || 'An error occurred',
      })
      setLoading(false)
      return
    }

    toast.success('Profile updated successfully!')
    router.refresh()
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="full_name">Full Name</Label>
        <Input
          id="full_name"
          value={formData.full_name}
          onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
          disabled={loading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email *</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
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

