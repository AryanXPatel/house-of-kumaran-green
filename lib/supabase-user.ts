import { supabase, type SupabaseUser } from "./supabase";

/**
 * Get user by email
 */
export async function getUserByEmail(
  email: string
): Promise<SupabaseUser | null> {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", email.toLowerCase())
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      // No rows returned - user doesn't exist
      return null;
    }
    console.error("Error fetching user:", error);
    throw error;
  }

  return data;
}

/**
 * Create or update a user (upsert)
 * Used after Google OAuth verification
 */
export async function upsertUser(
  email: string,
  name?: string | null,
  picture?: string | null,
  shopifyCustomerId?: string | null
): Promise<SupabaseUser> {
  // Build the upsert data - only include shopify_customer_id if provided
  const upsertData: Record<string, unknown> = {
    email: email.toLowerCase(),
    name: name || null,
    picture: picture || null,
  };

  // Only update shopify_customer_id if explicitly provided
  if (shopifyCustomerId !== undefined) {
    upsertData.shopify_customer_id = shopifyCustomerId;
  }

  const { data, error } = await supabase
    .from("users")
    .upsert(upsertData, {
      onConflict: "email",
      ignoreDuplicates: false,
    })
    .select()
    .single();

  if (error) {
    console.error("Error upserting user:", error);
    throw error;
  }

  return data;
}

/**
 * Update user's cart ID
 * Called when cart changes and user is logged in
 */
export async function updateCartId(
  email: string,
  cartId: string | null
): Promise<void> {
  const { error } = await supabase
    .from("users")
    .update({ cart_id: cartId })
    .eq("email", email.toLowerCase());

  if (error) {
    console.error("Error updating cart ID:", error);
    throw error;
  }
}

/**
 * Update user's wishlist product IDs
 * Called when wishlist changes and user is logged in
 */
export async function updateWishlist(
  email: string,
  productIds: string[]
): Promise<void> {
  const { error } = await supabase
    .from("users")
    .update({ wishlist_product_ids: productIds })
    .eq("email", email.toLowerCase());

  if (error) {
    console.error("Error updating wishlist:", error);
    throw error;
  }
}

/**
 * Get user's saved cart ID
 */
export async function getCartId(email: string): Promise<string | null> {
  const { data, error } = await supabase
    .from("users")
    .select("cart_id")
    .eq("email", email.toLowerCase())
    .single();

  if (error) {
    if (error.code === "PGRST116") return null;
    console.error("Error fetching cart ID:", error);
    throw error;
  }

  return data?.cart_id || null;
}

/**
 * Get user's saved wishlist product IDs
 */
export async function getWishlistProductIds(email: string): Promise<string[]> {
  const { data, error } = await supabase
    .from("users")
    .select("wishlist_product_ids")
    .eq("email", email.toLowerCase())
    .single();

  if (error) {
    if (error.code === "PGRST116") return [];
    console.error("Error fetching wishlist:", error);
    throw error;
  }

  return data?.wishlist_product_ids || [];
}

/**
 * Update user's Shopify customer ID
 */
export async function updateShopifyCustomerId(
  email: string,
  shopifyCustomerId: string
): Promise<void> {
  const { error } = await supabase
    .from("users")
    .update({ shopify_customer_id: shopifyCustomerId })
    .eq("email", email.toLowerCase());

  if (error) {
    console.error("Error updating Shopify customer ID:", error);
    throw error;
  }
}

/**
 * Get user's Shopify customer ID
 */
export async function getShopifyCustomerId(
  email: string
): Promise<string | null> {
  const { data, error } = await supabase
    .from("users")
    .select("shopify_customer_id")
    .eq("email", email.toLowerCase())
    .single();

  if (error) {
    if (error.code === "PGRST116") return null;
    console.error("Error fetching Shopify customer ID:", error);
    throw error;
  }

  return data?.shopify_customer_id || null;
}
