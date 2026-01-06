'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type { EmailOtpType } from '@supabase/supabase-js'

export default function SetupPasswordPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [verifying, setVerifying] = useState(true)

  useEffect(() => {
    const verifyToken = async () => {
      const supabase = createClient()
      const token_hash = searchParams.get('token_hash')
      const type = searchParams.get('type') as EmailOtpType | null

      // Check if user is already authenticated
      const { data: { session } } = await supabase.auth.getSession()
      
      if (session?.user) {
        // User is authenticated - check if they already have a password
        // If they do, redirect to home (they shouldn't be here)
        // We can't directly check if password exists, but if they're authenticated
        // and on this page, they likely need to set password
        setVerifying(false)
        return
      }

      // If no session, we need token parameters
      if (!token_hash || !type) {
        setError('Invalid invitation link. Please use the link from your invitation email.')
        setVerifying(false)
        return
      }

      // Verify the token to create a session
      const { error: verifyError } = await supabase.auth.verifyOtp({
        type,
        token_hash,
      })

      if (verifyError) {
        setError('Invalid or expired invitation link. Please request a new invitation.')
        setVerifying(false)
        return
      }

      setVerifying(false)
    }

    verifyToken()
  }, [searchParams])

  const handleSetupPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setLoading(true)

    const supabase = createClient()
    
    // Ensure user is authenticated (session should exist from useEffect verification)
    const { data: sessionData } = await supabase.auth.getSession()
    
    if (!sessionData.session) {
      // If no session, try to verify token from URL
      const token_hash = searchParams.get('token_hash')
      const type = searchParams.get('type') as EmailOtpType | null

      if (!token_hash || !type) {
        setError('Session expired. Please use the invitation link from your email again.')
        setLoading(false)
        return
      }

      const { data: verifyData, error: verifyError } = await supabase.auth.verifyOtp({
        type,
        token_hash,
      })

      if (verifyError || !verifyData.user) {
        setError('Invalid or expired invitation link. Please request a new invitation.')
        setLoading(false)
        return
      }
    }

    // Update the user's password
    const { error: updateError } = await supabase.auth.updateUser({
      password: password,
    })

    if (updateError) {
      // Check if password already exists (user might have set it already)
      if (updateError.message.includes('same') || updateError.message.includes('already')) {
        setError('Password is already set. Please sign in instead.')
        setTimeout(() => router.push('/login'), 2000)
      } else {
        setError(updateError.message || 'Failed to set password. Please try again.')
      }
      setLoading(false)
      return
    }

    // Password set successfully, redirect to home
    router.push('/')
    router.refresh()
  }

  if (verifying) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <p className="text-center">Verifying invitation...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Set Your Password</CardTitle>
          <CardDescription>Create a password for your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSetupPassword} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                disabled={loading}
                placeholder="Enter your password"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
                disabled={loading}
                placeholder="Confirm your password"
              />
            </div>
            {error && (
              <div className="text-sm text-destructive">{error}</div>
            )}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Setting up password...' : 'Set Password'}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            <a href="/login" className="text-primary hover:underline">
              Already have a password? Sign in
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

