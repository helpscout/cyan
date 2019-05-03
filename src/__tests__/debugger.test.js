/* global jasmine */
const { spawn } = require('child_process')
const EventEmitter = require('events')

/**
 * Create an instance (singleton) of EventEmitter, which is
 * shared between the Browser/inspector process and the
 * cy.inspect() method.
 */
const sharedSingletonEmitter = new EventEmitter()

/**
 * Caching the existing Jasmine timeout to be modified
 * and restored before/after every inspect call
 */
let _defaultTimeoutInterval = jasmine.DEFAULT_TIMEOUT_INTERVAL
let interval

/**
 * Spawns a browser that is connected to the inspector.
 * This, in theory, opens a channel between the browser
 * inspector and the inspector() call.
 *
 * The inspector should resolve once the browser triggers
 * a "next" or "done event.
 */
const inspector = async () => {
  // spawn('open', ['https://www.google.ca'], { stdio: 'inherit' })
  let count = 0
  return new Promise(resolve => {
    sharedSingletonEmitter.on('tick', () => {
      count++
      if (count === 5) {
        resolve()
      }
    })
  })
}

/**
 * Setting up our inspector.
 *
 * The Jasmine timers have to be cached and reset here.
 * The inspector forces the timer to be super long, in order
 * to accomodate the debugging/inspect experience.
 *
 * We need to restore the timer to the original state to
 * ensure subsequent tests run as expected.
 */
beforeEach(() => {
  _defaultTimeoutInterval = jasmine.DEFAULT_TIMEOUT_INTERVAL
  interval = setInterval(() => {
    sharedSingletonEmitter.emit('tick')
  }, 1000)
})
afterEach(() => {
  jasmine.DEFAULT_TIMEOUT_INTERVAL = _defaultTimeoutInterval
  clearInterval(interval)
})

/**
 * The magical method that forces the super long Jasmine
 * timer, and fires up the inspector().
 */
const inspect = async () => {
  jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000000
  return await inspector()
}

const cy = {
  inspect,
}

test('Debugger', async () => {
  /**
   * In order to block Jest from running subsequent code,
   * we need to use async/await. I wish we didn't have to,
   * but I couldn't figure out another way.
   */
  await cy.inspect()
  expect(true).toBeTruthy()
})
