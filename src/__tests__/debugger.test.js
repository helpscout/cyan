import React from 'react'
import Page from '@helpscout/hsds-react/components/Page'
import Heading from '@helpscout/hsds-react/components/Heading'
import { cy } from '../index'

jest.useFakeTimers()

test('Modal Demo Test', async () => {
  cy.render(
    <Page isResponsive>
      <Page.Card>
        <Heading>Hello</Heading>
      </Page.Card>
    </Page>,
  )

  await cy.inspect()

  expect(true).toBeTruthy()
})
