import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import type { EmailOtpType } from '@supabase/supabase-js'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const token_hash = requestUrl.searchParams.get('token_hash')
  const type = requestUrl.searchParams.get('type') as EmailOtpType | null
  const next = requestUrl.searchParams.get('next') || '/'
  const error = requestUrl.searchParams.get('error')

  // Handle error parameter from Supabase
  if (error) {
    return NextResponse.redirect(
      new URL(`/login?error=${encodeURIComponent(error)}`, request.url)
    )
  }

  // Validate required parameters
  if (!token_hash || !type) {
    return NextResponse.redirect(
      new URL('/login?error=' + encodeURIComponent('Missing verification parameters. Please use the link from your email.'), request.url)
    )
  }

  const supabase = await createClient()

  // Check if user is already authenticated
  const { data: { user: existingUser } } = await supabase.auth.getUser()
  
  // Verify the OTP token
  const { data, error: verifyError } = await supabase.auth.verifyOtp({
    type,
    token_hash,
  })

  if (verifyError) {
    // Handle specific error cases
    let errorMessage = verifyError.message

    if (verifyError.message.includes('expired') || verifyError.message.includes('invalid')) {
      errorMessage = 'This verification link has expired or is invalid. Please request a new one.'
    } else if (verifyError.message.includes('already')) {
      errorMessage = 'This link has already been used. Please sign in instead.'
    }

    return NextResponse.redirect(
      new URL(`/login?error=${encodeURIComponent(errorMessage)}`, request.url)
    )
  }

  if (!data.user) {
    return NextResponse.redirect(
      new URL('/login?error=' + encodeURIComponent('Verification failed. Please try again.'), request.url)
    )
  }

  // Successfully verified
  // Check if this is an invite - user needs to set password
  if (type === 'invite') {
    // Redirect to password setup page with the token (in case session expires)
    const passwordSetupUrl = new URL('/auth/setup-password', request.url)
    passwordSetupUrl.searchParams.set('token_hash', token_hash)
    passwordSetupUrl.searchParams.set('type', type)
    return NextResponse.redirect(passwordSetupUrl)
  }

  // For email confirmation and other types, redirect to intended page
  // Ensure next is a safe path (prevent open redirect)
  const safeNext = next.startsWith('/') && !next.startsWith('//') ? next : '/'
  return NextResponse.redirect(new URL(safeNext, request.url))
}
