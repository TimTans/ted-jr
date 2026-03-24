'use server'

import { createClient } from '@/lib/supabase/server'

export async function getWeeklyBudget() {
    const supabase = await createClient() 
    const { data : { user} } = await supabase.auth.getUser()
    if (!user) return null
    const { data, error } = await supabase
    .from('user_preferences')
    .select('weekly_budget')
    .eq('user_id', user.id)
    .single()
    if (error || !data) return null
    return data.weekly_budget
}

export async function saveWeeklyBudget(weeklyBudget: number) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Not authenticated' }
    const { error } = await supabase
    .from('user_preferences')
    .update({ weekly_budget: weeklyBudget })
    .eq('user_id', user.id)
    .single()
    if (error) return { error: error.message }
    return { success: true }
}