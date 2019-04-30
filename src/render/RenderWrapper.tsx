import * as React from 'react'
import ReactDOM from 'react-dom'
import cleanUp from '../cleanUp'
import debug from '../debug'
import { runAllTimers } from '../timers'
import wrapWithProvider from './wrapWithProvider'
import { createRootNode } from '../utils/render.utils'

class RenderWrapper {
  Component: any
  WrappedComponent: any
  root: HTMLElement

  constructor(Component = null) {
    this.Component = Component
    // Create the root node for ReactDOM to mount to
    this.root = createRootNode()
    document.body.appendChild(this.root)

    // Render the WrappedComponent into the root node
    this.WrappedComponent = wrapWithProvider(Component)

    runAllTimers()
    this.render()

    return this
  }

  debug() {
    debug()
    return this
  }

  html() {
    this.debug()
    return this
  }

  cleanUp() {
    cleanUp()
    return this
  }

  setProps(props = {}) {
    this.render(props)
    return this
  }

  setProp(prop = '', value) {
    this.setProps({ [prop]: value })
    return this
  }

  render(props = {}) {
    const Component = this.WrappedComponent
    ReactDOM.render(<Component {...props} />, this.root)
    return this
  }
}

export default RenderWrapper
