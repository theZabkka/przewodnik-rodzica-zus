import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

const DEFAULT_SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || 'https://placeholder-zus.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || 'placeholder-anon-key';

let browserClientInstance: SupabaseClient<Database> | null = null;

/**
 * Creates or retrieves a singleton client for client-side / browser components.
 */
export function getBrowserClient(
  supabaseUrl = DEFAULT_SUPABASE_URL,
  supabaseKey = DEFAULT_SUPABASE_ANON_KEY
): SupabaseClient<Database> {
  if (typeof window !== 'undefined' && browserClientInstance) {
    return browserClientInstance;
  }

  const client = createClient<Database>(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  });

  if (typeof window !== 'undefined') {
    browserClientInstance = client;
  }

  return client;
}

/**
 * Creates a new Supabase client instance suitable for server-side execution (RSC, Server Actions, Route Handlers).
 */
export function createServerClient(
  supabaseUrl = DEFAULT_SUPABASE_URL,
  supabaseKey = DEFAULT_SUPABASE_ANON_KEY
): SupabaseClient<Database> {
  return createClient<Database>(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

/**
 * Creates an admin client with service_role key (strictly for backend operations, seeds, and migrations).
 * NEVER expose this to client code or browser.
 */
export function createAdminClient(
  supabaseUrl = DEFAULT_SUPABASE_URL,
  serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || DEFAULT_SUPABASE_ANON_KEY
): SupabaseClient<Database> {
  return createClient<Database>(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

/**
 * Universal client accessor.
 */
export const getDatabaseClient = getBrowserClient;
