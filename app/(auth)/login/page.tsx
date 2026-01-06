'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})
  const [showPassword, setShowPassword] = useState(false)

  // Check for error messages and success in URL
  useEffect(() => {
    const errorParam = searchParams.get('error')
    const successParam = searchParams.get('success')
    
    if (errorParam) {
      setError(decodeURIComponent(errorParam))
    }
    
    if (successParam === 'password_reset') {
      setSuccess('Your password has been reset successfully. Please sign in with your new password.')
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

    // Password validation
    if (!password) {
      errors.password = 'Password is required'
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Client-side validation
    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      const formData = new FormData()
      formData.append('email', email.trim())
      formData.append('password', password)

      const response = await fetch('/auth/login', {
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

          // Success - redirecting to home or intended page
          if (!url.pathname.includes('/login')) {
            window.location.href = location
            return
          }
        }
      }

      // Non-redirect response - check for error
      if (!response.ok) {
        const errorText = await response.text()
        setError(errorText || 'Login failed. Please try again.')
      } else {
        setError('Unexpected response. Please try again.')
      }
      setLoading(false)

    } catch (err) {
      console.error('Login error:', err)
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
    if (field === 'email') {
      setEmail(value)
    } else if (field === 'password') {
      setPassword(value)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Sign In</CardTitle>
          <CardDescription>Sign in to your CRM account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">
                Email <span className="text-destructive">*</span>
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                required
                disabled={loading}
                className={validationErrors.email ? 'border-destructive' : ''}
                placeholder="you@example.com"
                autoComplete="email"
              />
              {validationErrors.email && (
                <p className="text-sm text-destructive">{validationErrors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">
                  Password <span className="text-destructive">*</span>
                </Label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-xs text-muted-foreground hover:text-foreground"
                  tabIndex={-1}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              <Input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                required
                disabled={loading}
                className={validationErrors.password ? 'border-destructive' : ''}
                placeholder="Enter your password"
                autoComplete="current-password"
              />
              {validationErrors.password && (
                <p className="text-sm text-destructive">{validationErrors.password}</p>
              )}
            </div>

            {error && (
              <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3">
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            {success && (
              <div className="rounded-lg bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 p-3">
                <p className="text-sm text-green-800 dark:text-green-200">{success}</p>
              </div>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>

          <div className="mt-4 space-y-2">
            <div className="text-center text-sm">
              <a href="/forgot-password" className="text-primary hover:underline">
                Forgot your password?
              </a>
            </div>
            <div className="text-center text-sm">
              <a href="/signup" className="text-primary hover:underline">
                Don't have an account? Sign up
              </a>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
