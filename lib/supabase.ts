import { createClient } from "@supabase/supabase-js";

// Server-side Supabase client with service role key
// This bypasses Row Level Security and should only be used in API routes

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error("Missing Supabase environment variables");
}

export const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// Types for our users table
export interface SupabaseUser {
  id: string;
  email: string;
  name: string | null;
  picture: string | null;
  cart_id: string | null;
  wishlist_product_ids: string[];
  created_at: string;
  updated_at: string;
}
