'use client';

import { createClient } from '@supabase/supabase-js';

/**
 * Client-side Supabase client for browser usage
 * This client respects RLS policies and uses cookies for authentication
 */
export function createBrowserClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY');
  }

  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });
}

/**
 * Get the current authenticated user ID (client-side)
 */
export async function getCurrentUserId(): Promise<string | null> {
  const supabase = createBrowserClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error) {
    console.error('Error getting user:', error);
    return null;
  }
  
  return user?.id || null;
}

/**
 * Get the current authenticated user (client-side)
 */
export async function getCurrentUser() {
  const supabase = createBrowserClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error) {
    console.error('Error getting user:', error);
    return null;
  }
  
  return user;
}

/**
 * Sign in with email and password
 */
export async function signIn(email: string, password: string) {
  const supabase = createBrowserClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  return { data, error };
}

/**
 * Sign up with email and password
 */
export async function signUp(email: string, password: string) {
  const supabase = createBrowserClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  
  return { data, error };
}

/**
 * Sign out the current user
 */
export async function signOut() {
  const supabase = createBrowserClient();
  const { error } = await supabase.auth.signOut();
  return { error };
}

