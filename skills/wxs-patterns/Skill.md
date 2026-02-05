---
name: wxs-patterns
description: Write and debug WXS (WeiXin Script) code for WeChat Mini Programs. Use when working with WXS files, WXML templates, or WeChat Mini Program view-layer logic.
version: 1.0.0
---

# WXS Patterns for WeChat Mini Programs

## Purpose

WXS (WeiXin Script) is a distinct scripting language that runs in the WeChat Mini Program view layer (WebView), separate from the JavaScript logic layer. This skill provides patterns and limitations for writing valid WXS code.

## Key Characteristics

- **NOT JavaScript**: Despite syntactic similarities, WXS is a separate language
- **ES5 only**: No ES6+ features (no let/const, arrow functions, template literals, destructuring, spread)
- **Sandboxed**: Cannot call Mini Program APIs (wx.*) or import .js files
- **View-layer execution**: Ideal for data formatting and high-performance UI interactions
- **Singleton modules**: Each WXS module initializes once and shares across references

## Critical Syntax Rules

### Variable Declarations

```javascript
// ✅ CORRECT: Use var only
var foo = 1;
var bar = "hello";

// ❌ WRONG: let and const are NOT supported
let x = 1;      // ERROR
const y = 2;    // ERROR
```

### Functions

```javascript
// ✅ CORRECT: Function expressions and declarations
var add = function(a, b) {
  return a + b;
};

function multiply(a, b) {
  return a * b;
}

// ❌ WRONG: Arrow functions NOT supported
var bad = (x) => x * 2;           // ERROR
var bad2 = x => x * 2;            // ERROR
```

### Date and RegExp

```javascript
// ⚠️ CRITICAL: Cannot use new Date() or /regex/ - must use built-in constructors

var now = getDate();                           // ✅ CORRECT
var specific = getDate(1500000000000);         // ✅ From timestamp
var regex = getRegExp('pattern');              // ✅ CORRECT
var regexFlags = getRegExp('pattern', 'gi');   // ✅ With flags

new Date();          // ❌ ERROR - use getDate()
/pattern/gi;         // ❌ ERROR - use getRegExp()
new RegExp();        // ❌ ERROR - use getRegExp()
```

### iOS Date Gotcha

```javascript
// ⚠️ iOS GOTCHA: Hyphenated dates fail on iOS!

// ❌ WRONG for iOS:
var bad = getDate('2023-01-15 12:00:00');      // NaN on iOS

// ✅ CORRECT: Replace hyphens with slashes
var regexp = getRegExp('-', 'g');
var good = getDate(dateStr.replace(regexp, '/'));   // Works on iOS
```

### Object Iteration

```javascript
// ⚠️ CRITICAL: for...in does NOT work on objects in WXS
// ❌ This will ERROR:
for (var key in obj) {   // ERROR!
  console.log(key);
}

// ✅ WORKAROUND: Use array with known keys or JSON.stringify + regex
```

## WXML Integration

### Module Declaration

```xml
<!-- ✅ CORRECT: External WXS file -->
<wxs src="../../utils/format.wxs" module="format" />

<!-- ✅ CORRECT: Inline WXS -->
<wxs module="utils">
var formatPrice = function(price) {
  return '¥' + price.toFixed(2);
};
module.exports = {
  formatPrice: formatPrice
};
</wxs>

<!-- Use in template -->
<view>{{format.formatPrice(item.price)}}</view>
```

### CRITICAL Scope Rules

```xml
<!-- ⚠️ CRITICAL: WXS modules are NOT inherited -->

<!-- Each WXML file must declare its own <wxs> references -->
<!-- <include> and <import> do NOT bring WXS modules -->
<!-- <template> can only use WXS modules defined in the same file -->
```

## What WXS CANNOT Do

### Syntax Restrictions (ES6+)

```javascript
// ❌ ALL OF THESE WILL ERROR:

let x = 1;                    // Variable declarations
const y = 2;
var fn = () => {};            // Arrow functions
var str = `Hello ${name}`;    // Template literals
var {a, b} = obj;             // Destructuring
var arr2 = [...arr1];         // Spread operator
var obj = { x };              // Object shorthand (must be { x: x })
function fn(x = 1) {}         // Default parameters
for (var item of array) {}    // for...of
```

### Runtime Restrictions

```javascript
// ❌ CANNOT call Mini Program APIs
wx.request();        // ERROR
wx.showToast();      // ERROR

// ❌ CANNOT import JavaScript files
var util = require('./util.js');  // ERROR - only .wxs files

// ❌ CANNOT use setTimeout/setInterval directly
setTimeout();        // ERROR - only via ComponentDescriptor in event handlers

// ❌ CANNOT use DOM APIs
document.getElementById();  // ERROR
```

