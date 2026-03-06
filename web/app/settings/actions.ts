'use server'

import { createClient } from '@/lib/supabase/server'

export async function getRoutePreferences() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  const { data, error } = await supabase
    .from('user_preferences')
    .select('optimization_mode, max_radius_km, max_stops, travel_mode')
    .eq('user_id', user.id)
    .single()

  if (error || !data) return null

  return {
    optimization_mode: data.optimization_mode as string[],
    travel_mode: data.travel_mode as string[],
    max_radius_km: data.max_radius_km as number | null,
    max_stops: data.max_stops as number | null,
  }
}

export async function saveRoutePreferences(prefs: {
  optimization_mode: string[]
  travel_mode: string[]
  max_radius_km: number
  max_stops: number
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'Not authenticated' }

  const { error } = await supabase
    .from('user_preferences')
    .upsert(
      {
        user_id: user.id,
        optimization_mode: prefs.optimization_mode,
        travel_mode: prefs.travel_mode,
        max_radius_km: prefs.max_radius_km,
        max_stops: prefs.max_stops,
      },
      { onConflict: 'user_id' }
    )

  if (error) return { error: error.message }
  return { success: true }
}

export async function getDietaryPreferences() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  const [dietResult, nutrientResult] = await Promise.all([
    supabase
      .from('user_diet_preferences')
      .select('dietary_tags(name)')
      .eq('user_id', user.id),
    supabase
      .from('user_preferences')
      .select('sodium_enabled, sodium_limit, cholesterol_enabled, cholesterol_limit, sugar_enabled, sugar_limit')
      .eq('user_id', user.id)
      .single(),
  ])

  const dietary = (dietResult.data ?? []).map(
    (row: { dietary_tags: { name: string }[] | null }) => row.dietary_tags?.[0]?.name
  ).filter(Boolean) as string[]

  const n = nutrientResult.data

  return {
    dietary,
    nutrients: n ? {
      sodium: { enabled: n.sodium_enabled as boolean, value: Number(n.sodium_limit) },
      cholesterol: { enabled: n.cholesterol_enabled as boolean, value: Number(n.cholesterol_limit) },
      sugar: { enabled: n.sugar_enabled as boolean, value: Number(n.sugar_limit) },
    } : null,
  }
}

export async function saveDietaryPreferences(prefs: {
  dietary: string[]
  nutrients: {
    sodium: { enabled: boolean; value: number }
    cholesterol: { enabled: boolean; value: number }
    sugar: { enabled: boolean; value: number }
  }
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'Not authenticated' }

  // Save dietary tag selections
  if (prefs.dietary.length > 0) {
    // Look up dietary_tag IDs for the selected names
    // First check if we can read dietary_tags at all (RLS check)
    const { data: allTags, error: allTagsError } = await supabase
      .from('dietary_tags')
      .select('id, name')

    if (allTagsError) return { error: `Cannot read dietary_tags: ${allTagsError.message}` }
    if (!allTags || allTags.length === 0) {
      return { error: 'dietary_tags table is empty or RLS is blocking reads. Check RLS policies.' }
    }

    // Match by lowercased name
    const lowerDietary = prefs.dietary.map((d) => d.toLowerCase())
    const tags = allTags.filter((t) => lowerDietary.includes(t.name.toLowerCase()))

    if (tags.length === 0) {
      const dbNames = allTags.map((t) => t.name).join(', ')
      return { error: `Name mismatch. DB has: [${dbNames}]. UI sent: [${prefs.dietary.join(', ')}]` }
    }

    // Replace user_diet_preferences: delete old, insert new
    const { error: deleteError } = await supabase
      .from('user_diet_preferences')
      .delete()
      .eq('user_id', user.id)

    if (deleteError) return { error: `Delete failed: ${deleteError.message}` }

    const { error: insertError } = await supabase
      .from('user_diet_preferences')
      .insert(tags.map((t) => ({ user_id: user.id, dietary_tag_id: t.id })))

    if (insertError) return { error: `Insert failed: ${insertError.message}` }
  } else {
    // No dietary tags selected — clear existing ones
    const { error: deleteError } = await supabase
      .from('user_diet_preferences')
      .delete()
      .eq('user_id', user.id)

    if (deleteError) return { error: `Delete failed: ${deleteError.message}` }
  }

  // Upsert nutritional limits on user_preferences
  const { error: nutrientError } = await supabase
    .from('user_preferences')
    .upsert(
      {
        user_id: user.id,
        sodium_enabled: prefs.nutrients.sodium.enabled,
        sodium_limit: prefs.nutrients.sodium.value,
        cholesterol_enabled: prefs.nutrients.cholesterol.enabled,
        cholesterol_limit: prefs.nutrients.cholesterol.value,
        sugar_enabled: prefs.nutrients.sugar.enabled,
        sugar_limit: prefs.nutrients.sugar.value,
      },
      { onConflict: 'user_id' }
    )

  if (nutrientError) return { error: nutrientError.message }
  return { success: true }
}
