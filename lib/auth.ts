import { createClient } from './supabase/server'
import type { UserRole } from './types/database'

export async function getCurrentUser() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export async function getUserProfile() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return null

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return profile
}

export async function getUserRole(): Promise<UserRole | null> {
  const profile = await getUserProfile()
  return profile?.role ?? null
}

export async function hasRole(role: UserRole): Promise<boolean> {
  const userRole = await getUserRole()
  return userRole === role
}

export async function hasAnyRole(roles: UserRole[]): Promise<boolean> {
  const userRole = await getUserRole()
  return userRole !== null && roles.includes(userRole)
}

