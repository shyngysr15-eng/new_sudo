import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Safe defaults for Next.js build-time prerendering
const fallbackUrl = supabaseUrl || 'https://placeholder-project.supabase.co';

// DEFENSIVE PROGRAMMING SAFEGUARD:
// Supabase JS library decodes the anon key as a JWT. If a key is passed that is
// not in valid 3-part JWT format (header.payload.signature), it will throw an
// unhandled base64 decoding error that crashes the entire React runtime, causing a blank "load error".
// We check if the key contains exactly 2 dots (3 segments) to guarantee it's a valid JWT.
// If it is not, we use a syntactically valid dummy JWT to keep the client from crashing on mount,
// allowing the login screen to render and gracefully show an auth network error instead.
const isValidJwt = supabaseAnonKey && supabaseAnonKey.split('.').length === 3;

const fallbackAnonKey = isValidJwt 
  ? supabaseAnonKey 
  : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1nbGZvbnZwaG10bWV4bGtrZ2ZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAxNTM4NzYsImV4cCI6MjA5NTc5NTg3Nn0.placeholder_signature_due_to_malformed_key';

if (!supabaseUrl || !supabaseAnonKey) {
  if (typeof window !== 'undefined') {
    console.warn(
      'Supabase environment variables are missing! ' +
      'Please check your .env.local file configuration.'
    );
  }
} else if (!isValidJwt) {
  if (typeof window !== 'undefined') {
    console.error(
      'CRITICAL: The NEXT_PUBLIC_SUPABASE_ANON_KEY provided in your .env.local ' +
      'is NOT a valid JWT (it is missing JWT segment dots). ' +
      'Please make sure you copied the long "anon / public" key, which starts with "eyJ...".'
    );
  }
}

export const supabase = createClient(fallbackUrl, fallbackAnonKey);
