import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Email validation regex
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

function validatePassword(password: string): { valid: boolean; error?: string } {
  if (!password || password.length === 0) {
    return { valid: false, error: 'Password is required' }
  }
  
  return { valid: true }
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const email = (formData.get('email') as string)?.trim() || ''
    const password = formData.get('password') as string || ''

    // Validate inputs
    const emailValidation = validateEmail(email)
    if (!emailValidation.valid) {
      return NextResponse.redirect(
        new URL(`/login?error=${encodeURIComponent(emailValidation.error!)}`, req.url),
        { status: 302 }
      )
    }

    const passwordValidation = validatePassword(password)
    if (!passwordValidation.valid) {
      return NextResponse.redirect(
        new URL(`/login?error=${encodeURIComponent(passwordValidation.error!)}`, req.url),
        { status: 302 }
      )
    }

    // Store cookies that Supabase sets
    const cookiesToSet: Array<{ name: string; value: string; options?: any }> = []

    // Create Supabase client
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return req.cookies.getAll()
          },
          setAll(cookies: Array<{ name: string; value: string; options?: any }>) {
            // Store cookies to set them on the redirect response
            cookiesToSet.push(...cookies)
          },
        },
      }
    )

    // Check if user is already authenticated
    const { data: { session } } = await supabase.auth.getSession()
    if (session) {
      return NextResponse.redirect(
        new URL('/?error=' + encodeURIComponent('You are already signed in'), req.url),
        { status: 302 }
      )
    }

    // Attempt to sign in
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    })

    if (error || !data.session) {
      // Handle specific error cases
      let errorMessage = error?.message || 'Login failed'

      if (error?.message.includes('Invalid login credentials') ||
          error?.message.includes('Invalid email or password')) {
        errorMessage = 'Invalid email or password. Please check your credentials and try again.'
      } else if (error?.message.includes('Email not confirmed') ||
                 error?.message.includes('email_not_confirmed')) {
        errorMessage = 'Please check your email and click the confirmation link before signing in.'
      } else if (error?.message.includes('User not found')) {
        errorMessage = 'No account found with this email address. Please sign up instead.'
      } else if (error?.message.includes('Too many requests')) {
        errorMessage = 'Too many login attempts. Please wait a few minutes and try again.'
      }

      return NextResponse.redirect(
        new URL(`/login?error=${encodeURIComponent(errorMessage)}`, req.url),
        { status: 302 }
      )
    }

    // Successfully signed in
    // Refresh session to ensure cookies are set
    await supabase.auth.getUser()

    // Create redirect response
    const redirectResponse = NextResponse.redirect(new URL('/', req.url), {
      status: 302,
    })

    // Set all cookies that Supabase set via setAll
    cookiesToSet.forEach(({ name, value, options }) => {
      redirectResponse.cookies.set(name, value, options || {
        path: '/',
        sameSite: 'lax',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 7, // 7 days
      })
    })

    return redirectResponse

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.redirect(
      new URL('/login?error=' + encodeURIComponent('An unexpected error occurred. Please try again.'), req.url),
      { status: 302 }
    )
  }
}
