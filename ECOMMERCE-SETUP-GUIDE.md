# House of Kumaran - E-commerce Setup Guide

## Complete Workflow: Discount, Shipping & Tracking

This guide covers the setup for:

1. **Kumaran Family 10% Discount** - Lifetime discount for newsletter subscribers
2. **Delivery Charges** - Shipping rates with NimbusPost
3. **Order Tracking** - Real-time tracking integration
4. **Cart & Wishlist Sync** - Cross-device synchronization

---

## 0. CART & WISHLIST CROSS-DEVICE SYNC (NEW!)

### The Problem

When a user logs in on a different device, their cart and wishlist were empty because this data was stored in browser localStorage (device-specific).

### The Solution

We've implemented cloud sync using Shopify Customer Metafields:

**How it works:**

1. When user **logs in** → Cart & Wishlist are loaded from Shopify customer metafields
2. Local items are **merged** with cloud items (no data loss)
3. Every 30 seconds (if active) → Data is saved to cloud
4. When user closes browser → Data is saved via `navigator.sendBeacon`

**Files Created/Modified:**

- `app/api/customer/wishlist/route.ts` - API to save/load wishlist
- `app/api/customer/cart/route.ts` - API to save/load cart ID
- `lib/customer-sync.tsx` - Auto-sync hook and provider
- `lib/wishlist-context.tsx` - Added cloud sync functions
- `lib/shopify-cart-context.tsx` - Added customer association
- `lib/auth-context.tsx` - Added `getCustomerId` helper

**Required Environment Variables:**

```env
# These are the same Admin API credentials used for order tracking
SHOPIFY_ADMIN_API_URL=https://houseofkumaran.myshopify.com/admin/api/2024-01
SHOPIFY_ADMIN_ACCESS_TOKEN=shpat_xxxxxxxxxxxxx
```

**Required Shopify Admin API Scopes:**

- `read_customers`
- `write_customers` (for metafields)
- `read_orders` (for order tracking)

**To Get Admin API Token:**

1. Shopify Admin → Settings → Apps and sales channels
2. Develop apps → Create an app
3. Name: "House of Kumaran API"
4. Admin API scopes: `read_customers`, `write_customers`, `read_orders`
5. Install the app and copy the Admin API access token

---

## 1. KUMARAN FAMILY 10% DISCOUNT SETUP

### Option A: Discount Code (Recommended for Start)

**In Shopify Admin:**

1. Go to **Discounts** → **Create discount**
2. Choose **Discount code**
3. Settings:
   - Code: `KUMARANFAMILY` (or `NAMASTE`)
   - Type: Percentage
   - Value: 10%
   - Applies to: All products
   - Minimum requirements: None
   - Customer eligibility: All customers
   - Usage limits: One use per customer
   - Active dates: No end date (forever)
4. Save

**Website Integration:**

- When someone subscribes to newsletter (Join Kumaran Family):
  - Send them an email with the discount code
  - Or display the code on the success message

### Option B: Automatic Discount for Tagged Customers (Advanced)

**In Shopify Admin:**

1. Go to **Discounts** → **Create discount**
2. Choose **Automatic discount**
3. Settings:
   - Method: Automatic
   - Type: Percentage
   - Value: 10%
   - Applies to: All products
   - Customer eligibility: Specific customer segments
   - Create segment: Customers tagged with "kumaran-family"
4. Save

**To auto-tag newsletter subscribers:**

- Use Shopify Flow (Shopify Plus) or
- Use a third-party app like Klaviyo, Mailchimp, or Omnisend
- Or manually tag customers who subscribe

---

## 2. DELIVERY CHARGES SETUP

### In Shopify Admin:

1. Go to **Settings** → **Shipping and delivery**
2. Under **Shipping**, click **Manage rates**
3. Create/Edit shipping profile:

**For Domestic (India) Shipping:**

| Zone          | Condition   | Rate Name         | Price |
| ------------- | ----------- | ----------------- | ----- |
| All India     | Cart ≥ ₹500 | Free Shipping     | ₹0    |
| All India     | Cart < ₹500 | Standard Shipping | ₹50   |
| Metro Cities  | Cart < ₹500 | Express Shipping  | ₹40   |
| Rest of India | Cart < ₹500 | Standard Shipping | ₹60   |

**Note:** NimbusPost will handle actual courier selection and may have different actual costs. These are the rates customers pay.

### NimbusPost Settings:

Your current NimbusPost settings look good:

