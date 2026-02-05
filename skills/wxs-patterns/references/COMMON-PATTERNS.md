# WXS Common Patterns

This file contains common implementation patterns for WXS in WeChat Mini Programs.

## Date Formatting (iOS-Safe)

```javascript
// format.wxs
var formatDate = function(dateStr, format) {
  if (!dateStr) return '';

  format = format || 'yyyy-MM-dd hh:mm:ss';

  // iOS fix: replace hyphens with slashes
  dateStr = dateStr.replace(getRegExp('-', 'g'), '/');
  // Also handle 'T' separator
  dateStr = dateStr.replace('T', ' ');

  var date = getDate(dateStr);

  var map = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds(),
    'q+': Math.floor((date.getMonth() + 3) / 3),
    'S+': date.getMilliseconds()
  };

  // Year
  var yearReg = getRegExp('(y+)', 'i');
  var yearMatch = yearReg.exec(format);
  if (yearMatch) {
    var yearStr = date.getFullYear() + '';
    format = format.replace(yearMatch[1], yearStr.substring(4 - yearMatch[1].length));
  }

  // Other fields - manual iteration since for...in doesn't work
  var fields = ['M+', 'd+', 'h+', 'm+', 's+', 'q+', 'S+'];
  for (var i = 0; i < fields.length; i++) {
    var field = fields[i];
    var reg = getRegExp('(' + field + ')');
    var match = reg.exec(format);
    if (match) {
      var value = map[field] + '';
      if (match[1].length === 1) {
        format = format.replace(match[1], value);
      } else {
        var padded = ('00' + value).substring(value.length);
        format = format.replace(match[1], padded);
      }
    }
  }

  return format;
};

module.exports = {
  formatDate: formatDate
};
```

## Relative Time ("5 minutes ago")

```javascript
var relativeTime = function(timestamp) {
  var now = getDate().getTime();
  var diff = Math.floor((now - timestamp) / 1000);

  if (diff < 60) return 'just now';
  if (diff < 3600) return Math.floor(diff / 60) + ' minutes ago';
  if (diff < 86400) return Math.floor(diff / 3600) + ' hours ago';
  if (diff < 604800) return Math.floor(diff / 86400) + ' days ago';
  if (diff < 2592000) return Math.floor(diff / 604800) + ' weeks ago';
  if (diff < 31536000) return Math.floor(diff / 2592000) + ' months ago';
  return Math.floor(diff / 31536000) + ' years ago';
};
```

## Number Formatting

```javascript
var formatNumber = function(num, decimals) {
  decimals = decimals === undefined ? 2 : decimals;

  if (typeof num !== 'number') {
    num = parseFloat(num) || 0;
  }

  var parts = num.toFixed(decimals).split('.');
  var intPart = parts[0];
  var decPart = parts[1] || '';

  // Add thousand separators
  var result = '';
  for (var i = intPart.length - 1, j = 0; i >= 0; i--, j++) {
    if (j > 0 && j % 3 === 0) {
      result = ',' + result;
    }
    result = intPart.charAt(i) + result;
  }

  return decPart ? result + '.' + decPart : result;
};

var formatCurrency = function(num, symbol) {
  symbol = symbol || '¥';
  return symbol + formatNumber(num, 2);
};
```

## Array Utilities

```javascript
// Find max value
var getMax = function(arr) {
  var max;
  for (var i = 0; i < arr.length; i++) {
    if (max === undefined || arr[i] > max) {
      max = arr[i];
    }
  }
  return max;
};

// Find min value
var getMin = function(arr) {
  var min;
  for (var i = 0; i < arr.length; i++) {
    if (min === undefined || arr[i] < min) {
      min = arr[i];
    }
  }
  return min;
};

// Sum
var sum = function(arr) {
  var total = 0;
  for (var i = 0; i < arr.length; i++) {
    total = total + (parseFloat(arr[i]) || 0);
  }
  return total;
};

// Average
var average = function(arr) {
  return sum(arr) / arr.length;
};
```

## String Utilities

```javascript
// Truncate with ellipsis
var truncate = function(str, maxLen) {
  maxLen = maxLen || 20;
  if (!str || str.length <= maxLen) return str || '';
  return str.substring(0, maxLen) + '...';
};

// Capitalize first letter
var capitalize = function(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

// Simple HTML escape
var escapeHtml = function(str) {
  if (!str) return '';
  return str
    .replace(getRegExp('&', 'g'), '&amp;')
    .replace(getRegExp('<', 'g'), '&lt;')
    .replace(getRegExp('>', 'g'), '&gt;')
    .replace(getRegExp('"', 'g'), '&quot;');
};

// Pad left with zeros
var padLeft = function(str, len, pad) {
  str = str + '';
  pad = pad || '0';
  while (str.length < len) {
    str = pad + str;
  }
  return str;
};
```

## Validation Utilities

