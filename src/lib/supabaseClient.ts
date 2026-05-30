import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Use dummy placeholder credentials during build time if environment variables are missing,
// preventing Next.js static prerender errors (e.g. "supabaseUrl is required").
const fallbackUrl = supabaseUrl || 'https://placeholder-project.supabase.co';
const fallbackAnonKey = supabaseAnonKey || 'placeholder-anon-key';

if (!supabaseUrl || !supabaseAnonKey) {
  if (typeof window !== 'undefined') {
    console.warn(
      'Supabase environment variables are missing! ' +
      'Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your .env.local file.'
    );
  }
}

export const supabase = createClient(fallbackUrl, fallbackAnonKey);
