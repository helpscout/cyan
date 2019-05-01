import invariant from 'invariant'
import commands from '../commands'
import { get, getByText } from '../utils/selector.utils'
import { withCommands } from '../utils/command.utils'

export class Cyan {
  el = []
  length = 0

  constructor(el) {
    if (el) {
      this.get(el)
    }
  }

  // QuerySelectors
  get(selector) {
    this.el = get(selector)
    this.length = this.el.length
    return this
  }

  getByCy(selector) {
    this.get(`[data-cy=${selector}]`)
    return this
  }

  getByText(text) {
    this.get(getByText(text, this.getNode()))
    return this
  }

  // (Base) Getters
  getEl() {
    return this.el
  }

  getNodes() {
    return this.getEl()
  }

  getNode() {
    return this.getEl()[0]
  }

  __getNode(fn, selector) {
    const el = this.getNode()
    if (selector) {
      invariant(el, `Base selector does not exist to .${fn}('${selector}')`)
    } else {
      invariant(el, `Base selector does not exist for .(${fn})`)
    }
    return el
  }
}

withCommands(commands)(Cyan)

export default Cyan
