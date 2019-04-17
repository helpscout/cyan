import React from 'react'
import ReactDOM from 'react-dom'
import { MemoryRouter as Router } from 'react-router'
import { Provider } from 'react-redux'
import cleanUp from './cleanUp'
import debug from './debug'
import { getStore } from './store'
import { runAllTimers } from './timers'
import { createRootNode } from './utils/render.utils'

export const wrapWithProvider = WrappedComponent => {
  const store = getStore()

  return (
    <Provider store={store}>
      <Router>{WrappedComponent}</Router>
    </Provider>
  )
}

const render = (WrappedComponent = null) => {
  // Create the root node for ReactDOM to mount to
  const root = createRootNode()
  document.body.appendChild(root)

  // Render the WrappedComponent into the root node
  ReactDOM.render(wrapWithProvider(WrappedComponent), root)

  runAllTimers()

  return {
    debug,
    html: debug,
    WrappedComponent,
    cleanUp,
  }
}

export default render
