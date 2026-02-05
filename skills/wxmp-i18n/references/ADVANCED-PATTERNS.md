# WeChat Mini Program i18n Advanced Patterns

This file contains advanced patterns for working with i18n in WeChat Mini Programs.

## Parameterized Translations

### Single Parameter

```json
// locales/en.json
{
  "cart": {
    "item_count": "You have {count} items in your cart"
  }
}
```

```xml
<!-- WXML -->
<view>{{i18n.t('cart.item_count', {count: 5}, $_locale)}}</view>
<!-- Output: You have 5 items in your cart -->
```

### Multiple Parameters

```json
// locales/en.json
{
  "order": {
    "discount_message": "You saved {discount} on this order ({amount} off)"
  }
}
```

```xml
<!-- WXML -->
<view>{{i18n.t('order.discount_message', {discount: '10%', amount: '¥50'}, $_locale)}}</view>
<!-- Output: You saved 10% on this order (¥50 off) -->
```

### TypeScript with Parameters

```typescript
// In component method
showDiscountMessage(discount: string, amount: number) {
  // @ts-expect-error I18n behavior stub
  const message = this.t('order.discount_message', {discount, amount});
  wx.showToast({
    title: message,
  });
}
```

### Transform Functions with Parameters

```typescript
import { getI18nInstance } from '@miniprogram-i18n/core';

export function transformCoupon(coupon: FgCoupon): LocalCoupon {
  const i18n = getI18nInstance();
  return {
    ...coupon,
    description: i18n.t('coupon.amount_off', {amount: coupon.amount}),
  };
}
```

## Conditional Translations

### Gender-based Translations

```json
// locales/en.json
{
  "profile": {
    "greeting_male": "Welcome back, Mr {name}",
    "greeting_female": "Welcome back, Ms {name}",
    "greeting_unknown": "Welcome back, {name}"
  }
}
```

```typescript
// In component
getGreeting(user: User) {
  // @ts-expect-error I18n behavior stub
  if (user.gender === 'male') {
    return this.t('profile.greeting_male', {name: user.name});
  } else if (user.gender === 'female') {
    return this.t('profile.greeting_female', {name: user.name});
  }
  // @ts-expect-error I18n behavior stub
  return this.t('profile.greeting_unknown', {name: user.name});
}
```

### Count-based Translations

```json
// locales/en.json
{
  "cart": {
    "empty": "Your cart is empty",
    "single_item": "You have 1 item in your cart",
    "multiple_items": "You have {count} items in your cart"
  }
}
```

```typescript
// In component
getCartMessage(itemCount: number) {
  if (itemCount === 0) {
    // @ts-expect-error I18n behavior stub
    return this.t('cart.empty');
  } else if (itemCount === 1) {
    // @ts-expect-error I18n behavior stub
    return this.t('cart.single_item');
  }
  // @ts-expect-error I18n behavior stub
  return this.t('cart.multiple_items', {count: itemCount});
}
```

## Dynamic Key Construction

### Dynamic Status Keys

```typescript
import { getI18nInstance } from '@miniprogram-i18n/core';

// Transform function with dynamic key lookup
export function transformOrderStatus(status: number): string {
  const i18n = getI18nInstance();

  const statusKeyMap = {
    5: 'transform.order.status.pending_payment',
    10: 'transform.order.status.pending_delivery',
    50: 'transform.order.status.completed',
    55: 'transform.order.status.canceled',
  };

  const key = statusKeyMap[status] || 'transform.order.status.pending_payment';
  return i18n.t(key);
}
```

### Dynamic Domain Keys

```typescript
// Generic translation helper for different domains
function getDomainTranslation(domain: string, key: string, params?: Record<string, any>): string {
  const i18n = getI18nInstance();
  const fullKey = `${domain}.${key}`;
  return params ? i18n.t(fullKey, params) : i18n.t(fullKey);
}

// Usage
getDomainTranslation('cart', 'stock.insufficient');
getDomainTranslation('order', 'status.pending_payment');
```

## Component Communication with i18n

### Passing Translated Strings to Child Components

```typescript
// Parent component
Page({
  behaviors: [I18n],
  data: {
    $_locale: '',
    buttonText: '',
  },

  onLoad() {
    // @ts-expect-error I18n behavior stub
    this.setData({
      buttonText: this.t('common.confirm')
    });
  },
});
```

```xml
<!-- Parent WXML -->
<child-component text="{{buttonText}}"></child-component>
```

### Event Handler with i18n Feedback

```typescript
Component({
  behaviors: [I18n],
  data: {
    $_locale: '',
  },

  methods: {
    onSubmit() {
      // @ts-expect-error I18n behavior stub
      const successMsg = this.t('form.submit_success');

      api.submitForm(this.data.formData)
        .then(() => {
          wx.showToast({
            title: successMsg,
            icon: 'success',
          });
        })
        .catch(() => {
          // @ts-expect-error I18n behavior stub
          wx.showToast({
            title: this.t('form.submit_failed'),
            icon: 'error',
          });
        });
    },
  },
});
```

## Service Layer with i18n

### GraphQL Error Handling with i18n

