import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import type { UserRole } from '@/lib/types/database'

// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Password validation
const MIN_PASSWORD_LENGTH = 6

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
  
  if (password.length < MIN_PASSWORD_LENGTH) {
    return { valid: false, error: `Password must be at least ${MIN_PASSWORD_LENGTH} characters long` }
  }
  
  return { valid: true }
}

function validateFullName(fullName: string): { valid: boolean; error?: string } {
  if (!fullName || fullName.trim().length === 0) {
    return { valid: false, error: 'Full name is required' }
  }
  
  if (fullName.trim().length < 2) {
    return { valid: false, error: 'Full name must be at least 2 characters long' }
  }
  
  return { valid: true }
}

function validateRole(role: string): { valid: boolean; error?: string; role?: UserRole } {
  const validRoles: UserRole[] = ['executive', 'sales', 'finance', 'operations']
  
  if (!role || !validRoles.includes(role as UserRole)) {
    return { valid: false, error: 'Please select a valid role' }
  }
  
  return { valid: true, role: role as UserRole }
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const email = (formData.get('email') as string)?.trim() || ''
    const password = formData.get('password') as string || ''
    const fullName = (formData.get('fullName') as string)?.trim() || ''
    const role = (formData.get('role') as string) || 'sales'

    // Validate all inputs
    const emailValidation = validateEmail(email)
    if (!emailValidation.valid) {
      return NextResponse.redirect(
        new URL(`/signup?error=${encodeURIComponent(emailValidation.error!)}`, req.url),
        { status: 302 }
      )
    }

    const passwordValidation = validatePassword(password)
    if (!passwordValidation.valid) {
      return NextResponse.redirect(
        new URL(`/signup?error=${encodeURIComponent(passwordValidation.error!)}`, req.url),
        { status: 302 }
      )
    }

    const fullNameValidation = validateFullName(fullName)
    if (!fullNameValidation.valid) {
      return NextResponse.redirect(
        new URL(`/signup?error=${encodeURIComponent(fullNameValidation.error!)}`, req.url),
        { status: 302 }
      )
    }

    const roleValidation = validateRole(role)
    if (!roleValidation.valid) {
      return NextResponse.redirect(
        new URL(`/signup?error=${encodeURIComponent(roleValidation.error!)}`, req.url),
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

    // Attempt to sign up
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: {
          full_name: fullName.trim(),
          role: roleValidation.role,
        },
        emailRedirectTo: `${req.nextUrl.origin}/auth/callback?next=/`,
      },
    })

    if (error) {
      // Handle specific error cases
      let errorMessage = error.message

      if (error.message.includes('already registered') || 
          error.message.includes('already exists') ||
          error.message.includes('User already registered')) {
        errorMessage = 'An account with this email already exists. Please sign in instead.'
      } else if (error.message.includes('Invalid email')) {
        errorMessage = 'Please enter a valid email address.'
      } else if (error.message.includes('Password')) {
        errorMessage = 'Password does not meet requirements. Please use a stronger password.'
      }

      return NextResponse.redirect(
        new URL(`/signup?error=${encodeURIComponent(errorMessage)}`, req.url),
        { status: 302 }
      )
    }

    // Check if email confirmation is required
    if (!data.user || !data.session) {
      // Email confirmation required
      return NextResponse.redirect(
        new URL(`/signup?success=true&email=${encodeURIComponent(email)}`, req.url),
        { status: 302 }
      )
    }

    // User is automatically signed in (email confirmation disabled)
    // Refresh session to ensure cookies are set
    await supabase.auth.getUser()

    // Create redirect response
    const redirectResponse = NextResponse.redirect(new URL('/', req.url), { status: 302 })
    
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
    console.error('Signup error:', error)
    return NextResponse.redirect(
      new URL('/signup?error=' + encodeURIComponent('An unexpected error occurred. Please try again.'), req.url),
      { status: 302 }
    )
  }
}
