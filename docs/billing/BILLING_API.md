# Billing & Payments Backend API

## Overview
Backend API for handling payments, subscriptions, and billing for NoMoreHieroglyphics. UI is provided by the client application.

## Payment Strategy

### Recommended: Stripe Integration
- PCI-compliant payment processing
- Subscription management
- Invoice generation
- Webhook support for events

### Alternative: In-App Purchases (Mobile)
- iOS: App Store In-App Purchases
- Android: Google Play Billing

---

## API Endpoints

### Base URL
```
Production: https://api.nomohieroglyphics.com/v1/billing
Development: http://localhost:3000/v1/billing
```

---

## Subscription Management

### GET /plans
List available subscription plans

**Response (200):**
```json
{
  "plans": [
    {
      "id": "free",
      "name": "Free",
      "price": 0,
      "interval": null,
      "features": [
        "5 translations per day",
        "Basic dictionary access"
      ]
    },
    {
      "id": "pro_monthly",
      "name": "Pro Monthly",
      "price": 9.99,
      "interval": "month",
      "currency": "USD",
      "features": [
        "Unlimited translations",
        "Full dictionary access",
        "Tone sanitizer",
        "Priority support"
      ]
    },
    {
      "id": "pro_yearly",
      "name": "Pro Yearly",
      "price": 99.99,
      "interval": "year",
      "currency": "USD",
      "features": [
        "All Pro features",
        "2 months free",
        "Priority support"
      ]
    }
  ]
}
```

---

### POST /subscribe
Create a new subscription

**Headers:** `Authorization: Bearer <token>`

**Request:**
```json
{
  "planId": "pro_monthly",
  "paymentMethodId": "pm_1234567890"
}
```

**Response (201):**
```json
{
  "subscriptionId": "sub_abc123",
  "status": "active",
  "currentPeriodEnd": "2024-02-17T00:00:00Z",
  "planId": "pro_monthly",
  "amount": 9.99,
  "currency": "USD"
}
```

**Errors:**
- `400` - Invalid plan or payment method
- `402` - Payment required (card declined)
- `409` - Already subscribed

---

### GET /subscription
Get current subscription

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "subscriptionId": "sub_abc123",
  "planId": "pro_monthly",
  "status": "active",
  "currentPeriodStart": "2024-01-17T00:00:00Z",
  "currentPeriodEnd": "2024-02-17T00:00:00Z",
  "cancelAtPeriodEnd": false,
  "amount": 9.99,
  "currency": "USD"
}
```

**Status Values:**
- `active` - Subscription is active
- `past_due` - Payment failed, retrying
- `canceled` - Subscription canceled
- `trialing` - In trial period

---

### POST /subscription/cancel
Cancel subscription

**Headers:** `Authorization: Bearer <token>`

**Request:**
```json
{
  "cancelAtPeriodEnd": true,
  "reason": "Too expensive"
}
```

**Response (200):**
```json
{
  "subscriptionId": "sub_abc123",
  "status": "active",
  "cancelAtPeriodEnd": true,
  "currentPeriodEnd": "2024-02-17T00:00:00Z",
  "message": "Subscription will cancel on 2024-02-17"
}
```

---

### POST /subscription/reactivate
Reactivate canceled subscription

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "subscriptionId": "sub_abc123",
  "status": "active",
  "cancelAtPeriodEnd": false,
  "message": "Subscription reactivated"
}
```

---

### PATCH /subscription
Update subscription plan

**Headers:** `Authorization: Bearer <token>`

**Request:**
```json
{
  "newPlanId": "pro_yearly"
}
```

**Response (200):**
```json
{
  "subscriptionId": "sub_abc123",
  "planId": "pro_yearly",
  "status": "active",
  "proratedAmount": -19.98,
  "message": "Plan updated successfully"
}
```

---

## Payment Methods

### POST /payment-methods
Add payment method

**Headers:** `Authorization: Bearer <token>`

**Request:**
```json
{
  "stripePaymentMethodId": "pm_1234567890"
}
```

**Response (201):**
```json
{
  "paymentMethodId": "pm_1234567890",
  "type": "card",
  "card": {
    "brand": "visa",
    "last4": "4242",
    "expMonth": 12,
    "expYear": 2025
  },
  "isDefault": true
}
```

---

### GET /payment-methods
List payment methods

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "paymentMethods": [
    {
      "id": "pm_1234567890",
      "type": "card",
      "card": {
        "brand": "visa",
        "last4": "4242",
        "expMonth": 12,
        "expYear": 2025
      },
      "isDefault": true
    }
  ]
}
```

---

### DELETE /payment-methods/{id}
Remove payment method

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "message": "Payment method removed"
}
```

