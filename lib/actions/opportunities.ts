'use server'

import { createClient } from '@/lib/supabase/server'
import { updateOpportunityState } from './state-transitions'
import type { Database } from '@/lib/types/supabase'

type OpportunityInsert = Database['public']['Tables']['opportunities']['Insert']
type OpportunityUpdate = Database['public']['Tables']['opportunities']['Update']

/**
 * Get all opportunities
 */
export async function getOpportunities(accountId?: string) {
  const supabase = await createClient()
  const query = supabase
    .from('opportunities')
    .select(`
      *,
      account:accounts(*),
      owner:user_profiles(id, email, full_name, role)
    `)
    .order('created_at', { ascending: false })

  if (accountId) {
    query.eq('account_id', accountId)
  }

  const { data, error } = await query
  return { data, error }
}

/**
 * Get a single opportunity
 */
export async function getOpportunity(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('opportunities')
    .select(`
      *,
      account:accounts(*),
      owner:user_profiles(id, email, full_name, role)
    `)
    .eq('id', id)
    .single()

  return { data, error }
}

/**
 * Create a new opportunity
 */
export async function createOpportunity(opportunity: OpportunityInsert) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('opportunities')
    .insert(opportunity)
    .select()
    .single()

  return { data, error }
}

/**
 * Update an opportunity
 */
export async function updateOpportunity(id: string, updates: OpportunityUpdate) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('opportunities')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  return { data, error }
}

/**
 * Update opportunity state with validation
 */
export async function transitionOpportunityState(
  id: string,
  newState: Database['public']['Enums']['opportunity_state']
) {
  return updateOpportunityState(id, newState)
}

