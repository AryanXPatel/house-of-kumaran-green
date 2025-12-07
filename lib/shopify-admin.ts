/**
 * Shopify Admin API Client
 * Uses the HoK Customer Sync Partner App credentials
 * This allows customer creation/sync on Basic plan via Partner Dashboard OAuth workaround
 */

// Store domain
const SHOP_DOMAIN =
  process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN ||
  "houseofkumaran.myshopify.com";
const API_VERSION = process.env.NEXT_PUBLIC_SHOPIFY_API_VERSION || "2025-10";

// Admin API endpoint
const ADMIN_API_URL = `https://${SHOP_DOMAIN}/admin/api/${API_VERSION}/graphql.json`;

// Access token from OAuth installation
const ACCESS_TOKEN = process.env.HOK_CUSTOMER_SYNC_ACCESS_TOKEN || null;

/**
 * Make a request to the Shopify Admin API
 */
async function adminApiRequest<T>(
  query: string,
  variables?: Record<string, unknown>
): Promise<T> {
  if (!ACCESS_TOKEN) {
    throw new Error(
      "HOK_CUSTOMER_SYNC_ACCESS_TOKEN not set. Run OAuth flow first."
    );
  }

  const response = await fetch(ADMIN_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": ACCESS_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) {
    const text = await response.text();
    console.error("Admin API error:", text);
    throw new Error(`Admin API request failed: ${response.status}`);
  }

  const json = await response.json();

  if (json.errors) {
    console.error("Admin API GraphQL errors:", json.errors);
    throw new Error(json.errors[0]?.message || "Admin API GraphQL error");
  }

  return json.data;
}

/**
 * Customer type from Admin API
 */
export interface ShopifyCustomer {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  displayName: string;
  phone: string | null;
  emailMarketingConsent: {
    marketingState:
      | "NOT_SUBSCRIBED"
      | "PENDING"
      | "SUBSCRIBED"
      | "UNSUBSCRIBED";
    marketingOptInLevel: "SINGLE_OPT_IN" | "CONFIRMED_OPT_IN" | "UNKNOWN";
  } | null;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  note: string | null;
  verifiedEmail: boolean;
  state: "DISABLED" | "ENABLED" | "INVITED" | "DECLINED";
}

/**
 * Find a customer by email
 */
export async function findCustomerByEmail(
  email: string
): Promise<ShopifyCustomer | null> {
  const query = `
    query findCustomer($query: String!) {
      customers(first: 1, query: $query) {
        edges {
          node {
            id
            email
            firstName
            lastName
            displayName
            phone
            emailMarketingConsent {
              marketingState
              marketingOptInLevel
            }
            createdAt
            updatedAt
            tags
            note
            verifiedEmail
            state
          }
        }
      }
    }
  `;

  try {
    const data = await adminApiRequest<{
      customers: { edges: Array<{ node: ShopifyCustomer }> };
    }>(query, { query: `email:${email}` });

    return data.customers.edges[0]?.node || null;
  } catch (error) {
    console.error("Error finding customer:", error);
    return null;
  }
}

/**
 * Create a new customer from Google OAuth data
 * The customer is created with state: ENABLED (no email verification needed!)
 */
