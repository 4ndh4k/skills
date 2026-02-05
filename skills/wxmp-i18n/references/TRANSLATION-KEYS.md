# WeChat Mini Program i18n Translation Keys Reference

This file contains the complete translation key structure and all available keys organized by domain.

## Translation Key Structure

Translation keys use dot notation for hierarchical organization:

```
domain.subdomain.key_name
```

### Key Naming Rules

- Use **lowercase with underscores**: `pending_payment`, `stock_insufficient`
- Use **dot notation** for nesting: `order.status.pending_payment`
- Group by **functional domain**: `common`, `cart`, `order`, `product`, `coupon`
- Separate **transform-specific keys** under `transform.*`

## Available Translation Keys

### Common

Keys for universal UI elements used across the app.

```json
{
  "common": {
    "loading": "Loading",
    "loading_failed": "Loading failed",
    "error": "Error",
    "success": "Success",
    "confirm": "Confirm",
    "cancel": "Cancel",
    "retry": "Retry",
    "submit": "Submit",
    "delete": "Delete",
    "edit": "Edit",
    "save": "Save",
    "close": "Close",
    "back": "Back",
    "next": "Next",
    "done": "Done",
    "search": "Search",
    "filter": "Filter",
    "sort": "Sort",
    "refresh": "Refresh",
    "more": "More",
    "view_all": "View All",
    "select": "Select",
    "selected": "Selected",
    "total": "Total",
    "subtotal": "Subtotal",
    "quantity": "Quantity",
    "price": "Price",
    "discount": "Discount",
    "free": "Free"
  }
}
```

### Cart

Shopping cart related translations.

```json
{
  "cart": {
    "title": "Shopping Cart",
    "empty": {
      "title": "Cart is empty",
      "subtitle": "Add some products to get started",
      "btn_shop": "Start Shopping"
    },
    "stock": {
      "insufficient": "Stock insufficient",
      "out_of_stock": "Out of stock",
      "available": "{count} available"
    },
    "actions": {
      "add_to_cart": "Add to Cart",
      "buy_now": "Buy Now",
      "update_quantity": "Update Quantity",
      "remove_item": "Remove Item",
      "clear_cart": "Clear Cart",
      "checkout": "Checkout"
    },
    "messages": {
      "added": "Added to cart",
      "removed": "Removed from cart",
      "updated": "Cart updated",
      "cleared": "Cart cleared"
    }
  }
}
```

### Order

Order management and status translations.

```json
{
  "order": {
    "title": "My Orders",
    "status": {
      "pending_payment": "Pending Payment",
      "pending_delivery": "Pending Delivery",
      "pending_receipt": "Pending Receipt",
      "completed": "Completed",
      "canceled": "Canceled",
      "refunding": "Refunding",
      "refunded": "Refunded"
    },
    "detail": {
      "title": "Order Details",
      "order_number": "Order Number",
      "order_time": "Order Time",
      "payment_time": "Payment Time",
      "delivery_time": "Delivery Time",
      "completion_time": "Completion Time",
      "cancel_time": "Cancel Time"
    },
    "items": {
      "title": "Order Items",
      "quantity": "Quantity",
      "price": "Price",
      "subtotal": "Subtotal"
    },
    "amount": {
      "title": "Amount Details",
      "goods_amount": "Goods Amount",
      "delivery_fee": "Delivery Fee",
      "discount": "Discount",
      "coupon_discount": "Coupon Discount",
      "paid_amount": "Paid Amount",
      "refund_amount": "Refund Amount"
    },
    "buttons": {
      "cancel_order": "Cancel Order",
      "pay": "Pay",
      "confirm_receipt": "Confirm Receipt",
      "view_logistics": "View Logistics",
      "buy_again": "Buy Again",
      "apply_refund": "Apply Refund",
      "contact_service": "Contact Service"
    },
    "trajectory": {
      "submitted": "Order submitted",
      "payment_success": "Order paid successfully, payment method:",
      "wechat_pay": "WeChat Pay",
      "canceled": "Order canceled",
      "delivery_started": "Order shipped",
      "completed": "Order completed"
    }
  }
}
```

### Product

Product display and detail translations.

```json
{
  "product": {
    "detail": {
      "title": "Product Details",
      "price": "Price",
      "sale_price": "Sale Price",
      "strike_price": "List Price",
      "stock": "Stock",
      "sold": "Sold",
      "description": "Description",
      "specifications": "Specifications",
      "reviews": "Reviews"
    },
    "variant": {
      "select": "Please select",
      "selected": "Selected",
      "out_of_stock": "Out of stock"
    },
    "actions": {
      "add_to_cart": "Add to Cart",
      "buy_now": "Buy Now",
      "add_to_wishlist": "Add to Wishlist"
    },
    "messages": {
      "select_required": "Please select {option}",
      "added_to_cart": "Added to cart",
      "out_of_stock": "This product is out of stock"
    }
  }
}
```

