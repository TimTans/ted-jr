'use server'

import { createClient } from '@/lib/supabase/server'

async function requireAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' as const, supabase: null }

  const { data: profile } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') return { error: 'Not authorized' as const, supabase: null }
  return { error: null, supabase }
}

export async function getPendingVendors() {
  const { supabase, error } = await requireAdmin()
  if (error || !supabase) return { error: error || 'Unknown error', data: [] }

  const { data, error: queryError } = await supabase
    .from('users')
    .select('id, first_name, last_name, email, zip_code, created_at')
    .eq('role', 'pending_vendor')
    .order('created_at', { ascending: false })

  if (queryError) return { error: queryError.message, data: [] }
  return { data: data || [] }
}

export async function getApprovedVendors() {
  const { supabase, error } = await requireAdmin()
  if (error || !supabase) return { error: error || 'Unknown error', data: [] }

  const { data, error: queryError } = await supabase
    .from('users')
    .select(`
      id, first_name, last_name, email, zip_code, created_at, last_login_at,
      vendors (
        id,
        store_id,
        stores (
          id, name, address
        )
      )
    `)
    .eq('role', 'vendor')
    .order('created_at', { ascending: false })

  if (queryError) return { error: queryError.message, data: [] }
  return { data: data || [] }
}

export async function getStores() {
  const { supabase, error } = await requireAdmin()
  if (error || !supabase) return { error: error || 'Unknown error', data: [] }

  const { data, error: queryError } = await supabase
    .from('stores')
    .select('id, name, address')
    .order('name')

  if (queryError) return { error: queryError.message, data: [] }
  return { data: data || [] }
}

export async function getAdminStats() {
  const { supabase, error } = await requireAdmin()
  if (error || !supabase) return { pendingCount: 0, approvedCount: 0, totalUsers: 0 }

  const [pending, approved, total] = await Promise.all([
    supabase.from('users').select('id', { count: 'exact', head: true }).eq('role', 'pending_vendor'),
    supabase.from('users').select('id', { count: 'exact', head: true }).eq('role', 'vendor'),
    supabase.from('users').select('id', { count: 'exact', head: true }),
  ])

  return {
    pendingCount: pending.count || 0,
    approvedCount: approved.count || 0,
    totalUsers: total.count || 0,
  }
}

export async function approveVendor(userId: string, storeId?: string) {
  const { supabase, error } = await requireAdmin()
  if (error || !supabase) return { error: error || 'Unknown error' }

  const { error: roleError } = await supabase
    .from('users')
    .update({ role: 'vendor' })
    .eq('id', userId)

  if (roleError) return { error: roleError.message }

  if (storeId) {
    const { error: vendorError } = await supabase
      .from('vendors')
      .insert({ user_id: userId, store_id: storeId })

    if (vendorError) return { error: vendorError.message }
  }

  return { success: true }
}

export async function rejectVendor(userId: string) {
  const { supabase, error } = await requireAdmin()
  if (error || !supabase) return { error: error || 'Unknown error' }

  const { error: updateError } = await supabase
    .from('users')
    .update({ role: 'rejected' })
    .eq('id', userId)

  if (updateError) return { error: updateError.message }
  return { success: true }
}
