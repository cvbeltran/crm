'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type { EmailOtpType } from '@supabase/supabase-js'

const MIN_PASSWORD_LENGTH = 6

export default function ResetPasswordConfirmPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [verifying, setVerifying] = useState(true)
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    const verifyToken = async () => {
      const supabase = createClient()
      const token_hash = searchParams.get('token_hash')
      const type = searchParams.get('type') as EmailOtpType | null

      // Check if user is already authenticated
      const { data: { session } } = await supabase.auth.getSession()
      
      if (session?.user) {
        setVerifying(false)
        return
      }

      // If no session, we need token parameters
      if (!token_hash || !type) {
        setError('Invalid password reset link. Please request a new password reset.')
        setVerifying(false)
        return
      }

      // Verify the token to create a session
      const { error: verifyError } = await supabase.auth.verifyOtp({
        type,
        token_hash,
      })

      if (verifyError) {
        setError('Invalid or expired password reset link. Please request a new one.')
        setVerifying(false)
        return
      }

      setVerifying(false)
    }

    verifyToken()
  }, [searchParams])

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {}

    if (!password) {
      errors.password = 'Password is required'
    } else if (password.length < MIN_PASSWORD_LENGTH) {
      errors.password = `Password must be at least ${MIN_PASSWORD_LENGTH} characters`
    }

    if (!confirmPassword) {
      errors.confirmPassword = 'Please confirm your password'
    } else if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match'
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!validateForm()) {
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
        setError('Session expired. Please request a new password reset.')
        setLoading(false)
        return
      }

      const { data: verifyData, error: verifyError } = await supabase.auth.verifyOtp({
        type,
        token_hash,
      })

      if (verifyError || !verifyData.user) {
        setError('Invalid or expired password reset link. Please request a new one.')
        setLoading(false)
        return
      }
    }

    // Update the user's password
    const { error: updateError } = await supabase.auth.updateUser({
      password: password,
    })

    if (updateError) {
      setError(updateError.message || 'Failed to reset password. Please try again.')
      setLoading(false)
      return
    }

    // Password reset successfully, redirect to login
    router.push('/login?success=password_reset')
  }

  const handleInputChange = (field: string, value: string) => {
    if (validationErrors[field]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }

    if (field === 'password') {
      setPassword(value)
      if (value === confirmPassword && validationErrors.confirmPassword) {
        setValidationErrors(prev => {
          const newErrors = { ...prev }
          delete newErrors.confirmPassword
          return newErrors
        })
      }
    } else if (field === 'confirmPassword') {
      setConfirmPassword(value)
      if (value === password && validationErrors.confirmPassword) {
        setValidationErrors(prev => {
          const newErrors = { ...prev }
          delete newErrors.confirmPassword
          return newErrors
        })
      }
    }
  }

  if (verifying) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <p className="text-center">Verifying password reset link...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Reset Your Password</CardTitle>
          <CardDescription>Enter your new password</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">
                New Password <span className="text-destructive">*</span>
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                required
                minLength={MIN_PASSWORD_LENGTH}
                disabled={loading}
                className={validationErrors.password ? 'border-destructive' : ''}
                placeholder={`At least ${MIN_PASSWORD_LENGTH} characters`}
              />
              {validationErrors.password && (
                <p className="text-sm text-destructive">{validationErrors.password}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">
                Confirm Password <span className="text-destructive">*</span>
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                required
                minLength={MIN_PASSWORD_LENGTH}
                disabled={loading}
                className={validationErrors.confirmPassword ? 'border-destructive' : ''}
                placeholder="Confirm your password"
              />
              {validationErrors.confirmPassword && (
                <p className="text-sm text-destructive">{validationErrors.confirmPassword}</p>
              )}
            </div>
            {error && (
              <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3">
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Resetting password...' : 'Reset Password'}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            <a href="/login" className="text-primary hover:underline">
              Back to sign in
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

