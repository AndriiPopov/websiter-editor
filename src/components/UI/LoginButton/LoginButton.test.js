import React from 'react'
import { render, cleanup } from 'react-testing-library'
import renderer from 'react-test-renderer'
import 'jest-dom/extend-expect'

import LoginButton from './LoginButton'

afterEach(cleanup)

test('LoginButton can be rendered with title, function and icon', () => {
    // Arrange
    const container = render(
        <LoginButton
            disabled={true}
            title="MyButton"
            btnType="Success"
            onClick={() => {}}
        >
            MyButton
        </LoginButton>
    )
    const { getByText } = container
    // Act
    // Assert
    expect(getByText('MyButton')).toBeDefined()
    expect(getByText('MyButton')).toHaveClass('Success')
})

test('Snapshot LoginButton', () => {
    //Arrange
    const containerSS = renderer.create(
        <LoginButton
            disabled={true}
            title="MyButton"
            btnType="Success"
            onClick={() => {}}
        >
            MyButton
        </LoginButton>
    )
    //Assert
    expect(containerSS.toJSON()).toMatchInlineSnapshot(`
<button
  className="Button Success"
  data-testid="LoginButton"
  disabled={true}
>
  MyButton
</button>
`)
})
