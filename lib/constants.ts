export const ROLES = {
  EXECUTIVE: 'executive',
  SALES: 'sales',
  FINANCE: 'finance',
  OPERATIONS: 'operations',
} as const

export const OPPORTUNITY_STATES = {
  LEAD: 'lead',
  QUALIFIED: 'qualified',
  PROPOSAL: 'proposal',
  CLOSED_WON: 'closed_won',
  CLOSED_LOST: 'closed_lost',
} as const

export const QUOTE_STATES = {
  DRAFT: 'draft',
  PENDING_APPROVAL: 'pending_approval',
  APPROVED: 'approved',
  REJECTED: 'rejected',
} as const

export const HANDOVER_STATES = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  FLAGGED: 'flagged',
} as const

