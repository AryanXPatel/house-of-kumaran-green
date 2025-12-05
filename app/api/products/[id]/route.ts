import { NextRequest, NextResponse } from "next/server";
import { shopifyToProduct, type ShopifyProduct } from "@/lib/shopify";

const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || "";
const storefrontAccessToken =
  process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN || "";
const apiVersion = process.env.NEXT_PUBLIC_SHOPIFY_API_VERSION || "2025-10";

const endpoint = domain
  ? `https://${domain}/api/${apiVersion}/graphql.json`
  : "";

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

/**
 * GET /api/products/[id]
 * Fetch a single product by its Shopify ID
 * Supports both numeric IDs (9218821062881) and full GIDs (gid://shopify/Product/9218821062881)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    if (!domain || !storefrontAccessToken) {
      return NextResponse.json(
        { error: "Shopify not configured" },
        { status: 500 }
      );
    }

    // Convert numeric ID to full Shopify GID if needed
    const productGid = id.startsWith("gid://")
      ? id
      : `gid://shopify/Product/${id}`;

    const query = `
      ${PRODUCT_FRAGMENT}
      query GetProductById($id: ID!) {
        product(id: $id) {
          ...ProductFragment
        }
      }
    `;

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": storefrontAccessToken,
      },
      body: JSON.stringify({
        query,
        variables: { id: productGid },
      }),
      cache: "no-store",
    });

    const json = await response.json();

    if (json.errors) {
      console.error("Shopify API Error:", json.errors);
      return NextResponse.json(
        { error: "Failed to fetch product" },
        { status: 500 }
      );
    }

    const shopifyProduct: ShopifyProduct | null = json.data?.product;

    if (!shopifyProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Convert to our Product format
    const product = shopifyToProduct(shopifyProduct);

    return NextResponse.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