```
Channel Name: houseofkumaran
Fulfill Orders: Order is Booked
Customer notify when order fulfill: Do Not Notify (Shopify handles this)
Auto Update Shipment Status: ENABLE THIS ✓
Cancel orders: Enable if you want auto-cancel sync
Mark as paid: Enable for COD orders
```

**Recommended Changes:**

1. **Enable "Auto Update Shipment Status in Shopify"** - This syncs tracking updates
2. Consider enabling customer notifications if you want NimbusPost to send SMS updates

---

## 3. ORDER TRACKING SETUP

### How Tracking Works:

1. **Customer places order** → Shopify creates order
2. **NimbusPost syncs order** → Assigns AWB number
3. **Tracking number syncs to Shopify** → Visible in order details
4. **Customer tracks order** → Via your website or NimbusPost URL

### Website Tracking Page:

The tracking page (`/track`) now supports:

- **Order Number tracking** - Queries Shopify for order status
- **AWB tracking** - Opens NimbusPost tracking page directly

### Environment Variables Needed:

Add these to your `.env.local` (for order number tracking):

```env
# Shopify Admin API (for server-side order lookup)
SHOPIFY_ADMIN_API_URL=https://houseofkumaran.myshopify.com/admin/api/2024-01
SHOPIFY_ADMIN_ACCESS_TOKEN=your_admin_access_token_here
```

**To get Admin Access Token:**

1. Go to Shopify Admin → **Settings** → **Apps and sales channels**
2. Click **Develop apps** → **Create an app**
3. Name it "Order Tracking API"
4. Configure Admin API scopes:
   - `read_orders`
   - `read_fulfillments`
5. Install the app and copy the **Admin API access token**

### Direct NimbusPost Tracking:

Customers can track directly at:

```
https://ship.nimbuspost.com/shipping/tracking/{AWB_NUMBER}
```

This URL is automatically used when customers enter their AWB number.

---

## 4. COMPLETE CUSTOMER WORKFLOW

### New Customer Journey:

```
1. Customer visits website
      ↓
2. Subscribes to "Join Kumaran Family" newsletter
      ↓
3. Receives email with KUMARANFAMILY discount code (10% off forever)
      ↓
4. Shops and adds products to cart
      ↓
5. Goes to checkout, applies discount code
      ↓
6. Pays (discount applied + shipping calculated)
      ↓
7. Shopify creates order
      ↓
8. NimbusPost receives order (auto-sync)
      ↓
9. NimbusPost assigns AWB, books courier
      ↓
10. Tracking number syncs back to Shopify
      ↓
11. Customer receives shipping confirmation email with tracking
      ↓
12. Customer tracks via /track page or NimbusPost URL
      ↓
13. Package delivered!
```

### Returning Customer Journey:

```
1. Customer returns to website
      ↓
2. Already has KUMARANFAMILY code (saved or remembered)
      ↓
3. Applies code at checkout for 10% off
      ↓
4. Same fulfillment flow...
```

---

## 5. SHOPIFY CHECKOUT CUSTOMIZATION

### How to Access Checkout Branding:

1. Go to Shopify Admin → **Online Store** → **Themes**
2. Click **Customize** on your active theme
3. In the dropdown (top-left), select **Checkout and accounts** or navigate to checkout pages
4. Alternatively: **Settings** → **Checkout** → **Customize checkout**

### Checkout Branding Options:

**1. Logo & Banner**

- **Logo**: Upload House of Kumaran logo (PNG with transparent background)
- **Position**: Left, center, or right
- **Size**: Adjust slider (recommend medium-large for brand visibility)
- **Banner image**: Optional decorative header image

**2. Colors (Match Your Brand)**

```
Background:       #0d1f14 (dark green)
Form fields:      #1a472a (lighter green)
Accents/Links:    #b8860b (gold)
Buttons:          #b8860b (gold)
Button text:      #0d1f14 (dark green on gold)
Error messages:   #ef4444 (red)
Text:             #f5f0e1 (cream)
```

**3. Typography**

- **Headings**: Choose a serif font (similar to your site)
- **Body**: Choose a clean sans-serif font
- **Shopify fonts available**: Cormorant (serif), Inter (sans-serif)

**4. Layout Options**

- **One-page checkout**: Faster, modern (recommended)
- **Three-page checkout**: Traditional, step-by-step

### Step-by-Step Checkout Customization:

```
1. Shopify Admin → Online Store → Themes → Customize
2. Top-left dropdown → Select "Checkout"
3. Left sidebar → Theme settings icon
4. Sections:
   - LOGO: Upload /public/images/houseofkumaranlogo.png
   - COLORS:
     • Primary button: #b8860b
     • Primary button label: #0d1f14
     • Background: #0d1f14
     • Form background: #1a472a
     • Text: #f5f0e1
   - TYPOGRAPHY: Select Cormorant for headings
5. Click Save
```

