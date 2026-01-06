'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createUser } from '@/lib/actions/users'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ROLES } from '@/lib/constants'
import type { UserRole } from '@/lib/types/database'

export function UserCreateForm() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [role, setRole] = useState<UserRole>('sales')
  const [emailConfirm, setEmailConfirm] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)
    setLoading(true)

    const result = await createUser({
      email,
      password,
      full_name: fullName || undefined,
      role,
      email_confirm: emailConfirm,
    })

    if (result.error) {
      setError(result.error.message)
      setLoading(false)
      return
    }

    if (result.data?.user) {
      setSuccess(true)
      setLoading(false)
      // Reset form
      setEmail('')
      setPassword('')
      setFullName('')
      setRole('sales')
      
      // Optionally redirect after a delay
      setTimeout(() => {
        router.push('/users')
        router.refresh()
      }, 2000)
    }
  }

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle>Create User</CardTitle>
        <CardDescription>
          Create a new user account. The user will be able to sign in immediately with the provided credentials.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              placeholder="user@example.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password *</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              disabled={loading}
              placeholder="Minimum 6 characters"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              disabled={loading}
              placeholder="John Doe"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Role *</Label>
            <Select value={role} onValueChange={(value) => setRole(value as UserRole)} disabled={loading}>
              <SelectTrigger>
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ROLES.EXECUTIVE}>Executive</SelectItem>
                <SelectItem value={ROLES.SALES}>Sales</SelectItem>
                <SelectItem value={ROLES.FINANCE}>Finance</SelectItem>
                <SelectItem value={ROLES.OPERATIONS}>Operations</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="emailConfirm"
              checked={emailConfirm}
              onChange={(e) => setEmailConfirm(e.target.checked)}
              disabled={loading}
              className="rounded border-gray-300"
            />
            <Label htmlFor="emailConfirm" className="font-normal cursor-pointer">
              Auto-confirm email (user can sign in immediately)
            </Label>
          </div>

          {error && (
            <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
              {error}
            </div>
          )}

          {success && (
            <div className="text-sm text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950 p-3 rounded-md">
              User created successfully! Redirecting...
            </div>
          )}

          <div className="flex gap-2">
            <Button type="submit" disabled={loading}>
              {loading ? 'Creating user...' : 'Create User'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={loading}
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

