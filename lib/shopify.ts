// Shopify Storefront API Client
// Handles all GraphQL queries to the Shopify Storefront API

const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || "";
const storefrontAccessToken =
  process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN || "";
const apiVersion = process.env.NEXT_PUBLIC_SHOPIFY_API_VERSION || "2024-01";

// Validate environment variables (only error when actually making requests)
function validateEnv() {
  if (!domain || !storefrontAccessToken) {
    console.warn(
      "Shopify environment variables not configured. Using fallback data."
    );
    return false;
  }
  return true;
}

const endpoint = domain
  ? `https://${domain}/api/${apiVersion}/graphql.json`
  : "";

// Type definitions
export interface ShopifyImage {
  url: string;
  altText: string | null;
  width: number;
  height: number;
}

export interface ShopifyPrice {
  amount: string;
  currencyCode: string;
}

export interface ShopifyProductVariant {
  id: string;
  title: string;
  availableForSale: boolean;
  price: ShopifyPrice;
  compareAtPrice: ShopifyPrice | null;
  selectedOptions: { name: string; value: string }[];
  image: ShopifyImage | null;
}

export interface ShopifyProduct {
  id: string;
  handle: string;
  title: string;
  description: string;
  descriptionHtml: string;
  productType: string;
  vendor: string;
  tags: string[];
  availableForSale: boolean;
  priceRange: {
    minVariantPrice: ShopifyPrice;
    maxVariantPrice: ShopifyPrice;
  };
  compareAtPriceRange: {
    minVariantPrice: ShopifyPrice;
    maxVariantPrice: ShopifyPrice;
  };
  images: {
    edges: { node: ShopifyImage }[];
  };
  variants: {
    edges: { node: ShopifyProductVariant }[];
  };
  seo: {
    title: string | null;
    description: string | null;
  };
  metafields: {
    key: string;
    value: string;
    namespace: string;
  }[];
}

export interface ShopifyCollection {
  id: string;
  handle: string;
  title: string;
  description: string;
  image: ShopifyImage | null;
  products: {
    edges: { node: ShopifyProduct }[];
  };
}

export interface ShopifyCart {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  cost: {
    totalAmount: ShopifyPrice;
    subtotalAmount: ShopifyPrice;
    totalTaxAmount: ShopifyPrice | null;
  };
  lines: {
    edges: {
      node: {
        id: string;
        quantity: number;
        cost: {
          totalAmount: ShopifyPrice;
        };
        merchandise: {
          id: string;
          title: string;
          selectedOptions: { name: string; value: string }[];
          product: {
            id: string;
            handle: string;
            title: string;
            images: {
              edges: { node: ShopifyImage }[];
            };
          };
          price: ShopifyPrice;
          image: ShopifyImage | null;
        };
      };
    }[];
  };
}

// GraphQL Query Helper
async function shopifyFetch<T>({
  query,
  variables = {},
}: {
  query: string;
  variables?: Record<string, unknown>;
}): Promise<T> {
  // Check if Shopify is configured
  if (!validateEnv()) {
    throw new Error("Shopify not configured");
  }

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": storefrontAccessToken,
      },
      body: JSON.stringify({ query, variables }),
      cache: "no-store",
    });

    const json = await response.json();

    // If there are errors but also data, log warnings but return the data
    if (json.errors && json.data) {
      console.warn("Shopify API partial errors:", json.errors);
      return json.data;
    }

    // If only errors and no data, throw
    if (json.errors && !json.data) {
      console.error("Shopify API Error:", json.errors);
      throw new Error(json.errors[0]?.message || "Shopify API Error");
    }

    return json.data;
  } catch (error) {
    console.error("Shopify Fetch Error:", error);
    throw error;
  }
}

