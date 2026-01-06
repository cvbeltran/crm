'use server'

import { createClient } from '@/lib/supabase/server'
import { getCurrentUser, hasAnyRole } from '@/lib/auth'
import { ROLES } from '@/lib/constants'
import type { Database } from '@/lib/types/supabase'

type ApprovalInsert = Database['public']['Tables']['approvals']['Insert']
type ApprovalUpdate = Database['public']['Tables']['approvals']['Update']

/**
 * Get approvals for a quote
 */
export async function getApprovalsByQuote(quoteId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('approvals')
    .select(`
      *,
      approver:user_profiles(id, email, full_name, role)
    `)
    .eq('quote_id', quoteId)
    .order('created_at', { ascending: false })

  return { data, error }
}

/**
 * Create an approval record
 */
export async function createApproval(approval: Omit<ApprovalInsert, 'approver_id'>) {
  const user = await getCurrentUser()
  if (!user) {
    return { data: null, error: { message: 'Unauthorized' } }
  }

  const canCreate = await hasAnyRole([ROLES.FINANCE, ROLES.EXECUTIVE])
  if (!canCreate) {
    return { data: null, error: { message: 'Insufficient permissions' } }
  }

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('approvals')
    .insert({
      ...approval,
      approver_id: user.id,
    })
    .select(`
      *,
      approver:user_profiles(id, email, full_name, role)
    `)
    .single()

  return { data, error }
}

/**
 * Update an approval record
 */
export async function updateApproval(id: string, updates: ApprovalUpdate) {
  const canUpdate = await hasAnyRole([ROLES.FINANCE, ROLES.EXECUTIVE])
  if (!canUpdate) {
    return { data: null, error: { message: 'Insufficient permissions' } }
  }

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('approvals')
    .update(updates)
    .eq('id', id)
    .select(`
      *,
      approver:user_profiles(id, email, full_name, role)
    `)
    .single()

  return { data, error }
}