---

## 6. EMAIL NOTIFICATIONS SETUP

### Where to Find Email Templates:

1. Go to Shopify Admin → **Settings** → **Notifications**
2. You'll see all email templates organized by category

### Key Emails to Customize:

**Order Emails:**
| Email | Purpose | Priority |
|-------|---------|----------|
| Order confirmation | Sent after purchase | ⭐⭐⭐ High |
| Order edited | When you modify order | Medium |
| Order cancelled | When order is cancelled | Medium |

**Shipping Emails:**
| Email | Purpose | Priority |
|-------|---------|----------|
| Shipping confirmation | Sent with tracking number | ⭐⭐⭐ High |
| Shipping update | When status changes | Medium |
| Out for delivery | Near delivery | ⭐⭐ Medium |
| Delivered | After delivery | Medium |

**Customer Emails:**
| Email | Purpose | Priority |
|-------|---------|----------|
| Customer account welcome | New account created | ⭐⭐ Medium |
| Customer account invite | Invite to create account | Low |
| Password reset | When requested | Low |

### How to Edit Email Templates:

1. Click on any email template (e.g., "Order confirmation")
2. You'll see HTML/Liquid code
3. Modify:
   - **Subject line**: Make it on-brand
   - **Logo**: Add your logo URL
   - **Colors**: Change hex codes
   - **Copy**: Update text/tone
4. Click **Preview** to see changes
5. Click **Save**

### Recommended Email Subject Lines:

```
Order Confirmation:
"🙏 Thank you for your order, {{ customer.first_name }}! | House of Kumaran"

Shipping Confirmation:
"📦 Your Kumaran order is on its way! | Track: {{ fulfillment.tracking_number }}"

Delivered:
"✅ Your House of Kumaran order has been delivered!"

Account Welcome:
"🏠 Welcome to the Kumaran Family, {{ customer.first_name }}!"
```

### Adding Your Branding to Emails:

In each email template, find the header section and add your logo:

```html
<!-- In the email template, find <table> header and add: -->
<img
  src="https://houseofkumaran.com/images/houseofkumaranlogo.png"
  alt="House of Kumaran"
  width="150"
  style="display:block; margin: 0 auto 20px auto;"
/>

<!-- Update colors: -->
<style>
  .button {
    background-color: #b8860b !important;
    color: #0d1f14 !important;
  }
</style>
```

### Adding Discount Code to Order Confirmation:

In the Order Confirmation template, add after the order details:

```liquid
{% comment %} First-time customer discount prompt {% endcomment %}
{% if customer.orders_count == 1 %}
<div style="background-color: #f5f0e1; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
  <p style="color: #0d1f14; font-size: 16px; margin: 0 0 10px 0;">
    <strong>🎉 Welcome to the Kumaran Family!</strong>
  </p>
  <p style="color: #0d1f14; font-size: 14px; margin: 0 0 15px 0;">
    Use code <strong style="color: #b8860b;">KUMARANFAMILY</strong> for 10% off your next order!
  </p>
</div>
{% endif %}
```

---

## 7. CUSTOMER SEGMENT & DISCOUNT CLARIFICATION

### ⚠️ Important: Automatic Discounts Limitation

**The Issue You Asked About:**

> "Customer needs to be logged in with the same email on checkout"

**YES, this is correct for segment-based automatic discounts.**

### Why Customer Segments Require Login:

1. Shopify creates a "Customer Segment" (like your "HOUSEOFKUMARAN" segment)
2. To identify if a customer belongs to a segment, Shopify needs to know WHO they are
3. This requires the customer to:
   - Have an account (created from their email)
   - Be logged in during checkout
4. If not logged in → Shopify doesn't know if they're in the segment → discount won't auto-apply

### Better Approaches:

**Option 1: Discount CODE (No Login Required) ⭐ RECOMMENDED**

```
Flow:
1. Customer subscribes to newsletter with email
2. They receive an email with code "KUMARANFAMILY"
3. At checkout, they manually enter the code
4. 10% discount applied - NO LOGIN NEEDED!

Pros:
- Works without account/login
- Simple to implement
- Customer remembers they're special

Cons:
- Customer must remember/find code
- Code can be shared (maybe good for word-of-mouth?)
```

**Option 2: Automatic Discount with Login**