```javascript
// Email validation
var isEmail = function(str) {
  var regex = getRegExp('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$');
  return regex.test(str);
};

// Phone validation (China)
var isPhone = function(str) {
  var regex = getRegExp('^1[3-9]\\d{9}$');
  return regex.test(str);
};

// ID card validation (China)
var isIdCard = function(str) {
  var regex = getRegExp('^[1-9]\\d{5}(18|19|20)\\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\\d|3[01])\\d{3}[\\dXx]$');
  return regex.test(str);
};

// URL validation
var isUrl = function(str) {
  var regex = getRegExp('^https?://[^\\s/$.?#].[^\\s]*$');
  return regex.test(str);
};
```

## Object Utilities

```javascript
// Object keys (workaround for for...in limitation)
var keys = function(obj) {
  var str = JSON.stringify(obj);
  var reg = getRegExp('"([\\w\\-_]+)":', 'g');
  var matches = str.match(reg);
  var result = [];
  if (matches) {
    for (var i = 0; i < matches.length; i++) {
      result.push(matches[i].substring(1, matches[i].length - 2));
    }
  }
  return result;
};

// Check if object is empty
var isEmpty = function(obj) {
  return keys(obj).length === 0;
};

// Get object value by path
var getByPath = function(obj, path) {
  var parts = path.split('.');
  var current = obj;
  for (var i = 0; i < parts.length; i++) {
    if (current === null || current === undefined) {
      return undefined;
    }
    current = current[parts[i]];
  }
  return current;
};
```

## Price Display

```javascript
// Format price with currency symbol and decimals
var formatPrice = function(price, symbol) {
  symbol = symbol || '¥';
  if (!price && price !== 0) return symbol + '0.00';
  return symbol + parseFloat(price).toFixed(2);
};

// Format price range
var formatPriceRange = function(min, max, symbol) {
  symbol = symbol || '¥';
  if (min === max) return formatPrice(min, symbol);
  return symbol + parseFloat(min).toFixed(2) + ' - ' + symbol + parseFloat(max).toFixed(2);
};

// Format integer price (remove trailing zeros)
var formatPriceInt = function(price, symbol) {
  symbol = symbol || '¥';
  if (!price && price !== 0) return symbol + '0';
  var formatted = parseFloat(price).toFixed(2);
  var parts = formatted.split('.');
  if (parts[1] === '00') {
    return symbol + parts[0];
  }
  return symbol + formatted;
};
```

## WXS Event Handlers

### Touch Event Handling

```javascript
// handler.wxs
function onTouchStart(event, ownerInstance) {
  var instance = event.instance;
  instance.addClass('active');
}

function onTouchEnd(event, ownerInstance) {
  var instance = event.instance;
  instance.removeClass('active');
}

function onTouchMove(event, ownerInstance) {
  var touches = event.touches;
  if (touches && touches.length > 0) {
    var x = touches[0].clientX;
    var y = touches[0].clientY;

    // Update position
    ownerInstance.callMethod('onDragMove', {
      x: x,
      y: y
    });
  }
}

module.exports = {
  onTouchStart: onTouchStart,
  onTouchEnd: onTouchEnd,
  onTouchMove: onTouchMove
};
```

### Animation with ComponentDescriptor

```javascript
// anim.wxs
function animateMove(event, ownerInstance) {
  var instance = event.instance;
  var touches = event.touches;
  var state = instance.getState();

  if (!state.startX) {
    state.startX = touches[0].clientX;
  }

  var deltaX = touches[0].clientX - state.startX;

  instance.setStyle({
    'transform': 'translateX(' + deltaX + 'px)',
    'transition': 'none'
  });
}

function resetAnimation(event, ownerInstance) {
  var instance = event.instance;

  instance.setState({
    startX: null
  });

  instance.setStyle({
    'transform': 'translateX(0)',
    'transition': 'transform 0.3s ease-out'
  });
}

module.exports = {
  animateMove: animateMove,
  resetAnimation: resetAnimation
};
```

### Property Observer Pattern

```javascript
// observer.wxs
function onPropChange(newValue, oldValue, ownerInstance, instance) {
  // Called whenever prop changes via setData
  console.log('Prop changed:', oldValue, '->', newValue);

  // React to property change
  if (newValue > oldValue) {
    instance.addClass('increased');
  } else if (newValue < oldValue) {
    instance.addClass('decreased');
  }
}

module.exports = {
  onPropChange: onPropChange
};
```

## Debugging Utilities

```javascript
// Safe logging with JSON.stringify
var log = function(tag, value) {
  if (typeof value === 'object') {
    console.log(tag + ': ' + JSON.stringify(value));
  } else {
    console.log(tag + ': ' + value);
  }
};

// Debug object properties
var debugObj = function(obj) {
  console.log('=== Object Debug ===');
  console.log('Type: ' + typeof obj);
  console.log('String: ' + JSON.stringify(obj));
  console.log('Keys: ' + JSON.stringify(keys(obj)));
};
```
