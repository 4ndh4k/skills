---
name: wxmp-i18n
description: Add and maintain i18n translations in WeChat Mini Programs using @miniprogram-i18n/core. Use when adding multilingual support to WXML templates or TypeScript/JS files.
version: 1.0.0
---

# WeChat Mini Program i18n Patterns

## Purpose

Provides guidelines for adding and maintaining internationalization (i18n) in WeChat Mini Programs using `@miniprogram-i18n/core`.

## Quick Reference

| File Type | Import | Translation Method |
|-----------|--------|------------------|
| WXML | `<wxs src="/i18n/locales.wxs" module="i18n" />` | `{{i18n.t('key', undefined, $_locale)}}` |
| Page/Component (methods) | `import { I18n } from '@miniprogram-i18n/core'` | `this.t('key')` |
| Module-level | `import { getI18nInstance } from '@miniprogram-i18n/core'` | `getI18nInstance().t('key')` |

## WXML Files

### Import i18n WXS Module

**CRITICAL: Always use absolute path `/i18n/locales.wxs`**

```xml
<!-- ✅ CORRECT - Absolute path -->
<wxs src="/i18n/locales.wxs" module="i18n" />

<!-- ❌ WRONG - Relative path -->
<wxs src="./i18n/locales.wxs" module="i18n" />
<wxs src="../../../../../i18n/locales.wxs" module="i18n" />
```

### Translation Pattern

**Without parameters:**
```xml
<view>{{i18n.t('common.loading', undefined, $_locale)}}</view>
```

**With parameters:**
```xml
<view>{{i18n.t('cart.total_items', {count: 5}, $_locale)}}</view>
```

**Multiple parameters:**
```xml
<view>{{i18n.t('order.discount_message', {discount: '10%', amount: 100}, $_locale)}}</view>
```

### CRITICAL Rules for WXML

1. **Use absolute path**: `/i18n/locales.wxs` (not relative paths)
2. **Use `undefined` for empty parameters** (NOT `{}`)
3. **Always pass `$_locale` as third parameter**
4. **Add `$_locale: ''` to component's `data` in TS/JS file**

## TS/JS Files

### Page/Component Setup

```typescript
import { I18n } from '@miniprogram-i18n/core';

Page({  // or Component({
  behaviors: [I18n], // Add I18n behavior
  data: {
    $_locale: '', // Required for WXML translations
  },

  methods: {
    onLoad() {
      // ...
    },
  },
});
```

### Translation in Methods

Use `this.t()` for translations within page/component methods:

```typescript
// Simple translation
loadData() {
  wx.showToast({
    // @ts-expect-error I18n behavior stub
    title: this.t('common.loading'),
    icon: 'loading',
  });
}

// With parameters
showItemCount(count: number) {
  // @ts-expect-error I18n behavior stub
  const message = this.t('cart.total_items', {count});
  wx.showToast({
    title: message,
  });
}
```

### Module-Level Translations

For code outside of methods (service functions, transforms, utilities):

```typescript
import { getI18nInstance } from '@miniprogram-i18n/core';

// Use getI18nInstance().t() for module-level code
export function getOrderStatusName(status: number): string {
  const i18n = getI18nInstance();
  return i18n.t('order.status.completed');
}

// In transform functions
export function transformOrder(order: FgOrder): LocalOrder {
  const i18n = getI18nInstance();
  return {
    ...order,
    statusText: i18n.t('order.status.pending_payment'),
  };
}
```

## Translation Key Structure

### Hierarchy

Translation keys use dot notation organized by domain:

```
{
  "common": { "loading": "Loading" },
  "cart": {
    "stock": { "insufficient": "Stock insufficient" }
  },
  "order": {
    "status": {
      "pending_payment": "Pending Payment",
      "completed": "Completed"
    }
  },
  "transform": {
    "order": { "trajectory": { ... } }
  }
}
```

### Key Naming Convention

- Use **lowercase with underscores**: `pending_payment`, `stock_insufficient`
- Use **dot notation** for nested keys: `order.status.pending_payment`
- Group by **functional domain**: `common`, `cart`, `order`, `product`, `coupon`
- Separate **transform-specific keys** under `transform.*`

## Adding New Translation Keys

When adding new translations:

1. **Add to both locale files**:
   - `src/i18n/locales/en.json`
   - `src/i18n/locales/zh_CN.json`

2. **Follow the same structure** in both files:

```json
// en.json
{
  "coupon": {
    "select": {
      "title": "Select Coupon",
      "load_failed": "Failed to load coupons"
    }
  }
}

// zh_CN.json
{
  "coupon": {
    "select": {
      "title": "选择优惠券",
      "load_failed": "加载优惠券失败"
    }
  }
}
```

