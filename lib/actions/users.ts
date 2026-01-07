'use server'

import { createAdminClient } from '@/lib/supabase/admin'
import type { UserRole } from '@/lib/types/database'

interface CreateUserInput {
  email: string
  password: string
  full_name?: string
  role?: UserRole
  email_confirm?: boolean
}

interface CreateUserResult {
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

/**
 * Create a user manually using Admin API.
 * Only accessible by executives.
 */
export async function createUser(input: CreateUserInput): Promise<CreateUserResult> {
  try {
    const adminClient = createAdminClient()

    // Create user using Admin API
    const { data, error } = await adminClient.auth.admin.createUser({
      email: input.email,
      password: input.password,
      email_confirm: input.email_confirm ?? true, // Auto-confirm email by default
      user_metadata: {
        full_name: input.full_name || '',
        role: input.role || 'sales',
      },
    })

    if (error) {
      return {
        data: null,
        error: { message: error.message },
      }
    }

    if (!data.user) {
      return {
        data: null,
        error: { message: 'Failed to create user' },
      }
    }

    // The database trigger will automatically create the user_profile
    // But we can verify it was created
    return {
      data: {
        user: {
          id: data.user.id,
          email: data.user.email || input.email,
        },
      },
      error: null,
    }
  } catch (error) {
    return {
      data: null,
      error: {
        message: error instanceof Error ? error.message : 'Unknown error occurred',
      },
    }
  }
}

/**
 * List all users (admin only)
 */
export async function listUsers() {
  try {
    const adminClient = createAdminClient()
    const { data, error } = await adminClient.auth.admin.listUsers()

    if (error) {
      return {
        data: null,
        error: { message: error.message },
      }
    }

    return {
      data: data.users.map((user) => ({
        id: user.id,
        email: user.email,
        created_at: user.created_at,
        email_confirmed_at: user.email_confirmed_at,
        last_sign_in_at: user.last_sign_in_at,
        user_metadata: user.user_metadata,
      })),
      error: null,
    }
  } catch (error) {
    return {
      data: null,
      error: {
        message: error instanceof Error ? error.message : 'Unknown error occurred',
      },
    }
  }
}

