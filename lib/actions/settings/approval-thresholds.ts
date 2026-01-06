'use server'

import { createClient } from '@/lib/supabase/server'
import { getCurrentUser, hasRole } from '@/lib/auth'
import { ROLES } from '@/lib/constants'
import type { Database } from '@/lib/types/supabase'

type ApprovalThresholdInsert = Database['public']['Tables']['approval_thresholds']['Insert']
type ApprovalThresholdUpdate = Database['public']['Tables']['approval_thresholds']['Update']

/**
 * Get all approval thresholds (Executive only)
 */
export async function getApprovalThresholds() {
  const canView = await hasRole(ROLES.EXECUTIVE)
  if (!canView) {
    return { data: null, error: { message: 'Unauthorized - Executive access required' } }
  }

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('approval_thresholds')
    .select('*')
    .order('min_deal_value', { ascending: true })

  return { data, error }
}

/**
 * Get a single approval threshold (Executive only)
 */
export async function getApprovalThreshold(id: string) {
  const canView = await hasRole(ROLES.EXECUTIVE)
  if (!canView) {
    return { data: null, error: { message: 'Unauthorized - Executive access required' } }
  }

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('approval_thresholds')
    .select('*')
    .eq('id', id)
    .single()

  return { data, error }
}

/**
 * Create an approval threshold (Executive only)
 */
export async function createApprovalThreshold(threshold: { approval_role: 'finance' | 'executive'; min_deal_value: number; max_deal_value?: number | null }) {
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
    .from('approval_thresholds')
    .insert({
      approval_role: threshold.approval_role,
      min_deal_value: threshold.min_deal_value,
      max_deal_value: threshold.max_deal_value || null,
    })
    .select()
    .single()

  return { data, error }
}

/**
 * Update an approval threshold (Executive only)
 */
export async function updateApprovalThreshold(id: string, updates: Partial<ApprovalThresholdUpdate>) {
  const canUpdate = await hasRole(ROLES.EXECUTIVE)
  if (!canUpdate) {
    return { data: null, error: { message: 'Unauthorized - Executive access required' } }
  }

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('approval_thresholds')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  return { data, error }
}

/**
 * Delete an approval threshold (Executive only)
 */
export async function deleteApprovalThreshold(id: string) {
  const canDelete = await hasRole(ROLES.EXECUTIVE)
  if (!canDelete) {
    return { data: null, error: { message: 'Unauthorized - Executive access required' } }
  }

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('approval_thresholds')
    .delete()
    .eq('id', id)
    .select()
    .single()

  return { data, error }
}

