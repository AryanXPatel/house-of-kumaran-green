# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

House of Kumaran - E-commerce platform for authentic South Indian foods built with Next.js 16 (App Router) and React 19. Uses Shopify as the backend with a custom headless frontend.

## Commands

```bash
npm run dev      # Start development server at localhost:3000
npm run build    # Production build
npm run start    # Start production server
npm run lint     # ESLint check
```

## Architecture

### Tech Stack
- **Frontend:** Next.js 16.0.7 (App Router), React 19, TypeScript, Tailwind CSS 4
- **UI Components:** Radix UI primitives via shadcn/ui
- **E-commerce:** Shopify Storefront API (GraphQL)
- **Auth:** Dual system - Shopify email/password + Google OAuth via Supabase
- **Database:** Supabase (PostgreSQL) for Google auth users, cart sync, wishlist

### Directory Structure
```
app/                    # Next.js App Router pages and API routes
├── api/               # API endpoints (auth, customer, products, reviews)
├── shop/              # Shopping pages
├── product/[id]/      # Product detail pages
├── account/           # Protected user account routes
└── checkout/          # Checkout flow

components/            # React components (use "use client" for interactive)
lib/                   # Core business logic
├── auth-context.tsx   # Authentication state (email + Google)
├── shopify-cart-context.tsx  # Shopify cart integration
├── shopify.ts         # Shopify Storefront API client
├── supabase.ts        # Supabase client
├── types.ts           # TypeScript interfaces
└── product-service.ts # Unified product fetching
```

### Context Provider Hierarchy (in app/layout.tsx)
```
GoogleAuthProvider → AuthProvider → ShopifyCartProvider → WishlistProvider → RecentlyViewedProvider → CustomerSyncProvider
```

### Authentication Flow
1. **Email/Password:** Via Shopify Storefront API (returns customer access token)
2. **Google OAuth:** Google → Supabase user creation → JWT cookie → optional Shopify Admin customer creation
3. Middleware (`middleware.ts`) protects `/account` routes using JWT verification

### Cart System
- **Local mode** (`NEXT_PUBLIC_USE_SHOPIFY=false`): localStorage-based
- **Shopify mode** (`NEXT_PUBLIC_USE_SHOPIFY=true`): Syncs with Shopify Cart API, enables native checkout

### Data Toggle
Set `NEXT_PUBLIC_USE_SHOPIFY=true` in `.env.local` to use Shopify API, otherwise uses static data from `lib/products.ts`.

## Key Files

- `lib/shopify.ts` - All Shopify GraphQL queries (products, cart, checkout)
- `lib/auth-context.tsx` - Auth state management, login/logout, token refresh
- `components/auth-drawer.tsx` - Login/signup UI (largest component)
- `components/product-details.tsx` - Product page component
- `middleware.ts` - Route protection via JWT verification

## Environment Variables

Required in `.env.local`:
```
NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN
NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN
NEXT_PUBLIC_GOOGLE_CLIENT_ID
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY    # Server-side only
JWT_SECRET
```

Optional:
```
NEXT_PUBLIC_USE_SHOPIFY=true  # Enable Shopify API (default: false)
SHOPIFY_ADMIN_ACCESS_TOKEN    # For Admin API features
```

## Design System

- **Theme:** Dark with gold accents (background: #0d1f14, accent: #b8860b)
- **Fonts:** Inter (body), Playfair Display (headings)
- **UI:** shadcn/ui components configured in `components.json`
- Design tokens defined in `app/globals.css`

## Patterns

- Interactive components must have `"use client"` directive
- API routes handle GET/POST/DELETE separately in route.ts files
- Use `lib/types.ts` for shared TypeScript interfaces
- Forms use react-hook-form + Zod validation
- Toast notifications via Sonner

## Important Notes

- Checkout redirects to `shop.houseofkumaran.com` subdomain (Shopify hosted checkout)
- Supabase operations use service role key on server-side to bypass RLS
- No test framework currently configured
