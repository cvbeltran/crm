import { createClient } from '@supabase/supabase-js'

/**
 * Creates a Supabase admin client with service role key.
 * This client bypasses RLS and should ONLY be used server-side.
 * 
 * Requires SUPABASE_SERVICE_ROLE_KEY environment variable.
 */
export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

  if (!serviceRoleKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY environment variable is not set')
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

