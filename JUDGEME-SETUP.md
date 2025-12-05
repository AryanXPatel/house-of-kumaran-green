# Judge.me Product Reviews Integration

This document explains how to set up and configure Judge.me product reviews for your House of Kumaran store.

## Prerequisites

1. **Judge.me Awesome Plan** - The headless/external platform integration requires Judge.me's paid "Awesome" plan
2. **Judge.me installed on Shopify** - Install Judge.me from the Shopify App Store

## Setup Steps

### 1. Install Judge.me on Shopify

1. Go to your Shopify Admin > Apps
2. Search for "Judge.me Product Reviews" in the Shopify App Store
3. Install the app and upgrade to the Awesome plan for API access

### 2. Get Your API Tokens

1. In your Shopify Admin, open the Judge.me app
2. Go to Settings > API
3. Copy your **Private API Token** and **Public API Token**

### 3. Configure Environment Variables

Update your `.env.local` file with the following variables:

```env
# Judge.me Product Reviews Configuration
NEXT_PUBLIC_JUDGEME_SHOP_DOMAIN=houseofkumaran.myshopify.com
JUDGEME_PRIVATE_API_TOKEN=your_private_api_token_here
NEXT_PUBLIC_JUDGEME_PUBLIC_API_TOKEN=your_public_api_token_here
```

Replace:

- `your_private_api_token_here` with your Private API Token (keep this secret!)
- `your_public_api_token_here` with your Public API Token

### 4. Restart Your Development Server

After updating the environment variables:

```bash
npm run dev
```

## Features Implemented

### Product Page Reviews Section

- **Rating Summary**: Displays average rating and total review count
- **Rating Distribution**: Visual bar chart showing 5-star to 1-star distribution
- **Review List**: Paginated list of customer reviews with:
  - Star ratings
  - Review title and body
  - Reviewer name
  - Verified purchase badge
  - Review images (if any)
  - Review date
- **Sorting Options**: Sort by newest, oldest, highest rating, lowest rating
- **Filtering**: Filter reviews by star rating
- **Write Review Form**: Modal form for customers to submit reviews

### Product Card Star Ratings

- Displays Judge.me ratings on product cards (when reviews exist)
- Falls back to default rating display when no Judge.me reviews

## File Structure

```
lib/
  judgeme.ts          # Judge.me API service (fetch/submit reviews)

app/api/reviews/
  route.ts            # POST endpoint for submitting reviews
  [productId]/
    route.ts          # GET endpoint for fetching reviews

components/
  product-reviews.tsx     # Main reviews section component
  star-rating-badge.tsx   # Reusable star rating badge component
```

## API Endpoints

### GET /api/reviews/[productId]

Fetches reviews for a specific product.

**Query Parameters:**

- `page` (optional): Page number (default: 1)
- `perPage` (optional): Reviews per page (default: 10)

**Response:**

```json
{
  "success": true,
  "data": {
    "reviews": [...],
    "currentPage": 1,
    "perPage": 10,
    "averageRating": 4.5,
    "totalReviews": 25
  }
}
```

### POST /api/reviews

Submits a new review.

**Request Body:**

```json
{
  "productId": "123456789",
  "productTitle": "Curry Podi",
  "productHandle": "curry-podi",
  "reviewerName": "John Doe",
  "reviewerEmail": "john@example.com",
  "rating": 5,
  "title": "Amazing product!",
  "body": "This curry podi is absolutely delicious..."
}
```

## Customization

### Styling

All components use Tailwind CSS classes matching your store's theme:

- Primary gold: `#b8860b`
- Background green: `#0d1f14`
- Text cream: `#f5f0e1`

### Modifying Components

**To change review display:**
Edit `components/product-reviews.tsx`

**To change star rating badge:**
Edit `components/star-rating-badge.tsx`

**To modify API behavior:**
Edit `lib/judgeme.ts`

## Troubleshooting

### 403 Error - "Public token does not have enough permissions"

The private API token must be used for server-side calls. Make sure:

1. `JUDGEME_PRIVATE_API_TOKEN` is correctly set in `.env.local`
2. The token is your **Private API Token** from Judge.me Settings > Integrations > View API tokens

### Reviews not showing

1. Check that API tokens are correctly set in `.env.local`
2. Verify you have the Judge.me Awesome plan
3. Ensure products have reviews in Judge.me dashboard
4. Check server console for API errors

### "Judge.me not configured" warning

Environment variables are missing. Check your `.env.local` file.

### Review submission not working

1. Ensure `NEXT_PUBLIC_JUDGEME_SHOP_DOMAIN` matches your Shopify store domain
2. The product must exist in your Shopify store
3. Check server logs for detailed error messages
4. Submitted reviews go through moderation before appearing

### How to Get API Tokens

1. Log into your Shopify Admin
2. Go to Apps > Judge.me Product Reviews
3. Click on **Settings** > **Integrations**
4. Click **View API tokens** (top right)
5. You'll find:
   - **Public API Token** - Limited permissions, safe for client-side
   - **Private API Token** - Full permissions, server-side only (keep secret!)

## Judge.me Dashboard

After integration, manage your reviews in the Judge.me dashboard:

- Moderate and approve reviews
- Respond to reviews
- Set up automated review request emails
- Configure review widgets

## Support

- Judge.me Help Center: https://judge.me/help
- Judge.me API Docs: https://judge.me/api/docs
