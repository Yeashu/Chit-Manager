'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
  const supabase = await createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    redirect('/error')
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  if (formData.get("password") !== formData.get("confirm-password")) {
    console.error("Passwords do not match");
  }

  if (formData.get("email") === null || formData.get("password") === null) {
    console.error("Email or password is null");
  }
  const password = formData.get("password") as string;
  if (password?.length < 6) {
    console.error("Password is too short");
  }

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    name : formData.get('name') as string,
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signUp(data)

  if (error) {
    redirect('/error')
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function signOut() {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error("Error signing out:", error.message);
  } else {
    console.log("User signed out successfully");
    redirect("/");
  }
}