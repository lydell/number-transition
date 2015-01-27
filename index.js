// Copyright 2015 Simon Lydell
// X11 (“MIT”) Licensed. (See LICENSE.)

function linear(x) { return x }

function transition(tick, options, callback) {
  options  = options  || {}
  callback = callback || Function.prototype
  var duration = get(options, "duration")
  var step     = get(options, "step")
  var from     = get(options, "from", 0)
  var to       = get(options, "to", 1)
  var timing   = get(options, "timing", linear)

  var delta = to - from
  var startTime = new Date().getTime()
  var aborted = false

  tick(function next() {
    if (aborted) return callback(true)

    var elapsed = new Date().getTime() - startTime
    var factor = Math.min(elapsed / duration, 1)
    step(from + delta * timing(factor))

    if (factor === 1)
      callback(false)
    else
      tick(next)
  })

  return function() {
    aborted = true
  }
}

function get(options, name, defaultValue) {
  var exists = (name in options)
  if (arguments.length === 2 && !exists)
    throw new Error(name + " is a required option")
  return (exists ? options[name] : defaultValue)
}

module.exports = transition