```
Flow:
1. Customer creates account or logs in
2. You tag them (manually or via app) with "kumaran-family"
3. Automatic discount fires for tagged customers at checkout

Pros:
- Seamless for logged-in customers

Cons:
- MUST be logged in
- Extra friction (account creation)
- Newsletter subscribers need to create accounts
```

**Option 3: Shopify Flow Automation (Shopify Plus Only)**

```
Flow:
1. Newsletter signup triggers Shopify Flow
2. Flow creates customer account & tags them
3. Sends email with auto-login link
4. Customer auto-logged in at checkout

Pros:
- Fully automated
- Best experience

Cons:
- Requires Shopify Plus ($$$)
```

### Our Recommendation for House of Kumaran:

**Use DISCOUNT CODE approach:**

1. Create `KUMARANFAMILY` code in Shopify (10% off)
2. Newsletter signup captures email (already working)
3. Display success message: "Check your email for your exclusive 10% discount code!"
4. Set up email automation to send the code

### To Send Discount Code via Email (Free Options):

**Using Shopify Email (Free tier available):**

1. Shopify Admin → Marketing → Email campaigns
2. Create automation → "Welcome email"
3. Add discount code in the email body

**Using Web3Forms + Email Service:**
Your current Web3Forms sends emails to `support@houseofkumaran.com`.
Set up an auto-reply or use email rules to send back the discount code.

---

## 8. EMAIL AUTOMATION SETUP OPTIONS

### Free/Cheap Options:

**1. Shopify Email (Included in Shopify)**

- Go to Marketing → Automations
- Create: "Welcome email for new subscribers"
- Include discount code in email

**2. Mailchimp (Free up to 500 contacts)**

- Connect Mailchimp to Shopify
- Create welcome automation
- Auto-send discount code

**3. Klaviyo (Free up to 250 contacts)**

- Best Shopify integration
- Can auto-tag customers
- Advanced segmentation

### Setting Up Shopify Email Automation:

```
1. Shopify Admin → Marketing → Automations
2. Click "Create automation"
3. Choose "Welcome new subscriber"
4. Edit the email:
   - Subject: "Welcome to the Kumaran Family! 🏠 Here's your 10% off"
   - Body: Include KUMARANFAMILY code
5. Activate the automation
```

---

## 9. PRACTICAL CHECKLIST

### Immediate Setup (Do Now):

- [ ] Create discount code `KUMARANFAMILY` in Shopify (10% off)
- [ ] Set up shipping rates in Shopify (Free above ₹500, Standard ₹80)
- [ ] Enable "Auto Update Shipment Status" in NimbusPost
- [ ] Customize checkout branding (colors, logo)
- [ ] Update order confirmation email template with branding

### Short-term (This Week):

- [ ] Get Shopify Admin API token for order tracking
- [ ] Add environment variables to Vercel/hosting
- [ ] Test complete order flow end-to-end
- [ ] Set up Shopify Email automation for welcome email with discount code
- [ ] Customize shipping confirmation email

### Long-term (Next Month):

- [ ] Set up Klaviyo or similar for advanced email automation
- [ ] Configure automatic customer tagging
- [ ] Add SMS notifications via NimbusPost
- [ ] Set up abandoned cart recovery emails
- [ ] A/B test email subject lines

---

## 10. TROUBLESHOOTING

### Order Tracking Not Working?

1. Check if SHOPIFY_ADMIN_ACCESS_TOKEN is set
2. Verify API permissions include read_orders
3. Check order number format (with or without #)
4. Verify email matches exactly

### Discount Code Not Working?

1. Check if code is active in Shopify
2. Verify no minimum purchase requirement (unless intended)
3. Check customer eligibility settings
4. Ensure code hasn't been used (if one-time)

### NimbusPost Not Syncing?

1. Check NimbusPost dashboard for errors
2. Verify Shopify channel is connected
3. Check if order tags are blocking sync
4. Contact NimbusPost support if needed

---

## 11. USEFUL LINKS

- **Shopify Admin**: https://houseofkumaran.myshopify.com/admin
- **NimbusPost Dashboard**: https://ship.nimbuspost.com/
- **NimbusPost Tracking**: https://ship.nimbuspost.com/shipping/tracking/{AWB}
- **Shopify Discounts Guide**: https://help.shopify.com/en/manual/discounts
- **Shopify Shipping Guide**: https://help.shopify.com/en/manual/shipping

---

## Need Help?

For technical issues with the website, check the codebase:

- Track page: `/app/track/page.tsx`
- Track API: `/app/api/track-order/route.ts`
- Newsletter form: `/components/footer.tsx`

For Shopify/NimbusPost issues, contact their support or your developer.
