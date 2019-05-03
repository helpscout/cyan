/* global jasmine */
import React from 'react'
import Modal from '@helpscout/hsds-react/components/Modal'
import FormGroup from '@helpscout/hsds-react/components/FormGroup'
import Input from '@helpscout/hsds-react/components/Input'
import { cy } from '../index'
import { goGadgetGo } from '../inspector'

const rimraf = require('rimraf')
const path = require('path')
const { fork, spawn } = require('child_process')

jest.useFakeTimers()

/**
 * Caching the existing Jasmine timeout to be modified
 * and restored before/after every inspect call
 */
let _defaultTimeoutInterval = jasmine.DEFAULT_TIMEOUT_INTERVAL

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
})
afterEach(() => {
  jasmine.DEFAULT_TIMEOUT_INTERVAL = _defaultTimeoutInterval
})

const cleanUp = () => {
  rimraf.sync(path.join(process.cwd(), '/.cyan'))
}

const inspector = async process => {
  return new Promise(resolve => {
    process.on('exit', () => {
      cleanUp()
      resolve()
    })
  })
}

const inspect = async () => {
  jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000000

  goGadgetGo()

  const scriptpath = path.join(__dirname, '/../../brain')
  const brainProcess = fork(scriptpath)

  spawn('open', ['http://localhost:3000'], {
    stdio: 'inherit',
  })

  return await inspector(brainProcess)
}

test('Debugger', async () => {
  cy.render(
    <Modal isOpen>
      <Modal.Body>
        <div style={{ width: 400, height: 400 }}>
          <FormGroup>
            <Input label="First Name!!!!!!!!!!!!!!!!!!!!!" />
          </FormGroup>
          <FormGroup>
            <Input label="Last Name" />
          </FormGroup>
        </div>
      </Modal.Body>
    </Modal>,
  )

  await inspect()

  expect(true).toBeTruthy()
})

test('Debugger 2', async () => {
  cy.render(
    <FormGroup>
      <Input label="First Name!!!!!!!!!!!!!!!!!!!!!" />
    </FormGroup>,
  )

  await inspect()

  expect(true).toBeTruthy()

  await inspect()
})