3. **Run build to regenerate WXS**:
```bash
yarn build
```

4. **Use dot-separated keys in code**:
```typescript
this.t('coupon.select.load_failed')
```

## Common Translation Keys by Domain

### Common
```json
{
  "loading": "Loading",
  "error": "Error",
  "success": "Success",
  "confirm": "Confirm",
  "cancel": "Cancel",
  "retry": "Retry"
}
```

### Cart
```json
{
  "stock": {
    "insufficient": "Stock insufficient"
  },
  "empty": {
    "title": "Cart is empty"
  }
}
```

### Order
```json
{
  "status": {
    "pending_payment": "Pending Payment",
    "pending_delivery": "Pending Delivery",
    "pending_receipt": "Pending Receipt",
    "completed": "Completed",
    "canceled": "Canceled"
  }
}
```

### Coupon
```json
{
  "select": {
    "title": "Select Coupon",
    "available_count": "You have {count} available coupons",
    "no_coupons": "No coupons available",
    "load_failed": "Failed to load coupons"
  }
}
```

## Example Files

### WXML Example
```xml
<wxs src="/i18n/locales.wxs" module="i18n" />

<view class="order-status">
  <text>{{i18n.t('order.status.pending_payment', undefined, $_locale)}}</text>
</view>

<view class="coupon-count">
  <text>{{i18n.t('coupon.select.available_count', {count: couponsList.length}, $_locale)}}</text>
</view>
```

### TS Page Example
```typescript
import { I18n } from '@miniprogram-i18n/core';

Page({
  behaviors: [I18n],
  data: {
    $_locale: '',
    orderStatus: 5,
  },

  onLoad() {
    const statusText = this.t('order.status.pending_payment');
    this.setData({ statusText });
  },

  showSuccessToast() {
    wx.showToast({
      title: this.t('common.success'),
      icon: 'success',
    });
  },
});
```

### Transform Function Example
```typescript
import { getI18nInstance } from '@miniprogram-i18n/core';

export function transformOrderStatus(status: number): string {
  const i18n = getI18nInstance();
  const statusMap = {
    5: i18n.t('transform.order.status.pending_payment'),
    10: i18n.t('transform.order.status.pending_delivery'),
    50: i18n.t('transform.order.status.completed'),
  };
  return statusMap[status] || i18n.t('transform.order.status.pending_payment');
}
```

## Checklist for Adding Translations

- [ ] Add translation key to both `en.json` and `zh_CN.json`
- [ ] Use dot notation for nested keys
- [ ] Use `undefined` for empty parameters in WXML
- [ ] Add `$_locale: ''` to component data
- [ ] Use `I18n` behavior for pages/components
- [ ] Use `this.t()` in methods, `getI18nInstance().t()` in modules
- [ ] Use absolute path `/i18n/locales.wxs` in WXML
- [ ] Run `yarn build` to regenerate `locales.wxs`
- [ ] Test with both English and Chinese locales

## Troubleshooting

### Translations not showing
- Check that `locales.wxs` is regenerated: `yarn build`
- Verify WXML uses absolute path: `/i18n/locales.wxs`
- Ensure `$_locale` is in component data and initialized

### Translation keys not found
- Verify key exists in both `en.json` and `zh_CN.json`
- Check key uses correct dot notation (no typos)
- Ensure WXS file has been regenerated after adding keys

### Wrong language showing
- Check locale initialization in `app.ts`: `initI18n('zh-CN')` or `initI18n('en-US')`
- Verify locale storage: `wx.getStorageSync('locale')`

## Reference Implementation Files

For complete examples, see:

- `apps/wxmp/src/pages/order/components/selectCoupons/selectCoupons.ts`
- `apps/wxmp/src/pages/order/components/selectCoupons/selectCoupons.wxml`
- `apps/wxmp/src/transforms/orderTransform.ts`
- `apps/wxmp/src/transforms/couponTransform.ts`
- `apps/wxmp/src/i18n/locales/en.json`
- `apps/wxmp/src/i18n/locales/zh_CN.json`
- `apps/wxmp/rollup-plugin-i18n-locales.mjs`

## For Detailed Reference

```
Read `~/.claude/skills/wxmp-i18n/references/TRANSLATION-KEYS.md`
```

Use when: Need complete translation key listing or adding new keys

```
Read `~/.claude/skills/wxmp-i18n/references/ADVANCED-PATTERNS.md`
```

Use when: Need advanced patterns like parameterized translations, plurals, or complex scenarios