### Coupon

Coupon selection and usage translations.

```json
{
  "coupon": {
    "title": "Coupons",
    "select": {
      "title": "Select Coupon",
      "available_count": "You have {count} available coupons",
      "selected_count": "Selected {count} recommended coupons, total discount:",
      "no_coupons": "No coupons available",
      "load_failed": "Failed to load coupons",
      "use_coupon": "Use Coupon",
      "not_use": "Not Use"
    },
    "list": {
      "available": "Available",
      "used": "Used",
      "expired": "Expired"
    },
    "detail": {
      "amount": "Coupon Amount",
      "min_order": "Minimum Order",
      "valid_until": "Valid Until",
      "description": "Description",
      "terms": "Terms and Conditions"
    },
    "status": {
      "available": "Available",
      "used": "Used",
      "expired": "Expired"
    }
  }
}
```

### Address

Address management translations.

```json
{
  "address": {
    "title": "Address Management",
    "list": {
      "title": "My Addresses",
      "add": "Add Address",
      "edit": "Edit Address",
      "delete": "Delete Address",
      "set_default": "Set as Default",
      "default": "Default"
    },
    "form": {
      "title": "Address",
      "name": "Name",
      "phone": "Phone",
      "region": "Region",
      "detail": "Detailed Address",
      "postal_code": "Postal Code",
      "tag": "Tag",
      "tags": {
        "home": "Home",
        "company": "Company",
        "school": "School",
        "other": "Other"
      }
    },
    "validation": {
      "name_required": "Please enter recipient name",
      "phone_required": "Please enter phone number",
      "phone_invalid": "Phone number format is incorrect",
      "region_required": "Please select region",
      "detail_required": "Please enter detailed address"
    },
    "actions": {
      "save": "Save Address",
      "delete_confirm": "Are you sure to delete this address?"
    }
  }
}
```

### Profile

User profile and settings translations.

```json
{
  "profile": {
    "title": "My Profile",
    "info": {
      "avatar": "Avatar",
      "nickname": "Nickname",
      "phone": "Phone",
      "email": "Email",
      "gender": "Gender",
      "birthday": "Birthday"
    },
    "gender": {
      "male": "Male",
      "female": "Female",
      "unknown": "Unknown"
    },
    "settings": {
      "title": "Settings",
      "language": "Language",
      "notification": "Notification",
      "privacy": "Privacy",
      "about": "About"
    },
    "actions": {
      "edit_profile": "Edit Profile",
      "change_avatar": "Change Avatar",
      "logout": "Logout",
      "login": "Login"
    }
  }
}
```

### Transform

Transform-specific translations for data conversion functions.

```json
{
  "transform": {
    "order": {
      "status": {
        "pending_payment": "Pending Payment",
        "pending_delivery": "Pending Delivery",
        "pending_receipt": "Pending Receipt",
        "completed": "Completed",
        "canceled": "Canceled"
      },
      "trajectory": {
        "submitted": "Order submitted",
        "payment_success": "Order paid successfully, payment method:",
        "wechat_pay": "WeChat Pay"
      }
    },
    "product": {
      "sale_price": "Sale Price",
      "strike_price": "List Price",
      "out_of_stock": "Out of stock",
      "in_stock": "In stock"
    },
    "coupon": {
      "amount_off": "{amount} Off",
      "percent_off": "{percent}% Off"
    },
    "delivery": {
      "standard": "Standard Delivery",
      "express": "Express Delivery",
      "same_day": "Same Day Delivery"
    }
  }
}
```

## Adding New Keys

### Step 1: Add to Both Locale Files

Add the same key structure to both:
- `src/i18n/locales/en.json`
- `src/i18n/locales/zh_CN.json`

### Step 2: Use Consistent Naming

```json
// ✅ CORRECT - lowercase_with_underscores
"order_status": "Order Status"
"pending_payment": "Pending Payment"

// ❌ WRONG - camelCase or spaces
"orderStatus": "Order Status"
"Pending Payment": "Pending Payment"
```

### Step 3: Organize by Domain

Group related keys under the same domain prefix:

```json
// ✅ CORRECT - Well organized
{
  "order": {
    "status": { "pending": "..." },
    "actions": { "cancel": "..." }
  }
}

// ❌ WRONG - Flat structure
{
  "order_status_pending": "...",
  "order_action_cancel": "..."
}
```

### Step 4: Run Build

```bash
yarn build
```

This regenerates `src/i18n/locales.wxs` from the JSON files.

## Key Template

When adding new keys, follow this template:

```json
{
  "domain": {
    "subdomain": {
      "simple_key": "Translation text",
      "key_with_param": "Translation with {param}",
      "key_with_multiple_params": "Translation with {param1} and {param2}"
    }
  }
}
```

Usage in code:
```typescript
// Simple
this.t('domain.subdomain.simple_key')

// With parameters
this.t('domain.subdomain.key_with_param', {param: 'value'})
```