## Module Structure

Every `.wxs` file is a separate module. Export via `module.exports`:

```javascript
// format.wxs
var privateVar = "not exported";
var publicVar = "exported";

function publicFunc(x) {
  return x * 2;
}

// Export via module.exports (the ONLY way to expose)
module.exports = {
  publicVar: publicVar,
  publicFunc: publicFunc
};

// Can also add exports incrementally
module.exports.anotherFunc = function(y) {
  return y + 1;
};
```

## Importing in WXS Files

```javascript
// math.wxs
var tools = require('./tools.wxs');  // ✅ Must use relative path
                                      // ✅ Must include .wxs extension

module.exports = {
  calculate: function(x) {
    return tools.multiply(x, 2);
  }
};
```

## Available Built-ins

### Console

```javascript
console.log(value1, value2, ...)  // Only console.log supported
// Consecutive duplicate logs filtered out
// Objects print as "[object Object]" - use JSON.stringify()
```

### JSON, Math, Number

```javascript
JSON.stringify(obj)
JSON.parse(jsonStr)
Math.abs(x), Math.ceil(x), Math.floor(x), Math.max(), Math.min(), etc.
Number.MAX_VALUE, Number.MIN_VALUE
```

## Common Patterns

### Date Formatting

```javascript
var formatDate = function(dateStr, format) {
  if (!dateStr) return '';

  // iOS fix: replace hyphens with slashes
  dateStr = dateStr.replace(getRegExp('-', 'g'), '/');
  dateStr = dateStr.replace('T', ' ');

  var date = getDate(dateStr);

  var map = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  };

  // Format string replacement logic...
  return format;
};
```

### Relative Time ("5 minutes ago")

```javascript
var relativeTime = function(timestamp) {
  var now = getDate().getTime();
  var diff = Math.floor((now - timestamp) / 1000);

  if (diff < 60) return 'just now';
  if (diff < 3600) return Math.floor(diff / 60) + ' minutes ago';
  if (diff < 86400) return Math.floor(diff / 3600) + ' hours ago';
  if (diff < 604800) return Math.floor(diff / 86400) + ' days ago';
  return Math.floor(diff / 2592000) + ' months ago';
};
```

### Number Formatting

```javascript
var formatCurrency = function(num, symbol) {
  symbol = symbol || '¥';
  var parts = num.toFixed(2).split('.');
  // Add thousand separators...
  return symbol + result;
};
```

## WXS Event Handling (Animations)

WXS can handle touch events directly for high-performance interactions:

```xml
<!-- WXML -->
<wxs module="handler" src="./handler.wxs"></wxs>
<view bindtouchmove="{{handler.onTouchMove}}" class="draggable">
  Drag me
</view>
```

```javascript
// handler.wxs
function onTouchMove(event, ownerInstance) {
  var instance = event.instance;

  // Style manipulation (supports rpx)
  instance.setStyle({
    'transform': 'translateX(100rpx)',
    'opacity': '0.5'
  });

  // Class manipulation
  instance.addClass('active');
  instance.removeClass('inactive');

  // Call JS layer method
  ownerInstance.callMethod('handleInJS', {
    x: event.touches[0].clientX
  });

  return false;  // Stop propagation
}

module.exports = {
  onTouchMove: onTouchMove
};
```

## Quick Reference Checklist

| Feature | Status |
|---------|--------|
| `var` declarations | ✅ |
| `let` / `const` | ❌ |
| Function expressions | ✅ |
| Arrow functions | ❌ |
| Object literals `{ key: val }` | ✅ |
| Object shorthand `{ key }` | ❌ |
| Template literals | ❌ |
| Destructuring | ❌ |
| Spread operator | ❌ |
| `for` loop | ✅ |
| `for...in` | ⚠️ Arrays only |
| `for...of` | ❌ |
| `getDate()` | ✅ |
| `new Date()` | ❌ |
| `getRegExp()` | ✅ |
| `/regex/` literal | ❌ |
| `JSON.parse/stringify` | ✅ |
| `Math.*` | ✅ |
| `console.log` | ✅ |
| `require('./file.wxs')` | ✅ |
| `require('./file.js')` | ❌ |
| `wx.*` APIs | ❌ |

## For Detailed Reference

```
Read `~/.claude/skills/wxs-patterns/references/DETAILED-SYNTAX.md`
```

Use when: Need complete syntax reference, all available methods, or detailed examples

```
Read `~/.claude/skills/wxs-patterns/references/COMMON-PATTERNS.md`
```

Use when: Need specific implementation patterns for dates, numbers, strings, arrays, or event handling
