'use server'

import { createClient } from '@/lib/supabase/server'
import { getCurrentUser, hasRole } from '@/lib/auth'
import { ROLES } from '@/lib/constants'
import type { Database } from '@/lib/types/supabase'

type RevenueModelInsert = Database['public']['Tables']['revenue_models']['Insert']
type RevenueModelUpdate = Database['public']['Tables']['revenue_models']['Update']

/**
 * Get all revenue models (Executive only)
 */
export async function getRevenueModels() {
  const canView = await hasRole(ROLES.EXECUTIVE)
  if (!canView) {
    return { data: null, error: { message: 'Unauthorized - Executive access required' } }
  }

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('revenue_models')
    .select('*')
    .order('created_at', { ascending: false })

  return { data, error }
}

/**
 * Get a single revenue model (Executive only)
 */
export async function getRevenueModel(id: string) {
  const canView = await hasRole(ROLES.EXECUTIVE)
  if (!canView) {
    return { data: null, error: { message: 'Unauthorized - Executive access required' } }
  }

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('revenue_models')
    .select('*')
    .eq('id', id)
    .single()

  return { data, error }
}

/**
 * Create a revenue model (Executive only)
 */
export async function createRevenueModel(revenueModel: Omit<RevenueModelInsert, 'created_by' | 'code'> & { code?: string }) {
  const user = await getCurrentUser()
  if (!user) {
    return { data: null, error: { message: 'Unauthorized' } }
  }

  const canCreate = await hasRole(ROLES.EXECUTIVE)
  if (!canCreate) {
    return { data: null, error: { message: 'Unauthorized - Executive access required' } }
  }

  const supabase = await createClient()
  // Generate code from name if not provided
  const code = revenueModel.code || revenueModel.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
  
  const { data, error } = await supabase
    .from('revenue_models')
    .insert({
      ...revenueModel,
      code,
    })
    .select()
    .single()

  return { data, error }
}

/**
 * Update a revenue model (Executive only)
 */
export async function updateRevenueModel(id: string, updates: RevenueModelUpdate) {
  const canUpdate = await hasRole(ROLES.EXECUTIVE)
  if (!canUpdate) {
    return { data: null, error: { message: 'Unauthorized - Executive access required' } }
  }

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('revenue_models')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  return { data, error }
}

/**
 * Deactivate a revenue model (Executive only)
 */
export async function deactivateRevenueModel(id: string) {
  return updateRevenueModel(id, { is_active: false })
}

/**
 * Activate a revenue model (Executive only)
 */
export async function activateRevenueModel(id: string) {
  return updateRevenueModel(id, { is_active: true })
}

