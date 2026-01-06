'use server'

import { createClient } from '@/lib/supabase/server'
import { getCurrentUser, hasAnyRole, getUserRole } from '@/lib/auth'
import { ROLES } from '@/lib/constants'
import { updateQuoteState } from './state-transitions'
import { createApproval } from './approvals'
import { getOpportunity } from './opportunities'
import type { Database } from '@/lib/types/supabase'

type QuoteInsert = Database['public']['Tables']['quotes']['Insert']
type QuoteUpdate = Database['public']['Tables']['quotes']['Update']

/**
 * Get quotes with role-based visibility
 * Operations role uses quotes_for_operations view to hide sensitive fields
 */
export async function getQuotes(opportunityId?: string) {
  const supabase = await createClient()
  const role = await getUserRole()

  // Operations role should use the restricted view
  if (role === 'operations') {
    const query = supabase.from('quotes_for_operations').select(`
      *,
      opportunity:opportunities(*)
    `)
    
    if (opportunityId) {
      query.eq('opportunity_id', opportunityId)
    }
    
    const { data, error } = await query.order('created_at', { ascending: false })
    return { data, error }
  }

  // Other roles can see all fields
  const query = supabase.from('quotes').select(`
    *,
    opportunity:opportunities(*)
  `)
  
  if (opportunityId) {
    query.eq('opportunity_id', opportunityId)
  }
  
  const { data, error } = await query.order('created_at', { ascending: false })
  return { data, error }
}

/**
 * Get a single quote with role-based visibility
 */
export async function getQuote(quoteId: string) {
  const supabase = await createClient()
  const role = await getUserRole()

  // Operations role should use the restricted view
  if (role === 'operations') {
    const { data, error } = await supabase
      .from('quotes_for_operations')
      .select(`
        *,
        opportunity:opportunities(*)
      `)
      .eq('id', quoteId)
      .single()

    return { data, error }
  }

  // Other roles can see all fields
  const { data, error } = await supabase
    .from('quotes')
    .select(`
      *,
      opportunity:opportunities(*)
    `)
    .eq('id', quoteId)
    .single()

  return { data, error }
}

/**
 * Check if quote number already exists
 */
export async function checkQuoteNumberExists(quoteNumber: string, excludeId?: string) {
  const supabase = await createClient()
  const query = supabase
    .from('quotes')
    .select('id')
    .eq('quote_number', quoteNumber)
    .limit(1)

  if (excludeId) {
    query.neq('id', excludeId)
  }

  const { data, error } = await query

  if (error) {
    return { exists: false, error }
  }

  return { exists: (data?.length || 0) > 0, error: null }
}

/**
 * Create a new quote
 */
export async function createQuote(quote: QuoteInsert) {
  const user = await getCurrentUser()
  if (!user) {
    return { data: null, error: { message: 'Unauthorized' } }
  }

  const canCreate = await hasAnyRole([ROLES.SALES, ROLES.EXECUTIVE])
  if (!canCreate) {
    return { data: null, error: { message: 'Insufficient permissions' } }
  }

  // Validate opportunity state - quotes should only be created for proposal or closed_won opportunities
  const { data: opportunity, error: oppError } = await getOpportunity(quote.opportunity_id)
  if (oppError || !opportunity) {
    return { data: null, error: { message: 'Opportunity not found' } }
  }

  if (opportunity.state !== 'proposal' && opportunity.state !== 'closed_won') {
    return { 
      data: null, 
      error: { 
        message: `Cannot create quote. Opportunity must be 'proposal' or 'closed_won' but is currently '${opportunity.state}'` 
      } 
    }
  }

  // Check quote number uniqueness
  const { exists, error: checkError } = await checkQuoteNumberExists(quote.quote_number)
  if (checkError) {
    return { data: null, error: { message: 'Error checking quote number uniqueness' } }
  }
  if (exists) {
    return { data: null, error: { message: `Quote number "${quote.quote_number}" already exists` } }
  }

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('quotes')
    .insert({
      ...quote,
      created_by: user.id,
    })
    .select()
    .single()

  return { data, error }
}

/**
 * Update a quote
 */
export async function updateQuote(id: string, updates: QuoteUpdate) {
  const role = await getUserRole()
  
  // Sales and Executive can update quotes
  const canUpdate = await hasAnyRole([ROLES.SALES, ROLES.EXECUTIVE])
  // Finance can update approval status
  const canApprove = await hasAnyRole([ROLES.FINANCE, ROLES.EXECUTIVE])

  if (!canUpdate && !canApprove) {
    return { data: null, error: { message: 'Insufficient permissions' } }
  }

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('quotes')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  return { data, error }
}

/**
 * Update quote state with validation
 */
export async function transitionQuoteState(
  id: string,
  newState: Database['public']['Enums']['quote_state'],
  comments?: string
) {
  const role = await getUserRole()
  
  // Only Finance and Executive can approve/reject
  if (newState === 'approved' || newState === 'rejected') {
    const canApprove = await hasAnyRole([ROLES.FINANCE, ROLES.EXECUTIVE])
    if (!canApprove) {
      return { success: false, error: 'Insufficient permissions to approve/reject quotes' }
    }

    // Update quote state
    const result = await updateQuoteState(id, newState)
    if (!result.success) {
      return result
    }

    // Create approval record (approver_id is set automatically in createApproval)
    const approvalResult = await createApproval({
      quote_id: id,
      status: newState === 'approved' ? 'approved' : 'rejected',
      comments: comments || null,
    })

    if (approvalResult.error) {
      // Log error but don't fail the state transition
      console.error('Failed to create approval record:', approvalResult.error)
    }

    return result
  } else {
    // Sales and Executive can move to pending_approval
    const canUpdate = await hasAnyRole([ROLES.SALES, ROLES.EXECUTIVE])
    if (!canUpdate) {
      return { success: false, error: 'Insufficient permissions' }
    }
  }

  return updateQuoteState(id, newState)
}
