import type { OpportunityState, QuoteState, HandoverState } from './database'

/**
 * Valid state transitions for Opportunities
 */
export const OPPORTUNITY_TRANSITIONS: Record<OpportunityState, OpportunityState[]> = {
  lead: ['qualified', 'closed_lost'],
  qualified: ['proposal', 'closed_lost'],
  proposal: ['closed_won', 'closed_lost'],
  closed_won: [], // No backward transitions after closure
  closed_lost: [], // No backward transitions after closure
}

/**
 * Valid state transitions for Quotes
 */
export const QUOTE_TRANSITIONS: Record<QuoteState, QuoteState[]> = {
  draft: ['pending_approval'],
  pending_approval: ['approved', 'rejected'],
  approved: [], // No backward transitions after closure
  rejected: [], // No backward transitions after closure
}

/**
 * Valid state transitions for Handovers
 */
export const HANDOVER_TRANSITIONS: Record<HandoverState, HandoverState[]> = {
  pending: ['accepted', 'flagged'],
  accepted: [], // No backward transitions after closure
  flagged: [], // No backward transitions after closure
}

/**
 * Check if a state transition is valid
 */
export function isValidTransition<T extends string>(
  currentState: T,
  newState: T,
  transitions: Record<T, T[]>
): boolean {
  return transitions[currentState]?.includes(newState) ?? false
}

