'use strict'

var assert = require('assert')
var promise = require('promise')
var search = require('../')

function testit(testcase, isPromise) {
  function multiple(done) {
    var calls = 0
    return function () {
      calls++
      return function (err) {
        if (err) return done(err)
        setImmediate(function () {
          calls--
          if (calls === 0) {
            done(err)
          }
        }, 0)
      }
    }
  }
  var itempty = it
  if (isPromise) {
    itempty = it.skip
  }
  itempty('handles empty arrays', function (done) {
    done = multiple(done)

    testcase([], function (val) { return val - 2 }, -1, done())
    testcase([], function (val) { return val - 0 }, -1, done())
  })
  it('handles singleton arrays', function (done) {
    done = multiple(done)
    testcase([1], function (val) { return val - 1 }, 0, done())

    testcase([1], function (val) { return val - 2 }, -1, done())
    testcase([1], function (val) { return val - 0 }, -1, done())
  })
  it('handles arrays of length 2', function (done) {
    done = multiple(done)
    testcase([1, 2], function (val) { return val - 1 }, 0, done())
    testcase([1, 2], function (val) { return val - 2 }, 1, done())

    testcase([1, 2], function (val) { return val - 0 }, -1, done())
    testcase([1, 2], function (val) { return val - 3 }, -1, done())
  })
  it('handles arrays of length 3', function (done) {
    done = multiple(done)
    testcase([1, 2, 3], function (val) { return val - 1 }, 0, done())
    testcase([1, 2, 3], function (val) { return val - 2 }, 1, done())
    testcase([1, 2, 3], function (val) { return val - 3 }, 2, done())

    testcase([1, 2, 3], function (val) { return val - 0 }, -1, done())
    testcase([1, 2, 3], function (val) { return val - 4 }, -1, done())
  })
  it('handles arrays of length 4', function (done) {
    done = multiple(done)
    testcase([1, 2, 3, 4], function (val) { return val - 1 }, 0, done())
    testcase([1, 2, 3, 4], function (val) { return val - 2 }, 1, done())
    testcase([1, 2, 3, 4], function (val) { return val - 3 }, 2, done())
    testcase([1, 2, 3, 4], function (val) { return val - 4 }, 3, done())

    testcase([1, 2, 3, 4], function (val) { return val - 0 }, -1, done())
    testcase([1, 2, 3, 4], function (val) { return val - 5 }, -1, done())
  })
}

describe('synchronous', function () {
  testit(function (array, fn, expected, callback) {
    assert.equal(search(array, fn), expected)
    callback()
  })
})
describe('asynchronous', function () {
  testit(function (array, fn, expected, callback) {
    search(array, function (val, cb) {
      setImmediate(function () {
        cb(null, fn(val))
      })
    }, function (err, res) {
      if (err) return callback(err)
      assert.equal(res, expected)
      callback()
    })
  })
})
describe('promised', function () {
  testit(function (array, fn, expected, callback) {
    search(array, function (val, cb) {
      return promise.from(fn(val))
    })
    .nodeify(function (err, res) {
      if (err) return callback(err)
      assert.equal(res, expected)
      callback()
    })
  }, true)
})