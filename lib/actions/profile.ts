'use server'

import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/types/supabase'

type UserProfileUpdate = Database['public']['Tables']['user_profiles']['Update']

/**
 * Update user profile
 */
export async function updateProfile(updates: UserProfileUpdate & { id: string }) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('user_profiles')
    .update(updates)
    .eq('id', updates.id)
    .select()
    .single()

  return { data, error }
}

