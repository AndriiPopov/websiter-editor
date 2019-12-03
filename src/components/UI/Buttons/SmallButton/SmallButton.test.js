import React from 'react'
import { render, cleanup } from 'react-testing-library'
import renderer from 'react-test-renderer'

import { SmallButton } from './SmallButton'

afterEach(cleanup)

test('SmallButton can be rendered with title, function and icon', () => {
    // Arrange
    const container = render(
        <SmallButton
            title="MyButton"
            buttonClicked={() => {}}
            icon='<svg height="30" viewBox="0 0 24 24" width="30"><path d="M0 0h24v24H0z" fill="none"></path><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"></path></svg>'
        />
    )
    const { getByText } = container
    // Act
    // Assert
    expect(getByText('MyButton')).toBeDefined()
})

test('SmallButton can be rendered with title, function and without icon', () => {
    // Arrange
    const container = render(
        <SmallButton title="MyButton" buttonClicked={() => {}} />
    )
    const { getByText } = container
    // Act
    // Assert
    expect(getByText('MyButton')).toBeDefined()
})

test('SmallButton can be rendered with function and without icon and title', () => {
    // Arrange
    const container = render(<SmallButton buttonClicked={() => {}} />)
    const { getByTestId } = container
    // Act
    // Assert
    expect(getByTestId('MyButton')).toBeDefined()
})

test('Snapshot SmallButton', () => {
    //Arrange
    const containerSS = renderer.create(
        <SmallButton
            title="MyButton"
            buttonClicked={() => {}}
            icon='<svg height="30" viewBox="0 0 24 24" width="30"><path d="M0 0h24v24H0z" fill="none"></path><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"></path></svg>'
        />
    )
    //Assert
    expect(containerSS.toJSON()).toMatchInlineSnapshot(`
<button
  className="Button "
  data-testid="MyButton"
  onClick={[Function]}
>
  <table
    className="Table"
  >
    <tbody>
      <tr>
        <td
          className="Cell"
        >
          <svg
            className="Svg"
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
        <td
          className="Cell"
        >
          MyButton
        </td>
      </tr>
    </tbody>
  </table>
</button>
`)
})
