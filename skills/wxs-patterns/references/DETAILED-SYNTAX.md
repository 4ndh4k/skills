# WXS Detailed Syntax Reference

This file contains complete syntax reference for WXS (WeiXin Script) language.

## Variables

### Declaration

```javascript
// ✅ CORRECT: Use var only
var foo = 1;
var bar = "hello";
var baz;  // undefined by default

// ❌ WRONG: let and const are NOT supported
let x = 1;      // ERROR
const y = 2;    // ERROR
```

### Variable Hoisting

Variables declared with `var` are hoisted (same as ES5 JavaScript).

```javascript
console.log(x);  // undefined (not error, due to hoisting)
var x = 5;
```

### Global Variables

```javascript
// ⚠️ WARNING: Undeclared variables become global
function test() {
  leaked = "I'm global now";  // Creates global variable - avoid this!
}
```

### Variable Naming Rules

- First character: letter (a-zA-Z) or underscore (_)
- Subsequent characters: letters, underscores, or digits (0-9)

### Reserved Identifiers

```
delete    void      typeof    null      undefined
NaN       Infinity  var       if        else
true      false     require   this      function
arguments return    for       while     do
break     continue  switch    case      default
```

## Data Types

### Supported Types

| Type | Description | Constructor String |
|------|-------------|-------------------|
| `number` | Integer or decimal | `"Number"` |
| `string` | Text | `"String"` |
| `boolean` | true/false | `"Boolean"` |
| `object` | Key-value pairs | `"Object"` |
| `function` | Callable | `"Function"` |
| `array` | Ordered list | `"Array"` |
| `date` | Date/time (via `getDate()`) | `"Date"` |
| `regexp` | Regular expression (via `getRegExp()`) | `"RegExp"` |

### Number

```javascript
var int = 10;
var float = 3.14159;

// Available methods (ES5 standard)
num.toString()
num.toLocaleString()
num.valueOf()
num.toFixed(2)      // "3.14"
num.toExponential()
num.toPrecision(4)
```

### String

```javascript
var str1 = 'single quotes';
var str2 = "double quotes";

// Properties
str.length

// Available methods (ES5 standard)
str.toString()
str.valueOf()
str.charAt(0)
str.charCodeAt(0)
str.concat('other')
str.indexOf('x')
str.lastIndexOf('x')
str.localeCompare('other')
str.match(regexp)
str.replace(regexp, 'replacement')
str.search(regexp)
str.slice(0, 5)
str.split(',')
str.substring(0, 5)
str.toLowerCase()
str.toUpperCase()
str.trim()
```

### Boolean

```javascript
var t = true;
var f = false;

// Available methods
bool.toString()
bool.valueOf()
```

### Object

```javascript
// ✅ CORRECT: Object literal
var obj = {
  'string-key': 1,       // String keys allowed
  normalKey: 2,          // Identifier keys allowed
  nested: { a: 1 }       // Nested objects allowed
};

// Property access
obj['string-key']   // Bracket notation
obj.normalKey       // Dot notation

// Property modification
obj.normalKey = 3;
obj['new-key'] = 4;

// ❌ WRONG: Object shorthand NOT supported
var x = 1;
var bad = { x };        // ERROR - must be { x: x }

// ❌ WRONG: Object method shorthand
var bad = { fn() {} };  // ERROR - must be { fn: function() {} }
```

### Array

```javascript
var arr = [1, 2, 3];

// Properties
arr.length

// Available methods (ES5 standard)
arr.toString()
arr.concat([4, 5])
arr.join(',')
arr.pop()
arr.push(4)
arr.reverse()
arr.shift()
arr.slice(0, 2)
arr.sort()
arr.splice(1, 1)
arr.unshift(0)
arr.indexOf(2)
arr.lastIndexOf(2)
arr.every(function(item) { return item > 0; })
arr.some(function(item) { return item > 2; })
arr.forEach(function(item, index) { })
arr.map(function(item) { return item * 2; })
arr.filter(function(item) { return item > 1; })
arr.reduce(function(acc, item) { return acc + item; }, 0)
arr.reduceRight(function(acc, item) { return acc + item; }, 0)
```

### Date (Special - use getDate())

```javascript
// ⚠️ CRITICAL: Cannot use new Date() - must use getDate()

var now = getDate();                           // Current date
var specific = getDate(1500000000000);         // From timestamp (ms)
var fromString = getDate('2023-01-15');        // From string

// ⚠️ iOS GOTCHA: Hyphenated dates fail on iOS!
// ❌ WRONG for iOS:
var bad = getDate('2023-01-15 12:00:00');      // NaN on iOS

// ✅ CORRECT cross-platform solution:
function parseDate(dateStr) {
  var regexp = getRegExp('-', 'g');
  return getDate(dateStr.replace(regexp, '/'));
}
var good = parseDate('2023-01-15 12:00:00');   // Works on iOS

// Available methods
date.getFullYear()
date.getMonth()      // 0-11
date.getDate()       // 1-31
date.getDay()        // 0-6 (Sunday=0)
date.getHours()
date.getMinutes()
date.getSeconds()
date.getMilliseconds()
date.getTime()       // Unix timestamp in ms
date.toDateString()
date.toTimeString()
date.toLocaleDateString()
date.toLocaleTimeString()
date.setFullYear(year)
date.setMonth(month)
date.setDate(day)
date.setHours(hours)
date.setMinutes(minutes)
date.setSeconds(seconds)
date.setMilliseconds(ms)
date.setTime(timestamp)
```