// Product Fragments for reusable queries
const PRODUCT_FRAGMENT = `
  fragment ProductFragment on Product {
    id
    handle
    title
    description
    descriptionHtml
    productType
    vendor
    tags
    availableForSale
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
      maxVariantPrice {
        amount
        currencyCode
      }
    }
    compareAtPriceRange {
      minVariantPrice {
        amount
        currencyCode
      }
      maxVariantPrice {
        amount
        currencyCode
      }
    }
    images(first: 10) {
      edges {
        node {
          url
          altText
          width
          height
        }
      }
    }
    variants(first: 10) {
      edges {
        node {
          id
          title
          availableForSale
          price {
            amount
            currencyCode
          }
          compareAtPrice {
            amount
            currencyCode
          }
          selectedOptions {
            name
            value
          }
          image {
            url
            altText
            width
            height
          }
        }
      }
    }
    seo {
      title
      description
    }
  }
`;

const CART_FRAGMENT = `
  fragment CartFragment on Cart {
    id
    checkoutUrl
    totalQuantity
    cost {
      totalAmount {
        amount
        currencyCode
      }
      subtotalAmount {
        amount
        currencyCode
      }
      totalTaxAmount {
        amount
        currencyCode
      }
    }
    lines(first: 100) {
      edges {
        node {
          id
          quantity
          cost {
            totalAmount {
              amount
              currencyCode
            }
          }
          merchandise {
            ... on ProductVariant {
              id
              title
              selectedOptions {
                name
                value
              }
              product {
                id
                handle
                title
                images(first: 1) {
                  edges {
                    node {
                      url
                      altText
                      width
                      height
                    }
                  }
                }
              }
              price {
                amount
                currencyCode
              }
              image {
                url
                altText
                width
                height
              }
            }
          }
        }
      }
    }
  }
`;

// ===== PRODUCT QUERIES =====

export async function getAllProducts(
  first: number = 100
): Promise<ShopifyProduct[]> {
  const query = `
    ${PRODUCT_FRAGMENT}
    query GetAllProducts($first: Int!) {
      products(first: $first) {
        edges {
          node {
            ...ProductFragment
          }
        }
      }
    }
  `;

  const data = await shopifyFetch<{
    products: { edges: { node: ShopifyProduct }[] };
  }>({
    query,
    variables: { first },
  });

  return data.products.edges.map((edge) => edge.node);
}

export async function getProductByHandle(
  handle: string
): Promise<ShopifyProduct | null> {
  const query = `
    ${PRODUCT_FRAGMENT}
    query GetProductByHandle($handle: String!) {
      product(handle: $handle) {
        ...ProductFragment
      }
    }
  `;

  const data = await shopifyFetch<{ product: ShopifyProduct | null }>({
    query,
    variables: { handle },
  });

  return data.product;
}

export async function getProductsByCollection(
  collectionHandle: string,
  first: number = 50
): Promise<ShopifyProduct[]> {
  const query = `
    ${PRODUCT_FRAGMENT}
    query GetProductsByCollection($handle: String!, $first: Int!) {
      collection(handle: $handle) {
        products(first: $first) {
          edges {
            node {
              ...ProductFragment
            }
          }
        }
      }
    }
  `;

  const data = await shopifyFetch<{
    collection: { products: { edges: { node: ShopifyProduct }[] } } | null;
  }>({
    query,
    variables: { handle: collectionHandle, first },
  });

  return data.collection?.products.edges.map((edge) => edge.node) || [];
}

export async function searchProducts(
  searchQuery: string,
  first: number = 20
): Promise<ShopifyProduct[]> {
  const query = `
    ${PRODUCT_FRAGMENT}
    query SearchProducts($query: String!, $first: Int!) {
      products(first: $first, query: $query) {
        edges {
          node {
            ...ProductFragment
          }
        }
      }
    }
  `;

  const data = await shopifyFetch<{
    products: { edges: { node: ShopifyProduct }[] };
  }>({
    query,
    variables: { query: searchQuery, first },
  });

  return data.products.edges.map((edge) => edge.node);
}

// ===== COLLECTION QUERIES =====

export async function getAllCollections(): Promise<ShopifyCollection[]> {
  const query = `
    query GetAllCollections {
      collections(first: 20) {
        edges {
          node {
            id
            handle
            title
            description
            image {
              url
              altText
              width
              height
            }
          }
        }
      }
    }
  `;

  const data = await shopifyFetch<{
    collections: { edges: { node: ShopifyCollection }[] };
  }>({
    query,
  });

  return data.collections.edges.map((edge) => edge.node);
}

