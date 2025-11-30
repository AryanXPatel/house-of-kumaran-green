// Product Service
// Provides a unified interface for fetching products from either static data or Shopify
// Switch between modes using environment variable USE_SHOPIFY=true

import { Product, Category, CategoryInfo } from "./types";
import {
  products as staticProducts,
  categories as staticCategories,
  getProductBySlug as getStaticProductBySlug,
  getProductsByCategory as getStaticProductsByCategory,
  searchProducts as staticSearchProducts,
  getBestsellers as getStaticBestsellers,
  getNewArrivals as getStaticNewArrivals,
} from "./products";
import {
  getAllProducts,
  getProductByHandle,
  getProductsByCollection,
  searchProducts as shopifySearchProducts,
  shopifyToProduct,
} from "./shopify";

// Configuration
const USE_SHOPIFY = process.env.NEXT_PUBLIC_USE_SHOPIFY === "true";

// Cache for Shopify products (simple in-memory cache)
let shopifyProductsCache: Product[] | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// ===== PRODUCT FETCHING =====

export async function getProducts(): Promise<Product[]> {
  if (!USE_SHOPIFY) {
    return staticProducts;
  }

  // Check cache
  if (shopifyProductsCache && Date.now() - cacheTimestamp < CACHE_DURATION) {
    return shopifyProductsCache;
  }

  try {
    const shopifyProducts = await getAllProducts();
    shopifyProductsCache = shopifyProducts.map(shopifyToProduct);
    cacheTimestamp = Date.now();
    return shopifyProductsCache;
  } catch (error) {
    console.error(
      "Error fetching Shopify products, falling back to static:",
      error
    );
    return staticProducts;
  }
}

export async function getProductBySlug(
  slug: string
): Promise<Product | undefined> {
  if (!USE_SHOPIFY) {
    return getStaticProductBySlug(slug);
  }

  try {
    const shopifyProduct = await getProductByHandle(slug);
    if (shopifyProduct) {
      return shopifyToProduct(shopifyProduct);
    }
    // Fallback to static if not found in Shopify
    return getStaticProductBySlug(slug);
  } catch (error) {
    console.error("Error fetching product from Shopify:", error);
    return getStaticProductBySlug(slug);
  }
}

export async function getProductsByCategory(
  category: Category
): Promise<Product[]> {
  if (!USE_SHOPIFY) {
    return getStaticProductsByCategory(category);
  }

  try {
    // In Shopify, categories are collections
    const collectionHandle = categoryToCollection(category);
    const shopifyProducts = await getProductsByCollection(collectionHandle);
    return shopifyProducts.map(shopifyToProduct);
  } catch (error) {
    console.error("Error fetching products by category from Shopify:", error);
    return getStaticProductsByCategory(category);
  }
}

export async function searchProducts(query: string): Promise<Product[]> {
  if (!USE_SHOPIFY) {
    return staticSearchProducts(query);
  }

  try {
    const shopifyProducts = await shopifySearchProducts(query);
    return shopifyProducts.map(shopifyToProduct);
  } catch (error) {
    console.error("Error searching products in Shopify:", error);
    return staticSearchProducts(query);
  }
}

export async function getBestsellers(): Promise<Product[]> {
  if (!USE_SHOPIFY) {
    return getStaticBestsellers();
  }

  try {
    // Fetch from Shopify "Bestsellers" collection
    const shopifyProducts = await getProductsByCollection("bestsellers");
    if (shopifyProducts.length > 0) {
      return shopifyProducts.map(shopifyToProduct);
    }
    // Fallback to tag search if collection is empty
    const taggedProducts = await shopifySearchProducts("tag:bestseller");
    return taggedProducts.map(shopifyToProduct);
  } catch (error) {
    console.error("Error fetching bestsellers from Shopify:", error);
    return getStaticBestsellers();
  }
}

export async function getNewArrivals(): Promise<Product[]> {
  if (!USE_SHOPIFY) {
    return getStaticNewArrivals();
  }

  try {
    // Fetch from Shopify "New & Popular" collection (handle: new-popular or new-and-popular)
    let shopifyProducts = await getProductsByCollection("new-popular");
    if (shopifyProducts.length === 0) {
      shopifyProducts = await getProductsByCollection("new-and-popular");
    }
    if (shopifyProducts.length > 0) {
      return shopifyProducts.map(shopifyToProduct);
    }
    // Fallback to tag search if collection is empty
    const taggedProducts = await shopifySearchProducts(
      "tag:new-arrival OR tag:new OR tag:popular"
    );
    return taggedProducts.map(shopifyToProduct);
  } catch (error) {
    console.error("Error fetching new arrivals from Shopify:", error);
    return getStaticNewArrivals();
  }
}

