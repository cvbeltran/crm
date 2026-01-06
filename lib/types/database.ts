export type UserRole = 'executive' | 'sales' | 'finance' | 'operations'

export type OpportunityState = 'lead' | 'qualified' | 'proposal' | 'closed_won' | 'closed_lost'

export type QuoteState = 'draft' | 'pending_approval' | 'approved' | 'rejected'

export type HandoverState = 'pending' | 'accepted' | 'flagged'

export interface UserProfile {
  id: string
  email: string
  full_name: string | null
  role: UserRole
  created_at: string
  updated_at: string
}

export interface Account {
  id: string
  name: string
  industry: string | null
  website: string | null
  phone: string | null
  address: string | null
  created_by: string | null
  created_at: string
  updated_at: string
}

export interface Opportunity {
  id: string
  account_id: string
  name: string
  description: string | null
  state: OpportunityState
  deal_value: number
  expected_close_date: string | null
  owner_id: string
  created_at: string
  updated_at: string
}

export interface Quote {
  id: string
  opportunity_id: string
  quote_number: string
  state: QuoteState
  deal_value: number
  cost: number | null
  margin: number | null
  margin_percentage: number | null
  discount_percentage: number | null
  scope: string | null
  valid_until: string | null
  created_by: string
  created_at: string
  updated_at: string
}

export interface QuoteForOperations {
  id: string
  opportunity_id: string
  quote_number: string
  state: QuoteState
  deal_value: number
  scope: string | null
  valid_until: string | null
  created_by: string
  created_at: string
  updated_at: string
}

export interface Approval {
  id: string
  quote_id: string
  approver_id: string
  status: 'pending' | 'approved' | 'rejected'
  comments: string | null
  created_at: string
  updated_at: string
}

export interface Handover {
  id: string
  opportunity_id: string
  quote_id: string | null
  state: HandoverState
  deal_value: number
  scope: string | null
  expected_start_date: string | null
  expected_end_date: string | null
  accepted_by: string | null
  flagged_reason: string | null
  created_at: string
  updated_at: string
}

