'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function login(formData: FormData) {
  const supabase = await createClient()

  const {data, error } = await supabase.auth.signInWithPassword({
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  })

  if (error) {
    redirect('/auth/login?error=' + encodeURIComponent(error.message))
  }

  const { data: profile } = await supabase
    .from('users')
    .select('role')
    .eq('id', data.user.id)
    .single()

  const metadataRole = data.user.user_metadata?.role as string | undefined
  const role = profile?.role ?? metadataRole

  if (role === 'admin') {
    revalidatePath('/admin', 'layout')
    redirect('/admin')
  }

  if (role === 'vendor') {
    revalidatePath('/vendordashboard', 'layout')
    redirect('/vendordashboard')
  }

  if (role === 'pending_vendor') {
    redirect('/auth/pending-approval')
  }

  // Default: shopper
  revalidatePath('/dashboard', 'layout')
  redirect('/dashboard')
}