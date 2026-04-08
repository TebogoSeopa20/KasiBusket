import { createClient } from '@supabase/supabase-js';
import { supabaseUrl, publicAnonKey, assertSupabaseConfig } from './info';

assertSupabaseConfig();

export const supabase = supabaseUrl && publicAnonKey
  ? createClient(supabaseUrl, publicAnonKey, {
      auth: {
        // use browser-storage local for redirect persistence
        persistSession: true,
        detectSessionInUrl: true,
      },
    })
  : createClient('https://invalid.supabase.co', 'invalid', {
      auth: { persistSession: false, detectSessionInUrl: false },
    });

