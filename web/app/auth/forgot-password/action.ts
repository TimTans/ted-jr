'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { headers } from 'next/headers'

export async function resetPassword(formData: FormData) {
  const supabase = await createClient()
  const email = formData.get('email') as string

  if (!email) {
    redirect(
      '/auth/forgot-password?error=' +
        encodeURIComponent('Please enter your email address')
    )
  }

  const headersList = await headers()
  const origin = headersList.get('origin') || ''

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?next=/auth/reset-password`,
  })

  if (error) {
    redirect(
      '/auth/forgot-password?error=' + encodeURIComponent(error.message)
    )
  }

  redirect('/auth/forgot-password?success=true')
}
