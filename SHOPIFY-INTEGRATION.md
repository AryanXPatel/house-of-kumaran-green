# House of Kumaran - Shopify Integration Guide

## Overview

This document describes how to integrate the House of Kumaran Next.js frontend with the Shopify backend.

## Setup Steps

### 1. Import Products to Shopify

1. Go to your Shopify Admin: https://admin.shopify.com
2. Navigate to **Products** > **Import**
3. Upload the `shopify-products-import.csv` file
4. Map the columns (should auto-detect)
5. Click **Import products**

### 2. Create Collections

Create these collections in Shopify Admin:

- **Podis** (handle: `podis`)
- **Pickles & Thokku** (handle: `pickles-thokku`)
- **Sweets** (handle: `sweets`)
- **Savouries** (handle: `savouries`)
- **Vadams & Appalam** (handle: `vadams-appalam`)
- **Ready-to-Mix** (handle: `ready-to-mix`)

After creating, add products to each collection based on their Type.

### 3. Configure Environment Variables

Copy `.env.example` to `.env.local` and fill in:

```env
NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=houseofkumaran.myshopify.com
NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN=your_storefront_token
SHOPIFY_ADMIN_ACCESS_TOKEN=your_admin_token  # Optional
NEXT_PUBLIC_SHOPIFY_API_VERSION=2024-01
```

**To get your Storefront Access Token:**

1. Go to Shopify Admin > Settings > Apps and sales channels
2. Click "Develop apps"
3. Create or select your headless app
4. Go to "API credentials"
5. Copy the "Storefront API access token"

### 4. Enable Shopify Mode

Add to your `.env.local`:

```env
NEXT_PUBLIC_USE_SHOPIFY=true
```

When `false` or not set, the app uses static product data.

### 5. Replace Product Images

The CSV uses placeholder Unsplash images. Replace them in Shopify Admin:

1. Go to Products
2. Click each product
3. Upload your actual product images
4. Set the first image as the main image

## Architecture

### Files Created

```
lib/
├── shopify.ts              # Shopify Storefront API client
├── shopify-cart-context.tsx # Shopify-integrated cart context
├── product-service.ts       # Unified product fetching (static/Shopify)
└── types.ts                 # Updated with Shopify fields

.env.local                   # Environment variables
.env.example                 # Template for environment variables
shopify-products-import.csv  # Product import CSV
```

### API Client (`lib/shopify.ts`)

Provides:

- `getAllProducts()` - Fetch all products
- `getProductByHandle(handle)` - Fetch single product
- `getProductsByCollection(handle)` - Fetch collection products
- `searchProducts(query)` - Search products
- `createCart()` - Create new cart
- `getCart(cartId)` - Get existing cart
- `addToCart(cartId, lines)` - Add items to cart
- `updateCartLines(cartId, lines)` - Update quantities
- `removeFromCart(cartId, lineIds)` - Remove items
- `shopifyToProduct(shopifyProduct)` - Convert to internal type

### Product Service (`lib/product-service.ts`)

Unified interface that switches between static and Shopify:

- When `USE_SHOPIFY=false`: Uses `lib/products.ts`
- When `USE_SHOPIFY=true`: Calls Shopify Storefront API

### Cart Integration

Two cart implementations:

1. **Local Cart** (`lib/cart-context.tsx`): localStorage-based, works offline
2. **Shopify Cart** (`lib/shopify-cart-context.tsx`): Syncs with Shopify, enables native checkout

## Checkout Flow

### Option A: Shopify Checkout (Recommended)

1. Customer adds items to cart
2. Cart syncs with Shopify Cart API
3. Click "Checkout" redirects to Shopify's hosted checkout
4. Payment handled by Shopify
5. Order appears in Shopify Admin

### Option B: Custom Checkout (Current)

1. Customer adds items to cart
2. Cart stored locally
3. Custom checkout form collects details
4. Payment integration needed (Razorpay, Stripe, etc.)
5. Order needs to be created via Shopify Admin API

## Enabling Shopify Checkout

To redirect to Shopify checkout instead of custom:

1. Update `cart-drawer.tsx`:

```tsx
// Change from
<Link href="/checkout">
// To
<a href={checkoutUrl} className="...">
```

2. The `checkoutUrl` is provided by the Shopify Cart API

## Troubleshooting

### "Cannot add to cart: missing cart ID or variant ID"

- Products must have variant IDs from Shopify
- Run with static data first to test

### "Shopify API Error"

- Check your Storefront Access Token
- Verify API version is correct
- Check store domain has no typos

### Products not showing

- Verify products are set to "Active" in Shopify
- Check collection assignments
- Products must be published to "Online Store" sales channel

## Development vs Production

**Development:**

```env
NEXT_PUBLIC_USE_SHOPIFY=false
```

**Production:**

```env
NEXT_PUBLIC_USE_SHOPIFY=true
NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN=your_real_token
```

## Next Steps

1. ✅ Import products to Shopify
2. ✅ Create collections
3. ✅ Configure environment variables
4. ⬜ Upload actual product images
5. ⬜ Set up payment methods in Shopify
6. ⬜ Configure shipping zones and rates
7. ⬜ Set up email notifications
8. ⬜ Test checkout flow end-to-end
9. ⬜ Add Google Analytics / Facebook Pixel

## Support

For Shopify-specific questions:

- [Shopify Storefront API Docs](https://shopify.dev/docs/api/storefront)
- [Shopify Headless Documentation](https://shopify.dev/docs/custom-storefronts)
