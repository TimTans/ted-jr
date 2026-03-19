'use server'

import { createClient } from '@/lib/supabase/server'

async function requireVendor() {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) return { error: `Not authenticated: ${authError?.message || 'No user session'}` as const }

  const { data: profile, error: profileError } = await supabase
    .from('users')
    .select('role, first_name')
    .eq('id', user.id)
    .single()

  if (profileError) return { error: `Profile query failed: ${profileError.message}` as const }
  if (profile?.role !== 'vendor') return { error: `Not authorized (role: ${profile?.role || 'unknown'})` as const }

  const { data: vendor, error: vendorError } = await supabase
    .from('vendors')
    .select('id, store_id')
    .eq('user_id', user.id)
    .single()

  if (vendorError) return { error: `Vendor query failed: ${vendorError.message}` as const }
  if (!vendor?.store_id) return { error: 'No store assigned' as const }

  return { error: null, supabase, storeId: vendor.store_id, firstName: profile.first_name }
}

export async function getVendorDashboardData() {
  const result = await requireVendor()
  if (result.error || !result.supabase) {
    return { error: result.error || 'Unknown error' }
  }

  const { supabase, storeId, firstName } = result

  const [storeResult, productsResult, reviewsResult] = await Promise.all([
    supabase
      .from('stores')
      .select('name, address, phone, website_url, zip_code')
      .eq('id', storeId)
      .single(),

    supabase
      .from('store_products')
      .select(`
        id,
        price,
        sale_price,
        in_stock,
        data_source,
        updated_at,
        products (
          name,
          brand,
          unit_type,
          product_categories (
            name
          )
        )
      `)
      .eq('store_id', storeId)
      .order('updated_at', { ascending: false }),

    supabase
      .rpc('get_store_reviews_with_names', { p_store_id: storeId }),
  ])

  if (storeResult.error) return { error: storeResult.error.message }

  // Fetch price history for all store products
  const storeProductIds = (productsResult.data || []).map(sp => sp.id)
  let priceHistory: Record<string, Array<{ price: number; sale_price: number | null; recorded_at: string }>> = {}

  if (storeProductIds.length > 0) {
    const { data: historyData } = await supabase
      .from('store_product_price_history')
      .select('store_product_id, price, sale_price, recorded_at')
      .in('store_product_id', storeProductIds)
      .order('recorded_at', { ascending: true })

    if (historyData) {
      for (const h of historyData) {
        if (!priceHistory[h.store_product_id]) {
          priceHistory[h.store_product_id] = []
        }
        priceHistory[h.store_product_id].push({
          price: Number(h.price),
          sale_price: h.sale_price ? Number(h.sale_price) : null,
          recorded_at: h.recorded_at,
        })
      }
    }
  }

  const products = (productsResult.data || []).map(sp => {
    const product = sp.products as any
    return {
      id: sp.id,
      name: product?.name || 'Unknown',
      brand: product?.brand || null,
      category: product?.product_categories?.name || 'Uncategorized',
      unit_type: product?.unit_type || '',
      price: Number(sp.price),
      sale_price: sp.sale_price ? Number(sp.sale_price) : null,
      in_stock: sp.in_stock,
      data_source: sp.data_source,
      updated_at: sp.updated_at,
    }
  })

  const reviews = (reviewsResult.data || []).map((r: any) => ({
    rating: r.rating,
    comment: r.comment,
    user_name: r.reviewer_name || 'Anonymous',
    created_at: r.created_at,
  }))

  return {
    store: storeResult.data,
    products,
    reviews,
    priceHistory,
    vendorFirstName: firstName,
  }
}

export async function updateProductPrice(storeProductId: string, price: number, salePrice: number | null) {
  const result = await requireVendor()
  if (result.error || !result.supabase) return { error: result.error || 'Unknown error' }

  const { supabase } = result

  const { error: updateError } = await supabase
    .from('store_products')
    .update({
      price,
      sale_price: salePrice,
      data_source: 'vendor',
      updated_at: new Date().toISOString(),
    })
    .eq('id', storeProductId)

  if (updateError) return { error: updateError.message }

  // Record price history
  await supabase
    .from('store_product_price_history')
    .insert({
      store_product_id: storeProductId,
      price,
      sale_price: salePrice,
    })

  return { success: true }
}

export async function toggleProductStock(storeProductId: string) {
  const result = await requireVendor()
  if (result.error || !result.supabase) return { error: result.error || 'Unknown error' }

  const { supabase } = result

  // Read current stock status
  const { data: sp } = await supabase
    .from('store_products')
    .select('in_stock')
    .eq('id', storeProductId)
    .single()

  if (!sp) return { error: 'Product not found' }

  const { error: updateError } = await supabase
    .from('store_products')
    .update({
      in_stock: !sp.in_stock,
      data_source: 'vendor',
      updated_at: new Date().toISOString(),
    })
    .eq('id', storeProductId)

  if (updateError) return { error: updateError.message }
  return { success: true, in_stock: !sp.in_stock }
}
