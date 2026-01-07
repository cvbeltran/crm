'use server'

import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/types/supabase'

type AccountInsert = Database['public']['Tables']['accounts']['Insert']
type AccountUpdate = Database['public']['Tables']['accounts']['Update']

/**
 * Get all accounts
 */
export async function getAccounts() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('accounts')
    .select('*')
    .order('created_at', { ascending: false })

  return { data, error }
}

/**
 * Get a single account
 */
export async function getAccount(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('accounts')
    .select('*')
    .eq('id', id)
    .single()

  return { data, error }
}

/**
 * Create a new account
 */
export async function createAccount(account: AccountInsert) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('accounts')
    .insert(account)
    .select()
    .single()

  return { data, error }
}

/**
 * Update an account
 */
export async function updateAccount(id: string, updates: AccountUpdate) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('accounts')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  return { data, error }
}

