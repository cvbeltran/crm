'use server'

import { createClient } from '@/lib/supabase/server'
import { getCurrentUser, hasAnyRole, hasRole } from '@/lib/auth'
import { ROLES } from '@/lib/constants'
import { updateHandoverState } from './state-transitions'
import { getOpportunity } from './opportunities'
import type { Database } from '@/lib/types/supabase'

type HandoverInsert = Database['public']['Tables']['handovers']['Insert']
type HandoverUpdate = Database['public']['Tables']['handovers']['Update']

/**
 * Get all handovers
 */
export async function getHandovers(opportunityId?: string) {
  const supabase = await createClient()
  const query = supabase
    .from('handovers')
    .select(`
      *,
      opportunity:opportunities(*),
      quote:quotes(id, quote_number, state),
      accepted_by_user:user_profiles!handovers_accepted_by_fkey(id, email, full_name)
    `)
    .order('created_at', { ascending: false })

  if (opportunityId) {
    query.eq('opportunity_id', opportunityId)
  }

  const { data, error } = await query
  return { data, error }
}

/**
 * Get a single handover
 */
export async function getHandover(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('handovers')
    .select(`
      *,
      opportunity:opportunities(*),
      quote:quotes(id, quote_number, state),
      accepted_by_user:user_profiles!handovers_accepted_by_fkey(id, email, full_name)
    `)
    .eq('id', id)
    .single()

  return { data, error }
}

/**
 * Create a new handover
 */
export async function createHandover(handover: HandoverInsert) {
  const user = await getCurrentUser()
  if (!user) {
    return { data: null, error: { message: 'Unauthorized' } }
  }

  const canCreate = await hasAnyRole([ROLES.SALES, ROLES.EXECUTIVE])
  if (!canCreate) {
    return { data: null, error: { message: 'Insufficient permissions' } }
  }

  // Validate that opportunity is closed_won
  const { data: opportunity, error: oppError } = await getOpportunity(handover.opportunity_id)
  if (oppError || !opportunity) {
    return { data: null, error: { message: 'Opportunity not found' } }
  }

  if (opportunity.state !== 'closed_won') {
    return { 
      data: null, 
      error: { 
        message: `Cannot create handover. Opportunity must be 'closed_won' but is currently '${opportunity.state}'` 
      } 
    }
  }

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('handovers')
    .insert(handover)
    .select()
    .single()

  return { data, error }
}

/**
 * Update a handover
 */
export async function updateHandover(id: string, updates: HandoverUpdate) {
  const user = await getCurrentUser()
  if (!user) {
    return { data: null, error: { message: 'Unauthorized' } }
  }

  const isOperations = await hasRole(ROLES.OPERATIONS)
  const canUpdate = await hasAnyRole([ROLES.SALES, ROLES.EXECUTIVE])

  if (!isOperations && !canUpdate) {
    return { data: null, error: { message: 'Insufficient permissions' } }
  }

  // Operations can only update state and accepted_by
  if (isOperations) {
    const allowedFields: Partial<HandoverUpdate> = {
      state: updates.state,
      accepted_by: updates.accepted_by,
      flagged_reason: updates.flagged_reason,
    }
    updates = allowedFields as HandoverUpdate
  }

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('handovers')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  return { data, error }
}

/**
 * Update handover state with validation
 */
export async function transitionHandoverState(
  id: string,
  newState: Database['public']['Enums']['handover_state'],
  acceptedBy?: string,
  flaggedReason?: string
) {
  const user = await getCurrentUser()
  if (!user) {
    return { success: false, error: 'Unauthorized' }
  }

  const isOperations = await hasRole(ROLES.OPERATIONS)
  const canUpdate = await hasAnyRole([ROLES.SALES, ROLES.EXECUTIVE])

  if (!isOperations && !canUpdate) {
    return { success: false, error: 'Insufficient permissions' }
  }

  // Operations can accept/flag handovers
  if (isOperations && (newState === 'accepted' || newState === 'flagged')) {
    const updates: HandoverUpdate = {
      state: newState,
      accepted_by: newState === 'accepted' ? user.id : null,
      flagged_reason: newState === 'flagged' ? flaggedReason || null : null,
    }
    return updateHandover(id, updates)
  }

  // Sales/Executive can update other fields
  if (canUpdate) {
    return updateHandoverState(id, newState)
  }

  return { success: false, error: 'Insufficient permissions' }
}

