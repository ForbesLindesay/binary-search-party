# binary-search-party

Asynchronous or Synchronous binary search.  This can be useful for seraching through really useless databases like a pipermail archive.  If you essentially just have a key value store and a list of keys that are known to be in order, you can efficiently search for a specific value using this module.

[![Build Status](https://img.shields.io/travis/ForbesLindesay/binary-search-party/master.svg)](https://travis-ci.org/ForbesLindesay/binary-search-party)
[![Dependency Status](https://img.shields.io/david/ForbesLindesay/binary-search-party.svg)](https://david-dm.org/ForbesLindesay/binary-search-party)
[![NPM version](https://img.shields.io/npm/v/binary-search-party.svg)](https://www.npmjs.org/package/binary-search-party)

## Installation

    npm install binary-search-party

## API

### Synchronous

```js
var search = require('binary-search-party')

var haystack = [1, 2, 3, 4, 5]
var needle = 4

var index = search(haystack, function (val) {
  if (val === needle) return 0
  if (val < needle) return -1
  if (val > needle) return +1
})
asssert(haystack[index] === needle)
```

### Asynchronous

```js
var search = require('binary-search-party')

var haystack = [1, 2, 3, 4, 5]
var needle = 4

search(haystack, function (val, callback) {
  if (val === needle) return callback(null, 0)
  if (val < needle) return callback(null, -1)
  if (val > needle) return callback(null, +1)
}, function (err, index) {
  if (err) throw err
  asssert(haystack[index] === needle)
})
```

### Promised

```js
var search = require('binary-search-party')

var haystack = [1, 2, 3, 4, 5]
var needle = 4

search(haystack, function (val) {
  if (val === needle) return Promise.resolve(0)
  if (val < needle) return Promise.resolve(-1)
  if (val > needle) return Promise.resolve(+1)
}).done(function (index) {
  asssert(haystack[index] === needle)
})
```

**N.B.** You will get back the type of promise returned by calling the comparison function.  This makes it easy to use your own promise library :)

**N.B.** If you pass an empty array, the comparison function can never be called so the result will be the literal number `-1`.  If the array might be empty and you rely on the result being a promise you should assimilate the result into being a promise using something like `Promise.resolve(search(arr, comparison))`

## License

  MIT
