// Copyright 2015 Simon Lydell
// X11 (“MIT”) Licensed. (See LICENSE.)

var test = require("tape")

var transition = require("../")

function tick(fn) { setTimeout(fn, 5) }

function testThrows(t, tick, options, callback) {
  t["throws"](function() { transition(tick, options, callback) })
}

function Collector(from, to) {
  this.from = from
  this.to = to
  this.values = []
}
Collector.prototype.push = function(value) {
  this.values.push(value)
}
Collector.prototype.assert = function(t, check) {
  // Plan 3 tests if using this method!
  t.ok(this.values.length >= 1)
  var values = [this.from].concat(this.values)
  var ok = true
  for (var index = 1; index < values.length; index++) {
    if (!check(values[index - 1], values[index])) ok = false
  }
  t.equal(ok, true)
  if (this.to == null)
    t.pass()
  else
    t.equal(values.pop(), this.to)
}

test("is a function", function(t) {
  t.plan(1)
  t.equal(typeof transition, "function")
})


test("basic operation", function(t) {
  t.plan(4)
  var values = new Collector(0, 1)
  transition(tick, {
    duration: 20,
    step: function(value) {
      values.push(value)
    }
  }, function(aborted) {
    t.equal(aborted, false)
    values.assert(t, function(a, b) { return a < b })
  })
})


test("custom from and to", function(t) {
  t.plan(3)
  var values = new Collector(5, 0)
  transition(tick, {
    from: 5,
    to: 0,
    duration: 20,
    step: function(value) {
      values.push(value)
    }
  }, function(value) {
    values.assert(t, function(a, b) { return a > b })
  })
})


test("custom timing", function(t) {
  t.plan(6)
  var xs = new Collector(0, 1)
  var values = new Collector(5, 5)
  transition(tick, {
    from: 5,
    to: 10,
    duration: 20,
    timing: function(x) {
      xs.push(x)
      return 0
    },
    step: function(value) {
      values.push(value)
    }
  }, function() {
    xs.assert(t, function(a, b) { return a < b })
    values.assert(t, function(a) { return a === 5 })
  })
})


test("abort", function(t) {
  t.plan(4)
  var values = new Collector(0)
  var abort = transition(tick, {
    from: 1,
    to: 4,
    duration: 20,
    step: function(value) {
      values.push(value)
    },
  }, function(aborted) {
    t.equal(aborted, true)
    values.assert(t, function(a) { return a < 4 })
  })
  setTimeout(abort, 10)
})


test("is always async", function(t) {
  t.plan(1)
  var isAsync = false
  transition(tick, {
    duration: 0,
    step: Function.prototype
  }, function() {
    t.equal(isAsync, true)
  })
  isAsync = true
})


test("erraneous tick", function(t) {
  t.plan(1)
  testThrows(t, null, {duration: 0, step: Function.prototype})
})


test("missing required options", function(t) {
  t.plan(4)
  testThrows(t, tick)
  testThrows(t, tick, {})
  testThrows(t, tick, {step: Function.prototype})
  testThrows(t, tick, {duration: 0})
})


if (typeof requestAnimationFrame === "function") {
  test("requestAnimationFrame", function(t) {
    t.plan(4)
    var values = new Collector(0, 1)
    transition(requestAnimationFrame, {
      duration: 20,
      step: function(value) {
        values.push(value)
      }
    }, function(aborted) {
      t.equal(aborted, false)
      values.assert(t, function(a, b) { return a < b })
    })
  })
}
