import React from 'react'
import { cy } from '../../index'

describe('render', () => {
  test('Can render null', () => {
    expect(cy.render()).toBeTruthy()
  })

  test('Can setProps after rendering', () => {
    const Base = ({ title }) => <span>{title}</span>
    const wrapper = cy.render(<Base title="Hello" />)

    expect(cy.get('span').text()).toBe('Hello')

    wrapper.setProps({ title: 'There' })

    expect(cy.get('span').text()).toBe('There')
  })

  test.only('Does not unmount previous Component', () => {
    const mountSpy = jest.fn()
    const unmountSpy = jest.fn()

    class Base extends React.Component {
      componentDidMount() {
        mountSpy()
      }

      componentWillUnmount() {
        unmountSpy()
      }

      render() {
        const { title } = this.props
        return <span>{title}</span>
      }
    }

    const wrapper = cy.render(<Base title="Hello" />)

    expect(mountSpy).toHaveBeenCalled()
    expect(unmountSpy).not.toHaveBeenCalled()
    expect(cy.get('span').text()).toBe('Hello')

    wrapper.setProps({ title: 'There' })
    expect(cy.get('span').text()).toBe('There')
    expect(unmountSpy).not.toHaveBeenCalled()

    wrapper.setProp('title', 'Howdy')
    expect(cy.get('span').text()).toBe('Howdy')
    expect(unmountSpy).not.toHaveBeenCalled()
  })
})
