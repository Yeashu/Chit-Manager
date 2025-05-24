'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
  const supabase = await createClient()

  // Validate inputs
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    redirect('/login?message=Email and password are required')
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    console.error('Login error:', error)
    redirect('/login?message=Invalid login credentials')
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  // Validate inputs
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const fullName = formData.get('full_name') as string

  if (!email || !password) {
    redirect('/signup?message=Email and password are required')
  }

  // First, create the auth user
  const { data: authData, error: signupError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/confirm`,
      data: {
        full_name: fullName,
      }
    }
  })

  if (signupError) {
    console.error('Signup error:', signupError)
    if (signupError.message.includes('already registered')) {
      redirect('/signup?message=User already exists')
    } else if (signupError.message.includes('Password')) {
      redirect('/signup?message=Password is too short')
    } else {
      redirect('/signup?message=Error creating account')
    }
  }

  if (authData.user) {
    // Then create the user profile
    const { error: profileError } = await supabase
      .from('user_profile')
      .insert({
        user_id: authData.user.id,
        name: fullName,
        email: email,
        created_at: new Date().toISOString()
      })

    if (profileError) {
      console.error('Profile creation error:', profileError)
      // We could handle this more gracefully, but for now we'll continue
      // since the auth user is created and they can try setting up their profile later
    }
  }

  redirect('/login?message=Check your email to confirm your account')
}

export async function logout() {
  try {
    const supabase = await createClient()
    
    const { error } = await supabase.auth.signOut()
    
    if (error) {
      console.error('Logout error:', error)
    }
    
    revalidatePath('/', 'layout')
    redirect('/login')
  } catch (error) {
    console.error('Unexpected logout error:', error)
    redirect('/login')
  }
}

export async function getUser() {
  const supabase = await createClient()
  
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error) {
    return null
  }
  
  return user
}
