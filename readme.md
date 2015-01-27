Overview [![Build Status](https://travis-ci.org/lydell/number-transititon.svg?branch=master)](https://travis-ci.org/lydell/number-transititon)
========

[![browser support](https://ci.testling.com/lydell/number-transition.png)](https://ci.testling.com/lydell/number-transition)

Transition from one number to another during a given duration.

```js
var transition = require("number-transition")

function tick(fn) { setTimeout(fn, 20) }

transition(tick, {from: 1, to: 5, duration: 100, step: console.log})

// Something like the following will be logged at an interval of about 20ms:
// 3.0700000000000003
// 5.2299999999999995
// 7.12
// 9.01
// 10
```

Inspired by [kamicane/transtion], but more transition-like than animation-like,
with better browser support and no dependencies.

[kamicane/transtion]: https://github.com/kamicane/transition


Installation
============

`npm install number-transititon`

```js
var transition = require("number-transititon")

// Possibly:
var transition = require("number-transititon").bind(null, requestAnimationFrame)
```

Usage
=====

`var abort = transition(tick, options, [callback])`
---------------------------------------------------

`transition` transitions from `options.from` to `options.to` in
`options.duration` milliseconds by calling `options.step(value)` each `tick`,
where `value` is the current transitional value. By default the transition is
linear, but that can be changed by passing a different timing function as
`options.timing`.

`tick(fn)` is an asyncronous function that calls `fn`. `requestAnimationFrame`
is a good choice. `tick` is the first argument (and not an option), so that you
could easily `.bind()` it (as in the example above).

`options`:

- from: `Number`. Defaults to `0`.
- to: `Number`. Defaults to `1`.
- timing: `Function`. Defaults to a linear function. It receives the amount of
  elapsed time as a number from 0 to 1. It should return a number as well.
- duration: `Number`. Required. The number of milliseconds that the transition
  should last. The transition runs _at least_ this many milliseconds, but may
  run for longer depending on how `tick` is implemented.
- step: `Function`. Required. Receives the current transitional value and lets
  you do something with it.

If available, `callback(false)` is called when the transition finishes.

Calling the returned `abort` function aborts the transition and calls
`callback(true)`. (In other words, the argument passed to `callback` indicates
whether the transition was aborted or not.)


License
=======

[The X11 (“MIT”) License](LICENSE).
