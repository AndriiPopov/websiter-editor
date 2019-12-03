import React from 'react'

import { render, cleanup } from 'react-testing-library'
import renderer from 'react-test-renderer'

import { BigButtonWithRadio } from './BigButtonWithRadio'

afterEach(cleanup)

test('BigButtonWithRadio can be rendered with title and icon', () => {
    // Arrange
    const container = render(
        <BigButtonWithRadio
            title="MyButton"
            icon='<svg height="30" viewBox="0 0 24 24" width="30"><path d="M0 0h24v24H0z" fill="none"></path><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"></path></svg>'
            checked={false}
            clicked={() => {}}
        />
    )
    const { getByText, getByTestId } = container
    // Act
    // Assert
    expect(getByText('MyButton')).toBeDefined()
    expect(getByTestId('checkbox').checked).toBe(false)
})

test('BigButtonWithRadio can be rendered without title and icon', () => {
    // Arrange
    const container = render(<BigButtonWithRadio />)
    const { getByTestId } = container
    // Act
    // Assert
    expect(getByTestId('MyButton')).toBeDefined()
})

test('BigButtonWithRadio can be rendered with title and icon', () => {
    // Arrange
    const container = render(
        <BigButtonWithRadio
            title="MyButton"
            icon='<svg height="30" viewBox="0 0 24 24" width="30"><path d="M0 0h24v24H0z" fill="none"></path><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"></path></svg>'
            checked={true}
            clicked={() => {}}
        />
    )
    const { getByText, getByTestId } = container
    // Act
    // Assert
    expect(getByText('MyButton')).toBeDefined()
    expect(getByTestId('checkbox').checked).toBe(true)
})

test('Snapshot BigButtonDropDown', () => {
    //Arrange
    const containerSS = renderer.create(
        <BigButtonWithRadio
            title="MyButton"
            icon='<svg height="30" viewBox="0 0 24 24" width="30"><path d="M0 0h24v24H0z" fill="none"></path><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"></path></svg>'
            checked={true}
            clicked={() => {}}
        />
    )
    //Assert
    expect(containerSS.toJSON()).toMatchInlineSnapshot(`
<button
  className="Button"
  data-testid="MyButton"
  onClick={[Function]}
>
  <table
    className="Table"
  >
    <tbody>
      <tr>
        <td>
          <svg
            data-testid="svg"
            height="30"
            viewBox="0 0 24 24"
            width="30"
          >
            <path
              d="M0 0h24v24H0z"
              fill="none"
            />
            <path
              d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"
            />
          </svg>
        </td>
      </tr>
      <tr>
        <td>
          <input
            checked={true}
            data-testid="checkbox"
            onChange={[Function]}
            type="radio"
          />
          MyButton
        </td>
      </tr>
    </tbody>
  </table>
</button>
`)
})
