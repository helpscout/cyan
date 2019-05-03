/* global jasmine */
import React from 'react'
import Page from '@helpscout/hsds-react/components/Page'
import Input from '@helpscout/hsds-react/components/Input'
import { cy } from '../index'
import { getDocumentHTML } from '../utils/render.utils'
import { getDocumentCSS } from '../utils/css.utils'

const fs = require('fs')
const path = require('path')
const { fork, spawn } = require('child_process')
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
const inspector = async process => {
  return new Promise(resolve => {
    process.on('exit', resolve)
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

const generateHTML = () => {
  const css = getDocumentCSS()
  const html = getDocumentHTML()
  const template = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Inspector</title>
        <style>${css}</style>
      </head>
      <body>
        ${html}
        <pre>
        <textarea>
        ${html}
        </textarea>
        </pre>
      </body>
    </html>
  `
  const filepath = path.join(__dirname, 'index.html')
  fs.writeFileSync(filepath, template)
}

/**
 * The magical method that forces the super long Jasmine
 * timer, and fires up the inspector().
 */
const inspect = async () => {
  jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000000
  generateHTML()
  const filepath = path.join(__dirname, 'index.html')
  const scriptpath = path.join(__dirname, '/../../brain')
  const brainProcess = fork(scriptpath)
  spawn('open', [`http://localhost:3000?file=${filepath}`], {
    stdio: 'inherit',
  })
  return await inspector(brainProcess)
}

test('Debugger', async () => {
  const wrapper = cy.render(<Input label="Hello" />)

  wrapper.setProps({ value: 'Nickolas and Q' })
  /**
   * In order to block Jest from running subsequent code,
   * we need to use async/await. I wish we didn't have to,
   * but I couldn't figure out another way.
   */
  await inspect()
  expect(true).toBeTruthy()
})
