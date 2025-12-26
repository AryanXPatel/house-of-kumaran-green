// Shopify Admin API Customer Management
// Handles customer creation and lookup via Admin API for headless Google OAuth
// Uses emailMarketingConsent to mark customers as verified (bypasses email verification)

const adminApiUrl = process.env.SHOPIFY_ADMIN_API_URL!;
// Use the custom Google sign-in token which has read_customers and write_customers scopes
const adminAccessToken = process.env.SHOPIFY_CUSTOM_GOOGLE_SIGN_IN_TOKEN!;
// HOK Customer Sync token has read_orders scope for purchase verification
const ordersAccessToken = process.env.HOK_CUSTOMER_SYNC_ACCESS_TOKEN;

export interface GoogleUserInfo {
  email: string;
  name: string;
  given_name?: string;
  family_name?: string;
  picture?: string;
  email_verified?: boolean;
}

export interface AdminCustomer {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  state: string;
  verifiedEmail: boolean;
  tags: string[];
  metafield?: {
    value: string;
  } | null;
}

interface CustomerCreateResponse {
  customerCreate: {
    customer: AdminCustomer | null;
    userErrors: { field: string[]; message: string }[];
  };
}

interface CustomerSearchResponse {
  customers: {
    edges: { node: AdminCustomer }[];
  };
}

interface CustomerQueryResponse {
  customer: AdminCustomer | null;
}

// GraphQL Helper for Admin API (customer operations)
async function shopifyAdminFetch<T>(
  query: string,
  variables: Record<string, unknown> = {}
): Promise<T> {
  const response = await fetch(`${adminApiUrl}/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": adminAccessToken,
    },
    body: JSON.stringify({ query, variables }),
  });

  const json = await response.json();

  if (json.errors) {
    console.error("Shopify Admin API Error:", json.errors);
    throw new Error(json.errors[0]?.message || "Shopify Admin API Error");
  }

  return json.data;
}

// GraphQL Helper for Admin API with orders scope (HOK Customer Sync token)
async function shopifyAdminFetchWithOrders<T>(
  query: string,
  variables: Record<string, unknown> = {}
): Promise<T> {
  if (!ordersAccessToken) {
    throw new Error(
      "HOK_CUSTOMER_SYNC_ACCESS_TOKEN not set. Required for order queries."
    );
  }

  const response = await fetch(`${adminApiUrl}/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": ordersAccessToken,
    },
    body: JSON.stringify({ query, variables }),
  });

  const json = await response.json();

  if (json.errors) {
    console.error("Shopify Admin API (Orders) Error:", json.errors);
    throw new Error(json.errors[0]?.message || "Shopify Admin API Error");
  }

  return json.data;
}

/**
 * Search for existing customer by email
 */
export async function findCustomerByEmail(
  email: string
): Promise<AdminCustomer | null> {
  const query = `
    query findCustomerByEmail($query: String!) {
      customers(first: 1, query: $query) {
        edges {
          node {
            id
            email
            firstName
            lastName
            state
            verifiedEmail
            tags
          }
        }
      }
    }
  `;

  const data = await shopifyAdminFetch<CustomerSearchResponse>(query, {
    query: `email:${email}`,
  });

  return data.customers.edges[0]?.node || null;
}

/**
 * Get customer by ID
 */
export async function getCustomerById(
  customerId: string
): Promise<AdminCustomer | null> {
  const query = `
    query getCustomer($id: ID!) {
      customer(id: $id) {
        id
        email
        firstName
        lastName
        state
        verifiedEmail
        tags
      }
    }
  `;

  const data = await shopifyAdminFetch<CustomerQueryResponse>(query, {
    id: customerId,
  });

  return data.customer;
}

/**
 * Create a new customer with verified status
 * Uses emailMarketingConsent to mark customer as verified (no email verification needed)
 */
