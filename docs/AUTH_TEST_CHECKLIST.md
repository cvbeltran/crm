# Authentication Test Checklist

This document provides a comprehensive test checklist for the rebuilt authentication system.

## ✅ Sign Up Workflow

### Basic Sign Up
- [ ] Navigate to `/signup`
- [ ] Fill in all required fields (Full Name, Email, Role, Password, Confirm Password)
- [ ] Submit form with valid data
- [ ] Verify success message appears if email confirmation is required
- [ ] Verify redirect to home page if email confirmation is disabled
- [ ] Check that user profile is created in database

### Sign Up Validation - Client Side
- [ ] Try submitting with empty email → Should show "Email is required"
- [ ] Try submitting with invalid email format → Should show "Please enter a valid email address"
- [ ] Try submitting with empty full name → Should show "Full name is required"
- [ ] Try submitting with full name < 2 characters → Should show "Full name must be at least 2 characters"
- [ ] Try submitting with empty password → Should show "Password is required"
- [ ] Try submitting with password < 6 characters → Should show "Password must be at least 6 characters"
- [ ] Try submitting with mismatched passwords → Should show "Passwords do not match"
- [ ] Verify validation errors clear when user starts typing

### Sign Up Edge Cases
- [ ] Try signing up with existing email → Should show "An account with this email already exists"
- [ ] Try signing up when already authenticated → Should redirect to home with error
- [ ] Test with network disconnected → Should show connection error
- [ ] Test with very long email/password → Should handle gracefully
- [ ] Test with special characters in email/password → Should work correctly

### Email Confirmation Flow
- [ ] Sign up with email confirmation enabled
- [ ] Check email inbox for confirmation email
- [ ] Click confirmation link
- [ ] Verify redirect to home page
- [ ] Verify user can now sign in

## ✅ Sign In Workflow

### Basic Sign In
- [ ] Navigate to `/login`
- [ ] Enter valid email and password
- [ ] Submit form
- [ ] Verify redirect to home page
- [ ] Verify user is authenticated

### Sign In Validation - Client Side
- [ ] Try submitting with empty email → Should show "Email is required"
- [ ] Try submitting with invalid email format → Should show "Please enter a valid email address"
- [ ] Try submitting with empty password → Should show "Password is required"
- [ ] Verify validation errors clear when user starts typing
- [ ] Test password visibility toggle (Show/Hide)

### Sign In Edge Cases
- [ ] Try signing in with incorrect password → Should show "Invalid email or password"
- [ ] Try signing in with non-existent email → Should show "Invalid email or password"
- [ ] Try signing in with unconfirmed email → Should show email confirmation message
- [ ] Try signing in when already authenticated → Should redirect to home
- [ ] Test with network disconnected → Should show connection error
- [ ] Test "Too many requests" scenario → Should show appropriate message

### Session Management
- [ ] Sign in and verify session persists on page refresh
- [ ] Sign in and verify session persists after navigating pages
- [ ] Sign out and verify session is cleared
- [ ] Try accessing protected route after sign out → Should redirect to login

## ✅ Password Reset Workflow

### Request Password Reset
- [ ] Navigate to `/forgot-password`
- [ ] Enter valid email address
- [ ] Submit form
- [ ] Verify success message appears (regardless of whether email exists)
- [ ] Check email inbox for reset link

### Reset Password Validation
- [ ] Try submitting with empty email → Should show "Email is required"
- [ ] Try submitting with invalid email → Should show "Please enter a valid email address"

### Confirm Password Reset
- [ ] Click password reset link from email
- [ ] Verify redirect to `/auth/reset-password/confirm`
- [ ] Enter new password and confirm password
- [ ] Submit form
- [ ] Verify redirect to login with success message
- [ ] Sign in with new password → Should work

### Password Reset Edge Cases
- [ ] Try using expired reset link → Should show error message
- [ ] Try using invalid reset link → Should show error message
- [ ] Try resetting with mismatched passwords → Should show validation error
- [ ] Try resetting with password < 6 characters → Should show validation error

## ✅ Email Invitation Flow

### Invited User Setup
- [ ] Receive invitation email (from Supabase dashboard)
- [ ] Click invitation link
- [ ] Verify redirect to `/auth/setup-password`
- [ ] Enter password and confirm password
- [ ] Submit form
- [ ] Verify redirect to home page
- [ ] Verify user can sign in with new password

### Invitation Edge Cases
- [ ] Try using expired invitation link → Should show error
- [ ] Try accessing setup-password without token → Should show error
- [ ] Try setting password when already authenticated → Should work correctly

