'use server'

import { createClient, createAdminClient } from '@/lib/supabase/server'

async function requireAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' as const }

  const adminClient = createAdminClient()

  const { data: profile } = await adminClient
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') return { error: 'Not authorized' as const }
  return { error: null, adminClient }
}

export async function getPendingVendors() {
  const result = await requireAdmin()
  if (result.error || !result.adminClient) return { error: result.error || 'Unknown error', data: [] }

  const { data, error: queryError } = await result.adminClient
    .from('users')
    .select('id, first_name, last_name, email, zip_code, created_at')
    .eq('role', 'pending_vendor')
    .order('created_at', { ascending: false })

  if (queryError) return { error: queryError.message, data: [] }
  return { data: data || [] }
}

export async function getApprovedVendors() {
  const result = await requireAdmin()
  if (result.error || !result.adminClient) return { error: result.error || 'Unknown error', data: [] }

  const { data, error: queryError } = await result.adminClient
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
  const result = await requireAdmin()
  if (result.error || !result.adminClient) return { error: result.error || 'Unknown error', data: [] }

  const { data, error: queryError } = await result.adminClient
    .from('stores')
    .select('id, name, address')
    .order('name')

  if (queryError) return { error: queryError.message, data: [] }
  return { data: data || [] }
}

export async function getAdminStats() {
  const result = await requireAdmin()
  if (result.error || !result.adminClient) return { pendingCount: 0, approvedCount: 0, totalUsers: 0 }

  const [pending, approved, total] = await Promise.all([
    result.adminClient.from('users').select('id', { count: 'exact', head: true }).eq('role', 'pending_vendor'),
    result.adminClient.from('users').select('id', { count: 'exact', head: true }).eq('role', 'vendor'),
    result.adminClient.from('users').select('id', { count: 'exact', head: true }),
  ])

  return {
    pendingCount: pending.count || 0,
    approvedCount: approved.count || 0,
    totalUsers: total.count || 0,
  }
}

export async function approveVendor(userId: string, storeId?: string) {
  const result = await requireAdmin()
  if (result.error || !result.adminClient) return { error: result.error || 'Unknown error' }

  const { error: roleError } = await result.adminClient
    .from('users')
    .update({ role: 'vendor' })
    .eq('id', userId)

  if (roleError) return { error: roleError.message }

  if (storeId) {
    const { error: vendorError } = await result.adminClient
      .from('vendors')
      .insert({ user_id: userId, store_id: storeId })

    if (vendorError) return { error: vendorError.message }
  }

  return { success: true }
}

export async function rejectVendor(userId: string) {
  const result = await requireAdmin()
  if (result.error || !result.adminClient) return { error: result.error || 'Unknown error' }

  const { error: updateError } = await result.adminClient
    .from('users')
    .update({ role: 'rejected' })
    .eq('id', userId)

  if (updateError) return { error: updateError.message }
  return { success: true }
}