export async function createVerifiedCustomer(
  googleUser: GoogleUserInfo
): Promise<AdminCustomer> {
  const mutation = `
    mutation customerCreate($input: CustomerInput!) {
      customerCreate(input: $input) {
        customer {
          id
          email
          firstName
          lastName
          state
          verifiedEmail
          tags
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const variables = {
    input: {
      email: googleUser.email,
      firstName: googleUser.given_name || googleUser.name?.split(" ")[0] || "",
      lastName:
        googleUser.family_name ||
        googleUser.name?.split(" ").slice(1).join(" ") ||
        "",
      // 🔥 CRITICAL: This marks customer as verified - NO email verification needed
      emailMarketingConsent: {
        marketingState: "NOT_SUBSCRIBED",
        marketingOptInLevel: "SINGLE_OPT_IN",
      },
      tags: ["google-oauth", "headless-verified"],
      // Store Google profile picture URL in note
      note: googleUser.picture
        ? `Google OAuth user. Profile picture: ${googleUser.picture}`
        : "Google OAuth user",
    },
  };

  const data = await shopifyAdminFetch<CustomerCreateResponse>(
    mutation,
    variables
  );

  if (data.customerCreate.userErrors.length > 0) {
    const error = data.customerCreate.userErrors[0];
    throw new Error(`Customer creation failed: ${error.message}`);
  }

  if (!data.customerCreate.customer) {
    throw new Error("Customer creation failed: No customer returned");
  }

  return data.customerCreate.customer;
}

/**
 * Find or create a customer for Google OAuth
 * Returns existing customer if found, creates new verified customer if not
 */
export async function findOrCreateGoogleCustomer(
  googleUser: GoogleUserInfo
): Promise<AdminCustomer> {
  // First, try to find existing customer by email
  const existingCustomer = await findCustomerByEmail(googleUser.email);

  if (existingCustomer) {
    console.log(`Found existing customer: ${existingCustomer.id}`);

    // Optionally update tags to include google-oauth if not present
    if (!existingCustomer.tags.includes("google-oauth")) {
      await updateCustomerTags(existingCustomer.id, [
        ...existingCustomer.tags,
        "google-oauth",
      ]);
    }

    return existingCustomer;
  }

  // Create new customer with verified status
  console.log(`Creating new customer for: ${googleUser.email}`);
  return await createVerifiedCustomer(googleUser);
}

/**
 * Update customer tags
 */
async function updateCustomerTags(
  customerId: string,
  tags: string[]
): Promise<void> {
  const mutation = `
    mutation customerUpdate($input: CustomerInput!) {
      customerUpdate(input: $input) {
        customer {
          id
          tags
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  await shopifyAdminFetch(mutation, {
    input: {
      id: customerId,
      tags,
    },
  });
}

/**
 * Get customer orders via Admin API
 */
export async function getCustomerOrders(
  customerId: string,
  first: number = 20
) {
  const query = `
    query getCustomerOrders($id: ID!, $first: Int!) {
      customer(id: $id) {
        orders(first: $first, sortKey: CREATED_AT, reverse: true) {
          edges {
            node {
              id
              name
              createdAt
              displayFinancialStatus
              displayFulfillmentStatus
              totalPriceSet {
                shopMoney {
                  amount
                  currencyCode
                }
              }
              lineItems(first: 10) {
                edges {
                  node {
                    title
                    quantity
                    variant {
                      image {
                        url
                      }
                    }
                  }
                }
              }
              shippingAddress {
                city
                province
                country
              }
            }
          }
        }
      }
    }
  `;

  interface OrdersResponse {
    customer: {
      orders: {
        edges: {
          node: {
            id: string;
            name: string;
            createdAt: string;
            displayFinancialStatus: string;
            displayFulfillmentStatus: string;
            totalPriceSet: {
              shopMoney: {
                amount: string;
                currencyCode: string;
              };
            };
            lineItems: {
              edges: {
                node: {
                  title: string;
                  quantity: number;
                  variant: {
                    image: { url: string } | null;
                  } | null;
                };
              }[];
            };
            shippingAddress: {
              city: string;
              province: string;
              country: string;
            } | null;
          };
        }[];
      };
    } | null;
  }

  const data = await shopifyAdminFetch<OrdersResponse>(query, {
    id: customerId,
    first,
  });

  if (!data.customer) {
    return [];
  }

  return data.customer.orders.edges.map(({ node }) => ({
    id: node.id,
    name: node.name,
    createdAt: node.createdAt,
    financialStatus: node.displayFinancialStatus,
    fulfillmentStatus: node.displayFulfillmentStatus,
    totalPrice: {
      amount: node.totalPriceSet.shopMoney.amount,
      currencyCode: node.totalPriceSet.shopMoney.currencyCode,
    },
    lineItems: node.lineItems.edges.map(({ node: item }) => ({
      title: item.title,
      quantity: item.quantity,
      imageUrl: item.variant?.image?.url || null,
    })),
    shippingAddress: node.shippingAddress,
  }));
}

/**
 * Extract numeric customer ID from Shopify GID
 */
export function extractCustomerId(gid: string): string {
  const match = gid.match(/Customer\/(\d+)/);
  return match ? match[1] : gid;
}

/**
 * Extract numeric product ID from Shopify GID
 */
export function extractProductId(gid: string): string {
  const match = gid.match(/Product\/(\d+)/);
  return match ? match[1] : gid;
}

/**
 * Check if a customer has purchased a specific product
 * Used for review eligibility verification
 */
export async function hasCustomerPurchasedProduct(
  customerId: string,
  productId: string
): Promise<{ purchased: boolean; orderName?: string; orderDate?: string }> {
  // Clean the product ID (remove GID prefix if present)
  const cleanProductId = extractProductId(productId);

  // Query with product ID in line items
  const query = `
    query checkCustomerPurchase($customerId: ID!, $first: Int!) {
      customer(id: $customerId) {
        orders(first: $first, sortKey: CREATED_AT, reverse: true) {
          edges {
            node {
              id
              name
              createdAt
              displayFulfillmentStatus
              lineItems(first: 50) {
                edges {
                  node {
                    product {
                      id
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  `;

  interface PurchaseCheckResponse {
    customer: {
      orders: {
        edges: {
          node: {
            id: string;
            name: string;
            createdAt: string;
            displayFulfillmentStatus: string;
            lineItems: {
              edges: {
                node: {
                  product: {
                    id: string;
                  } | null;
                };
              }[];
            };
          };
        }[];
      };
    } | null;
  }

  try {
    const data = await shopifyAdminFetchWithOrders<PurchaseCheckResponse>(query, {
      customerId,
      first: 50, // Check last 50 orders
    });

    if (!data.customer) {
      return { purchased: false };
    }

    // Check each order for the product
    for (const { node: order } of data.customer.orders.edges) {
      for (const { node: lineItem } of order.lineItems.edges) {
        if (lineItem.product) {
          const orderProductId = extractProductId(lineItem.product.id);
          if (orderProductId === cleanProductId) {
            return {
              purchased: true,
              orderName: order.name,
              orderDate: order.createdAt,
            };
          }
        }
      }
    }

    return { purchased: false };
  } catch (error) {
    console.error("Error checking customer purchase:", error);
    return { purchased: false };
  }
}

/**
 * Find customer by email via Admin API
 * Returns the Shopify customer GID if found
 */
export async function findCustomerGidByEmail(
  email: string
): Promise<string | null> {
  const query = `
    query findCustomerByEmail($query: String!) {
      customers(first: 1, query: $query) {
        edges {
          node {
            id
          }
        }
      }
    }
  `;

  try {
    const data = await shopifyAdminFetch<{
      customers: { edges: { node: { id: string } }[] };
    }>(query, {
      query: `email:${email}`,
    });

    return data.customers.edges[0]?.node?.id || null;
  } catch (error) {
    console.error("Error finding customer by email:", error);
    return null;
  }
}
