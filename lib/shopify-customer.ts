// Shopify Customer Account API
// Handles customer authentication and account management via Shopify Storefront API

const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN!;
const storefrontAccessToken =
  process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN!;
const apiVersion = process.env.NEXT_PUBLIC_SHOPIFY_API_VERSION || "2025-10";

const endpoint = `https://${domain}/api/${apiVersion}/graphql.json`;

// Types
export interface ShopifyCustomer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  acceptsMarketing: boolean;
  defaultAddress: ShopifyAddress | null;
  addresses: {
    edges: { node: ShopifyAddress }[];
  };
  orders: {
    edges: { node: ShopifyOrder }[];
  };
}

export interface ShopifyAddress {
  id: string;
  firstName: string;
  lastName: string;
  company: string | null;
  address1: string;
  address2: string | null;
  city: string;
  province: string;
  country: string;
  zip: string;
  phone: string | null;
}

export interface ShopifyOrder {
  id: string;
  orderNumber: number;
  processedAt: string;
  fulfillmentStatus: string;
  financialStatus: string;
  totalPrice: {
    amount: string;
    currencyCode: string;
  };
  lineItems: {
    edges: {
      node: {
        title: string;
        quantity: number;
        variant: {
          image: {
            url: string;
          } | null;
        } | null;
      };
    }[];
  };
}

export interface CustomerAccessToken {
  accessToken: string;
  expiresAt: string;
}

// GraphQL Helper
async function shopifyCustomerFetch<T>({
  query,
  variables = {},
  customerAccessToken,
}: {
  query: string;
  variables?: Record<string, unknown>;
  customerAccessToken?: string;
}): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "X-Shopify-Storefront-Access-Token": storefrontAccessToken,
  };

  if (customerAccessToken) {
    headers["X-Shopify-Customer-Access-Token"] = customerAccessToken;
  }

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers,
      body: JSON.stringify({ query, variables }),
    });

    const json = await response.json();

    if (json.errors) {
      console.error("Shopify Customer API Error:", json.errors);
      throw new Error(json.errors[0]?.message || "Shopify API Error");
    }

    return json.data;
  } catch (error) {
    console.error("Shopify Customer Fetch Error:", error);
    throw error;
  }
}

// ===== CUSTOMER AUTHENTICATION =====

/**
 * Create a new customer account
 */
export async function customerCreate(input: {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  acceptsMarketing?: boolean;
}): Promise<{
  customer: ShopifyCustomer | null;
  customerUserErrors: { field: string[]; message: string }[];
}> {
  const query = `
    mutation customerCreate($input: CustomerCreateInput!) {
      customerCreate(input: $input) {
        customer {
          id
          firstName
          lastName
          email
          acceptsMarketing
        }
        customerUserErrors {
          field
          message
        }
      }
    }
  `;

  const data = await shopifyCustomerFetch<{
    customerCreate: {
      customer: ShopifyCustomer | null;
      customerUserErrors: { field: string[]; message: string }[];
    };
  }>({ query, variables: { input } });

  return data.customerCreate;
}

/**
 * Login customer - get access token
 */
export async function customerAccessTokenCreate(
  email: string,
  password: string
): Promise<{
  customerAccessToken: CustomerAccessToken | null;
  customerUserErrors: { field: string[]; message: string }[];
}> {
  const query = `
    mutation customerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
      customerAccessTokenCreate(input: $input) {
        customerAccessToken {
          accessToken
          expiresAt
        }
        customerUserErrors {
          field
          message
        }
      }
    }
  `;

  const data = await shopifyCustomerFetch<{
    customerAccessTokenCreate: {
      customerAccessToken: CustomerAccessToken | null;
      customerUserErrors: { field: string[]; message: string }[];
    };
  }>({
    query,
    variables: { input: { email, password } },
  });

  return data.customerAccessTokenCreate;
}

/**
 * Renew access token before it expires
 */