```typescript
import { getI18nInstance } from '@miniprogram-i18n/core';
import { ApiService } from '@/utils/ApiService.js';

export class OrderService {
  private i18n = getI18nInstance();

  async cancelOrder(orderId: string): Promise<void> {
    try {
      await ApiService.mutate(CANCEL_ORDER_MUTATION, { orderId });
      wx.showToast({
        title: this.i18n.t('order.cancel_success'),
        icon: 'success',
      });
    } catch (error) {
      wx.showToast({
        title: this.i18n.t('order.cancel_failed'),
        icon: 'error',
      });
      throw error;
    }
  }
}
```

### Validation Messages with i18n

```typescript
import { getI18nInstance } from '@miniprogram-i18n/core';

export class AddressValidator {
  private i18n = getI18nInstance();

  validate(address: Address): ValidationResult {
    const errors: string[] = [];

    if (!address.name) {
      errors.push(this.i18n.t('address.validation.name_required'));
    }

    if (!address.phone) {
      errors.push(this.i18n.t('address.validation.phone_required'));
    } else if (!/^1[3-9]\d{9}$/.test(address.phone)) {
      errors.push(this.i18n.t('address.validation.phone_invalid'));
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}
```

## TanStack Query Integration with i18n

### Query Error Messages

```typescript
import { getI18nInstance } from '@miniprogram-i18n/core';
import { useQuery } from '@tanstack/query-core';

export function useOrderList() {
  const i18n = getI18nInstance();

  return useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      const response = await ApiService.query(ORDERS_QUERY);
      return response.orders;
    },
    onError: () => {
      wx.showToast({
        title: i18n.t('order.load_failed'),
        icon: 'error',
      });
    },
  });
}
```

### Mutation Success/Error Messages

```typescript
import { getI18nInstance } from '@miniprogram-i18n/core';
import { useMutation } from '@tanstack/query-core';

export function useUpdateAddress() {
  const i18n = getI18nInstance();

  return useMutation({
    mutationFn: (address: Address) => {
      return ApiService.mutate(UPDATE_ADDRESS_MUTATION, { address });
    },
    onSuccess: () => {
      wx.showToast({
        title: i18n.t('address.update_success'),
        icon: 'success',
      });
    },
    onError: () => {
      wx.showToast({
        title: i18n.t('address.update_failed'),
        icon: 'error',
      });
    },
  });
}
```

## Complex UI Scenarios

### Empty State with i18n

```xml
<!-- Cart empty state -->
<view class="cart-empty">
  <image src="/assets/empty-cart.png" />
  <text>{{i18n.t('cart.empty.title', undefined, $_locale)}}</text>
  <text>{{i18n.t('cart.empty.subtitle', undefined, $_locale)}}</text>
  <button bindtap="navigateToShop">
    {{i18n.t('cart.empty.btn_shop', undefined, $_locale)}}
  </button>
</view>
```

### Status Badge with i18n

```xml
<!-- Order status badge -->
<view class="status-badge status-{{order.statusCode}}">
  <text>{{i18n.t('order.status.' + order.statusKey, undefined, $_locale)}}</text>
</view>
```

### Form Validation with i18n

```typescript
Component({
  behaviors: [I18n],
  data: {
    $_locale: '',
    form: {
      name: '',
      phone: '',
      address: '',
    },
    errors: {} as Record<string, string>,
  },

  methods: {
    validateField(field: keyof FormData) {
      const value = this.data.form[field];
      let errorKey = '';

      switch (field) {
        case 'name':
          if (!value) errorKey = 'address.validation.name_required';
          break;
        case 'phone':
          if (!value) {
            errorKey = 'address.validation.phone_required';
          } else if (!/^1[3-9]\d{9}$/.test(value)) {
            errorKey = 'address.validation.phone_invalid';
          }
          break;
        case 'address':
          if (!value) errorKey = 'address.validation.detail_required';
          break;
      }

      // @ts-expect-error I18n behavior stub
      const errorMessage = errorKey ? this.t(errorKey) : '';

      this.setData({
        [`errors.${field}`]: errorMessage,
      });

      return !errorMessage;
    },

    validateForm() {
      const fields = ['name', 'phone', 'address'] as const;
      let isValid = true;

      for (const field of fields) {
        if (!this.validateField(field)) {
          isValid = false;
        }
      }

      if (!isValid) {
        // @ts-expect-error I18n behavior stub
        wx.showToast({
          title: this.t('common.validation_failed'),
          icon: 'error',
        });
      }

      return isValid;
    },
  },
});
```

## Testing i18n

### Mock i18n for Testing

```typescript
// Test helper
export function mockI18n(translations: Record<string, string>) {
  jest.mock('@miniprogram-i18n/core', () => ({
    getI18nInstance: () => ({
      t: (key: string, params?: Record<string, any>) => {
        let result = translations[key] || key;
        if (params) {
          Object.keys(params).forEach(param => {
            result = result.replace(`{${param}}`, params[param]);
          });
        }
        return result;
      },
    }),
    I18n: Behavior({
      behaviors: [],
      created() {},
      attached() {},
    }),
  }));
}
```

## Best Practices Summary

1. **Use absolute path** in WXML: `/i18n/locales.wxs`
2. **Pass `undefined`** for empty parameters, not `{}`
3. **Add `$_locale: ''`** to component data
4. **Use `this.t()`** in component methods
5. **Use `getI18nInstance().t()`** in modules/services
6. **Organize keys** by domain with dot notation
7. **Run `yarn build`** after modifying locale files
8. **Test both languages** when adding new translations