## ✅ Auth Callback Route

### Email Confirmation Callback
- [ ] Click email confirmation link
- [ ] Verify redirect to `/auth/callback`
- [ ] Verify redirect to home page after verification
- [ ] Verify user is authenticated

### Invitation Callback
- [ ] Click invitation link
- [ ] Verify redirect to `/auth/callback`
- [ ] Verify redirect to `/auth/setup-password`
- [ ] Verify token is preserved in URL

### Callback Edge Cases
- [ ] Try accessing callback without token_hash → Should redirect to login with error
- [ ] Try accessing callback without type → Should redirect to login with error
- [ ] Try using expired token → Should redirect to login with error
- [ ] Try using invalid token → Should redirect to login with error

## ✅ Middleware Protection

### Protected Routes
- [ ] Try accessing `/` without authentication → Should redirect to `/login`
- [ ] Try accessing `/accounts` without authentication → Should redirect to `/login`
- [ ] Try accessing `/opportunities` without authentication → Should redirect to `/login`
- [ ] Verify `next` parameter is preserved in redirect URL

### Public Routes
- [ ] Access `/login` without authentication → Should work
- [ ] Access `/signup` without authentication → Should work
- [ ] Access `/forgot-password` without authentication → Should work
- [ ] Access `/auth/callback` without authentication → Should work
- [ ] Access `/auth/setup-password` without authentication → Should work

### Authenticated User Access
- [ ] Try accessing `/login` when authenticated → Should redirect to home
- [ ] Try accessing `/signup` when authenticated → Should redirect to home

## ✅ UI/UX Testing

### Form Interactions
- [ ] Verify all form fields are properly labeled
- [ ] Verify required fields are marked with asterisk
- [ ] Verify loading states during form submission
- [ ] Verify disabled states during form submission
- [ ] Verify error messages are clearly displayed
- [ ] Verify success messages are clearly displayed
- [ ] Verify form resets after successful submission (where applicable)

### Navigation
- [ ] Verify "Sign up" link on login page works
- [ ] Verify "Sign in" link on signup page works
- [ ] Verify "Forgot password" link on login page works
- [ ] Verify "Back to sign in" links work correctly

### Responsive Design
- [ ] Test on mobile device (< 640px)
- [ ] Test on tablet (640px - 1024px)
- [ ] Test on desktop (> 1024px)
- [ ] Verify forms are usable on all screen sizes

### Accessibility
- [ ] Verify keyboard navigation works
- [ ] Verify screen reader compatibility
- [ ] Verify proper focus management
- [ ] Verify color contrast meets WCAG standards

## ✅ Security Testing

### Input Sanitization
- [ ] Test with SQL injection attempts → Should be sanitized
- [ ] Test with XSS attempts → Should be sanitized
- [ ] Test with script tags → Should be sanitized

### Session Security
- [ ] Verify cookies are httpOnly
- [ ] Verify cookies are secure in production
- [ ] Verify session expires appropriately
- [ ] Verify CSRF protection (if implemented)

### Rate Limiting
- [ ] Test multiple rapid sign up attempts
- [ ] Test multiple rapid sign in attempts
- [ ] Test multiple rapid password reset requests
- [ ] Verify appropriate rate limiting messages

## ✅ Error Handling

### Network Errors
- [ ] Disconnect network and try to sign up → Should show connection error
- [ ] Disconnect network and try to sign in → Should show connection error
- [ ] Disconnect network and try password reset → Should show connection error

### Server Errors
- [ ] Simulate 500 error → Should show user-friendly error
- [ ] Simulate timeout → Should show user-friendly error

### Edge Cases
- [ ] Test with very long inputs → Should handle gracefully
- [ ] Test with special characters → Should handle correctly
- [ ] Test with unicode characters → Should handle correctly

## ✅ Integration Testing

### Database Integration
- [ ] Verify user is created in `auth.users` table
- [ ] Verify profile is created in `user_profiles` table
- [ ] Verify role is set correctly
- [ ] Verify full_name is stored correctly

### Email Integration
- [ ] Verify confirmation emails are sent
- [ ] Verify password reset emails are sent
- [ ] Verify invitation emails are sent
- [ ] Verify email links work correctly

## Notes

- All error messages should be user-friendly and actionable
- All success messages should be clear and informative
- Forms should prevent double submission
- Loading states should provide clear feedback
- Validation should happen both client-side and server-side

