'use server'

import { createClient } from '@/lib/supabase/server'
import { getCurrentUser, hasRole } from '@/lib/auth'
import { ROLES } from '@/lib/constants'
import type { Database } from '@/lib/types/supabase'

type OpportunityStageConfigInsert = Database['public']['Tables']['opportunity_stages_config']['Insert']
type OpportunityStageConfigUpdate = Database['public']['Tables']['opportunity_stages_config']['Update']

/**
 * Get all opportunity stages config (Executive only)
 */
export async function getOpportunityStages() {
  const canView = await hasRole(ROLES.EXECUTIVE)
  if (!canView) {
    return { data: null, error: { message: 'Unauthorized - Executive access required' } }
  }

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('opportunity_stages_config')
    .select('*')
    .order('order_index', { ascending: true })

  return { data, error }
}

/**
 * Get a single opportunity stage config (Executive only)
 */
export async function getOpportunityStage(id: string) {
  const canView = await hasRole(ROLES.EXECUTIVE)
  if (!canView) {
    return { data: null, error: { message: 'Unauthorized - Executive access required' } }
  }

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('opportunity_stages_config')
    .select('*')
    .eq('id', id)
    .single()

  return { data, error }
}

/**
 * Create an opportunity stage config (Executive only)
 * Note: Limited editing - stage enum value cannot be changed
 */
export async function createOpportunityStage(stage: Omit<OpportunityStageConfigInsert, 'created_by'>) {
  const user = await getCurrentUser()
  if (!user) {
    return { data: null, error: { message: 'Unauthorized' } }
  }

  const canCreate = await hasRole(ROLES.EXECUTIVE)
  if (!canCreate) {
    return { data: null, error: { message: 'Unauthorized - Executive access required' } }
  }

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('opportunity_stages_config')
    .insert({
      ...stage,
      created_by: user.id,
    })
    .select()
    .single()

  return { data, error }
}

/**
 * Update an opportunity stage config (Executive only)
 * Note: Limited editing - stage enum value cannot be changed, only display_name, description, order_index, is_active
 */
export async function updateOpportunityStage(id: string, updates: Omit<OpportunityStageConfigUpdate, 'stage'>) {
  const canUpdate = await hasRole(ROLES.EXECUTIVE)
  if (!canUpdate) {
    return { data: null, error: { message: 'Unauthorized - Executive access required' } }
  }

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('opportunity_stages_config')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  return { data, error }
}

/**
 * Deactivate an opportunity stage (Executive only)
 */
export async function deactivateOpportunityStage(id: string) {
  return updateOpportunityStage(id, { is_active: false })
}

/**
 * Activate an opportunity stage (Executive only)
 */
export async function activateOpportunityStage(id: string) {
  return updateOpportunityStage(id, { is_active: true })
}

