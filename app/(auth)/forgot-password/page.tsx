'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function ForgotPasswordPage() {
  const searchParams = useSearchParams()
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    const errorParam = searchParams.get('error')
    const successParam = searchParams.get('success')

    if (errorParam) {
      setError(decodeURIComponent(errorParam))
    }

    if (successParam === 'true') {
      setSuccess(true)
    }
  }, [searchParams])

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {}

    if (!email.trim()) {
      errors.email = 'Email is required'
    } else if (!EMAIL_REGEX.test(email.trim())) {
      errors.email = 'Please enter a valid email address'
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)

    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      const formData = new FormData()
      formData.append('email', email.trim())

      const response = await fetch('/auth/reset-password', {
        method: 'POST',
        body: formData,
        redirect: 'manual',
      })

      if (response.status === 302 || response.status === 307 || response.status === 308) {
        const location = response.headers.get('location')
        if (location) {
          const url = new URL(location, window.location.origin)
          const errorParam = url.searchParams.get('error')
          const successParam = url.searchParams.get('success')

          if (errorParam) {
            setError(decodeURIComponent(errorParam))
            setLoading(false)
            return
          }

          if (successParam === 'true') {
            setSuccess(true)
            setLoading(false)
            return
          }

          window.location.href = location
          return
        }
      }

      setError('An unexpected error occurred. Please try again.')
      setLoading(false)

    } catch (err) {
      console.error('Password reset request error:', err)
      setError('An unexpected error occurred. Please check your connection and try again.')
      setLoading(false)
    }
  }

  const handleInputChange = (value: string) => {
    if (validationErrors.email) {
      setValidationErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors.email
        return newErrors
      })
    }
    setEmail(value)
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Forgot Password</CardTitle>
          <CardDescription>Enter your email to receive a password reset link</CardDescription>
        </CardHeader>
        <CardContent>
          {success ? (
            <div className="space-y-4">
              <div className="rounded-lg bg-blue-50 dark:bg-blue-950 p-4 border border-blue-200 dark:border-blue-800">
                <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                  Check your email!
                </h3>
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  If an account exists with <strong>{email}</strong>, we've sent a password reset link.
                </p>
                <p className="text-sm text-blue-700 dark:text-blue-300 mt-2">
                  Please check your inbox and click the link to reset your password.
                </p>
              </div>
              <Button
                onClick={() => {
                  setSuccess(false)
                  setEmail('')
                }}
                variant="outline"
                className="w-full"
              >
                Send another email
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">
                  Email <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => handleInputChange(e.target.value)}
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

              {error && (
                <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3">
                  <p className="text-sm text-destructive">{error}</p>
                </div>
              )}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Sending...' : 'Send Reset Link'}
              </Button>
            </form>
          )}

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