### RegExp (Special - use getRegExp())

```javascript
// ⚠️ CRITICAL: Cannot use /pattern/ or new RegExp() - must use getRegExp()

var regex = getRegExp('pattern');              // Basic
var regexFlags = getRegExp('pattern', 'gi');   // With flags

// Available flags: g (global), i (ignoreCase), m (multiline)

// Properties
regex.source       // The pattern string
regex.global       // Boolean
regex.ignoreCase   // Boolean
regex.multiline    // Boolean
regex.lastIndex    // Number

// Available methods
regex.exec(str)    // Returns array or null
regex.test(str)    // Returns boolean
```

### Function

```javascript
// ✅ CORRECT: Function expression
var add = function(a, b) {
  return a + b;
};

// ✅ CORRECT: Function declaration
function multiply(a, b) {
  return a * b;
}

// ✅ CORRECT: Closure
var counter = function() {
  var count = 0;
  return function() {
    count = count + 1;
    return count;
  };
};

// ✅ CORRECT: arguments keyword (limited support)
var sum = function() {
  var total = 0;
  for (var i = 0; i < arguments.length; i++) {
    total = total + arguments[i];
  }
  return total;
};

// ❌ WRONG: Arrow functions NOT supported
var bad = (x) => x * 2;           // ERROR
var bad2 = x => x * 2;            // ERROR
var bad3 = () => { return 1; };   // ERROR

// ❌ WRONG: Default parameters NOT supported
function bad(x = 1) { }           // ERROR

// ❌ WRONG: Rest parameters NOT supported
function bad(...args) { }         // ERROR

// ❌ WRONG: Destructuring parameters NOT supported
function bad({a, b}) { }          // ERROR
```

## Operators

### Arithmetic Operators

```javascript
var a = 10, b = 3;

a + b    // 13 (addition, also string concatenation)
a - b    // 7
a * b    // 30
a / b    // 3.333...
a % b    // 1 (modulo)

// Unary
+a       // 10 (unary plus)
-a       // -10 (unary minus)
```

### Comparison Operators

```javascript
a < b    // less than
a > b    // greater than
a <= b   // less than or equal
a >= b   // greater than or equal
a == b   // equality (with coercion)
a != b   // inequality (with coercion)
a === b  // strict equality (recommended)
a !== b  // strict inequality (recommended)
```

### Logical Operators

```javascript
a && b   // Logical AND
a || b   // Logical OR
!a       // Logical NOT
```

### Ternary Operator

```javascript
var result = condition ? valueIfTrue : valueIfFalse;
```

## Statements

### Conditional Statements

```javascript
// if-else
if (condition) {
  // statements
} else if (otherCondition) {
  // statements
} else {
  // statements
}

// switch
switch (expression) {
  case value1:
    // statements
    break;
  case value2:
    // statements
    break;
  default:
    // statements
}
```

### Loop Statements

```javascript
// for loop
for (var i = 0; i < 10; i++) {
  // statements
  if (condition) break;
  if (otherCondition) continue;
}

// while loop
while (condition) {
  // statements
}

// do-while loop
do {
  // statements
} while (condition);

// ❌ WRONG: for...in does NOT work reliably (especially on objects)
for (var key in obj) { }  // ERROR or unexpected behavior

// ❌ WRONG: for...of NOT supported (ES6)
for (var item of array) { }  // ERROR
```

## Built-in Library (Global Functions)

### Console

```javascript
console.log(value1, value2, ...)  // Output to console

// ⚠️ NOTE: Only console.log is supported
// ⚠️ NOTE: Consecutive duplicate logs are filtered out
// ⚠️ NOTE: Objects print as "[object Object]" - use JSON.stringify()

console.log(JSON.stringify(obj));  // To see object contents
```

### Math

```javascript
Math.E           // Euler's constant
Math.LN10        // Natural log of 10
Math.LN2         // Natural log of 2
Math.LOG10E      // Base 10 log of E
Math.LOG2E       // Base 2 log of E
Math.PI          // Pi
Math.SQRT1_2     // Square root of 1/2
Math.SQRT2       // Square root of 2

Math.abs(x)
Math.acos(x)
Math.asin(x)
Math.atan(x)
Math.atan2(y, x)
Math.ceil(x)
Math.cos(x)
Math.exp(x)
Math.floor(x)
Math.log(x)
Math.max(a, b, ...)
Math.min(a, b, ...)
Math.pow(base, exp)
Math.random()
Math.round(x)
Math.sin(x)
Math.sqrt(x)
Math.tan(x)
```

### JSON

```javascript
JSON.stringify(obj)    // Object to JSON string
JSON.parse(jsonStr)    // JSON string to object
```

### Number (Global)

```javascript
Number.MAX_VALUE
Number.MIN_VALUE
Number.NEGATIVE_INFINITY
Number.POSITIVE_INFINITY
```

### Date Creation

```javascript
getDate()              // Current date/time
getDate(milliseconds)  // From Unix timestamp
getDate(dateString)    // From string (use '/' not '-' for iOS)
getDate(year, month, day, hours, minutes, seconds, ms)
```

### RegExp Creation

```javascript
getRegExp(pattern)
getRegExp(pattern, flags)  // flags: 'g', 'i', 'm' or combinations
```