---

## Invoices

### GET /invoices
List invoices

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `limit` - Number of invoices (default: 10)
- `offset` - Pagination offset

**Response (200):**
```json
{
  "invoices": [
    {
      "id": "inv_123",
      "amount": 9.99,
      "currency": "USD",
      "status": "paid",
      "created": "2024-01-17T00:00:00Z",
      "pdfUrl": "https://...",
      "hostedUrl": "https://..."
    }
  ],
  "hasMore": false
}
```

---

### GET /invoices/{id}
Get specific invoice

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "id": "inv_123",
  "number": "INV-2024-001",
  "amount": 9.99,
  "currency": "USD",
  "status": "paid",
  "created": "2024-01-17T00:00:00Z",
  "pdfUrl": "https://...",
  "hostedUrl": "https://...",
  "lineItems": [
    {
      "description": "Pro Monthly Subscription",
      "amount": 9.99,
      "quantity": 1
    }
  ]
}
```

---

## Usage Tracking

### GET /usage
Get current usage statistics

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "period": {
    "start": "2024-01-17T00:00:00Z",
    "end": "2024-02-17T00:00:00Z"
  },
  "plan": "pro_monthly",
  "usage": {
    "translations": {
      "used": 245,
      "limit": "unlimited"
    },
    "dictionarySearches": {
      "used": 89,
      "limit": "unlimited"
    },
    "toneSanitizations": {
      "used": 34,
      "limit": "unlimited"
    }
  },
  "quotaResetDate": "2024-02-17T00:00:00Z"
}
```

---

## Webhooks

### POST /webhooks/stripe
Stripe webhook endpoint

**Events Handled:**
- `invoice.payment_succeeded`
- `invoice.payment_failed`
- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`

**Webhook Signature Verification Required**

---

## Mobile In-App Purchases

### POST /verify-receipt/ios
Verify iOS App Store receipt

**Headers:** `Authorization: Bearer <token>`

**Request:**
```json
{
  "receiptData": "base64_encoded_receipt",
  "productId": "com.nomohieroglyphics.pro_monthly"
}
```

**Response (200):**
```json
{
  "valid": true,
  "subscriptionId": "sub_ios_123",
  "expiresDate": "2024-02-17T00:00:00Z",
  "productId": "com.nomohieroglyphics.pro_monthly"
}
```

---

### POST /verify-receipt/android
Verify Google Play purchase

**Headers:** `Authorization: Bearer <token>`

**Request:**
```json
{
  "purchaseToken": "google_purchase_token",
  "productId": "pro_monthly"
}
```

**Response (200):**
```json
{
  "valid": true,
  "subscriptionId": "sub_android_123",
  "expiresDate": "2024-02-17T00:00:00Z",
  "productId": "pro_monthly"
}
```

---

## Stripe Integration

### Configuration
```javascript
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Create customer
const customer = await stripe.customers.create({
  email: user.email,
  metadata: {
    userId: user.id
  }
});

// Create subscription
const subscription = await stripe.subscriptions.create({
  customer: customer.id,
  items: [{ price: 'price_1234567890' }],
  payment_behavior: 'default_incomplete',
  expand: ['latest_invoice.payment_intent']
});
```

### Environment Variables
```
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

---

## Database Schema

```sql
CREATE TABLE subscriptions (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  stripe_subscription_id VARCHAR(255),
  plan_id VARCHAR(50) NOT NULL,
  status VARCHAR(20) NOT NULL,
  current_period_start TIMESTAMP NOT NULL,
  current_period_end TIMESTAMP NOT NULL,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  INDEX idx_user_id (user_id),
  INDEX idx_status (status)
);

CREATE TABLE invoices (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  stripe_invoice_id VARCHAR(255),
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  status VARCHAR(20) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  INDEX idx_user_id (user_id)
);
```

---

## Implementation Note

**UI is provided by the client.** This API provides backend payment processing only. The client will implement:
- Payment form UI
- Subscription management interface
- Invoice display
- Plan comparison pages

Use Stripe Elements or Stripe Checkout for PCI-compliant card input on the frontend.

---

## Testing

### Test Cards (Stripe)
```
Success: 4242 4242 4242 4242
Decline: 4000 0000 0000 0002
3D Secure: 4000 0027 6000 3184
```

### Test Environment
```
Stripe Test Mode Keys:
sk_test_...
pk_test_...
```
