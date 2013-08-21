'use strict'

module.exports = search
function search(array, fn, callback) {
  if (array.length === 0) {
    //throw new Error('You cannot search within an empty array.')
  }
  var low = 0
  var high = array.length - 1
  var mid

  function iterate() {
    if (low > high) return result(-1, callback)
    mid = low + Math.floor(high - low / 2)
    return comparison(fn, array[mid], next, callback)
  }
  function next(cmp) {
    if (cmp < 0) { // too low
      low = mid + 1
      return iterate()
    } else if (cmp > 0) { //too high
      high = mid - 1
      return iterate()
    } else {
      return result(mid, callback)
    }
  }
  return iterate()
}
function result(val, callback) {
  if (typeof callback === 'function') {
    callback(null, val)
  } else {
    return val
  }
}
function comparison(fn, val, next, callback) {
  if (typeof callback === 'function') {
    fn(val, function (err, res) {
      if (err) return callback(err)
      next(res)
    })
  } else {
    var res = fn(val)
    if (res && (typeof res === 'function' || typeof res === 'object') && typeof res.then === 'function') {
      return res.then(next)
    } else {
      return next(res)
    }
  }
}