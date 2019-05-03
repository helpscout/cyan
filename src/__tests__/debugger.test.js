/* global jasmine */
import React from 'react'
import Modal from '@helpscout/hsds-react/components/Modal'
import Input from '@helpscout/hsds-react/components/Input'
import { cy } from '../index'
import { goGadgetGo } from '../inspector'

jest.useFakeTimers()

test('Debugger', () => {
  cy.render(
    <Modal isOpen>
      <Modal.Body>
        <div style={{ width: 400, height: 400 }}>
          <Input label="First Name" />
        </div>
      </Modal.Body>
    </Modal>,
  )
  goGadgetGo()

  expect(true).toBeTruthy()
})
