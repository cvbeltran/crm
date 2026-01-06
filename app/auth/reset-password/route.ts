import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validateEmail(email: string): { valid: boolean; error?: string } {
  if (!email || email.trim().length === 0) {
    return { valid: false, error: 'Email is required' }
  }
  
  if (!EMAIL_REGEX.test(email.trim())) {
    return { valid: false, error: 'Please enter a valid email address' }
  }
  
  return { valid: true }
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const email = (formData.get('email') as string)?.trim() || ''

    // Validate email
    const emailValidation = validateEmail(email)
    if (!emailValidation.valid) {
      return NextResponse.redirect(
        new URL(`/auth/forgot-password?error=${encodeURIComponent(emailValidation.error!)}`, req.url),
        { status: 302 }
      )
    }

    // Create Supabase client
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return req.cookies.getAll()
          },
          setAll() {
            // Not needed for password reset
          },
        },
      }
    )

    // Send password reset email
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${req.nextUrl.origin}/auth/reset-password/confirm`,
    })

    if (error) {
      // Don't reveal if email exists or not (security best practice)
      // Always show success message
      return NextResponse.redirect(
        new URL('/auth/forgot-password?success=true', req.url),
        { status: 302 }
      )
    }

    // Success
    return NextResponse.redirect(
      new URL('/auth/forgot-password?success=true', req.url),
      { status: 302 }
    )

  } catch (error) {
    console.error('Password reset error:', error)
    // Don't reveal error details
    return NextResponse.redirect(
      new URL('/auth/forgot-password?success=true', req.url),
      { status: 302 }
    )
  }
}

