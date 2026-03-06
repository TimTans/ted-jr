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
