'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ROLES } from '@/lib/constants'
import type { UserRole } from '@/lib/types/database'

const MIN_PASSWORD_LENGTH = 6
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function SignupPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [role, setRole] = useState<UserRole>('sales')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})

  // Check for error messages and success in URL
  useEffect(() => {
    const errorParam = searchParams.get('error')
    const successParam = searchParams.get('success')
    const emailParam = searchParams.get('email')

    if (errorParam) {
      setError(decodeURIComponent(errorParam))
    }

    if (successParam === 'true' && emailParam) {
      setSuccess(true)
      setEmail(decodeURIComponent(emailParam))
    }
  }, [searchParams])

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {}

    // Email validation
    if (!email.trim()) {
      errors.email = 'Email is required'
    } else if (!EMAIL_REGEX.test(email.trim())) {
      errors.email = 'Please enter a valid email address'
    }

    // Full name validation
    if (!fullName.trim()) {
      errors.fullName = 'Full name is required'
    } else if (fullName.trim().length < 2) {
      errors.fullName = 'Full name must be at least 2 characters'
    }

    // Password validation
    if (!password) {
      errors.password = 'Password is required'
    } else if (password.length < MIN_PASSWORD_LENGTH) {
      errors.password = `Password must be at least ${MIN_PASSWORD_LENGTH} characters`
    }

    // Confirm password validation
    if (!confirmPassword) {
      errors.confirmPassword = 'Please confirm your password'
    } else if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match'
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)

    // Client-side validation
    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      const formData = new FormData()
      formData.append('email', email.trim())
      formData.append('password', password)
      formData.append('fullName', fullName.trim())
      formData.append('role', role)

      const response = await fetch('/auth/signup', {
        method: 'POST',
        body: formData,
        redirect: 'manual',
        credentials: 'include',
      })

      // Handle redirect response
      if (response.status === 302 || response.status === 307 || response.status === 308) {
        const location = response.headers.get('location')
        if (location) {
          const url = new URL(location, window.location.origin)
          
          // Check for error in redirect URL
          const errorParam = url.searchParams.get('error')
          if (errorParam) {
            setError(decodeURIComponent(errorParam))
            setLoading(false)
            return
          }

          // Check for success (email confirmation required)
          const successParam = url.searchParams.get('success')
          if (successParam === 'true') {
            setSuccess(true)
            setLoading(false)
            return
          }

          // Success - redirecting to home
          if (!url.pathname.includes('/signup')) {
            window.location.href = location
            return
          }
        }
      }

      // Non-redirect response - check for error
      if (!response.ok) {
        const errorText = await response.text()
        setError(errorText || 'Sign up failed. Please try again.')
      } else {
        setError('Unexpected response. Please try again.')
      }
      setLoading(false)

    } catch (err) {
      console.error('Signup error:', err)
      setError('An unexpected error occurred. Please check your connection and try again.')
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    // Clear validation error for this field when user starts typing
    if (validationErrors[field]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }

    // Update the field value
    switch (field) {
      case 'email':
        setEmail(value)
        break
      case 'password':
        setPassword(value)
        // Clear confirm password error if passwords now match
        if (value === confirmPassword && validationErrors.confirmPassword) {
          setValidationErrors(prev => {
            const newErrors = { ...prev }
            delete newErrors.confirmPassword
            return newErrors
          })
        }
        break
      case 'confirmPassword':
        setConfirmPassword(value)
        // Clear confirm password error if passwords now match
        if (value === password && validationErrors.confirmPassword) {
          setValidationErrors(prev => {
            const newErrors = { ...prev }
            delete newErrors.confirmPassword
            return newErrors
          })
        }
        break
      case 'fullName':
        setFullName(value)
        break
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Sign Up</CardTitle>
          <CardDescription>Create a new CRM account</CardDescription>
        </CardHeader>
        <CardContent>
          {success ? (
            <div className="space-y-4">
              <div className="rounded-lg bg-blue-50 dark:bg-blue-950 p-4 border border-blue-200 dark:border-blue-800">
                <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                  Check your email!
                </h3>
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  We've sent a confirmation email to <strong>{email}</strong>.
                </p>
                <p className="text-sm text-blue-700 dark:text-blue-300 mt-2">
                  Please click the link in the email to confirm your account before signing in.
                </p>
              </div>
              <Button
                onClick={() => {
                  setSuccess(false)
                  setEmail('')
                  setPassword('')
                  setConfirmPassword('')
                  setFullName('')
                }}
                variant="outline"
                className="w-full"
              >
                Sign up another account
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSignup} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">
                  Full Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  required
                  disabled={loading}
                  className={validationErrors.fullName ? 'border-destructive' : ''}
                  placeholder="John Doe"
                />
                {validationErrors.fullName && (
                  <p className="text-sm text-destructive">{validationErrors.fullName}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">
                  Email <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  required
                  disabled={loading}
                  className={validationErrors.email ? 'border-destructive' : ''}
                  placeholder="you@example.com"
                />
                {validationErrors.email && (
                  <p className="text-sm text-destructive">{validationErrors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">
                  Role <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={role}
                  onValueChange={(value) => setRole(value as UserRole)}
                  disabled={loading}
                >
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

              <div className="space-y-2">
                <Label htmlFor="password">
                  Password <span className="text-destructive">*</span>
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
                {loading ? 'Creating account...' : 'Sign up'}
              </Button>
            </form>
          )}

          {!success && (
            <div className="mt-4 text-center text-sm">
              <a href="/login" className="text-primary hover:underline">
                Already have an account? Sign in
              </a>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