export async function customerAccessTokenRenew(accessToken: string): Promise<{
  customerAccessToken: CustomerAccessToken | null;
  userErrors: { field: string[]; message: string }[];
}> {
  const query = `
    mutation customerAccessTokenRenew($customerAccessToken: String!) {
      customerAccessTokenRenew(customerAccessToken: $customerAccessToken) {
        customerAccessToken {
          accessToken
          expiresAt
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const data = await shopifyCustomerFetch<{
    customerAccessTokenRenew: {
      customerAccessToken: CustomerAccessToken | null;
      userErrors: { field: string[]; message: string }[];
    };
  }>({
    query,
    variables: { customerAccessToken: accessToken },
  });

  return data.customerAccessTokenRenew;
}

/**
 * Logout - delete access token
 */
export async function customerAccessTokenDelete(accessToken: string): Promise<{
  deletedAccessToken: string | null;
  userErrors: { field: string[]; message: string }[];
}> {
  const query = `
    mutation customerAccessTokenDelete($customerAccessToken: String!) {
      customerAccessTokenDelete(customerAccessToken: $customerAccessToken) {
        deletedAccessToken
        userErrors {
          field
          message
        }
      }
    }
  `;

  const data = await shopifyCustomerFetch<{
    customerAccessTokenDelete: {
      deletedAccessToken: string | null;
      userErrors: { field: string[]; message: string }[];
    };
  }>({
    query,
    variables: { customerAccessToken: accessToken },
  });

  return data.customerAccessTokenDelete;
}

// ===== CUSTOMER DATA =====

/**
 * Get customer details by access token
 */
export async function getCustomer(
  accessToken: string
): Promise<ShopifyCustomer | null> {
  const query = `
    query getCustomer($customerAccessToken: String!) {
      customer(customerAccessToken: $customerAccessToken) {
        id
        firstName
        lastName
        email
        phone
        acceptsMarketing
        defaultAddress {
          id
          firstName
          lastName
          company
          address1
          address2
          city
          province
          country
          zip
          phone
        }
        addresses(first: 10) {
          edges {
            node {
              id
              firstName
              lastName
              company
              address1
              address2
              city
              province
              country
              zip
              phone
            }
          }
        }
        orders(first: 20) {
          edges {
            node {
              id
              orderNumber
              processedAt
              fulfillmentStatus
              financialStatus
              totalPrice {
                amount
                currencyCode
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
            }
          }
        }
      }
    }
  `;

  const data = await shopifyCustomerFetch<{
    customer: ShopifyCustomer | null;
  }>({
    query,
    variables: { customerAccessToken: accessToken },
  });

  return data.customer;
}

/**
 * Update customer information
 */
export async function customerUpdate(
  accessToken: string,
  customer: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    password?: string;
    acceptsMarketing?: boolean;
  }
): Promise<{
  customer: ShopifyCustomer | null;
  customerUserErrors: { field: string[]; message: string }[];
}> {
  const query = `
    mutation customerUpdate($customerAccessToken: String!, $customer: CustomerUpdateInput!) {
      customerUpdate(customerAccessToken: $customerAccessToken, customer: $customer) {
        customer {
          id
          firstName
          lastName
          email
          phone
          acceptsMarketing
        }
        customerUserErrors {
          field
          message
        }
      }
    }
  `;

  const data = await shopifyCustomerFetch<{
    customerUpdate: {
      customer: ShopifyCustomer | null;
      customerUserErrors: { field: string[]; message: string }[];
    };
  }>({
    query,
    variables: { customerAccessToken: accessToken, customer },
  });

  return data.customerUpdate;
}

/**
 * Password recovery - send reset email
 */
export async function customerRecover(email: string): Promise<{
  customerUserErrors: { field: string[]; message: string }[];
}> {
  const query = `
    mutation customerRecover($email: String!) {
      customerRecover(email: $email) {
        customerUserErrors {
          field
          message
        }
      }
    }
  `;

  const data = await shopifyCustomerFetch<{
    customerRecover: {
      customerUserErrors: { field: string[]; message: string }[];
    };
  }>({
    query,
    variables: { email },
  });

  return data.customerRecover;
}

/**
 * Reset password with token (from email link)
 */
export async function customerResetByUrl(
  resetUrl: string,
  password: string
): Promise<{
  customer: ShopifyCustomer | null;
  customerAccessToken: CustomerAccessToken | null;
  customerUserErrors: { field: string[]; message: string }[];
}> {
  const query = `
    mutation customerResetByUrl($resetUrl: URL!, $password: String!) {
      customerResetByUrl(resetUrl: $resetUrl, password: $password) {
        customer {
          id
          firstName
          lastName
          email
        }
        customerAccessToken {
          accessToken
          expiresAt
        }
        customerUserErrors {
          field
          message
        }
      }
    }
  `;

  const data = await shopifyCustomerFetch<{
    customerResetByUrl: {
      customer: ShopifyCustomer | null;
      customerAccessToken: CustomerAccessToken | null;
      customerUserErrors: { field: string[]; message: string }[];
    };
  }>({
    query,
    variables: { resetUrl, password },
  });

  return data.customerResetByUrl;
}

// ===== ADDRESS MANAGEMENT =====

/**
 * Create a new address
 */
export async function customerAddressCreate(
  accessToken: string,
  address: {
    firstName: string;
    lastName: string;
    company?: string;
    address1: string;
    address2?: string;
    city: string;
    province: string;
    country: string;
    zip: string;
    phone?: string;
  }
): Promise<{
  customerAddress: ShopifyAddress | null;
  customerUserErrors: { field: string[]; message: string }[];
}> {
  const query = `
    mutation customerAddressCreate($customerAccessToken: String!, $address: MailingAddressInput!) {
      customerAddressCreate(customerAccessToken: $customerAccessToken, address: $address) {
        customerAddress {
          id
          firstName
          lastName
          company
          address1
          address2
          city
          province
          country
          zip
          phone
        }
        customerUserErrors {
          field
          message
        }
      }
    }
  `;

  const data = await shopifyCustomerFetch<{
    customerAddressCreate: {
      customerAddress: ShopifyAddress | null;
      customerUserErrors: { field: string[]; message: string }[];
    };
  }>({
    query,
    variables: { customerAccessToken: accessToken, address },
  });

  return data.customerAddressCreate;
}

/**
 * Update an existing address
 */
export async function customerAddressUpdate(
  accessToken: string,
  addressId: string,
  address: {
    firstName?: string;
    lastName?: string;
    company?: string;
    address1?: string;
    address2?: string;
    city?: string;
    province?: string;
    country?: string;
    zip?: string;
    phone?: string;
  }
): Promise<{
  customerAddress: ShopifyAddress | null;
  customerUserErrors: { field: string[]; message: string }[];
}> {
  const query = `
    mutation customerAddressUpdate($customerAccessToken: String!, $id: ID!, $address: MailingAddressInput!) {
      customerAddressUpdate(customerAccessToken: $customerAccessToken, id: $id, address: $address) {
        customerAddress {
          id
          firstName
          lastName
          company
          address1
          address2
          city
          province
          country
          zip
          phone
        }
        customerUserErrors {
          field
          message
        }
      }
    }
  `;

  const data = await shopifyCustomerFetch<{
    customerAddressUpdate: {
      customerAddress: ShopifyAddress | null;
      customerUserErrors: { field: string[]; message: string }[];
    };
  }>({
    query,
    variables: { customerAccessToken: accessToken, id: addressId, address },
  });

  return data.customerAddressUpdate;
}

/**
 * Delete an address
 */
export async function customerAddressDelete(
  accessToken: string,
  addressId: string
): Promise<{
  deletedCustomerAddressId: string | null;
  customerUserErrors: { field: string[]; message: string }[];
}> {
  const query = `
    mutation customerAddressDelete($customerAccessToken: String!, $id: ID!) {
      customerAddressDelete(customerAccessToken: $customerAccessToken, id: $id) {
        deletedCustomerAddressId
        customerUserErrors {
          field
          message
        }
      }
    }
  `;

  const data = await shopifyCustomerFetch<{
    customerAddressDelete: {
      deletedCustomerAddressId: string | null;
      customerUserErrors: { field: string[]; message: string }[];
    };
  }>({
    query,
    variables: { customerAccessToken: accessToken, id: addressId },
  });

  return data.customerAddressDelete;
}

/**
 * Set default address
 */
export async function customerDefaultAddressUpdate(
  accessToken: string,
  addressId: string
): Promise<{
  customer: ShopifyCustomer | null;
  customerUserErrors: { field: string[]; message: string }[];
}> {
  const query = `
    mutation customerDefaultAddressUpdate($customerAccessToken: String!, $addressId: ID!) {
      customerDefaultAddressUpdate(customerAccessToken: $customerAccessToken, addressId: $addressId) {
        customer {
          id
          defaultAddress {
            id
          }
        }
        customerUserErrors {
          field
          message
        }
      }
    }
  `;

  const data = await shopifyCustomerFetch<{
    customerDefaultAddressUpdate: {
      customer: ShopifyCustomer | null;
      customerUserErrors: { field: string[]; message: string }[];
    };
  }>({
    query,
    variables: { customerAccessToken: accessToken, addressId },
  });

  return data.customerDefaultAddressUpdate;
}

// ===== ASSOCIATE CART WITH CUSTOMER =====

/**
 * Associate existing cart with logged-in customer
 */
export async function cartBuyerIdentityUpdate(
  cartId: string,
  customerAccessToken: string
): Promise<{ cartId: string }> {
  const query = `
    mutation cartBuyerIdentityUpdate($cartId: ID!, $buyerIdentity: CartBuyerIdentityInput!) {
      cartBuyerIdentityUpdate(cartId: $cartId, buyerIdentity: $buyerIdentity) {
        cart {
          id
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const data = await shopifyCustomerFetch<{
    cartBuyerIdentityUpdate: {
      cart: { id: string };
      userErrors: { field: string[]; message: string }[];
    };
  }>({
    query,
    variables: {
      cartId,
      buyerIdentity: { customerAccessToken },
    },
  });

  return { cartId: data.cartBuyerIdentityUpdate.cart.id };
}

// ===== HELPER: Get Shopify Account URL =====
/**
 * Get the URL to the Shopify customer account page
 * Useful for redirecting to Shopify's hosted account page
 */
export function getShopifyAccountUrl(): string {
  return `https://${domain}/account`;
}

export function getShopifyLoginUrl(): string {
  return `https://${domain}/account/login`;
}

export function getShopifyRegisterUrl(): string {
  return `https://${domain}/account/register`;
}