export async function getCollectionByHandle(
  handle: string
): Promise<ShopifyCollection | null> {
  const query = `
    ${PRODUCT_FRAGMENT}
    query GetCollectionByHandle($handle: String!) {
      collection(handle: $handle) {
        id
        handle
        title
        description
        image {
          url
          altText
          width
          height
        }
        products(first: 50) {
          edges {
            node {
              ...ProductFragment
            }
          }
        }
      }
    }
  `;

  const data = await shopifyFetch<{ collection: ShopifyCollection | null }>({
    query,
    variables: { handle },
  });

  return data.collection;
}

// ===== CART MUTATIONS =====

export async function createCart(): Promise<ShopifyCart> {
  const query = `
    ${CART_FRAGMENT}
    mutation CreateCart {
      cartCreate {
        cart {
          ...CartFragment
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const data = await shopifyFetch<{
    cartCreate: {
      cart: ShopifyCart;
      userErrors: { field: string; message: string }[];
    };
  }>({ query });

  if (data.cartCreate.userErrors.length > 0) {
    throw new Error(data.cartCreate.userErrors[0].message);
  }

  return data.cartCreate.cart;
}

export async function getCart(cartId: string): Promise<ShopifyCart | null> {
  const query = `
    ${CART_FRAGMENT}
    query GetCart($cartId: ID!) {
      cart(id: $cartId) {
        ...CartFragment
      }
    }
  `;

  const data = await shopifyFetch<{ cart: ShopifyCart | null }>({
    query,
    variables: { cartId },
  });

  return data.cart;
}

export async function addToCart(
  cartId: string,
  lines: { merchandiseId: string; quantity: number }[]
): Promise<ShopifyCart> {
  const query = `
    ${CART_FRAGMENT}
    mutation AddToCart($cartId: ID!, $lines: [CartLineInput!]!) {
      cartLinesAdd(cartId: $cartId, lines: $lines) {
        cart {
          ...CartFragment
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const data = await shopifyFetch<{
    cartLinesAdd: {
      cart: ShopifyCart;
      userErrors: { field: string; message: string }[];
    };
  }>({
    query,
    variables: { cartId, lines },
  });

  if (data.cartLinesAdd.userErrors.length > 0) {
    throw new Error(data.cartLinesAdd.userErrors[0].message);
  }

  return data.cartLinesAdd.cart;
}

export async function updateCartLines(
  cartId: string,
  lines: { id: string; quantity: number }[]
): Promise<ShopifyCart> {
  const query = `
    ${CART_FRAGMENT}
    mutation UpdateCartLines($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
      cartLinesUpdate(cartId: $cartId, lines: $lines) {
        cart {
          ...CartFragment
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const data = await shopifyFetch<{
    cartLinesUpdate: {
      cart: ShopifyCart;
      userErrors: { field: string; message: string }[];
    };
  }>({
    query,
    variables: { cartId, lines },
  });

  if (data.cartLinesUpdate.userErrors.length > 0) {
    throw new Error(data.cartLinesUpdate.userErrors[0].message);
  }

  return data.cartLinesUpdate.cart;
}

export async function removeFromCart(
  cartId: string,
  lineIds: string[]
): Promise<ShopifyCart> {
  const query = `
    ${CART_FRAGMENT}
    mutation RemoveFromCart($cartId: ID!, $lineIds: [ID!]!) {
      cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
        cart {
          ...CartFragment
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const data = await shopifyFetch<{
    cartLinesRemove: {
      cart: ShopifyCart;
      userErrors: { field: string; message: string }[];
    };
  }>({
    query,
    variables: { cartId, lineIds },
  });

  if (data.cartLinesRemove.userErrors.length > 0) {
    throw new Error(data.cartLinesRemove.userErrors[0].message);
  }

  return data.cartLinesRemove.cart;
}

// ===== UTILITY FUNCTIONS =====

import type { Product, Category } from "./types";

// Convert Shopify product to our internal Product type for backward compatibility
export function shopifyToProduct(shopifyProduct: ShopifyProduct): Product {
  const variant = shopifyProduct.variants.edges[0]?.node;
  const images = shopifyProduct.images.edges.map((edge) => edge.node.url);
  const price =
    parseFloat(shopifyProduct.priceRange.minVariantPrice.amount) || 0;

  // Handle compare at price - check if it exists and is greater than 0
  const compareAtAmount =
    shopifyProduct.compareAtPriceRange?.minVariantPrice?.amount;
  const compareAtPrice =
    compareAtAmount && parseFloat(compareAtAmount) > price
      ? parseFloat(compareAtAmount)
      : undefined;

  // Extract weight from variant title, selected options, or product tags
  let weight = "200g"; // Default

  // Try variant title first (e.g., "200g", "500g")
  const variantWeightMatch = variant?.title?.match(
    /(\d+)\s*(g|kg|ml|l|gm|gms)/i
  );
  if (variantWeightMatch) {
    weight = `${variantWeightMatch[1]}${variantWeightMatch[2].toLowerCase()}`;
  } else {
    // Try selected options (Weight, Size, etc.)
    const weightOption = variant?.selectedOptions?.find(
      (opt) =>
        opt.name.toLowerCase() === "weight" || opt.name.toLowerCase() === "size"
    );
    if (weightOption?.value) {
      const optionMatch = weightOption.value.match(
        /(\d+)\s*(g|kg|ml|l|gm|gms)/i
      );
      if (optionMatch) {
        weight = `${optionMatch[1]}${optionMatch[2].toLowerCase()}`;
      } else {
        weight = weightOption.value;
      }
    } else {
      // Try product tags
      const weightTag = shopifyProduct.tags.find((tag) =>
        /^\d+\s*(g|kg|ml|l|gm|gms)$/i.test(tag)
      );
      if (weightTag) {
        weight = weightTag;
      }
    }
  }

  // Determine category from productType or collection
  const categoryMap: Record<string, Category> = {
    Podi: "podis",
    Podis: "podis",
    podi: "podis",
    Pickle: "pickles",
    Pickles: "pickles",
    pickle: "pickles",
    Sweet: "sweets",
    Sweets: "sweets",
    sweet: "sweets",
    Savoury: "savouries",
    Savouries: "savouries",
    savoury: "savouries",
    Vadam: "vadams",
    Vadams: "vadams",
    vadam: "vadams",
    "Ready-to-Mix": "ready-to-mix",
    "Ready to Mix": "ready-to-mix",
    "ready-to-mix": "ready-to-mix",
    Vathal: "vathals",
    Vathals: "vathals",
    vathal: "vathals",
  };

  const category: Category = categoryMap[shopifyProduct.productType] || "podis";

  return {
    id: shopifyProduct.id.split("/").pop() || shopifyProduct.id,
    name: shopifyProduct.title,
    slug: shopifyProduct.handle,
    description: shopifyProduct.description?.substring(0, 200) || "",
    longDescription: shopifyProduct.description || "",
    price,
    originalPrice: compareAtPrice,
    weight,
    category,
    tags: shopifyProduct.tags || [],
    rating: 4.5, // Default rating - can be enhanced with Shopify metafields
    reviews: 0, // Default - can be enhanced with Shopify reviews app
    image: images[0] || "/placeholder.jpg",
    images: images.length > 0 ? images : ["/placeholder.jpg"],
    inStock: shopifyProduct.availableForSale,
    isNew:
      shopifyProduct.tags?.includes("new-arrival") ||
      shopifyProduct.tags?.includes("new") ||
      false,
    isBestseller:
      shopifyProduct.tags?.includes("bestseller") ||
      shopifyProduct.tags?.includes("best-seller") ||
      false,
    ingredients: [], // Can be enhanced with metafields
    shelfLife: "", // Can be enhanced with metafields
    storageInfo: "", // Can be enhanced with metafields
    // Shopify-specific fields
    shopifyId: shopifyProduct.id,
    variantId: variant?.id,
  };
}

// Get cart checkout URL
export function getCheckoutUrl(cart: ShopifyCart): string {
  return cart.checkoutUrl;
}
