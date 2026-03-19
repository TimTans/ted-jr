'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function signup(formData: FormData) {
    const supabase = await createClient()

    const first_name = formData.get('first_name') as string;
    const last_name = formData.get('last_name') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const confirm_password = formData.get('confirm_password') as string;
    const is_vendor = formData.get('account_type') === 'vendor';

    if (password !== confirm_password) {
      redirect('/auth/register?error=' + encodeURIComponent('Passwords do not match'))
    }

    const role = is_vendor ? 'pending_vendor' : 'shopper';
  
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name,
          last_name,
          role,
        },
      },
    })
  
    if (error) {
      redirect('/auth/register?error=' + encodeURIComponent(error.message))
    }

    if (is_vendor && data.user) {
      await supabase
        .from('users')
        .update({ role: 'pending_vendor' })
        .eq('id', data.user.id)
    }

    if (is_vendor) {
      redirect('/auth/pending-approval')
    }
  
    revalidatePath('/', 'layout')
    redirect('/')
  }