export async function getNewAndPopular(): Promise<Product[]> {
  if (!USE_SHOPIFY) {
    // Fallback to static new arrivals or any products
    const newArrivals = getStaticNewArrivals();
    if (newArrivals.length > 0) return newArrivals;
    return staticProducts.slice(0, 8); // Return some products as fallback
  }

  try {
    // Try multiple collection handle variations
    const collectionHandles = [
      "new-popular",
      "new-and-popular",
      "new-arrivals",
      "popular",
    ];

    for (const handle of collectionHandles) {
      try {
        const shopifyProducts = await getProductsByCollection(handle);
        if (shopifyProducts.length > 0) {
          console.log(`Found products in collection: ${handle}`);
          return shopifyProducts.map(shopifyToProduct);
        }
      } catch {
        // Collection doesn't exist, try next
        console.log(`Collection ${handle} not found, trying next...`);
      }
    }

    // Fallback to tag search
    const taggedProducts = await shopifySearchProducts(
      "tag:new OR tag:popular OR tag:new-arrival"
    );
    if (taggedProducts.length > 0) {
      return taggedProducts.map(shopifyToProduct);
    }

    // Final fallback - return some static products
    const staticNewArrivals = getStaticNewArrivals();
    if (staticNewArrivals.length > 0) return staticNewArrivals;
    return staticProducts.slice(0, 8);
  } catch (error) {
    console.error("Error fetching new & popular from Shopify:", error);
    const staticNewArrivals = getStaticNewArrivals();
    if (staticNewArrivals.length > 0) return staticNewArrivals;
    return staticProducts.slice(0, 8);
  }
}

export async function getRelatedProducts(
  productSlug: string,
  category: Category
): Promise<Product[]> {
  if (!USE_SHOPIFY) {
    // Get related products from same category
    const categoryProducts = getStaticProductsByCategory(category);
    return categoryProducts.filter((p) => p.slug !== productSlug).slice(0, 4);
  }

  try {
    // Get products from same collection/category
    const categoryProducts = await getProductsByCategory(category);
    // Exclude current product and limit to 4
    return categoryProducts.filter((p) => p.slug !== productSlug).slice(0, 4);
  } catch (error) {
    console.error("Error fetching related products from Shopify:", error);
    // Fallback
    const categoryProducts = getStaticProductsByCategory(category);
    return categoryProducts.filter((p) => p.slug !== productSlug).slice(0, 4);
  }
}

// ===== CATEGORY DATA =====

export function getCategories(): CategoryInfo[] {
  // Categories are configured locally, not from Shopify
  return staticCategories;
}

export function getCategoryInfo(category: Category): CategoryInfo | undefined {
  return staticCategories.find((c) => c.slug === category);
}

// ===== UTILITY FUNCTIONS =====

// Map our category slugs to Shopify collection handles
function categoryToCollection(category: Category): string {
  const collectionMap: Record<Category, string> = {
    podis: "podis",
    pickles: "pickles-thokku",
    sweets: "sweets",
    savouries: "savouries",
    vadams: "vadams-appalam",
    "ready-to-mix": "ready-to-mix",
    vathals: "vathals",
  };
  return collectionMap[category] || category;
}

// Filter products by various criteria
export async function getFilteredProducts(filters: {
  category?: Category;
  minPrice?: number;
  maxPrice?: number;
  tags?: string[];
  search?: string;
  sortBy?: "price-asc" | "price-desc" | "name-asc" | "name-desc" | "rating";
}): Promise<Product[]> {
  let products = await getProducts();

  // Apply category filter
  if (filters.category) {
    products = products.filter((p) => p.category === filters.category);
  }

  // Apply price filter
  if (filters.minPrice !== undefined) {
    products = products.filter((p) => p.price >= filters.minPrice!);
  }
  if (filters.maxPrice !== undefined) {
    products = products.filter((p) => p.price <= filters.maxPrice!);
  }

  // Apply tags filter
  if (filters.tags && filters.tags.length > 0) {
    products = products.filter((p) =>
      filters.tags!.some((tag) => p.tags.includes(tag))
    );
  }

  // Apply search filter
  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    products = products.filter(
      (p) =>
        p.name.toLowerCase().includes(searchLower) ||
        p.description.toLowerCase().includes(searchLower) ||
        p.tags.some((tag) => tag.toLowerCase().includes(searchLower))
    );
  }

  // Apply sorting
  if (filters.sortBy) {
    switch (filters.sortBy) {
      case "price-asc":
        products.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        products.sort((a, b) => b.price - a.price);
        break;
      case "name-asc":
        products.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        products.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "rating":
        products.sort((a, b) => b.rating - a.rating);
        break;
    }
  }

  return products;
}

// Get all unique tags from products
export async function getAllTags(): Promise<string[]> {
  const products = await getProducts();
  const tags = new Set<string>();
  products.forEach((p) => p.tags.forEach((tag) => tags.add(tag)));
  return Array.from(tags).sort();
}

// Get price range
export async function getPriceRange(): Promise<{ min: number; max: number }> {
  const products = await getProducts();
  const prices = products.map((p) => p.price);
  return {
    min: Math.min(...prices),
    max: Math.max(...prices),
  };
}
