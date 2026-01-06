'use server'

import { createClient } from '@/lib/supabase/server'
import { getCurrentUser, hasRole } from '@/lib/auth'
import { ROLES } from '@/lib/constants'
import type { Database } from '@/lib/types/supabase'

type ICPCategoryInsert = Database['public']['Tables']['icp_categories']['Insert']
type ICPCategoryUpdate = Database['public']['Tables']['icp_categories']['Update']

/**
 * Get all ICP categories (Executive only)
 */
export async function getICPCategories() {
  const canView = await hasRole(ROLES.EXECUTIVE)
  if (!canView) {
    return { data: null, error: { message: 'Unauthorized - Executive access required' } }
  }

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('icp_categories')
    .select('*')
    .order('created_at', { ascending: false })

  return { data, error }
}

/**
 * Get a single ICP category (Executive only)
 */
export async function getICPCategory(id: string) {
  const canView = await hasRole(ROLES.EXECUTIVE)
  if (!canView) {
    return { data: null, error: { message: 'Unauthorized - Executive access required' } }
  }

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('icp_categories')
    .select('*')
    .eq('id', id)
    .single()

  return { data, error }
}

/**
 * Create an ICP category (Executive only)
 */
export async function createICPCategory(icpCategory: Omit<ICPCategoryInsert, 'created_by' | 'code'> & { code?: string }) {
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
  const code = icpCategory.code || icpCategory.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
  
  const { data, error } = await supabase
    .from('icp_categories')
    .insert({
      name: icpCategory.name,
      code,
      description: icpCategory.description || null,
      is_active: icpCategory.is_active ?? true,
    })
    .select()
    .single()

  return { data, error }
}

/**
 * Update an ICP category (Executive only)
 */
export async function updateICPCategory(id: string, updates: ICPCategoryUpdate) {
  const canUpdate = await hasRole(ROLES.EXECUTIVE)
  if (!canUpdate) {
    return { data: null, error: { message: 'Unauthorized - Executive access required' } }
  }

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('icp_categories')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  return { data, error }
}

/**
 * Deactivate an ICP category (Executive only)
 */
export async function deactivateICPCategory(id: string) {
  return updateICPCategory(id, { is_active: false })
}

/**
 * Activate an ICP category (Executive only)
 */
export async function activateICPCategory(id: string) {
  return updateICPCategory(id, { is_active: true })
}

