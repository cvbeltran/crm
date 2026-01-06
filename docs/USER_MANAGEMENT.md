# User Management Guide

## Overview

Supabase Dashboard only provides an "Invite User" option for security reasons. However, you can create users manually using the Admin API through this application.

## Setup

### 1. Get Your Service Role Key

1. Go to your Supabase Dashboard
2. Navigate to **Settings** → **API**
3. Find the **service_role** key (NOT the anon key)
4. Copy this key - it's secret and should never be exposed to the client

### 2. Add Environment Variable

Add the service role key to your `.env.local` file:

```bash
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

**⚠️ IMPORTANT**: 
- Never commit this key to version control
- Never expose this key in client-side code
- This key bypasses Row Level Security (RLS)
- Only use it server-side

### 3. Restart Your Development Server

After adding the environment variable, restart your Next.js development server:

```bash
npm run dev
```

## Using Manual User Creation

### Via Web Interface (Executives Only)

1. Log in as an **Executive** user
2. Navigate to **Users** in the navigation menu
3. Click **Create User**
4. Fill in the form:
   - Email (required)
   - Password (required, minimum 6 characters)
   - Full Name (optional)
   - Role (defaults to 'sales')
   - Auto-confirm email (checked by default)
5. Click **Create User**

The user will be created immediately and can sign in right away.

### Via Server Action (Programmatic)

You can also create users programmatically:

```typescript
import { createUser } from '@/lib/actions/users'

const result = await createUser({
  email: 'user@example.com',
  password: 'secure-password',
  full_name: 'John Doe',
  role: 'sales',
  email_confirm: true, // Auto-confirm email
})

if (result.error) {
  console.error(result.error.message)
} else {
  console.log('User created:', result.data?.user)
}
```

## Differences: Invite vs Manual Creation

### Invite User (Supabase Dashboard)
- ✅ Sends email invitation
- ✅ User sets their own password
- ✅ More secure (password never transmitted)
- ❌ Requires email configuration
- ❌ User must click link to set password

### Manual Creation (This Feature)
- ✅ Instant user creation
- ✅ No email required
- ✅ User can sign in immediately
- ✅ Useful for testing/development
- ❌ Admin knows the password
- ❌ Less secure (password transmitted)

## Security Considerations

1. **Service Role Key**: 
   - Keep it secret
   - Only use server-side
   - Never expose to client

2. **Authorization**:
   - Only **Executive** role can create users
   - Enforced via server action checks

3. **Password Security**:
   - Use strong passwords
   - Consider using password generators
   - Users should change passwords after first login

## API Reference

### `createUser(input)`

Creates a new user using the Admin API.

**Parameters:**
- `email` (string, required): User's email address
- `password` (string, required): User's password (min 6 chars)
- `full_name` (string, optional): User's full name
- `role` (UserRole, optional): User role (defaults to 'sales')
- `email_confirm` (boolean, optional): Auto-confirm email (defaults to true)

**Returns:**
```typescript
{
  data: {
    user: {
      id: string
      email: string
    } | null
  } | null
  error: {
    message: string
  } | null
}
```

### `listUsers()`

Lists all users in the system (Executive only).

**Returns:**
```typescript
{
  data: User[] | null
  error: {
    message: string
  } | null
}
```

## Troubleshooting

### Error: "SUPABASE_SERVICE_ROLE_KEY environment variable is not set"

**Solution**: Add the service role key to your `.env.local` file and restart the server.

### Error: "Unauthorized: Only executives can create users"

**Solution**: You must be logged in as an Executive role user.

### User Created But Profile Not Found

**Solution**: Check that the database trigger `handle_new_user()` is working correctly. The trigger should automatically create a `user_profiles` entry.

### User Can't Sign In

**Possible causes:**
1. Email not confirmed (if `email_confirm: false`)
2. Wrong password
3. User account disabled in Supabase

## Best Practices

1. **For Production**: Prefer using "Invite User" for better security
2. **For Development**: Manual creation is fine for testing
3. **Password Management**: Use strong, unique passwords
4. **Role Assignment**: Assign appropriate roles based on user needs
5. **Audit Trail**: Keep track of who created which users

