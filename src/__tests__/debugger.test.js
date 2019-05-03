import React from 'react'
import Button from '@helpscout/hsds-react/components/Button'
import { cy } from '../index'

jest.useFakeTimers()

test('Modal Demo Test', async () => {
  cy.render(
    <Button version={2} kind="primary" size="lg">
      Hello
    </Button>,
  )

  await cy.inspect()

  expect(true).toBeTruthy()
})
