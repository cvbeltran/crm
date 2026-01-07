'use server'

import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/types/supabase'

// Re-export getRevenueModels for use in forms
export { getRevenueModels } from './revenue-models'

type RevenueStreamInsert = Database['public']['Tables']['revenue_streams']['Insert']
type RevenueStreamUpdate = Database['public']['Tables']['revenue_streams']['Update']

/**
 * Get all revenue streams (Executive only)
 */
export async function getRevenueStreams() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('revenue_streams')
    .select(`
      *,
      revenue_model:revenue_models(id, name)
    `)
    .order('created_at', { ascending: false })

  return { data, error }
}

/**
 * Get a single revenue stream (Executive only)
 */
export async function getRevenueStream(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('revenue_streams')
    .select(`
      *,
      revenue_model:revenue_models(id, name)
    `)
    .eq('id', id)
    .single()

  return { data, error }
}

/**
 * Create a revenue stream (Executive only)
 */
export async function createRevenueStream(revenueStream: Omit<RevenueStreamInsert, 'created_by' | 'code' | 'ticket_size'> & { code?: string; ticket_size?: 'low' | 'mid' | 'high' }) {
  const supabase = await createClient()
  // Generate code from name if not provided
  const code = revenueStream.code || revenueStream.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
  const ticket_size = revenueStream.ticket_size || 'mid'
  
  const { data, error } = await supabase
    .from('revenue_streams')
    .insert({
      name: revenueStream.name,
      code,
      revenue_model_id: revenueStream.revenue_model_id || null,
      ticket_size,
      is_active: revenueStream.is_active ?? true,
    })
    .select(`
      *,
      revenue_model:revenue_models(id, name)
    `)
    .single()

  return { data, error }
}

/**
 * Update a revenue stream (Executive only)
 */
export async function updateRevenueStream(id: string, updates: Partial<RevenueStreamUpdate>) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('revenue_streams')
    .update(updates)
    .eq('id', id)
    .select(`
      *,
      revenue_model:revenue_models(id, name)
    `)
    .single()

  return { data, error }
}

/**
 * Deactivate a revenue stream (Executive only)
 */
export async function deactivateRevenueStream(id: string) {
  return updateRevenueStream(id, { is_active: false })
}

/**
 * Activate a revenue stream (Executive only)
 */
export async function activateRevenueStream(id: string) {
  return updateRevenueStream(id, { is_active: true })
}

