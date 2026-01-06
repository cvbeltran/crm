'use server'

import { createClient } from '@/lib/supabase/server'
import {
  OPPORTUNITY_TRANSITIONS,
  QUOTE_TRANSITIONS,
  HANDOVER_TRANSITIONS,
  isValidTransition,
} from '@/lib/types/workflows'
import type {
  OpportunityState,
  QuoteState,
  HandoverState,
} from '@/lib/types/database'

/**
 * Validate and update opportunity state transition
 */
export async function validateOpportunityTransition(
  currentState: OpportunityState,
  newState: OpportunityState
): Promise<{ valid: boolean; error?: string }> {
  if (!isValidTransition(currentState, newState, OPPORTUNITY_TRANSITIONS)) {
    return {
      valid: false,
      error: `Invalid transition from ${currentState} to ${newState}. Valid transitions: ${OPPORTUNITY_TRANSITIONS[currentState]?.join(', ') || 'none'}`,
    }
  }

  // Check if trying to transition from a closed state
  if (currentState === 'closed_won' || currentState === 'closed_lost') {
    return {
      valid: false,
      error: 'Cannot transition from a closed state. No backward transitions allowed.',
    }
  }

  return { valid: true }
}

/**
 * Validate and update quote state transition
 */
export async function validateQuoteTransition(
  currentState: QuoteState,
  newState: QuoteState
): Promise<{ valid: boolean; error?: string }> {
  if (!isValidTransition(currentState, newState, QUOTE_TRANSITIONS)) {
    return {
      valid: false,
      error: `Invalid transition from ${currentState} to ${newState}. Valid transitions: ${QUOTE_TRANSITIONS[currentState]?.join(', ') || 'none'}`,
    }
  }

  // Check if trying to transition from a closed state
  if (currentState === 'approved' || currentState === 'rejected') {
    return {
      valid: false,
      error: 'Cannot transition from a closed state. No backward transitions allowed.',
    }
  }

  return { valid: true }
}

/**
 * Validate and update handover state transition
 */
export async function validateHandoverTransition(
  currentState: HandoverState,
  newState: HandoverState
): Promise<{ valid: boolean; error?: string }> {
  if (!isValidTransition(currentState, newState, HANDOVER_TRANSITIONS)) {
    return {
      valid: false,
      error: `Invalid transition from ${currentState} to ${newState}. Valid transitions: ${HANDOVER_TRANSITIONS[currentState]?.join(', ') || 'none'}`,
    }
  }

  // Check if trying to transition from a closed state
  if (currentState === 'accepted' || currentState === 'flagged') {
    return {
      valid: false,
      error: 'Cannot transition from a closed state. No backward transitions allowed.',
    }
  }

  return { valid: true }
}

/**
 * Update opportunity state with validation
 */
export async function updateOpportunityState(
  opportunityId: string,
  newState: OpportunityState
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()

  // Get current state
  const { data: opportunity, error: fetchError } = await supabase
    .from('opportunities')
    .select('state')
    .eq('id', opportunityId)
    .single()

  if (fetchError || !opportunity) {
    return { success: false, error: 'Opportunity not found' }
  }

  // Validate transition
  const validation = await validateOpportunityTransition(
    opportunity.state,
    newState
  )

  if (!validation.valid) {
    return { success: false, error: validation.error }
  }

  // Update state
  const { error: updateError } = await supabase
    .from('opportunities')
    .update({ state: newState })
    .eq('id', opportunityId)

  if (updateError) {
    return { success: false, error: updateError.message }
  }

  return { success: true }
}

/**
 * Update quote state with validation
 */
export async function updateQuoteState(
  quoteId: string,
  newState: QuoteState
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()

  // Get current state
  const { data: quote, error: fetchError } = await supabase
    .from('quotes')
    .select('state')
    .eq('id', quoteId)
    .single()

  if (fetchError || !quote) {
    return { success: false, error: 'Quote not found' }
  }

  // Validate transition
  const validation = await validateQuoteTransition(quote.state, newState)

  if (!validation.valid) {
    return { success: false, error: validation.error }
  }

  // Update state
  const { error: updateError } = await supabase
    .from('quotes')
    .update({ state: newState })
    .eq('id', quoteId)

  if (updateError) {
    return { success: false, error: updateError.message }
  }

  return { success: true }
}

/**
 * Update handover state with validation
 */
export async function updateHandoverState(
  handoverId: string,
  newState: HandoverState
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()

  // Get current state
  const { data: handover, error: fetchError } = await supabase
    .from('handovers')
    .select('state')
    .eq('id', handoverId)
    .single()

  if (fetchError || !handover) {
    return { success: false, error: 'Handover not found' }
  }

  // Validate transition
  const validation = await validateHandoverTransition(
    handover.state,
    newState
  )

  if (!validation.valid) {
    return { success: false, error: validation.error }
  }

  // Update state
  const { error: updateError } = await supabase
    .from('handovers')
    .update({ state: newState })
    .eq('id', handoverId)

  if (updateError) {
    return { success: false, error: updateError.message }
  }

  return { success: true }
}

