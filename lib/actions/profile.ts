'use server'

import { createClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/auth'
import type { Database } from '@/lib/types/supabase'

type UserProfileUpdate = Database['public']['Tables']['user_profiles']['Update']

/**
 * Update user profile
 */
export async function updateProfile(updates: UserProfileUpdate) {
  const user = await getCurrentUser()
  if (!user) {
    return { data: null, error: { message: 'Unauthorized' } }
  }

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('user_profiles')
    .update(updates)
    .eq('id', user.id)
    .select()
    .single()

  return { data, error }
}