export async function createCustomerFromGoogle(
  email: string,
  name: string,
  picture?: string | null,
  joinKumaranFamily: boolean = false // ✅ New parameter
): Promise<ShopifyCustomer | null> {
  // Parse name into first/last
  const nameParts = name.trim().split(" ");
  const firstName = nameParts[0] || "";
  const lastName = nameParts.slice(1).join(" ") || "";

  const mutation = `
    mutation customerCreate($input: CustomerInput!) {
      customerCreate(input: $input) {
        customer {
          id
          email
          firstName
          lastName
          displayName
          phone
          emailMarketingConsent {
            marketingState
            marketingOptInLevel
          }
          createdAt
          updatedAt
          tags
          note
          verifiedEmail
          state
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const tags = ["google-oauth"];
  if (joinKumaranFamily) {
    tags.push("kumaran-family"); // ✅ Only add if opted in
  }

  const input = {
    email,
    firstName,
    lastName,
    tags,
    note: `Signed up via Google OAuth. Profile picture: ${
      picture || "none"
    }. Kumaran Family: ${
      joinKumaranFamily ? "Yes" : "No"
    }. Consent date: ${new Date().toISOString()}`,
    emailMarketingConsent: {
      marketingOptInLevel: "SINGLE_OPT_IN",
      marketingState: joinKumaranFamily ? "SUBSCRIBED" : "NOT_SUBSCRIBED",
    },
  };

  try {
    const data = await adminApiRequest<{
      customerCreate: {
        customer: ShopifyCustomer | null;
        userErrors: Array<{ field: string; message: string }>;
      };
    }>(mutation, { input });

    if (data.customerCreate.userErrors.length > 0) {
      console.error("Customer create errors:", data.customerCreate.userErrors);

      // If customer already exists, try to find them
      if (
        data.customerCreate.userErrors.some((e) =>
          e.message.includes("already exists")
        )
      ) {
        return await findCustomerByEmail(email);
      }

      return null;
    }

    return data.customerCreate.customer;
  } catch (error) {
    console.error("Error creating customer:", error);
    return null;
  }
}

/**
 * Get or create a Shopify customer for a Google OAuth user
 * Returns the Shopify customer ID (gid://shopify/Customer/...)
 */
export async function getOrCreateShopifyCustomer(
  email: string,
  name: string,
  picture?: string | null,
  joinKumaranFamily: boolean = false // ✅ New parameter
): Promise<{ customerId: string; isNew: boolean } | null> {
  try {
    // First, check if customer already exists
    const existing = await findCustomerByEmail(email);
    if (existing) {
      console.log(`Found existing Shopify customer: ${existing.id}`);
      return { customerId: existing.id, isNew: false };
    }

    // Create new customer
    const newCustomer = await createCustomerFromGoogle(
      email,
      name,
      picture,
      joinKumaranFamily
    );
    if (newCustomer) {
      console.log(`Created new Shopify customer: ${newCustomer.id}`);
      return { customerId: newCustomer.id, isNew: true };
    }

    return null;
  } catch (error) {
    console.error("Error in getOrCreateShopifyCustomer:", error);
    return null;
  }
}

/**
 * Update customer tags (useful for loyalty programs, etc.)
 */
export async function updateCustomerTags(
  customerId: string,
  tags: string[]
): Promise<boolean> {
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

  try {
    const data = await adminApiRequest<{
      customerUpdate: {
        customer: { id: string; tags: string[] } | null;
        userErrors: Array<{ field: string; message: string }>;
      };
    }>(mutation, { input: { id: customerId, tags } });

    if (data.customerUpdate.userErrors.length > 0) {
      console.error("Customer update errors:", data.customerUpdate.userErrors);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error updating customer tags:", error);
    return false;
  }
}

/**
 * Generate a customer access token (for Storefront API operations)
 * This lets the customer have a logged-in experience in checkout
 */
export async function generateCustomerAccessToken(
  customerId: string
): Promise<string | null> {
  // Note: This requires the customer to have a password set
  // For passwordless Google OAuth users, we use buyer identity association instead
  console.log(
    "Customer access token generation - using buyer identity association for Google users"
  );
  return null;
}

/**
 * Check if the Admin API is properly configured
 */
export function isAdminApiConfigured(): boolean {
  return !!ACCESS_TOKEN && !!SHOP_DOMAIN;
}

/**
 * Customer address type from Admin API
 */
export interface ShopifyAddress {
  id: string;
  firstName: string | null;
  lastName: string | null;
  address1: string | null;
  address2: string | null;
  city: string | null;
  province: string | null;
  provinceCode: string | null;
  country: string | null;
  countryCodeV2: string | null;
  zip: string | null;
  phone: string | null;
}

/**
 * Full customer profile with addresses (for account page)
 */
export interface ShopifyCustomerProfile {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  displayName: string;
  phone: string | null;
  emailMarketingConsent: {
    marketingState: string;
    marketingOptInLevel: string;
  } | null;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  note: string | null;
  verifiedEmail: boolean;
  state: string;
  defaultAddress: ShopifyAddress | null;
  addresses: ShopifyAddress[];
  numberOfOrders: string;
  totalSpent: string;
}

/**
 * Get customer by ID with full profile including addresses
 * Used for account page display for Google OAuth users
 */
export async function getCustomerById(
  customerId: string
): Promise<ShopifyCustomerProfile | null> {
  const query = `
    query getCustomer($id: ID!) {
      customer(id: $id) {
        id
        email
        firstName
        lastName
        displayName
        phone
        emailMarketingConsent {
          marketingState
          marketingOptInLevel
        }
        createdAt
        updatedAt
        tags
        note
        verifiedEmail
        state
        numberOfOrders
        amountSpent {
          amount
          currencyCode
        }
        defaultAddress {
          id
          firstName
          lastName
          address1
          address2
          city
          province
          provinceCode
          country
          countryCodeV2
          zip
          phone
        }
        addresses {
          id
          firstName
          lastName
          address1
          address2
          city
          province
          provinceCode
          country
          countryCodeV2
          zip
          phone
        }
      }
    }
  `;

  try {
    const data = await adminApiRequest<{
      customer: {
        id: string;
        email: string;
        firstName: string | null;
        lastName: string | null;
        displayName: string;
        phone: string | null;
        emailMarketingConsent: {
          marketingState: string;
          marketingOptInLevel: string;
        } | null;
        createdAt: string;
        updatedAt: string;
        tags: string[];
        note: string | null;
        verifiedEmail: boolean;
        state: string;
        numberOfOrders: string;
        amountSpent: { amount: string; currencyCode: string };
        defaultAddress: ShopifyAddress | null;
        addresses: ShopifyAddress[];
      } | null;
    }>(query, { id: customerId });

    if (!data.customer) return null;

    return {
      ...data.customer,
      totalSpent: `${data.customer.amountSpent.currencyCode} ${data.customer.amountSpent.amount}`,
    };
  } catch (error) {
    console.error("Error fetching customer by ID:", error);
    return null;
  }
}

/**
 * Update customer profile via Admin API
 */
export async function updateCustomerProfile(
  customerId: string,
  updates: {
    firstName?: string;
    lastName?: string;
    phone?: string;
    emailMarketingConsent?: {
      marketingOptInLevel: "SINGLE_OPT_IN" | "CONFIRMED_OPT_IN";
      marketingState: "SUBSCRIBED" | "NOT_SUBSCRIBED" | "UNSUBSCRIBED";
    };
  }
): Promise<boolean> {
  const mutation = `
    mutation customerUpdate($input: CustomerInput!) {
      customerUpdate(input: $input) {
        customer {
          id
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  try {
    const data = await adminApiRequest<{
      customerUpdate: {
        customer: { id: string } | null;
        userErrors: Array<{ field: string; message: string }>;
      };
    }>(mutation, { input: { id: customerId, ...updates } });

    if (data.customerUpdate.userErrors.length > 0) {
      console.error("Customer update errors:", data.customerUpdate.userErrors);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error updating customer profile:", error);
    return false;
  }
}

/**
 * Add a new address for customer via Admin API
 */
export async function addCustomerAddress(
  customerId: string,
  address: Omit<ShopifyAddress, "id" | "provinceCode" | "countryCodeV2">
): Promise<ShopifyAddress | null> {
  const mutation = `
    mutation customerUpdate($input: CustomerInput!) {
      customerUpdate(input: $input) {
        customer {
          addresses {
            id
            firstName
            lastName
            address1
            address2
            city
            province
            provinceCode
            country
            countryCodeV2
            zip
            phone
          }
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  try {
    const data = await adminApiRequest<{
      customerUpdate: {
        customer: { addresses: ShopifyAddress[] } | null;
        userErrors: Array<{ field: string; message: string }>;
      };
    }>(mutation, {
      input: {
        id: customerId,
        addresses: [address],
      },
    });

    if (data.customerUpdate.userErrors.length > 0) {
      console.error("Address add errors:", data.customerUpdate.userErrors);
      return null;
    }

    // Return the last address (the one we just added)
    const addresses = data.customerUpdate.customer?.addresses || [];
    return addresses[addresses.length - 1] || null;
  } catch (error) {
    console.error("Error adding customer address:", error);
    return null;
  }
}

/**
 * Delete a customer address via Admin API
 */
export async function deleteCustomerAddress(
  customerId: string,
  addressIds: string[]
): Promise<boolean> {
  const mutation = `
    mutation customerDeleteAddresses($customerId: ID!, $addressIds: [ID!]!) {
      customerDeleteAddresses(customerId: $customerId, addressIds: $addressIds) {
        deletedAddressIds
        userErrors {
          field
          message
        }
      }
    }
  `;

  try {
    const data = await adminApiRequest<{
      customerDeleteAddresses: {
        deletedAddressIds: string[];
        userErrors: Array<{ field: string; message: string }>;
      };
    }>(mutation, { customerId, addressIds });

    if (data.customerDeleteAddresses.userErrors.length > 0) {
      console.error(
        "Address delete errors:",
        data.customerDeleteAddresses.userErrors
      );
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error deleting customer address:", error);
    return false;
  }
}

/**
 * Order line item type
 */
export interface OrderLineItem {
  title: string;
  quantity: number;
  originalUnitPrice: string;
  discountedUnitPrice: string;
  image?: {
    url: string;
    altText: string | null;
  } | null;
  variant?: {
    title: string;
    sku: string | null;
  } | null;
}

/**
 * Order type from Admin API
 */
export interface ShopifyOrder {
  id: string;
  name: string; // Order number like #1001
  createdAt: string;
  displayFinancialStatus: string;
  displayFulfillmentStatus: string;
  totalPriceSet: {
    shopMoney: {
      amount: string;
      currencyCode: string;
    };
  };
  subtotalPriceSet: {
    shopMoney: {
      amount: string;
      currencyCode: string;
    };
  };
  totalShippingPriceSet: {
    shopMoney: {
      amount: string;
      currencyCode: string;
    };
  };
  totalTaxSet: {
    shopMoney: {
      amount: string;
      currencyCode: string;
    };
  };
  lineItems: {
    nodes: OrderLineItem[];
  };
  shippingAddress: ShopifyAddress | null;
  billingAddress: ShopifyAddress | null;
  fulfillments: Array<{
    status: string;
    trackingInfo: Array<{
      number: string;
      url: string | null;
    }>;
  }>;
}

/**
 * Get customer orders via Admin API
 */
export async function getCustomerOrders(
  customerId: string,
  first: number = 10
): Promise<ShopifyOrder[]> {
  const query = `
    query getCustomerOrders($customerId: ID!, $first: Int!) {
      customer(id: $customerId) {
        orders(first: $first, sortKey: CREATED_AT, reverse: true) {
          nodes {
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
            subtotalPriceSet {
              shopMoney {
                amount
                currencyCode
              }
            }
            totalShippingPriceSet {
              shopMoney {
                amount
                currencyCode
              }
            }
            totalTaxSet {
              shopMoney {
                amount
                currencyCode
              }
            }
            lineItems(first: 20) {
              nodes {
                title
                quantity
                originalUnitPriceSet {
                  shopMoney {
                    amount
                    currencyCode
                  }
                }
                discountedUnitPriceSet {
                  shopMoney {
                    amount
                    currencyCode
                  }
                }
                image {
                  url
                  altText
                }
                variant {
                  title
                  sku
                }
              }
            }
            shippingAddress {
              firstName
              lastName
              address1
              address2
              city
              province
              country
              zip
              phone
            }
            billingAddress {
              firstName
              lastName
              address1
              address2
              city
              province
              country
              zip
              phone
            }
            fulfillments {
              status
              trackingInfo {
                number
                url
              }
            }
          }
        }
      }
    }
  `;

  try {
    const data = await adminApiRequest<{
      customer: {
        orders: {
          nodes: Array<{
            id: string;
            name: string;
            createdAt: string;
            displayFinancialStatus: string;
            displayFulfillmentStatus: string;
            totalPriceSet: {
              shopMoney: { amount: string; currencyCode: string };
            };
            subtotalPriceSet: {
              shopMoney: { amount: string; currencyCode: string };
            };
            totalShippingPriceSet: {
              shopMoney: { amount: string; currencyCode: string };
            };
            totalTaxSet: {
              shopMoney: { amount: string; currencyCode: string };
            };
            lineItems: {
              nodes: Array<{
                title: string;
                quantity: number;
                originalUnitPriceSet: {
                  shopMoney: { amount: string; currencyCode: string };
                };
                discountedUnitPriceSet: {
                  shopMoney: { amount: string; currencyCode: string };
                };
                image: { url: string; altText: string | null } | null;
                variant: { title: string; sku: string | null } | null;
              }>;
            };
            shippingAddress: ShopifyAddress | null;
            billingAddress: ShopifyAddress | null;
            fulfillments: Array<{
              status: string;
              trackingInfo: Array<{ number: string; url: string | null }>;
            }>;
          }>;
        };
      } | null;
    }>(query, { customerId, first });

    if (!data.customer) return [];

    // Transform the response to match our interface
    return data.customer.orders.nodes.map((order) => ({
      ...order,
      lineItems: {
        nodes: order.lineItems.nodes.map((item) => ({
          title: item.title,
          quantity: item.quantity,
          originalUnitPrice: item.originalUnitPriceSet.shopMoney.amount,
          discountedUnitPrice: item.discountedUnitPriceSet.shopMoney.amount,
          image: item.image,
          variant: item.variant,
        })),
      },
    }));
  } catch (error) {
    console.error("Error fetching customer orders:", error);
    return [];
  }
}

/**
 * Update a customer address via Admin API
 */
export async function updateCustomerAddress(
  customerId: string,
  addressId: string,
  address: Partial<
    Omit<ShopifyAddress, "id" | "provinceCode" | "countryCodeV2">
  >
): Promise<boolean> {
  // The Admin API doesn't have a direct address update mutation
  // We need to use customerUpdate with the full addresses array
  // For now, we'll use a workaround: delete old and add new

  // First get current customer data
  const customer = await getCustomerById(customerId);
  if (!customer) return false;

  // Find and update the address in the array
  const updatedAddresses = customer.addresses.map((addr) => {
    if (addr.id === addressId) {
      return {
        firstName: address.firstName ?? addr.firstName,
        lastName: address.lastName ?? addr.lastName,
        address1: address.address1 ?? addr.address1,
        address2: address.address2 ?? addr.address2,
        city: address.city ?? addr.city,
        province: address.province ?? addr.province,
        country: address.country ?? addr.country,
        zip: address.zip ?? addr.zip,
        phone: address.phone ?? addr.phone,
      };
    }
    return {
      firstName: addr.firstName,
      lastName: addr.lastName,
      address1: addr.address1,
      address2: addr.address2,
      city: addr.city,
      province: addr.province,
      country: addr.country,
      zip: addr.zip,
      phone: addr.phone,
    };
  });

  const mutation = `
    mutation customerUpdate($input: CustomerInput!) {
      customerUpdate(input: $input) {
        customer {
          id
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  try {
    const data = await adminApiRequest<{
      customerUpdate: {
        customer: { id: string } | null;
        userErrors: Array<{ field: string; message: string }>;
      };
    }>(mutation, {
      input: {
        id: customerId,
        addresses: updatedAddresses,
      },
    });

    if (data.customerUpdate.userErrors.length > 0) {
      console.error("Address update errors:", data.customerUpdate.userErrors);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error updating customer address:", error);
    return false;
  }
}

/**
 * Set default address for customer
 */
export async function setDefaultAddress(
  customerId: string,
  addressId: string
): Promise<boolean> {
  // Get current customer to find address index
  const customer = await getCustomerById(customerId);
  if (!customer) return false;

  // Find the address and move it to the first position (Shopify uses first as default)
  const addressIndex = customer.addresses.findIndex((a) => a.id === addressId);
  if (addressIndex === -1) return false;

  const addressToDefault = customer.addresses[addressIndex];
  const otherAddresses = customer.addresses.filter(
    (_, i) => i !== addressIndex
  );

  const reorderedAddresses = [addressToDefault, ...otherAddresses].map(
    (addr) => ({
      firstName: addr.firstName,
      lastName: addr.lastName,
      address1: addr.address1,
      address2: addr.address2,
      city: addr.city,
      province: addr.province,
      country: addr.country,
      zip: addr.zip,
      phone: addr.phone,
    })
  );

  const mutation = `
    mutation customerUpdate($input: CustomerInput!) {
      customerUpdate(input: $input) {
        customer {
          id
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  try {
    const data = await adminApiRequest<{
      customerUpdate: {
        customer: { id: string } | null;
        userErrors: Array<{ field: string; message: string }>;
      };
    }>(mutation, {
      input: {
        id: customerId,
        addresses: reorderedAddresses,
      },
    });

    if (data.customerUpdate.userErrors.length > 0) {
      console.error(
        "Set default address errors:",
        data.customerUpdate.userErrors
      );
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error setting default address:", error);
    return false;
  }
}
/**
 * Update customer email marketing consent using the dedicated mutation
 * Required as of Shopify API 2024+ (customerUpdate no longer supports this)
 */
async function updateEmailMarketingConsent(
  customerId: string,
  marketingState: "SUBSCRIBED" | "NOT_SUBSCRIBED" | "UNSUBSCRIBED"
): Promise<boolean> {
  const mutation = `
    mutation customerEmailMarketingConsentUpdate($input: CustomerEmailMarketingConsentUpdateInput!) {
      customerEmailMarketingConsentUpdate(input: $input) {
        customer {
          id
          emailMarketingConsent {
            marketingState
          }
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  try {
    const data = await adminApiRequest<{
      customerEmailMarketingConsentUpdate: {
        customer: {
          id: string;
          emailMarketingConsent: { marketingState: string } | null;
        } | null;
        userErrors: Array<{ field: string; message: string }>;
      };
    }>(mutation, {
      input: {
        customerId,
        emailMarketingConsent: {
          marketingOptInLevel: "SINGLE_OPT_IN",
          marketingState,
          consentUpdatedAt: new Date().toISOString(),
        },
      },
    });

    if (data.customerEmailMarketingConsentUpdate.userErrors.length > 0) {
      console.error(
        "Email marketing consent update errors:",
        data.customerEmailMarketingConsentUpdate.userErrors
      );
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error updating email marketing consent:", error);
    return false;
  }
}

/**
 * Join Kumaran Family - Update customer to subscribe to marketing and add tag
 * Used when an existing customer wants to join the Kumaran Family
 */
export async function joinKumaranFamily(customerId: string): Promise<boolean> {
  // First get current customer to preserve existing tags
  const customer = await getCustomerById(customerId);
  if (!customer) return false;

  // Add kumaran-family tag if not already present
  const existingTags = customer.tags || [];
  const newTags = existingTags.includes("kumaran-family")
    ? existingTags
    : [...existingTags, "kumaran-family"];

  // Step 1: Update tags and note via customerUpdate
  const tagMutation = `
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

  try {
    const tagData = await adminApiRequest<{
      customerUpdate: {
        customer: { id: string; tags: string[] } | null;
        userErrors: Array<{ field: string; message: string }>;
      };
    }>(tagMutation, {
      input: {
        id: customerId,
        tags: newTags,
        note: `${customer.note || ""}\nJoined Kumaran Family: ${new Date().toISOString()}`,
      },
    });

    if (tagData.customerUpdate.userErrors.length > 0) {
      console.error(
        "Join Kumaran Family tag update errors:",
        tagData.customerUpdate.userErrors
      );
      return false;
    }

    // Step 2: Update email marketing consent via dedicated mutation
    const consentSuccess = await updateEmailMarketingConsent(
      customerId,
      "SUBSCRIBED"
    );
    if (!consentSuccess) {
      console.error(
        "Failed to update email marketing consent, but tags were updated"
      );
      // Still return true since tags were updated - consent is secondary
    }

    console.log(`Customer ${customerId} joined Kumaran Family`);
    return true;
  } catch (error) {
    console.error("Error joining Kumaran Family:", error);
    return false;
  }
}

/**
 * Check if a customer is a Kumaran Family member
 */
export function isKumaranFamilyMember(
  customer: ShopifyCustomer | ShopifyCustomerProfile | null
): boolean {
  if (!customer) return false;
  return customer.tags.includes("kumaran-family");
}

/**
   * Create or update a customer for newsletter subscription (guest       
  users)
   * This is used when a guest subscribes via the footer form
   */
export async function subscribeToNewsletter(
  email: string
): Promise<{ success: boolean; isNew: boolean; error?: string }> {
  try {
    // First, check if customer already exists
    const existing = await findCustomerByEmail(email);

    if (existing) {
      // Update existing customer to subscribe
      const success = await joinKumaranFamily(existing.id);
      return { success, isNew: false };
    }

    // Create new customer with newsletter subscription
    const mutation = `
        mutation customerCreate($input: CustomerInput!) {
          customerCreate(input: $input) {
            customer {
              id
              email
            }
            userErrors {
              field
              message
            }
          }
        }
      `;

    const input = {
      email,
      tags: ["kumaran-family", "newsletter-signup"],
      note: `Newsletter signup. Consent date: ${new Date().toISOString()}`,
      emailMarketingConsent: {
        marketingOptInLevel: "SINGLE_OPT_IN",
        marketingState: "SUBSCRIBED",
      },
    };

    const data = await adminApiRequest<{
      customerCreate: {
        customer: { id: string; email: string } | null;
        userErrors: Array<{ field: string; message: string }>;
      };
    }>(mutation, { input });

    if (data.customerCreate.userErrors.length > 0) {
      console.error(
        "Newsletter subscription errors:",
        data.customerCreate.userErrors
      );
      return {
        success: false,
        isNew: false,
        error:
          data.customerCreate.userErrors[0]?.message || "Subscription failed",
      };
    }

    console.log(`New newsletter subscriber: ${email}`);
    return { success: true, isNew: true };
  } catch (error) {
    console.error("Error subscribing to newsletter:", error);
    return { success: false, isNew: false, error: "An error occurred" };
  }
}
